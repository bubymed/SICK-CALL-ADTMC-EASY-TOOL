/* ===== Medic access (signed approvals, no server, no personal data) =====
   Root (app owner) approves NCO approvers; approvers approve medics. Everything travels as QR codes or links.
   - Request  (#areq=)  unsigned: {t:'req', r:'medic'|'appr', d:deviceId, u:unit, n:label, pub?}
   - Cert     (#acert=) signed by ROOT: {t:'cert', id, pub, u, iat}
   - Approval (#acc=)   signed by approver (or root): {t:'ok', id, d, u, iat, c:certToken|null}
   An approval only works on the device that made the request (deviceId). ECDSA P-256 via WebCrypto.
   Acceso de médicos: aprobaciones firmadas, sin servidor ni datos personales. */
const AC={
  b64e:b=>{let s='';const a=new Uint8Array(b);for(let i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');},
  b64d:s=>{s=String(s).replace(/-/g,'+').replace(/_/g,'/');s+='==='.slice((s.length+3)%4);const r=atob(s),a=new Uint8Array(r.length);for(let i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a;},
  enc:o=>AC.b64e(new TextEncoder().encode(JSON.stringify(o))),
  dec:s=>{try{return JSON.parse(new TextDecoder().decode(AC.b64d(s)));}catch(e){return null;}},
  rid:()=>AC.b64e(crypto.getRandomValues(new Uint8Array(9))),
  ok:()=>!!(window.crypto&&crypto.subtle),
  get:k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}},
  set:(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}},
  dev(){let d=AC.get('sc_dev');if(!d){d=AC.rid();AC.set('sc_dev',d);}return d;},
  async pubKey(b64){return crypto.subtle.importKey('raw',AC.b64d(b64),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);},
  async prvKey(b64){return crypto.subtle.importKey('pkcs8',AC.b64d(b64),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);},
  async sign(obj,prvB64){const p=AC.enc(obj);const sig=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},await AC.prvKey(prvB64),new TextEncoder().encode(p));return p+'.'+AC.b64e(sig);},
  async verify(tok,pubB64){try{const[i,s]=String(tok).split('.');if(!i||!s)return null;const ok=await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},await AC.pubKey(pubB64),AC.b64d(s),new TextEncoder().encode(i));return ok?AC.dec(i):null;}catch(e){return null;}},
  revoked:id=>(ACCESS.REVOKED||[]).includes(id),
  async verifyCert(tok){for(const r of ACCESS.ROOT_PUBS){const c=await AC.verify(tok,r);if(c&&c.t==='cert'&&!AC.revoked(c.id))return c;}return null;},
  async verifyApproval(tok){const p=AC.dec(String(tok).split('.')[0]);if(!p||p.t!=='ok'||AC.revoked(p.id))return null;
    if(p.c){const c=await AC.verifyCert(p.c);if(!c)return null;const a=await AC.verify(tok,c.pub);return a&&a.t==='ok'?Object.assign(a,{_by:c.u||''}):null;}
    for(const r of ACCESS.ROOT_PUBS){const a=await AC.verify(tok,r);if(a&&a.t==='ok')return Object.assign(a,{_by:'admin'});}return null;},
  /* role on this device: 'root' | 'appr' | 'medic' | null */
  async role(){
    const rk=AC.get('sc_root');if(rk&&rk.prv&&ACCESS.ROOT_PUBS.includes(rk.pub))return{r:'root',u:'admin'};
    const ap=AC.get('sc_appr');if(ap&&ap.cert&&ap.prv){const c=await AC.verifyCert(ap.cert);if(c&&c.pub===ap.pub)return{r:'appr',u:c.u,cert:ap.cert,prv:ap.prv,id:c.id};}
    const a=AC.get('sc_auth');if(a&&a.tok){const v=await AC.verifyApproval(a.tok);if(v&&v.d===AC.dev())return{r:'medic',u:v.u,by:v._by,iat:v.iat};AC.set('sc_auth',null);}
    return null;}
};
let acRole=null;
function acEnforced(){return /^https?:/.test(location.protocol)&&new Date()>=new Date(ACCESS.ENFORCE_FROM+'T00:00:00');}
function acDays(){return Math.max(0,Math.ceil((new Date(ACCESS.ENFORCE_FROM+'T00:00:00')-new Date())/864e5));}
function acLink(k,v){return iqBase()+'#'+k+'='+v;}
function acQR(text){try{const q=qrcode(0,'L');q.addData(text);q.make();return q.createSvgTag({cellSize:3,margin:2,scalable:true});}catch(e){return '';}}
function acCopy(t,b){try{navigator.clipboard.writeText(t);if(b){const o=b.textContent;b.textContent=L('Copied ✓','Copiado ✓');setTimeout(()=>b.textContent=o,1500);}}catch(e){prompt('Copy',t);}}
function acShare(t,title){if(navigator.share){navigator.share({title,text:title,url:t}).catch(()=>{});}else acCopy(t);}
function acEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/* ---------- overlay ---------- */
function acOv(html){let o=document.getElementById('mgOv');if(!o){o=document.createElement('div');o.id='mgOv';document.body.appendChild(o);}o.innerHTML='<div class="mg-card" role="dialog" aria-modal="true">'+html+'</div>';o.scrollTop=0;}
function acClose(){const o=document.getElementById('mgOv');if(o)o.remove();}
function acShareBox(link,title){return '<div class="ac-qr">'+acQR(link)+'</div><div class="ac-row"><button class="mg-btn" onclick="acShare(\''+link+'\',\''+acEsc(title)+'\')">📤 '+L('Share link','Compartir link')+'</button><button class="mg-btn sec" onclick="acCopy(\''+link+'\',this)">'+L('Copy','Copiar')+'</button></div>';}
/* ---------- gate ---------- */
async function accGate(force){
  if(!/^https?:/.test(location.protocol)||!AC.ok())return; // local file / no WebCrypto: dev mode
  acRole=await AC.role();
  if(acRole){acGuestOff();acClose();return;}
  if(acIsGuest()&&!force){acGuestApply();return;}
  let skip=false;try{skip=sessionStorage.getItem('sc_acskip')==='1';}catch(e){}
  if(skip&&!acEnforced()&&!force)return;
  const lg=(typeof LANG!=='undefined'&&LANG==='es')?'es':'en';
  acOv('<div class="mg-top"><span class="mg-k">68W · ADTMC</span><span class="mg-lang"><button class="'+(lg==='en'?'on':'')+'" onclick="acLang(\'en\')">EN</button><button class="'+(lg==='es'?'on':'')+'" onclick="acLang(\'es\')">ES</button></span></div>'
   +'<h2>Sick Call</h2>'
   +'<p class="mg-sub">'+L('For 68W medics, under provider supervision.','Para médicos 68W, bajo supervisión de un proveedor.')+' <b>'+L('Not for self-diagnosis.','No es para autodiagnóstico.')+'</b></p>'
   +'<button class="mg-btn" onclick="acReqView(\'medic\')">🩺 '+L('I\'m a medic — request access','Soy médico — pedir acceso')+'</button>'
   +'<button class="mg-btn sec" onclick="acHaveView()">🔑 '+L('I have an approval','Tengo una aprobación')+'</button>'
   +'<button class="mg-btn sec" onclick="location.href=\'intake.html\'">🤒 '+L('I\'m a Soldier and I feel sick','Soy soldado y me siento mal')+'</button>'
   +'<button class="mg-btn ghost" onclick="acGuest()">👤 '+L('Continue as a guest','Continuar como invitado')+'<small>'+L('Reference tools only','Solo herramientas de referencia')+'</small></button>'
   +'<div class="mg-links"><button onclick="acReqView(\'appr\')">'+L('NCO? Become an approver','¿NCO? Ser aprobador')+'</button>'+((typeof canInstall==='function'&&canInstall())?'<span>·</span><button onclick="installApp()">📲 '+L('Install app','Instalar app')+'</button>':'')+'</div>'
   +'<div class="mg-em">🚨 '+L('Emergency? Tell a medic now or call 911.','¿Emergencia? Avísale a un médico ya o llama al 911.')+'</div>');
}
function acLang(l){try{setLang(l);}catch(e){}accGate(true);}
/* Guest mode: reference tools only (Meds, MACE, Assessments, Questions). No protocols, dispositions, profiles, notes or patient queue.
   Modo invitado: solo referencias. Sin protocolos, disposiciones, notas ni lista de pacientes. */
function acIsGuest(){try{return localStorage.getItem('sc_guest')==='1';}catch(e){return false;}}
function acGuest(){try{localStorage.setItem('sc_guest','1');}catch(e){}acClose();acGuestApply();}
function acGuestOff(){try{localStorage.removeItem('sc_guest');}catch(e){}document.body.classList.remove('guest');}
function acGuestApply(){document.body.classList.add('guest');const gb=document.getElementById('guestBtn');if(gb)gb.textContent='👤 '+L('Guest','Invitado');try{if(typeof GUEST_OK!=='undefined'&&!GUEST_OK.includes(view)){tabGo('admeds');}else{renderNav();renderMain();}}catch(e){}}
function acSkip(){try{sessionStorage.setItem('sc_acskip','1');}catch(e){}acClose();}
function acReqView(role){
  const s=AC.get('sc_req')||{};
  acOv('<button class="ac-back" onclick="'+(role==='appr'&&acRole?'acClose();goRef(\'access\')':'accGate(true)')+'">‹ '+L('Back','Atrás')+'</button><h2>'+(role==='appr'?L('Become an approver','Ser aprobador'):L('Request access','Pedir acceso'))+'</h2>'
   +'<p>'+(role==='appr'?L('Approvers (medic NCOs) approve the medics of their unit. Your request goes to the app owner.','Los aprobadores (NCOs de médicos) aprueban a los médicos de su unidad. Tu solicitud va al dueño de la app.'):L('Your NCO (approver) will approve this phone. Only unit and an optional label travel in the request — nothing is stored on a server.','Tu NCO (aprobador) aprobará este teléfono. Solo viajan la unidad y una etiqueta opcional — nada se guarda en un servidor.'))+'</p>'
   +'<label class="ac-l">'+L('Unit','Unidad')+'</label><input id="acU" class="ac-in" maxlength="40" placeholder="'+L('e.g. 40th BEB','ej. 40th BEB')+'" value="'+acEsc(s.u||'')+'">'
   +'<label class="ac-l">'+L('Who are you? (only your approver sees it)','¿Quién eres? (solo lo ve tu aprobador)')+'</label><input id="acN" class="ac-in" maxlength="40" placeholder="'+L('e.g. SPC Smith','ej. SPC García')+'" value="'+acEsc(s.n||'')+'">'
   +'<button class="mg-btn" onclick="acMakeReq(\''+role+'\')">'+L('Create request','Crear solicitud')+'</button>');
}
async function acMakeReq(role){
  const u=(document.getElementById('acU').value||'').trim().slice(0,40),n=(document.getElementById('acN').value||'').trim().slice(0,40);
  if(!u){document.getElementById('acU').focus();return;}
  const req={t:'req',r:role,d:AC.dev(),u,n};
  if(role==='appr'){let kp=AC.get('sc_akey');if(!kp){const k=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);kp={pub:AC.b64e(await crypto.subtle.exportKey('raw',k.publicKey)),prv:AC.b64e(await crypto.subtle.exportKey('pkcs8',k.privateKey))};AC.set('sc_akey',kp);}req.pub=kp.pub;}
  AC.set('sc_req',{u,n});
  const link=acLink('areq',AC.enc(req));
  acOv('<button class="ac-back" onclick="'+(role==='appr'?'acClose();goRef(\'access\')':'accGate(true)')+'">‹ '+L('Back','Atrás')+'</button><h2>'+L('Send this to your ','Mándale esto a tu ')+(role==='appr'?L('app owner','dueño de la app'):L('NCO / approver','NCO / aprobador'))+'</h2>'
   +'<p>'+L('In person: let them scan the QR. Remote: share the link (WhatsApp, text). They must open it inside their Sick Call app (Access → Paste).','En persona: que escaneen el QR. A distancia: comparte el link (WhatsApp, texto). Deben abrirlo dentro de su app Sick Call (Acceso → Pegar).')+'</p>'
   +acShareBox(link,L('Sick Call access request','Solicitud de acceso Sick Call'))
   +'<p class="mg-f">'+L('When they send back the approval, come back here: “I have an approval”.','Cuando te devuelvan la aprobación, vuelve aquí: “Tengo una aprobación”.')+'</p>'
   +(role==='appr'?'<button class="mg-btn sec" onclick="acHaveView()">🔑 '+L('I have my approver certificate','Tengo mi certificado de aprobador')+'</button>':'<button class="mg-btn sec" onclick="acHaveView()">🔑 '+L('I have an approval','Tengo una aprobación')+'</button>'));
}
function acHaveView(){
  acOv('<button class="ac-back" onclick="'+(acRole?'acClose()':'accGate(true)')+'">‹ '+L('Back','Atrás')+'</button><h2>'+L('Activate','Activar')+'</h2>'
   +'<p>'+L('Scan the approval QR, or paste the link you received.','Escanea el QR de aprobación o pega el link que recibiste.')+'</p>'
   +'<button class="mg-btn" onclick="acScan()">📷 '+L('Scan QR','Escanear QR')+'</button>'
   +'<textarea id="acP" class="ac-in" rows="3" placeholder="'+L('Paste link here','Pega el link aquí')+'"></textarea>'
   +'<button class="mg-btn sec" onclick="acHandle(document.getElementById(\'acP\').value)">'+L('Activate','Activar')+'</button><div id="acMsg" class="ac-msg"></div>');
}
function acScan(){iqScan(t=>{if(/#(acc|areq|acert)=/.test(t)){acHandle(t);return true;}return false;});}
function acMsg(t,bad){const m=document.getElementById('acMsg');if(m){m.textContent=t;m.className='ac-msg'+(bad?' bad':'');}else iqToast(t);}
/* ---------- handle any access link/text ---------- */
async function acHandle(text){
  text=String(text||'').trim();const m=text.match(/#?(acc|areq|acert|aroot)=([A-Za-z0-9_.-]+)/);
  if(!m){acMsg(L('That is not a Sick Call access code.','Eso no es un código de acceso de Sick Call.'),true);return;}
  const k=m[1],v=m[2];
  if(k==='acc'){const a=await AC.verifyApproval(v);
    if(!a){acMsg(L('Invalid or revoked approval.','Aprobación inválida o revocada.'),true);return;}
    if(a.d!==AC.dev()){acOv('<h2>'+L('Open it in your app','Ábrelo en tu app')+'</h2><p>'+L('This approval belongs to the phone/app where the request was made. Open the Sick Call app on your home screen → “I have an approval” → paste this link.','Esta aprobación pertenece al teléfono/app donde se hizo la solicitud. Abre la app Sick Call de tu pantalla de inicio → “Tengo una aprobación” → pega este link.')+'</p><button class="mg-btn" onclick="acCopy(\''+acLink('acc',v)+'\',this)">'+L('Copy link','Copiar link')+'</button>');return;}
    AC.set('sc_auth',{tok:v,at:Date.now()});acRole=await AC.role();
    acOv('<h2>✅ '+L('Access approved','Acceso aprobado')+'</h2><p>'+L('This phone is approved for ','Este teléfono está aprobado para ')+'<b>'+acEsc(a.u)+'</b>.</p><button class="mg-btn" onclick="acClose();renderMain()">'+L('Open the app','Abrir la app')+'</button>');return;}
  if(k==='acert'){const c=await AC.verifyCert(v);const kp=AC.get('sc_akey');
    if(!c){acMsg(L('Invalid or revoked certificate.','Certificado inválido o revocado.'),true);return;}
    if(!kp||kp.pub!==c.pub){acOv('<h2>'+L('Open it in your app','Ábrelo en tu app')+'</h2><p>'+L('This certificate belongs to the app where you requested to be an approver. Open that app → Access → paste this link.','Este certificado pertenece a la app donde pediste ser aprobador. Abre esa app → Acceso → pega este link.')+'</p><button class="mg-btn" onclick="acCopy(\''+acLink('acert',v)+'\',this)">'+L('Copy link','Copiar link')+'</button>');return;}
    AC.set('sc_appr',{cert:v,pub:kp.pub,prv:kp.prv});acRole=await AC.role();
    acOv('<h2>✅ '+L('You are an approver','Eres aprobador')+'</h2><p>'+L('You can now approve medics of ','Ya puedes aprobar médicos de ')+'<b>'+acEsc(c.u)+'</b>: '+L('More → Access.','Más → Acceso.')+'</p><button class="mg-btn" onclick="acClose();goRef(\'access\')">'+L('Go to Access','Ir a Acceso')+'</button>');return;}
  if(k==='aroot'){try{const prv=v;const tok=await AC.sign({t:'chk'},prv);let pub=null;for(const r of ACCESS.ROOT_PUBS){if(await AC.verify(tok,r)){pub=r;break;}}
      if(!pub)throw 0;AC.set('sc_root',{pub,prv});acRole=await AC.role();acOv('<h2>🛡 '+L('Admin key installed','Llave de administrador instalada')+'</h2><p>'+L('This phone is the root approver. Keep it secure.','Este teléfono es el aprobador principal. Mantenlo seguro.')+'</p><button class="mg-btn" onclick="acClose();goRef(\'access\')">'+L('Go to Access','Ir a Acceso')+'</button>');}
    catch(e){acMsg(L('Invalid admin key.','Llave de administrador inválida.'),true);}return;}
  if(k==='areq'){const q=AC.dec(v);if(!q||q.t!=='req'){acMsg(L('Invalid request.','Solicitud inválida.'),true);return;}
    const me=acRole||await AC.role();
    if(!me||(me.r!=='root'&&me.r!=='appr')||(q.r==='appr'&&me.r!=='root')){acOv('<h2>'+L('Access request','Solicitud de acceso')+'</h2><p>'+(q.r==='appr'?L('Only the app owner can approve approvers. If you are the owner, open your Sick Call app → Access → paste this link.','Solo el dueño de la app puede aprobar aprobadores. Si eres el dueño, abre tu app Sick Call → Acceso → pega este link.'):L('Only an approver (medic NCO) can approve this. If you are an approver, open your Sick Call app → Access → paste this link.','Solo un aprobador (NCO de médicos) puede aprobar esto. Si eres aprobador, abre tu app Sick Call → Acceso → pega este link.'))+'</p><button class="mg-btn" onclick="acCopy(\''+acLink('areq',v)+'\',this)">'+L('Copy link','Copiar link')+'</button>'+(acRole?'<button class="mg-btn sec" onclick="acClose()">'+L('Close','Cerrar')+'</button>':''));return;}
    acOv('<h2>'+(q.r==='appr'?L('Approve an approver?','¿Aprobar a un aprobador?'):L('Approve this medic?','¿Aprobar a este médico?'))+'</h2>'
     +'<div class="ac-card"><div><span>'+L('Who','Quién')+'</span><b>'+acEsc(q.n||'—')+'</b></div><div><span>'+L('Unit','Unidad')+'</span><b>'+acEsc(q.r==='appr'?q.u:(me.r==='appr'?me.u:q.u))+'</b></div><div><span>'+L('Role','Rol')+'</span><b>'+(q.r==='appr'?L('Approver (NCO)','Aprobador (NCO)'):L('Medic','Médico'))+'</b></div></div>'
     +'<p class="mg-f">'+L('Only approve people you know are medical personnel. You are responsible for who you approve.','Solo aprueba a personas que sabes que son personal médico. Eres responsable de a quién apruebas.')+'</p>'
     +'<button class="mg-btn" onclick="acApprove(\''+v+'\')">✅ '+L('Approve','Aprobar')+'</button><button class="mg-btn sec" onclick="acClose()">'+L('Cancel','Cancelar')+'</button>');return;}
}
async function acApprove(v){
  const q=AC.dec(v),me=acRole||await AC.role();if(!q||!me)return;
  const id=AC.rid(),iat=Math.round(Date.now()/1000);let link,label;
  if(q.r==='appr'){if(me.r!=='root'||!q.pub)return;const rk=AC.get('sc_root');
    link=acLink('acert',await AC.sign({t:'cert',id,pub:q.pub,u:q.u,iat},rk.prv));label=L('Approver certificate','Certificado de aprobador');}
  else{const unit=me.r==='appr'?me.u:q.u;const prv=me.r==='appr'?me.prv:AC.get('sc_root').prv;
    link=acLink('acc',await AC.sign({t:'ok',id,d:q.d,u:unit,iat,c:me.r==='appr'?me.cert:null},prv));label=L('Sick Call access approval','Aprobación de acceso Sick Call');}
  const log=AC.get('sc_aplog')||[];log.unshift({id,n:q.n||'',u:q.u,r:q.r,at:Date.now()});AC.set('sc_aplog',log.slice(0,300));
  acOv('<h2>✅ '+L('Approved','Aprobado')+'</h2><p>'+L('Send this back to ','Mándale esto de vuelta a ')+'<b>'+acEsc(q.n||L('the requester','quien lo pidió'))+'</b>. '+L('They open it in their Sick Call app (“I have an approval” → scan or paste).','Lo abre en su app Sick Call (“Tengo una aprobación” → escanear o pegar).')+'</p>'
   +acShareBox(link,label)+'<p class="mg-f">ID: '+id+' — '+L('keep it if you ever need to revoke this access.','guárdalo por si alguna vez hay que revocar este acceso.')+'</p><button class="mg-btn sec" onclick="acClose();goRef(\'access\')">'+L('Done','Listo')+'</button>');
}
/* ---------- Access screen (More → Access) ---------- */
function renderAccess(){
  const r=acRole;let h='<h2 class="tpl">🔐 '+L('Access','Acceso')+'</h2>';
  h+='<div class="field"><div class="lab"><span class="tag">🔐</span><span class="name">'+L('This phone','Este teléfono')+'</span></div><div style="font-size:15px">'
   +(!r?L('Not approved yet.','Todavía no aprobado.'):r.r==='root'?L('🛡 Root approver (app owner)','🛡 Aprobador principal (dueño)'):r.r==='appr'?L('✅ Approver — ','✅ Aprobador — ')+acEsc(r.u):L('✅ Approved medic — ','✅ Médico aprobado — ')+acEsc(r.u))+'</div></div>';
  if(r&&(r.r==='root'||r.r==='appr')){
    h+='<div class="algo-actions"><button onclick="acScan()">📷 '+L('Scan a request','Escanear solicitud')+'</button><button class="ghost" onclick="acHaveView()">'+L('Paste a request','Pegar solicitud')+'</button></div>';
    const log=AC.get('sc_aplog')||[];
    if(log.length)h+='<div class="field"><div class="lab"><span class="tag">📋</span><span class="name">'+L('My approvals','Mis aprobaciones')+'</span></div>'+log.slice(0,50).map(e=>'<div class="ac-log"><b>'+acEsc(e.n||'—')+'</b> · '+acEsc(e.u)+' · '+(e.r==='appr'?L('approver','aprobador'):L('medic','médico'))+'<span>'+new Date(e.at).toLocaleDateString()+' · ID '+e.id+'</span></div>').join('')+'</div>';
  }
  if(!r)h+='<div class="algo-actions"><button onclick="accGate(true)">'+L('Request access','Pedir acceso')+'</button><button class="ghost" onclick="acReqView(\'appr\')">'+L('Become an approver','Ser aprobador')+'</button></div>';
  if(r&&r.r==='medic')h+='<div class="algo-actions"><button class="ghost" onclick="acReqView(\'appr\')">'+L('I\'m a medic NCO — become an approver','Soy NCO de médicos — ser aprobador')+'</button></div>';
  h+='<div class="algo-actions"><button class="ghost" onclick="acHaveView()">🔑 '+L('Paste approval / certificate / admin key','Pegar aprobación / certificado / llave admin')+'</button></div>';
  h+='<p class="note-hint foot">'+L('Approvals are signed and only work on the phone that asked for them. No names or IDs are stored on any server. To revoke someone, give the app owner the approval ID.','Las aprobaciones están firmadas y solo funcionan en el teléfono que las pidió. No se guardan nombres ni IDs en ningún servidor. Para revocar a alguien, dale al dueño de la app el ID de la aprobación.')+'</p>';
  return h;
}
function acHashCheck(){const h=location.hash||'';if(!/(acc|areq|acert|aroot)=/.test(h))return false;try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}acHandle(h);return true;}

/* init (runs after app.js) / inicio */
setTimeout(()=>{try{if(!acHashCheck())accGate();}catch(e){}},0);
