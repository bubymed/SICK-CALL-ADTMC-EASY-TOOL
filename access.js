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
  revoked:id=>!!id&&((ACCESS.REVOKED||[]).includes(id)||(AC.get('sc_rev')||[]).includes(id)),
  async verifyCert(tok){for(const r of ACCESS.ROOT_PUBS){const c=await AC.verify(tok,r);if(c&&c.t==='cert'&&!AC.revoked(c.id))return c;}return null;},
  async verifyApproval(tok){const p=AC.dec(String(tok).split('.')[0]);if(!p||p.t!=='ok'||AC.revoked(p.id))return null;
    if(p.c){const c=await AC.verifyCert(p.c);if(!c)return null;const a=await AC.verify(tok,c.pub);return a&&a.t==='ok'?Object.assign(a,{_by:c.u||''}):null;}
    for(const r of ACCESS.ROOT_PUBS){const a=await AC.verify(tok,r);if(a&&a.t==='ok')return Object.assign(a,{_by:'admin'});}return null;},
  async verifyInvite(tok){const p=AC.dec(String(tok).split('.')[0]);if(!p||p.t!=='inv'||AC.revoked(p.id))return null;
    if(p.c){const c=await AC.verifyCert(p.c);if(!c)return null;const a=await AC.verify(tok,c.pub);return a&&a.t==='inv'?Object.assign(a,{_by:c.u||''}):null;}
    for(const r of ACCESS.ROOT_PUBS){const a=await AC.verify(tok,r);if(a&&a.t==='inv')return Object.assign(a,{_by:'admin'});}return null;},
  /* role on this device: 'root' | 'appr' | 'medic' | null */
  async role(){
    const rk=AC.get('sc_root');if(rk&&rk.prv&&ACCESS.ROOT_PUBS.includes(rk.pub))return{r:'root',u:'admin'};
    const ap=AC.get('sc_appr');if(ap&&ap.cert&&ap.prv){const c=await AC.verifyCert(ap.cert);if(c&&c.pub===ap.pub)return{r:'appr',u:c.u,cert:ap.cert,prv:ap.prv,id:c.id};}
    if(AC.revoked(AC.dev())){AC.set('sc_auth',null);return null;}
    const a=AC.get('sc_auth');
    if(a&&a.pid&&AC.revoked(a.pid)){AC.set('sc_auth',null);return null;}
    if(a&&a.inv){const v=await AC.verifyInvite(a.inv);if(v&&a.d===AC.dev())return{r:'medic',u:(a.reg&&a.reg.unit)||v.u,by:v._by,iat:Math.round((a.at||0)/1000),reg:a.reg||null,via:'inv'};AC.set('sc_auth',null);return null;}
    if(a&&a.tok){const v=await AC.verifyApproval(a.tok);if(v&&(v.d===AC.dev()||(a.pass&&a.d===AC.dev())))return{r:'medic',u:v.u,by:v._by,iat:v.iat};AC.set('sc_auth',null);}
    return null;}
};
let acRole=null;
function acEnforced(){return /^https?:/.test(location.protocol)&&new Date()>=new Date(ACCESS.ENFORCE_FROM+'T00:00:00');}
function acDays(){return Math.max(0,Math.ceil((new Date(ACCESS.ENFORCE_FROM+'T00:00:00')-new Date())/864e5));}
function acLink(k,v){return iqBase()+'#'+k+'='+v;}
function acQR(text){try{const q=qrcode(0,'L');q.addData(text);q.make();return q.createSvgTag({cellSize:3,margin:2,scalable:true});}catch(e){return '';}}
function acCopy(t,b){try{navigator.clipboard.writeText(t);if(b){const o=b.textContent;b.textContent=L('Copied ✓','Copiado ✓');setTimeout(()=>b.textContent=o,1500);}}catch(e){prompt('Copy',t);}}
function acShare(t,title,txt){if(navigator.share){navigator.share({title,text:txt||title,url:t}).catch(()=>{});}else acCopy(txt?txt+'\n'+t:t);}
function acEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/* ---------- overlay ---------- */
function acOv(html){let o=document.getElementById('mgOv');if(!o){o=document.createElement('div');o.id='mgOv';document.body.appendChild(o);}o.innerHTML='<div class="mg-card" role="dialog" aria-modal="true">'+html+'</div>';o.scrollTop=0;}
function acClose(){const o=document.getElementById('mgOv');if(o)o.remove();}
function acShareBox(link,title,txt){const tx=txt?acEsc(txt.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n')):'';return '<div class="ac-qr">'+acQR(link)+'</div><div class="ac-row"><button class="mg-btn" onclick="acShare(\''+link+'\',\''+acEsc(title)+'\',\''+tx+'\')">📤 '+L('Share link','Compartir link')+'</button><button class="mg-btn sec" onclick="acCopy(\''+link+'\',this)">'+L('Copy','Copiar')+'</button></div>';}
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
   +((typeof isIOS==='function'&&isIOS()&&typeof isStandalone==='function'&&!isStandalone())?'<div class="mg-ios">📱 '+L('<b>Already have the app on your Home Screen?</b> Open it from there — your access is saved in that app, not in Safari.','<b>¿Ya tienes la app en tu pantalla de inicio?</b> Ábrela desde ahí — tu acceso está guardado en esa app, no en Safari.')+'</div>':'')
   +'<button class="mg-btn" onclick="acHaveView()">🩺 '+L('I\'m a medic — scan unit QR','Soy médico — escanear QR de unidad')+'</button>'
   +'<button class="mg-btn sec" onclick="acHaveView()">🔑 '+L('I have an approval or link','Tengo una aprobación o link')+'</button>'
   +'<button class="mg-btn sec" onclick="location.href=\'intake.html\'">🤒 '+L('I\'m a Soldier and I feel sick','Soy soldado y me siento mal')+'</button>'
   +'<button class="mg-btn ghost" onclick="acGuest()">👤 '+L('Continue as a guest','Continuar como invitado')+'<small>'+L('Reference tools only','Solo herramientas de referencia')+'</small></button>'
   +'<div class="mg-links"><button onclick="acReqView(\'medic\')">'+L('No QR? Request access','¿Sin QR? Pedir acceso')+'</button><span>·</span><button onclick="acReqView(\'appr\')">'+L('NCO? Approver','¿NCO? Aprobador')+'</button>'+((typeof canInstall==='function'&&canInstall())?'<span>·</span><button onclick="installApp()">📲 '+L('Install app','Instalar app')+'</button>':'')+'</div>'
   +'<div class="mg-links" style="margin-top:-4px"><button onclick="acClose();acGuest();goRef(\'manual\');manFrom=\'gate\';renderMain()">📘 '+L('Operator\'s manual','Manual del operador')+'</button></div>'
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
   +'<p>'+L('Scan your unit QR (or an approval), or paste the link you received.','Escanea el QR de tu unidad (o una aprobación), o pega el link que recibiste.')+'</p>'
   +'<button class="mg-btn" onclick="acScan()">📷 '+L('Scan QR','Escanear QR')+'</button>'
   +'<textarea id="acP" class="ac-in" rows="3" placeholder="'+L('Paste link here','Pega el link aquí')+'"></textarea>'
   +'<button class="mg-btn sec" onclick="acHandle(document.getElementById(\'acP\').value)">'+L('Activate','Activar')+'</button><div id="acMsg" class="ac-msg"></div>');
}
function acScan(){iqScan(t=>{if(/#(acc|areq|acert|ainv|apass)=/.test(t)){acHandle(t);return true;}return false;});}
function acMsg(t,bad){const m=document.getElementById('acMsg');if(m){m.textContent=t;m.className='ac-msg'+(bad?' bad':'');}else iqToast(t);}
/* ---------- handle any access link/text ---------- */
async function acHandle(text){
  text=String(text||'').trim();const m=text.match(/#?(acc|areq|acert|aroot|ainv|apass)=([A-Za-z0-9_.-]+)/);
  if(!m){acMsg(L('That is not a Sick Call access code.','Eso no es un código de acceso de Sick Call.'),true);return;}
  const k=m[1],v=m[2];
  if(k==='apass'){const ok=await acPassUse(v);if(!ok)acOv('<h2>'+L('Link not valid','Link no válido')+'</h2><p>'+L('This personal link is invalid or was revoked. Scan your unit QR again.','Este link personal no es válido o fue revocado. Escanea otra vez el QR de tu unidad.')+'</p><button class="mg-btn" onclick="accGate(true)">'+L('Back','Atrás')+'</button>');return;}
  if(k==='ainv'){const iv=await AC.verifyInvite(v);
    if(!iv){acMsg(L('Invalid or revoked unit QR.','QR de unidad inválido o revocado.'),true);acOv('<h2>'+L('QR not valid','QR no válido')+'</h2><p>'+L('This unit QR is invalid or was revoked. Ask your NCO for a new one.','Este QR de unidad no es válido o fue revocado. Pídele uno nuevo a tu NCO.')+'</p><button class="mg-btn" onclick="accGate(true)">'+L('Back','Atrás')+'</button>');return;}
    if(iv.exp&&Date.now()/1000>iv.exp){acOv('<h2>'+L('QR expired','QR vencido')+'</h2><p>'+L('This unit QR expired. Ask your NCO for a new one.','Este QR de unidad ya venció. Pídele uno nuevo a tu NCO.')+'</p><button class="mg-btn" onclick="accGate(true)">'+L('Back','Atrás')+'</button>');return;}
    const me=acRole||await AC.role();if(me){acOv('<h2>✅ '+L('Already active','Ya estás activo')+'</h2><p>'+L('This phone already has access.','Este teléfono ya tiene acceso.')+'</p><button class="mg-btn" onclick="acClose();renderMain()">'+L('Open the app','Abrir la app')+'</button>');return;}
    acJoinView(v,iv);return;}
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
   +(!r?L('Not approved yet.','Todavía no aprobado.'):r.r==='root'?L('🛡 Root approver (app owner)','🛡 Aprobador principal (dueño)'):r.r==='appr'?L('✅ Approver — ','✅ Aprobador — ')+acEsc(r.u):L('✅ Approved medic — ','✅ Médico aprobado — ')+acEsc(r.u)+(r.reg?'<br><span style="color:var(--dim)">'+acEsc(r.reg.name||'')+' · '+acEsc(r.reg.mos||'')+'</span>':''))+'</div></div>';
  if(r&&(r.r==='root'||r.r==='appr')){
    h+='<div class="algo-actions"><button onclick="acInvView()">📲 '+L('Create unit QR','Crear QR de unidad')+'</button></div>';
    h+='<div class="algo-actions"><button onclick="acScan()">📷 '+L('Scan a request','Escanear solicitud')+'</button><button class="ghost" onclick="acHaveView()">'+L('Paste a request','Pegar solicitud')+'</button></div>';
    const log=AC.get('sc_aplog')||[];
    if(log.length)h+='<div class="field"><div class="lab"><span class="tag">📋</span><span class="name">'+L('My approvals','Mis aprobaciones')+'</span></div>'+log.slice(0,50).map(e=>'<div class="ac-log"><b>'+acEsc(e.n||'—')+'</b> · '+acEsc(e.u)+' · '+(e.r==='appr'?L('approver','aprobador'):e.r==='inv'?L('unit QR','QR de unidad'):L('medic','médico'))+'<span>'+new Date(e.at).toLocaleDateString()+' · ID '+e.id+'</span></div>').join('')+'</div>';
  }
  if(!r)h+='<div class="algo-actions"><button onclick="accGate(true)">'+L('Request access','Pedir acceso')+'</button><button class="ghost" onclick="acReqView(\'appr\')">'+L('Become an approver','Ser aprobador')+'</button></div>';
  if(r&&r.r==='medic')h+='<div class="algo-actions"><button onclick="acPassView()">🔗 '+L('My personal access link','Mi link personal de acceso')+'</button></div>';
  if(r&&r.r==='medic')h+='<div class="algo-actions"><button class="ghost" onclick="acReqView(\'appr\')">'+L('I\'m a medic NCO — become an approver','Soy NCO de médicos — ser aprobador')+'</button></div>';
  h+='<div class="algo-actions"><button class="ghost" onclick="acHaveView()">🔑 '+L('Paste approval / certificate / admin key','Pegar aprobación / certificado / llave admin')+'</button></div>';
  h+='<p class="note-hint foot">'+L('Approvals are signed. To use the app in another browser or phone, use your personal access link. To revoke someone, give the app owner the approval ID.','Las aprobaciones están firmadas. Para usar la app en otro navegador o teléfono, usa tu link personal de acceso. Para revocar a alguien, dale al dueño de la app el ID de la aprobación.')+'</p>';
  return h;
}
function acHashCheck(){const h=location.hash||'';if(!/(acc|areq|acert|aroot|ainv|apass)=/.test(h))return false;try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}acHandle(h);return true;}

/* ---------- Unit QR (invite) — one link per unit, medic registers once ----------
   Invite (#ainv=) signed by root or approver: {t:'inv', id, u:unit, exp, n:maxPhones, iat, c:certToken|null}
   The medic fills rank / name / MOS / unit / POC; the record goes to the owner's Tally form (SIGNUP_FORM) and only then is access granted.
   QR de unidad: un link por unidad; el médico se registra una vez y el registro le llega al dueño por Tally. */
const SIGNUP_FORM='5XKe2E';
const AC_RANKS=['PVT','PV2','PFC','SPC','CPL','SGT','SSG','SFC','MSG','1SG','SGM','CSM','WO1','CW2','CW3','CW4','CW5','2LT','1LT','CPT','MAJ','LTC','COL','HN','HM3','HM2','HM1','HMC','A1C','SrA','SSgt','TSgt','CIV','CTR'];
const AC_MOS=[['68W','68W Combat Medic'],['18D','18D SF Medical Sergeant'],['68C','68C Practical Nursing'],['68D','68D Operating Room'],['68E','68E Dental'],['68K','68K Medical Laboratory'],['68P','68P Radiology'],['68V','68V Respiratory'],['68B','68B Orthopedic'],['68F','68F Physical Therapy'],['68N','68N Cardiovascular'],['68U','68U ENT'],['68Y','68Y Eye'],['68X','68X Behavioral Health'],['68S','68S Preventive Medicine'],['65D','65D Physician Assistant'],['66','66 Nurse Corps'],['60/61/62','60/61/62 Physician'],['HM','Navy Hospital Corpsman (HM)'],['4N0','Air Force Aerospace Medical (4N0)'],['CIVMED','Civilian clinician (RN/PA/MD/NP/EMT)'],['NONE','My MOS is not listed']];
function acJoinView(tok,iv){
  const s=AC.get('sc_reg')||{};
  acOv('<button class="ac-back" onclick="accGate(true)">‹ '+L('Back','Atrás')+'</button><h2>'+L('Medic sign-up','Registro de médico')+'</h2>'
   +'<p class="mg-sub" style="margin-bottom:10px">'+L('Unit QR: ','QR de unidad: ')+'<b>'+acEsc(iv.u)+'</b>. '+L('Fill this once. It is only used to verify medic access. For medical personnel only — non-medical sign-ups will be revoked.','Llénalo una vez. Solo se usa para verificar el acceso de médicos. Solo para personal médico — quien no lo sea será revocado.')+'</p>'
   +'<div class="ac-row"><div style="flex:0 0 38%"><label class="ac-l">'+L('Rank','Rango')+'</label><select id="jR" class="ac-in"><option value="">—</option>'+AC_RANKS.map(r=>'<option'+(s.rank===r?' selected':'')+'>'+r+'</option>').join('')+'</select></div>'
   +'<div style="flex:1"><label class="ac-l">'+L('Last name','Apellido')+'</label><input id="jL" class="ac-in" maxlength="30" autocomplete="family-name" value="'+acEsc(s.last||'')+'"></div></div>'
   +'<label class="ac-l">'+L('First name + middle initial','Nombre + inicial')+'</label><input id="jF" class="ac-in" maxlength="30" autocomplete="given-name" placeholder="'+L('e.g. Michael A.','ej. Michael A.')+'" value="'+acEsc(s.first||'')+'">'
   +'<label class="ac-l">MOS</label><select id="jM" class="ac-in" onchange="document.getElementById(\'jNo\').style.display=this.value===\'NONE\'?\'block\':\'none\'"><option value="">—</option>'+AC_MOS.map(m=>'<option value="'+m[0]+'"'+(s.mos===m[0]?' selected':'')+'>'+m[1]+'</option>').join('')+'</select>'
   +'<div id="jNo" class="ac-msg bad" style="display:none">'+L('This app is for medical personnel. You can use guest mode.','Esta app es para personal médico. Puedes usar el modo invitado.')+' <button class="ac-skip" style="display:inline;width:auto;padding:0" onclick="acGuest()">'+L('Continue as a guest','Continuar como invitado')+'</button></div>'
   +'<label class="ac-l">'+L('Unit','Unidad')+'</label><input id="jU" class="ac-in" maxlength="40" value="'+acEsc(s.unit||iv.u||'')+'">'
   +'<label class="ac-l">'+L('Point of contact (optional)','Punto de contacto (opcional)')+'</label><input id="jP" class="ac-in" maxlength="60" placeholder="'+L('NCOIC name, phone or email','NCOIC, teléfono o correo')+'" value="'+acEsc(s.poc||'')+'">'
   +'<button class="mg-btn" onclick="acJoinNext(\''+tok+'\')">'+L('Continue','Continuar')+'</button><div id="acMsg" class="ac-msg"></div>');
}
function acJoinNext(tok){
  const g=id=>(document.getElementById(id).value||'').trim();
  const reg={rank:g('jR'),last:g('jL'),first:g('jF'),mos:g('jM'),unit:g('jU'),poc:g('jP')};
  if(!reg.rank||!reg.last||!reg.first||!reg.mos||!reg.unit){acMsg(L('Please fill in every field.','Llena todos los campos.'),true);return;}
  if(reg.mos==='NONE'){acMsg(L('This app is for medical personnel.','Esta app es para personal médico.'),true);return;}
  AC.set('sc_reg',reg);
  const pid=AC.rid();
  const name=reg.rank+' '+reg.last.toUpperCase()+', '+reg.first;
  const iv=AC.dec(String(tok).split('.')[0])||{};
  const q=new URLSearchParams({alignLeft:'1',hideTitle:'1',transparentBackground:'1',dynamicHeight:'1',rank:reg.rank,name:name,mos:reg.mos,unit:reg.unit,poc:reg.poc,device:AC.dev(),invite:iv.id||'',by:iv.c?'approver':'admin',pass:pid});
  window._acJoin={tok,reg,name,pid};
  acOv('<button class="ac-back" onclick="acJoinView(\''+tok+'\',AC.dec(\''+String(tok).split('.')[0]+'\'))">‹ '+L('Back','Atrás')+'</button><h2>'+L('Confirm','Confirmar')+'</h2>'
   +'<div class="ac-card"><div><span>'+L('Name','Nombre')+'</span><b>'+acEsc(name)+'</b></div><div><span>MOS</span><b>'+acEsc(reg.mos)+'</b></div><div><span>'+L('Unit','Unidad')+'</span><b>'+acEsc(reg.unit)+'</b></div><div><span>POC</span><b>'+acEsc(reg.poc)+'</b></div></div>'
   +'<p class="mg-f" style="margin-top:6px">'+L('Tap “Confirm & enter” below. Needs internet.','Toca “Confirmar y entrar” abajo. Necesita internet.')+'</p>'
   +'<iframe id="jFrame" class="ac-tally" src="https://tally.so/embed/'+SIGNUP_FORM+'?'+q.toString()+'" title="Sign-up" loading="eager"></iframe><div id="acMsg" class="ac-msg"></div>');
}
async function acJoinDone(){
  const j=window._acJoin;if(!j)return;window._acJoin=null;
  AC.set('sc_auth',{inv:j.tok,d:AC.dev(),reg:Object.assign({name:j.name},j.reg),at:Date.now(),pid:j.pid});acRole=await AC.role();
  if(!acRole){acOv('<h2>'+L('Something went wrong','Algo salió mal')+'</h2><p>'+L('Try the QR again.','Intenta otra vez con el QR.')+'</p><button class="mg-btn" onclick="accGate(true)">OK</button>');return;}
  acGuestOff();
  acOv('<h2>✅ '+L('You\'re in','Ya entraste')+'</h2><p>'+L('Welcome, ','Bienvenido, ')+'<b>'+acEsc(j.name)+'</b>'+(/\.$/.test(j.name)?' ':'. ')+L('This phone now has medic access.','Este teléfono ya tiene acceso de médico.')+'</p>'+acPassBox()+'<button class="mg-btn sec" onclick="acClose();renderNav();renderMain()">'+L('Open the app','Abrir la app')+'</button>');
}
window.addEventListener('message',e=>{
  if(!window._acJoin)return;if(!/^https:\/\/(www\.)?tally\.so$/.test(e.origin||''))return;
  let d=e.data;if(typeof d==='string'){try{d=JSON.parse(d);}catch(x){return;}}
  if(d&&d.event==='Tally.FormSubmitted')acJoinDone();
  if(d&&d.event==='Tally.Resize'&&d.payload&&d.payload.height){const f=document.getElementById('jFrame');if(f)f.style.height=Math.min(600,Math.max(160,d.payload.height))+'px';}
});
function acInvView(){
  const me=acRole;if(!me||(me.r!=='root'&&me.r!=='appr'))return;
  acOv('<button class="ac-back" onclick="acClose();goRef(\'access\')">‹ '+L('Back','Atrás')+'</button><h2>'+L('Create unit QR','Crear QR de unidad')+'</h2>'
   +'<p>'+L('Medics who open it register once (rank, name, MOS, unit) and get access.','Los médicos que lo abran se registran una vez (rango, nombre, MOS, unidad) y entran.')+'</p>'
   +'<label class="ac-l">'+L('Unit','Unidad')+'</label><input id="iU" class="ac-in" maxlength="40" value="'+acEsc(me.r==='appr'?me.u:'')+'"'+(me.r==='appr'?' readonly':'')+'>'
   +'<label class="ac-l">'+L('Valid for','Válido por')+'</label><select id="iD" class="ac-in"><option value="7">7 '+L('days','días')+'</option><option value="14">14 '+L('days','días')+'</option><option value="30" selected>30 '+L('days','días')+'</option></select>'
   +'<label class="ac-l">'+L('About how many medics?','¿Más o menos cuántos médicos?')+'</label><select id="iN" class="ac-in"><option>5</option><option>10</option><option selected>20</option><option>50</option></select>'
   +'<p class="mg-f">'+L('Share it only in medic chats or post it where only medics see it.','Compártelo solo en chats de médicos o ponlo donde solo lo vean médicos.')+'</p>'
   +'<button class="mg-btn" onclick="acInvMake()">'+L('Create QR','Crear QR')+'</button><div id="acMsg" class="ac-msg"></div>');
}
async function acInvMake(){
  const me=acRole;const u=(document.getElementById('iU').value||'').trim().slice(0,40);if(!u){acMsg(L('Enter the unit.','Escribe la unidad.'),true);return;}
  const days=parseInt(document.getElementById('iD').value,10)||30,n=parseInt(document.getElementById('iN').value,10)||20;
  const id=AC.rid(),iat=Math.round(Date.now()/1000),exp=iat+days*86400;
  const prv=me.r==='appr'?me.prv:AC.get('sc_root').prv;
  const link=acLink('ainv',await AC.sign({t:'inv',id,u,exp,n,iat,c:me.r==='appr'?me.cert:null},prv));
  const log=AC.get('sc_aplog')||[];log.unshift({id,n:L('Unit QR','QR de unidad')+' · '+days+'d · ~'+n,u,r:'inv',at:Date.now()});AC.set('sc_aplog',log.slice(0,300));
  const until=new Date(exp*1000).toLocaleDateString();
  const shareTxt=L('🩺 Sick Call — medic access ('+u+')\nNew to the app? Tap the link or scan the QR, fill your info once (1 min) and start using it.\niPhone: add the app to your Home Screen first, then open it there → “I have an approval or link” → scan or paste.\n⚠️ For medics only — do not forward. Non-medical sign-ups will be revoked.\nAlready have access? You don\'t need this.\nValid until '+until+'.','🩺 Sick Call — acceso de médicos ('+u+')\n¿Nuevo en la app? Toca el link o escanea el QR, llena tus datos una vez (1 min) y empieza a usarla.\niPhone: primero agrega la app a tu pantalla de inicio, ábrela desde ahí → “Tengo una aprobación o link” → escanea o pega.\n⚠️ Solo para médicos — no lo reenvíes. Quien no sea personal médico y se registre será revocado.\n¿Ya tienes acceso? No necesitas esto.\nVálido hasta '+until+'.');
  window._inv={link,u,until,txt:shareTxt};
  acOv('<div class="inv-card"><div class="inv-k">🩺 SICK CALL · '+L('MEDIC ACCESS','ACCESO DE MÉDICOS')+'</div><div class="inv-u">'+acEsc(u)+'</div>'
   +'<ol class="inv-steps"><li>'+L('<b>Scan</b> with your camera or tap the link','<b>Escanea</b> con tu cámara o toca el link')+'</li><li>'+L('<b>Fill your info once</b> — rank, name, MOS (1 min)','<b>Llena tus datos una vez</b> — rango, nombre, MOS (1 min)')+'</li><li>'+L('<b>Start using it</b> — you\'re in','<b>Empieza a usarla</b> — ya entraste')+'</li></ol>'
   +'<div class="inv-warn">⚠️ '+L('<b>For medics only. Do not forward.</b> Anyone who is not medical personnel and signs up will be revoked.','<b>Solo para médicos. No lo reenvíes.</b> Cualquier persona que no sea personal médico y se registre será revocada.')+'</div>'
   +'<div class="inv-ios">'+L('iPhone: add the app to your Home Screen first, open it there → “I have an approval or link” → scan.','iPhone: primero agrega la app a tu pantalla de inicio, ábrela desde ahí → “Tengo una aprobación o link” → escanea.')+'</div>'
   +'<div class="ac-qr">'+acQR(link)+'</div><div class="ac-row"><button class="mg-btn" onclick="acInvShare(this)">📤 '+L('Share','Compartir')+'</button><button class="mg-btn sec" onclick="acCopy(window._inv.txt+\'\\n\'+window._inv.link,this)">'+L('Copy text','Copiar texto')+'</button></div>'
   +'<div class="inv-f">'+L('Valid until ','Válido hasta ')+until+' · '+L('Already approved? You don\'t need this.','¿Ya tienes acceso? No necesitas esto.')+'</div></div>'
   +'<p class="mg-f">ID: '+id+' — '+L('to revoke this QR, give this ID to the app owner.','para revocar este QR, dale este ID al dueño de la app.')+'</p><button class="mg-btn sec" onclick="acClose();goRef(\'access\')">'+L('Done','Listo')+'</button>');
}
/* ---------- Personal access link (#apass=) — open it in any browser/phone to restore access without signing up again.
   Link personal de acceso — ábrelo en cualquier navegador/teléfono para recuperar el acceso sin registrarte otra vez.
   {t:'pass', id, k:'inv'|'acc', a:<signed invite or approval>, reg?} — revocable by id; the inner token is still verified. */
function acPassLink(){const a=AC.get('sc_auth');if(!a||!(a.inv||a.tok))return null;
  if(!a.pid){a.pid=AC.rid();AC.set('sc_auth',a);}
  const o=a.inv?{t:'pass',id:a.pid,k:'inv',a:a.inv,reg:a.reg?{name:a.reg.name,mos:a.reg.mos,unit:a.reg.unit}:null}:{t:'pass',id:a.pid,k:'acc',a:a.tok};
  return acLink('apass',AC.enc(o));}
function acPassTxt(){return L('🔐 My Sick Call personal access link — open it in any browser or phone to get back in (do not share it):','🔐 Mi link personal de Sick Call — ábrelo en cualquier navegador o teléfono para volver a entrar (no lo compartas):');}
function acPassBox(){const link=acPassLink();if(!link)return '';window._pass={link,txt:acPassTxt()};
  return '<div class="pass-box"><b>🔗 '+L('Save your personal link','Guarda tu link personal')+'</b><p>'+L('If you open the app in another browser (like Safari) or a new phone, open this link and you are back in — no sign-up. Send it to yourself (email, notes, WhatsApp). Do not share it.','Si abres la app en otro navegador (como Safari) o en otro teléfono, abre este link y vuelves a entrar — sin registrarte. Mándatelo a ti mismo (correo, notas, WhatsApp). No lo compartas.')+'</p><div class="ac-row"><button class="mg-btn" onclick="acShare(window._pass.link,\'Sick Call\',window._pass.txt)">📤 '+L('Send to myself','Mandármelo')+'</button><button class="mg-btn sec" onclick="acCopy(window._pass.link,this)">'+L('Copy link','Copiar link')+'</button></div></div>';}
function acPassView(){acOv('<button class="ac-back" onclick="acClose();goRef(\'access\')">‹ '+L('Back','Atrás')+'</button><h2>'+L('My personal link','Mi link personal')+'</h2>'+acPassBox()+'<button class="mg-btn sec" onclick="acClose();goRef(\'access\')">'+L('Done','Listo')+'</button>');}
async function acPassUse(v){const p=AC.dec(v);if(!p||p.t!=='pass'||!p.id||!p.a||AC.revoked(p.id))return false;
  const me=acRole||await AC.role();if(me){acOv('<h2>✅ '+L('Already active','Ya estás activo')+'</h2><p>'+L('This phone already has access.','Este teléfono ya tiene acceso.')+'</p><button class="mg-btn" onclick="acClose();renderMain()">'+L('Open the app','Abrir la app')+'</button>');return true;}
  if(p.k==='inv'){const iv=await AC.verifyInvite(p.a);if(!iv)return false;AC.set('sc_auth',{inv:p.a,d:AC.dev(),reg:p.reg||null,at:Date.now(),pid:p.id,restored:1});}
  else if(p.k==='acc'){const ap=await AC.verifyApproval(p.a);if(!ap)return false;AC.set('sc_auth',{tok:p.a,pass:1,d:AC.dev(),at:Date.now(),pid:p.id});}
  else return false;
  acRole=await AC.role();if(!acRole){AC.set('sc_auth',null);return false;}
  acGuestOff();
  acOv('<h2>✅ '+L('Welcome back','Bienvenido de nuevo')+'</h2><p>'+L('Your access is restored on this phone/browser.','Tu acceso quedó activo en este teléfono/navegador.')+'</p><button class="mg-btn" onclick="acClose();renderNav();renderMain()">'+L('Open the app','Abrir la app')+'</button>');return true;}
/* Unit QR as an image (what you see on screen) + text + link, via the share sheet.
   QR de unidad como imagen (lo que ves en pantalla) + texto + link, con el menú de compartir. */
function acInvCanvas(){const v=window._inv;const W=1080,P=72;const cv=document.createElement('canvas');const c=cv.getContext('2d');
  const F='-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  const wrap=(t,font,maxW)=>{c.font=font;const out=[];t.split('\n').forEach(par=>{let line='';par.split(' ').forEach(w=>{const tst=line?line+' '+w:w;if(c.measureText(tst).width>maxW&&line){out.push(line);line=w;}else line=tst;});out.push(line);});return out;};
  const steps=[L('1. Scan with your camera or tap the link','1. Escanea con tu cámara o toca el link'),L('2. Fill your info once — rank, name, MOS (1 min)','2. Llena tus datos una vez — rango, nombre, MOS (1 min)'),L('3. Start using it','3. Empieza a usarla')];
  const warn=L('⚠ FOR MEDICS ONLY. DO NOT FORWARD. Anyone who is not medical personnel and signs up will be revoked.','⚠ SOLO PARA MÉDICOS. NO LO REENVÍES. Cualquier persona que no sea personal médico y se registre será revocada.');
  const ios=L('iPhone: add the app to your Home Screen first, open it there → “I have an approval or link” → scan.','iPhone: primero agrega la app a tu pantalla de inicio, ábrela desde ahí → “Tengo una aprobación o link” → escanea.');
  const stepL=steps.map(t=>wrap(t,'600 40px '+F,W-2*P)),warnL=wrap(warn,'600 34px '+F,W-2*P-48),iosL=wrap(ios,'400 30px '+F,W-2*P-48);
  const qrS=620;let H=P+40+20+90+30+stepL.flat().length*54+30+warnL.length*46+48+24+iosL.length*42+40+30+qrS+40+60+P;
  cv.width=W;cv.height=H;c.fillStyle='#000';c.fillRect(0,0,W,H);
  c.fillStyle='#1C1C1E';c.beginPath();c.roundRect?c.roundRect(24,24,W-48,H-48,48):c.rect(24,24,W-48,H-48);c.fill();
  let y=P+40;c.fillStyle='#FF9F0A';c.font='800 32px '+F;c.fillText('SICK CALL · '+L('MEDIC ACCESS','ACCESO DE MÉDICOS'),P,y);
  y+=20+80;c.fillStyle='#fff';c.font='800 76px '+F;c.fillText(v.u,P,y);y+=30;
  c.font='600 40px '+F;stepL.flat().forEach(l=>{y+=54;c.fillText(l,P,y);});y+=30;
  const wh=warnL.length*46+48;c.fillStyle='rgba(255,69,58,.18)';c.strokeStyle='rgba(255,69,58,.6)';c.lineWidth=3;c.beginPath();c.roundRect?c.roundRect(P,y,W-2*P,wh,20):c.rect(P,y,W-2*P,wh);c.fill();c.stroke();
  c.fillStyle='#fff';c.font='600 34px '+F;warnL.forEach((l,i)=>c.fillText(l,P+24,y+24+34+i*46));y+=wh+24;
  const ih=iosL.length*42+40;c.fillStyle='#2C2C2E';c.beginPath();c.roundRect?c.roundRect(P,y,W-2*P,ih,20):c.rect(P,y,W-2*P,ih);c.fill();
  c.fillStyle='#AEAEB2';c.font='400 30px '+F;iosL.forEach((l,i)=>c.fillText(l,P+24,y+20+30+i*42));y+=ih+30;
  const qx=(W-qrS)/2;c.fillStyle='#fff';c.beginPath();c.roundRect?c.roundRect(qx,y,qrS,qrS,36):c.rect(qx,y,qrS,qrS);c.fill();
  try{const q=qrcode(0,'M');q.addData(v.link);q.make();const n=q.getModuleCount(),m=36,cell=(qrS-2*m)/n;c.fillStyle='#000';for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))c.fillRect(Math.floor(qx+m+k*cell),Math.floor(y+m+r*cell),Math.ceil(cell),Math.ceil(cell));}catch(e){}
  y+=qrS+60;c.fillStyle='#AEAEB2';c.font='400 30px '+F;c.textAlign='center';c.fillText(L('Valid until ','Válido hasta ')+v.until+' · '+L('Already approved? You don’t need this.','¿Ya tienes acceso? No lo necesitas.'),W/2,y);
  return cv;}
async function acInvShare(btn){const v=window._inv;if(!v)return;
  try{const cv=acInvCanvas();const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
    const file=new File([blob],'Sick_Call_medic_access_'+v.u.replace(/[^A-Za-z0-9]+/g,'_')+'.png',{type:'image/png'});
    const text=v.txt+'\n'+v.link;
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text,title:'Sick Call'});return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;document.body.appendChild(a);a.click();a.remove();
    acCopy(text,btn);if(typeof iqToast==='function')iqToast(L('Image saved and text copied — paste it in your chat.','Imagen guardada y texto copiado — pégalo en tu chat.'));
  }catch(e){if(e&&e.name==='AbortError')return;acShare(v.link,'Sick Call',v.txt);}
}
/* Remote revocation list (revoked.json) — checked on open; cached for offline. / Lista de revocados remota. */
function acRevSync(){if(!/^https?:/.test(location.protocol))return;
  fetch('revoked.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(async j=>{if(!j||!Array.isArray(j.ids))return;AC.set('sc_rev',j.ids.slice(0,5000));
    if(acRole&&acRole.r==='medic'){const r=await AC.role();if(!r){acRole=null;accGate(true);}}}).catch(()=>{});}

/* init (runs after app.js) / inicio */
setTimeout(()=>{try{if(!acHashCheck())accGate();}catch(e){}acRevSync();},0);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')acRevSync();});
