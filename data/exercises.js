/* Home / reconditioning exercises — based ONLY on FM 7-22, Army Physical Readiness Training (26 Oct 2012, C1 3 May 2013), Chapter 6.
   Ejercicios de reacondicionamiento — basados SOLO en el FM 7-22 (oct 2012, C1 may 2013), capítulo 6.
   Pictures are the FM 7-22 figures (U.S. Government work). Text follows the FM; Spanish is a translation for the Soldier.
   Key doctrine: Soldiers recovering from injury train within their profile (6-6, 6-32); in reconditioning 4C and HSD are done
   daily before other PRT (6-42, 6-50); the SSD may be used after shoulder injuries per profile (6-51); Recovery Drill holds
   20–30 s and every RD exercise has a modified version for limited range of motion (6-130 to 6-135). */
const EX_SRC='FM 7-22, Army Physical Readiness Training (Oct 2012, C1 2013), Ch. 6 — Reconditioning';
const EX_IMG='img/fm/';
const EX_RULES={
 en:['Train within the limits of your profile — follow it exactly (FM 7-22, para 6-6, 6-32).',
     'In reconditioning, do 4 for the Core and the Hip Stability Drill every day, before other PRT (6-42, 6-50).',
     '4C: do not go over 60 seconds per exercise. HSD: no more than 10 reps of exercises 1–4 and no more than 30 seconds per position in exercise 5.',
     'Recovery Drill: hold each stretch 20–30 seconds. If your range of motion is limited, use the modified version (6-130).',
     'Getting worse, or not better by your return date? Come back to sick call.'],
 es:['Entrena dentro de los límites de tu profile — síguelo al pie de la letra (FM 7-22, párr. 6-6, 6-32).',
     'En reacondicionamiento, haz 4 for the Core y el Hip Stability Drill todos los días, antes del resto del PT (6-42, 6-50).',
     '4C: no pases de 60 segundos por ejercicio. HSD: máximo 10 repeticiones de los ejercicios 1–4 y máximo 30 segundos por posición en el ejercicio 5.',
     'Recovery Drill: sostén cada estiramiento 20–30 segundos. Si no tienes todo el rango de movimiento, usa la versión modificada (6-130).',
     '¿Empeoras o no mejoras para tu fecha de regreso? Regresa a sick call.']};
const EX_DRILLS={
 '4C':{n:'4 for the Core (4C)',es:'4 for the Core (4C)',ref:'6-42 to 6-49',when:['Daily, before other PRT · hold up to 60 s each','A diario, antes del resto del PT · hasta 60 s cada uno'],ex:[
  {id:'blr',n:'Bent-leg raise',img:'blr',pg:'6-12',d:'1 minute',ds:'1 minuto',
   c:'On your back, fingers under the small of the back, hips and knees bent to 90°, head 2–3 inches off the ground. Tighten the abs ("navel to spine") and keep the same pressure on your fingers while you slowly straighten the legs. When you can no longer keep the pressure, bring the legs back to 90° for 3–5 seconds and repeat until one minute has passed.',
   cs:'Boca arriba, dedos bajo la espalda baja, cadera y rodillas a 90°, cabeza 2–3 pulgadas del suelo. Aprieta el abdomen ("ombligo a la columna") y mantén la misma presión sobre los dedos mientras estiras las piernas despacio. Cuando ya no puedas mantener la presión, regresa las piernas a 90° por 3–5 segundos y repite hasta completar un minuto.'},
  {id:'sidebridge',n:'Side bridge',img:'sidebridge',mod:'sidebridge_m',pg:'6-13',d:'1 minute each side',ds:'1 minuto por lado',
   c:'On your side, upper body up on the elbow, forearm and fist. Cross the bottom leg in front of the top leg, feet together (or knees together bent 90°). Press into the ground and raise the trunk and pelvis until they form a straight line with the legs. Keep breathing. If you cannot hold one minute, lower, rest briefly and repeat until one minute has passed.',
   cs:'De lado, con el tronco apoyado en el codo, antebrazo y puño. Cruza la pierna de abajo frente a la de arriba, pies juntos (o rodillas juntas dobladas a 90°). Empuja el suelo y sube el tronco y la pelvis hasta quedar en línea recta con las piernas. Sigue respirando. Si no aguantas un minuto, baja, descansa un momento y repite hasta completar el minuto.',
   mn:'Modified side bridge (on knees)',ms:'Side bridge modificado (sobre las rodillas)'},
  {id:'backbridge',n:'Back bridge',img:'backbridge',pg:'6-14',d:'1 minute',ds:'1 minuto',
   c:'On your back, knees bent 90°, arms out at 45°. Tighten the abs, then raise the hips until trunk and thighs form a straight line — do not arch the spine. With the hips up, straighten one leg in line with the trunk, hold 5 seconds, switch legs. If the spine sags, arches or tilts, lower, rest 3–5 seconds and try again.',
   cs:'Boca arriba, rodillas a 90°, brazos abiertos a 45°. Aprieta el abdomen y sube la cadera hasta que tronco y muslos queden en línea recta — sin arquear la espalda. Con la cadera arriba, estira una pierna en línea con el tronco, sostén 5 segundos y cambia. Si la espalda se hunde, se arquea o se ladea, baja, descansa 3–5 segundos e inténtalo otra vez.'},
  {id:'quadraplex',n:'Quadraplex',img:'quadraplex',pg:'6-15',d:'1 minute each side',ds:'1 minuto por lado',
   c:'On hands and knees, back flat, abs tight. Without rotating the trunk or sagging/arching the spine, straighten one leg to the rear and the opposite arm to the front. Hold at least 5 seconds, then alternate. Lower and raise the arm and leg under control while the rest of the body stays still.',
   cs:'En manos y rodillas, espalda plana, abdomen apretado. Sin girar el tronco ni hundir o arquear la espalda, estira una pierna hacia atrás y el brazo contrario hacia adelante. Sostén al menos 5 segundos y alterna. Baja y sube el brazo y la pierna con control mientras el resto del cuerpo se queda quieto.'}]},
 'HSD':{n:'Hip Stability Drill (HSD)',es:'Hip Stability Drill (HSD)',ref:'6-50',when:['Daily, right after 4C · SLOW cadence','A diario, justo después del 4C · ritmo LENTO'],ex:[
  {id:'latraise',n:'Lateral leg raise',img:'latraise',pg:'6-16',d:'5 reps each side',ds:'5 repeticiones por lado',
   c:'Lie on your side, legs straight and together, toes forward, upper body on the elbow (elbow 90°, fist vertical). Raise the top leg so the foot is 6–8 inches off the ground, then lower. Keep the knee straight, the foot pointing forward and the top hand on the stomach.',
   cs:'Acostado de lado, piernas rectas y juntas, puntas al frente, apoyado en el codo (codo a 90°, puño vertical). Sube la pierna de arriba hasta que el pie quede 6–8 pulgadas del suelo y baja. Rodilla recta, pie al frente y la mano de arriba sobre el estómago.'},
  {id:'medraise',n:'Medial leg raise',img:'medraise',pg:'6-18',d:'5 reps each side',ds:'5 repeticiones por lado',
   c:'Lie on your side, bottom leg straight; top leg bent 90° with the foot flat on the ground behind the bottom leg. Raise the bottom leg so the foot is 6–8 inches off the ground, then lower. Hips facing forward, toes of the bottom leg forward, top hand on the stomach.',
   cs:'Acostado de lado, pierna de abajo recta; pierna de arriba doblada a 90° con el pie apoyado detrás de la pierna de abajo. Sube la pierna de abajo hasta que el pie quede 6–8 pulgadas del suelo y baja. Cadera al frente, puntas de la pierna de abajo al frente, mano de arriba sobre el estómago.'},
  {id:'bentlat',n:'Bent-leg lateral raise',img:'bentlat',pg:'6-20',d:'5 reps each side',ds:'5 repeticiones por lado',
   c:'Lie on your side with both legs bent 90° and feet together. Raise the top leg about 12 inches, keeping the feet together, then lower. Keep a straight line from the knees to the torso and the top hand on the stomach.',
   cs:'Acostado de lado con las dos piernas dobladas a 90° y los pies juntos. Sube la pierna de arriba unas 12 pulgadas sin separar los pies y baja. Mantén una línea recta de las rodillas al tronco y la mano de arriba sobre el estómago.'},
  {id:'sltuck',n:'Single-leg tuck',img:'sltuck',pg:'6-22',d:'5 reps each side',ds:'5 repeticiones por lado',
   c:'Lie on your side, legs straight, top leg held 6–8 inches off the ground. Bring the top thigh toward the chest, bending the knee to 90°, then return. The top foot stays 6–8 inches off the ground the whole time; top hand on the stomach.',
   cs:'Acostado de lado, piernas rectas, pierna de arriba 6–8 pulgadas del suelo. Lleva el muslo de arriba hacia el pecho doblando la rodilla a 90° y regresa. El pie de arriba se queda a 6–8 pulgadas del suelo todo el tiempo; mano de arriba sobre el estómago.'},
  {id:'slover',n:'Single-leg over',img:'slover',pg:'6-24',d:'20–30 s each side',ds:'20–30 s por lado',
   c:'On your back, arms out to the sides at 90°, palms down, head on the ground. Turn the body to the right, bend the left knee to 90° over the right leg, grasp the outside of the left knee with the right hand and pull toward the right. Hold, return, then do the other side. Keep the opposite shoulder, arm and hand on the ground.',
   cs:'Boca arriba, brazos abiertos a 90°, palmas abajo, cabeza en el suelo. Gira el cuerpo a la derecha, dobla la rodilla izquierda a 90° por encima de la pierna derecha, toma la parte de afuera de la rodilla izquierda con la mano derecha y jala hacia la derecha. Sostén, regresa y haz el otro lado. El hombro, brazo y mano contrarios se quedan en el suelo.'}]},
 'SSD':{n:'Shoulder Stability Drill (SSD)',es:'Shoulder Stability Drill (SSD)',ref:'6-51',when:['After shoulder injury, per profile · 5 reps · SLOW','Después de lesión de hombro, según el profile · 5 repeticiones · LENTO'],ex:[
  {id:'ssd_i',n:'"I" raise',img:'ssd_i',pg:'6-26',d:'5 reps',ds:'5 repeticiones',c:'Lie face down, head slightly up in line with the spine, abs tight. Arms overhead in line with the body ("I"), thumbs up. Raise both arms 3–6 inches, then lower. Do not jerk.',cs:'Boca abajo, cabeza un poco arriba alineada con la columna, abdomen apretado. Brazos arriba en línea con el cuerpo ("I"), pulgares arriba. Sube los dos brazos 3–6 pulgadas y baja. Sin jalones.'},
  {id:'ssd_t',n:'"T" raise',img:'ssd_t',pg:'6-27',d:'5 reps',ds:'5 repeticiones',c:'Same position, arms straight out to the sides at 90° ("T"). Raise both arms 3–6 inches, then lower.',cs:'Misma posición, brazos rectos a los lados a 90° ("T"). Sube los dos brazos 3–6 pulgadas y baja.'},
  {id:'ssd_y',n:'"Y" raise',img:'ssd_y',pg:'6-28',d:'5 reps',ds:'5 repeticiones',c:'Same position, arms overhead at 45° ("Y"). Raise both arms 3–6 inches, then lower.',cs:'Misma posición, brazos arriba a 45° ("Y"). Sube los dos brazos 3–6 pulgadas y baja.'},
  {id:'ssd_l',n:'"L" raise',img:'ssd_l',pg:'6-29',d:'5 reps',ds:'5 repeticiones',c:'Same position, arms out to the sides with elbows bent 90° ("L"). Raise both arms 3–6 inches, then lower.',cs:'Misma posición, brazos a los lados con los codos doblados a 90° ("L"). Sube los dos brazos 3–6 pulgadas y baja.'},
  {id:'ssd_w',n:'"W" raise',img:'ssd_w',pg:'6-30',d:'5 reps',ds:'5 repeticiones',c:'Same position, arms down at 45° with elbows bent 45° ("W"). Raise both arms 3–6 inches, then lower.',cs:'Misma posición, brazos abajo a 45° con los codos doblados a 45° ("W"). Sube los dos brazos 3–6 pulgadas y baja.'}]},
 'RD':{n:'Recovery Drill (RD)',es:'Recovery Drill (RD)',ref:'6-107 to 6-116',when:['After activity · hold each stretch 20–30 s','Después de la actividad · sostén cada estiramiento 20–30 s'],ex:[
  {id:'rd_oap',n:'Overhead arm pull',img:'rd_oap',mod:'rd_oap_m',pg:'6-107',d:'20–30 s each side',ds:'20–30 s por lado',
   c:'Straddle stance, hands on hips. Raise one arm overhead and place the hand behind the head; grasp above that elbow with the other hand and pull, leaning the body straight to the side (not forward or back). Hips set, abs tight.',
   cs:'Piernas abiertas, manos en la cintura. Sube un brazo y pon la mano detrás de la cabeza; toma ese brazo arriba del codo con la otra mano y jala, inclinando el cuerpo derecho hacia el lado (ni adelante ni atrás). Cadera firme, abdomen apretado.',
   mn:'Modified: grasp the wrist instead of the elbow, or pull the arm across the front of the chest (6-131).',ms:'Modificado: toma la muñeca en vez del codo, o jala el brazo por delante del pecho (6-131).'},
  {id:'rd_lunge',n:'Rear lunge',img:'rd_lunge',mod:'rd_lunge_m',pg:'6-109',d:'20–30 s each side',ds:'20–30 s por lado',
   c:'Straddle stance, hands on hips. Take an exaggerated step back, touching down with the ball of the foot, and let the body keep lowering. Back straight, feet forward and shoulder-width apart, front knee over the ball of the foot — never in front of the toes; rear heel off the ground.',
   cs:'Piernas abiertas, manos en la cintura. Da un paso largo hacia atrás apoyando la punta del pie y deja que el cuerpo siga bajando. Espalda recta, pies al frente a lo ancho de los hombros, rodilla de adelante sobre la punta del pie — nunca más adelante que los dedos; talón de atrás sin tocar el suelo.',
   mn:'Modified: smaller step and less depth, feet closer together; lower gradually and increase the range over time (6-132).',ms:'Modificado: paso más corto y menos profundo, pies más juntos; baja poco a poco y aumenta el rango con el tiempo (6-132).'},
  {id:'rd_ef',n:'Extend and flex',img:'rd_ef',mod:'rd_ef_m',pg:'6-111',d:'20–30 s each position',ds:'20–30 s por posición',
   c:'From the front leaning rest: (1) Extend — lower the body, sagging in the middle with arms straight and looking up; thighs and pelvis rest on the ground. (2) Flex — bend the knees slightly, raise the hips, then straighten the legs and try to put the heels down, forming an "A". Feet together.',
   cs:'Desde la posición de lagartija: (1) Extender — baja el cuerpo dejando que se hunda en el medio, brazos rectos y mirando arriba; muslos y pelvis en el suelo. (2) Flexionar — dobla un poco las rodillas, sube la cadera, estira las piernas e intenta bajar los talones, formando una "A". Pies juntos.',
   mn:'Modified: standing version, or prone on the forearms / arms by the sides (6-133).',ms:'Modificado: versión de pie, o boca abajo sobre los antebrazos / con los brazos a los lados (6-133).'},
  {id:'rd_thigh',n:'Thigh stretch',img:'rd_thigh',mod:'rd_thigh_m',pg:'6-113',d:'20–30 s each side',ds:'20–30 s por lado',
   c:'From sitting, roll onto one side on the forearm. With the top hand grasp the top ankle and pull the heel toward the buttocks, then pull the whole leg back; push the thigh further back with the heel of the bottom foot. Abs tight. Do not pull hard if the knee hurts.',
   cs:'Desde sentado, gira de lado sobre el antebrazo. Con la mano de arriba toma el tobillo de arriba y jala el talón hacia el glúteo, luego lleva toda la pierna hacia atrás; empuja el muslo más atrás con el talón del pie de abajo. Abdomen apretado. No jales fuerte si duele la rodilla.',
   mn:'Modified: less knee bend (pull the leg slightly forward) or do it kneeling (6-134, 6-135).',ms:'Modificado: dobla menos la rodilla (jala la pierna un poco hacia adelante) o hazlo de rodillas (6-134, 6-135).'},
  {id:'rd_slo',n:'Single-leg over',img:'rd_slo',mod:'rd_slo_m',pg:'6-115',d:'20–30 s each side',ds:'20–30 s por lado',
   c:'On your back, arms out at 90°, palms down, feet together. Turn the body, bend the top knee 90° over the other leg, grasp the outside of the knee with the opposite hand and pull. Opposite shoulder, arm and hand stay on the ground; head down.',
   cs:'Boca arriba, brazos abiertos a 90°, palmas abajo, pies juntos. Gira el cuerpo, dobla la rodilla a 90° por encima de la otra pierna, tómala por afuera con la mano contraria y jala. El hombro, brazo y mano contrarios se quedan en el suelo; cabeza abajo.',
   mn:'Modified: bent-leg over — both knees bent (6-116).',ms:'Modificado: con las dos rodillas dobladas (6-116).'}]}
};
/* Body areas: which FM drills to show and what the FM says that applies. Each line cites the FM paragraph. */
const EX_REG={
 knee:{t:['Knee','Rodilla'],ic:'🦵',p:['B-8'],drills:['4C','HSD','RD'],mods:['rd_lunge','rd_thigh'],
  why:['FM 7-22: knee and back injuries are a major cause of limited duty; 4C and HSD build the core and hip stability the knee depends on (6-9, 6-41). If the knee cannot bend fully, use the modified rear lunge and modified thigh stretch (6-132, 6-135). For cardio, cycle ergometers give the most body-weight support (6-24).',
       'FM 7-22: las lesiones de rodilla y espalda causan mucho trabajo limitado; el 4C y el HSD fortalecen el core y la estabilidad de cadera de la que depende la rodilla (6-9, 6-41). Si la rodilla no dobla completa, usa el rear lunge y el thigh stretch modificados (6-132, 6-135). Para cardio, la bicicleta estática es la que más soporta el peso del cuerpo (6-24).']},
 hip:{t:['Hip','Cadera'],ic:'🦴',p:['B-7'],drills:['4C','HSD','RD'],mods:['rd_lunge','rd_slo'],
  why:['FM 7-22: the HSD trains the hip and upper thigh three-dimensionally for stability (6-50). The rear lunge and single-leg over of the Recovery Drill stretch the hip flexors, hips and lower back (6-109, 6-115).',
       'FM 7-22: el HSD entrena la cadera y el muslo en tres dimensiones para dar estabilidad (6-50). El rear lunge y el single-leg over del Recovery Drill estiran los flexores de cadera, la cadera y la espalda baja (6-109, 6-115).']},
 back:{t:['Low back','Espalda baja'],ic:'🧍',p:['B-1'],drills:['4C','HSD','RD'],mods:['rd_ef','rd_slo'],
  why:['FM 7-22: the abdominal and back muscles form a supportive ring around the spine; 4C trains them the way they work (6-42). To control back injuries, "set the hips and tighten the abs" in every exercise (6-13). Use the modified extend and flex if you cannot extend fully (6-133).',
       'FM 7-22: los músculos del abdomen y la espalda forman un anillo que sostiene la columna; el 4C los entrena como trabajan (6-42). Para controlar lesiones de espalda, "fija la cadera y aprieta el abdomen" en cada ejercicio (6-13). Usa el extend and flex modificado si no puedes extender completo (6-133).']},
 neck:{t:['Neck','Cuello'],ic:'🙆',p:['B-2'],drills:['4C','HSD','RD'],mods:['rd_oap'],
  why:['FM 7-22 has no neck-specific drill. Keep training what the profile allows — a limitation in one area should not stop the rest (6-32). Use the modified overhead arm pull if moving the arm overhead bothers the neck (6-131).',
       'El FM 7-22 no tiene un drill específico para el cuello. Sigue entrenando lo que el profile permite — una limitación en una zona no debe detener el resto (6-32). Usa el overhead arm pull modificado si subir el brazo molesta el cuello (6-131).']},
 shoulder:{t:['Shoulder','Hombro'],ic:'💪',p:['B-3'],drills:['SSD','4C','HSD','RD'],mods:['rd_oap'],
  why:['FM 7-22: Soldiers recovering from shoulder injuries may do the Shoulder Stability Drill as part of reconditioning, according to the profile (6-51). Use the modified overhead arm pull (grasp the wrist or pull across the chest) if range of motion is limited (6-131).',
       'FM 7-22: los soldados que se recuperan de una lesión de hombro pueden hacer el Shoulder Stability Drill como parte del reacondicionamiento, según el profile (6-51). Usa el overhead arm pull modificado (tomar la muñeca o jalar por delante del pecho) si el rango de movimiento está limitado (6-131).']},
 arm:{t:['Elbow / wrist / hand','Codo / muñeca / mano'],ic:'✋',p:['B-4','B-5','B-6'],drills:['4C','HSD','RD'],mods:['rd_oap'],
  why:['FM 7-22 has no elbow/wrist/hand drill. A limitation in one area should not stop training of other areas (6-32) — keep doing what the profile allows. The side bridge and quadraplex put weight on the forearm and hand: skip them if they load the injured arm.',
       'El FM 7-22 no tiene un drill para codo, muñeca o mano. Una limitación en una zona no debe detener el entrenamiento del resto (6-32) — sigue haciendo lo que el profile permite. El side bridge y el quadraplex cargan peso en el antebrazo y la mano: sáltalos si cargan el brazo lesionado.']},
 ankle:{t:['Ankle','Tobillo'],ic:'🦶',p:['B-9'],drills:['4C','HSD','RD'],mods:['rd_lunge'],
  why:['FM 7-22: lower-extremity injuries keep many Soldiers from running; use machines that limit weight bearing — cycle ergometers give the most support, and pool work removes it (6-24, 6-25). 4C and HSD are done lying down. Use the modified rear lunge (smaller step) until the ankle allows more (6-132).',
       'FM 7-22: las lesiones de pierna impiden correr a muchos soldados; usa máquinas que limiten el peso — la bicicleta estática da el mayor soporte y la alberca lo elimina (6-24, 6-25). El 4C y el HSD se hacen acostado. Usa el rear lunge modificado (paso más corto) hasta que el tobillo permita más (6-132).']},
 foot:{t:['Foot / heel','Pie / talón'],ic:'👣',p:['B-10'],drills:['4C','HSD','RD'],mods:['rd_lunge','rd_ef'],
  why:['FM 7-22: limit weight bearing with cycle ergometers or pool work (6-24, 6-25); 4C and HSD are done lying down. In the flex position of extend and flex the heels go toward the ground, which stretches the calves (6-111) — use the modified version if it hurts.',
       'FM 7-22: limita el peso con bicicleta estática o alberca (6-24, 6-25); el 4C y el HSD se hacen acostado. En la posición "flex" del extend and flex los talones bajan al suelo y estiran las pantorrillas (6-111) — usa la versión modificada si duele.']}
};
function exRegFor(id){for(const k in EX_REG)if(EX_REG[k].p.includes(id))return k;return '';}
