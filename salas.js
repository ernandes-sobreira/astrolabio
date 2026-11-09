/* Contas, salas e escrita compartilhada. Nunca contém credenciais administrativas. */
(async function(){
'use strict';
const SDK='https://www.gstatic.com/firebasejs/12.4.0/';
const panel=document.createElement('section');panel.id='salas-panel';panel.setAttribute('aria-label','Conta e salas');
panel.innerHTML='<div id="salas-save-info"><div id="salas-status" role="status" aria-live="polite">Conectando ao seu percurso…</div><small id="salas-autosave-note">Salvamento automático</small></div><div class="salas-toolbar"><button id="salas-save-now" type="button">Salvar agora</button><button id="salas-open" title="Abrir projetos e espaços de orientação">Meus projetos</button></div>';
document.body.prepend(panel);
const brands=document.createElement('div');brands.id='salas-brands';brands.setAttribute('aria-label','Instituições');brands.innerHTML=[['estado','Estado de Mato Grosso'],['unemat','Brasão da UNEMAT'],['unematLogo','UNEMAT'],['capes','CAPES'],['ana','Agência Nacional de Águas e Saneamento Básico']].map(([key,name])=>'<img src="data:image/png;base64,'+window.PROFAGUA_MARCAS[key]+'" alt="'+name+'">').join('');panel.after(brands);
const style=document.createElement('style');style.textContent=`#salas-brands{display:flex;flex-wrap:wrap;gap:22px;justify-content:center;align-items:center;background:white;padding:14px}#salas-brands img{max-height:54px;max-width:190px;width:auto;height:auto;object-fit:contain}#salas-panel{background:#f3f7f4;border-bottom:1px solid #cbd6cf;padding:10px 20px;display:flex;justify-content:space-between;gap:10px;align-items:center;font:14px sans-serif;position:sticky;top:0;z-index:1000}#salas-panel button,#salas-dialog button{cursor:pointer;padding:10px 14px;border:1px solid #a5b6ac;border-radius:6px;background:#fff;color:#203c30}#salas-dialog{width:min(640px,90vw);max-height:88vh;border:1px solid #bdcfc3;border-radius:12px;padding:24px;color:#203c30;font:16px/1.5 sans-serif}#salas-dialog::backdrop{background:#12251fbb}#salas-dialog input,#salas-dialog select{display:block;box-sizing:border-box;width:100%;padding:11px;margin:5px 0 14px;border:1px solid #9daf9f;border-radius:5px;font:inherit}#salas-dialog button{margin:4px}#salas-dialog h2{margin-top:0}#salas-dialog .room{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #ddd;padding:10px 0;gap:10px}#salas-dialog label{display:block}#salas-message{white-space:pre-wrap}#salas-dialog code{display:block;overflow-wrap:anywhere;background:#eff4ef;padding:12px;user-select:all}body.salas-locked main{pointer-events:none;opacity:.5}#salas-panel #salas-save-info{flex:1;min-width:0}#salas-panel #salas-autosave-note{display:block;color:#54756b;font-size:11px}#salas-panel .salas-toolbar{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}#salas-panel #salas-save-now{background:#e5f1eb;color:#123f3b;border:1px solid #abc9b7;font-weight:750}#salas-dialog .salas-danger{color:#9f2929;background:#fff3f0;border:1px solid #ecc5be}#salas-dialog .salas-danger:hover{background:#ffe5df}#salas-dialog .salas-delete-warning{border:1px solid #edbdb5;background:#fff7f5;color:#7e2b23;border-radius:12px;padding:13px;margin:12px 0}#salas-dialog .salas-delete-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}@media(max-width:560px){#salas-panel .salas-toolbar{gap:3px}#salas-panel #salas-save-now{padding:8px}#salas-panel #salas-autosave-note{font-size:10px}}#salas-dialog .salas-room-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px}#salas-dialog .salas-invite-card{border:1px solid #dbe7df;background:#fff;border-radius:12px;padding:12px;margin:10px 0}#salas-dialog .salas-invite-card>strong{display:block;margin-bottom:8px}#salas-dialog .salas-invite-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}@media(max-width:560px){#salas-dialog .salas-room-card{align-items:flex-start;flex-wrap:wrap}#salas-dialog .salas-room-actions{width:100%;justify-content:flex-start}}`;style.textContent+=`
#salas-panel{background:rgba(248,251,249,.96);border-bottom:1px solid #dfe9e4;padding:9px clamp(12px,3vw,28px);font:600 13px/1.3 system-ui,sans-serif;color:#35534c;backdrop-filter:blur(12px)}
#salas-panel #salas-status{max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#salas-panel #salas-open{border:0;border-radius:999px;background:#123f3b;color:white;padding:10px 17px;font:700 14px system-ui,sans-serif;box-shadow:0 5px 16px #123f3b22}
#salas-panel #salas-open:hover{background:#0b5a51;transform:translateY(-1px)}
#salas-dialog{margin:auto;width:min(720px,calc(100vw - 24px));max-height:min(90dvh,900px);overflow:auto;padding:0;border:1px solid #e4ece8;border-radius:24px;background:#f7faf8;color:#183b36;font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 28px 90px #071f1c55}
#salas-dialog::backdrop{background:#071f1cb5;backdrop-filter:blur(7px)}
#salas-dialog .salas-shell{padding:clamp(15px,4vw,28px)}
#salas-dialog .salas-hero{position:relative;overflow:hidden;padding:clamp(20px,4vw,30px);border-radius:20px;color:white;background:radial-gradient(circle at 90% 5%,#54b69b77 0,transparent 36%),linear-gradient(135deg,#123f3b,#236e61 72%,#3a8b72)}
#salas-dialog .salas-hero{padding-right:62px}
#salas-dialog .salas-close{position:absolute;z-index:2;top:12px;right:12px;display:grid;place-items:center;width:38px;height:38px;margin:0;border:1px solid #ffffff66;border-radius:50%;background:#ffffff18;color:white;font:400 26px/1 system-ui,sans-serif}
#salas-dialog .salas-close:hover{background:#ffffff32}
#salas-dialog .salas-return-hint{margin-top:9px!important;color:#f0fbf6!important;font-size:12px!important}
#salas-dialog .salas-hero:after{content:"";position:absolute;width:145px;height:145px;right:-48px;bottom:-72px;border:1px solid #ffffff55;border-radius:50%;box-shadow:0 0 0 17px #ffffff0d,0 0 0 34px #ffffff0a}
#salas-dialog .salas-eyebrow{display:inline-flex;align-items:center;gap:7px;margin-bottom:10px;padding:5px 10px;border:1px solid #ffffff55;border-radius:999px;background:#ffffff12;color:#effff8;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase}
#salas-dialog .salas-hero h2{margin:0 0 8px;color:#fff;font-size:clamp(23px,5vw,32px);line-height:1.12;letter-spacing:-.6px}
#salas-dialog .salas-hero p{max-width:560px;margin:0;color:#e6f4ef;font-size:14px}
#salas-dialog .salas-account{display:inline-flex;max-width:100%;margin-top:16px;padding:7px 11px;border:1px solid #ffffff38;border-radius:999px;background:#0b302d55;color:white;font-size:12px;overflow-wrap:anywhere}
#salas-dialog .salas-explainer{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;margin:16px 0 21px;padding:15px 16px;border:1px solid #d9e9e1;border-radius:16px;background:#edf5f1}
#salas-dialog .salas-explainer .salas-number{display:grid;place-items:center;width:38px;height:38px;border-radius:13px;background:#d7eee3;color:#146b55;font-size:19px}
#salas-dialog .salas-explainer strong{display:block;margin-bottom:2px;color:#173e37}
#salas-dialog .salas-explainer span{display:block;color:#49635b;font-size:13px}
#salas-dialog .salas-section{margin:20px 0}
#salas-dialog .salas-section-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:10px}
#salas-dialog .salas-section h3{margin:0;color:#173e37;font:750 17px/1.3 system-ui,sans-serif;letter-spacing:-.2px}
#salas-dialog .salas-caption{color:#6c8179;font-size:12px}
#salas-dialog .salas-room-card{display:flex;align-items:center;gap:12px;margin:9px 0;padding:13px;border:1px solid #e2ebe6;border-radius:16px;background:white;box-shadow:0 4px 15px #153b3410}
#salas-dialog .salas-room-icon{display:grid;place-items:center;flex:none;width:42px;height:42px;border-radius:14px;background:#e6f3ec;font-size:20px}
#salas-dialog .salas-room-copy{flex:1;min-width:0}
#salas-dialog .salas-room-copy strong{display:block;overflow-wrap:anywhere;color:#183b36;font-size:15px}
#salas-dialog .salas-room-copy small{display:block;color:#6c8179;font-size:12px}
#salas-dialog .salas-primary,#salas-dialog .salas-secondary{border:0;border-radius:12px;padding:10px 15px;font:700 13px system-ui,sans-serif;transition:transform .15s,background .15s}
#salas-dialog .salas-primary{background:#174f46;color:white}
#salas-dialog .salas-primary:hover{background:#0e6a59;transform:translateY(-1px)}
#salas-dialog .salas-secondary{background:#e9f2ed;color:#21483e}
#salas-dialog .salas-secondary:hover{background:#dcece3}
#salas-dialog .salas-empty{padding:18px;border:1px dashed #c5d8ce;border-radius:16px;background:#fff;color:#577168;text-align:center}
#salas-dialog details.salas-fold{margin:12px 0;border:1px solid #e1eae5;border-radius:16px;background:white}
#salas-dialog details.salas-fold>summary{display:flex;align-items:center;gap:9px;padding:15px 16px;color:#244d43;font-weight:750;cursor:pointer;list-style:none}
#salas-dialog details.salas-fold>summary::-webkit-details-marker{display:none}
#salas-dialog details.salas-fold>summary:after{content:"＋";margin-left:auto;color:#448071;font-size:18px}
#salas-dialog details.salas-fold[open]>summary:after{content:"−"}
#salas-dialog .salas-fold-body{padding:0 16px 16px;color:#526c63;font-size:13px}
#salas-dialog .salas-fold-body p{margin:0 0 11px}
#salas-dialog .salas-fold-body label{display:block;margin:10px 0 4px;color:#34584e;font-size:13px;font-weight:650}
#salas-dialog .salas-fold-body input{margin:5px 0 10px;border:1px solid #d2e0d8;border-radius:11px;background:#fbfdfc}
#salas-dialog .salas-check{display:flex!important;align-items:start;gap:8px}
#salas-dialog .salas-check input{display:inline-block!important;width:auto!important;margin:3px 0 0}
#salas-dialog .salas-backup{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:14px 0;padding:13px 15px;border:1px solid #e6d9ae;border-radius:14px;background:#fffaf0;color:#6d581f;font-size:13px}
#salas-dialog .salas-backup strong{display:block;color:#574516}
#salas-dialog .salas-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px;padding-top:15px;border-top:1px solid #e2ebe6}
#salas-dialog .salas-footer button{border:0;background:transparent;color:#657a72;font-size:12px}
#salas-dialog #salas-message{margin:12px 2px 0;color:#a13c2d}
#salas-dialog #login-google{display:block;width:100%;margin:17px 0 8px;border-radius:14px;background:#174f46;color:white;font:750 16px system-ui,sans-serif;padding:15px}
#salas-dialog details:not(.salas-fold){margin-top:16px;padding:13px 15px;border:1px solid #e1eae5;border-radius:14px;background:#fff}
#salas-dialog details:not(.salas-fold)>summary{color:#34584e;font-weight:700;cursor:pointer}
@media(max-width:520px){
#salas-brands{gap:12px;padding:8px}#salas-brands img{max-height:34px;max-width:120px}
#salas-panel{gap:8px;padding:8px 11px}
#salas-panel #salas-status{max-width:59%;font-size:12px}
#salas-dialog{width:calc(100vw - 14px);max-height:92dvh;border-radius:20px}
#salas-dialog .salas-shell{padding:12px}
#salas-dialog .salas-room-card{gap:9px;padding:10px}
#salas-dialog .salas-primary,#salas-dialog .salas-secondary{padding:9px 11px}
#salas-dialog .salas-backup{align-items:flex-start;flex-direction:column}
#salas-dialog .salas-footer{align-items:flex-start;flex-direction:column}
}
`;document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='salas-dialog';document.body.append(dialog);
/* ---------- estado da sincronização ---------- */
let auth,db,A,F,user=null,active=null,revision=0,dirty=false,saving=false,timer=null,unsub=null,roles={},roomData=null,offline=false;
let base=null; // última versão conhecida da nuvem (ancestral comum para o merge por campo)
const LOCAL_BACKUP_KEY='astrolabio_respostas_locais_antes_da_nuvem_v1';
const CLOUD_UID_KEY='astrolabio_nuvem_uid_v1';
const clone=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
function hasValue(v){
 if(typeof v==='string')return v.trim().length>0;
 if(Array.isArray(v))return v.some(hasValue);
 if(v&&typeof v==='object')return Object.values(v).some(hasValue);
 return typeof v==='number'&&Number.isFinite(v);
}
function hasLocalResponses(data){
 return !!data&&[data.dados,data.autores,data.entrega,data.projeto,data.extensoes].some(hasValue);
}
/* As respostas que estavam neste aparelho só contam como "locais" se nunca vieram da nuvem.
 * Se o localStorage guarda a cópia da nuvem de outra conta, ela não pode ser oferecida a ninguém. */
const cloudUidAnterior=Cofre.ler(CLOUD_UID_KEY);
const pendingLocal=clone(estado);
if(!cloudUidAnterior&&hasLocalResponses(pendingLocal)&&!Cofre.ler(LOCAL_BACKUP_KEY))
 Cofre.gravar(LOCAL_BACKUP_KEY,JSON.stringify({uid:null,data:pendingLocal}));
function vincularBackup(uid){
 try{const b=JSON.parse(Cofre.ler(LOCAL_BACKUP_KEY)||'null');
  if(b&&b.uid===null&&b.data)Cofre.gravar(LOCAL_BACKUP_KEY,JSON.stringify({uid,data:b.data}));
 }catch(_){}
}
function recoveryFor(uid){
 try{
  const b=JSON.parse(Cofre.ler(LOCAL_BACKUP_KEY)||'null');if(!b)return null;
  const data=b&&b.data&&typeof b.data==='object'&&!b.dados?b.data:b;
  const dono=b&&Object.prototype.hasOwnProperty.call(b,'uid')?b.uid:null;
  if(dono&&dono!==uid)return null;
  return hasLocalResponses(data)?data:null;
 }catch(_){return null;}
}
function limparLocal(){
 estado=blank();base=null;Cofre.apagar(CHAVE);Cofre.apagar(CLOUD_UID_KEY);
 estacaoAtual=0;desenharNav();desenharEstacao();atualizarProgresso();
}
function downloadJSON(data,name){
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function copyText(text){
 if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return;}
 const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
 const ok=document.execCommand('copy');input.remove();if(!ok)throw Error('Não foi possível copiar automaticamente. Selecione e copie o texto exibido.');
}
const status=t=>{document.getElementById('salas-status').textContent=t;const n=document.getElementById('salas-autosave-note');if(n)n.textContent=t.includes('Sem salvar')||t.includes('Sem conexão')?'Falha de sincronização · use Backup JSON':t.includes('pendentes')||t.includes('Combinando')?'Salvamento automático em andamento':active?'Salvamento automático ativo':'Entre na sua sala para salvar na nuvem';};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lock(v){document.body.classList.toggle('salas-locked',v);document.querySelectorAll('main input,main textarea,main select,main [contenteditable],#arq,button.risco,button[onclick*="arq"]').forEach(el=>{el.disabled=v;});}
function msg(t){const el=document.getElementById('salas-message');if(el)el.textContent=t;}
function fail(e){const codes={'auth/invalid-credential':'Email ou senha incorretos.','auth/email-already-in-use':'Este email já está cadastrado. Use Entrar.','auth/weak-password':'Use uma senha de pelo menos 8 caracteres.','auth/unauthorized-domain':'Domínio ainda não autorizado no Firebase.','auth/popup-closed-by-user':'A janela do Google foi fechada.','auth/popup-blocked':'O navegador bloqueou a janela do Google. Permita pop-ups ou abra o Astrolábio no Chrome ou Safari, fora de aplicativos como WhatsApp e Instagram.','auth/too-many-requests':'Muitas tentativas. Aguarde e tente novamente.','permission-denied':'Você não tem permissão para esta ação.','auth/network-request-failed':'Falha de conexão. Tente novamente.'};msg(codes[e.code]||e.message||'Não foi possível concluir.');status('Ação não concluída. Abra Meus projetos.');}
function show(html){
 const notice='<p id="salas-message" role="status"></p>';
 if(html.includes('class="salas-shell"')){const end=html.lastIndexOf('</div>');dialog.innerHTML=end>=0?html.slice(0,end)+notice+html.slice(end):html+notice;}
 else dialog.innerHTML='<div class="salas-shell">'+html+notice+'</div>';
 if(!dialog.open)dialog.showModal();
}
function btn(id,fn){const el=document.getElementById(id);if(el)el.onclick=async()=>{try{await fn();}catch(e){fail(e);}};}
function perfil(){return {nome:(user&&user.displayName)||(user&&user.email?user.email.split('@')[0]:'Participante'),email:(user&&user.email)||''};}
function nomeMembro(id){const m=(roomData&&roomData.members&&roomData.members[id])||{};return m.nome||m.email||('Participante '+String(id).slice(0,8));}
function minhaFuncao(){return user&&roles?roles[user.uid]:undefined;}

/* ---------- foco: preservar o cursor quando a tela é redesenhada por atualização remota ---------- */
function campos(){return Array.from(document.querySelectorAll('main input,main textarea,main select'));}
function snapshotFoco(){
 const el=document.activeElement;
 if(!el||!/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||!el.closest('main'))return null;
 return {i:campos().indexOf(el),start:el.selectionStart,end:el.selectionEnd,scroll:window.scrollY};
}
function restaurarFoco(f){
 if(!f||f.i<0)return;const el=campos()[f.i];if(!el)return;
 el.focus({preventScroll:true});
 try{if(typeof f.start==='number')el.setSelectionRange(f.start,f.end);}catch(_){}
 window.scrollTo(0,f.scroll);
}

/* ---------- merge por campo (três vias): base = nuvem conhecida, local = o que está na tela, remote = nuvem nova ---------- */
const isObj=x=>x&&typeof x==='object'&&!Array.isArray(x);
function merge3(b,l,r,stats){
 const L=JSON.stringify(l),R=JSON.stringify(r),B=JSON.stringify(b);
 if(L===R)return l===undefined?undefined:clone(l);
 if(L===B)return r===undefined?undefined:clone(r);   // só o remoto mudou
 if(R===B)return clone(l);                            // só o local mudou
 if(isObj(l)&&isObj(r)){
  const out={};
  new Set([...Object.keys(isObj(b)?b:{}),...Object.keys(l),...Object.keys(r)]).forEach(k=>{
   const v=merge3(isObj(b)?b[k]:undefined,l[k],r[k],stats);
   if(v!==undefined)out[k]=v;
  });
  return out;
 }
 stats.conflitos++;return clone(l);                   // ambos mudaram o mesmo campo: quem está digitando prevalece
}

/* ---------- aplicar dados na tela ---------- */
function redesenhar(){
 const f=snapshotFoco();
 desenharNav();atualizarProgresso();
 if(telaAtual==='form')desenharEstacao();
 else if(telaAtual==='projeto'&&typeof abrirProjeto==='function')abrirProjeto();
 else if(telaAtual==='revisao'&&typeof abrirRevisaoAcademica==='function')abrirRevisaoAcademica();
 else irPara(telaAtual);
 restaurarFoco(f);
}
function apply(data){
 estado=clone(data);if(typeof sanearEstado==='function')sanearEstado();
 base=clone(estado);
 Cofre.gravar(CHAVE,JSON.stringify(estado));Cofre.gravar(CLOUD_UID_KEY,user.uid);
 redesenhar();lock(minhaFuncao()==='viewer');
}
function blank(){return {versao:1,criadoEm:new Date().toISOString(),atualizadoEm:null,dados:{},autores:[],entrega:{formatos:[]}};}

/* ---------- login ---------- */
function login(){lock(true);show('<div class="salas-shell"><header class="salas-hero"><span class="salas-eyebrow">🧭 Astrolábio · espaço de orientação</span><h2>Vamos começar seu percurso</h2><p>Entre com sua conta Google. Seu projeto ficará salvo na nuvem e disponível em qualquer aparelho quando você usar esta mesma conta.</p></header><div class="salas-explainer"><div class="salas-number">✦</div><div><strong>Sem senha nova e sem código para começar</strong><span>Na primeira entrada, criamos seu espaço privado. Depois, você pode convidar outra pessoa para acompanhar ou escrever junto em qualquer uma das suas salas.</span></div></div><button id="login-google">Continuar com Google</button><details><summary>Já tenho uma conta com email e senha</summary><p>Use o mesmo email e senha que cadastrou antes. Para reencontrar seu percurso em outros aparelhos, entre sempre pelo mesmo método e pela mesma conta.</p><form id="login-form"><label>Email<input id="login-email" type="email" autocomplete="username" required></label><label>Senha<input id="login-password" type="password" autocomplete="current-password" minlength="8" required></label><button type="submit">Entrar com email</button><button type="button" id="signup">Criar conta com email</button><button type="button" id="reset">Recuperar senha</button></form></details></div>');
const credentials=()=>({email:document.getElementById('login-email').value.trim(),password:document.getElementById('login-password').value});
btn('login-google',()=>A.signInWithPopup(auth,new A.GoogleAuthProvider()));
document.getElementById('login-form').onsubmit=async e=>{e.preventDefault();try{const c=credentials();await A.signInWithEmailAndPassword(auth,c.email,c.password);}catch(err){fail(err);}};
btn('signup',async()=>{if(!document.getElementById('login-form').reportValidity())return;const c=credentials();await A.createUserWithEmailAndPassword(auth,c.email,c.password);});
btn('reset',async()=>{const c=credentials();if(!c.email)throw Error('Informe seu email.');await A.sendPasswordResetEmail(auth,c.email);msg('Se houver uma conta para este email, você receberá as instruções de recuperação.');});}

/* ---------- salas ---------- */
function novaSala(title,data){
 return F.addDoc(F.collection(db,'rooms'),{title,owner:user.uid,memberIds:[user.uid],roles:{[user.uid]:'owner'},members:{[user.uid]:perfil()},data,revision:0,createdAt:F.serverTimestamp(),updatedAt:F.serverTimestamp(),updatedBy:user.uid});
}
const codigoDaURL=()=>new URLSearchParams(location.search).get('convite')||'';
function limparURL(){const u=new URL(location.href);u.searchParams.delete('convite');history.replaceState({},'',u);}
function linkConvite(code){const u=new URL(location.href);u.searchParams.set('convite',code);u.hash='';return u.href;}
async function list(){if(!user)return login();
const snap=await F.getDocs(F.query(F.collection(db,'rooms'),F.where('memberIds','array-contains',user.uid)));
const recoveryCopy=recoveryFor(user.uid);
if(snap.empty&&!Cofre.ler('astrolabio_skip_autoroom_'+user.uid)){
 const created=await novaSala('Meu percurso acadêmico',recoveryCopy||blank());
 await open(created.id);
 status('Seu percurso está salvo na sua conta. Use a mesma conta para acessar de outros dispositivos.');
 if(codigoDaURL()){try{await entrarComCodigo(codigoDaURL());}catch(e){fail(e);}}
 return;
}
const inviteValue=codigoDaURL();
const backupNeeded=!!recoveryCopy&&!snap.docs.some(d=>JSON.stringify(d.data().data)===JSON.stringify(recoveryCopy));
const backupCard=backupNeeded?'<aside class="salas-backup"><div><strong>Encontramos respostas antigas neste aparelho</strong>Elas foram escritas antes de você entrar na conta. Baixe-as ou use a opção "Incluir as respostas que já estavam neste aparelho" ao criar um projeto.</div><button class="salas-secondary" id="download-local">Baixar cópia</button></aside>':'';
const roomCards=snap.docs.map(d=>{
 const r=d.data(),role=r.roles[user.uid];
 const dono=r.owner===user.uid?'':' · de '+esc((r.members&&r.members[r.owner]&&(r.members[r.owner].nome||r.members[r.owner].email))||'outro participante');
 const access=role==='owner'?'Seu espaço privado':role==='editor'?'Compartilhado · pode editar'+dono:'Compartilhado · somente leitura'+dono;
 const convidar=role==='owner'?'<button class="salas-secondary" data-share-room="'+esc(d.id)+'" aria-label="Convidar outra pessoa para '+esc(r.title)+'">Convidar outra pessoa</button>':'';
  const excluir=role==='owner'?'<button class="salas-secondary salas-danger" data-delete-room="'+esc(d.id)+'" aria-label="Excluir permanentemente o projeto '+esc(r.title)+'">Excluir projeto</button>':'';
  return '<article class="salas-room-card"><div class="salas-room-icon" aria-hidden="true">🧭</div><div class="salas-room-copy"><strong>'+esc(r.title)+'</strong><small>'+access+'</small></div><div class="salas-room-actions"><button class="salas-primary" data-room="'+esc(d.id)+'">Abrir</button>'+convidar+excluir+'</div></article>';
}).join('');
const spaces=roomCards||'<div class="salas-empty">Seu primeiro percurso já está sendo preparado. Ele fica salvo na sua conta.</div>';
const inviteOptions=active?'<button class="salas-secondary" id="back-room">Voltar ao percurso</button>'+(minhaFuncao()==='owner'?'<button class="salas-secondary" id="sharing">Convidar outra pessoa</button>':''):'';
show('<div class="salas-shell"><header class="salas-hero"><button class="salas-close" id="close-list" type="button" aria-label="Fechar e voltar ao projeto">×</button><span class="salas-eyebrow">🧭 Astrolábio · espaço de orientação</span><h2>Seus projetos, em um só lugar</h2><p>Continue seu percurso, crie outro projeto ou convide outras pessoas para uma sala específica.</p><p class="salas-return-hint"><b>Já tem um projeto?</b> Toque em “Abrir” no cartão. O X fecha esta janela e volta ao formulário atual.</p><span class="salas-account">Conectado como '+esc(user.email)+'</span></header><div class="salas-explainer"><div class="salas-number">✦</div><div><strong>O que é uma sala?</strong><span>Cada projeto tem sua própria sala, com participantes e códigos de convite independentes. Você pode convidar qualquer pessoa para ler ou escrever junto.</span></div></div>'+backupCard+'<section class="salas-section"><div class="salas-section-head"><h3>Seus percursos</h3><span class="salas-caption">'+snap.docs.length+' '+(snap.docs.length===1?'espaço':'espaços')+'</span></div>'+spaces+'</section><details class="salas-fold"><summary>＋ Criar outro projeto</summary><div class="salas-fold-body"><p>Crie uma sala privada para organizar outro projeto de pesquisa. Você poderá convidar outras pessoas para essa sala depois.</p><label for="new-title">Nome do projeto</label><input id="new-title" maxlength="140" placeholder="Ex.: Minha dissertação sobre o Pantanal">'+(recoveryCopy?'<label class="salas-check"><input id="import-local" type="checkbox">Incluir as respostas que já estavam neste aparelho</label>':'')+'<button class="salas-primary" id="create-room">Criar projeto</button></div></details><details class="salas-fold"'+(inviteValue?' open':'')+'><summary>↗ Recebi convite para uma sala compartilhada</summary><div class="salas-fold-body"><p>O link já contém o código de convite, então não precisa digitá-lo. Quem recebeu apenas o código pode colá-lo abaixo. É necessário entrar com a própria conta para participar.</p><label for="join-code">Código do convite</label><input id="join-code" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Cole aqui o código recebido" value="'+esc(inviteValue)+'"><button class="salas-primary" id="join-room">Entrar na sala compartilhada</button></div></details><div class="salas-footer">'+inviteOptions+'<button id="logout">Sair da conta</button></div></div>');
btn('close-list',()=>{dialog.close();lock(active?minhaFuncao()==='viewer':false);status(active?roomData.title+' · salvo na nuvem':'Abra um projeto em Meus projetos para salvar na nuvem.');});
dialog.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>open(b.dataset.room).catch(fail));
 dialog.querySelectorAll('[data-share-room]').forEach(b=>b.onclick=async()=>{try{await open(b.dataset.shareRoom);await sharing();}catch(e){fail(e);}});
 dialog.querySelectorAll('[data-delete-room]').forEach(b=>b.onclick=async()=>{try{await prepararExclusao(b.dataset.deleteRoom);}catch(e){fail(e);}});
if(recoveryCopy)btn('download-local',()=>downloadJSON(recoveryCopy,'astrolabio-respostas-locais-backup.json'));
btn('create-room',async()=>{if(dirty)throw Error('Aguarde o salvamento das alterações pendentes antes de trocar de sala.');const title=document.getElementById('new-title').value.trim();if(!title)throw Error('Dê um nome ao projeto.');const imp=document.getElementById('import-local');const data=imp&&imp.checked&&recoveryCopy?recoveryCopy:blank();const r=await novaSala(title,data);await open(r.id);});
btn('join-room',()=>entrarComCodigo(document.getElementById('join-code').value));
if(inviteValue)setTimeout(()=>document.getElementById('join-room')?.click(),0);
if(active){btn('back-room',()=>dialog.close());btn('sharing',sharing);}
btn('logout',async()=>{if(dirty)throw Error('Há alterações pendentes. Aguarde o salvamento antes de sair.');await A.signOut(auth);});}

async function entrarComCodigo(bruto){
 const code=String(bruto||'').replace(/[ \t\r\n-]/g,'').toLowerCase();
 if(!/^[a-f0-9]{32}$/.test(code))throw Error('O código precisa ter 32 caracteres. Abra o link recebido ou cole o código completo.');
 const invitation=await F.getDoc(F.doc(db,'invites',code));
 if(!invitation.exists()||invitation.data().expiresAt.toMillis()<Date.now())throw Error('Convite inválido, revogado ou expirado.');
 const i=invitation.data();
 try{await F.updateDoc(F.doc(db,'rooms',i.roomId),{memberIds:F.arrayUnion(user.uid),['roles.'+user.uid]:i.role,['members.'+user.uid]:perfil(),joinProof:code});}
 catch(e){const r=await F.getDoc(F.doc(db,'rooms',i.roomId));if(!r.exists())throw e;}
 try{await F.updateDoc(F.doc(db,'invites',code),{usedBy:F.arrayUnion(user.uid)});}catch(_){}
 limparURL();
 await open(i.roomId);
}

async function open(id){
 if(dirty)throw Error('Há alterações pendentes nesta sala. Aguarde o salvamento antes de trocar.');
 if(unsub)unsub();active=id;
 const ref=F.doc(db,'rooms',id);const first=await F.getDoc(ref);if(!first.exists())throw Error('Sala não encontrada.');
 roomData=first.data();roles=roomData.roles||{};revision=roomData.revision||0;
 apply(roomData.data||blank());if(telaAtual!=='form')abrirEstacao(0);
 dialog.close();status(roomData.title+' · '+(minhaFuncao()==='viewer'?'Somente leitura':'Salvo na nuvem'));
 unsub=F.onSnapshot(ref,s=>{
  if(!s.exists())return;const r=s.data();roles=r.roles||{};roomData=r;
  if(!r.memberIds.includes(user.uid)){acessoRemovido();return;}
  if(r.revision!==revision&&!saving){
   if(dirty){
    const stats={conflitos:0};const merged=merge3(base,estado,r.data,stats);
    revision=r.revision;base=clone(r.data);
    const f=snapshotFoco();estado=merged;Cofre.gravar(CHAVE,JSON.stringify(estado));redesenhar();restaurarFoco(f);
    dirty=JSON.stringify(estado)!==JSON.stringify(r.data);
    status(r.title+' · combinado com alterações de '+nomeMembro(r.updatedBy)+(stats.conflitos?' · sua versão prevaleceu em '+stats.conflitos+' campo(s)':''));
    if(dirty){clearTimeout(timer);timer=setTimeout(save,600);}
   }else{revision=r.revision;apply(r.data);status(r.title+' · atualizado por '+nomeMembro(r.updatedBy));}
  }
  lock(minhaFuncao()==='viewer');
 },e=>{
  if(e&&e.code==='permission-denied'){acessoRemovido();return;}
  status('Sem conexão com a nuvem. Suas alterações continuam neste aparelho.');
 });
}
function acessoRemovido(){
 if(unsub)unsub();unsub=null;const titulo=roomData&&roomData.title;active=null;dirty=false;roles={};
 lock(false);status('Seu acesso à sala '+(titulo?'"'+titulo+'" ':'')+'foi removido. A cópia na tela não será mais salvada na nuvem.');
 show('<h2>Acesso removido</h2><p>O dono da sala retirou seu acesso. O que está na tela é uma cópia local: você pode baixá-la em JSON, mas ela não será mais sincronizada.</p><button class="salas-primary" id="voltar-lista">Ir para Meus projetos</button>');
 btn('voltar-lista',list);
}
function changed(){if(!user||!active||minhaFuncao()==='viewer')return;dirty=true;status('Alterações pendentes…');clearTimeout(timer);timer=setTimeout(save,900);}
async function save(){
 if(!dirty||saving||!active)return;saving=true;
 const data=clone(estado),expected=revision,ref=F.doc(db,'rooms',active);
 try{
  await F.runTransaction(db,async tx=>{const s=await tx.get(ref);if((s.data().revision||0)!==expected)throw Error('CONFLICT');tx.update(ref,{data,revision:expected+1,updatedAt:F.serverTimestamp(),updatedBy:user.uid});});
  revision=expected+1;base=data;dirty=JSON.stringify(estado)!==JSON.stringify(data);
  status(dirty?'Alterações pendentes…':'Salvo na nuvem · '+roomData.title);
 }catch(e){
  if(e.message==='CONFLICT'){
   // Outra pessoa salvou primeiro: combinar campo a campo e tentar de novo.
   try{
    const s=await F.getDoc(ref);const r=s.data();const stats={conflitos:0};
    const merged=merge3(base,estado,r.data,stats);
    revision=r.revision;base=clone(r.data);
    const f=snapshotFoco();estado=merged;Cofre.gravar(CHAVE,JSON.stringify(estado));redesenhar();restaurarFoco(f);
    dirty=true;status('Combinando com alterações de '+nomeMembro(r.updatedBy)+'…');
   }catch(e2){status('Sem salvar na nuvem. Suas alterações continuam neste dispositivo.');}
  }else{status('Sem salvar na nuvem. Suas alterações continuam neste dispositivo.');}
 }finally{saving=false;if(dirty)timer=setTimeout(save,3000);}
}

/* ---------- exclusão definitiva, restrita à conta proprietária ---------- */
async function prepararExclusao(id){
 if(dirty||saving)throw Error('Aguarde as alterações serem salvas na nuvem antes de excluir.');
 const ref=F.doc(db,'rooms',id),registro=await F.getDoc(ref);
 if(!registro.exists())throw Error('Projeto não encontrado.');
 const sala=registro.data(),nome=sala.title;
 if(sala.owner!==user.uid)throw Error('Somente o proprietário pode excluir esse projeto.');
 const uidProprietario=user.uid;
 show('<h2>Excluir projeto permanentemente</h2><p><strong>'+esc(nome)+'</strong></p><div class="salas-delete-warning"><strong>Atenção: ação irreversível.</strong> As respostas desta sala serão apagadas para você e todos os participantes. Os convites deixarão de funcionar. Seus outros projetos serão preservados. Antes de continuar, recomendamos baixar Backup JSON da sala.</div><p>Digite o nome exato do projeto, confirme a exclusão e autentique sua conta novamente para finalizar.</p><label>Nome completo do projeto<input id="delete-room-name" autocomplete="off" spellcheck="false" placeholder="Digite exatamente o nome acima"></label><div id="delete-reauth-container"></div><p id="delete-progress" role="status" aria-live="polite"></p><div class="salas-delete-actions"><button id="delete-cancel" class="salas-secondary">Cancelar</button><button id="delete-confirm" class="salas-danger" disabled>Excluir projeto permanentemente</button></div>');
 const nomeInput=document.getElementById('delete-room-name'),botao=document.getElementById('delete-confirm');
 const senhaAtiva=user.providerData.some(p=>p.providerId==='password');
 const area=document.getElementById('delete-reauth-container');
 if(senhaAtiva)area.innerHTML='<label>Senha da conta do Astrolábio (não armazenada)<input id="delete-room-password" type="password" autocomplete="current-password" placeholder="Sua senha"></label>';
 else area.innerHTML='<p>Para sua segurança, o Google solicitará que você confirme sua conta antes de apagar o projeto.</p>';
 const verificar=()=>{botao.disabled=nomeInput.value!==nome||(senhaAtiva&&!document.getElementById('delete-room-password').value);};
 nomeInput.addEventListener('input',verificar);
 if(senhaAtiva)document.getElementById('delete-room-password').addEventListener('input',verificar);
 btn('delete-cancel',list);
 btn('delete-confirm',async()=>{
  if(nomeInput.value!==nome||botao.disabled)throw Error('Digite o nome exato do projeto.');
  // Confirmação antes do popup: navegadores podem bloquear confirm() após OAuth assíncrono.
  if(!window.confirm('CONFIRMA EXCLUSÃO DEFINITIVA de "'+nome+'"? Todos os participantes perderão acesso e todas as respostas serão apagadas. NÃO é possível desfazer.'))return;
  botao.disabled=true;botao.textContent='Confirmando identidade…';
  const progresso=document.getElementById('delete-progress');
  const informar=t=>{if(progresso&&progresso.isConnected)progresso.textContent=t;status(t);};
  try{
   informar('Aguardando confirmação de identidade…');
   if(senhaAtiva){
    const senha=document.getElementById('delete-room-password').value;
    await A.reauthenticateWithCredential(user,A.EmailAuthProvider.credential(user.email,senha));
    const senhaEl=document.getElementById('delete-room-password');
    if(senhaEl)senhaEl.value='';
   }else{
    await A.reauthenticateWithPopup(user,new A.GoogleAuthProvider());
   }
   // O popup de reautenticação concluído não significa que o Firestore já excluiu.
   if(!auth.currentUser||auth.currentUser.uid!==uidProprietario)
    throw Error('A conta autenticada é diferente da proprietária. Nenhuma exclusão foi executada.');
   await auth.currentUser.getIdToken(true);
   informar('Identidade confirmada. Excluindo sala no Firebase…');
   // Os convites precisam ser conhecidos antes de apagar a sala.
   // Uma falha de listagem NÃO deve impedir a exclusão da sala.
   let convites=[];
   try{
    const consulta=await F.getDocs(F.query(F.collection(db,'invites'),F.where('roomId','==',id)));
    convites=consulta.docs;
   }catch(e){informar('Não foi possível consultar convites; tentando excluir o projeto mesmo assim…');}
   const atual=await F.getDoc(ref);
   if(!atual.exists())throw Error('O projeto já não existe no Firebase.');
   if(atual.data().owner!==uidProprietario)throw Error('Você não é proprietário deste projeto.');
   await F.deleteDoc(ref);
   informar('Projeto apagado no Firebase. Finalizando…');
   let falhas=0;
   for(const convite of convites){try{await F.deleteDoc(convite.ref);}catch(_){falhas++;}}
   if(active===id){
    if(unsub)unsub();unsub=null;active=null;dirty=false;roomData=null;roles={};revision=0;
    limparLocal();
   }
   Cofre.gravar('astrolabio_skip_autoroom_'+uidProprietario,'1');
   try{await list();}catch(e){show('<h2>Projeto excluído</h2><p>A sala foi apagada da nuvem. Reabra Meus projetos para atualizar a lista.</p><button id="delete-back-list">Voltar a Meus projetos</button>');btn('delete-back-list',list);}
   status('Projeto excluído permanentemente.');
   if(falhas)msg('Projeto apagado, mas '+falhas+' registros de convite não puderam ser limpos. Eles não concedem acesso à sala excluída.');
  }catch(e){
   if(botao.isConnected){botao.disabled=false;botao.textContent='Tentar excluir novamente';}
   const descricao=e.code==='permission-denied'
    ?'Exclusão bloqueada pelo Firebase. Confirme se a versão nova de firebase/firestore.rules foi PUBLICADA no console. O projeto permanece intacto.'
    :e.code==='auth/popup-closed-by-user'?'A janela Google foi fechada. O projeto não foi excluído.'
    :e.code==='auth/user-mismatch'?'A conta Google selecionada não é a proprietária da sala.'
    :(e.message||'Não foi possível excluir o projeto.');
   informar('Falha na exclusão: '+descricao);
   msg(descricao);
  }
 });
}

/* ---------- compartilhamento ---------- */
async function sharing(){
 if(minhaFuncao()!=='owner')throw Error('Somente o dono da sala pode gerenciar convites.');
 let convites=[];
 try{const q=await F.getDocs(F.query(F.collection(db,'invites'),F.where('roomId','==',active)));convites=q.docs.map(d=>({code:d.id,...d.data()}));}catch(e){convites=null;}
 const agora=Date.now();
 const listaConvites=convites===null?'<p class="salas-caption">Não foi possível listar os convites desta sala. Verifique as permissões do Firestore.</p>':
   (convites.length?convites.map(c=>{const exp=c.expiresAt&&c.expiresAt.toMillis?c.expiresAt.toMillis():0;const vencido=exp<agora;const tipo=c.role==='editor'?'Pode ler e escrever':'Somente leitura';return '<div class="salas-invite-card"><strong>'+esc(tipo)+' · '+(vencido?'Expirado':'Válido até '+new Date(exp).toLocaleDateString('pt-BR'))+'</strong><code>'+esc(c.code)+'</code><div class="salas-invite-actions">'+(vencido?'':'<button class="salas-secondary" data-copy-invite="'+esc(c.code)+'">Copiar link</button><button class="salas-secondary" data-copy-invite-code="'+esc(c.code)+'">Copiar código</button>')+'<button class="salas-secondary" data-revoke="'+esc(c.code)+'">'+(vencido?'Apagar':'Revogar')+'</button></div></div>';}).join(''):'<p class="salas-caption">Esta sala ainda não tem códigos. Gere um abaixo.</p>');
 const participantes=(roomData.memberIds||[]).filter(id=>id!==user.uid).map(id=>'<div class="room"><span>'+esc(nomeMembro(id))+' · '+(roles[id]==='editor'?'ler e escrever':'somente leitura')+'</span><button data-remove="'+esc(id)+'">Remover acesso</button></div>').join('')||'<p class="salas-caption">Ninguém além de você.</p>';
 const nomeSala=roomData&&roomData.title||'Sala';
 show('<h2>Convidar outra pessoa</h2><p><strong>Sala: '+esc(nomeSala)+'</strong></p><p>Cada sala tem seus próprios códigos e participantes. Os códigos desta sala não dão acesso às suas outras salas. Convide qualquer pessoa: estudante, orientador ou colaborador. O convite vale por 7 dias e pode ser revogado.</p><h3>Códigos desta sala</h3>'+listaConvites+'<label>Permissão para novo convite<select id="invite-role"><option value="viewer">Somente leitura</option><option value="editor">Ler e escrever junto</option></select></label><button class="salas-primary" id="invite-create">Gerar novo código desta sala</button><div id="invite-result"></div><h3>Participantes desta sala</h3>'+participantes+'<button class="salas-secondary" id="return-list">Voltar às salas</button>');
 btn('return-list',list);
 dialog.querySelectorAll('[data-copy-invite]').forEach(b=>b.onclick=async()=>{try{await copyText(linkConvite(b.dataset.copyInvite));msg('Link desta sala copiado.');}catch(e){fail(e);}});
 dialog.querySelectorAll('[data-copy-invite-code]').forEach(b=>b.onclick=async()=>{try{await copyText(b.dataset.copyInviteCode);msg('Código desta sala copiado.');}catch(e){fail(e);}});
 btn('invite-create',async()=>{
  const code=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
  await F.setDoc(F.doc(db,'invites',code),{roomId:active,role:document.getElementById('invite-role').value,expiresAt:F.Timestamp.fromMillis(Date.now()+7*86400000),createdBy:user.uid});
  const link=linkConvite(code);
  const div=document.getElementById('invite-result');
  div.innerHTML='<p>O link já contém o código: a pessoa não precisa digitá-lo, mas deverá entrar com a própria conta. Se quiser enviar somente o código, use “Copiar código”.</p><p><a href="'+esc(link)+'" target="_blank" rel="noopener">Abrir link de convite</a></p><code>'+esc(code)+'</code><button id="copy-link">Copiar link</button><button id="copy-code">Copiar código</button><button id="revoke-code">Revogar este convite</button>';
  btn('copy-link',async()=>{await copyText(link);msg('Link copiado.');});
  btn('copy-code',async()=>{await copyText(code);msg('Código copiado.');});
  btn('revoke-code',async()=>{await F.deleteDoc(F.doc(db,'invites',code));await sharing();});
 });
 dialog.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=async()=>{try{await F.deleteDoc(F.doc(db,'invites',b.dataset.revoke));await sharing();}catch(e){fail(e);}});
 dialog.querySelectorAll('[data-remove]').forEach(b=>b.onclick=async()=>{try{
  const id=b.dataset.remove;
  await F.updateDoc(F.doc(db,'rooms',active),{memberIds:F.arrayRemove(id),['roles.'+id]:F.deleteField(),['members.'+id]:F.deleteField()});
  // Invalida somente os convites comprovadamente usados por este participante.
  try{const q=await F.getDocs(F.query(F.collection(db,'invites'),F.where('roomId','==',active)));
   await Promise.all(q.docs.filter(d=>(d.data().usedBy||[]).includes(id)).map(d=>F.deleteDoc(d.ref)));}catch(_){}
  await sharing();
 }catch(e){fail(e);}});
}

/* ---------- integração com o index.html ---------- */
new MutationObserver(()=>{if(user&&active&&minhaFuncao()==='viewer'){document.querySelectorAll('main input,main textarea,main select,main [contenteditable]').forEach(el=>{if(!el.disabled)el.disabled=true;});}}).observe(document.body,{childList:true,subtree:true});
const originalSave=salvar;salvar=function(){if(user&&active&&minhaFuncao()==='viewer')return;originalSave();changed();};
const originalLimpar=limpar;limpar=function(){
 if(active&&minhaFuncao()!=='owner'){alert('Somente o dono da sala pode apagar o projeto compartilhado. Você pode baixar uma cópia em Backup JSON.');return;}
 originalLimpar();
};
window.SALAS={ativa:()=>active,funcao:()=>minhaFuncao()};
document.getElementById('salas-open').onclick=()=>{if(offline){status('Modo local: sem conta, as respostas ficam só neste aparelho.');return;}list().catch(fail);};
document.getElementById('salas-save-now').onclick=async()=>{try{if(offline||!user||!active){status('Abra uma sala com sua conta para salvar na nuvem.');return;}if(minhaFuncao()==='viewer'){status('Esta sala é somente leitura.');return;}if(saving){status('Salvamento já em andamento…');return;}if(!dirty){status('Tudo salvo na nuvem · '+roomData.title);return;}clearTimeout(timer);status('Salvando agora…');await save();}catch(e){fail(e);}};
dialog.addEventListener('cancel',e=>{if(!user&&!offline)e.preventDefault();else lock(active?minhaFuncao()==='viewer':false);});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});

try{
 const appSDK=await import(SDK+'firebase-app.js');A=await import(SDK+'firebase-auth.js');F=await import(SDK+'firebase-firestore.js');
 const app=appSDK.initializeApp({apiKey:'AIzaSyDODPIhQSwPnn2YknwAmdqgismYnMfOYkM',authDomain:'astrolabio-profagua.firebaseapp.com',projectId:'astrolabio-profagua',storageBucket:'astrolabio-profagua.firebasestorage.app',messagingSenderId:'854871826891',appId:'1:854871826891:web:3a4ceb48b37995cbd6964e'});
 auth=A.getAuth(app);db=F.getFirestore(app);auth.languageCode='pt-BR';
 A.onAuthStateChanged(auth,u=>{
  const anterior=user;user=u;
  // Ao reautenticar a mesma conta, não substitua o diálogo de exclusão.
  if(u&&anterior&&anterior.uid===u.uid)return;
  if(!u){
   if(unsub)unsub();unsub=null;active=null;dirty=false;roles={};roomData=null;
   if(anterior||Cofre.ler(CLOUD_UID_KEY)){limparLocal();Cofre.apagar(LOCAL_BACKUP_KEY);} // não expor cópia de outra conta
   login();status('Entre para acessar seus projetos');
  }else{
   const uidAnterior=Cofre.ler(CLOUD_UID_KEY);
   if(uidAnterior&&uidAnterior!==u.uid)limparLocal();      // cópia da nuvem de outra conta: não serve para esta
   vincularBackup(u.uid);
   status('Conta conectada · Escolha uma sala');list().catch(fail);
  }
 });
}catch(e){
 offline=true;lock(false);
 status('Sem conexão com o serviço de contas. Modo local neste aparelho.');
 show('<h2>Conexão indisponível</h2><p>Não foi possível carregar o serviço de contas. Você pode continuar no modo local: as respostas ficam salvas somente neste aparelho até que a conexão volte e a página seja recarregada. Faça um Backup JSON antes de fechar.</p><button class="salas-primary" id="modo-local">Continuar no modo local</button>');
 btn('modo-local',()=>dialog.close());
}
})();
