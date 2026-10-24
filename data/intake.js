/* Pre-visit questionnaire (patient QR) — shared by intake.html (patient) and the app (medic).
   Cuestionario previo (QR del paciente) — compartido por intake.html (paciente) y la app (médico).
   No names, no IDs. Answers travel only inside the QR, phone to phone. / Sin nombres ni IDs; las respuestas solo viajan dentro del QR. */
const IQ_AREAS=[
 // [code, EN, ES, ADTMC protocol, group]
 ['throat','Sore throat','Dolor de garganta','A-1','h'],
 ['ear','Ear pain','Dolor de oído','A-2','h'],
 ['cold','Cold / cough / allergies','Gripe / tos / alergias','A-3','h'],
 ['eye','Eye problem','Problema en el ojo','H-1','h'],
 ['tooth','Tooth / mouth','Diente / boca','L-2','h'],
 ['head','Headache','Dolor de cabeza','F-2','h'],
 ['dizzy','Dizzy / fainting','Mareo / desmayo','F-1','h'],
 ['back','Back','Espalda','B-1','m'],
 ['neck','Neck','Cuello','B-2','m'],
 ['shoulder','Shoulder','Hombro','B-3','m'],
 ['elbow','Elbow','Codo','B-4','m'],
 ['wrist','Wrist / hand','Muñeca / mano','B-5','m'],
 ['hip','Hip','Cadera','B-7','m'],
 ['knee','Knee','Rodilla','B-8','m'],
 ['ankle','Ankle','Tobillo','B-9','m'],
 ['foot','Foot','Pie','B-10','m'],
 ['leg','Arm / leg muscle','Músculo de brazo / pierna','B-11','m'],
 ['belly','Stomach / belly pain','Dolor de estómago / barriga','C-3','b'],
 ['nausea','Nausea / vomiting','Náusea / vómito','C-1','b'],
 ['diarrhea','Diarrhea','Diarrea','C-2','b'],
 ['heartburn','Heartburn','Acidez','C-7','b'],
 ['urine','Pain when peeing','Dolor al orinar','E-1','b'],
 ['chest','Chest pain','Dolor de pecho','D-2','b'],
 ['breath','Short of breath','Falta de aire','D-1','b'],
 ['rash','Rash / skin problem','Sarpullido / piel','J-1','s'],
 ['shave','Shaving profile / razor bumps','Perfil de afeitar / granitos por afeitarse','J-3','s'],
 ['blister','Blisters','Ampollas','J-15','s'],
 ['cut','Cut / scrape','Cortada / raspón','J-11','s'],
 ['toenail','Ingrown toenail','Uña enterrada','J-18','s'],
 ['bite','Insect bite','Picadura','K-7','s'],
 ['burn','Burn / sunburn','Quemadura / sol','J-14','s'],
 ['fever','Fever / chills','Fiebre / escalofríos','G-2','o'],
 ['tired','Very tired','Muy cansado','G-1','o'],
 ['mood','Stress / anxiety / mood','Estrés / ansiedad / ánimo','F-5','o'],
 ['women','Women\'s health','Salud de la mujer','I-3','o'],
 ['refill','Medication refill','Resurtir medicamento','L-4','a'],
 ['paper','Paperwork / profile only','Solo papeleo / profile','L-11','a'],
 ['other','Something else','Otra cosa','L-11','o']];
const IQ_GROUPS={h:['Head, face & ENT','Cabeza, cara y garganta'],m:['Muscles & joints','Músculos y articulaciones'],b:['Stomach, chest & urine','Estómago, pecho y orina'],s:['Skin','Piel'],o:['Other','Otro'],a:['Admin','Administrativo']};
const IQ_DUR=[['today','Today','Hoy'],['1-2d','1–2 days (48 h or less)','1–2 días (48 h o menos)'],['3-7d','3–7 days','3–7 días'],['1-4w','1–4 weeks','1–4 semanas'],['1mo+','More than a month','Más de un mes'],
 ['1-3d','1–3 days','1–3 días',1],['4-7d','4–7 days','4–7 días',1]]; // last two: legacy codes from older QR codes (hidden)
/* Mendoza Clinic (2/1 AD Soldier Care) — Sick Call & Appointment Guidelines. / Guía de sick call de la clínica Mendoza. */
const CLINIC={name:'Mendoza Clinic (2/1 AD Soldier Care)',addr:'11335 SSG Sims St, Fort Bliss, TX 79918',phones:['(915) 742-2273','(915) 742-0186'],sc:'0630–0700',walk:'0830–1600'};
const IQ_FLAGS=[
 ['breath','Trouble breathing','Me cuesta respirar'],
 ['chest','Chest pain or pressure','Dolor o presión en el pecho'],
 ['faint','Fainted or almost fainted','Me desmayé o casi'],
 ['bleed','Bleeding that won\'t stop','Sangrado que no para'],
 ['fever','Very high fever or shaking chills','Fiebre muy alta o escalofríos fuertes'],
 ['head','Worst headache of my life, or confused','El peor dolor de cabeza de mi vida, o confusión'],
 ['weak','Sudden weakness or numbness (face, arm, leg)','Debilidad o adormecimiento de repente (cara, brazo, pierna)'],
 ['belly','Very bad belly pain','Dolor de barriga muy fuerte'],
 ['bone','Bone looks out of place / can\'t put weight on it','El hueso se ve fuera de lugar / no puedo apoyar'],
 ['eye','Sudden vision loss or chemical in the eye','Pérdida de visión de repente o químico en el ojo'],
 ['heat','Overheated: confused, stopped sweating','Me sobrecalenté: confusión, dejé de sudar'],
 ['harm','Thoughts of hurting myself or someone else','Pensamientos de hacerme daño o hacerle daño a alguien']];
const IQ_LV={red:['See now','Ver ya'],orange:['Sick call / screening','Sick call / screening'],gray:['Consider appointment','Considerar cita']};
function iqLbl(arr,code,i){const r=arr.find(x=>x[0]===code);return r?r[i]:code;}
function iqArea(code){return IQ_AREAS.find(x=>x[0]===code)||IQ_AREAS[IQ_AREAS.length-1];}
/* Triage rule (clinic guidance): sick call = acute (≤3 days) or worse in the last 2–3 days.
   Already seen for the same thing and not worse → not sick call. Return + worse → AEM/clinic (ADTMC M-1).
   The medic decides; this is only a suggestion. */
function iqTriage(q){
  const b=iqTriage0(q);if(b.c==='red'||typeof iqFUAns!=='function')return b;
  const ES=(typeof LANG!=='undefined'&&LANG==='es')||(typeof IQ_ES!=='undefined'&&IQ_ES);
  const fu=iqFUAns(q),r=fu.filter(x=>x.lv==='r'),y=fu.filter(x=>x.lv==='y');
  if(r.length)return{c:'red',why:(ES?'Respuesta de alarma: ':'Concerning answer: ')+r.map(x=>x.k+' — '+x.v).join('; ')};
  if(b.c==='gray'&&y.length)return{c:'orange',why:(ES?'Necesita revisión: ':'Needs a look: ')+y.map(x=>x.k+' — '+x.v).join('; ')};
  return b;}
function iqTriage0(q){
  const ES=(typeof LANG!=='undefined'&&LANG==='es')||(typeof IQ_ES!=='undefined'&&IQ_ES);const t=(e,s)=>ES?s:e;
  const f=q.f||[];
  if(f.length)return{c:'red',why:t('Red flag: ','Bandera roja: ')+f.map(x=>iqLbl(IQ_FLAGS,x,ES?2:1)).join(', ')};
  if(q.doc)return{c:'gray',why:t('Documentation only (chronic / VA) → appointment, not sick call','Solo documentar (crónico / VA) → cita, no sick call')};
  if(q.a==='shave'&&!q.r)return{c:'gray',why:t('Shaving profile / razor bumps — routine, after acute patients','Perfil de afeitar / granitos — rutina, después de los agudos')};
  if(iqArea(q.a)[4]==='a')return{c:'gray',why:t('Administrative — routine appointment','Administrativo — cita de rutina')};
  if(q.r){if(q.rw||q.w)return{c:'orange',why:t('Return visit, worse → AEM / clinic (ADTMC M-1)','Regreso, peor → AEM / clínica (ADTMC M-1)')};
    return{c:'gray',why:t('Already seen for this, not worse','Ya lo vieron por esto, no está peor')};}
  const a4=iqArea(q.a)[4],d48=q.d==='today'||q.d==='1-2d';
  if(a4==='m'){if(d48||q.d==='1-3d')return{c:'orange',why:t('Injury/pain within 48 h → sick call','Lesión/dolor en las últimas 48 h → sick call')};
    return{c:'gray',why:t('Injury older than 48 h → H2F physical therapy evaluation (clinic rule)','Lesión de más de 48 h → evaluación de terapia física en H2F (regla de la clínica)')+(q.w?t(' · reports worse — medic decides',' · dice que empeoró — el médico decide'):'')};}
  if(['fever','nausea','diarrhea'].includes(q.a))return{c:'orange',why:t('Active fever / nausea / vomiting / diarrhea → sick call','Fiebre / náusea / vómito / diarrea activos → sick call')};
  if(q.old&&!q.w)return{c:'gray',why:t('Not new (had it before), not worse → appointment','No es nuevo (ya lo tuvo), no peor → cita')};
  if(d48||q.d==='1-3d')return{c:'orange',why:t('New, started in the last 48 h','Nuevo, empezó en las últimas 48 h')};
  if(q.w)return{c:'orange',why:t('Older problem, worse in the last 2–3 days','Problema viejo, peor en los últimos 2–3 días')};
  if((q.s||0)>=8)return{c:'orange',why:t('Severe pain (8/10 or more)','Dolor fuerte (8/10 o más)')};
  return{c:'gray',why:t('Started more than 48 h ago, not worse → consider appointment / PCM','Empezó hace más de 48 h, no peor → considerar cita / PCM')};
}
function iqEncode(q){const s=JSON.stringify(q);const b=btoa(unescape(encodeURIComponent(s)));return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function iqDecode(txt){
  try{let m=String(txt).match(/[#&?]iq=([A-Za-z0-9_-]+)/);const b=(m?m[1]:String(txt).trim()).replace(/-/g,'+').replace(/_/g,'/');
    const q=JSON.parse(decodeURIComponent(escape(atob(b+'==='.slice((b.length+3)%4)))));
    if(!q||q.v!==1||typeof q.a!=='string')return null;
    q.f=Array.isArray(q.f)?q.f.filter(x=>IQ_FLAGS.some(y=>y[0]===x)):[];q.s=Math.max(0,Math.min(10,+q.s||0));q.n=String(q.n||'').slice(0,100);q.rk=IQ_RANKS.includes(q.rk)?q.rk:'';q.old=q.old?1:0;q.doc=q.doc?1:0;q.ln=String(q.ln||'').replace(/[^A-Za-zÀ-ÿ' -]/g,'').trim().slice(0,30);
    const x={};if(q.x&&typeof q.x==='object')Object.keys(q.x).slice(0,20).forEach(k=>{const v=q.x[k];if(/^[a-z]{1,8}$/.test(k)&&(v===0||v===1||(Number.isInteger(v)&&v>=0&&v<10)||(Array.isArray(v)&&v.every(n=>Number.isInteger(n)&&n>=0&&n<10))))x[k]=v;});q.x=x;
    return q;}catch(e){return null;}
}
const IQ_HOME='https://bubymed.github.io/SICK-CALL-ADTMC-EASY-TOOL/';
function iqBase(){try{if(location.protocol==='https:')return new URL('./',location.href).href;}catch(e){}return IQ_HOME;}
/* ===== Follow-up questions by problem (v15) / Preguntas específicas por problema =====
   Each: [id, EN, ES, type, options]. type 'yn' = yes/no (level applies to Yes, or to No if lvNo);
   'one' = single choice; 'multi' = several. Level: 'r' → red (see now), 'y' → at least yellow.
   Built from ADTMC red flags / decision points; pending review by the supervising provider. */
const YN=(id,en,es,lv,lvNo)=>[id,en,es,'yn',null,lv||'',lvNo||''];
const ONE=(id,en,es,opts)=>[id,en,es,'one',opts];
const MULTI=(id,en,es,opts)=>[id,en,es,'multi',opts];
const IQ_GEN=[
 ONE('how','How did it start?','¿Cómo empezó?',[['Injury / accident','Lesión / accidente'],['Suddenly, no injury','De repente, sin lesión'],['Little by little','Poco a poco'],['During PT / training / field','En PT / entrenamiento / campo']]),
 MULTI('try','What have you tried?','¿Qué has probado?',[['Nothing yet','Nada todavía'],['Rest','Descanso'],['Ice / heat','Hielo / calor'],['OTC meds (Tylenol, Motrin…)','Medicina sin receta (Tylenol, Motrin…)'],['Saw a medic / provider already','Ya me vio un médico / proveedor']])];
const MSK=(extra)=>[
 ONE('mech','What happened?','¿Qué pasó?',[['Twisted / rolled it','Me lo torcí / doblé'],['Fell','Me caí'],['Got hit','Me golpeé / me pegaron'],['Overuse (running, ruck, lifting)','Sobreuso (correr, ruck, pesas)'],['No injury','Sin lesión']]),
 YN('swell','Is it swollen?','¿Está hinchado?'),
 YN('use','Can you put weight on it / use it normally?','¿Puedes apoyarlo / usarlo normal?','','y'),
 YN('pop','Did you hear or feel a "pop"?','¿Oíste o sentiste un "pop"?','y'),
 YN('numb','Numbness or tingling?','¿Adormecimiento u hormigueo?','y')].concat(extra||[]);
const IQ_FU={
 throat:[YN('fev','Fever?','¿Fiebre?','y'),YN('spot','White spots on the tonsils?','¿Manchas blancas en las anginas?','y'),YN('saliva','Trouble swallowing your own saliva / drooling?','¿No puedes tragar tu saliva / babeas?','r'),YN('cough','Cough or runny nose too?','¿También tos o mocos?')],
 ear:[YN('drain','Fluid or pus coming out of the ear?','¿Sale líquido o pus del oído?','y'),YN('hear','Can\'t hear well?','¿No oyes bien?','y'),YN('loud','After a loud noise or blast?','¿Después de un ruido fuerte o explosión?','y'),YN('behind','Swelling or redness behind the ear?','¿Hinchazón o enrojecimiento detrás de la oreja?','r')],
 cold:[YN('fev','Fever?','¿Fiebre?','y'),YN('wheeze','Wheezing or chest tightness?','¿Silbido en el pecho o pecho apretado?','y'),YN('blood','Coughing up blood?','¿Toses sangre?','r'),YN('ten','More than 10 days?','¿Más de 10 días?','y')],
 eye:[YN('trauma','Something hit it, got in it, or a chemical?','¿Te pegó algo, te entró algo o un químico?','r'),YN('blur','Blurry vision?','¿Visión borrosa?','y'),YN('light','Hurts to look at light?','¿Te duele ver la luz?','y'),YN('cont','Do you wear contact lenses?','¿Usas lentes de contacto?','y')],
 tooth:[YN('face','Swelling of the face or jaw?','¿Hinchazón de la cara o la mandíbula?','y'),YN('fev','Fever?','¿Fiebre?','y'),YN('broke','Broken or knocked-out tooth?','¿Diente roto o se cayó?','y'),YN('open','Trouble opening your mouth or swallowing?','¿No puedes abrir la boca o tragar?','r')],
 head:[YN('hit','Did you hit your head?','¿Te golpeaste la cabeza?','y'),YN('neck','Fever with a stiff neck?','¿Fiebre con el cuello rígido?','r'),YN('vis','Vision changes or vomiting?','¿Cambios en la vista o vómito?','y'),YN('usual','Like your usual headaches?','¿Como tus dolores de cabeza de siempre?')],
 dizzy:[YN('stand','Only when you stand up?','¿Solo cuando te levantas?'),YN('heat','After heat, PT or not drinking enough?','¿Después de calor, PT o no tomar suficiente agua?','y'),YN('heart','Heart racing or chest pain?','¿El corazón acelerado o dolor de pecho?','r'),YN('spin','Room spinning?','¿Sientes que todo da vueltas?','y')],
 back:MSK([YN('bowel','Trouble controlling bladder/bowels or numb groin?','¿No controlas la orina/heces o adormecimiento en la ingle?','r'),YN('leg','Pain going down the leg?','¿El dolor baja por la pierna?','y')]),
 neck:MSK([YN('crash','After a fall from height or vehicle crash?','¿Después de una caída de altura o choque?','r'),YN('arm','Pain or weakness going down the arm?','¿Dolor o debilidad que baja por el brazo?','y')]),
 shoulder:MSK(),elbow:MSK(),wrist:MSK(),hip:MSK(),
 knee:MSK([YN('lock','Knee locks or gives out?','¿La rodilla se traba o se dobla sola?','y')]),
 ankle:MSK(),foot:MSK(),leg:MSK([YN('calf','Calf swollen, warm and painful?','¿Pantorrilla hinchada, caliente y con dolor?','r')]),
 belly:[ONE('where','Where does it hurt most?','¿Dónde te duele más?',[['Upper belly','Parte de arriba'],['Lower right','Abajo a la derecha'],['Lower left','Abajo a la izquierda'],['All over','Todo el estómago']]),YN('fev','Fever?','¿Fiebre?','y'),YN('blood','Blood in vomit or stool, or black stool?','¿Sangre en el vómito o heces, o heces negras?','r'),YN('jump','Hurts more when you walk, jump or cough?','¿Duele más al caminar, brincar o toser?','y')],
 nausea:[YN('fluid','Can you keep water down?','¿Puedes retener el agua?','','y'),YN('blood','Blood in the vomit?','¿Sangre en el vómito?','r'),YN('dia','Diarrhea too?','¿También diarrea?'),YN('others','Others in your unit sick too?','¿Hay otros enfermos en tu unidad?','y')],
 diarrhea:[YN('blood','Blood in the stool?','¿Sangre en las heces?','r'),YN('fev','Fever?','¿Fiebre?','y'),YN('fluid','Can you keep water down?','¿Puedes retener el agua?','','y'),YN('many','More than 6 times today?','¿Más de 6 veces hoy?','y')],
 heartburn:[YN('exert','Chest pain when you exercise?','¿Dolor de pecho al hacer ejercicio?','r'),YN('swal','Food gets stuck when you swallow?','¿Se te atora la comida al tragar?','y'),YN('black','Black stool?','¿Heces negras?','r')],
 urine:[YN('fev','Fever or back / side pain?','¿Fiebre o dolor de espalda / costado?','y'),YN('blood','Blood in the urine?','¿Sangre en la orina?','y'),YN('disch','Discharge?','¿Secreción?','y')],
 chest:[YN('exert','Worse with exercise or effort?','¿Peor con ejercicio o esfuerzo?','r'),YN('sob','Short of breath?','¿Falta de aire?','r'),YN('press','Hurts more when you press on it or breathe deep?','¿Duele más al presionar o respirar hondo?')],
 breath:[YN('rest','Short of breath even at rest?','¿Falta de aire aun en reposo?','r'),YN('asthma','Wheezing or asthma history?','¿Silbido o historia de asma?','y'),YN('fev','Fever or cough?','¿Fiebre o tos?','y')],
 rash:[YN('fast','Spreading fast, or with fever?','¿Se extiende rápido o con fiebre?','y'),YN('face','Blisters near the eye or mouth?','¿Ampollas cerca del ojo o la boca?','y'),YN('new','New soap, medicine or plant contact?','¿Jabón, medicina nueva o contacto con plantas?')],
 shave:[YN('swell','Face or neck swelling, spreading redness, or fever?','¿Hinchazón en la cara o el cuello, enrojecimiento que se extiende o fiebre?','r'),YN('pus','Bumps with pus, or painful lumps?','¿Granitos con pus o bolitas que duelen?','y'),YN('mask','Do the bumps keep your mask or protective gear from sealing?','¿Los granitos no dejan que tu máscara o equipo de protección selle bien?','y'),YN('renew','Renewing a shaving profile you already had?','¿Vienes a renovar un perfil de afeitar que ya tenías?'),YN('scar','Dark spots or scars from the bumps?','¿Manchas oscuras o cicatrices por los granitos?')],
 blister:[YN('inf','Red streaks, pus or warmth?','¿Rayas rojas, pus o calor?','y'),YN('feet','On the feet?','¿En los pies?')],
 cut:[YN('dirty','Dirty or rusty object?','¿Objeto sucio u oxidado?','y'),YN('deep','Deep or gaping?','¿Profunda o abierta?','y'),YN('numb','Numb past the cut?','¿Adormecido después de la cortada?','y')],
 toenail:[YN('pus','Red, swollen or pus?','¿Rojo, hinchado o con pus?','y'),YN('fev','Fever?','¿Fiebre?','y')],
 bite:[YN('face','Face or throat swelling, or trouble breathing?','¿Hinchazón de cara o garganta, o te cuesta respirar?','r'),YN('spread','Redness spreading?','¿Lo rojo se está extendiendo?','y'),YN('tick','Was it a tick?','¿Fue una garrapata?','y')],
 burn:[YN('big','Blisters bigger than your palm?','¿Ampollas más grandes que tu palma?','y'),YN('where','On face, hands, feet or groin?','¿En cara, manos, pies o ingle?','y'),YN('chem','Chemical or electrical burn?','¿Quemadura química o eléctrica?','r')],
 fever:[YN('high','Measured 101°F (38.3°C) or more?','¿Medida de 101°F (38.3°C) o más?','y'),YN('neck','Stiff neck or new rash?','¿Cuello rígido o sarpullido nuevo?','r'),YN('field','Recent field, travel or deployment?','¿Campo, viaje o despliegue reciente?','y')],
 tired:[YN('sleep','Sleeping less than 5 hours?','¿Duermes menos de 5 horas?'),YN('mood','Feeling down or hopeless?','¿Te sientes triste o sin esperanza?','y'),YN('sob','Short of breath or chest pain?','¿Falta de aire o dolor de pecho?','r')],
 mood:[YN('today','Do you want to talk to someone today?','¿Quieres hablar con alguien hoy?','y'),YN('sleep','Can\'t sleep or eat?','¿No puedes dormir o comer?','y'),YN('alc','Drinking more than usual?','¿Tomas más alcohol de lo normal?','y')],
 women:[YN('preg','Could you be pregnant?','¿Podrías estar embarazada?','y'),YN('heavy','Soaking a pad or tampon every hour?','¿Empapas una toalla o tampón cada hora?','r'),YN('pain','Severe pain?','¿Dolor muy fuerte?','y')]
};
function iqFU(a){const ar=iqArea(a);if(ar[4]==='a')return[];return (IQ_FU[a]||[]).concat(IQ_GEN);}
function iqFUAns(q){/* → [{t:text EN/ES, lv}] for answered follow-ups */
  const ES=(typeof LANG!=='undefined'&&LANG==='es')||(typeof IQ_ES!=='undefined'&&IQ_ES);const out=[];const x=q.x||{};
  iqFU(q.a).forEach(Q=>{const v=x[Q[0]];if(v===undefined||v===null)return;const lbl=ES?Q[2]:Q[1];
    if(Q[3]==='yn'){const lv=v?Q[5]:Q[6];out.push({k:lbl.replace(/\?$/,''),v:v?(ES?'Sí':'Yes'):'No',lv,id:Q[0],en:Q[1].replace(/\?$/,''),ven:v?'yes':'no'});}
    else if(Q[3]==='one'){const o=Q[4][v];if(o)out.push({k:lbl.replace(/\?$/,''),v:ES?o[1]:o[0],lv:'',id:Q[0],en:Q[1].replace(/\?$/,''),ven:o[0]});}
    else if(Array.isArray(v)&&v.length){const os=v.map(i=>Q[4][i]).filter(Boolean);out.push({k:lbl.replace(/\?$/,''),v:os.map(o=>ES?o[1]:o[0]).join(', '),lv:'',id:Q[0],en:Q[1].replace(/\?$/,''),ven:os.map(o=>o[0]).join(', ')});}
  });return out;}
/* Rank + last name only (what's on the uniform) — no first name, no DoD ID. / Solo rango + apellido. */
const IQ_RANKS=['PVT','PV2','PFC','SPC','CPL','SGT','SSG','SFC','MSG','1SG','SGM','CSM','WO1','CW2','CW3','CW4','CW5','2LT','1LT','CPT','MAJ','LTC','COL','CIV'];
function iqWho(q){const rk=IQ_RANKS.includes(q.rk)?q.rk:'',ln=String(q.ln||'').trim();return (rk+' '+ln).trim();}
