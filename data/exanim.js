/* Exercise animations — our own 2D figures (no image licenses, offline, same look in EN/ES).
   Each animation = two key poses (start / end) of joint points in a 200×120 side view; the figure moves between them.
   Animaciones de ejercicios — figuras 2D propias (sin licencias, sin internet, iguales en inglés y español).
   Joints: h head, s shoulder, e/w elbow/wrist (near arm), e2/w2 (far arm), p hip, k/a/t knee/ankle/toe (near leg), k2/a2/t2 (far leg).
   "mv" lists the joints that move — those limbs are drawn in the accent color. */
const EX_ANIM={
 bridge:{mv:['p','k'],a:{h:[28,90],s:[46,96],e:[66,100],w:[86,100],p:[96,97],k:[126,70],a:[146,100],t:[156,100]},
                       b:{h:[28,90],s:[46,96],e:[66,100],w:[86,100],p:[94,74],k:[129,64],a:[146,100],t:[156,100]}},
 slr:{mv:['k','a','t'],a:{h:[28,90],s:[46,96],e:[66,100],w:[86,100],p:[100,97],k:[135,98],a:[166,98],t:[170,91],k2:[126,70],a2:[142,100],t2:[152,100]},
                       b:{h:[28,90],s:[46,96],e:[66,100],w:[86,100],p:[100,97],k:[129,77],a:[156,58],t:[163,55],k2:[126,70],a2:[142,100],t2:[152,100]}},
 sidebridge:{mv:['p'],a:{h:[34,70],s:[46,80],e:[46,100],w:[68,100],p:[102,99],k:[132,100],a:[162,100],t:[168,94]},
                     b:{h:[34,70],s:[46,80],e:[46,100],w:[68,100],p:[102,89],k:[132,94],a:[162,100],t:[168,94]}}
};
const EX_ANIM_SEG=[['h','s',6],['s','p',12],['s','e',7],['e','w',6],['s','e2',7],['e2','w2',6],['p','k',9],['k','a',8],['a','t',6],['p','k2',9],['k2','a2',8],['a2','t2',6]];
function exAnimPose(A,f){const o={};for(const j in A.a){const a=A.a[j],b=A.b[j]||a;o[j]=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];}return o;}
function exAnimDraw(id,f){const A=EX_ANIM[id];if(!A)return '';const P=exAnimPose(A,f),mv=new Set(A.mv);
  const far=j=>/2$/.test(j);let back='',front='';
  EX_ANIM_SEG.forEach(([u,v,w])=>{if(!P[u]||!P[v])return;const hot=mv.has(v)||(mv.has(u)&&mv.has(v));
    const ln='<line x1="'+P[u][0].toFixed(1)+'" y1="'+P[u][1].toFixed(1)+'" x2="'+P[v][0].toFixed(1)+'" y2="'+P[v][1].toFixed(1)+'" stroke-width="'+w+'" class="'+(hot?'xa-hot':far(v)?'xa-far':'xa-body')+'"/>';
    if(far(v))back+=ln;else front+=ln;});
  return back+front+'<circle cx="'+P.h[0].toFixed(1)+'" cy="'+P.h[1].toFixed(1)+'" r="10" class="xa-head"/>';}
function exAnimSvg(id){if(!EX_ANIM[id])return '';
  return '<svg class="xa" data-anim="'+id+'" viewBox="0 38 200 74" role="img" aria-label="animation"><line x1="8" y1="104.5" x2="192" y2="104.5" class="xa-floor"/><g class="xa-fig">'+exAnimDraw(id,0)+'</g></svg>';}
/* one loop: 1.1 s up · 1.0 s hold · 1.1 s down · 0.7 s rest */
let _xaRaf=0;
function exAnimTick(ts){const els=document.querySelectorAll('svg.xa[data-anim]');if(!els.length){_xaRaf=0;return;}
  const T=3900,u=(ts%T)/1000,ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  const f=u<1.1?ease(u/1.1):u<2.1?1:u<3.2?1-ease((u-2.1)/1.1):0;
  els.forEach(el=>{const g=el.querySelector('.xa-fig');if(g)g.innerHTML=exAnimDraw(el.getAttribute('data-anim'),f);});
  _xaRaf=requestAnimationFrame(exAnimTick);}
function exAnimStart(){let reduce=false;try{reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce){document.querySelectorAll('svg.xa[data-anim]').forEach(el=>{const g=el.querySelector('.xa-fig');if(g)g.innerHTML=exAnimDraw(el.getAttribute('data-anim'),1);});return;}
  if(!_xaRaf)_xaRaf=requestAnimationFrame(exAnimTick);}
