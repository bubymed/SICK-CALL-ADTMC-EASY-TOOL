/* Exercise animations v2 — our own 2D figures (no image licenses, offline, same in EN/ES).
   Animaciones de ejercicios v2 — figuras 2D propias (sin licencias, sin internet, iguales en inglés y español).
   Figure kinds:
   - Skeleton (default): hip p:[x,y] + segment angles in degrees (0 right, 90 down, -90 up): tor torso, nk neck, ua/fa near arm,
     ua2/fa2 far arm, th/sh/ft near leg, th2/sh2/ft2 far leg, tb back bend, sc scale, L length overrides. Angles are interpolated
     so limbs keep their length. Side faces get a nose/eye so you can tell which way the person looks.
   - raw: joints as [x,y] (front views, close-ups), segments in seg, filled shapes in poly.
   - custom(X,t): draws the whole picture (foot/hand close-ups) from interpolated numbers X.
   Common: mv moving joints (orange) · fo red focus circles [[joints],r,dx,dy] or fc [[x,y,r]] · ar arrows [x1,y1,x2,y2,bend,both]
   · pr static props (svg) · bb extra points for the auto-crop · x:{} numbers per pose for custom drawings. */
const XA_L={tor:46,nk:13,ua:24,fa:22,th:38,sh:36,ft:11};
const XA_SUP={p:[100,97],tor:180,nk:180,ua:4,fa:0,ua2:4,fa2:0,th:0,sh:0,ft:-80,th2:0,sh2:0,ft2:-80};
const XA_HOOK=Object.assign({},XA_SUP,{th:-40,sh:52,ft:0,th2:-40,sh2:52,ft2:0});
const XA_SIDE={p:[102,97],tor:203,nk:203,ua:90,fa:180,ua2:25,fa2:-5,th:0,sh:0,ft:-80,th2:0,sh2:0,ft2:-80};
const XA_STAND={p:[100,54],sc:.68,tor:-90,nk:-90,ua:94,fa:92,ua2:86,fa2:88,th:90,sh:90,ft:0,th2:90,sh2:90,ft2:0};
const XA_QUAD={p:[85,61],tor:0,nk:-15,ua:90,fa:90,ua2:90,fa2:90,th:90,sh:180,ft:100,th2:90,sh2:180,ft2:100};
const XA_SEAT={p:[60,97],tor:-75,nk:-80,ua:115,fa:100,ua2:115,fa2:100,th:0,sh:0,ft:-80,th2:0,sh2:0,ft2:-80};
const _x=(b,o)=>Object.assign({},b,o);
const XA_CHAIR='<rect x="42" y="78" width="48" height="5" rx="2" class="xa-propf"/><line x1="46" y1="83" x2="46" y2="104" class="xa-prop" stroke-width="3"/><line x1="86" y1="83" x2="86" y2="104" class="xa-prop" stroke-width="3"/><line x1="44" y1="80" x2="44" y2="34" class="xa-prop" stroke-width="4"/>';
const XA_MAT='<rect x="6" y="101" width="188" height="5" rx="2" class="xa-propf" opacity=".6"/>';
/* ---- drawing helpers ---- */
const xf=v=>(+v).toFixed(1);
function xaDir(a){a=a*Math.PI/180;return [Math.cos(a),Math.sin(a)];}
function xaArrow(x1,y1,x2,y2,bend,both){const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,cx=mx-dy/L*(bend||0),cy=my+dx/L*(bend||0);
  const head=(tx,ty,fx,fy)=>{const a=Math.atan2(ty-fy,tx-fx),s=6;return '<path d="M'+xf(tx)+' '+xf(ty)+' L'+xf(tx-s*Math.cos(a-.5))+' '+xf(ty-s*Math.sin(a-.5))+' L'+xf(tx-s*Math.cos(a+.5))+' '+xf(ty-s*Math.sin(a+.5))+'Z" class="xa-arh"/>';};
  return '<path d="M'+xf(x1)+' '+xf(y1)+' Q'+xf(cx)+' '+xf(cy)+' '+xf(x2)+' '+xf(y2)+'" class="xa-ar"/>'+head(x2,y2,cx,cy)+(both?head(x1,y1,cx,cy):'');}
/* frontal face: tilt = direction from neck to top of head (deg), look = 0..1 eyes down */
function xaFaceFront(h,r,tilt,look){const u=xaDir(tilt),v=xaDir(tilt+90),lk=look||0,e=(s)=>'<circle cx="'+xf(h[0]+u[0]*(3-4*lk)+v[0]*5.5*s)+'" cy="'+xf(h[1]+u[1]*(3-4*lk)+v[1]*5.5*s)+'" r="1.9" class="xa-eye"/>';
  const m1=[h[0]-u[0]*(6+2*lk)+v[0]*4,h[1]-u[1]*(6+2*lk)+v[1]*4],m2=[h[0]-u[0]*(6+2*lk)-v[0]*4,h[1]-u[1]*(6+2*lk)-v[1]*4];
  return '<circle cx="'+xf(h[0])+'" cy="'+xf(h[1])+'" r="'+r+'" class="xa-head"/>'+e(1)+e(-1)+'<line x1="'+xf(m1[0])+'" y1="'+xf(m1[1])+'" x2="'+xf(m2[0])+'" y2="'+xf(m2[1])+'" class="xa-mouth"/>';}
/* side face: up = direction from neck to head top, face = +1 nose on the right of "up" */
function xaFaceSide(h,r,up,face){const n=xaDir(up+90*(face||1)),u=xaDir(up);
  const nx=h[0]+n[0]*r,ny=h[1]+n[1]*r,b1=[nx-n[0]*1+u[0]*4,ny-n[1]*1+u[1]*4],b2=[nx+n[0]*4-u[0]*1,ny+n[1]*4-u[1]*1],b3=[nx-n[0]*1-u[0]*3,ny-n[1]*1-u[1]*3];
  return '<circle cx="'+xf(h[0])+'" cy="'+xf(h[1])+'" r="'+xf(r)+'" class="xa-head"/><path d="M'+xf(b1[0])+' '+xf(b1[1])+' L'+xf(b2[0])+' '+xf(b2[1])+' L'+xf(b3[0])+' '+xf(b3[1])+'Z" class="xa-head"/>'
   +'<circle cx="'+xf(h[0]+n[0]*r*.45+u[0]*r*.25)+'" cy="'+xf(h[1]+n[1]*r*.45+u[1]*r*.25)+'" r="'+xf(r*.14)+'" class="xa-eye"/>';}
/* foot close-up (side view, toes to the right). ankle at (ax,ay); rot turns the whole foot about the ankle; toe bends the toes about the ball */
const XA_FOOT=[[-8,-6],[-16,8],[-16,20],[-8,28],[8,28],[22,25],[40,30],[50,30],[52,24],[44,16],[26,8],[12,-4]],XA_TOE=[[48,30],[66,31],[69,27],[66,22],[50,22]],XA_BALL=[49,26];
function xaRot(p,c,a){const r=a*Math.PI/180,dx=p[0]-c[0],dy=p[1]-c[1];return [c[0]+dx*Math.cos(r)-dy*Math.sin(r),c[1]+dx*Math.sin(r)+dy*Math.cos(r)];}
function xaFootSvg(ax,ay,rot,toe,s,hot){s=s||1;const P=q=>[ax+q[0]*s,ay+q[1]*s];const A=[ax,ay];
  const ft=XA_FOOT.map(q=>xaRot(P(q),A,rot)),ball=xaRot(P(XA_BALL),A,rot),to=XA_TOE.map(q=>xaRot(xaRot(P(q),A,rot),ball,toe));
  const pl=a=>a.map(q=>xf(q[0])+','+xf(q[1])).join(' ');const tip=xaRot(xaRot(P([67,26]),A,rot),ball,toe);
  return {svg:'<polygon points="'+pl(ft)+'" class="xa-fill"/><polygon points="'+pl(to)+'" class="'+(hot?'xa-fillhot':'xa-fill')+'"/>',tip,ball};}
function xaLeg(ax,ay,len,ang,w){const d=xaDir(ang);return '<line x1="'+xf(ax)+'" y1="'+xf(ay)+'" x2="'+xf(ax+d[0]*len)+'" y2="'+xf(ay+d[1]*len)+'" stroke-width="'+(w||20)+'" class="xa-body"/>';}
/* ---- the animations ---- */
const EX_ANIM={
 // ===== FM 7-22 · 4 for the Core =====
 blr:{k:[_x(XA_SUP,{ua:8,fa:-3,nk:194,th:-90,sh:0,ft:-90,th2:-90,sh2:0,ft2:-90}),_x(XA_SUP,{ua:8,fa:-3,nk:194,th:-52,sh:-40,ft:-128,th2:-52,sh2:-40,ft2:-128})],
      mv:['k','a','t'],fo:[[['s','p'],13]],ar:[[150,52,162,34,-8]],hide:['leg2']},
 sidebridge:{k:[_x(XA_SIDE,{p:[102,99]}),_x(XA_SIDE,{p:[102,86],tor:189,nk:195,th:10,sh:10,th2:10,sh2:10})],mv:['p'],fo:[[['s','p'],13]],ar:[[104,108,104,80,0]],hide:['leg2']},
 backbridge:{k:[XA_HOOK,_x(XA_HOOK,{p:[96,74],tor:152,th:-15,sh:70,th2:-15,sh2:70}),_x(XA_HOOK,{p:[96,74],tor:152,th:-28,sh:-28,ft:-118,th2:-15,sh2:70})],seq:[0,1,2,1],
      mv:['k','a','t'],fo:[[['p'],11,0,-2]],ar:[[92,100,92,62,0]]},
 birddog:{k:[XA_QUAD,_x(XA_QUAD,{th:178,sh:178,ft:88,ua2:-3,fa2:-3})],mv:['k','a','t','e2','w2'],fo:[[['s','p'],13]],ar:[[150,46,182,46,0],[50,46,18,46,0]]},
 // ===== FM 7-22 · Hip Stability Drill (lying on the side, seen from the front) =====
 latraise:{k:[XA_SIDE,_x(XA_SIDE,{th:-11,sh:-11,ft:-91})],mv:['k','a','t'],fo:[[['p'],10,2,-4]],ar:[[176,92,176,72,6]]},
 medraise:{k:[_x(XA_SIDE,{th:-25,sh:36,ft:0}),_x(XA_SIDE,{th:-25,sh:36,ft:0,th2:-13,sh2:-13,ft2:-93})],mv:['k2','a2','t2'],fo:[[['p','k2'],10]],ar:[[184,100,184,84,6]]},
 clam:{raw:1,pr:XA_MAT,face:['h','s',-1],seg:[['s','p',14],['s','eb',8],['eb','wb',7],['s','et',8],['et','wt',7],['p','kb',10,'far'],['kb','fb',9,'far'],['p','kt',10],['kt','ft',9]],
      k:[{h:[34,74],s:[54,82],eb:[44,99],wb:[24,99],et:[80,74],wt:[104,80],p:[112,88],kb:[150,98],fb:[116,100],kt:[149,92],ft:[117,96]},
         {h:[34,74],s:[54,82],eb:[44,99],wb:[24,99],et:[80,74],wt:[104,80],p:[112,88],kb:[150,98],fb:[116,100],kt:[134,56],ft:[117,96]}],
      mv:['kt'],fc:[[116,80,10]],ar:[[160,86,142,52,-10]]},
 bentlat:{raw:1,pr:XA_MAT,face:['h','s',-1],seg:[['s','p',14],['s','eb',8],['eb','wb',7],['s','et',8],['et','wt',7],['p','kb',10,'far'],['kb','fb',9,'far'],['p','kt',10],['kt','ft',9]],
      k:[{h:[34,74],s:[54,82],eb:[44,99],wb:[24,99],et:[80,74],wt:[104,80],p:[112,88],kb:[150,98],fb:[116,100],kt:[149,92],ft:[117,96]},
         {h:[34,74],s:[54,82],eb:[44,99],wb:[24,99],et:[80,74],wt:[104,80],p:[112,88],kb:[150,98],fb:[116,100],kt:[146,64],ft:[114,68]}],
      mv:['kt','ft'],fc:[[116,80,10]],ar:[[168,90,160,58,-6]]},
 sltuck:{k:[_x(XA_SIDE,{th:-9,sh:-9,ft:-89}),_x(XA_SIDE,{L:{th:26},th:-150,sh:8,ft:-82})],mv:['k','a','t'],fo:[[['p'],10,4,-4]],ar:[[176,82,96,70,-14]]},
 slover:{raw:1,nf:1,poly:[['sT','sB','hB','hT']],face:['h','n',1],hr:11,seg:[['n','h',9],['sT','eT',8],['eT','wT',7],['sB','eB',8],['eB','wB',7],['hB','kB',10],['kB','aB',9],['hT','kT',10],['kT','aT',9]],
      k:[{h:[30,62],n:[46,62],sT:[54,48],sB:[54,76],hT:[104,54],hB:[104,70],eT:[54,26],wT:[54,4],eB:[54,98],wB:[54,120],kB:[142,70],aB:[180,70],kT:[142,54],aT:[180,54]},
         {h:[30,62],n:[46,62],sT:[54,48],sB:[54,76],hT:[104,54],hB:[104,70],eT:[54,26],wT:[54,4],eB:[80,104],wB:[118,100],kB:[142,70],aB:[180,70],kT:[124,96],aT:[158,104]}],
      mv:['kT','aT','eB','wB'],fc:[[100,62,11]],ar:[[150,46,138,92,-14]]},
 ohpull:{R:1.15,raw:1,poly:[['sL','sR','hR','hL']],face:['h','n',1],seg:[['n','h',9],['sL','sR',12],['sL','eL',8],['eL','wL',7],['sR','eR',8],['eR','wR',7],['hL','kL',10],['kL','aL',9],['hR','kR',10],['kR','aR',9],['aL','tL',6],['aR','tR',6]],
      k:[{h:[100,14],n:[100,30],sL:[84,34],sR:[116,34],eL:[72,48],wL:[88,60],eR:[128,48],wR:[112,60],hL:[90,64],hR:[110,64],kL:[85,84],kR:[115,84],aL:[81,103],aR:[119,103],tL:[73,104],tR:[127,104]},
         {h:[110,16],n:[106,31],sL:[91,33],sR:[121,38],eL:[96,4],wL:[112,12],eR:[124,14],wR:[100,6],hL:[90,64],hR:[110,64],kL:[85,84],kR:[115,84],aL:[81,103],aR:[119,103],tL:[73,104],tR:[127,104]}],
      mv:['eL','wL','eR','wR'],fc:[[88,44,9]],ar:[[104,-12,128,-2,-6]]},
 rearlunge:{R:1.15,k:[_x(XA_STAND,{ua:115,fa:25,ua2:115,fa2:25}),_x(XA_STAND,{p:[105,58],ua:115,fa:25,ua2:115,fa2:25,th:120,sh:150,ft:100,th2:60,sh2:100})],
      mv:['k','a','t'],fo:[[['p','k'],8]],ar:[[92,96,70,96,-4]]},
 extflex:{k:[{p:[80,97],tor:-50,nk:-60,ua:70,fa:70,ua2:70,fa2:70,th:174,sh:174,ft:90,th2:174,sh2:174,ft2:90},{p:[53.7,45.8],tor:39,nk:100,ua:39,fa:39,ua2:39,fa2:39,th:128,sh:128,ft:200,th2:128,sh2:128,ft2:200}],
      mv:['p','s'],fo:[[['s','p'],12]],ar:[[76,84,58,56,-10]]},
 thighstretch:{raw:1,pr:XA_MAT,face:['h','s',1,'side'],hr:10,seg:[['s','p',14],['s','eb',8],['eb','wb',7],['p','kb',10,'far'],['kb','ab',9,'far'],['p','k',10],['k','a',9],['a','t',6],['s','e',8],['e','w',7]],
      k:[{h:[38,70],s:[58,80],eb:[58,101],wb:[34,101],p:[112,92],kb:[150,96],ab:[186,98],k:[150,90],a:[186,92],t:[190,84],e:[84,82],w:[106,86]},
         {h:[38,70],s:[58,80],eb:[58,101],wb:[34,101],p:[112,92],kb:[150,96],ab:[186,98],k:[150,90],a:[122,70],t:[114,64],e:[90,70],w:[118,70]}],
      mv:['a','t','e','w'],fc:[[132,88,10]],ar:[[184,82,132,62,14]]},
 quadset:{k:[_x(XA_SEAT,{th:-6,sh:6}),XA_SEAT],mv:['k'],fo:[[['p','k'],12,0,-2]],ar:[[126,72,126,90,0]],d:.6,hold:1},
 slr:{k:[_x(XA_SUP,{th2:-40,sh2:52,ft2:0}),_x(XA_SUP,{th2:-40,sh2:52,ft2:0,th:-35,sh:-35,ft:-115})],mv:['k','a','t'],fo:[[['p','k'],11]],ar:[[182,92,170,58,-8]]},
 minisquat:{R:1.15,k:[_x(XA_STAND,{p:[102,54.5],th:85,sh:82,th2:85,sh2:82}),_x(XA_STAND,{p:[102,65.1],th:45,sh:121,th2:45,sh2:121})],mv:['k','a'],fo:[[['p','k'],8]],ar:[[86,40,86,62,0]],
      pr:'<line x1="94" y1="-10" x2="94" y2="104" class="xa-prop" stroke-width="5"/>',bb:[[94,-8]]},
 stepup:{R:1.15,k:[{p:[92,53.7],sc:.68,tor:-82,nk:-85,ua:110,fa:80,ua2:70,fa2:100,th:15.4,sh:73.2,ft:0,th2:90,sh2:90,ft2:0},
            {p:[124,33.7],sc:.68,tor:-88,nk:-88,ua:100,fa:85,ua2:80,fa2:95,th:90,sh:90,ft:0,th2:105,sh2:150,ft2:20},
            {p:[124,33.7],sc:.68,tor:-90,nk:-90,ua:94,fa:92,ua2:86,fa2:88,th:90,sh:90,ft:0,th2:90,sh2:90,ft2:0}],seq:[0,1,2,1],
      mv:['k','a','t'],fo:[[['p','k'],8]],ar:[[96,44,114,18,8]],pr:'<rect x="112" y="84" width="60" height="20" rx="2" class="xa-propf"/>',bb:[[172,84]]},
 qstretch:{R:1.15,k:[XA_STAND,_x(XA_STAND,{th:105,sh:-95,ft:-5,ua:110,fa:101,ua2:20,fa2:10})],mv:['k','a','t'],fo:[[['p','k'],8]],ar:[[84,96,84,62,-8]]},
 // ===== Hip =====
 bridge:{k:[XA_HOOK,_x(XA_HOOK,{p:[96,74],tor:152,th:-15,sh:70,th2:-15,sh2:70})],mv:['p'],fo:[[['p'],11,0,-2]],ar:[[92,100,92,62,0]]},
 hipflexor:{R:1.15,k:[{p:[88,76],sc:.68,tor:-90,nk:-90,ua:115,fa:25,ua2:115,fa2:25,th:97,sh:180,ft:90,th2:13.5,sh2:80,ft2:0},{p:[96,77],sc:.68,tor:-92,nk:-90,ua:115,fa:25,ua2:115,fa2:25,th:114.6,sh:180,ft:90,th2:11.8,sh2:85,ft2:0}],
      mv:['p'],fo:[[['p','k'],8,-2,0]],ar:[[80,48,100,48,0]]},
 fig4:{raw:1,R:1.15,face:['h','n',1],hr:10,pr:'<rect x="70" y="72" width="60" height="6" rx="2" class="xa-propf"/><line x1="74" y1="78" x2="74" y2="104" class="xa-prop" stroke-width="3"/><line x1="126" y1="78" x2="126" y2="104" class="xa-prop" stroke-width="3"/>',
      poly:[['sL','sR','hR','hL']],seg:[['n','h',9],['sL','sR',12],['sL','eL',8],['eL','wL',7],['sR','eR',8],['eR','wR',7],['hL','kL',11],['kL','aL',10],['aL','tL',6],['hR','kR',11],['kR','aR',10]],
      k:[{h:[100,14],n:[100,28],sL:[84,32],sR:[116,32],hL:[90,68],hR:[110,68],kL:[88,74],aL:[88,103],tL:[80,104],kR:[146,66],aR:[92,72],eL:[74,52],wL:[88,70],eR:[128,52],wR:[138,64]},
         {h:[100,36],n:[100,48],sL:[82,50],sR:[118,50],hL:[90,68],hR:[110,68],kL:[88,74],aL:[88,103],tL:[80,104],kR:[146,66],aR:[92,72],eL:[76,64],wL:[92,72],eR:[130,62],wR:[142,64]}],
      mv:[],fc:[[116,66,10]],ar:[[150,18,150,44,0]]},
 curlup:{k:[_x(XA_SUP,{ua:8,fa:-3,th2:-40,sh2:52,ft2:0}),_x(XA_SUP,{ua:8,fa:-3,th2:-40,sh2:52,ft2:0,tor:191,nk:212})],mv:['s'],fo:[[['s','p'],12]],ar:[[34,78,40,64,6]]},
 catcamel:{k:[_x(XA_QUAD,{tb:-16,nk:30}),_x(XA_QUAD,{tb:12,nk:-35})],mv:['m','s'],fo:[[['s','p'],12]],ar:[[108,36,108,52,0,1]]},
 walk:{R:1.15,k:[_x(XA_STAND,{th:65,sh:85,ft:-5,th2:115,sh2:110,ft2:20,ua:110,fa:95,ua2:70,fa2:55}),_x(XA_STAND,{th:115,sh:110,ft:20,th2:65,sh2:85,ft2:-5,ua:70,fa:55,ua2:110,fa2:95})],
      mv:[],fo:[[['p'],8]],d:.75,hold:0,ar:[[118,30,140,30,0]]},
 k2c:{k:[XA_SUP,_x(XA_SUP,{th:-118,sh:-22,ft:-100,ua:-50,fa:-15})],mv:['k','a','t','e','w'],fo:[[['p'],10,-4,-3]],ar:[[150,80,118,50,10]]},
 // ===== Neck (close-ups) =====
 chintuck:{raw:1,nf:1,poly:[['b1','b2','b3','b4','b5','b6']],face:['h','nb',1,'side'],hr:15,seg:[['nb','h',14]],
      k:[{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[52,76],h:[72,52]},{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,76],h:[54,50]}],
      mv:['h'],fc:[[60,66,8]],ar:[[84,24,60,24,0]],pr:'<line x1="50" y1="16" x2="50" y2="100" class="xa-guide"/>',bb:[[20,16],[96,142]]},
 scapsq:{k:[{p:[100,100],tor:-90,nk:-90,ua:100,fa:0,ua2:100,fa2:0},{p:[100,100],tor:-90,nk:-90,ua:128,fa:12,ua2:128,fa2:12}],hide:['leg','leg2'],mv:['e','w','e2','w2'],fo:[[['s'],8,-9,10]],ar:[[124,64,104,64,0]],nf:1},
 uptrap:{raw:1,poly:[['sL','sR','hR','hL']],face:['h','n',1],seg:[['n','h',12],['sL','sR',14],['sL','eL',9],['eL','wL',8],['sR','eR',9],['eR','wR',8]],hr:15,nf:1,
      k:[{h:[100,46],n:[100,70],sL:[72,76],sR:[128,76],hL:[78,130],hR:[122,130],eL:[66,102],wL:[64,126],eR:[134,102],wR:[136,126]},
         {h:[84,52],n:[100,70],sL:[72,76],sR:[128,76],hL:[78,130],hR:[122,130],eL:[66,102],wL:[64,126],eR:[140,46],wR:[98,36]}],
      mv:['h','eR','wR'],fc:[[116,66,9]],ar:[[112,24,80,30,-10]]},
 levator:{raw:1,poly:[['sL','sR','hR','hL']],face:['h','n',1,'front','lk'],seg:[['n','h',12],['sL','sR',14],['sL','eL',9],['eL','wL',8],['sR','eR',9],['eR','wR',8]],hr:15,nf:1,
      k:[{h:[100,46],n:[100,70],sL:[72,76],sR:[128,76],hL:[78,130],hR:[122,130],eL:[66,102],wL:[64,126],eR:[134,102],wR:[136,126],x:{lk:0}},
         {h:[88,60],n:[100,70],sL:[72,76],sR:[128,76],hL:[78,130],hR:[122,130],eL:[66,102],wL:[64,126],eR:[132,52],wR:[96,44],x:{lk:1}}],
      mv:['h','eR','wR'],fc:[[120,64,9]],ar:[[112,26,88,58,-12]]},
 // ===== Shoulder =====
 pendulum:{R:1.15,k:[_x(XA_STAND,{p:[92,52],tor:-10,nk:-5,ua:72,fa:72,ua2:28,fa2:50,th:85,sh:90,th2:95,sh2:90}),_x(XA_STAND,{p:[92,52],tor:-10,nk:-5,ua:108,fa:108,ua2:28,fa2:50,th:85,sh:90,th2:95,sh2:90})],
      mv:['e','w'],fo:[[['s'],8]],d:1,hold:.1,ar:[[108,96,138,96,8,1]],pr:'<rect x="138" y="58" width="44" height="6" rx="2" class="xa-propf"/><line x1="142" y1="64" x2="142" y2="104" class="xa-prop" stroke-width="3"/><line x1="178" y1="64" x2="178" y2="104" class="xa-prop" stroke-width="3"/>',bb:[[182,58]]},
 sler:{k:[_x(XA_SIDE,{ua2:90,fa2:180,ua:12,fa:100}),_x(XA_SIDE,{ua2:90,fa2:180,ua:12,fa:-70})],mv:['w'],fo:[[['s'],8,0,-3]],dot:'w',ar:[[100,102,104,68,-14]]},
 wallslide:{R:1.15,k:[_x(XA_STAND,{p:[115,54],ua:24,fa:-90,ua2:24,fa2:-90}),_x(XA_STAND,{p:[115,54],ua:-37,fa:-95,ua2:-37,fa2:-95})],mv:['e','w','e2','w2'],fo:[[['s'],8,-3,2]],ar:[[144,30,144,0,0]],
      pr:'<line x1="135" y1="-12" x2="135" y2="104" class="xa-prop" stroke-width="5"/>',bb:[[135,-10],[150,-6]]},
 // ===== Elbow / wrist / hand (close-ups) =====
 wext:{raw:1,nf:1,poly:[['b1','b2','b3','b4','b5','b6']],face:['h','nb',1,'side'],hr:13,seg:[['nb','h',12],['s','e2',10,'far'],['e2','w2',9,'far'],['s','e',11],['e','w',10],['w','hd',11]],dots:['w2'],
      k:[{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[88,84],w:[124,84],hd:[144,84],e2:[94,106],w2:[140,78]},{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[88,84],w:[124,84],hd:[132,102],e2:[92,110],w2:[128,96]}],
      mv:['hd'],fc:[[100,80,10]],ar:[[154,90,138,112,-8]]},
 wflex:{raw:1,nf:1,poly:[['b1','b2','b3','b4','b5','b6']],face:['h','nb',1,'side'],hr:13,seg:[['nb','h',12],['s','e2',10,'far'],['e2','w2',9,'far'],['s','e',11],['e','w',10],['w','hd',11]],dots:['w2'],
      k:[{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[88,84],w:[124,84],hd:[144,84],e2:[94,106],w2:[140,90]},{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[88,84],w:[124,84],hd:[132,66],e2:[96,100],w2:[128,70]}],
      mv:['hd'],fc:[[100,88,10]],ar:[[154,78,138,56,8]]},
 ecc:{raw:1,nf:1,poly:[['b1','b2','b3','b4','b5','b6']],face:['h','nb',1,'side'],hr:13,seg:[['nb','h',12],['s','e',11],['e','w',10],['w','hd',11]],dot:'hd',d:2.2,hold:.6,
      k:[{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[62,112],w:[110,112],hd:[124,98]},{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[62,112],w:[110,112],hd:[120,130]}],
      mv:['hd'],fc:[[84,110,10]],ar:[[140,98,138,128,-6]],pr:'<rect x="40" y="117" width="74" height="7" rx="2" class="xa-propf"/><line x1="108" y1="124" x2="108" y2="150" class="xa-prop" stroke-width="4"/>',bb:[[40,124],[150,140]]},
 grip:{raw:1,nf:1,poly:[['b1','b2','b3','b4','b5','b6']],face:['h','nb',1,'side'],hr:13,seg:[['nb','h',12],['s','e',11],['e','w',10]],
      k:[{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[60,114],w:[100,112],x:{rx:15,ry:15,c:0}},{b1:[30,142],b2:[30,88],b3:[42,74],b4:[62,74],b5:[70,92],b6:[70,142],nb:[50,74],h:[56,50],s:[50,82],e:[60,114],w:[100,112],x:{rx:18,ry:9,c:1}}],
      draw:(P,X)=>{const c=X.c,bx=134,by=108;return '<path d="M100 112 L118 109" stroke-width="22" class="xa-body"/><ellipse cx="'+bx+'" cy="'+xf(by+ (15-X.ry)*.2)+'" rx="'+xf(X.rx)+'" ry="'+xf(X.ry)+'" class="xa-ball"/>'
        +'<path d="M116 '+xf(100+3*c)+' Q'+xf(134)+' '+xf(84+12*c)+' '+xf(152-4*c)+' '+xf(100+4*c)+'" stroke-width="10" class="xa-hot" fill="none"/>'
        +'<path d="M116 '+xf(118-3*c)+' Q'+xf(132)+' '+xf(132-12*c)+' '+xf(148-4*c)+' '+xf(118-4*c)+'" stroke-width="10" class="xa-hot" fill="none"/>'
        +(c>.4?'<g opacity="'+xf(c)+'"><line x1="158" y1="96" x2="168" y2="90" class="xa-mark2"/><line x1="160" y1="108" x2="171" y2="108" class="xa-mark2"/><line x1="158" y1="120" x2="168" y2="126" class="xa-mark2"/></g>':'');},
      fc:[[80,113,10]],d:.5,hold:.8,bb:[[172,84],[172,132]]},
 alphabet:{raw:1,custom:(X,t)=>{const a=t*Math.PI*2/2.6,rot=-14*Math.sin(a);const f=xaFootSvg(80,56,rot,0,1.15,0);
        return xaLeg(80,56,70,-80,22)+'<ellipse cx="148" cy="80" rx="8" ry="20" class="xa-guide"/>'+f.svg+'<text x="162" y="42" class="xa-txt">A B C</text>';},
      k:[{x:{}},{x:{}}],fc:[[80,58,10]],bb:[[40,-14],[186,108]],nf:1},
 band:{k:[_x(XA_SEAT,{ua:10,fa:15,ua2:10,fa2:15,ft:-95,ft2:-95}),_x(XA_SEAT,{ua:12,fa:18,ua2:12,fa2:18,ft:-20,ft2:-20})],hide:['leg2'],ln:[['t','w'],['a','w']],
      mv:['t'],fo:[[['k','a'],8,0,-3]],ar:[[166,82,166,102,-8]]},
 pfstretch:{raw:1,custom:(X)=>{const f=xaFootSvg(70,54,0,X.toe,1.25,1);const tip=f.tip;
        return xaLeg(70,54,70,-80,24)+f.svg+'<line x1="'+xf(tip[0]+4)+'" y1="'+xf(tip[1]-4)+'" x2="186" y2="10" stroke-width="14" class="xa-far"/><circle cx="'+xf(tip[0]+2)+'" cy="'+xf(tip[1]-2)+'" r="8" class="xa-fill"/>';},
      k:[{x:{toe:0}},{x:{toe:-48}}],fc:[[100,86,11]],ar:[[166,92,160,52,10]],bb:[[40,-16],[190,100]],nf:1},
 towel:{raw:1,custom:(X)=>{const f=xaFootSvg(70,60,0,X.toe,1.25,1),c=X.c,end=196-34*c,hx=f.tip[0]+4;
        return '<path d="M'+xf(hx-30)+' 103 L'+xf(hx)+' 103 Q'+xf(hx+8)+' '+xf(103-10*c)+' '+xf(hx+16)+' 103 L'+xf(end)+' 103" class="xa-towel"/>'+xaLeg(70,60,70,-80,24)+f.svg;},
      k:[{x:{toe:0,c:0}},{x:{toe:30,c:1}}],fc:[[100,92,11]],ar:[[190,92,162,92,0]],bb:[[40,-12],[198,108]]},
 bottle:{k:[{p:[66,75.5],sc:.68,tor:-92,nk:-88,ua:75,fa:10,ua2:75,fa2:10,th:-36.3,sh:62.9,ft:0,th2:1.8,sh2:99,ft2:0},{p:[66,75.5],sc:.68,tor:-92,nk:-88,ua:75,fa:10,ua2:75,fa2:10,th:-18.7,sh:37.1,ft:0,th2:1.8,sh2:99,ft2:0}],
      mv:['k','a','t'],fo:[[['a','t'],7,0,4]],pr:XA_CHAIR,ar:[[96,64,124,64,0,1]],bb:[[40,34],[124,104]],d:.9,hold:.15,under:1,
      draw:(P)=>{const r=9.5,cx=107,cy=94.5,ang=(P.a?(P.a[0]-98)/r:0);const d=xaDir(ang*57.3);return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" class="xa-bottle"/><line x1="'+xf(cx-d[0]*r)+'" y1="'+xf(cy-d[1]*r)+'" x2="'+xf(cx+d[0]*r)+'" y2="'+xf(cy+d[1]*r)+'" class="xa-mark"/>';}},
 calfraise:{R:1.15,k:[XA_STAND,_x(XA_STAND,{p:[100,47.6],ft:-58,ft2:-58})],mv:['a','t'],fo:[[['k','a'],7,-3,0]],ar:[[82,100,82,80,0]]},
 balance:{R:1.15,k:[_x(XA_STAND,{th:45,sh:110,ft:20,ua:55,fa:40,ua2:125,fa2:140}),_x(XA_STAND,{p:[102,54],tor:-87,th:45,sh:110,ft:20,ua:60,fa:45,ua2:120,fa2:135})],mv:[],fo:[[['a2'],8,0,-4]],d:1,hold:.3},
 calfstretch:{R:1.15,k:[_x(XA_STAND,{p:[100,56],tor:-70,nk:-60,ua:-12,fa:-6,ua2:-12,fa2:-6,th:114.6,sh:114.6,ft:0,th2:55,sh2:105}),_x(XA_STAND,{p:[106,58],tor:-62,nk:-55,ua:-6,fa:-2,ua2:-6,fa2:-2,th:121.3,sh:121.3,ft:0,th2:45,sh2:110})],
      mv:['p'],fo:[[['k','a'],7,-3,0]],ar:[[96,40,114,46,0]],pr:'<line x1="154" y1="-10" x2="154" y2="104" class="xa-prop" stroke-width="5"/>',bb:[[154,-8]]}
};
/* ---- engine ---- */
const XA_SEG=[['h','s',6],['s','m',13],['m','p',13],['s','p',13],['s','e',7,'arm'],['e','w',6,'arm'],['s','e2',7,'arm2'],['e2','w2',6,'arm2'],['p','k',9,'leg'],['k','a',8,'leg'],['a','t',6,'leg'],['p','k2',9,'leg2'],['k2','a2',8,'leg2'],['a2','t2',6,'leg2']];
function xaFK(q){const L=Object.assign({},XA_L,q.L||{}),sc=q.sc||1,J={};const add=(from,ang,len,to)=>{if(ang===undefined||!J[from])return;const d=xaDir(ang);J[to]=[J[from][0]+d[0]*len*sc,J[from][1]+d[1]*len*sc];};
  J.p=q.p.slice();
  if(q.tb!==undefined){add('p',q.tor+q.tb,L.tor/2,'m');add('m',q.tor-q.tb,L.tor/2,'s');}else add('p',q.tor,L.tor,'s');
  add('s',q.nk,L.nk,'h');add('s',q.ua,L.ua,'e');add('e',q.fa,L.fa,'w');add('s',q.ua2,L.ua,'e2');add('e2',q.fa2,L.fa,'w2');
  add('p',q.th,L.th,'k');add('k',q.sh,L.sh,'a');add('a',q.ft,L.ft,'t');add('p',q.th2,L.th,'k2');add('k2',q.sh2,L.sh,'a2');add('a2',q.ft2,L.ft,'t2');J._nk=q.nk;return J;}
function xaLerpA(a,b,f){let d=((b-a)%360+540)%360-180;return a+d*f;}
function xaX(a,b,f){const o={};const A=a.x||{},B=b.x||{};for(const n in A)o[n]=A[n]+((B[n]===undefined?A[n]:B[n])-A[n])*f;return o;}
const XA_NOANG=['p','L','sc','x'];
function xaPose(A,i,j,f){const a=A.k[i],b=A.k[j];
  if(A.raw){const o={};for(const n in a){if(n==='x')continue;const x=a[n],y=b[n]||x;o[n]=[x[0]+(y[0]-x[0])*f,x[1]+(y[1]-x[1])*f];}o._X=xaX(a,b,f);return o;}
  const q={L:a.L,sc:(a.sc||1)+((b.sc||1)-(a.sc||1))*f,p:[a.p[0]+(b.p[0]-a.p[0])*f,a.p[1]+(b.p[1]-a.p[1])*f]};
  for(const n in a){if(XA_NOANG.includes(n))continue;q[n]=b[n]===undefined?a[n]:xaLerpA(a[n],b[n],f);}
  for(const n in b)if(q[n]===undefined&&!XA_NOANG.includes(n))q[n]=b[n];
  const J=xaFK(q);J._X=xaX(a,b,f);J._sc=q.sc;return J;}
function xaPhase(A,t){const seq=A.seq||(A.loop||A.k.length>2?A.k.map((_,i)=>i):[0,1]),n=seq.length,d=A.d||1.1,h=A.hold===undefined?.9:A.hold,step=d+h,T=n*step,u=((t%T)+T)%T,i=Math.floor(u/step),r=u-i*step;
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;return {i:seq[i],j:seq[(i+1)%n],f:r<h?0:ease((r-h)/d)};}
function xaFo(x,y,r,pulse){return '<circle cx="'+xf(x)+'" cy="'+xf(y)+'" r="'+xf(r*(1+.12*pulse))+'" class="xa-fo" style="opacity:'+(.55+.4*pulse).toFixed(2)+'"/>';}
function exAnimFrame(id,t){const A=EX_ANIM[id];if(!A)return '';const ph=xaPhase(A,t),P=xaPose(A,ph.i,ph.j,ph.f),X=P._X||{};
  const pulse=.5+.5*Math.sin(t*Math.PI*2/1.4);
  const focus=()=>{let s='';(A.fo||[]).forEach(([js,r,dx,dy])=>{const ps=js.map(j=>P[j]).filter(Boolean);if(!ps.length)return;const x=ps.reduce((a,q)=>a+q[0],0)/ps.length+(dx||0),y=ps.reduce((a,q)=>a+q[1],0)/ps.length+(dy||0);s+=xaFo(x,y,r,pulse);});
    (A.fc||[]).forEach(([x,y,r])=>{s+=xaFo(x,y,r,pulse);});return s;};
  const arrows=()=>(A.ar||[]).map(a=>xaArrow(a[0],a[1],a[2],a[3],a[4],a[5])).join('');
  if(A.custom)return A.custom(X,t)+arrows()+focus();
  const mv=new Set(A.mv||[]),hide=new Set(A.hide||[]),sc=A.raw?1:(P._sc||1),W=w=>Math.max(3,w*(sc<1?.85:1)),far=j=>/2$/.test(j);
  const line=(u,v,w,cls)=>'<line x1="'+xf(P[u][0])+'" y1="'+xf(P[u][1])+'" x2="'+xf(P[v][0])+'" y2="'+xf(P[v][1])+'" stroke-width="'+xf(w)+'" class="'+cls+'"/>';
  let back='',front='',ex='',polys='';
  (A.poly||[]).forEach(js=>{if(js.every(j=>P[j]))polys+='<polygon points="'+js.map(j=>xf(P[j][0])+','+xf(P[j][1])).join(' ')+'" class="xa-fill"/>';});
  const segs=A.raw?A.seg:XA_SEG;
  segs.forEach(sg=>{const [u,v,w,grp]=sg;if(!P[u]||!P[v])return;if(grp&&hide.has(grp))return;if(!A.raw&&u==='s'&&v==='p'&&P.m)return;
    const isFar=A.raw?grp==='far':far(v);const torso=!A.raw&&(v==='p'||v==='m'||(u==='s'&&(v==='m'||v==='p')))&&!mv.has('s')&&!mv.has('m');
    const hot=!torso&&(mv.has(v)||(A.raw&&mv.has(u)&&!['s','n','nb','lo','sL','sR','p'].includes(u)));
    const ln=line(u,v,W(w),hot?(isFar?'xa-hot xa-hotfar':'xa-hot'):isFar?'xa-far':'xa-body');if(isFar)back+=ln;else front+=ln;});
  (A.ln||[]).forEach(([u,v])=>{if(P[u]&&P[v])ex+=line(u,v,2.6,'xa-band');});
  [A.dot].concat(A.dots||[]).forEach(d=>{if(d&&P[d])ex+='<circle cx="'+xf(P[d][0])+'" cy="'+xf(P[d][1])+'" r="'+(A.dot===d?6.5:5.5)+'" class="'+(A.dot===d?'xa-propf':'xa-fill')+'"/>';});
  if(!A.raw)['w','w2'].forEach(j=>{if(!P[j]||hide.has(j==='w'?'arm':'arm2'))return;const c='<circle cx="'+xf(P[j][0])+'" cy="'+xf(P[j][1])+'" r="'+xf(3.8*sc)+'" class="';if(far(j))back+=c+(mv.has(j)?'xa-hotdot xa-hotfar':'xa-fardot')+'"/>';else front+=c+(mv.has(j)?'xa-hotdot':'xa-dot')+'"/>';});
  let head='';
  if(A.raw&&A.face){const [hj,nj,fc,kind,lk]=A.face,h=P[hj],n=P[nj];if(h&&n){const up=Math.atan2(h[1]-n[1],h[0]-n[0])*57.3;head=kind==='side'?xaFaceSide(h,A.hr||10,up,fc):xaFaceFront(h,A.hr||10,up,lk?(X[lk]||0):0);}}
  else if(!A.raw&&P.h){head=A.face===0?'<circle cx="'+xf(P.h[0])+'" cy="'+xf(P.h[1])+'" r="'+xf(9.5*sc)+'" class="xa-head"/>':xaFaceSide(P.h,9.5*sc,P._nk,1);}
  const extra=A.draw?A.draw(P,X,t):'';
  return (A.under?extra:'')+polys+back+ex+front+head+(A.under?'':extra)+arrows()+focus();}
/* auto-crop: bounding box of every joint over the loop + props, padded, fixed 16:10 shape */
const _xaVB={};
function xaVB(id){if(_xaVB[id])return _xaVB[id];const A=EX_ANIM[id];if(A.vb)return _xaVB[id]=A.vb;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const add=(x,y)=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);};
  if(!A.custom){for(let i=0;i<A.k.length;i++)for(let j=0;j<A.k.length;j++)for(const f of [0,.25,.5,.75,1]){const P=xaPose(A,i,j,f);for(const n in P)if(Array.isArray(P[n]))add(P[n][0],P[n][1]);}}
  (A.bb||[]).forEach(q=>add(q[0],q[1]));(A.ar||[]).forEach(a=>{add(a[0],a[1]);add(a[2],a[3]);});(A.fc||[]).forEach(c=>{add(c[0]-c[2],c[1]-c[2]);add(c[0]+c[2],c[1]+c[2]);});
  if(!A.nf)y1=Math.max(y1,104);const pad=13;x0-=pad;y0-=pad;x1+=pad;y1+=A.nf?pad:6;let w=x1-x0,h=y1-y0;const R=A.R||1.6;
  if(w/h<R){const nw=h*R;x0-=(nw-w)/2;w=nw;}else{const nh=w/R;y0-=(nh-h)*(A.nf?.5:1);h=nh;}
  return _xaVB[id]=[x0,y0,w,h].map(v=>v.toFixed(1)).join(' ');}
function exAnimSvg(id){const A=EX_ANIM[id];if(!A)return '';
  return '<svg class="xa" data-anim="'+id+'" viewBox="'+xaVB(id)+'" role="img" aria-label="animation">'+(A.nf?'':'<line x1="-80" y1="104.5" x2="280" y2="104.5" class="xa-floor"/>')+(A.pr||'')+'<g class="xa-fig">'+exAnimFrame(id,0)+'</g></svg>';}
let _xaRaf=0,_xaT0=0;
function exAnimTick(ts){const els=document.querySelectorAll('svg.xa[data-anim]');if(!els.length){_xaRaf=0;return;}if(!_xaT0)_xaT0=ts;const t=(ts-_xaT0)/1000;
  els.forEach(el=>{const g=el.querySelector('.xa-fig');if(g)g.innerHTML=exAnimFrame(el.getAttribute('data-anim'),t);});_xaRaf=requestAnimationFrame(exAnimTick);}
function exAnimStart(){let reduce=false;try{reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce){document.querySelectorAll('svg.xa[data-anim]').forEach(el=>{const id=el.getAttribute('data-anim'),A=EX_ANIM[id],g=el.querySelector('.xa-fig');const h=A&&A.hold!==undefined?A.hold:.9;if(g&&A)g.innerHTML=exAnimFrame(id,h+(A.d||1.1)+h/2);});return;}
  if(!_xaRaf)_xaRaf=requestAnimationFrame(exAnimTick);}
/* shared look for the medic app and the Soldier page */
const XA_CSS='.xa line{stroke-linecap:round}.xa-body{stroke:var(--xa-b,#fff)}.xa-fill{fill:var(--xa-b,#fff)}.xa-fillhot{fill:var(--xa-h,#FF9F0A)}.xa-far{stroke:var(--xa-f,#8E8E93)}.xa-hot{stroke:var(--xa-h,#FF9F0A)}.xa-hotfar{opacity:.7}.xa-dot{fill:var(--xa-b,#fff)}.xa-fardot{fill:var(--xa-f,#8E8E93)}.xa-hotdot{fill:var(--xa-h,#FF9F0A)}'
 +'.xa-head{fill:var(--xa-b,#fff)}.xa-eye{fill:var(--xa-bg,#2C2C2E)}.xa-mouth{stroke:var(--xa-bg,#2C2C2E);stroke-width:1.6;stroke-linecap:round}.xa-floor{stroke:var(--xa-f,#8E8E93);stroke-width:2;opacity:.5}'
 +'.xa-fo{fill:rgba(255,59,48,.22);stroke:#FF3B30;stroke-width:2.2}.xa-prop{stroke:var(--xa-p,#636366)}.xa-propf{fill:var(--xa-p,#636366)}.xa-band{stroke:#30D158;stroke-linecap:round}.xa-ar{fill:none;stroke:var(--xa-a,#64D2FF);stroke-width:2.2;stroke-dasharray:4 3}.xa-arh{fill:var(--xa-a,#64D2FF)}'
 +'.xa-guide{fill:none;stroke:var(--xa-f,#8E8E93);stroke-width:1.5;stroke-dasharray:3 3;opacity:.8}.xa-ball{fill:#FF6B6B}.xa-bottle{fill:#64D2FF;opacity:.85}.xa-mark{stroke:var(--xa-bg,#2C2C2E);stroke-width:2.2;stroke-linecap:round}.xa-mark2{stroke:var(--xa-a,#64D2FF);stroke-width:2.2;stroke-linecap:round}.xa-towel{fill:none;stroke:#BF5AF2;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.xa-txt{fill:var(--xa-f,#8E8E93);font:bold 13px sans-serif}';
(function(){try{if(typeof document!=='undefined'&&document.head&&!document.getElementById('xa-css')){const s=document.createElement('style');s.id='xa-css';s.textContent=XA_CSS;document.head.appendChild(s);}}catch(e){}})();
