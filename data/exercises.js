/* Home exercise cards for ADTMC B-protocols (MCP plan: "stretching + core strengthening home regimen during PT").
   Tarjetas de ejercicios en casa para los protocolos B del ADTMC (plan MCP: "estiramiento + fortalecimiento del core en casa / durante el PT").
   Sources / fuentes:
   - FM 7-22 (Army PRT/H2F): 4 for the Core (4C), Hip Stability Drill (HSD), Recovery Drill (RD) — doses and cues from the FM.
   - Knee: JOSPT Patellofemoral Pain CPG 2019 (hip + knee strengthening); AAOS OrthoInfo Knee Conditioning Program.
   - Back: McGill "Big 3" (curl-up, side bridge, bird dog = quadraplex); AAOS Spine Conditioning Program.
   - Other regions: AAOS OrthoInfo conditioning programs (hip, shoulder, foot & ankle).
   General exercise guidance for minor-care complaints only. Local PA/provider should approve before use. */
const EX_RULES={
 en:['Pain during the exercise should stay at 3/10 or less and be back to normal by the next morning.','Stop and come back to sick call for sharp pain, new swelling, numbness/tingling, or the joint catching/locking/giving out.','Stay inside the profile limits.'],
 es:['El dolor durante el ejercicio debe quedarse en 3/10 o menos y volver a lo normal a la mañana siguiente.','Para y regresa a sick call si hay dolor agudo, hinchazón nueva, adormecimiento/hormigueo o si la articulación se traba o se zafa.','Respeta los límites del profile.']};
const EX_DRILLS={
 '4C':{n:'4 for the Core (4C)',es:'4 for the Core (4C)',when:['Before PT, daily','Antes del PT, a diario'],ex:[
  {n:'Bent-leg raise',a:'blr',d:'up to 60 s',ds:'hasta 60 s',c:'On back, fingers under the small of the back, hips and knees at 90°. Brace abs and slowly straighten the legs while keeping the same pressure on your fingers; bring them back to 90°.',cs:'Boca arriba, dedos bajo la espalda baja, cadera y rodillas a 90°. Aprieta el abdomen y estira las piernas despacio sin perder la presión sobre los dedos; regrésalas a 90°.'},
  {n:'Side bridge',a:'sidebridge',d:'up to 60 s each side',ds:'hasta 60 s por lado',c:'On your side on elbow and forearm. Lift hips so the body is one straight line. Keep breathing; rest briefly and go again if form breaks.',cs:'De lado sobre el codo y antebrazo. Sube la cadera hasta quedar en línea recta. Respira; si pierdes la forma, descansa un momento y sigue.'},
  {n:'Back bridge',a:'backbridge',d:'up to 60 s',ds:'hasta 60 s',c:'On back, knees at 90°. Lift hips until trunk and thighs are in line (no arching). Straighten one leg, hold ~5 s, switch.',cs:'Boca arriba, rodillas a 90°. Sube la cadera hasta alinear tronco y muslos (sin arquear). Estira una pierna, sostén ~5 s y cambia.'},
  {n:'Quadraplex (bird dog)',a:'birddog',d:'up to 60 s',ds:'hasta 60 s',c:'Hands and knees, back flat, abs tight. Reach one leg back and the opposite arm forward without twisting; hold 5 s, switch.',cs:'En cuatro puntos, espalda plana, abdomen apretado. Extiende una pierna atrás y el brazo contrario adelante sin girar; sostén 5 s y cambia.'}]},
 'HSD':{n:'Hip Stability Drill (HSD)',es:'Hip Stability Drill (HSD)',when:['After 4C, daily — slow cadence','Después del 4C, a diario — ritmo lento'],ex:[
  {n:'Lateral leg raise',a:'latraise',d:'5–10 each side',ds:'5–10 por lado',c:'On your side, legs straight. Raise the top leg 6–8 in, toes forward, and lower.',cs:'De lado, piernas rectas. Sube la pierna de arriba 6–8 pulgadas, puntas al frente, y baja.'},
  {n:'Medial leg raise',a:'medraise',d:'5–10 each side',ds:'5–10 por lado',c:'On your side, top leg bent with foot flat behind. Raise the bottom leg 6–8 in and lower.',cs:'De lado, pierna de arriba doblada con el pie apoyado atrás. Sube la pierna de abajo 6–8 pulgadas y baja.'},
  {n:'Bent-leg lateral raise',a:'bentlat',d:'5–10 each side',ds:'5–10 por lado',c:'On your side, knees at 90°, feet together. Raise the top leg about 12 in keeping feet together.',cs:'De lado, rodillas a 90°, pies juntos. Sube la pierna de arriba unas 12 pulgadas sin separar los pies.'},
  {n:'Single-leg tuck',a:'sltuck',d:'5–10 each side',ds:'5–10 por lado',c:'On your side, top leg 6–8 in off the ground. Bring the top knee toward the chest and back out.',cs:'De lado, pierna de arriba 6–8 pulgadas del suelo. Lleva la rodilla de arriba al pecho y regrésala.'},
  {n:'Single-leg over',a:'slover',d:'20–30 s each side',ds:'20–30 s por lado',c:'On back, arms out. Bring one bent knee across the other leg and pull it toward the floor; shoulders stay down.',cs:'Boca arriba, brazos abiertos. Cruza una rodilla doblada sobre la otra pierna y llévala al suelo; hombros pegados.'}]},
 'RD':{n:'Recovery Drill (RD)',es:'Recovery Drill (RD)',when:['After PT — the "stretching" part','Después del PT — la parte de estiramiento'],ex:[
  {n:'Overhead arm pull',a:'ohpull',d:'20–30 s each side',ds:'20–30 s por lado'},
  {n:'Rear lunge',a:'rearlunge',d:'20–30 s each side',ds:'20–30 s por lado'},
  {n:'Extend and flex',a:'extflex',d:'20–30 s each position',ds:'20–30 s por posición'},
  {n:'Thigh stretch',a:'thighstretch',d:'20–30 s each side',ds:'20–30 s por lado'},
  {n:'Single-leg over',a:'slover',d:'20–30 s each side',ds:'20–30 s por lado'}]}
};
const EX_REG={
 knee:{t:['Knee','Rodilla'],ic:'🦵',p:['B-8'],drills:['4C','HSD','RD'],
  why:['Hip and core strength keep the knee from caving in when running or on stairs — the guideline for front-of-knee pain recommends hip + knee strengthening together.','Una cadera y un core fuertes evitan que la rodilla se vaya hacia adentro al correr o en escaleras — la guía para dolor de rodilla recomienda fortalecer cadera y rodilla juntas.'],
  ex:[
  {n:'Quad sets',a:'quadset',es:'Contracción de cuádriceps',d:'Hold 5 s × 10, 2–3×/day',ds:'Sostén 5 s × 10, 2–3 veces al día',c:'Sitting, leg straight. Tighten the thigh to press the back of the knee down.',cs:'Sentado, pierna recta. Aprieta el muslo para empujar la parte de atrás de la rodilla hacia abajo.'},
  {n:'Straight-leg raise',a:'slr',es:'Elevación de pierna recta',d:'3 × 10',ds:'3 × 10',c:'On back, other knee bent. Tighten the thigh and lift the straight leg to the height of the other knee; lower slowly.',cs:'Boca arriba, la otra rodilla doblada. Aprieta el muslo y sube la pierna recta a la altura de la otra rodilla; baja despacio.'},
  {n:'Mini squat / wall sit',a:'minisquat',es:'Media sentadilla / sentadilla en pared',d:'3 × 10 (or hold 20–30 s)',ds:'3 × 10 (o sostén 20–30 s)',c:'Back to wall, bend only to about 45°. Knees over the 2nd toe, weight in the heels.',cs:'Espalda en la pared, baja solo a unos 45°. Rodillas alineadas con el 2.º dedo, peso en los talones.'},
  {n:'Step-ups',a:'stepup',es:'Subir escalón',d:'3 × 10 each leg',ds:'3 × 10 por pierna',c:'Low step (4–6 in). Step up slowly; keep the knee from caving in.',cs:'Escalón bajo (4–6 pulgadas). Sube despacio; no dejes que la rodilla se vaya hacia adentro.'},
  {n:'Quad + hamstring stretch',a:'qstretch',es:'Estiramiento de cuádriceps y femoral',d:'30 s × 2 each',ds:'30 s × 2 cada uno',c:'Gentle stretch, no bouncing.',cs:'Estiramiento suave, sin rebotes.'}],
  src:'JOSPT Patellofemoral Pain CPG (2019); AAOS Knee Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/knee-conditioning-program/'},
 hip:{t:['Hip','Cadera'],ic:'🦴',p:['B-7'],drills:['4C','HSD','RD'],
  why:['Glute and core strength take load off the hip and lower back.','Glúteos y core fuertes le quitan carga a la cadera y la espalda baja.'],
  ex:[
  {n:'Glute bridge',a:'bridge',es:'Puente de glúteo',d:'3 × 10, hold 3 s',ds:'3 × 10, sostén 3 s',c:'On back, knees bent. Squeeze glutes and lift hips; do not arch the back.',cs:'Boca arriba, rodillas dobladas. Aprieta glúteos y sube la cadera; no arquees la espalda.'},
  {n:'Clamshell',a:'clam',es:'Almeja',d:'3 × 15 each side',ds:'3 × 15 por lado',c:'On your side, knees bent, feet together. Open the top knee without rolling the hips back.',cs:'De lado, rodillas dobladas, pies juntos. Abre la rodilla de arriba sin girar la cadera hacia atrás.'},
  {n:'Kneeling hip flexor stretch',a:'hipflexor',es:'Estiramiento de flexor de cadera de rodillas',d:'30 s × 2 each side',ds:'30 s × 2 por lado',c:'Half-kneeling, tuck the pelvis and shift forward until you feel it in the front of the hip.',cs:'Con una rodilla en el suelo, mete la pelvis y avanza hasta sentirlo al frente de la cadera.'},
  {n:'Figure-4 stretch',a:'fig4',es:'Estiramiento en 4',d:'30 s × 2 each side',ds:'30 s × 2 por lado',c:'On back, ankle over the opposite knee; pull the thigh toward you.',cs:'Boca arriba, tobillo sobre la rodilla contraria; jala el muslo hacia ti.'}],
  src:'AAOS Hip Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/hip-conditioning-program/'},
 back:{t:['Low back','Espalda baja'],ic:'🧍',p:['B-1'],drills:['4C','RD'],
  why:['Core endurance (McGill "Big 3": curl-up, side bridge, bird dog) protects the low back. 4C already covers the side bridge and the bird dog (quadraplex). Keep walking — bed rest slows recovery.','La resistencia del core (los "Big 3" de McGill: curl-up, side bridge, bird dog) protege la espalda baja. El 4C ya incluye el side bridge y el bird dog (quadraplex). Sigue caminando — el reposo en cama retrasa la recuperación.'],
  ex:[
  {n:'McGill curl-up',a:'curlup',es:'Curl-up de McGill',d:'Hold 10 s: 5, then 3, then 1 reps',ds:'Sostén 10 s: 5, luego 3, luego 1 repeticiones',c:'On back, one knee bent, hands under the low back. Lift head and shoulders just off the floor without flattening the back.',cs:'Boca arriba, una rodilla doblada, manos bajo la espalda baja. Despega cabeza y hombros apenas del suelo sin aplanar la espalda.'},
  {n:'Cat-camel',a:'catcamel',es:'Gato-camello',d:'8–10 slow reps',ds:'8–10 repeticiones lentas',c:'Hands and knees; gently round then arch the back. Motion, not a stretch.',cs:'En cuatro puntos; redondea y luego arquea la espalda suavemente. Es movimiento, no estiramiento.'},
  {n:'Walking',a:'walk',es:'Caminar',d:'10–20 min, 1–2×/day',ds:'10–20 min, 1–2 veces al día',c:'Easy pace, inside the profile limits.',cs:'Paso cómodo, dentro de los límites del profile.'},
  {n:'Knee-to-chest',a:'k2c',es:'Rodilla al pecho',d:'20–30 s × 2 each side',ds:'20–30 s × 2 por lado',c:'On back, pull one knee gently toward the chest.',cs:'Boca arriba, jala una rodilla suavemente hacia el pecho.'}],
  src:'McGill "Big 3"; AAOS Spine Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/spine-conditioning-program/'},
 neck:{t:['Neck','Cuello'],ic:'🙆',p:['B-2'],drills:['4C','RD'],
  why:['Posture muscles of the neck and upper back plus core endurance (Kevlar, ruck straps).','Músculos de postura del cuello y espalda alta más resistencia del core (Kevlar, correas del ruck).'],
  ex:[
  {n:'Chin tucks',a:'chintuck',es:'Retracción de barbilla',d:'Hold 5 s × 10',ds:'Sostén 5 s × 10',c:'Sit or stand tall; slide the chin straight back (double chin), do not tilt.',cs:'Sentado o parado derecho; lleva la barbilla hacia atrás (papada), sin inclinar.'},
  {n:'Shoulder-blade squeeze',a:'scapsq',es:'Apretar omóplatos',d:'Hold 5 s × 10',ds:'Sostén 5 s × 10',c:'Pull shoulder blades back and down.',cs:'Lleva los omóplatos hacia atrás y abajo.'},
  {n:'Upper trap stretch',a:'uptrap',es:'Estiramiento de trapecio',d:'30 s × 2 each side',ds:'30 s × 2 por lado',c:'Ear toward shoulder; hold the other arm down.',cs:'Oreja hacia el hombro; mantén el otro brazo abajo.'},
  {n:'Levator stretch',a:'levator',es:'Estiramiento de elevador de la escápula',d:'30 s × 2 each side',ds:'30 s × 2 por lado',c:'Nose toward the armpit; gentle pull with the hand.',cs:'Nariz hacia la axila; jala suave con la mano.'}],
  src:'AAOS Spine Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/spine-conditioning-program/'},
 shoulder:{t:['Shoulder','Hombro'],ic:'💪',p:['B-3'],drills:['4C','RD'],
  why:['Rotator cuff and shoulder-blade muscles keep the shoulder centered; core gives the base for pushing and carrying.','El manguito rotador y los músculos del omóplato mantienen el hombro centrado; el core da la base para empujar y cargar.'],
  ex:[
  {n:'Pendulum',a:'pendulum',es:'Péndulo',d:'30 s circles each way, 2–3×/day',ds:'Círculos 30 s cada sentido, 2–3 veces al día',c:'Lean on a table, let the arm hang and swing in small circles.',cs:'Apóyate en una mesa, deja colgar el brazo y haz círculos pequeños.'},
  {n:'Shoulder-blade squeeze',a:'scapsq',es:'Apretar omóplatos',d:'Hold 5 s × 10',ds:'Sostén 5 s × 10',c:'Pull shoulder blades back and down.',cs:'Lleva los omóplatos hacia atrás y abajo.'},
  {n:'Side-lying external rotation',a:'sler',es:'Rotación externa de lado',d:'3 × 10–15',ds:'3 × 10–15',c:'Lie on the good side, elbow at 90° against the body; rotate a light weight (or water bottle) up.',cs:'Acostado sobre el lado sano, codo a 90° pegado al cuerpo; gira hacia arriba un peso ligero (o botella de agua).'},
  {n:'Wall slides',a:'wallslide',es:'Deslizar en la pared',d:'2 × 10, pain-free range',ds:'2 × 10, sin dolor',c:'Forearms on the wall, slide up as far as comfortable.',cs:'Antebrazos en la pared, desliza hacia arriba hasta donde sea cómodo.'}],
  src:'AAOS Rotator Cuff and Shoulder Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/'},
 arm:{t:['Elbow / wrist / hand','Codo / muñeca / mano'],ic:'✋',p:['B-4','B-5','B-6'],drills:['4C','RD'],
  why:['Slow, controlled forearm strengthening (eccentrics) is a standard treatment for tennis-elbow type pain.','El fortalecimiento lento y controlado del antebrazo (excéntricos) es un tratamiento estándar para el dolor tipo codo de tenista.'],
  ex:[
  {n:'Wrist extensor stretch',a:'wext',es:'Estiramiento de extensores',d:'30 s × 3',ds:'30 s × 3',c:'Arm straight, palm down; gently bend the wrist down with the other hand.',cs:'Brazo recto, palma abajo; dobla la muñeca hacia abajo con la otra mano.'},
  {n:'Wrist flexor stretch',a:'wflex',es:'Estiramiento de flexores',d:'30 s × 3',ds:'30 s × 3',c:'Arm straight, palm up; gently bend the wrist back.',cs:'Brazo recto, palma arriba; dobla la muñeca hacia atrás suavemente.'},
  {n:'Slow wrist lowering (eccentric)',a:'ecc',es:'Bajar la muñeca lento (excéntrico)',d:'3 × 15',ds:'3 × 15',c:'Forearm on a table, light weight or full canteen; use the other hand to lift, lower slowly over 3–5 s.',cs:'Antebrazo en la mesa, peso ligero o cantimplora llena; sube con la otra mano y baja despacio en 3–5 s.'},
  {n:'Grip squeeze',a:'grip',es:'Apretar',d:'Hold 5 s × 10',ds:'Sostén 5 s × 10',c:'Soft ball or rolled towel.',cs:'Pelota suave o toalla enrollada.'}],
  src:'AAOS OrthoInfo',url:''},
 ankle:{t:['Ankle','Tobillo'],ic:'🦶',p:['B-9'],drills:['4C','HSD','RD'],
  why:['Balance training after a sprain lowers the chance of rolling it again; hip strength helps balance.','El entrenamiento de equilibrio después de un esguince baja el riesgo de volver a torcerse; la fuerza de cadera ayuda al equilibrio.'],
  ex:[
  {n:'Ankle alphabet',a:'alphabet',es:'Alfabeto con el tobillo',d:'1–2 × A–Z',ds:'1–2 × A–Z',c:'Seated, trace the letters with the big toe.',cs:'Sentado, dibuja las letras con el dedo gordo.'},
  {n:'Calf raises',a:'calfraise',es:'Elevación de talones',d:'3 × 15',ds:'3 × 15',c:'Both feet, then one foot as it gets easy.',cs:'Con ambos pies y luego con uno cuando sea fácil.'},
  {n:'Single-leg balance',a:'balance',es:'Equilibrio en una pierna',d:'30 s × 3',ds:'30 s × 3',c:'Near a wall; eyes closed when it gets easy.',cs:'Cerca de una pared; con ojos cerrados cuando sea fácil.'},
  {n:'Band / towel ankle moves',a:'band',es:'Tobillo con banda o toalla',d:'2 × 10 each direction',ds:'2 × 10 en cada dirección',c:'Push the foot down, up, in and out against a band or towel.',cs:'Empuja el pie abajo, arriba, adentro y afuera contra una banda o toalla.'},
  {n:'Calf stretch',a:'calfstretch',es:'Estiramiento de pantorrilla',d:'30 s × 2',ds:'30 s × 2',c:'Against a wall, heel down.',cs:'Contra la pared, talón abajo.'}],
  src:'AAOS Foot and Ankle Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/foot-and-ankle-conditioning-program/'},
 foot:{t:['Foot / heel','Pie / talón'],ic:'👣',p:['B-10'],drills:['HSD','RD'],
  why:['Stretching the plantar fascia and calf — especially before the first steps in the morning — is first-line care for heel pain.','Estirar la fascia plantar y la pantorrilla — sobre todo antes de los primeros pasos en la mañana — es el primer tratamiento para el dolor de talón.'],
  ex:[
  {n:'Plantar fascia stretch',a:'pfstretch',es:'Estiramiento de fascia plantar',d:'10 s × 10, before getting up',ds:'10 s × 10, antes de levantarte',c:'Seated, foot over the knee; pull the toes back.',cs:'Sentado, pie sobre la rodilla; jala los dedos hacia atrás.'},
  {n:'Calf stretch (knee straight + bent)',a:'calfstretch',es:'Pantorrilla (rodilla recta y doblada)',d:'30 s × 3 each',ds:'30 s × 3 cada uno',c:'Against a wall, heel down.',cs:'Contra la pared, talón abajo.'},
  {n:'Frozen bottle roll',a:'bottle',es:'Rodar botella congelada',d:'5–10 min',ds:'5–10 min',c:'Roll the arch over a frozen water bottle.',cs:'Rueda el arco sobre una botella de agua congelada.'},
  {n:'Towel scrunch',a:'towel',es:'Arrugar toalla con los dedos',d:'2 × 10',ds:'2 × 10',c:'Pull a towel toward you with the toes.',cs:'Jala una toalla hacia ti con los dedos del pie.'},
  {n:'Calf raises',a:'calfraise',es:'Elevación de talones',d:'3 × 15',ds:'3 × 15',c:'Slow up and down.',cs:'Sube y baja despacio.'}],
  src:'AAOS Foot and Ankle Conditioning Program',url:'https://orthoinfo.aaos.org/en/recovery/foot-and-ankle-conditioning-program/'}
};
function exRegFor(id){for(const k in EX_REG)if(EX_REG[k].p.includes(id))return k;return '';}
