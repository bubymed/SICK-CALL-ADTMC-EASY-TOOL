/* Exercise animations — our own 2D figures (no image licenses, offline, same look in EN/ES).
   Animaciones de ejercicios — figuras 2D propias (sin licencias, sin internet, iguales en inglés y español).
   Two ways to describe a figure:
   - Skeleton poses (k: [...]) — hip position p:[x,y] + segment angles in degrees (0 = right, 90 = down, -90 = up):
     tor torso, nk neck, ua/fa near arm, ua2/fa2 far arm, th/sh/ft near leg, th2/sh2/ft2 far leg, tb = back bend (cat/camel).
     The figure moves between the poses (angles are interpolated, so limbs keep their length).
   - Raw points (raw:true) for close-ups (wrist, foot): joints as [x,y], segments listed in seg.
   mv: joints whose limbs move (accent color). fo: red focus circles on the working area — [[joints averaged], radius, dx, dy].
   vb: viewBox (default "0 38 200 74"); nf: no floor line; pr: static props (svg); ln: thin lines between joints (band, towel). */
const XA_L={tor:46,nk:13,ua:24,fa:22,th:38,sh:36,ft:11};
const XA_SUP={p:[100,97],tor:180,nk:180,ua:4,fa:0,ua2:4,fa2:0,th:0,sh:0,ft:-80,th2:0,sh2:0,ft2:-80};
const XA_HOOK=Object.assign({},XA_SUP,{th:-40,sh:52,ft:0,th2:-40,sh2:52,ft2:0});
const XA_SIDE={p:[102,97],tor:203,nk:203,ua:90,fa:180,ua2:25,fa2:-5,th:0,sh:0,ft:-80,th2:0,sh2:0,ft2:-80};
const XA_STAND={p:[100,54],sc:.68,tor:-90,nk:-90,ua:94,fa:92,ua2:86,fa2:88,th:90,sh:90,ft:0,th2:90,sh2:90,ft2:0};
const XA_QUAD={p:[85,61],tor:0,nk:-15,ua:90,fa:90,ua2:90,fa2:90,th:90,sh:180,ft:100,th2:90,sh2:180,ft2:100};
const XA_UP={p:[100,100],tor:-90,nk:-90,ua:95,fa:90,ua2:85,fa2:90};
const XA_SEAT={p:[70,97],tor:-75,nk:-80,ua:115,fa:100,ua2:115,fa2:100,th:0,sh:0,ft:-80,th2:0,sh2:0,ft2:-80};
const _x=(b,o)=>Object.assign({},b,o);
const XA_VB_ST='28 -6 144 118',XA_VB_UP='40 18 120 92';
const EX_ANIM={
 // ---- FM 7-22: 4 for the Core ----
 blr:{k:[_x(XA_SUP,{ua:8,fa:-3,nk:194,th:-90,sh:0,ft:-90,th2:-90,sh2:0,ft2:-90}),_x(XA_SUP,{ua:8,fa:-3,nk:194,th:-52,sh:-40,ft:-128,th2:-52,sh2:-40,ft2:-128})],
      mv:['k','a','t','k2','a2','t2'],fo:[[['s','p'],13]],vb:'0 18 200 94'},
 sidebridge:{k:[_x(XA_SIDE,{p:[102,99]}),_x(XA_SIDE,{p:[102,88],tor:189,nk:195,th:10,sh:10,th2:10,sh2:10})],mv:['p'],fo:[[['s','p'],13]]},
 backbridge:{k:[XA_HOOK,_x(XA_HOOK,{p:[96,74],tor:152,th:-15,sh:70,th2:-15,sh2:70}),_x(XA_HOOK,{p:[96,74],tor:152,th:-28,sh:-28,ft:-118,th2:-15,sh2:70})],seq:[0,1,2,1],
      mv:['p','k','a','t'],fo:[[['p'],11,0,-2],[['s','p'],11]]},
 birddog:{k:[XA_QUAD,_x(XA_QUAD,{th:178,sh:178,ft:88,ua2:-3,fa2:-3})],mv:['k','a','t','e2','w2'],fo:[[['s','p'],13]],vb:'0 30 200 82'},
 // ---- FM 7-22: Hip Stability Drill (side-lying, seen from the front) ----
 latraise:{k:[XA_SIDE,_x(XA_SIDE,{th:-11,sh:-11,ft:-91})],mv:['k','a','t'],fo:[[['p'],10,2,-4]]},
 medraise:{k:[_x(XA_SIDE,{th:-25,sh:36,ft:0}),_x(XA_SIDE,{th:-25,sh:36,ft:0,th2:-9,sh2:-9,ft2:-89})],mv:['k2','a2','t2'],fo:[[['p','k2'],10]]},
 clam:{k:[_x(XA_SIDE,{L:{th:22,sh:30},th:35,sh:160,ft:-110,th2:35,sh2:160,ft2:-110}),_x(XA_SIDE,{L:{th:22,sh:30},th:-25,sh:147,ft:-120,th2:35,sh2:160,ft2:-110})],
      mv:['k','a'],fo:[[['p'],10,2,-3]],vb:'0 40 200 76',nf:1},
 sltuck:{k:[_x(XA_SIDE,{th:-9,sh:-9,ft:-89}),_x(XA_SIDE,{th:-80,sh:0,ft:-90})],mv:['k','a','t'],fo:[[['p'],10,4,-4]],vb:'0 26 200 86'},
 slover:{k:[_x(XA_SUP,{p:[110,62],ua:-90,fa:-90,ua2:90,fa2:90,ft:0,ft2:0}),_x(XA_SUP,{p:[110,62],ua:-90,fa:-90,ua2:90,fa2:90,ft:0,ft2:0,th:58,sh:-32,ft:-32})],
      mv:['k','a','t'],fo:[[['p'],11,-6,0]],vb:'0 8 200 104',nf:1},
 // ---- FM 7-22: Recovery Drill ----
 ohpull:{k:[_x(XA_STAND,{ua:125,fa:40,ua2:55,fa2:140,th:80,sh:90,th2:100,sh2:90,ft2:180}),_x(XA_STAND,{tor:-76,nk:-70,ua:-98,fa:165,ua2:-122,fa2:-40,th:80,sh:90,th2:100,sh2:90,ft2:180})],
      mv:['e','w','e2','w2'],fo:[[['s','p','s'],8,-5,0]],vb:XA_VB_ST},
 rearlunge:{k:[_x(XA_STAND,{ua:115,fa:25,ua2:115,fa2:25}),_x(XA_STAND,{p:[105,58],ua:115,fa:25,ua2:115,fa2:25,th:120,sh:150,ft:100,th2:60,sh2:100})],
      mv:['p','k','a','t'],fo:[[['p','k'],8]],vb:XA_VB_ST},
 extflex:{k:[{p:[80,97],tor:-50,nk:-60,ua:70,fa:70,ua2:70,fa2:70,th:174,sh:174,ft:90,th2:174,sh2:174,ft2:90},{p:[53.7,45.8],tor:39,nk:100,ua:39,fa:39,ua2:39,fa2:39,th:128,sh:128,ft:200,th2:128,sh2:128,ft2:200}],
      mv:['p','s','h'],fo:[[['s','p'],12]],vb:'0 26 200 86'},
 thighstretch:{k:[XA_SIDE,_x(XA_SIDE,{th:5,sh:175,ft:95,ua2:22,fa2:30})],mv:['k','a','t','e2','w2'],fo:[[['p','k'],10]]},
 // ---- Knee ----
 quadset:{k:[_x(XA_SEAT,{th:-5,sh:5}),XA_SEAT],mv:['k'],fo:[[['p','k'],12,0,-2]]},
 slr:{k:[_x(XA_SUP,{th2:-40,sh2:52,ft2:0}),_x(XA_SUP,{th2:-40,sh2:52,ft2:0,th:-35,sh:-35,ft:-115})],mv:['k','a','t'],fo:[[['p','k'],11]],vb:'0 30 200 82'},
 minisquat:{k:[_x(XA_STAND,{p:[102,54.5],th:85,sh:82,th2:85,sh2:82}),_x(XA_STAND,{p:[102,65.1],th:45,sh:121,th2:45,sh2:121})],mv:['p','k'],fo:[[['p','k'],8]],vb:XA_VB_ST,
      pr:'<line x1="93" y1="-4" x2="93" y2="104" class="xa-prop" stroke-width="4"/>'},
 stepup:{k:[_x(XA_STAND,{p:[90,54],th:30,sh:78,th2:90,sh2:90}),_x(XA_STAND,{p:[115,40],tor:-85,th:90,sh:90,th2:100,sh2:120,ft2:30})],mv:['p','k','a2','k2'],fo:[[['p','k'],8]],vb:XA_VB_ST,
      pr:'<rect x="104" y="90" width="44" height="14" rx="2" class="xa-propf"/>'},
 qstretch:{k:[XA_STAND,_x(XA_STAND,{th:95,sh:-100,ft:-10,ua:115,fa:85,ua2:20,fa2:10})],mv:['k','a','t','e','w'],fo:[[['p','k'],8]],vb:XA_VB_ST},
 // ---- Hip ----
 bridge:{k:[XA_HOOK,_x(XA_HOOK,{p:[96,74],tor:152,th:-15,sh:70,th2:-15,sh2:70})],mv:['p','k'],fo:[[['p'],11,0,-2]]},
 hipflexor:{k:[{p:[88,76],sc:.68,tor:-90,nk:-90,ua:115,fa:25,ua2:115,fa2:25,th:97,sh:180,ft:90,th2:13.5,sh2:80,ft2:0},{p:[96,77],sc:.68,tor:-92,nk:-90,ua:115,fa:25,ua2:115,fa2:25,th:114.6,sh:180,ft:90,th2:11.8,sh2:85,ft2:0}],
      mv:['p'],fo:[[['p','k'],8,-2,0]],vb:XA_VB_ST},
 fig4:{k:[_x(XA_HOOK,{th:-62,sh:12,ft:-80,ua:-50,fa:-20}),_x(XA_HOOK,{th:-92,sh:-8,ft:-100,th2:-78,sh2:22,ft2:-30,ua:-60,fa:-40})],mv:['k','a','t','k2','a2','t2'],fo:[[['p'],10,2,-2]],vb:'0 26 200 86'},
 // ---- Low back ----
 curlup:{k:[_x(XA_SUP,{ua:8,fa:-3,th2:-40,sh2:52,ft2:0}),_x(XA_SUP,{ua:8,fa:-3,th2:-40,sh2:52,ft2:0,tor:190,nk:208})],mv:['s','h'],fo:[[['s','p'],12]]},
 catcamel:{k:[_x(XA_QUAD,{tb:-16,nk:30}),_x(XA_QUAD,{tb:12,nk:-35})],mv:['m','s'],fo:[[['s','p'],12]],vb:'0 30 200 82'},
 walk:{k:[_x(XA_STAND,{th:65,sh:85,ft:-5,th2:115,sh2:110,ft2:20,ua:110,fa:95,ua2:70,fa2:55}),_x(XA_STAND,{th:115,sh:110,ft:20,th2:65,sh2:85,ft2:-5,ua:70,fa:55,ua2:110,fa2:95})],
      mv:[],fo:[[['p'],8]],vb:XA_VB_ST,d:.75,hold:0},
 k2c:{k:[XA_SUP,_x(XA_SUP,{th:-118,sh:-22,ft:-100,ua:-50,fa:-15})],mv:['k','a','t','e','w'],fo:[[['p'],10,-4,-3]],vb:'0 26 200 86'},
 // ---- Neck ----
 chintuck:{k:[XA_UP,_x(XA_UP,{nk:-108})],mv:['h'],fo:[[['h','s'],7]],vb:XA_VB_UP,hide:['leg','leg2']},
 scapsq:{k:[_x(XA_UP,{ua:100,fa:0,ua2:100,fa2:0}),_x(XA_UP,{ua:128,fa:12,ua2:128,fa2:12})],mv:['e','w','e2','w2'],fo:[[['s'],8,-8,8]],vb:XA_VB_UP,hide:['leg','leg2']},
 uptrap:{k:[_x(XA_UP,{ua:100,fa:95,ua2:80,fa2:85}),_x(XA_UP,{nk:-128,ua:100,fa:95,ua2:-70,fa2:-170})],mv:['h','e2','w2'],fo:[[['h','s'],7,9,4]],vb:XA_VB_UP,hide:['leg','leg2']},
 levator:{k:[_x(XA_UP,{ua:100,fa:95,ua2:80,fa2:85}),_x(XA_UP,{nk:-150,ua:100,fa:95,ua2:-60,fa2:-160})],mv:['h','e2','w2'],fo:[[['h','s'],7,8,7]],vb:XA_VB_UP,hide:['leg','leg2']},
 // ---- Shoulder ----
 pendulum:{k:[_x(XA_STAND,{p:[92,52],tor:-10,nk:-5,ua:72,fa:72,ua2:28,fa2:50,th:85,sh:90,th2:95,sh2:90}),_x(XA_STAND,{p:[92,52],tor:-10,nk:-5,ua:108,fa:108,ua2:28,fa2:50,th:85,sh:90,th2:95,sh2:90})],
      mv:['e','w'],fo:[[['s'],8]],vb:XA_VB_ST,d:1,hold:.1,pr:'<rect x="138" y="60" width="44" height="6" rx="2" class="xa-propf"/><line x1="142" y1="66" x2="142" y2="104" class="xa-prop" stroke-width="3"/><line x1="178" y1="66" x2="178" y2="104" class="xa-prop" stroke-width="3"/>'},
 sler:{k:[_x(XA_SIDE,{ua2:90,fa2:180,ua:12,fa:100}),_x(XA_SIDE,{ua2:90,fa2:180,ua:12,fa:-70})],mv:['w'],fo:[[['s'],8,0,-3]],dot:'w'},
 wallslide:{k:[_x(XA_STAND,{p:[115,54],ua:24,fa:-90,ua2:24,fa2:-90}),_x(XA_STAND,{p:[115,54],ua:-37,fa:-95,ua2:-37,fa2:-95})],mv:['e','w','e2','w2'],fo:[[['s'],8,-3,2]],vb:XA_VB_ST,
      pr:'<line x1="135" y1="-6" x2="135" y2="104" class="xa-prop" stroke-width="4"/>'},
 // ---- Elbow / wrist / hand (close-ups) ----
 wext:{raw:1,seg:[['el','wr',12],['wr','fi',9],['oh','hm',7]],k:[{el:[30,62],wr:[120,62],fi:[160,62],oh:[176,36],hm:[148,58]},{el:[30,62],wr:[120,62],fi:[134,100],oh:[160,50],hm:[129,88]}],
      mv:['fi'],fo:[[['el','el','wr'],12,0,-6]],vb:'10 24 180 88',nf:1},
 wflex:{raw:1,seg:[['el','wr',12],['wr','fi',9],['oh','hm',7]],k:[{el:[30,62],wr:[120,62],fi:[160,62],oh:[176,88],hm:[148,66]},{el:[30,62],wr:[120,62],fi:[134,24],oh:[160,76],hm:[129,36]}],
      mv:['fi'],fo:[[['el','el','wr'],12,0,6]],vb:'10 14 180 88',nf:1},
 ecc:{raw:1,seg:[['el','wr',12],['wr','fi',9]],k:[{el:[30,66],wr:[120,66],fi:[146,40]},{el:[30,66],wr:[120,66],fi:[144,94]}],mv:['fi'],fo:[[['el','el','wr'],12,0,-6]],vb:'10 20 180 92',nf:1,dot:'fi',d:1.6,
      pr:'<rect x="14" y="73" width="108" height="6" rx="2" class="xa-propf"/>'},
 grip:{raw:1,seg:[['el','wr',12],['wr','mc',11],['mc','f1',8],['f1','f2',7],['wr','th',7]],k:[{el:[24,70],wr:[96,70],mc:[124,70],f1:[148,66],f2:[168,62],th:[118,52]},{el:[24,70],wr:[96,70],mc:[124,70],f1:[140,86],f2:[124,92],th:[128,62]}],
      mv:['f1','f2','th'],fo:[[['el','wr'],12,0,-2]],vb:'10 30 180 82',nf:1,pr:'<circle cx="134" cy="78" r="11" class="xa-propf"/>'},
 // ---- Ankle / foot (close-ups) ----
 alphabet:{raw:1,seg:[['kn','an',12],['an','he',8],['an','to',9]],k:[{kn:[70,8],an:[78,74],he:[70,84],to:[118,78]},{kn:[70,8],an:[78,74],he:[72,86],to:[112,98]},{kn:[70,8],an:[78,74],he:[66,80],to:[118,58]},{kn:[70,8],an:[78,74],he:[70,84],to:[122,70]}],
      loop:1,d:.6,hold:0,mv:['to','he'],fo:[[['an'],9]],vb:'20 0 160 110',nf:1},
 band:{raw:1,seg:[['kn','an',12],['an','he',8],['an','to',9]],ln:[['to','hd']],k:[{kn:[30,70],an:[118,70],he:[122,80],to:[126,34],hd:[40,30]},{kn:[30,70],an:[118,70],he:[114,80],to:[156,62],hd:[40,30]}],
      mv:['to'],fo:[[['kn','an','an'],10]],vb:'10 14 180 88',nf:1},
 pfstretch:{raw:1,seg:[['kn','an',12],['an','he',8],['he','ba',8],['ba','to',7],['oh','to',6]],k:[{kn:[50,20],an:[80,60],he:[70,72],ba:[122,76],to:[138,74],oh:[166,48]},{kn:[50,20],an:[80,60],he:[70,72],ba:[122,76],to:[132,54],oh:[160,36]}],
      mv:['to'],fo:[[['he','ba'],9,0,2]],vb:'20 10 170 92',nf:1},
 towel:{raw:1,seg:[['kn','an',12],['an','he',8],['he','ba',8],['ba','to',7]],ln:[['to','tw']],k:[{kn:[70,8],an:[80,82],he:[70,96],ba:[120,98],to:[136,98],tw:[196,101]},{kn:[70,8],an:[80,82],he:[70,96],ba:[120,98],to:[130,104],tw:[176,101]}],
      mv:['to'],fo:[[['he','ba'],9,0,-4]],vb:'20 0 180 112'},
 bottle:{raw:1,seg:[['kn','an',12],['an','he',8],['he','ba',8],['ba','to',7]],k:[{kn:[60,8],an:[68,80],he:[60,90],ba:[108,92],to:[122,92]},{kn:[92,8],an:[100,80],he:[92,90],ba:[140,92],to:[154,92]}],
      mv:['kn','an','he','ba','to'],fo:[[['he','ba'],9,0,-3]],vb:'20 0 170 112',d:.9,hold:.1,pr:'<rect x="70" y="92" width="80" height="12" rx="6" class="xa-propf"/>'},
 calfraise:{k:[XA_STAND,_x(XA_STAND,{p:[100,47.6],ft:-58,ft2:-58})],mv:['p','a','t'],fo:[[['k','a'],7,-3,0]],vb:XA_VB_ST},
 balance:{k:[_x(XA_STAND,{th:45,sh:110,ft:20,ua:55,fa:40,ua2:125,fa2:140}),_x(XA_STAND,{p:[102,54],tor:-87,th:45,sh:110,ft:20,ua:60,fa:45,ua2:120,fa2:135})],mv:[],fo:[[['a2'],8,0,-4]],vb:XA_VB_ST,d:1,hold:.3},
 calfstretch:{k:[_x(XA_STAND,{p:[100,56],tor:-70,nk:-60,ua:-12,fa:-6,ua2:-12,fa2:-6,th:114.6,sh:114.6,ft:0,th2:55,sh2:105}),_x(XA_STAND,{p:[106,58],tor:-62,nk:-55,ua:-6,fa:-2,ua2:-6,fa2:-2,th:121.3,sh:121.3,ft:0,th2:45,sh2:110})],
      mv:['p'],fo:[[['k','a'],7,-3,0]],vb:XA_VB_ST,pr:'<line x1="154" y1="-6" x2="154" y2="104" class="xa-prop" stroke-width="4"/>'}
};
const XA_SEG=[['h','s',6],['s','m',12],['m','p',12],['s','p',12],['s','e',7,'arm'],['e','w',6,'arm'],['s','e2',7,'arm2'],['e2','w2',6,'arm2'],['p','k',9,'leg'],['k','a',8,'leg'],['a','t',6,'leg'],['p','k2',9,'leg2'],['k2','a2',8,'leg2'],['a2','t2',6,'leg2']];
function xaDir(a){a=a*Math.PI/180;return [Math.cos(a),Math.sin(a)];}
function xaFK(q){const L=Object.assign({},XA_L,q.L||{}),sc=q.sc||1,J={};const add=(from,ang,len,to)=>{if(ang===undefined||!J[from])return;const d=xaDir(ang);J[to]=[J[from][0]+d[0]*len*sc,J[from][1]+d[1]*len*sc];};
  J.p=q.p.slice();
  if(q.tb!==undefined){add('p',q.tor+q.tb,L.tor/2,'m');add('m',q.tor-q.tb,L.tor/2,'s');}else add('p',q.tor,L.tor,'s');
  add('s',q.nk,L.nk,'h');add('s',q.ua,L.ua,'e');add('e',q.fa,L.fa,'w');add('s',q.ua2,L.ua,'e2');add('e2',q.fa2,L.fa,'w2');
  add('p',q.th,L.th,'k');add('k',q.sh,L.sh,'a');add('a',q.ft,L.ft,'t');add('p',q.th2,L.th,'k2');add('k2',q.sh2,L.sh,'a2');add('a2',q.ft2,L.ft,'t2');return J;}
function xaLerpA(a,b,f){let d=((b-a)%360+540)%360-180;return a+d*f;}
function xaPose(A,i,j,f){const a=A.k[i],b=A.k[j];
  if(A.raw){const o={};for(const n in a){const x=a[n],y=b[n]||x;o[n]=[x[0]+(y[0]-x[0])*f,x[1]+(y[1]-x[1])*f];}return o;}
  const q={L:a.L,sc:(a.sc||1)+((b.sc||1)-(a.sc||1))*f,p:[a.p[0]+(b.p[0]-a.p[0])*f,a.p[1]+(b.p[1]-a.p[1])*f]};
  for(const n in a){if(n==='p'||n==='L'||n==='sc')continue;q[n]=b[n]===undefined?a[n]:xaLerpA(a[n],b[n],f);}
  for(const n in b)if(q[n]===undefined&&n!=='p'&&n!=='L'&&n!=='sc')q[n]=b[n];
  if(b.L&&!a.L)q.L=b.L;return xaFK(q);}
/* timing: each move d s (default 1.1), hold at each pose (default .9 s) */
function xaPhase(A,t){const seq=A.seq||(A.loop||A.k.length>2?A.k.map((_,i)=>i):[0,1]),n=seq.length,d=A.d||1.1,h=A.hold===undefined?.9:A.hold,step=d+h,T=n*step,u=((t%T)+T)%T,i=Math.floor(u/step),r=u-i*step;
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;return {i:seq[i],j:seq[(i+1)%n],f:r<h?0:ease((r-h)/d)};}
function xaW(A,P){const sc=A.raw?1:(A.k[0].sc||1);return w=>Math.max(3,w*(sc<1?.82:1));}
function exAnimFrame(id,t){const A=EX_ANIM[id];if(!A)return '';const ph=xaPhase(A,t),P=xaPose(A,ph.i,ph.j,ph.f),mv=new Set(A.mv||[]),hide=new Set(A.hide||[]),W=xaW(A,P);
  const pt=(j)=>P[j],far=j=>/2$/.test(j);let back='',front='',fo='',ex='';const fmt=v=>v.toFixed(1);
  const line=(u,v,w,cls)=>'<line x1="'+fmt(P[u][0])+'" y1="'+fmt(P[u][1])+'" x2="'+fmt(P[v][0])+'" y2="'+fmt(P[v][1])+'" stroke-width="'+w+'" class="'+cls+'"/>';
  const segs=A.raw?A.seg:XA_SEG;
  segs.forEach(sg=>{const [u,v,w,grp]=sg;if(!pt(u)||!pt(v))return;if(grp&&hide.has(grp))return;if(!A.raw&&u==='s'&&v==='p'&&P.m)return;
    const torso=!A.raw&&(v==='p'||v==='m'||(u==='s'&&(v==='m'||v==='p')))&&!mv.has('s')&&!mv.has('m');const hot=!torso&&(mv.has(v)||(A.raw&&mv.has(u)));const ln=line(u,v,W(w),hot?(far(v)?'xa-hot xa-hotfar':'xa-hot'):far(v)?'xa-far':'xa-body');if(far(v))back+=ln;else front+=ln;});
  (A.ln||[]).forEach(([u,v])=>{if(pt(u)&&pt(v))ex+=line(u,v,2.5,'xa-band');});
  if(A.dot&&P[A.dot])ex+='<circle cx="'+fmt(P[A.dot][0])+'" cy="'+fmt(P[A.dot][1])+'" r="6" class="xa-propf"/>';
  const pulse=.5+.5*Math.sin(t*Math.PI*2/1.4);
  (A.fo||[]).forEach(([js,r,dx,dy])=>{const ps=js.map(pt).filter(Boolean);if(!ps.length)return;const x=ps.reduce((s,q)=>s+q[0],0)/ps.length+(dx||0),y=ps.reduce((s,q)=>s+q[1],0)/ps.length+(dy||0);
    fo+='<circle cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="'+fmt(r*(1+.12*pulse))+'" class="xa-fo" style="opacity:'+(.55+.4*pulse).toFixed(2)+'"/>';});
  const head=P.h&&!A.raw?'<circle cx="'+fmt(P.h[0])+'" cy="'+fmt(P.h[1])+'" r="'+fmt(9*(A.k[0].sc||1))+'" class="xa-head"/>':'';
  return back+ex+front+head+fo;}
function exAnimSvg(id){const A=EX_ANIM[id];if(!A)return '';
  return '<svg class="xa" data-anim="'+id+'" viewBox="'+(A.vb||'0 38 200 74')+'" role="img" aria-label="animation">'+(A.nf?'':'<line x1="-20" y1="104.5" x2="220" y2="104.5" class="xa-floor"/>')+(A.pr||'')+'<g class="xa-fig">'+exAnimFrame(id,0)+'</g></svg>';}
let _xaRaf=0,_xaT0=0;
function exAnimTick(ts){const els=document.querySelectorAll('svg.xa[data-anim]');if(!els.length){_xaRaf=0;return;}if(!_xaT0)_xaT0=ts;const t=(ts-_xaT0)/1000;
  els.forEach(el=>{const g=el.querySelector('.xa-fig');if(g)g.innerHTML=exAnimFrame(el.getAttribute('data-anim'),t);});_xaRaf=requestAnimationFrame(exAnimTick);}
function exAnimStart(){let reduce=false;try{reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce){document.querySelectorAll('svg.xa[data-anim]').forEach(el=>{const id=el.getAttribute('data-anim'),A=EX_ANIM[id],g=el.querySelector('.xa-fig');if(g&&A)g.innerHTML=exAnimFrame(id,(A.d||1.1)+(A.hold===undefined?.9:A.hold)+(A.hold===undefined?.9:A.hold));});return;}
  if(!_xaRaf)_xaRaf=requestAnimationFrame(exAnimTick);}
