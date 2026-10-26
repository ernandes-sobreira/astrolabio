/*
 * Astrolábio / ProfÁgua — correspondência estrita com o ANEXO II
 * "Plano de Desenvolvimento do Produto Técnico-Tecnológico" da minuta XXXX/2026.
 * As 17 seções e os campos seguem apenas o Anexo II; não são incorporados
 * requisitos de qualificação, defesa ou acompanhamento pós-defesa.
 * Preserva os dados antigos do Astrolábio: itens novos em estado.entrega.anexoII.
 */
(function(){
'use strict';
const O={
 participacao:['Sim','Não','Ainda não definida'],
 inovacao:['incremental','organizacional','tecnológica','social','metodológica','regulatória','educacional','outra'],
 complexidade:['integração de diferentes áreas de conhecimento','diversidade de atores','uso de tecnologia especializada','tratamento de grande volume de dados','requisitos regulatórios','múltiplas etapas de desenvolvimento','necessidade de testes','aplicação territorial ampla','integração entre sistemas','outros'],
 validacao:['aplicação em ambiente real','aplicação piloto','teste em ambiente representativo','avaliação por usuários','avaliação por instituição','parecer de especialista externo','teste de desempenho','teste de usabilidade','oficina ou grupo focal','painel de especialistas','análise de conformidade','outra'],
 transferencia:['entrega formal à instituição','disponibilização em repositório','capacitação','oficina de aplicação','licenciamento','cessão','incorporação em sistema ou processo','publicação técnica','disponibilização de código ou documentação','outra'],
 etica:['não se aplica','aprovação necessária','aprovação obtida','análise em andamento'],
 dados:['não envolve dados pessoais','envolve dados pessoais','envolve dados pessoais sensíveis'],
 pi:['não identificada','potencial de proteção','análise pelo NIT em andamento','proteção requerida'],
 sigilo:['acesso aberto','acesso parcialmente restrito','sigilo temporário','sigilo integral justificado'],
 aprovacao:['aprovado','aprovado com ajustes','reformulação necessária']
};
function q(id,label,type,source,options){
 return {id,label,type:type||'area',source:source||'',options:options||[]};
}
const secoes=[
{titulo:'1. Identificação',campos:[
 q('instituicao','Instituição Associada','text','v:e1.instituicao'),
 q('discente','Discente','text','v:e1.nome'),
 q('matricula','Matrícula','text'),
 q('orientador','Orientador','text','v:e1.orientador'),
 q('coorientador','Coorientador, quando houver','text','v:e1.coorientador'),
 q('tituloDissertacao','Título provisório da dissertação','area','v:e5.titulo'),
 q('area','Área de concentração','text','v:e1.area'),
 q('linha','Linha de atuação','text','v:e1.linha'),
 q('projetoEstruturante','Projeto de pesquisa ou projeto estruturante, se for o caso'),
 q('data','Data de preenchimento (dd/mm/aaaa)','text'),
 q('versao','Versão do plano','text')
]},
{titulo:'2. Identificação preliminar do PTT',campos:[
 q('tituloPTT','Título provisório do PTT','area','en:nomeProduto'),
 q('tipoPrincipal','Tipologia principal prevista','text','en:tipoCapes'),
 q('tipoSecundaria','Tipologia secundária, quando houver','text','en:tipoCapes2'),
 q('formatoPTT','Formato previsto','text','en:tipoProduto'),
 q('descricao250','Descrição resumida do produto — até 250 palavras: o que será desenvolvido, para quem, com qual finalidade e em qual contexto')
]},
{titulo:'3. Problema ou demanda',campos:[
 q('problemaConcreto','3.1. Qual problema concreto será enfrentado?','area','v:e1.incomodo'),
 q('quemDemandou','3.2. Quem identificou ou manifestou a demanda?','area','en:quemDemandou'),
 q('evidenciaProblema','3.3. Quais evidências demonstram a existência e relevância do problema?','area','en:evidProblema'),
 q('contexto','3.4. Qual é o contexto territorial, institucional, regulatório, ambiental ou social?','area','v:e5.territorio'),
 q('politicaRelacionada','3.5. A qual política pública, instrumento de gestão, processo institucional ou demanda social se relaciona?')
]},
{titulo:'4. Vinculação com a dissertação',campos:[
 q('derivacao','4.1. De que forma o PTT deriva do problema, dos objetivos, dos métodos ou dos resultados da dissertação?','area','en:vinculacao'),
 q('conhecimentoSolucao','4.2. Qual conhecimento produzido pela pesquisa será convertido em solução aplicada?'),
 q('partesDissertacao','4.3. Quais partes da dissertação fundamentarão o produto?')
]},
{titulo:'5. Público destinatário e beneficiários',campos:[
 q('publicoDireto','Público destinatário direto','area','v:e7.publico'),
 q('beneficiariosIndiretos','Beneficiários indiretos','area','v:e7.publicoSec'),
 q('instituicoesUsuarias','Instituições ou organizações potencialmente usuárias'),
 q('territorioAplicacao','Território, bacia, município, estado ou região de aplicação','area','v:e5.territorio'),
 q('numeroUsuarios','Número estimado de usuários ou beneficiários, quando possível','text')
]},
{titulo:'6. Participação de atores externos',campos:[
 q('participacao','6.1. Haverá participação de usuários, organizações, comunidades ou especialistas no desenvolvimento?','select','',O.participacao),
 q('atores','6.2.a. Atores participantes'),
 q('formaParticipacao','6.2.b. Forma de participação'),
 q('etapaParticipacao','6.2.c. Etapa de participação'),
 q('contribuicaoAtores','6.2.d. Contribuição esperada'),
 q('acordos','6.2.e. Autorizações ou acordos necessários')
]},
{titulo:'7. Objetivo e funcionalidades',campos:[
 q('objetivoPTT','Objetivo geral do PTT — diferente do objetivo científico da dissertação'),
 q('objetivosPTT','Objetivos específicos do PTT — um por linha'),
 q('funcionalidades','Principais funcionalidades, componentes ou entregas'),
 q('situacaoUso','Situação ou atividade na qual será utilizado','area','en:usuario'),
 q('resultadosImediatos','Resultados imediatos esperados','area','v:e7.oQueMuda')
]},
{titulo:'8. Aderência',campos:[
 q('aderenciaMissao','a) Aderência à missão e aos objetivos do ProfÁgua'),
 q('aderenciaArea','b) Aderência à área de concentração'),
 q('aderenciaLinha','c) Aderência à linha de atuação'),
 q('aderenciaProjeto','d) Aderência ao projeto de pesquisa'),
 q('aderenciaGestao','e) Aderência à gestão e à regulação de recursos hídricos')
]},
{titulo:'9. Aplicabilidade',campos:[
 q('modoUso','9.1. Como o produto poderá ser utilizado?','area','en:usuario'),
 q('recursosAplicacao','9.2. Quais recursos serão necessários?'),
 q('competenciasUsuario','9.3. Quais competências o usuário deverá possuir?'),
 q('condicoesAplicacao','9.4. Quais são as condições de aplicação?'),
 q('replicabilidade','9.5. O produto poderá ser replicado ou adaptado para outros contextos? Como?')
]},
{titulo:'10. Inovação',campos:[
 q('solucoesAtuais','10.1. O que existe atualmente para enfrentar o problema?'),
 q('novidade','10.2. Qual aperfeiçoamento, adaptação, combinação ou novidade será introduzida?','area','en:diferencial'),
 q('tipoInovacao','10.3. Natureza da inovação prevista','checks','',O.inovacao),
 q('tipoInovacaoOutra','10.3. Outra categoria de inovação, se selecionada','text'),
 q('melhoriaPrevista','10.4. Qual melhoria de qualidade, desempenho, acesso, eficiência ou efetividade é esperada?')
]},
{titulo:'11. Complexidade',campos:[
 q('complexidade','Elementos de complexidade presentes','checks','',O.complexidade),
 q('complexidadeOutros','Outros elementos de complexidade, se selecionados'),
 q('justComplexidade','Justificativa da complexidade')
]},
{titulo:'12. Estratégia de validação',campos:[
 q('modalidadesVal','Modalidade ou modalidades previstas','checks','en:modalidadesVal',O.validacao),
 q('modalidadeOutra','Outra modalidade, se selecionada'),
 q('criteriosVal','Critérios de validação'),
 q('participantesVal','Participantes ou avaliadores'),
 q('instrumentosVal','Instrumentos previstos'),
 q('evidenciasVal','Evidências que serão produzidas','area','en:evidencias')
]},
{titulo:'13. Estratégia de transferência ou compartilhamento',campos:[
 q('transferencia','Formas previstas','checks','en:transfPrev',O.transferencia),
 q('transferenciaOutra','Outra forma de transferência, se selecionada'),
 q('descricaoTransferencia','Descrição da estratégia')
]},
{titulo:'14. Avaliação prévia do potencial de impacto',campos:[
 q('mudanca','Mudança que se espera produzir','area','en:mudanca'),
 q('beneficiariosImpacto','Beneficiários esperados','area','v:e7.publico'),
 q('prazoImpacto','Prazo provável para ocorrência','text'),
 q('indicadores','Indicadores preliminares','area','en:indicadores'),
 q('meiosVerificacao','Meios de verificação'),
 q('condicoesImpacto','Condições necessárias')
]},
{titulo:'15. Riscos e requisitos',campos:[
 q('etica','15.1. Ética em pesquisa — situação','select','en:etica',O.etica),
 q('eticaDocumento','15.1. Documento ou processo'),
 q('dadosPessoais','15.2. Proteção de dados — situação','select','en:dadosPes',O.dados),
 q('medidasDados','15.2. Medidas de proteção previstas'),
 q('propriedadeIntelectual','15.3. Propriedade intelectual — situação','select','en:pi',O.pi),
 q('sigilo','15.4. Sigilo ou restrição — situação','select','en:sigilo',O.sigilo),
 q('sigiloJustificativa','15.4. Justificativa da restrição, quando aplicável'),
 q('acessibilidade','15.5. Recursos ou adaptações de acessibilidade previstos','area','en:acessibilidade')
]},
{titulo:'16. Recursos necessários',campos:[
 q('recursosHumanos','Recursos humanos'),
 q('infraestrutura','Infraestrutura'),
 q('dadosSistemas','Dados e sistemas'),
 q('recursosFinanceiros','Recursos financeiros'),
 q('parcerias','Parcerias','area','v:e8.parceiros')
]},
{titulo:'17. Aprovação — preenchimento do orientador',orientador:true,campos:[
 q('manifestacao','Manifestação do orientador','select','',O.aprovacao),
 q('comentarios','Comentários do orientador')
]}];
const all=secoes.flatMap(x=>x.campos);
const allById=Object.fromEntries(all.map(x=>[x.id,x]));
function en(){if(!estado.entrega||typeof estado.entrega!=='object')estado.entrega={formatos:[]};return estado.entrega;}
function extra(){const a=en();if(!a.anexoII||typeof a.anexoII!=='object')a.anexoII={};return a.anexoII;}
function ascii(v){return String(v==null?'':v);}
function esc(v){return escapar(ascii(v));}
function norm(t){return ascii(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
const aliases={
 'avaliação por usuários ou beneficiários':'avaliação por usuários',
 'avaliação por instituição potencialmente usuária':'avaliação por instituição',
 'parecer técnico de especialista externo':'parecer de especialista externo',
 'análise de desempenho, usabilidade, precisão ou conformidade':'teste de desempenho',
 'oficina participativa, grupo focal, painel de especialistas ou Delphi':'oficina ou grupo focal',
 'validação normativa, jurídica ou institucional':'análise de conformidade',
 'aprovação necessária, ainda não solicitada':'aprovação necessária'
};
function corrigirOpcao(t,ops){
 if(ops.includes(t))return t;
 const normalized=norm(t);
 const found=ops.find(x=>norm(x)===normalized);
 if(found)return found;
 const pair=Object.entries(aliases).find(item=>norm(item[0])===normalized);
 const ali=aliases[normalized]||(pair&&pair[1]);
 return ali&&ops.includes(ali)?ali:'';
}
/* Cada pergunta nova é feita na estação temática existente — jamais num segundo
 * formulário de 17 seções. Perguntas respondidas anteriormente são reaproveitadas. */
const LOCAL={
 e1:['matricula','projetoEstruturante'],
 e4:['politicaRelacionada'],
 e5:['conhecimentoSolucao'],
 e6:['objetivoPTT','objetivosPTT','funcionalidades','aderenciaMissao','aderenciaGestao','tipoInovacao','tipoInovacaoOutra','complexidade','complexidadeOutros','justComplexidade','participantesVal','instrumentosVal'],
 e7:['instituicoesUsuarias','numeroUsuarios','competenciasUsuario','condicoesAplicacao','replicabilidade'],
 e8:['prazoImpacto','condicoesImpacto','transferenciaOutra'],
 e9:['participacao','atores','formaParticipacao','etapaParticipacao','contribuicaoAtores','acordos'],
 e10:['recursosHumanos','infraestrutura','dadosSistemas','recursosFinanceiros','eticaDocumento','medidasDados','sigiloJustificativa']
};
function derived(c){
 const id=c.id,ext=estado.extensoes||{},ad=ext.aderencia||{};
 const ev=(a,b)=>v(a,b);
 const e=en();
 const join=(...parts)=>parts.map(x=>ascii(x).trim()).filter(Boolean).join(' — ');
 switch(id){
  case 'data':return new Date().toLocaleDateString('pt-BR');
  case 'versao':return '1.0 (rascunho)';
  case 'descricao250':{
   const base=[
    e.nomeProduto||e.tipoProduto?'Produto previsto: '+join(e.nomeProduto,e.tipoProduto)+'.':'',
    e.usuario?'Destina-se a '+ascii(e.usuario).trim()+'.':'',
    ev('e5','territorio')?'Contexto de aplicação: '+ev('e5','territorio')+'.':'',
    ev('e1','incomodo')?'Problema que procura enfrentar: '+ev('e1','incomodo')+'.':'',
    e.diferencial?'Diferencial previsto: '+e.diferencial+'.':''
   ].filter(Boolean).join(' ');
   const words=base.trim().split(/\s+/).filter(Boolean);
   return words.length>250?words.slice(0,250).join(' ')+' […]':base;
  }
  case 'quemDemandou':return ad.instituicao||ad.origem||'';
  case 'evidenciaProblema':return ad.evidencia||'';
  case 'partesDissertacao':{
    const parts=[];
    if(ev('e5','pergunta'))parts.push('problema e pergunta científica');
    if(ev('e5','objetivoGeral'))parts.push('objetivos da pesquisa');
    if(ev('e5','delineamento'))parts.push('material e métodos previstos');
    return parts.join('; ');
  }
  case 'recursosAplicacao':return join(extra().recursosHumanos,extra().infraestrutura,extra().dadosSistemas);
  case 'dadosSistemas':return join(ev('e10','dadosTenho')?'Dados já disponíveis: '+ev('e10','dadosTenho'):'',
    ev('e10','dadosFaltam')?'Dados necessários: '+ev('e10','dadosFaltam'):'');
  case 'criteriosVal':return e.validacao||'';
  case 'solucoesAtuais':return e.diferencial||'';
  case 'modalidadeOutra':return '';
  case 'transferenciaOutra':return '';
  case 'aderenciaArea':return e.tipoCapes&&ev('e1','area')?join('Produto '+e.tipoCapes,'área de concentração '+ev('e1','area')):'';
  case 'aderenciaLinha':return e.tipoCapes&&ev('e1','linha')?join('Produto '+e.tipoCapes,'linha '+ev('e1','linha')):'';
  case 'aderenciaProjeto':return e.vinculacao||'';
  case 'modoUso':return e.usuario||'';

  case 'melhoriaPrevista':return e.mudanca||ev('e7','oQueMuda')||'';
  case 'descricaoTransferencia':return join((e.transfPrev||[]).join('; '),(e.hospedagem||[]).join('; '));
  case 'meiosVerificacao':return e.evidencias||'';
  case 'parcerias':return ev('e8','parceiros');
  default:return '';
 }
}
function ler(c){
 const extraVal=extra()[c.id];
 if(extraVal!==undefined && extraVal!==null && (Array.isArray(extraVal)||extraVal!==''))return extraVal;
 if(c.source.startsWith('en:')){
   const key=c.source.slice(3),val=en()[key];
   if(c.type==='checks'){
     if(!Array.isArray(val))return [];
     return [...new Set(val.map(x=>corrigirOpcao(x,c.options)).filter(Boolean))];
   }
   if(c.type==='select')return corrigirOpcao(val,c.options);
   if(val!==undefined&&val!==null&&String(val).trim()!=='')return val;
   return derived(c);
 }
 if(c.source.startsWith('v:')){
   const parts=c.source.slice(2).split('.');
   return v(parts[0],parts[1]);
 }
 return derived(c)||(c.type==='checks'?[]:'');
}
function gravar(id,value){
 const c=allById[id];if(!c||secoes[16].campos.includes(c))return;
 if(c.source.startsWith('en:')){
   en()[c.source.slice(3)]=value;
 }else if(c.source.startsWith('v:')){
   const [a,b]=c.source.slice(2).split('.');
   setV(a,b,value);
 }else{
   extra()[id]=value;
 }
 salvar();
 if(['participacao','tipoInovacao','complexidade','etica','dadosPessoais','sigilo'].includes(id)&&typeof desenharEstacao==='function')desenharEstacao();
}
function controles(c){
 const val=ler(c),id='anexo-ii-'+c.id;
 if(c.type==='select'){
   return '<select id="'+id+'" onchange="ANEXO_II.definir(\''+c.id+'\',this.value)">'+
    '<option value="">Selecione</option>'+c.options.map(o=>'<option value="'+esc(o)+'"'+(val===o?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select>';
 }
 if(c.type==='checks'){
  const selected=Array.isArray(val)?val:[];
  return '<div class="opcoes">'+c.options.map(o=>{
    const js=JSON.stringify(o).replace(/"/g,'&quot;');
    return '<label class="opcao'+(selected.includes(o)?' marcada':'')+'"><input type="checkbox"'+(selected.includes(o)?' checked':'')+
      ' onchange="ANEXO_II.marcar(\''+c.id+'\','+js+',this.checked)">'+esc(o)+'</label>';
  }).join('')+'</div>';
 }
 const handler='oninput="ANEXO_II.definir(\''+c.id+'\',this.value)"';
 if(c.type==='text')return '<input id="'+id+'" type="text" value="'+esc(val)+'" '+handler+'>';
 const hint=c.id==='descricao250'?'<div class="dica">Máximo de 250 palavras, conforme o Anexo II. Não confundir com o resumo do projeto acadêmico.</div>':'';
 return hint+'<textarea id="'+id+'" rows="'+(c.id==='descricao250'?5:3)+'" '+handler+'>'+esc(val)+'</textarea>';
}
/* O aluno vê somente complementos necessários, no contexto das dez estações.
 * Opcional: só ativa no percurso ProfÁgua com PTT selecionado. */
function htmlEstacao(est){
 if(!LOCAL[est]||!window.modoIN||!window.modoIN())return '';
 const nomes={e1:'Identificação institucional',e4:'Problema e sua relação com a gestão pública',
   e5:'Conhecimento científico a transformar em solução',e6:'Concepção, inovação e validação do produto',
   e7:'Usuários, aplicação e alcance',e8:'Impacto e condições de implantação',
   e9:'Participação durante o desenvolvimento',e10:'Recursos e requisitos necessários'};
 const ids=LOCAL[est];
 const participantes=ler(allById.participacao);
 const selected=ler(allById.tipoInovacao),complex=ler(allById.complexidade);
 const items=ids.filter(id=>{
   if(id==='tipoInovacaoOutra' && !(Array.isArray(selected)&&selected.includes('outra')))return false;
   if(id==='complexidadeOutros' && !(Array.isArray(complex)&&complex.includes('outros')))return false;
   if(id==='transferenciaOutra' && !(Array.isArray(en().transfPrev)&&en().transfPrev.some(x=>norm(x)==='outra')))return false;
   if(['atores','formaParticipacao','etapaParticipacao','contribuicaoAtores','acordos'].includes(id)&&participantes!=='Sim')return false;
   if(id==='eticaDocumento' && !['aprovação necessária','aprovação obtida','análise em andamento'].includes(ler(allById.etica)))return false;
   if(id==='medidasDados' && !['envolve dados pessoais','envolve dados pessoais sensíveis'].includes(ler(allById.dadosPessoais)))return false;
   if(id==='sigiloJustificativa' && !['acesso parcialmente restrito','sigilo temporário','sigilo integral justificado'].includes(ler(allById.sigilo)))return false;
   return true;
 });
 if(!items.length)return '';
 const done=items.filter(id=>{
   const x=ler(allById[id]);return Array.isArray(x)?x.length:ascii(x).trim();
 }).length;
 let out='<details class="anexo-ii-complemento"'+(done<items.length?' open':'')+'><summary>'+
  '<strong>ProfÁgua — complemento necessário nesta estação</strong>'+
  '<span> '+done+'/'+items.length+' itens respondidos</span></summary>'+
  '<p class="dica">'+esc(nomes[est])+'. Não repita o que já foi respondido: o Plano do PTT será gerado automaticamente a partir das dez estações.</p>';
 items.forEach(id=>{
   const c=allById[id];
   out+='<div class="campo"><label for="anexo-ii-'+id+'">'+esc(c.label)+'</label>'+controles(c)+'</div>';
 });
 out+='</details>';
 return out;
}
function resumo(){
 if(!window.modoIN||!window.modoIN())return '';
 const list=secoes.slice(0,-1).flatMap(x=>x.campos);
 const required=list.filter(c=>!['tipoSecundaria','coorientador','tipoInovacaoOutra','complexidadeOutros','modalidadeOutra','transferenciaOutra','numeroUsuarios','projetoEstruturante'].includes(c.id));
 const supplied=required.filter(c=>{const x=ler(c);return Array.isArray(x)?x.length:ascii(x).trim()}).length;
 return '<div class="condicional bloco-in anexo-ii-resumo">'+
   '<h3>Plano do Produto Técnico — Anexo II</h3>'+
   '<div class="sub">O Anexo II NÃO é um questionário extra. O plano é montado com as respostas registradas ao longo das dez estações. As poucas questões adicionais aparecem nas abas correspondentes.</div>'+
   '<p class="dica"><strong>'+supplied+' de '+required.length+' informações de planejamento disponíveis.</strong> Campos sem informação serão sinalizados no arquivo; alguns campos são condicionais ou serão completados pelo orientador.</p>'+
   '<button class="ouro" onclick="baixarPlanoPTT()">Gerar Plano do PTT (Anexo II)</button>'+
   '<p class="dica">A manifestação final e as assinaturas da seção 17 não são preenchidas pelo aluno.</p></div>';
}
function html(){
 const quantidade=secoes.slice(0,-1).flatMap(s=>s.campos).filter(c=>{
   const val=ler(c);return Array.isArray(val)?val.length>0:ascii(val).trim()!=='';
 }).length;
 const esperado=secoes.slice(0,-1).flatMap(s=>s.campos).length;
 let output='<div class="condicional bloco-in anexo-ii-form">'+
  '<h3>ANEXO II — Plano de Desenvolvimento do Produto Técnico-Tecnológico</h3>'+
  '<div class="sub">Correspondência direta com as 17 seções do Anexo II da minuta PROFÁGUA Nº XXXX/2026. Os campos existentes das dez estações são reutilizados. Os demais são preenchidos aqui, na Estação 6. Não estão incluídos formulários de qualificação, defesa ou pós-defesa.</div>'+
  '<div class="aviso-norma">O número da Instrução Normativa consta como XXXX/2026 no arquivo recebido. Confira se a versão foi aprovada antes do protocolo. O Anexo II não é a dissertação: ele descreve o PTT previsto e sua futura validação. A seção 17 é reservada ao orientador.</div>'+
  '<p class="dica"><strong>Campos com informação: '+quantidade+'/'+esperado+'</strong> (contagem informativa; campos condicionais podem não se aplicar). Use “não se aplica” com justificativa quando necessário.</p>';
 secoes.forEach((sec,i)=>{
  output+='<details class="anexo-ii-secao"'+(i===0||i===1?' open':'')+'><summary><strong>'+esc(sec.titulo)+'</strong></summary>';
  if(sec.orientador)output+='<p class="dica">A manifestação e as assinaturas são de responsabilidade do orientador. O discente não deve marcar aprovação em nome dele. O rascunho exportado reserva esses campos em branco.</p>';
  else sec.campos.forEach(c=>{output+='<div class="campo"><label for="anexo-ii-'+c.id+'">'+esc(c.label)+'</label>'+controles(c)+'</div>';});
  if(sec.orientador)output+='<p class="dica">Manifestação: ( ) aprovado &nbsp; ( ) aprovado com ajustes &nbsp; ( ) reformulação necessária. Comentários: __________. Assinatura discente: __________. Assinatura orientador: __________. Data: __________.</p>';
  output+='</details>';
 });
 output+='<button class="ouro" onclick="ANEXO_II.baixar()">Baixar Plano de Desenvolvimento — Anexo II (.txt)</button>'+
  '<p class="dica">No documento exportado, os itens não respondidos aparecem como [PENDENTE]. As informações já existentes no Astrolábio permanecem intactas.</p></div>';
 return output;
}
function format(v){
 if(Array.isArray(v))return v.length?v.join('; '):'[PENDENTE]';
 return ascii(v).trim()||'[PENDENTE]';
}
function baixar(){
 const l=[];
 l.push('ANEXO II');
 l.push('PLANO DE DESENVOLVIMENTO DO PRODUTO TÉCNICO-TECNOLÓGICO');
 l.push('Minuta da Instrução Normativa ProfÁgua Nº XXXX/2026');
 l.push('Rascunho do discente, produzido no Astrolábio em '+new Date().toLocaleDateString('pt-BR')+'.');
 l.push('Aprovação e assinaturas dependem de manifestação do orientador.');
 for(const s of secoes){
  l.push('');
  l.push(s.titulo.toUpperCase());
  if(s.orientador){
   l.push('Manifestação do orientador: ( ) aprovado  ( ) aprovado com ajustes  ( ) reformulação necessária');
   l.push('Comentários: _________________________________________________________');
   l.push('Assinatura do discente: ______________________________________________');
   l.push('Assinatura do orientador: ____________________________________________');
   l.push('Data: ____/____/________');
   continue;
  }
  s.campos.forEach(c=>{
   const ans=format(ler(c));
   l.push(c.label+': '+ans);
   if(c.id==='descricao250'&&ans!=='[PENDENTE]'){
    const count=ans.trim().split(/\s+/).length;
    if(count>250)l.push('  [ATENÇÃO: descrição com '+count+' palavras; limite do Anexo II = 250.]');
   }
  });
 }
 l.push('');
 l.push('FIM DO ANEXO II — RASCUNHO. Nada dos demais anexos foi incluído.');
 const nome=ascii(v('e1','nome')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'discente';
 baixarBlob(new Blob([l.join('\n')],{type:'text/plain;charset=utf-8'}),'anexo-II-plano-PTT-'+nome+'.txt');
}
window.ANEXO_II={
 secoes,
 htmlEstacao,resumo,
 ler:function(id){return ler(allById[id]);},
 definir:gravar,
 marcar:function(id,op,checked){
  const c=allById[id];if(!c)return;
  const list=Array.isArray(ler(c))?ler(c).slice():[];
  const next=checked?[...new Set(list.concat([op]))]:list.filter(x=>x!==op);
  gravar(id,next);
 },
 html,baixar,
 diagnostico:function(){
  return secoes.map(x=>({secao:x.titulo,pendentes:x.orientador?['Manifestação e assinaturas: orientador']:x.campos.filter(c=>format(ler(c))==='[PENDENTE]').map(c=>c.label)}));
 }
};
window.htmlConformidade=html;
window.baixarPlanoPTT=baixar;
const st=document.createElement('style');
st.textContent='.anexo-ii-secao{margin:14px 0;border:2px solid #bfd3d9;background:#fff;border-radius:6px;padding:0 14px 10px}'+
 '.anexo-ii-secao>summary{cursor:pointer;padding:12px 4px;color:#07465e;font-size:17px}'+
 '.anexo-ii-secao[open]>summary{border-bottom:1px solid #cbd9dd;margin-bottom:12px}'+
 '.anexo-ii-secao .campo{margin-bottom:14px}'+
 '.anexo-ii-complemento{margin:22px 0;padding:12px 16px;border:2px solid #a5c6ca;border-left:5px solid #2e6e66;background:#f8fcfa;border-radius:7px}'+
 '.anexo-ii-complemento summary{cursor:pointer;color:#084c63}'+
 '.anexo-ii-complemento summary span{font-size:13px;color:#496a70;margin-left:10px}'+
 '.anexo-ii-complemento .campo{margin-top:13px}';
document.head.appendChild(st);
})();
