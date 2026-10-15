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
const IQ_DUR=[['today','Today','Hoy'],['1-3d','1–3 days','1–3 días'],['4-7d','4–7 days','4–7 días'],['1-4w','1–4 weeks','1–4 semanas'],['1mo+','More than a month','Más de un mes']];
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
  const ES=(typeof LANG!=='undefined'&&LANG==='es')||(typeof IQ_ES!=='undefined'&&IQ_ES);const t=(e,s)=>ES?s:e;
  const f=q.f||[];
  if(f.length)return{c:'red',why:t('Red flag: ','Bandera roja: ')+f.map(x=>iqLbl(IQ_FLAGS,x,ES?2:1)).join(', ')};
  if(iqArea(q.a)[4]==='a')return{c:'gray',why:t('Administrative — routine appointment','Administrativo — cita de rutina')};
  if(q.r){if(q.rw||q.w)return{c:'orange',why:t('Return visit, worse → AEM / clinic (ADTMC M-1)','Regreso, peor → AEM / clínica (ADTMC M-1)')};
    return{c:'gray',why:t('Already seen for this, not worse','Ya lo vieron por esto, no está peor')};}
  if(q.d==='today'||q.d==='1-3d')return{c:'orange',why:t('Acute (3 days or less)','Agudo (3 días o menos)')};
  if(q.w)return{c:'orange',why:t('Older problem, worse in the last 2–3 days','Problema viejo, peor en los últimos 2–3 días')};
  if((q.s||0)>=8)return{c:'orange',why:t('Severe pain (8/10 or more)','Dolor fuerte (8/10 o más)')};
  return{c:'gray',why:t('Ongoing more than 3 days, not worse → consider appointment / PCM','Más de 3 días, no peor → considerar cita / PCM')};
}
function iqEncode(q){const s=JSON.stringify(q);const b=btoa(unescape(encodeURIComponent(s)));return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function iqDecode(txt){
  try{let m=String(txt).match(/[#&?]iq=([A-Za-z0-9_-]+)/);const b=(m?m[1]:String(txt).trim()).replace(/-/g,'+').replace(/_/g,'/');
    const q=JSON.parse(decodeURIComponent(escape(atob(b+'==='.slice((b.length+3)%4)))));
    if(!q||q.v!==1||typeof q.a!=='string')return null;
    q.f=Array.isArray(q.f)?q.f.filter(x=>IQ_FLAGS.some(y=>y[0]===x)):[];q.s=Math.max(0,Math.min(10,+q.s||0));q.n=String(q.n||'').slice(0,100);
    return q;}catch(e){return null;}
}
const IQ_HOME='https://bubymed.github.io/SICK-CALL-ADTMC-EASY-TOOL/';
function iqBase(){try{if(location.protocol==='https:')return new URL('./',location.href).href;}catch(e){}return IQ_HOME;}
