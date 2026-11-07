/* Contas, salas e escrita compartilhada. Nunca contém credenciais administrativas. */
(async function(){
'use strict';
const SDK='https://www.gstatic.com/firebasejs/12.4.0/';
const panel=document.createElement('section');panel.id='salas-panel';panel.setAttribute('aria-label','Conta e salas');
panel.innerHTML='<div id="salas-status" role="status">Conectando ao seu percurso…</div><button id="salas-open" title="Abrir projetos e espaços de orientação">Meus projetos</button>';
document.body.prepend(panel);
const brands=document.createElement('div');brands.id='salas-brands';brands.setAttribute('aria-label','Instituições');brands.innerHTML=[['estado','Estado de Mato Grosso'],['unemat','Brasão da UNEMAT'],['unematLogo','UNEMAT'],['capes','CAPES'],['ana','Agência Nacional de Águas e Saneamento Básico']].map(([key,name])=>'<img src="data:image/png;base64,'+window.PROFAGUA_MARCAS[key]+'" alt="'+name+'">').join('');panel.after(brands);
const style=document.createElement('style');style.textContent=`#salas-brands{display:flex;flex-wrap:wrap;gap:22px;justify-content:center;align-items:center;background:white;padding:14px}#salas-brands img{max-height:54px;max-width:190px;width:auto;height:auto;object-fit:contain}#salas-panel{background:#f3f7f4;border-bottom:1px solid #cbd6cf;padding:10px 20px;display:flex;justify-content:space-between;gap:10px;align-items:center;font:14px sans-serif;position:sticky;top:0;z-index:1000}#salas-panel button,#salas-dialog button{cursor:pointer;padding:10px 14px;border:1px solid #a5b6ac;border-radius:6px;background:#fff;color:#203c30}#salas-dialog{width:min(640px,90vw);max-height:88vh;border:1px solid #bdcfc3;border-radius:12px;padding:24px;color:#203c30;font:16px/1.5 sans-serif}#salas-dialog::backdrop{background:#12251fbb}#salas-dialog input,#salas-dialog select{display:block;box-sizing:border-box;width:100%;padding:11px;margin:5px 0 14px;border:1px solid #9daf9f;border-radius:5px;font:inherit}#salas-dialog button{margin:4px}#salas-dialog h2{margin-top:0}#salas-dialog .room{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #ddd;padding:10px 0;gap:10px}#salas-dialog label{display:block}#salas-message{white-space:pre-wrap}#salas-dialog code{display:block;overflow-wrap:anywhere;background:#eff4ef;padding:12px;user-select:all}body.salas-locked main{pointer-events:none;opacity:.5}`;style.textContent+=`
#salas-panel{background:rgba(248,251,249,.96);border-bottom:1px solid #dfe9e4;padding:9px clamp(12px,3vw,28px);font:600 13px/1.3 system-ui,sans-serif;color:#35534c;backdrop-filter:blur(12px)}
#salas-panel #salas-status{max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#salas-panel #salas-open{border:0;border-radius:999px;background:#123f3b;color:white;padding:10px 17px;font:700 14px system-ui,sans-serif;box-shadow:0 5px 16px #123f3b22}
#salas-panel #salas-open:hover{background:#0b5a51;transform:translateY(-1px)}
#salas-dialog{width:min(720px,calc(100vw - 24px));max-height:min(90dvh,900px);overflow:auto;padding:0;border:1px solid #e4ece8;border-radius:24px;background:#f7faf8;color:#183b36;font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 28px 90px #071f1c55}
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
let auth,db,A,F,user=null,active=null,revision=0,dirty=false,saving=false,conflict=false,timer=null,unsub=null,roles={},roomData=null;
let base=null;
const LOCAL_BACKUP_KEY='astrolabio_respostas_locais_antes_da_nuvem_v1';
const pendingLocal=JSON.parse(JSON.stringify(estado));
function hasValue(v){
 if(typeof v==='string')return v.trim().length>0;
 if(Array.isArray(v))return v.some(hasValue);
 if(v&&typeof v==='object')return Object.values(v).some(hasValue);
 return typeof v==='number'&&Number.isFinite(v);
}
function hasLocalResponses(data){
 return !!data&&[data.dados,data.autores,data.entrega,data.projeto].some(hasValue);
}
if(hasLocalResponses(pendingLocal)&&!Cofre.ler(LOCAL_BACKUP_KEY))
 Cofre.gravar(LOCAL_BACKUP_KEY,JSON.stringify(pendingLocal));
let recoveryCopy=pendingLocal;
try{recoveryCopy=JSON.parse(Cofre.ler(LOCAL_BACKUP_KEY)||'null')||pendingLocal;}catch(_){}
function downloadJSON(data,name){
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function copyText(text){
 if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return;}
 const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
 const ok=document.execCommand('copy');input.remove();if(!ok)throw Error('Não foi possível copiar automaticamente. Selecione e copie o texto exibido.');
}
const status=t=>document.getElementById('salas-status').textContent=t;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lock(v){document.body.classList.toggle('salas-locked',v);document.querySelectorAll('main input,main textarea,main select,main [contenteditable],#arq,button.risco,button[onclick*="arq"]').forEach(el=>{el.disabled=v;});}
function msg(t){const el=document.getElementById('salas-message');if(el)el.textContent=t;}
function fail(e){const codes={'auth/invalid-credential':'Email ou senha incorretos.','auth/email-already-in-use':'Este email já está cadastrado. Use Entrar.','auth/weak-password':'Use uma senha de pelo menos 8 caracteres.','auth/unauthorized-domain':'Domínio ainda não autorizado no Firebase.','auth/popup-closed-by-user':'A janela do Google foi fechada.','auth/too-many-requests':'Muitas tentativas. Aguarde e tente novamente.','permission-denied':'Você não tem permissão para esta ação.','auth/network-request-failed':'Falha de conexão. Tente novamente.'};msg(codes[e.code]||e.message||'Não foi possível concluir.');status('Ação não concluída — abra Conta e salas.');}
function show(html){const notice='<p id="salas-message" role="status"></p>';if(html.includes('class="salas-shell"')){const end=html.lastIndexOf('</div>');dialog.innerHTML=end>=0?html.slice(0,end)+notice+html.slice(end):html+notice;}else dialog.innerHTML=html+notice;if(!dialog.open)dialog.showModal();}
function btn(id,fn){document.getElementById(id).onclick=async()=>{try{await fn();}catch(e){fail(e);}};}
function login(){lock(true);show('<div class="salas-shell"><header class="salas-hero"><span class="salas-eyebrow">🧭 Astrolábio · espaço de orientação</span><h2>Vamos começar seu percurso</h2><p>Entre com sua conta Google. Seu projeto ficará salvo na nuvem e disponível em qualquer aparelho quando você usar esta mesma conta.</p></header><div class="salas-explainer"><div class="salas-number">✦</div><div><strong>Sem senha nova e sem código para começar</strong><span>Na primeira entrada, criamos seu espaço privado. Depois, se quiser, você convida seu orientador para acompanhar ou escrever junto em uma sala compartilhada.</span></div></div><button id="login-google">Continuar com Google</button><details><summary>Já tenho uma conta com email e senha</summary><p>Use o mesmo email e senha que cadastrou antes. Para reencontrar seu percurso em outros aparelhos, entre sempre pelo mesmo método e pela mesma conta.</p><form id="login-form"><label>Email<input id="login-email" type="email" autocomplete="username" required></label><label>Senha<input id="login-password" type="password" autocomplete="current-password" minlength="8" required></label><button type="submit">Entrar com email</button><button type="button" id="signup">Criar conta com email</button><button type="button" id="reset">Recuperar senha</button></form></details></div>');
const credentials=()=>({email:document.getElementById('login-email').value.trim(),password:document.getElementById('login-password').value});
btn('login-google',()=>A.signInWithPopup(auth,new A.GoogleAuthProvider()));
document.getElementById('login-form').onsubmit=async e=>{e.preventDefault();try{const c=credentials();await A.signInWithEmailAndPassword(auth,c.email,c.password);}catch(err){fail(err);}};
btn('signup',async()=>{if(!document.getElementById('login-form').reportValidity())return;const c=credentials();await A.createUserWithEmailAndPassword(auth,c.email,c.password);});
btn('reset',async()=>{const c=credentials();if(!c.email)throw Error('Informe seu email.');await A.sendPasswordResetEmail(auth,c.email);msg('Se houver uma conta para este email, você receberá as instruções de recuperação.');});}
function apply(data){estado=JSON.parse(JSON.stringify(data));base=JSON.parse(JSON.stringify(data));Cofre.gravar(CHAVE,JSON.stringify(estado));desenharNav();desenharEstacao();atualizarProgresso();if(telaAtual==='projeto'&&typeof abrirProjeto==='function')abrirProjeto();else if(telaAtual==='revisao'&&typeof abrirRevisaoAcademica==='function')abrirRevisaoAcademica();else irPara(telaAtual);lock(roles[user.uid]==='viewer');}
function blank(){return {versao:1,criadoEm:new Date().toISOString(),atualizadoEm:null,dados:{},autores:[],entrega:{formatos:[]}};}
async function list(){if(!user)return login();
const snap=await F.getDocs(F.query(F.collection(db,'rooms'),F.where('memberIds','array-contains',user.uid)));
const invitePending=new URLSearchParams(location.search).has('convite');
if(snap.empty){
 const data=hasLocalResponses(recoveryCopy)?recoveryCopy:blank();
 const created=await F.addDoc(F.collection(db,'rooms'),{title:'Meu percurso acadêmico',owner:user.uid,memberIds:[user.uid],roles:{[user.uid]:'owner'},data,revision:0,createdAt:F.serverTimestamp(),updatedAt:F.serverTimestamp(),updatedBy:user.uid});
 await open(created.id);
 status('Seu percurso está salvo na sua conta. Use a mesma conta para acessar de outros dispositivos.');
 return;
}
const inviteValue=new URLSearchParams(location.search).get('convite')||'';
const backupNeeded=hasLocalResponses(recoveryCopy)&&!snap.docs.some(d=>JSON.stringify(d.data().data)===JSON.stringify(recoveryCopy));
const backupCard=backupNeeded?'<aside class="salas-backup"><div><strong>Encontramos uma cópia antiga neste aparelho</strong>Baixe-a antes de usar essas respostas em outro projeto.</div><button class="salas-secondary" id="download-local">Baixar cópia</button></aside>':'';
const roomCards=snap.docs.map(d=>{
 const r=d.data(),role=r.roles[user.uid];
 const access=role==='owner'?'Seu espaço privado':role==='editor'?'Compartilhado · pode editar':'Compartilhado · somente leitura';
 return '<article class="salas-room-card"><div class="salas-room-icon" aria-hidden="true">🧭</div><div class="salas-room-copy"><strong>'+esc(r.title)+'</strong><small>'+access+'</small></div><button class="salas-primary" data-room="'+d.id+'">Abrir</button></article>';
}).join('');
const spaces=roomCards||'<div class="salas-empty">Seu primeiro percurso já está sendo preparado. Ele fica salvo na sua conta.</div>';
const inviteOptions=active?'<button class="salas-secondary" id="back-room">Voltar ao percurso</button>'+(roles[user.uid]==='owner'?'<button class="salas-secondary" id="sharing">Convidar orientador</button>':''):'';
show('<div class="salas-shell"><header class="salas-hero"><button class="salas-close" id="close-list" type="button" aria-label="Fechar e voltar ao projeto">×</button><span class="salas-eyebrow">🧭 Astrolábio · espaço de orientação</span><h2>Seus projetos, em um só lugar</h2><p>Continue seu percurso, crie um novo projeto ou compartilhe um espaço com quem orienta você.</p><p class="salas-return-hint"><b>Já tem um projeto?</b> Toque em “Abrir” no cartão. O X fecha esta janela e volta ao formulário atual.</p><span class="salas-account">Conectado como '+esc(user.email)+'</span></header><div class="salas-explainer"><div class="salas-number">✦</div><div><strong>O que é uma sala?</strong><span>É o espaço online de um projeto. Você escreve e acompanha o percurso; seu orientador pode ser convidado para ler, comentar ou escrever junto. Cada sala salva suas alterações na nuvem.</span></div></div>'+backupCard+'<section class="salas-section"><div class="salas-section-head"><h3>Seus percursos</h3><span class="salas-caption">'+snap.docs.length+' '+(snap.docs.length===1?'espaço':'espaços')+'</span></div>'+spaces+'</section><details class="salas-fold"><summary>＋ Criar outro projeto</summary><div class="salas-fold-body"><p>Crie uma sala privada para organizar outro projeto de pesquisa. Você poderá convidar seu orientador depois.</p><label for="new-title">Nome do projeto</label><input id="new-title" maxlength="140" placeholder="Ex.: Minha dissertação sobre o Pantanal"><label class="salas-check"><input id="import-local" type="checkbox" '+(snap.empty&&hasLocalResponses(recoveryCopy)?'checked':'')+'>Incluir as respostas que já estavam neste aparelho</label><button class="salas-primary" id="create-room">Criar projeto</button></div></details><details class="salas-fold"><summary>↗ Recebi convite para uma sala compartilhada</summary><div class="salas-fold-body"><p>O convite conecta você ao espaço de outra pessoa, como o projeto do orientador. Para acessar um projeto compartilhado, abra o link recebido ou cole o código abaixo. Seu percurso pessoal continua separado.</p><label for="join-code">Código do convite</label><input id="join-code" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Cole aqui o código recebido" value="'+esc(inviteValue)+'"><button class="salas-primary" id="join-room">Entrar na sala compartilhada</button></div></details><div class="salas-footer">'+inviteOptions+'<button id="logout">Sair da conta</button></div></div>');
btn('close-list',()=>{dialog.close();lock(active?roles[user.uid]==='viewer':false);status(active?roomData.title+' · salvo na nuvem':hasLocalResponses(estado)?'Você voltou ao projeto deste aparelho. Para sincronizar, abra uma sala em Meus projetos.':'Continue seu percurso no formulário.');});
dialog.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>open(b.dataset.room).catch(fail));
if(hasLocalResponses(recoveryCopy))btn('download-local',()=>downloadJSON(recoveryCopy,'astrolabio-respostas-locais-backup.json'));
btn('create-room',async()=>{if(dirty)throw Error('Salve ou resolva as alterações pendentes antes de trocar de sala.');const title=document.getElementById('new-title').value.trim();if(!title)throw Error('Dê um nome ao projeto.');const data=document.getElementById('import-local').checked?recoveryCopy:blank();const r=await F.addDoc(F.collection(db,'rooms'),{title,owner:user.uid,memberIds:[user.uid],roles:{[user.uid]:'owner'},data,revision:0,createdAt:F.serverTimestamp(),updatedAt:F.serverTimestamp(),updatedBy:user.uid});await open(r.id);});
btn('join-room',async()=>{const code=document.getElementById('join-code').value.replace(/[ \t\r\n-]/g,'').toLowerCase();if(!/^[a-f0-9]{32}$/.test(code))throw Error('O código precisa ter 32 caracteres. Abra o link recebido ou cole o código completo.');const invitation=await F.getDoc(F.doc(db,'invites',code));if(!invitation.exists()||invitation.data().expiresAt.toMillis()<Date.now())throw Error('Convite inválido, revogado ou expirado.');const i=invitation.data();try{await F.updateDoc(F.doc(db,'rooms',i.roomId),{memberIds:F.arrayUnion(user.uid),['roles.'+user.uid]:i.role,joinProof:code});}catch(e){const r=await F.getDoc(F.doc(db,'rooms',i.roomId));if(!r.exists())throw e;}await open(i.roomId);const cleanUrl=new URL(location.href);cleanUrl.searchParams.delete('convite');history.replaceState({},'',cleanUrl);});
if(new URLSearchParams(location.search).has('convite'))setTimeout(()=>document.getElementById('join-room')?.click(),0);
if(active){btn('back-room',()=>dialog.close());btn('sharing',sharing);}btn('logout',async()=>{if(dirty)throw Error('Há alterações pendentes. Resolva antes de sair.');await A.signOut(auth);});}
async function open(id){if(dirty)throw Error('Há alterações pendentes nesta sala. Resolva antes de trocar.');if(unsub)unsub();active=id;conflict=false;const ref=F.doc(db,'rooms',id);const first=await F.getDoc(ref);if(!first.exists())throw Error('Sala não encontrada.');roomData=first.data();roles=roomData.roles;revision=roomData.revision;apply(roomData.data);abrirEstacao(0);lock(roles[user.uid]==='viewer');dialog.close();status(roomData.title+' · '+(roles[user.uid]==='viewer'?'Somente leitura':'Salvo na nuvem'));unsub=F.onSnapshot(ref,s=>{if(!s.exists())return;const r=s.data();roles=r.roles;roomData=r;if(!r.memberIds.includes(user.uid)){lock(true);status('Seu acesso à sala foi removido.');return;}if(r.revision!==revision&&!saving){if(dirty){conflict=true;status('Outra pessoa alterou o projeto. Abra Conta e salas para conciliar.');}else{revision=r.revision;apply(r.data);status(r.title+' · Atualizado da nuvem');}}lock(roles[user.uid]==='viewer');},e=>{lock(true);fail(e);});}
function changed(){if(!user||!active||roles[user.uid]==='viewer')return;dirty=true;status('Alterações pendentes…');clearTimeout(timer);timer=setTimeout(save,900);}
async function save(){if(!dirty||saving||conflict||!active)return;saving=true;const data=JSON.parse(JSON.stringify(estado)),expected=revision;try{await F.runTransaction(db,async tx=>{const ref=F.doc(db,'rooms',active),s=await tx.get(ref);if(s.data().revision!==expected)throw Error('CONFLICT');tx.update(ref,{data,revision:expected+1,updatedAt:F.serverTimestamp(),updatedBy:user.uid});});revision=expected+1;base=data;dirty=JSON.stringify(estado)!==JSON.stringify(data);status(dirty?'Alterações pendentes…':'Salvo na nuvem · '+roomData.title);}catch(e){if(e.message==='CONFLICT'){conflict=true;status('Conflito de edição — abra Conta e salas.');}else{status('Sem salvar na nuvem. Suas alterações continuam neste dispositivo.');}}finally{saving=false;if(dirty&&!conflict)timer=setTimeout(save,3000);}}
function conflictUI(){show('<h2>Há duas versões do projeto</h2><p>Outra pessoa salvou alterações enquanto você escrevia. Baixe sua cópia antes de carregar a versão da nuvem. Nenhum texto será sobrescrito automaticamente.</p><button id="download-pending">Baixar minhas alterações em JSON</button><button id="load-cloud">Carregar versão da nuvem</button><button id="keep-writing">Continuar revisando minha cópia</button>');btn('download-pending',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(estado,null,2)],{type:'application/json'}));a.download='astrolabio-alteracoes-pendentes.json';a.click();URL.revokeObjectURL(a.href);});btn('load-cloud',async()=>{if(!confirm('Carregar a versão da nuvem? Baixe antes a sua cópia para preservar alterações pendentes.'))return;dirty=false;await open(active);});btn('keep-writing',()=>dialog.close());}
async function sharing(){if(roles[user.uid]!=='owner')throw Error('Somente o dono da sala pode gerenciar convites.');show('<h2>Compartilhar projeto</h2><p>Envie o link para seu orientador ou colaborador. Ele entra com Google. Se for a primeira vez no Astrolábio, o sistema cria primeiro o percurso pessoal dele; depois, em “Meus projetos”, ele acessa esta sala compartilhada. O código também pode ser colado manualmente. O convite vale por 7 dias e pode ser revogado.</p><label>Permissão<select id="invite-role"><option value="viewer">Somente leitura</option><option value="editor">Ler e escrever junto</option></select></label><button id="invite-create">Gerar código</button><div id="invite-result"></div><h3>Participantes</h3>'+roomData.memberIds.filter(id=>id!==user.uid).map(id=>'<div class="room"><span>Participante '+esc(id.slice(0,8))+' · '+esc(roles[id])+'</span><button data-remove="'+id+'">Remover acesso</button></div>').join('')+'<h3>Convites gerados</h3>'+Object.keys(roomData.inviteCodes||{}).map(code=>'<div class="room"><code>'+code+'</code><button data-revoke="'+code+'">Revogar</button></div>').join('')+'<button id="return-list">Voltar às salas</button>');btn('return-list',list);
btn('invite-create',async()=>{const code=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');await F.setDoc(F.doc(db,'invites',code),{roomId:active,role:document.getElementById('invite-role').value,expiresAt:F.Timestamp.fromMillis(Date.now()+7*86400000)});await F.updateDoc(F.doc(db,'rooms',active),{['inviteCodes.'+code]:true});const inviteUrl=new URL(location.href);inviteUrl.searchParams.set('convite',code);const link=inviteUrl.href;const div=document.getElementById('invite-result');div.innerHTML='<p>Envie este link. Depois que a pessoa entrar, a sala será aberta automaticamente:</p><p><a href="'+esc(link)+'" target="_blank" rel="noopener">Abrir link de convite</a></p><code>'+code+'</code><button id="copy-link">Copiar link</button><button id="copy-code">Copiar código</button><button id="revoke-code">Revogar este convite</button>';btn('copy-link',async()=>{await copyText(link);msg('Link copiado.');});btn('copy-code',async()=>{await copyText(code);msg('Código copiado.');});btn('revoke-code',async()=>{await F.deleteDoc(F.doc(db,'invites',code));await F.updateDoc(F.doc(db,'rooms',active),{['inviteCodes.'+code]:F.deleteField()});div.textContent='Convite revogado.';});});
dialog.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=async()=>{try{const code=b.dataset.revoke;await F.deleteDoc(F.doc(db,'invites',code));await F.updateDoc(F.doc(db,'rooms',active),{['inviteCodes.'+code]:F.deleteField()});await sharing();}catch(e){fail(e);}});
dialog.querySelectorAll('[data-remove]').forEach(b=>b.onclick=async()=>{try{await F.updateDoc(F.doc(db,'rooms',active),{memberIds:F.arrayRemove(b.dataset.remove),['roles.'+b.dataset.remove]:F.deleteField()});await sharing();}catch(e){fail(e);}});}
new MutationObserver(()=>{if(user&&active&&roles&&roles[user.uid]==='viewer'){document.querySelectorAll('main input,main textarea,main select,main [contenteditable]').forEach(el=>{if(!el.disabled)el.disabled=true;});}}).observe(document.body,{childList:true,subtree:true});
const originalSave=salvar;salvar=function(){if(user&&active&&roles[user.uid]==='viewer')return;originalSave();changed();};
document.getElementById('salas-open').onclick=()=>{if(conflict)conflictUI();else list().catch(fail);};
dialog.addEventListener('cancel',e=>{if(!user)e.preventDefault();else lock(active?roles[user.uid]==='viewer':false);});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
try{const appSDK=await import(SDK+'firebase-app.js');A=await import(SDK+'firebase-auth.js');F=await import(SDK+'firebase-firestore.js');
const app=appSDK.initializeApp({apiKey:'AIzaSyDODPIhQSwPnn2YknwAmdqgismYnMfOYkM',authDomain:'astrolabio-profagua.firebaseapp.com',projectId:'astrolabio-profagua',storageBucket:'astrolabio-profagua.firebasestorage.app',messagingSenderId:'854871826891',appId:'1:854871826891:web:3a4ceb48b37995cbd6964e'});auth=A.getAuth(app);db=F.getFirestore(app);auth.languageCode='pt-BR';
A.onAuthStateChanged(auth,u=>{user=u;if(!u){if(unsub)unsub();active=null;dirty=false;desenharEstacao();login();status(hasLocalResponses(pendingLocal)?'Entre para continuar. Suas respostas deste aparelho continuam preservadas.':'Entre para acessar seus projetos');}else{status('Conta conectada · Escolha uma sala');list().catch(fail);}});
}catch(e){lock(true);status('Não foi possível conectar. Recarregue quando estiver online.');show('<h2>Conexão indisponível</h2><p>Não foi possível carregar o serviço de contas. Recarregue a página quando a conexão estiver disponível.</p>');}
})();
