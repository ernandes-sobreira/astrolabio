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
 '<div class="projeto-aviso">Os campos das estações 1 e 5 aparecem aqui já vinculados ao percurso. A redação dos capítulos é salva junto ao backup JSON. Cidade padrão: Cuiabá/MT, como nas capas de referência. Confira com a secretaria eventuais mudanças posteriores no modelo institucional.</div>'+
 '<h3 class="projeto-titulo">Identificação e capa</h3>'+
 opc('e1.nome','estacao','Nome completo do(a) mestrando(a)','Preenchido também na estação Ponto de Partida.')+
 opc('e1.orientador','estacao','Orientador(a)','Será utilizado na folha de apresentação.')+
 opc('e1.coorientador','estacao','Coorientador(a), se houver','')+
 opc('e5.titulo','estacao','Título do projeto','Este é o título da capa e da folha de apresentação.')+
 '<div class="dupla">'+opc('cidade','curto','Cidade da capa','Exemplo: Cuiabá/MT')+
 opc('ano','curto','Ano','Exemplo: 2026')+'</div>'+
 '<h3 class="projeto-titulo">Redação científica</h3>';
 for(const [k,n,d] of CAMPOS.slice(0,2))ins+=opc(k,'longo',n,d);
 ins+=opc('e5.pergunta','estacao','2. Problema e pergunta de pesquisa','A pergunta é recuperada da estação 5.');
 ins+=opc('introducao','longo','1. Introdução','Desenvolva o problema com citações.');
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
function conteudo(){
 let b='';
 // Primeira página: capa do PROJETO (não dissertação final).
 b+=vazio(7)+central('PROJETO DE PESQUISA','CoverLabel')+
 vazio(3)+central(tit().toUpperCase(),'CoverTitle')+
 vazio(4)+central(nome().toUpperCase(),'CoverName')+
 vazio(10)+central(cidade(),'Normal')+central(ano(),'Normal')+pg();
 // Folha de apresentação exclusiva de projeto.
 b+=vazio(2)+central(nome().toUpperCase(),'CoverName')+
 vazio(3)+central(tit().toUpperCase(),'CoverTitle')+
 vazio(3)+p('Projeto de pesquisa elaborado no âmbito do Mestrado Profissional em Rede Nacional em Gestão e Regulação de Recursos Hídricos — ProfÁgua, Unidade UNEMAT, para planejamento e desenvolvimento da pesquisa de mestrado.',{align:'both',first:true})+
 vazio(2)+p('Orientador(a): '+orient(),{align:'left'});
 if(v('e1','coorientador'))b+=p('Coorientador(a): '+v('e1','coorientador'),{align:'left'});
 b+=vazio(6)+central(cidade())+central(ano())+pg();
 // Matérias pré-textuais do projeto. Sumário de campos do Word editável.
 b+=titulo('RESUMO')+parags(valor('resumo'))+p('Palavras-chave: '+simples(valor('palavras')),{align:'left'})+pg();
 b+=titulo('SUMÁRIO')+indice()+pg();
 // Texto projetivo: nenhuma seção de resultados medidos ou defesa.
 b+=titulo('1 INTRODUÇÃO')+parags(valor('introducao'));
 b+=titulo('2 PROBLEMA DE PESQUISA')+parags(v('e5','pergunta'));
 b+=titulo('3 JUSTIFICATIVA')+parags(valor('justificativa'));
 b+=titulo('4 OBJETIVOS')+subtitulo('4.1 Objetivo geral')+parags(v('e5','objetivoGeral'));
 b+=subtitulo('4.2 Objetivos específicos');
 const obj=String(v('e5','objetivosEsp')||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 b+=obj.length?obj.map(x=>p('• '+x,{align:'left',space:90})).join(''):p('[Liste os objetivos específicos na Estação 5.]');
 b+=titulo('5 FUNDAMENTAÇÃO TEÓRICA')+parags(valor('fundamentacao'));
 b+=titulo('6 MATERIAL E MÉTODOS');
 b+=subtitulo('6.1 Área de estudo')+parags(valor('areaEstudo'));
 b+=subtitulo('6.2 Delineamento, dados e procedimentos')+parags(valor('metodos'));
 b+=subtitulo('6.3 Estratégia de análise')+parags(valor('analises'));
 b+=titulo('7 PRODUTO TÉCNICO E TECNOLÓGICO PREVISTO')+parags(valor('produto')||estado.entrega.nomeProduto||'');
 b+=titulo('8 RESULTADOS ESPERADOS')+parags(valor('esperados'));
 b+=titulo('9 CRONOGRAMA')+tabela(extrairCronograma());
 b+=titulo('REFERÊNCIAS BIBLIOGRÁFICAS');
 const refs=String(valor('referencias')||'').trim();
 b+=refs?refs.split(/\n/).filter(x=>x.trim()).map(x=>p(x.trim(),{align:'left',space:100,line:310})).join(''):p('[Informe referências completas utilizadas no projeto, no padrão ABNT.]');
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
async function gerar(){
 if(typeof window.JSZip==='undefined')throw new Error('Biblioteca para criar Word não carregada. Conecte-se à internet e recarregue.');
 const m=marcas(); const z=new JSZip();
 z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
 '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'+
 '<Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/>'+
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
 z.file('word/_rels/document.xml.rels',relations([['rId1','styles','styles.xml'],['rId2','header','header1.xml'],['rId3','footer','footer1.xml'],['rId4','footer','footer2.xml'],['rId5','settings','settings.xml']]));
 z.file('word/_rels/header1.xml.rels',relations([['rId1','image','media/estado.jpg'],['rId2','image','media/unemat.jpg']]));
 z.file('word/_rels/footer1.xml.rels',relations([['rId1','image','media/profagua.jpg'],['rId2','image','media/unematLogo.jpg'],['rId3','image','media/capesAna.jpg']]));
 for(const [campo,nome] of [['estado','estado'],['unemat','unemat'],['profagua','profagua'],['unematLogo','unematLogo'],['capesAna','capesAna']]){
  z.file('word/media/'+nome+'.jpg',m[campo],{base64:true});
 }
 return await z.generateAsync({type:'blob',compression:'DEFLATE'});
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
