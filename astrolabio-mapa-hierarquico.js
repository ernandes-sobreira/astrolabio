/*
 * ASTROLÁBIO — mapa acadêmico em três escalas geográficas
 * Brasil → Unidade(s) da Federação → Município(s) e pontos de pesquisa
 *
 * INSTALAÇÃO: carregar este arquivo com `defer`, APÓS `astrolabio-avancado.js`.
 * Compatibilidade: não altera o esquema JSON, as dez estações ou o exportador Word.
 * Fonte cartográfica: IBGE, API de Malhas Geográficas v3 (GeoJSON).
 * Não há contornos esquemáticos nem dados de teste inseridos na versão publicada.
 */
(function () {
  'use strict';

  const base = window.ASTRO_FIGURAS;
  if (!base || typeof base.geometriaSelecionada !== 'function' || typeof base.desenharMapa !== 'function') {
    console.error('[Astrolábio] A extensão hierárquica precisa ser carregada depois de astrolabio-avancado.js.');
    return;
  }

  const IBGE = 'https://servicodados.ibge.gov.br/api/v3/malhas';
  const cache = new Map();
  const originalGeometrias = base.geometriaSelecionada.bind(base);
  const originalDesenhar = base.desenharMapa.bind(base);
  const CORES = {
    tinta: '#113849', texto: '#395864', fundo: '#FFFFFF', papel: '#F4F8F7',
    borda: '#CCD8D9', brasil: '#DEE6E7', estado: '#B7D5D4',
    estadoAtivo: '#B9703D', municipio: '#A4CFBF', municipioAtivo: '#C57948',
    municipiosAlternados: ['#C9E2D8', '#BBD6D3', '#DCE8D4', '#D9DDD5', '#E8DACF'],
    rio: '#B9D8E1', ponto: '#8D392B', branco: '#FFFFFF'
  };

  const limparNome = value => String(value || '').trim();

  /** O IBGE fornece polígonos, multipolígonos e eventualmente coleções. */
  function geometrias(input) {
    if (!input || typeof input !== 'object') return [];
    if (input.type === 'Feature') return geometrias(input.geometry);
    if (input.type === 'FeatureCollection') return (input.features || []).flatMap(geometrias);
    if (input.type === 'GeometryCollection') return (input.geometries || []).flatMap(geometrias);
    if (input.type === 'Polygon') return [input.coordinates || []];
    if (input.type === 'MultiPolygon') return input.coordinates || [];
    return [];
  }
  function pontosDoGeo(geo, callback) {
    for (const polygon of geometrias(geo)) {
      for (const ring of polygon) {
        if (!Array.isArray(ring)) continue;
        for (const coord of ring) {
          const lon = Number(coord && coord[0]);
          const lat = Number(coord && coord[1]);
          if (Number.isFinite(lon) && Number.isFinite(lat)) callback(lon, lat);
        }
      }
    }
  }
  function limites(geos, outros) {
    const b = {minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity};
    function push(x, y) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      b.minX = Math.min(b.minX, x); b.maxX = Math.max(b.maxX, x);
      b.minY = Math.min(b.minY, y); b.maxY = Math.max(b.maxY, y);
    }
    (geos || []).forEach(g => pontosDoGeo(g, push));
    (outros || []).forEach(p => push(Number(p.lng), Number(p.lat)));
    if (b.minX === Infinity) return null;
    if (b.minX === b.maxX) {b.minX -= 0.08; b.maxX += 0.08;}
    if (b.minY === b.maxY) {b.minY -= 0.08; b.maxY += 0.08;}
    return b;
  }
  function buscar(url) {
    if (!cache.has(url)) {
      cache.set(url, (async () => {
        const resp = await fetch(url, {headers: {'Accept': 'application/vnd.geo+json'}});
        if (!resp.ok) throw new Error('IBGE não retornou a malha geográfica (HTTP ' + resp.status + ').');
        const geojson = await resp.json();
        if (!geometrias(geojson).length) throw new Error('O IBGE não retornou polígonos válidos.');
        return geojson;
      })().catch(err => {cache.delete(url); throw err;}));
    }
    return cache.get(url);
  }
  const endpoint = (tipo, id) => IBGE + '/' + tipo + '/' + encodeURIComponent(id) +
    '?formato=application%2Fvnd.geo%2Bjson&qualidade=minima';

  // Mantém intacto o array original de municípios, acrescentando somente o contexto
  // cartográfico durante a geração. Esse array é usado tanto na prévia quanto no DOCX.
  base.geometriaSelecionada = async function () {
    const selecionados = await originalGeometrias();
    if (!Array.isArray(selecionados) || !selecionados.length) return selecionados;
    const siglas = [...new Set(selecionados.map(v => String(v.municipio?.uf || '').toUpperCase()))];
    if (siglas.some(s => !/^[A-Z]{2}$/.test(s))) {
      throw new Error('UF inválida em algum município selecionado.');
    }
    const [pais, estados] = await Promise.all([
      buscar(endpoint('paises', 'BR')),
      Promise.all(siglas.map(async uf => ({uf, geojson: await buscar(endpoint('estados', uf))})))
    ]);
    selecionados.contextoIBGE = {pais, estados};
    return selecionados;
  };

  function projeto(geoBounds, box, padding = 0.08) {
    const meioX = (geoBounds.minX + geoBounds.maxX) / 2;
    const meioY = (geoBounds.minY + geoBounds.maxY) / 2;
    const latitudeC = meioY * Math.PI / 180;
    const cos = Math.max(0.15, Math.cos(latitudeC));
    const largura = Math.max(0.01, (geoBounds.maxX - geoBounds.minX) * cos);
    const altura = Math.max(0.01, geoBounds.maxY - geoBounds.minY);
    const fator = Math.min(box.w / (largura * (1 + 2 * padding)), box.h / (altura * (1 + 2 * padding)));
    return {
      cos, fator, meioX, meioY,
      x: (lon) => box.x + box.w / 2 + (lon - meioX) * cos * fator,
      y: (lat) => box.y + box.h / 2 - (lat - meioY) * fator
    };
  }
  function trilhas(ctx, dados, trans) {
    for (const poly of geometrias(dados)) {
      for (const ring of poly) {
        if (!Array.isArray(ring) || !ring.length) continue;
        let iniciado = false;
        for (const coord of ring) {
          const lon = Number(coord[0]), lat = Number(coord[1]);
          if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
          if (!iniciado) {ctx.moveTo(trans.x(lon), trans.y(lat)); iniciado = true;}
          else ctx.lineTo(trans.x(lon), trans.y(lat));
        }
        if (iniciado) ctx.closePath();
      }
    }
  }
  function forma(ctx, geo, tr, preenchimento, linha, grossura = 1.5) {
    ctx.beginPath(); trilhas(ctx, geo, tr);
    ctx.fillStyle = preenchimento; ctx.fill('evenodd');
    ctx.strokeStyle = linha; ctx.lineWidth = grossura; ctx.stroke();
  }
  function moldura(ctx, b) {
    ctx.fillStyle = CORES.papel;ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = CORES.borda;ctx.lineWidth = 1.2;ctx.strokeRect(b.x, b.y, b.w, b.h);
  }
  function texto(ctx, s, x, y, opt = {}) {
    ctx.fillStyle = opt.cor || CORES.tinta;
    ctx.font = (opt.peso || '400') + ' ' + (opt.tamanho || 18) + 'px ' + (opt.fonte || 'Arial, sans-serif');
    ctx.textAlign = opt.alinha || 'left';
    ctx.textBaseline = opt.base || 'alphabetic';
    if (opt.largura !== undefined) ctx.fillText(String(s), x, y, opt.largura);
    else ctx.fillText(String(s), x, y);
  }
  function painelTitulo(ctx, numero, s, b) {
    texto(ctx, numero + ' · ' + s, b.x + 16, b.y + 29, {peso: '700', tamanho: 19, cor: CORES.tinta});
    ctx.strokeStyle = CORES.borda;ctx.lineWidth = 1;
    ctx.beginPath();ctx.moveTo(b.x + 16, b.y + 43);ctx.lineTo(b.x + b.w - 16, b.y + 43);ctx.stroke();
  }
  function circular(ctx, x, y, numero, pequeno = false) {
    ctx.beginPath();ctx.arc(x, y, pequeno ? 12 : 15, 0, Math.PI * 2);
    ctx.fillStyle = CORES.ponto;ctx.fill();
    ctx.strokeStyle = CORES.branco;ctx.lineWidth = 2;ctx.stroke();
    texto(ctx, numero, x, y + (pequeno ? 4 : 5), {
      peso: '700', tamanho: pequeno ? 12 : 15, alinha: 'center', cor: '#FFFFFF'
    });
  }
  function areaMedia(geo) {
    // Para rótulo cartográfico sem presumir município onde a malha possui partes distantes,
    // localiza um centróide aproximado a partir do anel exterior de maior área.
    let selecionado = null, maior = -1;
    for (const poligono of geometrias(geo)) {
      const anel = poligono[0]; if (!anel || anel.length < 3) continue;
      let area = 0, cx = 0, cy = 0;
      for (let i = 0; i < anel.length - 1; i++) {
        const p = anel[i], q = anel[i + 1];
        const cross = p[0] * q[1] - q[0] * p[1];
        area += cross;cx += (p[0] + q[0]) * cross;cy += (p[1] + q[1]) * cross;
      }
      if (Math.abs(area) > maior) {
        const v = Math.abs(area) > 1e-10 ? [cx / (3 * area), cy / (3 * area)] : [anel[0][0], anel[0][1]];
        selecionado = v; maior = Math.abs(area);
      }
    }
    if (selecionado && selecionado.every(Number.isFinite)) return selecionado;
    const bb = limites([geo]);return bb ? [(bb.minX + bb.maxX) / 2, (bb.minY + bb.maxY) / 2] : [0, 0];
  }
  function norte(ctx, x, y) {
    texto(ctx, 'N', x, y - 16, {alinha: 'center', peso: '700', tamanho: 17});
    ctx.fillStyle = CORES.tinta;
    ctx.beginPath();ctx.moveTo(x, y - 10);ctx.lineTo(x - 8, y + 16);
    ctx.lineTo(x, y + 9);ctx.lineTo(x + 8, y + 16);ctx.closePath();ctx.fill();
  }
  function escala(ctx, trans, x, y, maxWidth) {
    // Projeção equiretangular local: a escala gráfica é aproximada, não instrumento geodésico.
    const kmAlvo = 0.19 * maxWidth * 111.32 / trans.fator;
    if (!(kmAlvo > 0)) return;
    const ordem = Math.pow(10, Math.floor(Math.log10(kmAlvo)));
    const km = [5, 2, 1].map(m => m * ordem).find(v => v <= kmAlvo) || ordem;
    const largura = km * trans.fator / 111.32;
    ctx.lineWidth = 4;ctx.strokeStyle = CORES.tinta;ctx.beginPath();ctx.moveTo(x, y);ctx.lineTo(x + largura, y);ctx.stroke();
    ctx.lineWidth = 2;ctx.beginPath();ctx.moveTo(x, y - 6);ctx.lineTo(x, y + 6);
    ctx.moveTo(x + largura, y - 6);ctx.lineTo(x + largura, y + 6);ctx.stroke();
    texto(ctx, '0', x, y - 10, {tamanho: 14});
    texto(ctx, km.toLocaleString('pt-BR') + ' km', x + largura, y - 10, {tamanho: 14, alinha: 'center'});
  }
  function limitarTexto(s, maxLen) {
    const t = String(s || ''); return t.length > maxLen ? t.slice(0, maxLen - 1) + '…' : t;
  }
  function linhaLeg(ctx, x, y, label, cor, largura = 290) {
    ctx.fillStyle = cor;ctx.fillRect(x, y - 11, 15, 15);
    texto(ctx, limitarTexto(label, 47), x + 23, y + 2, {tamanho: 16, largura});
  }

  function desenharHierarquia(canvas, geos, config) {
    if (!geos?.length) return originalDesenhar(canvas, geos || [], config || {});
    if (!geos.contextoIBGE?.pais || !geos.contextoIBGE?.estados?.length) {
      throw new Error('Contexto geográfico do IBGE não carregado; o mapa não será improvisado.');
    }
    const ctx = canvas.getContext('2d');if (!ctx) throw new Error('Navegador sem Canvas 2D.');
    const sx = canvas.width / 1200, sy = canvas.height / 760;
    ctx.save();
    try {
      ctx.scale(sx, sy);
      ctx.fillStyle = '#FFFFFF';ctx.fillRect(0, 0, 1200, 760);
      const est = geos.contextoIBGE.estados;
      const siglas = est.map(e => e.uf);
      const tituloEstado = siglas.length === 1 ? ({MT:'MATO GROSSO'}[siglas[0]] || 'ESTADO: ' + siglas[0]) : 'ESTADOS SELECIONADOS';
      const subtitulo = siglas.length === 1 ? 'BRASIL  ›  ' + tituloEstado + '  ›  MUNICÍPIOS' :
        'BRASIL  ›  UNIDADES DA FEDERAÇÃO  ›  MUNICÍPIOS';
      texto(ctx, 'LOCALIZAÇÃO DA ÁREA DE ESTUDO', 48, 51, {peso:'700',tamanho:30,fonte:'Georgia, serif'});
      texto(ctx, subtitulo, 50, 81, {tamanho:16,cor:CORES.texto});
      const BR = {x:48,y:109,w:310,h:235};
      const UF = {x:48,y:357,w:310,h:295};
      const DET = {x:371,y:109,w:780,h:543};
      [BR, UF, DET].forEach(b => moldura(ctx,b));
      painelTitulo(ctx,'1','BRASIL',BR);
      painelTitulo(ctx,'2',tituloEstado,UF);
      painelTitulo(ctx,'3','MUNICÍPIOS / PONTOS',DET);

      // Escala nacional — a geometria do Brasil e o destaque das UFs vêm exclusivamente do IBGE.
      const brasilGeo = geos.contextoIBGE.pais;
      const brasilBounds = limites([brasilGeo]);
      const trBr = projeto(brasilBounds, {x:BR.x+24,y:BR.y+53,w:BR.w-48,h:BR.h-73},0.04);
      forma(ctx,brasilGeo,trBr,CORES.brasil,'#9EADB3',1.1);
      est.forEach(e => {
        forma(ctx,e.geojson,trBr,CORES.estadoAtivo,CORES.branco,1.2);
      });
      const brSel = est.length === 1 ? est[0].uf : est.map(x=>x.uf).join(', ');
      texto(ctx,'UF em destaque: '+brSel,BR.x+17,BR.y+BR.h-12,{peso:'700',tamanho:14,cor:CORES.texto});

      // Escala estadual — mostra os limites de Mato Grosso (ou todas as UFs da pesquisa).
      const trUF = projeto(limites(est.map(x=>x.geojson)),
        {x:UF.x+19,y:UF.y+56,w:UF.w-38,h:UF.h-90},0.08);
      est.forEach(e => forma(ctx,e.geojson,trUF,CORES.estado,'#4D7980',1.4));
      geos.forEach((g,i)=>{
        forma(ctx,g.geojson,trUF,CORES.municipioAtivo,'#FFFFFF',1.5);
        const [lon,lat]=areaMedia(g.geojson);
        circular(ctx,trUF.x(lon),trUF.y(lat),i+1,true);
      });
      texto(ctx,'Destaque: municípios selecionados (1–'+geos.length+')',
        UF.x+15,UF.y+UF.h-14,{tamanho:13,cor:CORES.texto});

      // Mapa principal: extensão real das malhas municipais + pontos explicitamente inseridos.
      const pontos = (config?.pontos || []).filter(p => Number.isFinite(Number(p.lng)) && Number.isFinite(Number(p.lat)));
      const detalheBounds = limites(geos.map(g=>g.geojson),pontos);
      const cartBox = {x:DET.x+29,y:DET.y+58,w:DET.w-58,h:DET.h-111};
      const trD = projeto(detalheBounds,cartBox,0.08);
      ctx.save();
      ctx.beginPath();ctx.rect(DET.x+2,DET.y+46,DET.w-4,DET.h-55);ctx.clip();
      // Grade geográfica discreta. Não foi utilizada para criar limites territoriais.
      ctx.strokeStyle='#E5EEEE';ctx.lineWidth=1;
      for(let k=1;k<5;k++){
        const x=cartBox.x+cartBox.w*k/5,y=cartBox.y+cartBox.h*k/5;
        ctx.beginPath();ctx.moveTo(x,cartBox.y);ctx.lineTo(x,cartBox.y+cartBox.h);ctx.stroke();
        ctx.beginPath();ctx.moveTo(cartBox.x,y);ctx.lineTo(cartBox.x+cartBox.w,y);ctx.stroke();
      }
      geos.forEach((g,i)=>{
        forma(ctx,g.geojson,trD,CORES.municipiosAlternados[i%CORES.municipiosAlternados.length],
          '#176175',2.4);
        const [lon,lat]=areaMedia(g.geojson);
        const mx=trD.x(lon), my=trD.y(lat);
        if(mx>cartBox.x+12&&mx<cartBox.x+cartBox.w-12&&my>cartBox.y+15&&my<cartBox.y+cartBox.h-15){
          circular(ctx,mx,my,i+1,false);
        }
      });
      pontos.forEach((p,i)=>{
        const x=trD.x(Number(p.lng)),y=trD.y(Number(p.lat));
        ctx.beginPath();ctx.arc(x,y,6.5,0,Math.PI*2);
        ctx.fillStyle=CORES.ponto;ctx.fill();ctx.strokeStyle='#FFFFFF';ctx.lineWidth=2;ctx.stroke();
        texto(ctx,limitarTexto(p.rotulo||('P'+(i+1)),20),x+10,y-10,
          {tamanho:16,peso:'700',cor:CORES.ponto,largura:170});
      });
      ctx.restore();
      norte(ctx,DET.x+DET.w-38,DET.y+82);
      escala(ctx,trD,DET.x+37,DET.y+DET.h-27,DET.w-90);

      // Legenda de correspondência dos números nos dois mapas, sem rótulos sobrepostos.
      const n=geos.length;
      if(n<=3){
        geos.forEach((g,i)=>{
          const x=47+i*365;
          circular(ctx,x+10,684,i+1,true);
          texto(ctx,limitarTexto(g.municipio.nome+'/'+g.municipio.uf,33),x+34,690,
            {tamanho:17,peso:'700',largura:304});
        });
      }else{
        geos.forEach((g,i)=>{
          const col=i%4,row=Math.floor(i/4),x=47+col*277,y=671+row*27;
          circular(ctx,x+10,y+7,i+1,true);
          texto(ctx,limitarTexto(g.municipio.nome+'/'+g.municipio.uf,24),x+31,y+13,
            {tamanho:14,peso:'700',largura:231});
        });
      }
      const yFonte=n<=4?717:730;
      texto(ctx,'Fonte cartográfica: IBGE, API de Malhas Geográficas · Elaboração: Astrolábio.',
        48,yFonte,{tamanho:14,cor:CORES.texto,largura:1115});
      texto(ctx,'Coordenadas geográficas: SIRGAS 2000 · Escala gráfica aproximada · Malhas simplificadas.',
        48,yFonte+20,{tamanho:13,cor:CORES.texto,largura:1115});
    } finally {
      ctx.restore();
    }
  }
  base.desenharMapa = desenharHierarquia;
  window.ASTRO_MAPA_HIERARQUICO = {
    versao:'1.0.0',origem:'IBGE',regerarPreview() {
      if (window.ASTRO_EXT?.previewMapa) return window.ASTRO_EXT.previewMapa();
    },limparCache(){cache.clear();}
  };
})();