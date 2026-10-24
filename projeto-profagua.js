/* ASTROLÁBIO — editor e exportador DOCX de projeto de pesquisa ProfÁgua/UNEMAT.
   O arquivo é montado inteiramente no navegador. Os dados não são enviados a um servidor.
   Base visual: quatro dissertações de 2025 fornecidas para conferência de capa/cabeçalho/marcas.
   Esta exportação é de PROJETO, nunca de dissertação concluída ou qualificação. */
(function(){
'use strict';
const CAMPOS = [
 ['resumo','Resumo do projeto','Apresente o problema, a finalidade, os métodos previstos e a contribuição esperada.'],
 ['palavras','Palavras-chave','Separe por ponto e vírgula.'],
 ['introducao','1. Introdução','Contextualização do problema, estado atual do conhecimento, relevância e delimitação.'],
 ['justificativa','3. Justificativa','Relevância científica, social e para a gestão de recursos hídricos.'],
 ['fundamentacao','5. Fundamentação teórica','Escreva os argumentos e conceitos com citações autor-data.'],
 ['areaEstudo','6.1. Área de estudo','Localização, características hídricas, população ou unidades de análise.'],
 ['metodos','6.2. Delineamento, dados e procedimentos','Fontes, amostragem, critérios, coleta e tratamento de dados previstos.'],
 ['analises','6.3. Estratégia de análise','Métodos qualitativos, quantitativos, espaciais ou estatísticos previstos.'],
 ['produto','7. Produto técnico e tecnológico previsto','Produto e público usuário, justificativa de aplicação e como será validado.'],
 ['esperados','8. Resultados esperados','Somente expectativas e contribuições futuras; não declare resultados obtidos.'],
 ['cronograma','9. Cronograma','Uma atividade por linha. Para fazer uma tabela no Word, use: Atividade | Período previsto.'],
 ['referencias','Referências bibliográficas','Uma referência bibliográfica completa por linha, conforme ABNT; não invente citações.']
];
const PREFIXO='Projeto de pesquisa — ProfÁgua/UNEMAT';
function dados(){ if(!estado.projeto || typeof estado.projeto!=='object') estado.projeto={}; return estado.projeto; }
function valor(k){ return dados()[k] || ''; }
function met(k,v){ dados()[k]=v; salvar(); atualizarBarra(); }
function el(s){return document.getElementById(s);}
function esc(s){return escapar(s===undefined?'':String(s));}
function opc(k,tipo,rotulo,obs){
 const id='proj-'+k;
 const val=tipo==='estacao'?v(k.split('.')[0],k.split('.')[1]):valor(k);
 let campo='';
 if(tipo==='estacao')campo='<textarea id="'+id+'" data-est="'+esc(k)+'" rows="3" oninput="projetoAlterarEstacao(this)" spellcheck="true">'+esc(val)+'</textarea>';
 else if(tipo==='curto') campo='<input type="text" id="'+id+'" data-campo="'+esc(k)+'" value="'+esc(val)+'" oninput="projetoAlterar(this)" />';
 else campo='<textarea id="'+id+'" data-campo="'+esc(k)+'" rows="'+(k==='referencias'?9:7)+'" oninput="projetoAlterar(this)" spellcheck="true">'+esc(val)+'</textarea>';
 return '<div class="campo projeto-campo"><label for="'+id+'">'+esc(rotulo)+'</label>'+
   (obs?'<div class="dica">'+esc(obs)+'</div>':'')+campo+'</div>';
}
function mostrarProjeto(){
 let ins='<div class="cabeca-estacao"><div class="etiqueta">Editor acadêmico · modelo UNEMAT / ProfÁgua</div>'+
 '<h2>Seu projeto, pronto para Word</h2><div class="guia">Escreva as seções completas aqui. Capa, logos, cabeçalho, folha de rosto, estilos e paginação são compostos na exportação. Nenhuma banca, ficha catalográfica ou resultado final será inserido.</div></div>'+
 '<div class="projeto-acoes"><button class="primario" onclick="baixarProjetoProfagua()">Baixar projeto .docx</button>'+
 '<span id="projeto-percentual" class="projeto-status" aria-live="polite"></span></div>'+
 '<div class="projeto-aviso">Os campos das estações 1 e 5 aparecem aqui já vinculados ao percurso. A redação dos capítulos é salva junto ao backup JSON. Cidade padrão: Cuiabá/MT, como nas capas de referência. Confira com a secretaria eventuais mudanças posteriores no modelo institucional. <strong>No celular:</strong> depois de baixar, abra o arquivo com Microsoft Word, Google Documentos ou WPS Office. Não use o explorador de arquivos para entrar no conteúdo interno do DOCX.</div>'+
 '<h3 class="projeto-titulo">Identificação e capa</h3>'+
 opc('e1.nome','estacao','Nome completo do(a) mestrando(a)','Preenchido também na estação Ponto de Partida.')+
 opc('e1.orientador','estacao','Orientador(a)','Será utilizado na folha de apresentação.')+
 opc('e1.coorientador','estacao','Coorientador(a), se houver','')+
 opc('e5.titulo','estacao','Título do projeto','Este é o título da capa e da folha de apresentação.')+
 '<div class="dupla">'+opc('cidade','curto','Cidade da capa','Exemplo: Cuiabá/MT')+
 opc('ano','curto','Ano','Exemplo: 2026')+'</div>'+
 '<h3 class="projeto-titulo">Redação científica</h3>';
 for(const [k,n,d] of CAMPOS.slice(0,2))ins+=opc(k,'longo',n,d);
 ins+=opc('introducao','longo','1. Introdução','Desenvolva o problema com citações.');
 ins+=opc('e5.pergunta','estacao','2. Problema e pergunta de pesquisa','A pergunta é recuperada da estação 5.');
 ins+=opc('justificativa','longo','3. Justificativa','Relevância científica, social e aplicada.');
 ins+=opc('e5.objetivoGeral','estacao','4.1. Objetivo geral','')+
 opc('e5.objetivosEsp','estacao','4.2. Objetivos específicos','Um por linha.');
 for(const [k,n,d] of CAMPOS.slice(4))ins+=opc(k,'longo',n,d);
 ins+='<div class="projeto-acoes"><button class="primario" onclick="baixarProjetoProfagua()">Baixar projeto .docx</button>'+
 '<button onclick="exportar()">Fazer backup JSON</button></div>';
 el('tela-projeto').innerHTML=ins;
 // Os campos de cidade/ano não são preenchidos artificialmente: a exportação mostra o padrão.
 if(!valor('cidade'))el('proj-cidade').placeholder='Cuiabá/MT (padrão da UNEMAT)';
 if(!valor('ano'))el('proj-ano').placeholder=String(new Date().getFullYear())+' (padrão)';
 atualizarBarra();
}
function atualizarBarra(){
 const tudo=['e1.nome','e5.titulo','e5.pergunta','e5.objetivoGeral','e5.objetivosEsp'].map(x=>v(...x.split('.')))
 .concat(CAMPOS.map(x=>valor(x[0])));
 const cnt=tudo.filter(x=>String(x||'').trim()).length;
 if(el('projeto-percentual'))el('projeto-percentual').textContent=cnt+' de '+tudo.length+' campos essenciais preenchidos';
}
window.projetoAlterar=function(input){met(input.dataset.campo,input.value);};
window.projetoAlterarEstacao=function(input){
 const p=input.dataset.est.split('.');setV(p[0],p[1],input.value);
 atualizarBarra();
};
window.abrirProjeto=function(){
 mostrarTela('projeto');mostrarProjeto();desenharNav();
 window.scrollTo({top:0,behavior:'smooth'});
};

function xml(t){ return String(t===null||t===undefined?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
function wtxt(s){return '<w:r><w:t xml:space="preserve">'+xml(s)+'</w:t></w:r>';}
function p(text,o){
 o=o||{};
 const style=o.style?'<w:pStyle w:val="'+o.style+'"/>':'';
 const jc='<w:jc w:val="'+(o.align||'both')+'"/>';
 const indentation=o.first?'<w:ind w:firstLine="709"/>':'';
 const sp=o.space!==undefined?o.space:120;
 const props='<w:pPr>'+style+jc+indentation+'<w:spacing w:before="0" w:after="'+sp+'" w:line="'+(o.line||360)+'" w:lineRule="auto"/>'+(o.keep?'<w:keepNext/>':'')+'</w:pPr>';
 const texts=String(text===null||text===undefined?'':text).split('\n');
 const runs=texts.map((t,i)=>(i?'<w:r><w:br/></w:r>':'')+wtxt(t)).join('');
 return '<w:p>'+props+runs+'</w:p>';
}
function parags(t,o){
 t=String(t||'').replace(/\r/g,'').trim();
 if(!t) return p('[Texto ainda não redigido no Astrolábio.]',{first:true});
 return t.split(/\n\s*\n/).map(x=>p(x.trim(),o||{first:true})).join('');
}
function titulo(s){return p(s,{style:'Heading1',align:'left',space:150,keep:true});}
function subtitulo(s){return p(s,{style:'Heading2',align:'left',space:120,keep:true});}
function pg(){return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';}
function central(s,style){return p(s,{align:'center',style:style||'Normal',space:150,line:280});}
function vazio(n){return Array(n).fill('<w:p><w:pPr><w:spacing w:after="110"/></w:pPr></w:p>').join('');}
function nome(){return (v('e1','nome')||'[NOME DO(A) MESTRANDO(A)]').trim();}
function tit(){return (v('e5','titulo')||'[TÍTULO DO PROJETO DE PESQUISA]').trim();}
function orient(){return (v('e1','orientador')||'[Informar orientador(a)]').trim();}
function cidade(){return valor('cidade').trim()||'Cuiabá/MT';}
function ano(){return valor('ano').trim()||String(new Date().getFullYear());}
function simples(vl){return String(vl||'').trim()||'[A preencher no Astrolábio.]';}
function extrairCronograma(){
 const t=valor('cronograma').trim();
 return t?t.split(/\r?\n/).map(s=>s.split(/\s*\|\s*/)).filter(a=>a[0].trim()):[['Definir as atividades','Definir o período']];
}
function tabela(linhas){
 const W=[6072,3000];
 let out='<w:tbl><w:tblPr><w:tblW w:w="9072" w:type="dxa"/><w:tblBorders>'+
 '<w:top w:val="single" w:sz="5"/><w:left w:val="single" w:sz="5"/>'+
 '<w:bottom w:val="single" w:sz="5"/><w:right w:val="single" w:sz="5"/>'+
 '<w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/>'+
 '</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="'+W[0]+'"/><w:gridCol w:w="'+W[1]+'"/></w:tblGrid>';
 const addrow=(a,b,h)=>{
  return '<w:tr>'+[a,b].map((s,i)=>'<w:tc><w:tcPr><w:tcW w:w="'+W[i]+'" w:type="dxa"/>'+
   (h?'<w:shd w:fill="E6E6E6"/>':'')+'</w:tcPr>'+p(s,{align:'left',space:60,line:260})+'</w:tc>').join('')+'</w:tr>';
 };
 out+=addrow('ATIVIDADE','PERÍODO PREVISTO',true);
 for(const a of linhas)out+=addrow(a[0]||'',a.slice(1).join(' | ')||'[Definir]',false);
 return out+'</w:tbl>';
}
function indice(){return '<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r>'+
 '<w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r>'+
 '<w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>Atualize o sumário no Word para inserir as páginas.</w:t></w:r>'+
 '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>';}

let FIGURAS=null;
function rotulado(label,value){
  const original=p(label+': '+String(value||''),{first:true});
  const head='<w:r><w:t xml:space="preserve">'+xml(label+': ');
  const replacement='<w:r><w:rPr><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">'+xml(label+':')+'</w:t></w:r><w:r><w:t xml:space="preserve"> ';
  return original.replace(head,replacement);
}
function figuraWord(rid,id,nome,fonte,largura,altura){
  return '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="140" w:after="90"/></w:pPr>'+
    img(rid,id,largura,altura)+'</w:p>'+
    p(nome,{style:'FigureCaption',align:'center',space:55,line:260})+
    p(fonte,{style:'FigureSource',align:'center',space:140,line:250});
}
function conteudo(){
  const en=estado.entrega||{};
  const vv=(e,k)=>v(e,k)||'';
  const list=a=>Array.isArray(a)?a.join('; '):String(a||'');
  const bloco=(pairs,pendencia)=>{
    const itens=pairs.filter(x=>x[1]!==null&&x[1]!==undefined&&String(x[1]).trim()!=='');
    return itens.length?itens.map(x=>rotulado(x[0],x[1])).join(''):p(pendencia||'[A desenvolver com a orientação a partir das estações do Astrolábio.]',{first:true});
  };
  const texto=(x,msg)=>parags(String(x||'').trim()||msg);
  let b='';
  let numeroFigura=0;
  const ext=estado.extensoes||{};
  // Capa institucional de projeto — sem banca, defesa ou ficha catalográfica.
  b+=vazio(3)+central('PROJETO DE PESQUISA','CoverLabel')+
     vazio(3)+central(tit().toUpperCase(),'CoverTitle')+
     vazio(4)+central(nome().toUpperCase(),'CoverName')+
     vazio(5)+central(cidade())+central(ano())+pg();
  b+=vazio(2)+central(nome().toUpperCase(),'CoverName')+
    vazio(2)+central(tit().toUpperCase(),'CoverTitle')+
    vazio(3)+p('Projeto de pesquisa elaborado no âmbito do Mestrado Profissional em Rede Nacional em Gestão e Regulação de Recursos Hídricos — ProfÁgua, Unidade UNEMAT, para planejamento e desenvolvimento de pesquisa de mestrado.',{first:true})+
    vazio(1)+p('Orientador(a): '+orient(),{align:'left'});
  if(vv('e1','coorientador'))b+=p('Coorientador(a): '+vv('e1','coorientador'),{align:'left'});
  b+=vazio(4)+central(cidade())+central(ano())+pg();
  b+=titulo('RESUMO DO PROJETO');
  b+=bloco([
    ['Problema',vv('e5','pergunta')],['Objetivo',vv('e5','objetivoGeral')],
    ['Abordagem prevista',vv('e5','abordagem')],['Delineamento',vv('e5','delineamento')],
    ['Área de estudo',vv('e5','territorio')],
    ['Produto previsto',en.nomeProduto||en.tipoProduto],
    ['Contribuição esperada',vv('e7','oQueMuda')]
  ],'[Resumo em construção: as respostas das estações 5 a 7 serão incorporadas automaticamente.]');
  b+=p('Palavras-chave: '+(valor('palavras')||'[A definir com a orientação.]'),{align:'left'})+pg();
  b+=titulo('SUMÁRIO')+indice()+pg();

  b+=titulo('1 INTRODUÇÃO');
  b+=bloco([
    ['Introdução previamente redigida na versão anterior',valor('introducao')],
    ['Motivação e contextualização',vv('e1','incomodo')],
    ['Trajetória e contexto',vv('e1','trajetoria')],
    ['O que já se sabe',vv('e4','jaSeSabe')],
    ['Lacuna identificada',vv('e4','naoSeSabe')],
    ['Evidência da lacuna',vv('e4','evidencia')],
    ['Recorte territorial',vv('e5','territorio')],
    ['Recorte temporal',vv('e5','temporal')]
  ],'[Desenvolver a introdução a partir das estações 1, 2, 4 e 5.]');
  b+=titulo('2 PROBLEMA DE PESQUISA');
  b+=texto(vv('e5','pergunta'),'[Pergunta científica ainda não informada na estação 5.]');
  if(vv('e5','hipotese'))b+=subtitulo('2.1 Hipótese ou pressuposto')+texto(vv('e5','hipotese'),'');
  b+=titulo('3 JUSTIFICATIVA');
  b+=bloco([
    ['Justificativa anteriormente redigida',valor('justificativa')],
    ['Relevância científica e social',vv('e4','porQueImporta')],
    ['Importância para o contexto profissional',vv('e1','expectativa')],
    ['Mudança prática desejada',vv('e7','oQueMuda')],
    ['Demanda pelo produto técnico',en.quemDemandou],
    ['Evidência da demanda',en.evidProblema]
  ],'[Justificativa a compor a partir das estações 4, 6 e 7.]');
  b+=titulo('4 OBJETIVOS')+subtitulo('4.1 Objetivo geral');
  b+=texto(vv('e5','objetivoGeral'),'[Objetivo geral ainda não informado na estação 5.]');
  b+=subtitulo('4.2 Objetivos específicos');
  const obj=String(vv('e5','objetivosEsp')).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  b+=obj.length?obj.map(x=>p('• '+x,{align:'left',space:80})).join(''):p('[Objetivos específicos ainda não informados na estação 5.]');
  b+=titulo('5 FUNDAMENTAÇÃO TEÓRICA');
  b+=bloco([
    ['Fundamentação anteriormente redigida',valor('fundamentacao')],
    ['Referência inspiradora',vv('e2','referencia')],
    ['Contribuição da leitura',vv('e2','oQueMexeu')],
    ['Questão que permaneceu em aberto',vv('e2','semResposta')],
    ['Conhecimento consolidado',vv('e4','jaSeSabe')],
    ['Busca bibliográfica realizada',vv('e4','evidencia')],
    ['Bases consultadas',vv('e4','bases')]
  ],'[Fundamentação teórica a desenvolver com as referências das estações 2 a 4.]');
  const leituras=[];
  if(vv('e2','referencia'))leituras.push({
    referencia:vv('e2','referencia'),frase:vv('e2','trecho'),
    pagina:'(conferir página na obra original)',relacao:vv('e2','noSeuContexto'),
    contribuicao:vv('e2','oQueMexeu'),funcao:'Texto inspirador'
  });
  (ext.leituras||[]).forEach(l=>{if(l&&l.referencia)leituras.push(l);});
  b+=subtitulo('5.1 Leituras estruturantes e relações com o projeto');
  if(!leituras.length)b+=p('[Registre leituras e trechos direcionais na estação 2; nenhuma citação será inventada.]');
  else leituras.forEach((l,i)=>{
    b+=p('LEITURA '+(i+1)+(l.funcao?' — '+l.funcao.toUpperCase():''),{align:'left',space:90,keep:true});
    b+=rotulado('Referência',l.referencia);
    b+=rotulado('Frase ou trecho direcional',l.frase||'[Selecionar trecho fiel à fonte.]');
    if(l.pagina)b+=rotulado('Página ou localização',l.pagina);
    if(l.relacao)b+=rotulado('Relação com o projeto',l.relacao);
    if(l.contribuicao)b+=rotulado('Decisão apoiada pela leitura',l.contribuicao);
  });
  if((estado.autores||[]).some(a=>a.nome)){
    b+=subtitulo('5.2 Autores identificados no percurso');
    b+=estado.autores.filter(a=>a.nome).map(a=>p(a.nome+(a.intersecao?' — '+a.intersecao:''),{align:'left'})).join('');
  }
  b+=titulo('6 MATERIAL E MÉTODOS')+subtitulo('6.1 Área e período de estudo');
  b+=bloco([
    ['Caracterização da área anteriormente redigida',valor('areaEstudo')],
    ['Território',vv('e5','territorio')],['Período',vv('e5','temporal')],
    ['Contexto de aplicação',vv('e2','noSeuContexto')]
  ],'[Área e período a especificar na estação 5.]');
  if(FIGURAS&&FIGURAS.mapa){
    numeroFigura++;
    const g=ext.geo||{};
    b+=figuraWord('rId7',71,'Figura '+numeroFigura+' – Localização da área de estudo: '+(FIGURAS.municipios||'municípios selecionados')+'.',
      'Fonte: limites municipais do IBGE (API de Malhas Geográficas); pontos e elaboração cartográfica: Astrolábio, a partir das coordenadas informadas pelo discente.',5400000,3420000);
    (g.pontos||[]).forEach(o=>b+=rotulado('Coordenada '+o.rotulo,Number(o.lat).toFixed(5)+'°, '+Number(o.lng).toFixed(5)+'°'));
  }else{
    b+=p('[Para gerar a figura cartográfica, selecione municípios e, opcionalmente, coordenadas na estação 5.]',{first:true});
  }
  b+=subtitulo('6.2 Tipo e delineamento do estudo');
  b+=bloco([
    ['Abordagem',vv('e5','abordagem')],['Finalidade',vv('e5','finalidade')],
    ['Estratégia predominante',vv('e5','delineamento')],['Hipótese/pressuposto',vv('e5','hipotese')]
  ],'[Abordagem e delineamento a especificar na estação 5.]');
  b+=subtitulo('6.3 Dados, instrumentos e procedimentos');
  b+=bloco([
    ['Metodologia anteriormente redigida',valor('metodos')],
    ['Dados já disponíveis',vv('e10','dadosTenho')],
    ['Dados a obter e fontes responsáveis',vv('e10','dadosFaltam')],
    ['Técnicas dominadas pelo pesquisador',vv('e10','seiFazer')],
    ['Técnicas a desenvolver e preparação',vv('e10','precisoAprender')]
  ],'[Detalhar amostragem, coleta, instrumentos e tratamento dos dados com o orientador.]');
  b+=subtitulo('6.4 Procedimentos de análise');
  b+=bloco([
    ['Abordagem prevista',vv('e5','abordagem')],
    ['Delineamento e análise',vv('e5','delineamento')],
    ['Detalhamento já redigido no projeto',valor('analises')]
  ],'[A análise estatística, qualitativa ou espacial exige detalhamento metodológico adicional.]');

  b+=titulo('7 PRODUTO TÉCNICO E TECNOLÓGICO PREVISTO');
  b+=bloco([
    ['Produto anteriormente redigido',valor('produto')],
    ['Tipo de entrega',list(en.formatos)],['Tipologia técnica',en.tipoProduto||en.tipoCapes],
    ['Produto provisoriamente nomeado',en.nomeProduto],
    ['Destinatário do produto',en.usuario||vv('e7','publico')],
    ['Vinculação com a pesquisa',en.vinculacao],
    ['Estratégia de validação',en.validacao||list(en.modalidadesVal)],
    ['Diferencial',en.diferencial],['Prazo estimado',en.prazoProduto]
  ],'[Produto técnico a detalhar na estação 6.]');
  b+=titulo('8 RESULTADOS ESPERADOS');
  b+=bloco([
    ['Resultados esperados anteriormente redigidos',valor('esperados')],
    ['Mudança prática esperada',vv('e7','oQueMuda')],
    ['Contribuição ao final do mestrado',vv('e1','expectativa')],
    ['Público a beneficiar',vv('e7','publico')],
    ['Indicadores de impacto do produto',en.indicadores],
    ['Mudança esperada do produto',en.mudanca]
  ],'[Resultados esperados a estabelecer a partir dos objetivos. Não foram inventados resultados empíricos.]');
  b+=titulo('9 LIMITAÇÕES, RISCOS E PLANO DE CONTINGÊNCIA');
  b+=bloco([
    ['Principais riscos e alternativas',vv('e10','riscos')],
    ['Dependências para acesso aos dados',vv('e10','dadosFaltam')],
    ['Limitações técnicas identificadas',vv('e10','precisoAprender')],
    ['Barreiras previstas para alcançar os usuários',vv('e7','barreiras')]
  ],'[Limitações e contingências ainda não descritas na estação 10.]');
  b+=titulo('10 RECURSOS E PLANEJAMENTO FINANCEIRO');
  b+=bloco([
    ['Situação de financiamento',vv('e10','financiamento')],
    ['Horas semanais disponíveis',vv('e10','tempo')?vv('e10','tempo')+' horas':''],
    ['Recursos técnicos e operacionais disponíveis',vv('e10','seiFazer')],
    ['Demandas e capacitações necessárias',vv('e10','precisoAprender')],
    ['Dependências financeiras ou institucionais',vv('e10','dadosFaltam')]
  ],'[Recursos a definir com base na estação 10.]');
  b+=p('Orçamento em reais, quantidades e custos unitários: [não informados nas estações; os valores não foram presumidos].',{first:true});
  b+=titulo('11 CRONOGRAMA DE EXECUÇÃO');
  let etapas=[];
  String(vv('e8','metas')).split(/\r?\n/).map(x=>x.trim()).filter(Boolean).forEach(x=>{
    const a=x.split(/\s+\|\s+|\s+[—–]\s+/);
    etapas.push([a[0],a.slice(1).join(' — ')||'Conforme planejamento']);
  });
  if(en.prazoArtigo)etapas.push(['Submissão do artigo',en.prazoArtigo]);
  if(en.prazoProduto)etapas.push(['Primeira versão do produto',en.prazoProduto]);
  if(vv('e9','quando'))etapas.push(['Devolutiva dos resultados',vv('e9','quando')]);
  if(vv('e1','defesa'))etapas.push(['Previsão de conclusão do mestrado',vv('e1','defesa')]);
  if(!etapas.length)etapas=extrairCronograma();
  b+=tabela(etapas);
  b+=titulo('12 DIVULGAÇÃO E DEVOLUTIVA');
  b+=bloco([
    ['Público participante ou beneficiário',vv('e7','publico')],
    ['Plano de divulgação',vv('e8','divulgacao')],
    ['Eventos-alvo',vv('e8','eventos')],
    ['Parceiros institucionais',vv('e8','parceiros')],
    ['Destinatários da devolutiva',vv('e9','paraQuem')],
    ['Formato da devolutiva',list(vv('e9','formato'))],
    ['Local e data da devolutiva',[(vv('e9','onde')||''),(vv('e9','quando')||'')].filter(Boolean).join(' — ')],
    ['Registro da devolutiva',vv('e9','comoRegistra')]
  ],'[Divulgação e devolutiva ainda não preenchidas nas estações 7 a 9.]');
  b+=titulo('13 DEMANDA TERRITORIAL E RELEVÂNCIA DO PROJETO');
  const ad=ext.aderencia||{};
  b+=bloco([
    ['Origem da demanda',ad.origem],
    ['Instituição ou coletivo demandante',ad.instituicao],
    ['Necessidade concreta a suprir',ad.demanda],
    ['Território ao qual responde',ad.territorio],
    ['Evidências e registros da demanda',ad.evidencia]
  ],'[Demanda e origem ainda não informadas na estação 7.]');
  if([ad.origem,ad.instituicao,ad.demanda,ad.territorio,ad.evidencia].some(x=>String(x||'').trim())){
    b+=subtitulo('13.1 Régua de aderência — autoavaliação do discente');
    for(const [k,label] of [
      ['gestao','Aderência à gestão pública'],
      ['urgencia','Urgência territorial'],
      ['aplicacao','Aplicabilidade do produto'],
      ['impacto','Benefício socioambiental esperado']
    ]){
      const n=Math.max(1,Math.min(5,Number(ad[k])||3));
      b+=rotulado(label, '■'.repeat(n)+'□'.repeat(5-n)+'  '+n+'/5');
    }
    b+=p('Escala declaratória: 1 = baixa aderência; 5 = alta aderência. Pontuações atribuídas pelo discente, não constituindo avaliação oficial do Estado ou endosso da instituição demandante.',{align:'left',space:110});
    if(!ad.evidencia)b+=p('[Falta evidência documental da origem da demanda: informar fonte, data e registro.]');
  }
  b+=titulo('REFERÊNCIAS BIBLIOGRÁFICAS');
  const refs=[...new Set([vv('e2','referencia'),...(ext.leituras||[]).map(x=>x.referencia),valor('referencias')].filter(Boolean).join('\n').split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];
  b+=refs.length?refs.map(x=>p(x,{align:'left',space:100,line:310})).join(''):p('[Informar as referências completas realmente utilizadas. O Astrolábio não cria citações inexistentes.]');
  if(FIGURAS&&FIGURAS.nuvem){
    b+=titulo('APÊNDICE A — NUVEM DE PALAVRAS DO PROJETO');
    numeroFigura++;
    b+=figuraWord('rId6',61,'Figura '+numeroFigura+' – Síntese lexical dos termos mais frequentes no projeto.',
      'Fonte: elaboração automática do Astrolábio a partir das respostas registradas, após remoção de termos comuns e institucionais.',5400000,3150000);
    b+=p('A frequência lexical constitui descrição textual, não avaliação de qualidade científica.',{align:'left',space:100});
  }
  return b;
}

const NS_DOC='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
function img(rid,id,cx,cy){
 return '<w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0">'+
 '<wp:extent cx="'+cx+'" cy="'+cy+'"/><wp:docPr id="'+id+'" name="Marca institucional '+id+'"/>'+
 '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'+
 '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'+
 '<pic:nvPicPr><pic:cNvPr id="0" name="Marca"/><pic:cNvPicPr/></pic:nvPicPr>'+
 '<pic:blipFill><a:blip r:embed="'+rid+'"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'+
 '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="'+cx+'" cy="'+cy+'"/></a:xfrm>'+
 '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'+
 '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
}
function cel(content,width,alinhamento){
 return '<w:tc><w:tcPr><w:tcW w:w="'+width+'" w:type="dxa"/><w:tcBorders><w:top w:val="nil"/><w:bottom w:val="nil"/><w:left w:val="nil"/><w:right w:val="nil"/></w:tcBorders></w:tcPr>'+
 '<w:p><w:pPr><w:jc w:val="'+(alinhamento||'center')+'"/><w:spacing w:after="0"/></w:pPr>'+content+'</w:p></w:tc>';
}
function table3(a,b,c){
 return '<w:tbl><w:tblPr><w:tblW w:w="9072" w:type="dxa"/><w:tblBorders><w:top w:val="nil"/><w:bottom w:val="nil"/>'+
 '<w:left w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr>'+
 '<w:tblGrid><w:gridCol w:w="1540"/><w:gridCol w:w="5992"/><w:gridCol w:w="1540"/></w:tblGrid>'+
 '<w:tr>'+cel(a,1540)+cel(b,5992)+cel(c,1540)+'</w:tr></w:tbl>';
}
function header(){
 const ins=[
 'GOVERNO DO ESTADO DE MATO GROSSO',
 'SECRETARIA DE ESTADO DE CIÊNCIA, TECNOLOGIA E INOVAÇÃO',
 'UNIVERSIDADE DO ESTADO DE MATO GROSSO',
 'CARLOS ALBERTO REYES MALDONADO',
 'PRÓ-REITORIA DE PESQUISA E PÓS-GRADUAÇÃO',
 'MESTRADO PROFISSIONAL EM REDE NACIONAL EM',
 'GESTÃO E REGULAÇÃO DE RECURSOS HÍDRICOS'
 ];
 const medio=ins.map(x=>'<w:r><w:rPr><w:b/><w:sz w:val="14"/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t>'+xml(x)+'</w:t></w:r><w:r><w:br/></w:r>').join('');
 const xmlH='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr '+NS_DOC+'>'+
 table3(img('rId1',1,860000,860000),medio,img('rId2',2,860000,860000))+'</w:hdr>';
 return xmlH;
}
function footerCover(){
 const a=img('rId1',3,1120000,440000), b=img('rId2',4,1320000,370000), c=img('rId3',5,2640000,510000);
 const cols=[2050,2320,4702];
 const celMarcas=(pic,w)=>'<w:tc><w:tcPr><w:tcW w:w="'+w+'" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr>'+pic+'</w:p></w:tc>';
 const grid=cols.map(w=>'<w:gridCol w:w="'+w+'"/>').join('');
 const table='<w:tbl><w:tblPr><w:tblW w:w="9072" w:type="dxa"/></w:tblPr><w:tblGrid>'+grid+'</w:tblGrid><w:tr>'+celMarcas(a,cols[0])+celMarcas(b,cols[1])+celMarcas(c,cols[2])+'</w:tr></w:tbl>';
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr '+NS_DOC+'>'+table+'</w:ftr>';
}
function footerDefault(){
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr '+NS_DOC+'>'+
 '<w:p><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r>'+
 '<w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>'+
 '<w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r>'+
 '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>';
}
function doc(){
 const sect='<w:sectPr><w:headerReference w:type="default" r:id="rId2"/>'+
 '<w:headerReference w:type="first" r:id="rId2"/>'+
 '<w:footerReference w:type="first" r:id="rId3"/>'+
 '<w:footerReference w:type="default" r:id="rId4"/>'+
 '<w:titlePg/><w:pgSz w:w="11906" w:h="16838"/>'+
 '<w:pgMar w:top="2350" w:right="1134" w:bottom="1750" w:left="1700" w:header="380" w:footer="450" w:gutter="0"/>'+
 '</w:sectPr>';
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document '+NS_DOC+'><w:body>'+conteudo()+sect+'</w:body></w:document>';
}
function styles(){
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'+
 '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault>'+
 '<w:pPrDefault><w:pPr><w:spacing w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'+
 '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="24"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="FigureCaption"><w:name w:val="Figure Caption"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="20"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="FigureSource"><w:name w:val="Figure Source"/><w:basedOn w:val="Normal"/><w:rPr><w:sz w:val="18"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="CoverLabel"><w:name w:val="Cover Label"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="CoverTitle"><w:name w:val="Cover Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="27"/></w:rPr></w:style>'+
 '<w:style w:type="paragraph" w:styleId="CoverName"><w:name w:val="Cover Name"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>'+
 '</w:styles>';
}
function relations(pairs){
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
 pairs.map(x=>'<Relationship Id="'+x[0]+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/'+x[1]+'" Target="'+x[2]+'"/>').join('')+
 '</Relationships>';
}
function marcas(){
 const out=window.PROFAGUA_MARCAS;
 if(!out || !['estado','unemat','profagua','unematLogo','capesAna'].every(k=>out[k]&&out[k].length>1000))throw new Error('As logomarcas institucionais não foram carregadas. Verifique a conexão e recarregue a página.');
 return out;
}

/* Os brasões do PDF original foram extraídos de imagens com transparência
   convertida para fundo PRETO. Corrigimos SOMENTE a região preta conectada
   às bordas, preservando o desenho interno, antes de inseri-los no Word. */
function emblemaComFundoBranco(base64){
  return new Promise((resolve,reject)=>{
    const imagem=new Image();
    imagem.onload=function(){
      try{
        const cv=document.createElement('canvas');
        cv.width=imagem.naturalWidth;cv.height=imagem.naturalHeight;
        const ctx=cv.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(imagem,0,0);
        const quadro=ctx.getImageData(0,0,cv.width,cv.height);
        const d=quadro.data,w=cv.width,h=cv.height,n=w*h;
        const visitado=new Uint8Array(n),fila=[];
        const escuro=(p)=>{
          const i=p*4;
          return d[i]<88&&d[i+1]<88&&d[i+2]<88;
        };
        function incluir(p){
          if(p<0||p>=n||visitado[p])return;
          visitado[p]=1;if(escuro(p))fila.push(p);
        }
        for(let x=0;x<w;x++){incluir(x);incluir((h-1)*w+x);}
        for(let y=0;y<h;y++){incluir(y*w);incluir(y*w+w-1);}
        for(let z=0;z<fila.length;z++){
          const p=fila[z],off=p*4;
          d[off]=255;d[off+1]=255;d[off+2]=255;d[off+3]=255;
          const x=p%w,y=Math.floor(p/w);
          if(x>0)incluir(p-1);
          if(x<w-1)incluir(p+1);
          if(y>0)incluir(p-w);
          if(y<h-1)incluir(p+w);
        }
        ctx.putImageData(quadro,0,0);
        resolve(cv.toDataURL('image/jpeg',0.95).split(',')[1]);
      }catch(e){reject(e);}
    };
    imagem.onerror=()=>reject(new Error('Não foi possível corrigir uma logomarca para o Word.'));
    imagem.src='data:image/jpeg;base64,'+base64;
  });
}

async function gerar(){
 if(typeof window.JSZip==='undefined')throw new Error('Biblioteca para criar Word não carregada. Conecte-se à internet e recarregue.');
 const m=marcas(); const z=new JSZip();
  FIGURAS=window.ASTRO_FIGURAS ? await window.ASTRO_FIGURAS.renderizar() : null;
  m.estado=await emblemaComFundoBranco(m.estado);
  m.unemat=await emblemaComFundoBranco(m.unemat);
 z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
 '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'+
 '<Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="png" ContentType="image/png"/>'+
 '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'+
 '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'+
 '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>'+
 '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'+
 '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'+
 '<Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'+
 '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
 z.file('_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'+
 '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
 z.file('docProps/core.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">'+
 '<dc:title>'+xml(tit())+'</dc:title><dc:subject>Projeto de pesquisa ProfÁgua/UNEMAT</dc:subject>'+
 '<dc:creator>'+xml(nome())+'</dc:creator></cp:coreProperties>');
 z.file('word/document.xml',doc());
 z.file('word/styles.xml',styles());
 z.file('word/settings.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:updateFields w:val="true"/></w:settings>');
 z.file('word/header1.xml',header());z.file('word/footer1.xml',footerCover());z.file('word/footer2.xml',footerDefault());
 z.file('word/_rels/document.xml.rels',relations([['rId1','styles','styles.xml'],['rId2','header','header1.xml'],['rId3','footer','footer1.xml'],['rId4','footer','footer2.xml'],['rId5','settings','settings.xml'],...(FIGURAS&&FIGURAS.nuvem?[['rId6','image','media/nuvem.png']]:[]),...(FIGURAS&&FIGURAS.mapa?[['rId7','image','media/mapa.png']]:[])]));
  if(FIGURAS&&FIGURAS.nuvem)z.file('word/media/nuvem.png',FIGURAS.nuvem,{base64:true});
  if(FIGURAS&&FIGURAS.mapa)z.file('word/media/mapa.png',FIGURAS.mapa,{base64:true});
 z.file('word/_rels/header1.xml.rels',relations([['rId1','image','media/estado.jpg'],['rId2','image','media/unemat.jpg']]));
 z.file('word/_rels/footer1.xml.rels',relations([['rId1','image','media/profagua.jpg'],['rId2','image','media/unematLogo.jpg'],['rId3','image','media/capesAna.jpg']]));
 for(const [campo,nome] of [['estado','estado'],['unemat','unemat'],['profagua','profagua'],['unematLogo','unematLogo'],['capesAna','capesAna']]){
  z.file('word/media/'+nome+'.jpg',m[campo],{base64:true});
 }
 return await z.generateAsync({type:'blob',compression:'DEFLATE',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
window.baixarProjetoProfagua=async function(){
 const bt=document.activeElement, ant=bt && bt.tagName==='BUTTON' ? bt.textContent : '';
 try{
  if(bt && ant){bt.disabled=true;bt.textContent='Preparando Word...';}
  const blob=await gerar();
  const nomeLimpo=nome().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase().slice(0,60)||'mestrando';
  baixarBlob(blob,'projeto-profagua-'+nomeLimpo+'.docx');
 }catch(e){console.error(e);alert('O projeto não pôde ser exportado: '+e.message);}
 finally{if(bt && ant){bt.disabled=false;bt.textContent=ant;}}
};
})();
