const C='sickcall-v44';
const FILES=['./','index.html','style.css','app.js','data/protocols.js','data/searchterms.js','data/meds.js','data/plans.js','data/notetags.js','data/howto.js','data/specialtests.js','data/es.js','manifest.json','vendor/pdf-lib.min.js','forms/DD689.pdf','data/intake.js','intake.html','poster.html','vendor/qrcode.min.js','vendor/jsQR.min.js','access.js','data/access.js','data/medinfo.js','data/pfb.js','data/h2f.js','data/exercises.js','img/fm/backbridge.jpg','img/fm/bentlat.jpg','img/fm/blr.jpg','img/fm/latraise.jpg','img/fm/medraise.jpg','img/fm/pd1.jpg','img/fm/pd10.jpg','img/fm/pd10_m.jpg','img/fm/pd1_m.jpg','img/fm/pd2.jpg','img/fm/pd2_m.jpg','img/fm/pd3.jpg','img/fm/pd3_m.jpg','img/fm/pd4.jpg','img/fm/pd4_m.jpg','img/fm/pd5.jpg','img/fm/pd5_m.jpg','img/fm/pd6.jpg','img/fm/pd6_m.jpg','img/fm/pd7.jpg','img/fm/pd7_m.jpg','img/fm/pd8.jpg','img/fm/pd8_m.jpg','img/fm/pd9.jpg','img/fm/pd9_m.jpg','img/fm/quadraplex.jpg','img/fm/rd_ef.jpg','img/fm/rd_ef_m.jpg','img/fm/rd_lunge.jpg','img/fm/rd_lunge_m.jpg','img/fm/rd_oap.jpg','img/fm/rd_oap_m.jpg','img/fm/rd_slo.jpg','img/fm/rd_slo_m.jpg','img/fm/rd_thigh.jpg','img/fm/rd_thigh_m.jpg','img/fm/sidebridge.jpg','img/fm/sidebridge_m.jpg','img/fm/slover.jpg','img/fm/sltuck.jpg','img/fm/ssd_i.jpg','img/fm/ssd_l.jpg','img/fm/ssd_t.jpg','img/fm/ssd_w.jpg','img/fm/ssd_y.jpg','exercises.html','data/whatsnew.js','data/manual.js','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
/* Network with a 2-second limit, then the cached copy. Online with good signal you still get the newest files;
   with bad signal (motor pool, field) the app opens from the cache instead of waiting on the network.
   Cache keys ignore the query string (?r=knee&s=1, ?v=…), so the Soldier page and QR intake open offline.
   version.json is never cached. Missing files get a 503, not the medic app.
   Red con límite de 2 s y luego la copia guardada; las claves ignoran el ?…; version.json nunca se guarda. */
const WAIT=2000;
const keyOf=u=>{const x=new URL(u);x.search='';x.hash='';return x.href;};
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return; // other sites: browser default
  if(/\/version\.json$/.test(url.pathname)){e.respondWith(fetch(req,{cache:'no-store'}).catch(()=>new Response('{}',{status:503,headers:{'Content-Type':'application/json'}})));return;}
  const nav=req.mode==='navigate';
  const key=keyOf(req.url);
  const fromCache=()=>caches.open(C).then(c=>c.match(key,{ignoreSearch:true})).then(r=>r||(nav?caches.match(new URL('index.html',self.registration.scope).href):null));
  const net=fetch(nav?new Request(req.url,{cache:'no-cache',credentials:'same-origin'}):new Request(req,{cache:'no-cache'})).then(r=>{
    if(r&&r.ok&&r.type!=='opaque'){const cp=r.clone();e.waitUntil(caches.open(C).then(c=>c.put(key,cp)));}return r;});
  e.respondWith(new Promise(done=>{
    let settled=false;const finish=r=>{if(!settled&&r){settled=true;done(r);}};
    const t=setTimeout(()=>fromCache().then(r=>{if(r)finish(r);}),WAIT);
    net.then(r=>{clearTimeout(t);finish(r);}).catch(()=>{clearTimeout(t);fromCache().then(r=>finish(r||new Response('Offline — file not saved on this device yet.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));});
  }));
});
