/* Extensões não destrutivas do Astrolábio. A fonte oficial das geometrias é o IBGE. */
(function(){
'use strict';
const UFS=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
const API='https://servicodados.ibge.gov.br/api';
const CACHE=new Map();
function st(){
  if(!estado.extensoes||typeof estado.extensoes!=='object')estado.extensoes={};
  const e=estado.extensoes;
  if(!Array.isArray(e.leituras))e.leituras=[];
  if(!e.aderencia)e.aderencia={origem:'',instituicao:'',demanda:'',territorio:'',evidencia:'',gestao:3,urgencia:3,aplicacao:3,impacto:3};
  if(!e.geo)e.geo={uf:'MT',municipios:[],pontos:[]};
  if(!Array.isArray(e.geo.municipios))e.geo.municipios=[];
  if(!Array.isArray(e.geo.pontos))e.geo.pontos=[];
  if(!e.nuvem)e.nuvem={excluir:''};
  return e;
}
function esc(v){return escapar(String(v===null||v===undefined?'':v));}
function ed(x){return String(x||'').trim();}
function campoValor(label,id,value,placeholder,kind){
  const tag=kind==='textarea'?'textarea':'input';
  const input=tag==='textarea'
    ?'<textarea id="'+id+'" placeholder="'+esc(placeholder||'')+'" rows="3">'+esc(value)+'</textarea>'
    :'<input type="text" id="'+id+'" value="'+esc(value)+'" placeholder="'+esc(placeholder||'')+'">';
  return '<div class="campo"><label for="'+id+'">'+esc(label)+'</label>'+input+'</div>';
}
function htmlLeituras(){
  const leit=st().leituras;
  let html='<section class="astro-ext"><h3>Leituras estruturantes do projeto</h3>'+
   '<p class="dica">O texto inspirador da estação 2 já será incluído no Word. Aqui você pode registrar outros artigos, livros e documentos, sem perder o que já respondeu.</p>';
  leit.forEach((a,i)=>{
    const c=(id,l,v,h)=>campoValor(l,'al-'+i+'-'+id,v,h,id==='referencia'||id==='frase'||id==='relacao'||id==='contribuicao'?'textarea':'text')
      .replace('id="al-'+i+'-'+id+'"','id="al-'+i+'-'+id+'" oninput="ASTRO_EXT.atualizarLeitura('+i+',\''+id+'\',this.value)"');
    html+='<div class="astro-ext-card"><div class="astro-ext-top"><strong>Leitura '+(i+2)+'</strong>'+
      '<button class="mini risco" onclick="ASTRO_EXT.excluirLeitura('+i+')">Excluir leitura</button></div>'+
      c('referencia','Referência bibliográfica completa',a.referencia,'Autor, título, periódico, ano, DOI')+
      '<div class="dupla">'+c('frase','Trecho ou frase direcional',a.frase,'Use trecho breve e fiel ao artigo')+
      c('pagina','Página/localização no texto',a.pagina,'p. 12; seção 3')+'</div>'+
      c('relacao','Como dialoga com sua pesquisa?',a.relacao,'Convergências, diferenças, limites e conexão metodológica')+
      c('contribuicao','O que essa leitura ajudou a definir?',a.contribuicao,'Problema, hipótese, recorte, método, produto ou análise')+
      '<div class="campo"><label>Função principal desta leitura</label><select onchange="ASTRO_EXT.atualizarLeitura('+i+',\'funcao\',this.value)">'+
      ['Teoria','Problema','Lacuna','Método','Território','Produto técnico','Impacto','Outra'].map(t=>'<option '+(a.funcao===t?'selected':'')+'>'+t+'</option>').join('')+
      '</select></div></div>';
  });
  html+='<button class="primario" onclick="ASTRO_EXT.adicionarLeitura()">+ Adicionar leitura</button></section>';
  return html;
}
function htmlRelevancia(){
  const a=st().aderencia,cs=[['gestao','Aderência à gestão pública','Há relação verificável com políticas ou serviços públicos?'],['urgencia','Urgência territorial','A demanda possui gravidade atual ou prazo definido?'],['aplicacao','Viabilidade de aplicação','O produto pode ser usado por quem demandou?'],['impacto','Benefício socioambiental esperado','Há público beneficiado e indicadores plausíveis?']];
  let html='<section class="astro-ext"><h3>Demanda e relevância territorial</h3>'+
    '<p class="dica">Os valores de 1 a 5 são uma <b>autoavaliação orientada por evidências</b>; não representam nota oficial do Estado nem substituem manifestação institucional.</p>';
  for(const [id,label,ph] of [
    ['origem','Tipo de origem da demanda','Órgão público, comitê de bacia, comunidade, escola, associação...'],
    ['instituicao','Instituição ou coletivo que formulou a demanda','Nome e unidade responsável'],
    ['demanda','Qual demanda concreta a pesquisa pode atender?','Descreva a insuficiência atual e o serviço/decisão que necessita de solução'],
    ['territorio','Local ou escala da demanda','Município, bacia hidrográfica, comunidade, região ou Estado'],
    ['evidencia','Evidência verificável da demanda','Ofício, ata, diagnóstico, indicador, plano público, consulta documentada; cite data e fonte']
  ]){
   html+=campoValor(label,'ar-'+id,a[id]||'',ph,id==='demanda'||id==='evidencia'?'textarea':'text')
     .replace('id="ar-'+id+'"','id="ar-'+id+'" oninput="ASTRO_EXT.atualizarDemanda(\''+id+'\',this.value)"');
  }
  html+='<h4>Régua de aderência (autoavaliação)</h4>';
  cs.forEach(([k,t,d])=>{
    html+='<div class="astro-slider"><label for="ar-'+k+'">'+esc(t)+' <strong id="ar-num-'+k+'">'+Number(a[k]||3)+'/5</strong></label>'+
      '<p class="dica">'+esc(d)+'</p><input id="ar-'+k+'" type="range" min="1" max="5" step="1" value="'+Number(a[k]||3)+'" oninput="ASTRO_EXT.atualizarDemanda(\''+k+'\',this.value);document.getElementById(\'ar-num-'+k+'\').textContent=this.value+\'/5\'"></div>';
  });
  html+='<p class="dica">A régua e a origem documentada da demanda serão incluídas no projeto Word. Notas sem evidência ficam explicitamente identificadas.</p></section>';
  return html;
}
function htmlGeo(){
  const g=st().geo;
  const opts=UFS.map(uf=>'<option value="'+uf+'" '+(g.uf===uf?'selected':'')+'>'+uf+'</option>').join('');
  let html='<section class="astro-ext"><h3>Localização cartográfica da pesquisa</h3>'+
    '<p class="dica">Selecione um ou vários municípios pela base do IBGE. É possível também marcar pontos de coordenadas (graus decimais). O mapa utiliza limites municipais oficiais, sem desenhar fronteiras fictícias.</p>'+
    '<div class="dupla"><div class="campo"><label for="astro-uf">Estado</label><select id="astro-uf" onchange="ASTRO_EXT.alterarUF(this.value)">'+opts+'</select></div>'+
    '<div class="campo"><label for="astro-cidade">Município para adicionar</label><select id="astro-cidade"><option value="">Carregando lista do IBGE...</option></select></div></div>'+
    '<button onclick="ASTRO_EXT.adicionarMunicipio()">+ Incluir município selecionado</button>'+
    '<div id="astro-municipios-lista" class="astro-municipios"></div><h4>Pontos de análise (opcionais)</h4>'+
    '<div class="tripla">'+campoValor('Latitude','astro-lat','','Ex.: -16.0742','text')+
    campoValor('Longitude','astro-lng','','Ex.: -57.6759','text')+
    campoValor('Identificação do ponto','astro-ponto','','Ex.: Ponto P1','text')+'</div>'+
    '<button onclick="ASTRO_EXT.adicionarPonto()">+ Adicionar coordenada</button>'+
    '<div id="astro-pontos-lista" class="astro-municipios"></div>'+
    '<p id="astro-map-status" class="dica" role="status">Aguardando carregamento da malha IBGE.</p>'+
    '<canvas id="astro-map-canvas" width="1200" height="760" style="display:block;width:100%;max-width:840px;border:1px solid #9FB3BC;background:#fff" aria-label="Mapa cartográfico com limites municipais oficiais do IBGE"></canvas>'+
    '<p class="dica">Fonte cartográfica: IBGE, API de Malhas Geográficas; visualização e escala elaboradas pelo Astrolábio. O mapa final traz legenda, norte, escala aproximada e municípios identificados.</p></section>';
  return html;
}
function htmlNuvem(){
  const n=st().nuvem;
  return '<section class="astro-ext"><h3>Síntese lexical do projeto</h3>'+
    '<p class="dica">A nuvem ao final do Word considera as respostas científicas do percurso. Exclui automaticamente artigos, preposições e termos como Mato Grosso, UNEMAT, mestrado e ProfÁgua.</p>'+
    campoValor('Palavras adicionais para excluir','astro-stopwords',n.excluir,'Ex.: rio; água; nome de laboratório','text')
     .replace('id="astro-stopwords"','id="astro-stopwords" oninput="ASTRO_EXT.alterarExclusoes(this.value)"')+
    '<button onclick="ASTRO_EXT.mostrarNuvem()">Visualizar nuvem de palavras</button>'+
    '<canvas id="astro-nuvem-canvas" width="1200" height="700" style="display:none;width:100%;max-width:840px;border:1px solid #9FB3BC;margin-top:12px" aria-label="Nuvem de palavras sem termos comuns"></canvas></section>';
}
function persist(){salvar();}
const UI={
  html(id){if(id==='e2')return htmlLeituras();if(id==='e5')return htmlGeo();if(id==='e7')return htmlRelevancia();if(id==='e10')return htmlNuvem();return '';},
  mount(id){if(id==='e5'){UI.exibirSelecoes();UI.carregarMunicipios().then(()=>UI.previewMapa());}},
  adicionarLeitura(){st().leituras.push({referencia:'',frase:'',pagina:'',relacao:'',contribuicao:'',funcao:'Teoria'});persist();desenharEstacao();},
  atualizarLeitura(i,k,val){if(st().leituras[i]){st().leituras[i][k]=val;persist();}},
  excluirLeitura(i){if(!confirm('Excluir somente esta leitura complementar?'))return;st().leituras.splice(i,1);persist();desenharEstacao();},
  atualizarDemanda(k,val){const a=st().aderencia;if(['gestao','urgencia','aplicacao','impacto'].includes(k))a[k]=Math.max(1,Math.min(5,Number(val)||3));else a[k]=val;persist();},
  alterarExclusoes(val){st().nuvem.excluir=val;persist();},
  alterarUF(uf){if(!UFS.includes(uf))return;st().geo.uf=uf;persist();UI.carregarMunicipios();},
  async carregarMunicipios(){
    const select=document.getElementById('astro-cidade');if(!select)return;
    select.innerHTML='<option value="">Consultando municípios oficiais...</option>';
    try{
      const resp=await fetch(API+'/v1/localidades/estados/'+st().geo.uf+'/municipios?orderBy=nome');
      if(!resp.ok)throw Error('Serviço de localidades indisponível: HTTP '+resp.status);
      const items=await resp.json();
      select.innerHTML='<option value="">Escolha um município</option>'+items.map(m=>'<option value="'+m.id+'">'+esc(m.nome)+'</option>').join('');
    }catch(e){select.innerHTML='<option value="">Falha na consulta ao IBGE</option>';UI.status(String(e.message));}
  },
  adicionarMunicipio(){
    const select=document.getElementById('astro-cidade');
    const id=select&&select.value;
    if(!/^\d{7}$/.test(id||''))return alert('Escolha primeiro um município da lista oficial do IBGE.');
    const g=st().geo;
    if(g.municipios.some(m=>m.id===id))return;
    if(g.municipios.length>=8)return alert('Máximo de oito municípios para manter um mapa legível.');
    const m={id,nome:select.selectedOptions[0].text,uf:g.uf};
    g.municipios.push(m);persist();UI.exibirSelecoes();UI.previewMapa();
  },
  excluirMunicipio(id){st().geo.municipios=st().geo.municipios.filter(m=>m.id!==id);persist();UI.exibirSelecoes();UI.previewMapa();},
  async adicionarPonto(){
    const latTexto=String(document.getElementById('astro-lat').value).trim();
    const lngTexto=String(document.getElementById('astro-lng').value).trim();
    if(!latTexto||!lngTexto)return alert('Informe latitude e longitude. Um campo vazio não equivale a zero.');
    const lat=Number(latTexto.replace(',','.'));
    const lng=Number(lngTexto.replace(',','.'));
    if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180) return alert('Digite latitude e longitude válidas em graus decimais.');
    const pontos=st().geo.pontos;
    if(pontos.length>=12)return alert('Máximo de 12 pontos identificados por mapa.');
    pontos.push({lat,lng,rotulo:ed(document.getElementById('astro-ponto').value)||'P'+(pontos.length+1)});
    persist();UI.exibirSelecoes();
    if(!st().geo.municipios.length){
      UI.status('Consultando município correspondente às coordenadas...');
      try{
        const m=await figuras.resolverMunicipioDaCoordenada(lat,lng);
        if(m&&!st().geo.municipios.some(x=>x.id===m.id)){
          st().geo.municipios.push(m);persist();UI.exibirSelecoes();
          UI.status('Município confirmado pela malha do IBGE: '+m.nome+'/'+m.uf);
        }
      }catch(e){UI.status('Coordenada registrada. Para mapear o território oficialmente, selecione o município ou tente novamente: '+e.message);}
    }
    UI.previewMapa();
  },
  excluirPonto(i){st().geo.pontos.splice(i,1);persist();UI.exibirSelecoes();UI.previewMapa();},
  exibirSelecoes(){
    const g=st().geo,mun=document.getElementById('astro-municipios-lista'),pon=document.getElementById('astro-pontos-lista');
    if(mun)mun.innerHTML=g.municipios.length?g.municipios.map(m=>'<span class="astro-chip">'+esc(m.nome)+'/'+esc(m.uf)+' <button class="mini" aria-label="Retirar município" onclick="ASTRO_EXT.excluirMunicipio(\''+m.id+'\')">×</button></span>').join(''):'<small>Nenhum município selecionado.</small>';
    if(pon)pon.innerHTML=g.pontos.length?g.pontos.map((p,i)=>'<span class="astro-chip">'+esc(p.rotulo)+': '+p.lat.toFixed(5)+', '+p.lng.toFixed(5)+' <button class="mini" onclick="ASTRO_EXT.excluirPonto('+i+')">×</button></span>').join(''):'<small>Sem pontos adicionados.</small>';
  },
  status(msg){const e=document.getElementById('astro-map-status');if(e)e.textContent=msg;},
  async previewMapa(){
    const canvas=document.getElementById('astro-map-canvas');if(!canvas)return;
    UI.status('Preparando malhas municipais reais do IBGE...');
    try{const geometries=await figuras.geometriaSelecionada();figuras.desenharMapa(canvas,geometries,st().geo);UI.status(geometries.length?'Mapa vetorial oficial carregado.':'Adicione município ou coordenada para gerar o mapa.');}
    catch(e){UI.status('Não foi possível carregar a malha oficial: '+e.message);figuras.avisoCanvas(canvas,'Mapa indisponível — confira a conexão ao IBGE');}
  },
  mostrarNuvem(){const c=document.getElementById('astro-nuvem-canvas');if(!c)return;c.style.display='block';figuras.nuvem(c);}
};
function todosPontos(geometry){
 const polygons=[];
 if(!geometry)return polygons;
 if(geometry.type==='FeatureCollection')return geometry.features.flatMap(f=>todosPontos(f.geometry));
 if(geometry.type==='Feature')return todosPontos(geometry.geometry);
 if(geometry.type==='Polygon')return geometry.coordinates||[];
 if(geometry.type==='MultiPolygon')return (geometry.coordinates||[]).flatMap(x=>x);
 return [];
}
const figuras={
  async resolverMunicipioDaCoordenada(lat,lng){
    const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=10&lat='+encodeURIComponent(lat)+'&lon='+encodeURIComponent(lng));
    if(!r.ok)throw Error('consulta reversa indisponível');
    const data=await r.json(),a=data.address||{};
    const nome=a.county||a.municipality||a.city||a.town||a.village;
    if(!nome)throw Error('não foi possível identificar o município');
    let uf=(a['ISO3166-2-lvl4']||a.state_code||'').replace(/^BR-/,'').toUpperCase();
    if(!UFS.includes(uf)){
      const re=await fetch(API+'/v1/localidades/estados');
      if(!re.ok)throw Error('IBGE não respondeu consulta das unidades federativas');
      const estados=await re.json();
      const uni=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
      const found=estados.find(x=>uni(x.nome)===uni(a.state));uf=found?.sigla;
    }
    if(!UFS.includes(uf))throw Error('UF não identificada para as coordenadas');
    const re=await fetch(API+'/v1/localidades/estados/'+uf+'/municipios');
    if(!re.ok)throw Error('IBGE não respondeu consulta dos municípios');
    const list=await re.json();
    const uni=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    const nomes=[a.county,a.municipality,a.city,a.town,a.village].filter(Boolean);
    const m=list.find(o=>nomes.some(n=>uni(n)===uni(o.nome)));
    if(!m)throw Error('nome do município não encontrado no cadastro IBGE');
    const obj={id:String(m.id),nome:m.nome,uf};
    const geo=await figuras.buscarMalha(obj);
    if(!figuras.contemPonto(geo,lng,lat))throw Error('ponto não pertence à malha municipal identificada; selecione o município manualmente');
    return obj;
  },
  contemPonto(geo,lon,lat){
    const rings=todosPontos(geo);
    let inside=false;
    for(const ring of rings){
      let hit=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];
        if(((yi>lat)!==(yj>lat))&&lon<((xj-xi)*(lat-yi)/(yj-yi)+xi))hit=!hit;
      }
      if(hit)inside=!inside;
    }
    return inside;
  },
  async buscarMalha(m){
    if(CACHE.has(m.id))return CACHE.get(m.id);
    const resp=await fetch(API+'/v3/malhas/municipios/'+m.id+'?formato=application/vnd.geo%2Bjson&qualidade=minima',{headers:{Accept:'application/vnd.geo+json'}});
    if(!resp.ok)throw Error('IBGE não retornou limites de '+m.nome+' (HTTP '+resp.status+').');
    const obj=await resp.json();
    if(!todosPontos(obj).length)throw Error('Malha inválida ou sem coordenadas oficiais: '+m.nome);
    CACHE.set(m.id,obj);return obj;
  },
  async geometriaSelecionada(){
    const g=st().geo;
    return Promise.all(g.municipios.map(async m=>({municipio:m,geojson:await figuras.buscarMalha(m)})));
  },
  avisoCanvas(cv,msg){
    const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);
    x.fillStyle='#6b7377';x.font='24px Georgia';x.textAlign='center';x.fillText(msg,cv.width/2,cv.height/2);
  },
  desenharMapa(cv,geos,config){
    const ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#0A2E3D';ctx.font='bold 30px Georgia';ctx.textAlign='left';ctx.fillText('LOCALIZAÇÃO DA ÁREA DE ESTUDO',55,55);
    const fs=geos.map(x=>({name:x.municipio.nome,uf:x.municipio.uf,rings:todosPontos(x.geojson)}));
    const raw=fs.flatMap(x=>x.rings.flat()).concat((config.pontos||[]).map(p=>[p.lng,p.lat]));
    if(!raw.length){figuras.avisoCanvas(cv,'Adicione municípios ou coordenadas.');return;}
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    raw.forEach(([lon,lat])=>{if(lon<minX)minX=lon;if(lon>maxX)maxX=lon;if(lat<minY)minY=lat;if(lat>maxY)maxY=lat;});
    if(minX===maxX){minX-=.15;maxX+=.15;}if(minY===maxY){minY-=.15;maxY+=.15;}
    const mean=(minY+maxY)/2,ratio=Math.cos(mean*Math.PI/180);
    const width=(maxX-minX)*ratio,height=(maxY-minY);
    const pad=.13;
    const midx=(maxX+minX)/2,midy=(maxY+minY)/2,dx=width*(1+pad*2),dy=height*(1+pad*2);
    const box={left:65,top:90,right:1135,bottom:650};
    const sx=(box.right-box.left)/dx,sy=(box.bottom-box.top)/dy;
    const scale=Math.min(sx,sy),cx=(box.left+box.right)/2,cy=(box.top+box.bottom)/2;
    const xy=(lon,lat)=>[cx+(lon-midx)*ratio*scale,cy-(lat-midy)*scale];
    ctx.fillStyle='#F4F9FA';ctx.fillRect(box.left,box.top,box.right-box.left,box.bottom-box.top);
    ctx.strokeStyle='#dae7e9';ctx.lineWidth=1;
    for(let j=0;j<7;j++){const q=box.left+(box.right-box.left)*j/6;ctx.beginPath();ctx.moveTo(q,box.top);ctx.lineTo(q,box.bottom);ctx.stroke();}
    for(let j=0;j<5;j++){const q=box.top+(box.bottom-box.top)*j/4;ctx.beginPath();ctx.moveTo(box.left,q);ctx.lineTo(box.right,q);ctx.stroke();}
    fs.forEach((g,i)=>{
      ctx.beginPath();g.rings.forEach(r=>{r.forEach(([lon,lat],n)=>{const [x,y]=xy(lon,lat);if(n===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.closePath();});
      ctx.fillStyle=i%2?'#D2E7D5':'#BDDBD4';ctx.fill('evenodd');
      ctx.strokeStyle='#1C6170';ctx.lineWidth=2.5;ctx.stroke();
      let x1=Infinity,x2=-Infinity,y1=Infinity,y2=-Infinity;
      g.rings.forEach(r=>r.forEach(([lon,lat])=>{x1=Math.min(x1,lon);x2=Math.max(x2,lon);y1=Math.min(y1,lat);y2=Math.max(y2,lat)}));
      const [tx,ty]=xy((x1+x2)/2,(y1+y2)/2);
      ctx.fillStyle='#073a4d';ctx.textAlign='center';ctx.font='bold 18px Arial';ctx.fillText(g.name,tx,ty);ctx.font='14px Arial';ctx.fillText(g.uf,tx,ty+19);
    });
    (config.pontos||[]).forEach((p,i)=>{
      const [x,y]=xy(p.lng,p.lat);ctx.fillStyle='#B65C35';ctx.strokeStyle='#fff';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#723017';ctx.textAlign='left';ctx.font='bold 17px Arial';ctx.fillText(p.rotulo||'P'+(i+1),x+12,y-7);
    });
    // Norte cartográfico e escala métrica estimada na latitude central.
    ctx.fillStyle='#073a4d';ctx.textAlign='center';ctx.font='bold 20px Arial';ctx.fillText('N',1094,132);
    ctx.beginPath();ctx.moveTo(1094,141);ctx.lineTo(1085,167);ctx.lineTo(1094,159);ctx.lineTo(1103,167);ctx.closePath();ctx.fill();
    const pxKm=scale/(111.32*Math.max(.1,ratio)),target=Math.max(1,160*111.32*Math.max(.1,ratio)/scale);
    const breaks=[1,2,5,10,20,50,100,200,500,1000,2000,5000],km=breaks.find(x=>x>=target)||5000;
    const len=km*111.32*ratio*scale;
    if(len<350){ctx.strokeStyle='#063A4C';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(95,610);ctx.lineTo(95+len,610);ctx.stroke();
      ctx.fillStyle='#063A4C';ctx.font='bold 17px Arial';ctx.textAlign='left';ctx.fillText('0',95,600);ctx.fillText(km+' km',95+len-18,600);}
    ctx.textAlign='left';ctx.fillStyle='#34515A';ctx.font='17px Arial';ctx.fillText(fs.length?fs.map(x=>x.name+'/'+x.uf).join('  •  ').slice(0,104):'Ponto(s) de análise',62,690);
    ctx.font='15px Arial';ctx.fillText('Limites: IBGE / API de Malhas Geográficas. Elaboração: Astrolábio.',62,720);
    ctx.textAlign='right';ctx.fillText('Coordenadas geográficas: WGS 84 | Escala gráfica aproximada',1140,744);
  },
  nuvem(cv){
    const ctx=cv.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);
    const stop=new Set(('de da do das dos e em com para por no na nos nas os as o a um uma ao aos à às que se sua seu suas seus onde qual quais como pelo pela pelos pelas entre sobre ate até ou mas porque isso esse essa esses essas este esta estes estas foi ser são será está estão têm tem ter sendo pode podem ainda muito mais menos todo toda todos todas desde agora após antes durante bem sem porquê então mesmo pelos devem deve fazer feita realizado realizada aluno discente pesquisa projeto estudo trabalho mestrado programa universidade unemat profagua profágua mato grosso estado professor orientador brasil brasileira brasileiro grande dados').split(/\s+/));
    const extra=st().nuvem.excluir.split(/[,;\n]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
    extra.forEach(x=>x.split(/\s+/).forEach(w=>stop.add(w.normalize('NFD').replace(/[\u0300-\u036f]/g,''))));
    const texts=Object.values(estado.dados||{}).flatMap(o=>Object.values(o||{})).filter(x=>typeof x==='string');
    texts.push(...(estado.extensoes?.leituras||[]).flatMap(l=>[l.relacao||'',l.contribuicao||'']));
    texts.push((estado.entrega||{}).nomeProduto||'',(estado.entrega||{}).diferencial||'');
    const raw=texts.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z\s]/g,' ').split(/\s+/);
    const freq={};
    raw.forEach(w=>{if(w.length>=4&&!stop.has(w))freq[w]=(freq[w]||0)+1});
    const terms=Object.entries(freq).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,55);
    if(!terms.length){figuras.avisoCanvas(cv,'Sem palavras suficientes para a nuvem.');return [];}
    ctx.textAlign='center';ctx.fillStyle='#123b50';ctx.font='bold 31px Georgia';ctx.fillText('SÍNTESE LEXICAL DO PROJETO',cv.width/2,55);
    const boxes=[],palette=['#064d63','#2d786a','#ac6935','#647c7b','#304b64'];
    terms.forEach(([word,n],i)=>{
      const size=Math.round(19+49*Math.sqrt(n/terms[0][1])),label=word,angle=i*2.399963,sz=Math.max(18,Math.min(70,size));
      ctx.font='bold '+sz+'px Georgia';
      const w=ctx.measureText(label).width+14,h=sz+12;
      for(let t=0;t<450;t++){
        const rr=Math.sqrt(t)*15,aa=angle+t*.20,x=cv.width/2+Math.cos(aa)*rr,y=cv.height/2+Math.sin(aa)*rr+24;
        if(x-w/2<35||x+w/2>cv.width-35||y-h<80||y+h>cv.height-36)continue;
        if(boxes.some(b=>x-w/2<b.x+b.w&&x+w/2>b.x&&y-h/2<b.y+b.h&&y+h/2>b.y))continue;
        boxes.push({x:x-w/2,y:y-h/2,w,h});ctx.fillStyle=palette[i%palette.length];ctx.fillText(label,x,y+sz*.32);break;
      }
    });
    ctx.textAlign='left';ctx.font='14px Arial';ctx.fillStyle='#53686c';ctx.fillText('Frequência de palavras após remoção de termos comuns e institucionais • Fonte: Astrolábio.',40,cv.height-18);
    return terms;
  },
  async renderizar(){
    const geo=st().geo, result={};
    if(geo.municipios.length||geo.pontos.length){
      if(!geo.municipios.length&&geo.pontos.length)throw Error('Para inserir pontos no mapa Word, selecione também o município de referência; assim as delimitações oficiais serão exibidas corretamente.');
      const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=760;
      const shapes=await figuras.geometriaSelecionada();
      figuras.desenharMapa(canvas,shapes,geo);
      result.mapa=canvas.toDataURL('image/png').split(',')[1];
      result.municipios=geo.municipios.map(m=>m.nome+'/'+m.uf).join(', ');
    }
    const cloud=document.createElement('canvas');cloud.width=1200;cloud.height=700;
    const terms=figuras.nuvem(cloud);
    if(terms.length>=3)result.nuvem=cloud.toDataURL('image/png').split(',')[1];
    return result;
  }
};
window.ASTRO_EXT=UI;
window.ASTRO_FIGURAS=figuras;
window.ASTRO_ESTADO_EXT=st;
const css=document.createElement('style');css.textContent=
 '.astro-ext{margin:32px 0;padding:21px;border:2px solid #bad1d5;border-left:6px solid #14663c;border-radius:7px;background:#fbfdfc}'+
 '.astro-ext h3{color:#064d63;font:700 25px Georgia;margin:0 0 12px}'+
 '.astro-ext h4{color:#064d63;font:700 19px Georgia;margin:20px 0 8px}'+
 '.astro-ext-card{margin:20px 0;padding:18px;border:1px solid #c4d9db;border-radius:8px;background:white}'+
 '.astro-ext-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:15px}'+
 '.astro-ext .campo{margin-bottom:16px}.astro-slider{margin-bottom:16px;padding:10px;background:#edf5f5}'+
 '.astro-slider input{width:100%;accent-color:#0c5366}'+
 '.astro-municipios{padding:12px 0;display:flex;flex-wrap:wrap;gap:7px}'+
 '.astro-chip{border:1px solid #93b3be;border-radius:6px;background:white;padding:5px 7px;font-size:13px}'+
 '.astro-chip button{padding:2px 7px;font-size:13px;vertical-align:middle}';
document.head.appendChild(css);
})();