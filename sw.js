const C='sickcall-v24';
const FILES=['./','index.html','style.css','app.js','data/protocols.js','data/meds.js','data/plans.js','data/notetags.js','data/howto.js','data/es.js','manifest.json','vendor/pdf-lib.min.js','forms/DD689.pdf','data/intake.js','intake.html','poster.html','vendor/qrcode.min.js','vendor/jsQR.min.js','access.js','data/access.js','data/medinfo.js','data/pfb.js','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// Network-first: always the newest files when online; cached copy when offline.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  // Same-origin: revalidate with the server (skip the browser's 10-min HTTP cache) so a new version shows up on next open.
  const net=same?(e.request.mode==='navigate'?fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}):fetch(new Request(e.request,{cache:'no-cache'}))):fetch(e.request);
  e.respondWith(net.then(r=>{if(r&&r.ok&&new URL(e.request.url).origin===location.origin){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
