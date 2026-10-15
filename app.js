/* =========================================================
   DATA
========================================================= */
const F = (id, tag, name, ask, opts, cfg={}) => Object.assign({id,tag,name,ask,opts},cfg);
// cfg: multi (default true), prefix, joiner, custom placeholder, deny:[...], denyPrefix

const TPLS = [
{
 id:'msk', icon:'🩺', title:'Pain / MSK',
 ccOpts:['back pain','neck pain','shoulder pain','elbow pain','wrist pain','hand pain','hip pain','groin pain','knee pain','shin splints','ankle pain','foot pain','heel pain','muscle soreness','numbness/tingling'],
 fields:[
  F('o','O','Onset','"When did this start?"',['today','yesterday','2–3d ago','1 week ago','after PT','after ruck','after lifting','after field','after sports','after a fall'],{prefix:'Started '}),
  F('pw','P','Provocation','"What makes it worse?"',['movement','ruck','running','jumping','standing','sitting','lifting','bending'],{prefix:'Worse w/ '}),
  F('pb','P','Palliation','"What makes it better?"',['rest','ice','heat','stretching','OTC meds','brace','compression'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"How would you describe the pain?"',['sharp','dull','throbbing','stabbing','burning','cramping','aching','tight','shooting','pressure']),
  F('r','R','Side / Location','"Which side? Point with one finger."',['right','left','bilateral','midline'],{prefix:'Localized to '}),
  F('rr','R','Radiation','"Does it go anywhere else?"',['no radiation','down back of leg','down front of thigh','below the knee','arm','into hand/fingers','groin','up to head/neck','into foot/toes'],{prefix:'Radiates to ',noRadFirst:true}),
  F('t','T','Time','"Constant or comes and goes? Getting better or worse?"',['constant','intermittent','worse AM','worse PM','after activity','only during activity','only at rest','wakes me at night','getting worse','getting better','same since onset']),
  F('sx','S','Signs/Symptoms','"Any other symptoms?"',['stiffness','spasms','swelling','↓ ROM','headache','tenderness','clicking'],{prefix:'Reports ',deny:['numbness','tingling','weakness','paralysis','bowel/bladder loss','dizziness']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds, supplements, pre-workout?"',['none'],{prefix:'',groups:[
   {g:'💊 OTC',opts:['Tylenol','Motrin/ibuprofen','aspirin','Claritin/Zyrtec','Benadryl','antacids (Tums/Maalox)','Pepto','melatonin','cough/cold meds']},
   {g:'💪 Supplements',opts:['multivitamin','protein powder','creatine','pre-workout','energy drinks','fish oil','caffeine pills','fat burners','testosterone booster']},
   {g:'📋 Prescription',opts:['antibiotic (current)','SSRI/antidepressant','ADHD med','birth control','inhaler (albuterol)','BP med','isotretinoin (Accutane)','prescription pain med']}
  ]}),
  F('phx','P','Past hx','"Have you had this before? Any old injuries?"',['no relevant hx','similar episode before'],{groups:[
   {g:'🦴 Prior injuries',opts:['prior fracture','prior sprain (same joint)','prior dislocation','surgery (same area)','stress fracture hx','prior profile (same issue)']},
   {g:'📋 Conditions',opts:['hx back pain','hx sciatica','hx migraines','hx arthritis','hx TBI/concussion','hx shoulder issues','hx knee/ankle injury']}
  ]}),
  F('l','L','Last intake','"Last time you ate or drank? Tolerated it?"',['ate chow, tolerating PO','normal PO intake','↓ PO intake','fluids only'],{multi:false}),
  F('e','E','Events','"What were you doing before?"',['after PT','after ruck','lifting','sports','duty shift','field training','at rest']),
  F('exam','EX','Exam / Objective','What YOU observe on screening',['no deformity','no swelling','no bruising','neuro intact distal','gait normal','antalgic gait'],{prefix:''})
 ],
 ccExtras:{
  'knee pain':{r:['anterior (front)','posterior (back of knee)','medial (inner)','lateral (outer)','patella','tibial tuberosity (below kneecap)'],pw:['flexion','extension','squatting','kneeling','stairs (up/down)','pivoting/twisting','weight bearing','prolonged sitting'],pb:['knee sleeve','unloading weight'],sx:['effusion','locking','giving way/instability','popping'],exam:['TTP patellar tendon','TTP tibial tuberosity','TTP joint line','no effusion','effusion present','ROM full','ROM limited by pain','stable varus/valgus','neg ant/post drawer','pain w/ resisted extension']},
  'ankle pain':{r:['lateral ankle (outer)','medial ankle (inner)','achilles','top of foot'],pw:['inversion','eversion','dorsiflexion','plantarflexion','weight bearing','uneven ground'],sx:['lateral swelling','bruising','instability'],exam:['TTP lateral malleolus','TTP ATFL','no bony TTP (Ottawa neg)','able to bear weight x4 steps','unable to bear weight','ROM limited','swelling present']},
  'back pain':{r:['lumbar (low back)','thoracic (mid back)','paraspinal (side of spine)','midline (over spine)','SI / buttock'],pw:['flexion (bending fwd)','extension (leaning back)','rotation','prolonged sitting','prolonged standing','cough/sneeze','getting out of bed'],pb:['position change','walking'],sx:['radicular sx to leg','paraspinal spasm'],exam:['TTP paraspinal muscles','no midline TTP','ROM limited by pain','neg SLR bilat','pos SLR','neuro intact LE']},
  'neck pain':{r:['posterior neck','trapezius','side of neck','base of skull'],pw:['rotation','flexion','extension','looking down (phone/screen)','wearing kevlar/gear'],exam:['TTP trapezius','no midline C-spine TTP','ROM limited rotation','neuro intact UE']},
  'shoulder pain':{r:['anterior shoulder','lateral (deltoid)','posterior','AC joint (top)'],pw:['overhead movement','reaching behind back','push-ups','sleeping on that side'],sx:['weakness overhead','clicking'],exam:['TTP rotator cuff/deltoid','ROM limited abduction','painful arc 60–120°','neg empty can','strength 5/5','neg apprehension']},
  'hip pain':{r:['groin (anterior)','lateral (trochanter)','buttock (posterior)'],pw:['flexion','internal rotation','crossing legs','prolonged sitting'],exam:['TTP greater trochanter','ROM limited IR','neg FABER','neg log roll']},
  'shin splints':{r:['medial shin (inner)','anterior shin (front)'],pw:['running','jumping','hard surface','new boots','increased mileage'],exam:['TTP medial tibia diffuse','no focal point tenderness','no swelling','pain w/ resisted dorsiflexion']},
  'muscle soreness':{pw:['after new workout'],sx:['DOMS 24–48h post-workout'],exam:['TTP muscle belly','ROM full','no swelling']},
  'elbow pain':{r:['lateral epicondyle (outer)','medial epicondyle (inner)','olecranon (tip)'],pw:['gripping','lifting','push-ups','typing'],exam:['TTP lateral epicondyle','TTP medial epicondyle','pain w/ resisted wrist extension','ROM full','no swelling']},
  'wrist pain':{r:['radial (thumb side)','ulnar (pinky side)','dorsal (top)','volar (palm side)'],pw:['push-ups','planks','typing','gripping'],exam:['TTP anatomical snuffbox','no snuffbox TTP','ROM full','no swelling','neg Finkelstein']},
  'hand pain':{r:['fingers','knuckles','palm','thumb base'],pw:['gripping','typing','cold exposure'],exam:['ROM full','no swelling','no deformity','cap refill <2s']},
  'foot pain':{r:['heel','arch','ball of foot','top of foot','toes'],pw:['first steps in AM','running','boots','prolonged standing'],exam:['TTP plantar fascia insertion','TTP metatarsals','no deformity','no swelling']},
  'heel pain':{r:['plantar (bottom)','posterior (achilles)'],pw:['first steps in AM','after running','prolonged standing','boots'],exam:['TTP plantar fascia insertion','TTP achilles insertion','no swelling']},
  'groin pain':{r:['inguinal crease','adductor (inner thigh)'],pw:['sit-ups','sprinting','kicking','coughing'],sx:['bulge w/ straining'],exam:['no palpable bulge','bulge w/ Valsalva','TTP adductor origin']},
  'numbness/tingling':{r:['hand/fingers','foot/toes','arm','leg','one side of body'],pw:['prolonged sitting','sleeping position','repetitive motion','wearing gear'],exam:['sensation intact to light touch','↓ sensation (note where below)','strength 5/5','strength ↓']}
 },
 ccAsk:{
  'knee pain':{pw:'"Does it hurt more going up or down stairs, squatting, or kneeling?"',pb:'"Does rest, ice, or a knee sleeve help?"',sx:'"Any swelling? Does it lock up or give way on you?"'},
  'back pain':{pw:'"Worse bending forward, leaning back, or when you cough or sneeze?"',sx:'"Any pain, numbness, or tingling going down your legs?"'},
  'ankle pain':{pw:'"Worse rolling it in or out? Can you put weight on it?"',sx:'"Did it swell up? Any bruising?"'},
  'shoulder pain':{pw:'"Worse reaching overhead, behind your back, or doing push-ups?"'},
  'neck pain':{pw:'"Worse turning your head or looking down at your phone?"'},
  'hip pain':{pw:'"Worse crossing your legs, running, or after sitting a while?"'},
  'shin splints':{pw:'"Worse running on pavement? New boots or more mileage lately?"'},
  'elbow pain':{pw:'"Worse gripping, lifting, or doing push-ups?"'},
  'wrist pain':{pw:'"Worse with push-ups or planks? Did you fall on it?"'},
  'foot pain':{pw:'"Worse with the first steps in the morning or in boots?"'},
  'heel pain':{pw:'"Worse first steps in the morning or after running?"'},
  'groin pain':{pw:'"Worse with sit-ups, sprinting, or when you cough?"'},
  'numbness/tingling':{sx:'"Where exactly? Constant or comes and goes? Any weakness with it?"'}
 },
 fuQ:{
  a:{'NSAIDs (Motrin/Aspirin)':'⚠️ NSAID allergy — do NOT recommend Motrin, Aspirin or Pepto-Bismol (salicylate). Use Tylenol 325 mg x2 tabs (650 mg) PO q6h for pain/fever (max 2,600 mg/24h).'},
  rr:{'leg':'"Any numbness, tingling, or weakness in that leg? Any problems controlling bowel or bladder?" — red flag screen','arm':'"Any numbness, tingling, or weakness in that arm or hand?" — red flag screen'},
  sx:{'giving way/instability':'"Has it fully buckled on you? Did you hear or feel a pop when it happened?"','locking':'"Does it get stuck? Can you fully straighten the knee right now?"','effusion':'"Did it swell right away or the next day?" (immediate = suspect intra-articular)','radicular sx to leg':'"How far down does it go — past the knee? Any numbness or weakness?"'},
  pw:{'weight bearing':'"Can you take 4 steps on it right now?" — Ottawa: if unable + bony TTP → evaluate for possible fx','cough/sneeze':'"Does the pain shoot down a leg when you cough?" (radicular sign)'},
  exam:{'TTP anatomical snuffbox':'⚠️ Snuffbox TTP after a fall = scaphoid until proven otherwise → refer for imaging (initial X-ray can be normal)','bulge w/ Valsalva':'Possible inguinal hernia → refer to provider; avoid heavy lifting meanwhile'}
 },
 plan:[
  'Motrin (ibuprofen) 200 mg tabs: 2 tabs (400 mg) PO q6h PRN pain/swelling, w/ food; max 1,600 mg/24h (ADTMC) — Mendoza Pharmacy',
  'Tylenol (acetaminophen) 325 mg tabs: 2 tabs (650 mg) PO q6h PRN pain — Mendoza Pharmacy',
  'Ice/heat, RICE protocol, stretching, hydration',
  'H2F: recommend referral to H2F — running/gait instruction, strengthening of weak muscle groups, injury-prevention classes (no red flags)'
 ],
 er:'ER if: neuro deficits, bowel/bladder loss, sudden severe HA.',
 redFlags:['numbness/weakness in limb','bowel/bladder loss','saddle anesthesia','sudden worst-ever HA','fever w/ back pain','night pain / weight loss','unable to bear weight + bony TTP','obvious deformity','significant trauma mechanism'],
 dispo:{
  'RTD':'RTD — cleared for full duty, may continue OTC meds and conservative care.',
  'Light Duty':'RTD w/ restrictions: no ruck x48h, no lifting >20 lbs x48h, no running/jumping x48h.',
  'H2F Referral':'RTD — no red flags. Recommend referral to H2F (Holistic Health and Fitness) for running/gait instruction, strengthening of weak muscle groups, and injury-prevention classes. Continue conservative care (OTC, ice/heat, stretching). Re-eval at sick call if worsening or no improvement.',
  'Light Duty + H2F':'RTD w/ restrictions: no ruck, no lifting >20 lbs, no running/jumping x48h. Then recommend referral to H2F for strengthening of weak muscle groups and return-to-run progression. Re-eval at sick call if worsening.',
  'Quarters 24h':'Recommend quarters x24h for recovery (pending CoC/provider approval). Hydration, OTC meds, re-eval if not improved.',
  'Referral':'Referral to provider for eval of persistent pain >1w / recurrent injury.'
 }
},
{
 id:'ha', icon:'🤕', title:'Headache / Migraine',
 ccOpts:['tension headache','migraine','sinus-type HA','post-concussion HA','dehydration HA','caffeine-withdrawal HA','HA unspecified'],
 fields:[
  F('o','O','Onset','"When did it start? Sudden or gradual?"',['today','yesterday','2–3d','recurring for weeks','gradual onset','sudden onset','after PT','after field','after poor sleep','after hitting head'],{prefix:'Started '}),
  F('pw','P','Provocation','"What makes it worse?"',['light (photophobia)','noise (phonophobia)','screen time','movement/bending','coughing/straining','stress','lack of sleep','dehydration','lying down'],{prefix:'Worse w/ '}),
  F('pb','P','Palliation','"What makes it better?"',['dark quiet room','sleep','caffeine','OTC meds','hydration','massage/pressure'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"What does it feel like?"',['pressure / band-like','throbbing / pulsating','stabbing','dull','pressure behind eyes']),
  F('r','R','Location','"Where exactly is it?"',['frontal','temporal','occipital (back)','behind eye','whole head','one-sided (right)','one-sided (left)','band around head'],{prefix:'Localized to '}),
  F('rr','R','Radiation','"Does it spread anywhere?"',['no radiation','to neck','to shoulder','behind eye','to jaw'],{prefix:'Radiates ',noRadFirst:true}),
  F('t','T','Time','"Constant or comes and goes? How long do they last?"',['constant','intermittent','worse AM','worse PM','lasts hours','lasts all day','recurrent episodes','getting worse','getting better']),
  F('sx','S','Signs/Symptoms','"Any nausea, aura, or vision changes?"',['nausea','vomiting','aura before HA','light sensitivity','sound sensitivity','neck tightness','dizziness','watery eye / congestion'],{prefix:'Reports ',deny:['vision loss','weakness/numbness','speech changes','confusion','fever','stiff neck']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds, supplements, pre-workout?"',['none'],{prefix:'',groups:[
   {g:'💊 OTC',opts:['Tylenol','Motrin/ibuprofen','aspirin','Claritin/Zyrtec','Benadryl','antacids (Tums/Maalox)','Pepto','melatonin','cough/cold meds']},
   {g:'💪 Supplements',opts:['multivitamin','protein powder','creatine','pre-workout','energy drinks','fish oil','caffeine pills','fat burners','testosterone booster']},
   {g:'📋 Prescription',opts:['antibiotic (current)','SSRI/antidepressant','ADHD med','birth control','inhaler (albuterol)','BP med','isotretinoin (Accutane)','prescription pain med']}
  ]}),
  F('phx','P','Past hx','"Do you get headaches often? Ever hit your head hard?"',['no hx','similar HAs before'],{groups:[
   {g:'🤕 Prior HA',opts:['hx migraines','hx tension HA','dx by provider before','prior migraine med']},
   {g:'📋 Related',opts:['hx concussion/TBI','hx sinus infections','needs vision check / wears glasses','high caffeine intake','recently cut caffeine']}
  ]}),
  F('l','L','Last intake','"When did you last eat and drink? Caffeine today?"',['ate chow, hydrated','↓ fluid intake today','skipped meals','usual caffeine user — none today','energy drinks today'],{prefix:''}),
  F('e','E','Events','"What was happening before it started?"',['after PT in heat','after field','poor sleep / CQ','long screen time','stress','hit head / fall','ruck w/ kevlar','no clear trigger']),
  F('exam','EX','Exam / Objective','Neuro screening — what YOU observe',['alert & oriented x4','neuro intact','PERRL','no focal deficits','neck supple','no midline C-spine TTP','gait steady','TTP trapezius/suboccipital'],{prefix:''})
 ],
 ccAsk:{
  'migraine':{sx:'"Any aura — lights, zigzags, blind spots before it starts? Nausea?"',pw:'"Does light or noise make it worse? Can you function or do you need to lie down?"'},
  'tension headache':{pw:'"Worse with stress or long hours at a screen? Feel like a band around your head?"'},
  'sinus-type HA':{pw:'"Worse bending forward? Pressure in your face or teeth?"'},
  'post-concussion HA':{o:'"When did you hit your head? Were you dazed or knocked out?"',sx:'"Any fogginess, memory problems, or balance issues since?"'},
  'dehydration HA':{l:'"How much water today? Were you at PT or in the heat?"'},
  'caffeine-withdrawal HA':{l:'"How much caffeine do you normally drink? Skipped it today?"'}
 },
 ccExtras:{
  'migraine':{sx:['aura (visual)','one-sided throbbing','worse w/ routine activity','needs to lie down'],pb:['dark room','sleep']},
  'tension headache':{r:['band around head','suboccipital'],pw:['posture / screen time','clenching jaw'],exam:['TTP trapezius/suboccipital','TTP temporalis']},
  'sinus-type HA':{r:['frontal','maxillary (cheeks)'],pw:['bending forward'],sx:['congestion','post-nasal drip'],exam:['sinus TTP frontal/maxillary','no sinus TTP']},
  'post-concussion HA':{sx:['foggy / slow thinking','balance problems','memory issues','irritability','sleep changes'],exam:['balance normal','balance abnormal','recall intact','recall impaired']},
  'dehydration HA':{sx:['dark urine','dry mouth','dizzy standing'],exam:['mucous membranes moist','mucous membranes dry']}
 },
 fuQ:{
  sx:{'aura before HA':'"Describe the aura — lights, zigzag lines, blind spots? Does the HA always follow it?" — document the pattern; migraine w/ aura matters to the provider (and estrogen contraindications)','vomiting':'"Keeping fluids down? How many times?" — persistent vomiting with HA → provider today'},
  e:{'hit head / fall':'⚠️ Post-trauma HA → concussion screening: "Knocked out or dazed? Memory gaps? Worsening HA or repeated vomiting?" → any positive = provider TODAY, no RTD'},
  o:{'sudden onset':'⚠️ "Did it hit maximum pain within seconds — like a thunderclap?" → if yes = ER, not sick call'}
 },
 plan:[
  'Tylenol (acetaminophen) 325 mg tabs: 2 tabs (650 mg) PO q6h PRN HA — Mendoza Pharmacy',
  'Motrin (ibuprofen) 200 mg tabs: 2 tabs (400 mg) PO q6h PRN HA, w/ food; max 1,600 mg/24h (ADTMC) — Mendoza Pharmacy',
  'Hydration 1–2 L, dark quiet room, limit screen time',
  'Caffeine if withdrawal; otherwise avoid excess',
  'Recurrent HAs / migraine: refer to provider for management — not OTC alone'
 ],
 er:'ER if: thunderclap (worst HA of life, sudden), fever + stiff neck, new neuro deficit, persistent vomiting, HA that wakes from sleep and worsens lying down.',
 redFlags:['thunderclap / worst HA of life','fever + stiff neck','new neuro deficit (weakness/vision/speech)','HA after head trauma + LOC or vomiting','wakes from sleep / worse lying down','first severe HA ever','worsening pattern over days'],
 dispo:{
  'RTD':'RTD — cleared for duty, recommend OTC meds, hydration, rest.',
  'Light Duty':'RTD w/ restrictions: no PT x24h, limit screen time, hydration.',
  'Quarters 24h':'Recommend quarters x24h in dark/quiet environment (pending CoC/provider approval). OTC meds, hydration, re-eval if not improved.',
  'Referral':'Referral to provider — recurrent HAs / migraine management / post-concussion eval.'
 }
},
{
 id:'ill', icon:'🤒', title:'General illness',
 ccOpts:['sore throat','cough','congestion','runny nose','fever','chills','body aches','fatigue','dizziness','nausea','vomiting','diarrhea','constipation','bloating','heartburn','abd pain','loss of appetite','night sweats','swollen glands'],
 fields:[
  F('o','O','Onset','"When did this start?"',['x hours','x1d','x2–3d','x1w','>1w'],{prefix:'Symptoms ',multi:false}),
  F('pw','P','Worse','"What makes it worse?"',['AM','PM','after chow','cold exposure','after PT'],{prefix:'Worse '}),
  F('pb','P','Better','"What makes it better?"',['rest','fluids','OTC','sleep','hot shower'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"How does it feel?"',['scratchy throat','sinus pressure','burning chest','abd cramps','nausea','bloating','fatigue','chills']),
  F('r','R','Region','"Where do you feel it?"',['throat','chest','sinuses','abdomen','head'],{prefix:'Localized to '}),
  F('t','T','Time','"Constant or comes and goes?"',['constant','intermittent','worse AM','worse PM','episodic','worsening','improving']),
  F('sx','S','Signs/Symptoms','"Any other symptoms? Fever?"',['fever','chills','productive cough','dry cough','congestion','myalgia','↓ appetite','loose stools'],{prefix:'Reports ',deny:['SOB','CP','bloody stool','stiff neck','severe dehydration']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds, supplements, pre-workout?"',['none'],{prefix:'',groups:[
   {g:'💊 OTC',opts:['Tylenol','Motrin/ibuprofen','aspirin','Claritin/Zyrtec','Benadryl','antacids (Tums/Maalox)','Pepto','melatonin','cough/cold meds']},
   {g:'💪 Supplements',opts:['multivitamin','protein powder','creatine','pre-workout','energy drinks','fish oil','caffeine pills','fat burners','testosterone booster']},
   {g:'📋 Prescription',opts:['antibiotic (current)','SSRI/antidepressant','ADHD med','birth control','inhaler (albuterol)','BP med','isotretinoin (Accutane)','prescription pain med']}
  ]}),
  F('phx','P','Past hx','"Any medical problems I should know about?"',['no relevant hx','similar episode before'],{groups:[
   {g:'🫁 Respiratory',opts:['hx asthma','hx bronchitis','hx pneumonia','smoker/vaper']},
   {g:'🫃 GI',opts:['hx GERD','hx IBS','hx ulcers','lactose intolerance','hx food poisoning']},
   {g:'📋 General',opts:['hx seasonal allergies','hx diabetes','hx HTN','hx thyroid','hx anemia','hx kidney stones']}
  ]}),
  F('l','L','Last intake','"Last time you ate/drank? Tolerated?"',['ate chow, tolerating PO','fluids only','↓ PO intake','not tolerating PO'],{multi:false}),
  F('e','E','Events','"Sick contacts? Exposure?"',['sick contacts in unit','cold exposure','field training','recent travel','after long duty','no clear trigger']),
  F('exam','EX','Exam / Objective','What YOU observe',['alert, no acute distress','afebrile','lungs CTA bilat','abd soft, nontender','mucous membranes moist'],{prefix:''})
 ],
 ccExtras:{
  'sore throat':{pw:['swallowing','talking'],sx:['swollen glands','white patches','hoarse voice'],exam:['pharyngeal erythema','no exudates','exudates present','tender cervical nodes']},
  'cough':{pw:['lying down','at night','cold air','talking'],sx:['productive (clear/yellow/green)','dry cough','post-nasal drip'],exam:['no wheezing','wheezing present','no respiratory distress']},
  'congestion':{pw:['lying down','mornings'],sx:['sinus pressure','post-nasal drip','sneezing','itchy eyes'],exam:['sinus TTP frontal/maxillary','no sinus TTP']},
  'runny nose':{sx:['clear discharge','sneezing','itchy eyes']},
  'fever':{sx:['sweats','myalgia'],exam:['febrile','afebrile after antipyretic']},
  'chills':{sx:['sweats','myalgia'],exam:['febrile']},
  'diarrhea':{pw:['movement','pressure on abdomen','after eating','dairy','MRE'],sx:['watery stools','cramping before BM','x__ episodes/day (note below)'],exam:['abd soft, nontender','hyperactive bowel sounds','no rebound/guarding','no signs of dehydration','mild dehydration']},
  'vomiting':{pw:['movement','after eating','smells'],pb:['small sips','bland food'],sx:['unable to keep fluids','keeping fluids down','x__ episodes (note below)'],exam:['abd soft, nontender','no rebound/guarding','mild dehydration']},
  'nausea':{pw:['movement','after eating','smells','pressure on abdomen'],pb:['small sips','bland food','fresh air'],exam:['abd soft, nontender','no rebound/guarding']},
  'constipation':{pw:['low fluid intake','MRE diet'],sx:['last BM x__ days ago (note below)','straining','hard stools'],exam:['abd soft','mild distension','bowel sounds present']},
  'bloating':{pw:['after chow','pressure on abdomen','carbonated drinks'],pb:['burping','passing gas'],exam:['abd soft','mild distension','tympanic to percussion']},
  'heartburn':{pw:['after chow','spicy food','caffeine','lying down after eating'],pb:['antacid','sitting upright'],sx:['burping','acid taste','regurgitation'],exam:['epigastric TTP mild','no rebound/guarding']},
  'dizziness':{pw:['standing up fast','head movement','dehydration'],sx:['lightheaded','room spinning (vertigo)','near-syncope'],exam:['no nystagmus','steady gait','neuro intact']},
  'fatigue':{pw:['poor sleep','high op tempo'],sx:['daytime sleepiness','↓ motivation']},
  'body aches':{sx:['diffuse myalgia','worse w/ movement']},
  'abd pain':{r:['epigastric (upper middle)','RUQ (upper right)','LUQ (upper left)','RLQ (lower right)','LLQ (lower left)','periumbilical','diffuse'],pw:['movement','pressure on abdomen','after eating','deep breath','cough'],pb:['staying still','bland food','antacid'],exam:['abd soft, nontender','TTP (mark quadrant in R)','no rebound/guarding','rebound/guarding present','bowel sounds normal'],sx:['nausea','↓ appetite','fever','bloating']},
  'loss of appetite':{sx:['weight loss','nausea','early fullness','stress-related']},
  'night sweats':{sx:['soaking sheets','w/ fever','w/ weight loss','w/ cough']},
  'swollen glands':{r:['neck','under jaw','armpit','groin'],sx:['tender','non-tender','w/ sore throat','w/ fever'],exam:['tender mobile nodes <1cm','nodes >1cm','non-tender fixed node']}
 },
 ccAsk:{
  'sore throat':{pw:'"Does it hurt more when you swallow? Solids, liquids, or both?"'},
  'cough':{pw:'"Worse lying down or at night?"',sx:'"Are you bringing anything up? What color?"'},
  'congestion':{pw:'"Worse lying down? Any pressure in your face or teeth?"'},
  'fever':{sx:'"Did you measure it? How high did it get?"'},
  'diarrhea':{pw:'"Worse after eating? Does it hurt when you press on your stomach?"',sx:'"How many episodes today? Watery or formed?"'},
  'vomiting':{pw:'"Worse with movement or after eating?"',sx:'"Are you keeping any fluids down?"'},
  'nausea':{pw:'"Worse with movement, smells, or after eating? Does pressing on your stomach bother you?"'},
  'heartburn':{pw:'"Worse after eating, with spicy food, or lying down after chow?"'},
  'constipation':{sx:'"When was your last BM? Hard or straining?"'},
  'dizziness':{pw:'"Worse standing up fast or moving your head?"',sx:'"Lightheaded, or does the room actually spin?"'},
  'fatigue':{pw:'"How have you been sleeping? Lots of duty or field time lately?"'},
  'abd pain':{pw:'"Worse with movement, pressing on it, eating, or taking a deep breath?"',r:'"Point with one finger where it hurts the most."'},
  'night sweats':{sx:'"Soaking the sheets? Any fever, cough, or weight loss with it?"'},
  'swollen glands':{sx:'"Tender when you touch them? Any sore throat or fever?"'}
 },
 fuQ:{
  a:{'NSAIDs (Motrin/Aspirin)':'⚠️ NSAID allergy — do NOT recommend Motrin, Aspirin or Pepto-Bismol (salicylate). Use Tylenol 325 mg x2 tabs (650 mg) PO q6h for pain/fever (max 2,600 mg/24h).'},
  sx:{'fever':'"Did you measure it? How high? Did you take anything for it?"','productive (clear/yellow/green)':'"Any blood in it? Short of breath walking or climbing stairs?"','unable to keep fluids':'"When did you last keep fluids down? Are you peeing a normal amount?" — dehydration screening','watery stools':'"Any blood or black tar-looking stools? Anyone else in the unit sick? DFAC or MRE?"','loose stools':'"Any blood in the stool? How many today?"'},
  pw:{'pressure on abdomen':'On exam: palpate gently first, away from the pain. Rebound? Guarding? → if present, escalate to provider.'},
  r:{'RLQ (lower right)':'"Did the pain start around your belly button and then move to the lower right? Any fever or loss of appetite?" — appendicitis screening → if yes, provider/ER TODAY'},
  exam:{'rebound/guarding present':'⚠️ Rebound/guarding = surgical abdomen until proven otherwise → provider/ER, NPO, no masking analgesics','non-tender fixed node':'Fixed non-tender node + systemic sx (sweats, weight loss) → refer to provider, not OTC management'}
 },
 plan:[
  'Tylenol (acetaminophen) 325 mg tabs: 2 tabs (650 mg) PO q6h PRN fever/pain — Mendoza Pharmacy',
  'Motrin (ibuprofen) 200 mg tabs: 2 tabs (400 mg) PO q6h PRN fever/aches, w/ food; max 1,600 mg/24h (ADTMC) — Mendoza Pharmacy',
  'Claritin (loratadine) 10 mg tab PO daily — Mendoza Pharmacy',
  'Zyrtec (cetirizine) 10 mg tab PO daily — Mendoza Pharmacy',
  'Allegra (fexofenadine) 180 mg tab PO daily w/ water — Mendoza Pharmacy',
  'Benadryl (diphenhydramine) 25 mg tabs: 1–2 tabs PO q6h PRN runny nose/itch (⚠️ sedating) — Mendoza Pharmacy',
  'Flonase (fluticasone) 50 mcg/spray: 2 sprays each nostril daily — Mendoza Pharmacy',
  'Sudafed (pseudoephedrine) 30 mg tabs: 2 tabs (60 mg) PO q4–6h PRN congestion, max 8 tabs/24h (⚠️ avoid HTN) — Mendoza Pharmacy',
  'Actifed (pseudoephedrine/triprolidine) tab PO q4–6h PRN, dose per box (⚠️ sedating, avoid HTN) — Mendoza Pharmacy',
  'Afrin (oxymetazoline) 0.05% nasal spray: 2–3 sprays each nostril q10–12h PRN, max 3 days — Mendoza Pharmacy',
  'Saline 0.65% nasal spray: 2 sprays each nostril PRN — Mendoza Pharmacy',
  'Cepacol (benzocaine/menthol) lozenge: dissolve 1 slowly q2h PRN sore throat — Mendoza Pharmacy',
  'Robitussin (guaifenesin) 100 mg/5 mL: 10–20 mL PO q4h PRN chest congestion — Mendoza Pharmacy',
  'Robitussin DM (guaifenesin/dextromethorphan) 100 mg-10 mg/5 mL: 10–20 mL PO q4h PRN cough — Mendoza Pharmacy',
  'Pepto (bismuth subsalicylate) 262 mg tabs: 2 tabs (524 mg) PO q30–60 min PRN diarrhea/nausea, max 8 doses/24h — Mendoza Pharmacy',
  'Maalox ES oral liquid: 10–20 mL PO QID PRN indigestion (after meals/HS) — Mendoza Pharmacy',
  'Colace (docusate) 100 mg caps: 1 cap PO BID PRN constipation — Mendoza Pharmacy',
  'Simethicone 40 mg/0.6 mL drops: 1.2 mL (80 mg) PO q6h PRN bloating — Mendoza Pharmacy',
  'Vitamin D3 (cholecalciferol) 25 mcg tab PO daily (supplement) — Mendoza Pharmacy',
  'Hydration, BRAT diet (GI), hygiene, rest'
 ],
 er:'ER if: SOB, CP, altered mental status, severe dehydration, bloody stool, persistent high fever.',
 redFlags:['SOB / respiratory distress','chest pain','altered mental status','severe dehydration (no urine, dizzy)','bloody / black tarry stool','fever >103°F','stiff neck + fever','severe abd pain w/ guarding'],
 dispo:{
  'RTD':'RTD — cleared for duty, recommend OTC meds and hydration.',
  'Light Duty':'RTD w/ restrictions: no PT x24h, avoid strenuous activity.',
  'Quarters 24h':'Recommend quarters x24h for rest/recovery (pending CoC/provider approval). Hydration, OTC meds, monitor.',
  'Referral':'Referral to provider for symptoms >1w without improvement.'
 }
},
{
 id:'bh', icon:'🧠', title:'Behavioral Health',
 ccOpts:['stress','insomnia','anxiety','panic attacks','↓ mood','irritability','anger issues','nightmares','↓ concentration','↓ appetite','↓ motivation','homesickness','relationship distress','grief'],
 fields:[
  F('o','O','Onset','"When did this start?"',['x days','x weeks','x months'],{prefix:'Symptoms ',multi:false}),
  F('pw','P','Worse','"What makes it worse?"',['stress','PT','family issues','deployment','unit changes'],{prefix:'Worse w/ '}),
  F('pb','P','Better','"What makes it better?"',['exercise','rest','talking','peer support','counseling'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"How do you feel?"',['anxious','racing thoughts','nightmares','depressed mood','irritability','restless','↓ motivation','↓ interest']),
  F('t','T','Time','"Constant or comes and goes?"',['daily','intermittent','worse nights','worse mornings','episodic']),
  F('sx','S','Signs/Symptoms','"Any other symptoms?" ⚠️ ALWAYS ask about SI/HI',['fatigue','↓ concentration','irritability','poor sleep','↓ appetite','low energy','withdrawal'],{prefix:'Reports ',deny:['SI/HI','hallucinations','unsafe behavior']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds?"',['none','Melatonin','OTC sleep aid','energy drinks'],{prefix:''}),
  F('phx','P','Past hx','"Have you dealt with this before? Ever talked to anyone about it?"',['no hx','similar episode before'],{groups:[
   {g:'🧠 Prior BH',opts:['hx anxiety','hx depression','hx PTSD','hx ADHD','hx sleep problems','prior BH treatment','prior counseling/chaplain']},
   {g:'👪 Context',opts:['family hx BH conditions','similar during deployment']}
  ]}),
  F('l','L','Last intake','"Eating normally? Caffeine or energy drinks today?"',['eating normally','↓ appetite/intake','skipping meals','energy drinks today','caffeine late in day'],{prefix:''}),
  F('e','E','Events','"What was happening before?"',['family stress','relationship issues','deployment','unit conflict','relocation','financial stress']),
  F('exam','EX','Exam / Objective','What YOU observe',['alert & oriented x4','calm, cooperative','no acute distress','denies SI/HI on direct questioning','normal speech','good eye contact'],{prefix:''})
 ],
 ccExtras:{
  'insomnia':{pw:['screen time at night','caffeine/energy drinks','CQ/staff duty rotations','noise in barracks'],sx:['difficulty falling asleep','waking during night','early waking','daytime sleepiness']},
  'anxiety':{sx:['palpitations','chest tightness','sweating','restlessness','muscle tension']},
  'panic attacks':{sx:['palpitations','SOB sensation','trembling','fear of losing control','episodes x__ min (note below)']},
  'nightmares':{sx:['waking in sweat','trouble returning to sleep','recurring theme']},
  'stress':{pw:['upcoming board/ACFT','financial pressure','family separation']},
  'anger issues':{pw:['sleep deprivation','alcohol','specific person/situation'],sx:['short fuse','outbursts','regret afterward','punching things']},
  'homesickness':{sx:['calls home often','worse evenings/weekends','first duty station','↓ mood']},
  'relationship distress':{sx:['long distance strain','recent argument','considering separation','affecting sleep/focus']},
  'grief':{sx:['recent loss','waves of sadness','trouble sleeping','functioning OK at work','not functioning at work']}
 },
 ccAsk:{
  'insomnia':{pw:'"Whats keeping you up — screens, energy drinks, CQ rotations, noise in the barracks?"',sx:'"Trouble falling asleep, staying asleep, or waking up too early?"'},
  'anxiety':{sx:'"When it hits, what do you feel in your body — racing heart, chest tightness, sweating?"'},
  'panic attacks':{sx:'"How long do the episodes last? What happens in your body during one?"'},
  'nightmares':{sx:'"Same theme each time? Can you get back to sleep after?"'},
  'stress':{pw:'"Whats driving it most right now — work, family, money, something coming up?"'},
  '↓ mood':{sx:'"How long has your mood been down? Still enjoying things you used to?"'},
  'anger issues':{sx:'"What sets it off? What do you do when it hits — walk away, punch things?"'},
  'homesickness':{sx:'"First time away from home this long? When does it hit hardest?"'},
  'grief':{sx:'"Who did you lose, if you want to share? How are you sleeping and eating?"'}
 },
 fuQ:{
  a:{'NSAIDs (Motrin/Aspirin)':'⚠️ NSAID allergy — do NOT recommend Motrin, Aspirin or Pepto-Bismol (salicylate). Use Tylenol 325 mg x2 tabs (650 mg) PO q6h for pain/fever (max 2,600 mg/24h).'},
  sx:{'palpitations':'"Does it ever happen at rest? Any chest pain with it?" — if CP at rest, evaluate before assuming anxiety','poor sleep':'"How many hours are you actually getting? Whats your duty schedule been?"','withdrawal':'"Who do you usually talk to? Have you pulled back from them too?"'}
 },
 plan:[
  'Sleep hygiene, stress management, PT/exercise, peer support',
  'Melatonin 3–5 mg PO HS PRN insomnia (⚠️ not on the pharmacy list or in the ADTMC — only if on local formulary)',
  'Encourage talking w/ NCO, CoC, chaplain, or BH clinic'
 ],
 er:'⚠️ IMMEDIATE referral/escort to BH or ER if: SI/HI, hallucinations, unsafe behavior, acute crisis. Do not let them leave alone.',
 redFlags:['SI (suicidal ideation)','HI (homicidal ideation)','hallucinations','plan or means for self-harm','unsafe behavior','acute intoxication','recent loss + hopelessness'],
 dispo:{
  'RTD':'RTD — cleared for duty, recommend sleep hygiene and stress management (melatonin only if available per local formulary — not on the pharmacy list).',
  'Light Duty':'RTD w/ restrictions: no PT x24h, encourage rest and BH support.',
  'Quarters 24h':'Recommend quarters x24h for rest/recovery (pending CoC/provider approval). Re-eval if no improvement.',
  'Referral BH':'Referral to BH for further evaluation of persistent insomnia/anxiety.'
 }
},
{
 id:'skin', icon:'🌡️', title:'Skin / Rash / Allergy',
 ccOpts:['rash','itching','hives','redness','swelling','insect bite','blister','athletes foot','jock itch','razor bumps (PFB)','ingrown nail','sunburn','dry skin','acne flare','wart','irritation','burning sensation'],
 fields:[
  F('o','O','Onset','"When did this start?"',['today','yesterday','2–3d','1w','after PT','after field','new soap/detergent','new lotion','after chow'],{prefix:'Started '}),
  F('pw','P','Worse','"What makes it worse?"',['heat','sweat','friction','scratching','sun','uniform'],{prefix:'Worse w/ '}),
  F('pb','P','Better','"What makes it better?"',['cool air','shower','antihistamine','cream'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"How does it feel?"',['itchy','painful','burning','tingling','tight','blistering','oozing','dry']),
  F('r','R','Region','"Where is it? One side or both?"',['right side','left side','bilateral','arm','leg','hands','feet','back','chest','neck','face','scalp','groin','buttocks'],{prefix:'Localized to '}),
  F('rr','R','Spread','"Does it spread?"',['no spread','other areas','whole body'],{prefix:'Spread: ',multi:false}),
  F('t','T','Time','"Constant or comes and goes?"',['constant','intermittent','worse at night','worse after PT','worse after chow']),
  F('sx','S','Signs/Symptoms','"Any other symptoms?" ⚠️ rule out anaphylaxis',['redness','itching','swelling','hives','burning','blister'],{prefix:'Reports ',deny:['SOB','CP','tongue/lip swelling','wheezing','dizziness']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds, supplements, pre-workout?"',['none'],{prefix:'',groups:[
   {g:'💊 OTC',opts:['Tylenol','Motrin/ibuprofen','aspirin','Claritin/Zyrtec','Benadryl','antacids (Tums/Maalox)','Pepto','melatonin','cough/cold meds']},
   {g:'💪 Supplements',opts:['multivitamin','protein powder','creatine','pre-workout','energy drinks','fish oil','caffeine pills','fat burners','testosterone booster']},
   {g:'📋 Prescription',opts:['antibiotic (current)','SSRI/antidepressant','ADHD med','birth control','inhaler (albuterol)','BP med','isotretinoin (Accutane)','prescription pain med']}
  ]}),
  F('phx','P','Past hx','"Any skin conditions before?"',['no hx','similar episode before'],{groups:[
   {g:'🧴 Skin',opts:['hx eczema','hx psoriasis','hx hives','hx acne','isotretinoin (Accutane) hx','hx fungal infections','sensitive skin']},
   {g:'🌿 Allergic',opts:['hx seasonal allergies','hx asthma','prior allergic reactions']}
  ]}),
  F('l','L','Last intake','"Last time you ate or drank? Tolerated it?"',['ate chow, tolerating PO','normal PO intake','↓ PO intake','fluids only'],{multi:false}),
  F('e','E','Events','"What were you doing before?"',['after PT','field training','insect bite','contact w/ grass/dirt','detergent exposure','after chow']),
  F('exam','EX','Exam / Objective','What YOU observe',['localized','no streaking','no warmth/induration','no signs of infection','no mucosal involvement'],{prefix:''})
 ],
 ccExtras:{
  'rash':{exam:['maculopapular','erythematous','raised','dry/flaky','no vesicles','well-demarcated','diffuse borders']},
  'hives':{pw:['heat','stress','scratching'],exam:['raised wheals','blanching w/ pressure','migratory']},
  'insect bite':{sx:['central punctum','spreading redness','warmth'],exam:['localized <5 cm','no streaking','no induration','mild surrounding erythema']},
  'blister':{pw:['boots','friction from gear'],exam:['blister intact','blister ruptured','no surrounding erythema','on weight-bearing surface']},
  'swelling':{exam:['pitting','non-pitting','localized','warm to touch','not warm']},
  'itching':{pw:['at night','after shower','sweat']},
  'athletes foot':{r:['between toes','sole','sides of feet','both feet'],sx:['peeling','itching','burning','odor'],exam:['scaling between toes','maceration','no secondary infection','no spreading redness']},
  'jock itch':{r:['groin folds','inner thighs'],pw:['sweat','friction','field time'],exam:['well-demarcated erythema w/ raised border','no satellite lesions','satellite lesions present']},
  'razor bumps (PFB)':{r:['beard area','neck','jawline'],pw:['close shaving','daily shaving'],sx:['bumps after shaving','ingrown hairs','dark marks'],exam:['papules/pustules beard area','no abscess','ingrown hairs visible']},
  'ingrown nail':{r:['great toe medial','great toe lateral'],pw:['boots','tight footwear'],exam:['erythema of nail fold','no purulence','purulence present','no spreading redness']},
  'sunburn':{r:['face/neck','arms','shoulders/back'],exam:['erythema, blanches w/ pressure','no blistering','blistering present (2nd degree)']},
  'acne flare':{r:['face','back','chest'],pw:['sweat under gear','helmet strap','stress'],exam:['comedones/papules','pustules','no cystic lesions','cystic lesions']},
  'dry skin':{pw:['cold/dry weather','frequent showers','field time'],exam:['dry flaky patches','no fissures','fissures present']},
  'wart':{r:['hands','feet (plantar)'],exam:['single lesion','multiple lesions','plantar, painful w/ pressure']}
 },
 ccAsk:{
  'rash':{pw:'"Worse with heat, sweat, or when you scratch it?"',o:'"When did it show up? Any new soap, detergent, or chow before it started?"'},
  'hives':{pw:'"Do they move around your body? Worse with heat or stress?"'},
  'insect bite':{sx:'"Is the redness spreading? Any warmth or red streaks going up from it?"'},
  'blister':{pw:'"From your boots? Which part rubs — heel, toes?"'},
  'itching':{pw:'"Worse at night, after a shower, or when you sweat?"'},
  'athletes foot':{sx:'"Peeling or itching between your toes? Feet stay wet in boots a lot?"'},
  'jock itch':{pw:'"Worse with sweat and friction? Been in the field lately?"'},
  'razor bumps (PFB)':{pw:'"How close and how often do you shave? Multi-blade razor?"'},
  'ingrown nail':{pw:'"Do your boots press on that toe? How do you cut the nail — straight or rounded?"'}
 },
 fuQ:{
  a:{'NSAIDs (Motrin/Aspirin)':'⚠️ NSAID allergy — do NOT recommend Motrin, Aspirin or Pepto-Bismol (salicylate). Use Tylenol 325 mg x2 tabs (650 mg) PO q6h for pain/fever (max 2,600 mg/24h).'},
  sx:{'spreading redness':'"How fast is it spreading? Any fever? Red streaks toward the body?" — cellulitis screening: if streaking/fever → provider today','warmth':'Palpate: warm vs. the other side? Induration? → if yes, mark in EX and consider referral','bumps after shaving':'PFB confirmed by pattern → consider recommending provider eval for shaving profile (AR 670-1). Document severity.'},
  exam:{'blister ruptured':'"When did it pop? Keep it clean — cover w/ moleskin/dressing, watch for redness/pus."','purulence present':'Nail with pus → drainage/management by provider, do not attempt at sick call. Refer today.','satellite lesions present':'Satellite lesions suggest candida → appropriate antifungal via provider','cystic lesions':'Cystic acne → refer to provider (possible systemic tx), not OTC alone'},
 },
 plan:[
  'Claritin (loratadine) 10 mg tab PO daily — Mendoza Pharmacy',
  'Zyrtec (cetirizine) 10 mg tab PO daily — Mendoza Pharmacy',
  'Benadryl (diphenhydramine) 25 mg tabs: 1–2 tabs PO q6h PRN itching (⚠️ drowsy) — Mendoza Pharmacy',
  'Bacitracin ointment: thin layer topical 1–3x/day to clean minor wound/abrasion, max 7 days — Mendoza Pharmacy',
  'Hydrocortisone 1% cream topical BID (⚠️ not on the pharmacy list — verify availability)',
  'Clean w/ soap & water, keep dry, cover friction areas, ice PRN swelling',
  'Hygiene, avoid scratching, change uniform if sweaty',
  'Antifungal: Clotrimazole (Lotrimin) 1% cream thin layer topical BID — athletes foot x4 wk, jock itch/ringworm x2 wk — Mendoza Pharmacy',
  'Feet: keep dry, change socks, shower shoes, rotate boots',
  'PFB: recommend provider eval for shaving profile'
 ],
 er:'ER if: SOB, airway compromise, tongue/lip swelling, anaphylaxis, systemic reaction.',
 redFlags:['SOB / wheezing','tongue/lip/throat swelling','red streaking (lymphangitis)','fever w/ rash','rapidly spreading','petechial/purple rash (no blanquea)','mucosal involvement'],
 dispo:{
  'RTD':'RTD — cleared for duty, recommend OTC antihistamine and skin care.',
  'Light Duty':'RTD w/ restrictions: no PT x24h, avoid heat/friction exposure.',
  'Quarters 24h':'Recommend quarters x24h (pending CoC/provider approval). OTC antihistamine, monitor.',
  'Referral':'Referral to provider for persistent rash >1w / worsening / signs of infection.'
 }
},
{
 id:'gyn', icon:'⚕️', title:'GYN / Female Health',
 ccOpts:['lower abd pain','cramps','irregular menses','missed period','heavy bleeding','spotting','vaginal discharge','yeast-like sx','UTI-like sx','blood in urine','post IUD/implant removal','IUD/implant problems','birth control side effects','pelvic pressure','breast pain','possible pregnancy'],
 fields:[
  F('o','O','Onset','"When did this start?"',['today','yesterday','2–3d','1w','after PT','after intercourse','after field'],{prefix:'Started '}),
  F('pw','P','Worse','"What makes it worse?"',['activity','menses','urination','intercourse'],{prefix:'Worse w/ '}),
  F('pb','P','Better','"What makes it better?"',['rest','OTC pain meds','hydration','heat'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"How would you describe it?"',['cramping','sharp','dull','burning w/ urination','pressure','heavy flow','clotting']),
  F('rr','R','Radiation','"Does it go anywhere else?"',['no radiation','back','thighs'],{prefix:'Radiates to ',noRadFirst:true}),
  F('t','T','Time','"Constant or comes and goes?"',['constant','intermittent','only during menses','cyclical','worse at night']),
  F('sx','S','Signs/Symptoms','"Any other symptoms?"',['heavy bleeding','clots','cramps','missed period','discharge','burning w/ urination','fever','fatigue','nausea'],{prefix:'Reports ',deny:['CP','SOB','syncope','severe dizziness']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds, supplements, pre-workout?"',['none'],{prefix:'',groups:[
   {g:'💊 OTC',opts:['Tylenol','Motrin/ibuprofen','aspirin','Claritin/Zyrtec','Benadryl','antacids (Tums/Maalox)','Pepto','melatonin','cough/cold meds']},
   {g:'💪 Supplements',opts:['multivitamin','protein powder','creatine','pre-workout','energy drinks','fish oil','caffeine pills','fat burners','testosterone booster']},
   {g:'📋 Prescription',opts:['antibiotic (current)','SSRI/antidepressant','ADHD med','birth control','inhaler (albuterol)','BP med','isotretinoin (Accutane)','prescription pain med']}
  ]}),
  F('phx','P','Past hx','"Any gyn history I should know about?"',['no hx'],{groups:[
   {g:'⚕️ GYN',opts:['hx irregular menses','hx PCOS','hx endometriosis','hx ovarian cysts','hx fibroids','recurrent UTIs','hx STI','prior pregnancy (G_P_ abajo)']},
   {g:'💊 Contraception',opts:['birth control pill','IUD','implant (Nexplanon)','Depo shot','none currently']}
  ]}),
  F('lmp','L','LMP','"When was your last period?" (type date below)',[],{customOnly:true,prefix:'LMP: ',ph:'e.g. ~10 JUL / 2 weeks ago'}),
  F('e','E','Events','"What was happening before?"',['after menses','after intercourse','after field','dehydration','stress']),
  F('exam','EX','Exam / Objective','What YOU observe (screening — no pelvic exam)',['no acute distress','abd soft','no rebound/guarding','afebrile','ambulating without difficulty'],{prefix:''})
 ],
 ccExtras:{
  'lower abd pain':{pw:['movement','pressure on abdomen','urination','intercourse'],exam:['lower abd TTP mild','no rebound/guarding','no CVA tenderness']},
  'UTI-like sx':{pw:['urination'],sx:['frequency','urgency','burning w/ urination','suprapubic pressure','cloudy/strong odor urine'],exam:['suprapubic TTP mild','no CVA tenderness','CVA tenderness present','afebrile']},
  'cramps':{pw:['first days of menses','activity'],pb:['heat','NSAIDs','rest']},
  'heavy bleeding':{sx:['soaking pads q__ hrs (note below)','clots','fatigue/lightheaded']},
  'possible pregnancy':{sx:['missed period','breast tenderness','AM nausea','fatigue']},
  'spotting':{sx:['between periods','after intercourse','on birth control','light brown/pink']},
  'yeast-like sx':{sx:['thick white discharge','itching','burning','no strong odor'],pw:['after antibiotics','tight uniform/field time']},
  'breast pain':{r:['right','left','both'],sx:['cyclical w/ menses','localized lump (note below)','diffuse tenderness'],pw:['before menses','w/ exercise/impact']},
  'pelvic pressure':{sx:['heaviness','worse end of day','w/ prolonged standing']},
  'post IUD/implant removal':{o:['removed today','removed days ago','removed 1-2 weeks ago','removed >2 weeks ago'],sx:['light bleeding/spotting','mild cramping','irregular bleeding','heavier than expected','clots','no symptoms — routine question'],pb:['NSAIDs','heat','rest'],exam:['no acute distress','abd soft, nontender','afebrile','no heavy active bleeding reported']},
  'IUD/implant problems':{sx:['cannot feel IUD strings','strings feel longer than before','partner feels device','severe cramping w/ IUD','irregular bleeding on implant','arm pain at implant site','implant site red/swollen'],exam:['afebrile','abd soft','implant palpable in arm','implant site no erythema','implant site erythema/warmth']},
  'birth control side effects':{sx:['breakthrough bleeding','nausea on pill','missed pill(s)','headaches on pill','mood changes','Depo irregular bleeding','no period on method','weight change concern'],o:['started method recently (<3 mo)','on method >3 mo','changed method recently']},
  'blood in urine':{sx:['blood in urine stream itself','only when wiping','w/ burning urination','w/ back/flank pain','currently on period','recent device removal','clots in urine'],exam:['afebrile','no CVA tenderness','CVA tenderness present','no acute distress']}
 },
 ccAsk:{
  'lower abd pain':{pw:'"Worse with movement, pressing on it, peeing, or intercourse?"'},
  'UTI-like sx':{sx:'"Burning when you pee? Going more often than usual? Any fever or pain in your back or side?"'},
  'cramps':{pw:'"Worse the first days of your period? Does heat or Motrin help?"'},
  'heavy bleeding':{sx:'"How many pads per hour? Any clots? Feeling lightheaded or weak?"'},
  'possible pregnancy':{sx:'"When was your last period? Any breast tenderness or morning nausea?"'},
  'vaginal discharge':{sx:'"Any odor, itching, or burning with it? Color change?"'},
  'yeast-like sx':{sx:'"Thick white discharge with itching? Did it start after antibiotics?"'},
  'spotting':{sx:'"Between periods or after intercourse? Are you on birth control?"'},
  'breast pain':{sx:'"Both sides or one spot? Does it come with your cycle? Any lump you can feel?"'},
  'post IUD/implant removal':{o:'"When was it removed?"',sx:'"How much bleeding — spotting or like a period? Cramping? Any fever or bad-smelling discharge?"'},
  'IUD/implant problems':{sx:'"Can you feel the strings like before? Any severe cramping or pain?"'},
  'birth control side effects':{sx:'"How long on this method? Bleeding between periods, nausea, headaches?"',o:'"When did you start or change the method?"'},
  'blood in urine':{sx:'"Is the blood IN the urine stream itself, or only when you wipe? Are you on your period, or did you recently have a device removed?"'}
 },
 fuQ:{
  a:{'NSAIDs (Motrin/Aspirin)':'⚠️ NSAID allergy — do NOT recommend Motrin, Aspirin or Pepto-Bismol (salicylate). Use Tylenol 325 mg x2 tabs (650 mg) PO q6h for pain/fever (max 2,600 mg/24h).'},
  sx:{'burning w/ urination':'"Any fever, chills, or pain in your back/flank?" — if CVA tenderness or fever → possible pyelonephritis, provider TODAY','clots':'"Bigger than a quarter? How many pads have you gone through today?"','fever':'With urinary or pelvic sx + fever → do not manage with OTC, refer to provider today','localized lump (note below)':'Palpable lump → ALWAYS refer to provider for clinical exam, no exceptions. Document location, approximate size and whether painful.','heavier than expected':'"How many pads today? Any clots bigger than a quarter? Feeling lightheaded?" — spotting/cramping for days to ~2 weeks post-removal can be normal; heavy period-like bleeding, fever or foul odor is NOT → provider','cannot feel IUD strings':'⚠️ Cannot feel strings = possible displacement/expulsion → refer to provider, do NOT assume contraceptive protection meanwhile (backup method)','severe cramping w/ IUD':'⚠️ Severe pain with IUD (especially post-insertion) → rule out perforation/expulsion → provider TODAY','missed pill(s)':'"How many missed and when in the pack?" → follow package-insert instructions + backup x7 days; if unprotected intercourse, ask about EC → provider','headaches on pill':'"Any visual aura with the headaches?" — migraine WITH aura + estrogen = contraindication → provider for method change','blood in urine stream itself':'TRUE hematuria (in the stream, not when wiping, no active menses) → ALWAYS refer to provider for UA — not OTC management','only when wiping':'Blood only when wiping + active period or recent device removal → likely vaginal, not urinary source. Document the distinction in the note.','clots in urine':'⚠️ Clots in urine or hematuria + flank pain → provider/ER today'},
  exam:{'CVA tenderness present':'⚠️ CVA tenderness + urinary sx = suspected pyelonephritis → provider/ER today, no OTC and no RTD'}
 },
 plan:[
  'Motrin (ibuprofen) 200 mg tabs: 2 tabs (400 mg) PO q6h PRN cramps/pain, w/ food; max 1,600 mg/24h (ADTMC) — Mendoza Pharmacy',
  'Tylenol (acetaminophen) 325 mg tabs: 2 tabs (650 mg) PO q6h PRN pain — Mendoza Pharmacy',
  'Hydration, rest, heating pad if available',
  'Yeast sx: Clotrimazole 1% vaginal cream (7-day): 1 applicatorful intravaginally HS x7 nights — first time or atypical sx → refer to provider first — Mendoza Pharmacy',
  'Post-removal: mild spotting/cramping x days–2 wk can be normal; Motrin PRN, track bleeding; cycles can take 1–3 months to regulate',
  'Backup contraception / EC counseling → referral a provider',
  'Hematuria confirmed: refer to provider for UA — no OTC management'
 ],
 er:'ER if: severe abd pain, soaking >1 pad/hour, syncope, severe dizziness, pregnancy + pain/bleeding. Beyond OTC → ALWAYS refer to provider/OB-GYN.',
 redFlags:['severe abd/pelvic pain','soaking >1 pad/hour','syncope / severe dizziness','positive pregnancy + pain/bleeding','fever w/ pelvic pain','CVA tenderness + fever','severe pain post IUD insertion/removal','fever + foul discharge post device removal','gross hematuria w/ clots or flank pain'],
 dispo:{
  'RTD':'RTD — cleared for duty, recommend OTC meds, hydration, rest.',
  'Light Duty':'RTD w/ restrictions: no PT x24h, avoid strenuous activity.',
  'Quarters 24h':'Recommend quarters x24h (pending CoC/provider approval). OTC pain relief, monitor.',
  'Referral OB/GYN':'Referral to OB/GYN — suspected pregnancy / irregular bleeding / discharge / UTI sx.'
 }
},
{
 id:'ent', icon:'👂', title:'ENT / Dental / Ocular',
 ccOpts:['ear pain','ear wax / blocked ear','ringing (tinnitus)','sore throat','congestion','sinus pain','nosebleed','toothache','gum swelling','jaw pain (TMJ)','canker sore','eye irritation','conjunctivitis','stye','blurred vision'],
 fields:[
  F('o','O','Onset','"When did this start?"',['today','yesterday','2–3d','1w','after chow','after field','after trauma'],{prefix:'Started '}),
  F('pw','P','Worse','"What makes it worse?"',['chewing','swallowing','light','loud noise','bending forward'],{prefix:'Worse w/ '}),
  F('pb','P','Better','"What makes it better?"',['rest','fluids','OTC meds','avoiding chewing','avoiding bright light'],{prefix:'Better w/ '}),
  F('q','Q','Quality','"How would you describe it?"',['throbbing','pressure','sharp','burning','itchy','aching','scratchy','blurred']),
  F('r','R','Region','"Where exactly? Does it spread?"',['ear → jaw/neck','one tooth','diffuse gums','one eye','both eyes','one nostril','both nostrils','sinuses'],{prefix:'Location: '}),
  F('t','T','Time','"Constant or comes and goes?"',['constant','intermittent','worse AM','worse PM','worse after meals','episodic']),
  F('sx','S','Signs/Symptoms','"Any other symptoms?"',['congestion','sore throat','fever','gum swelling','eye discharge','photophobia','nosebleed'],{prefix:'Reports ',deny:['SOB','CP','severe dizziness','vision loss']}),
  F('a','A','Allergies','"Any allergies to meds, food, latex?"',['NKDA'],{prefix:'',groups:[
   {g:'💊 Medications',opts:['NSAIDs (Motrin/Aspirin)','penicillin','amoxicillin','sulfa','cephalosporins','codeine/opioids','lidocaine','tetracycline']},
   {g:'🍤 Food',opts:['peanuts','tree nuts','shellfish','eggs','dairy','gluten','soy']},
   {g:'🌿 Environment / Other',opts:['latex','bee stings','seasonal/pollen','pet dander','adhesive/tape','contrast dye']}
  ]}),
  F('m','M','Medications','"Taking any meds, supplements, pre-workout?"',['none'],{prefix:'',groups:[
   {g:'💊 OTC',opts:['Tylenol','Motrin/ibuprofen','aspirin','Claritin/Zyrtec','Benadryl','antacids (Tums/Maalox)','Pepto','melatonin','cough/cold meds']},
   {g:'💪 Supplements',opts:['multivitamin','protein powder','creatine','pre-workout','energy drinks','fish oil','caffeine pills','fat burners','testosterone booster']},
   {g:'📋 Prescription',opts:['antibiotic (current)','SSRI/antidepressant','ADHD med','birth control','inhaler (albuterol)','BP med','isotretinoin (Accutane)','prescription pain med']}
  ]}),
  F('phx','P','Past hx','"Have you had this before?"',['no hx','similar episode before'],{groups:[
   {g:'👂 ENT',opts:['hx sinus infections','hx ear infections','hx strep throat','hx seasonal allergies','hx nosebleeds']},
   {g:'🦷 Dental / 👁 Eye',opts:['recent dental work','wisdom teeth issues','wears contacts','hx eye irritation','hx styes']}
  ]}),
  F('l','L','Last intake','"Last time you ate or drank? Tolerated it?"',['ate chow, tolerating PO','normal PO intake','↓ PO intake','fluids only'],{multi:false}),
  F('e','E','Events','"What were you doing before?"',['after chow','field dust exposure','after PT','after trauma','cold exposure']),
  F('exam','EX','Exam / Objective','What YOU observe',['no acute distress','afebrile','no facial swelling'],{prefix:''})
 ],
 ccExtras:{
  'ear pain':{pw:['pulling on ear (tragus)','chewing','water exposure/swimming'],sx:['↓ hearing','fullness','drainage'],exam:['TTP tragus','canal erythematous','TM pearly/intact','TM erythematous/bulging','no drainage']},
  'toothache':{pw:['cold','hot','sweet','chewing','pressure on tooth'],exam:['visible caries','gum swelling localized','no facial swelling','TTP w/ percussion of tooth']},
  'gum swelling':{exam:['localized swelling','no fluctuance','no facial swelling','afebrile']},
  'eye irritation':{pw:['light','screen time','rubbing','dust/wind'],sx:['watery discharge','itchy','gritty/foreign body sensation'],exam:['conjunctival injection','no discharge','PERRL','visual acuity intact','no foreign body seen']},
  'conjunctivitis':{sx:['discharge crusting AM','itchy both eyes','started one eye'],exam:['conjunctival injection','discharge present','PERRL','visual acuity intact']},
  'sinus pain':{pw:['bending forward','pressure changes'],exam:['sinus TTP frontal/maxillary','no sinus TTP']},
  'sore throat':{pw:['swallowing','talking'],sx:['swollen glands','white patches'],exam:['pharyngeal erythema','no exudates','exudates present','tender cervical nodes']},
  'nosebleed':{pw:['dry air','nose blowing/picking'],exam:['anterior bleed','stopped w/ direct pressure x10 min','no active bleeding']},
  'blurred vision':{sx:['both eyes','one eye','w/ headache'],exam:['PERRL','visual acuity grossly intact','no trauma visible']},
  'ear wax / blocked ear':{r:['right ear','left ear','both'],sx:['muffled hearing','fullness','no pain'],exam:['cerumen impaction visible','TM not visible due to wax','no pain w/ tragus pull','canal not inflamed']},
  'ringing (tinnitus)':{r:['right ear','left ear','both'],sx:['after range/loud noise','constant','intermittent','w/ hearing loss'],exam:['hearing grossly intact','TM intact','no drainage']},
  'jaw pain (TMJ)':{r:['right TMJ','left TMJ','both'],pw:['chewing','clenching','stress','yawning wide'],exam:['TTP TMJ','clicking w/ opening','opening ROM normal','no facial swelling']},
  'canker sore':{r:['inner lip','inner cheek','tongue'],pw:['acidic/spicy food','stress'],exam:['single aphthous ulcer','multiple ulcers','no facial swelling','no fever']},
  'stye':{r:['right upper lid','right lower lid','left upper lid','left lower lid'],exam:['localized lid margin swelling','no vision change','no orbital involvement','no spreading redness']}
 },
 ccAsk:{
  'ear pain':{pw:'"Does it hurt when I pull on your ear, or when you chew? Been swimming or using Q-tips?"',sx:'"Any drainage or trouble hearing on that side?"'},
  'toothache':{pw:'"Worse with cold, hot, sweets, or when you chew on that side?"'},
  'gum swelling':{sx:'"Any bad taste in your mouth? Fever? Swelling in your face?"'},
  'eye irritation':{pw:'"Worse with light or screens? Feel like something is stuck in it?"'},
  'conjunctivitis':{sx:'"Crusty when you wake up? Did it start in one eye or both?"'},
  'sinus pain':{pw:'"Worse when you bend forward or go up/down in elevation?"'},
  'sore throat':{pw:'"Does it hurt more when you swallow?"'},
  'nosebleed':{pw:'"Dry air in the barracks? Blowing or picking your nose a lot?"'},
  'blurred vision':{sx:'"One eye or both? Sudden or gradual? Any headache with it?"'},
  'ear wax / blocked ear':{sx:'"Muffled hearing or fullness? Any pain? Using Q-tips?"'},
  'ringing (tinnitus)':{sx:'"Did it start after the range or loud noise? One ear or both? Constant?"'},
  'jaw pain (TMJ)':{pw:'"Worse chewing or when you wake up? Do you clench or grind at night?"'},
  'stye':{sx:'"How long has the bump been there? Any change in your vision?"'}
 },
 fuQ:{
  a:{'NSAIDs (Motrin/Aspirin)':'⚠️ NSAID allergy — do NOT recommend Motrin, Aspirin or Pepto-Bismol (salicylate). Use Tylenol 325 mg x2 tabs (650 mg) PO q6h for pain/fever (max 2,600 mg/24h).'},
  sx:{'↓ hearing':'"Sudden or gradual? One ear or both?" — sudden unilateral loss → prompt referral','drainage':'"What color is the drainage? Recent swimming or Q-tip use?"','gum swelling':'"Any fever or facial swelling?" — dental pain + swelling/fever = possible abscess → Dental TODAY','photophobia':'"Any severe headache or stiff neck with it?" — rule out something more serious before assuming ocular','after range/loud noise':'Post-noise tinnitus → document exposure, recommend hearing protection and refer to Audiology/hearing conservation if persists >48h','w/ hearing loss':'Tinnitus + sudden unilateral hearing loss → URGENT referral (not routine)'},
  exam:{'TM erythematous/bulging':'Document side and compare with the other ear. Fever + bulging TM → provider for possible AOM','no orbital involvement':'Simple stye → warm compress QID + hygiene. If it spreads, hurts with eye movement, or vision changes → provider/ER'},
 },
 plan:[
  'ENT: Tylenol (acetaminophen) 325 mg tabs: 2 tabs (650 mg) PO q6h PRN pain — Mendoza Pharmacy',
  'ENT: Motrin (ibuprofen) 200 mg tabs: 2 tabs (400 mg) PO q6h PRN pain, w/ food; max 1,600 mg/24h (ADTMC) — Mendoza Pharmacy',
  'ENT: Claritin (loratadine) 10 mg or Zyrtec (cetirizine) 10 mg tab PO daily (allergy sx) — Mendoza Pharmacy',
  'ENT: Flonase (fluticasone) 50 mcg/spray: 2 sprays each nostril daily (allergic congestion) — Mendoza Pharmacy',
  'ENT: Saline 0.65% nasal spray: 2 sprays each nostril PRN / warm salt water gargle — Mendoza Pharmacy',
  'ENT: Cepacol (benzocaine/menthol) lozenge: dissolve 1 slowly q2h PRN sore throat — Mendoza Pharmacy',
  'Dental: Motrin (ibuprofen) 200 mg tabs: 2 tabs (400 mg) PO q6h PRN + salt water rinses TID + avoid hard foods; max 1,600 mg/24h (ADTMC) — Mendoza Pharmacy',
  'Dental: Referral to Dental Clinic',
  'Ocular: Artificial tears + cool compress; hygiene if conjunctivitis (⚠️ artificial tears not on the pharmacy list — verify)',
  'Ocular: Refer to Optometry if vision changes / persistent redness',
  'Nosebleed: pinch nostrils + lean forward 10 min; Afrin (oxymetazoline) 0.05% 2 sprays on bleeding side, short-term max 3 days — Mendoza Pharmacy; referral si >20 min o recurrente',
  'Cerumen: NO Q-tips; carbamide peroxide drops (Debrox) BID x3–4d (⚠️ not on the pharmacy list — verify); irrigation by provider if persists',
  'Stye: warm compress 10 min QID + eyelid hygiene; do not squeeze',
  'TMJ: soft diet, evitar clenching, Motrin PRN, warm compress'
 ],
 er:'ER if: severe vision loss, orbital trauma, abscess with fever, uncontrolled bleeding.',
 redFlags:['vision loss','orbital trauma','facial swelling + fever','bleeding >20 min uncontrolled','stiff neck + HA + fever','stridor / drooling / cannot swallow'],
 dispo:{
  'RTD':'RTD — cleared for duty, OTC meds/hygiene advised.',
  'Light Duty':'RTD w/ restrictions: no PT x24h, hydration, rest.',
  'Quarters 24h':'Recommend quarters x24h (pending CoC/provider approval). OTC meds, monitor.',
  'Referral':'Referral to provider/specialist (dental / optometry / ENT) per findings.'
 }
},
{
 id:'fu', icon:'🔄', title:'Follow-Up / Return Visit',
 ccOpts:['f/u pain','f/u illness','f/u rash','f/u BH','f/u GYN','f/u other'],
 ccPrefix:'Follow-up for ',
 fields:[
  F('seen','O','Seen at sick call','"When were you seen?" (type date below)',[],{customOnly:true,prefix:'Seen at sick call on: ',ph:'e.g. 16 JUL 26'}),
  F('o','O','Change since then','"Better, same or worse since last visit?"',['better','same','worse'],{prefix:'Since then: ',multi:false}),
  F('pw','P','Palliation','"What helped before — still working?"',['prior tx effective','prior tx ineffective','tried new OTC'],{prefix:''}),
  F('q','Q','Quality','"Has the symptom changed?"',['same as before','sharper','spreading','different'],{multi:false}),
  F('s2','S','Severity now vs before','"Compared to last visit?" (use the Severity slider below for TODAY; type the prior one)',[],{customOnly:true,prefix:'Last visit: ',ph:'e.g. 7/10'}),
  F('sx','S','New sx','"Any new or different symptoms?"',['still reports same sx','new sx (type below)'],{prefix:''}),
  F('a','A','Allergies','"Any new allergies since last visit?"',['NKDA (confirmed)','new allergy (note below)'],{prefix:''}),
  F('m','M','Adherencia','"Did you take what was recommended?"',['took OTC as instructed — improved','took OTC — no effect','took OTC — side effects','did not take OTC'],{multi:false}),
  F('e','E','Events','"Since last visit, what happened?"',['duty','PT','field','stress','new injury','new exposure','no new events']),
  F('exam','EX','Exam / Objective','Compared with last visit',['improved on exam','unchanged on exam','worse on exam','no acute distress'],{prefix:''})
 ],
 plan:[
  'Improved: continue current OTC regimen, hydration, rest — RTD',
  'Unchanged: reinforce OTC + supportive care; consider duty modification',
  'Worsened: escalate — provider referral / ER if red flags; document failed OTC response',
  'Meds are self-care recommendations; pick up at Mendoza Pharmacy (no clinic visit needed)'
 ],
 er:'Worsened or no improvement after OTC trial → referral. Red flags → ER.',
 redFlags:['worsening despite treatment','new red flags since last visit','failed OTC + systemic sx (fever, dehydration)'],
 dispo:{
  'RTD':'RTD — stable, improved or mild persistent symptoms.',
  'Light Duty':'RTD w/ restrictions: symptoms interfere w/ PT but not duty. Light duty 24–48h.',
  'Quarters 24h':'Recommend quarters x24h (pending CoC/provider approval): fatigue/worsening illness limiting safe performance.',
  'Referral':'Referral to provider — no improvement after OTC trial / worsening.'
 }
}
];

/* ---- OTC protocols suggested by screening ---- */
const OTC_MAP={
 msk:{'*':['Motrin','Ice/heat'],'numbness/tingling':[]},
 ha:{'tension headache':['Tylenol','Motrin','Hydration'],'migraine':['Tylenol','Motrin','Hydration','recurrent'],'sinus-type HA':['Tylenol','Motrin','Hydration'],'dehydration HA':['Hydration','Tylenol'],'caffeine-withdrawal HA':['Caffeine','Tylenol'],'post-concussion HA':['Tylenol'],'HA unspecified':['Tylenol','Motrin','Hydration']},
 ill:{'sore throat':['Tylenol','Motrin','Cepacol','Hydration'],'cough':['Robitussin DM','Hydration'],'congestion':['Sudafed','Saline','Hydration'],'runny nose':['Claritin','Saline'],'fever':['Tylenol','Motrin','Hydration'],'chills':['Tylenol','Hydration'],'body aches':['Motrin','Tylenol'],'fatigue':['Hydration'],'dizziness':['Hydration'],'nausea':['Hydration','Pepto'],'vomiting':['Hydration'],'diarrhea':['Pepto','Hydration'],'constipation':['Colace','Hydration'],'bloating':['Simethicone'],'heartburn':['Maalox'],'abd pain':['Hydration'],'loss of appetite':[],'night sweats':[],'swollen glands':[]},
 bh:{'insomnia':['Sleep hygiene'],'nightmares':['Sleep hygiene'],'*':['Sleep hygiene','Encourage talking']},
 skin:{'rash':['Claritin','Hygiene'],'itching':['Claritin'],'hives':['Claritin','Benadryl'],'redness':['Clean'],'swelling':['Clean'],'insect bite':['Clean','Claritin'],'blister':['Clean','Bacitracin'],'athletes foot':['Antifungal','Feet'],'jock itch':['Antifungal','Hygiene'],'razor bumps (PFB)':['PFB'],'ingrown nail':['Clean','Bacitracin'],'sunburn':['Clean'],'dry skin':['Hygiene'],'acne flare':['Hygiene'],'wart':[],'irritation':['Hygiene'],'burning sensation':['Clean']},
 gyn:{'cramps':['Motrin','Hydration'],'heavy bleeding':['Motrin','Hydration'],'lower abd pain':['Motrin','Hydration'],'irregular menses':['Hydration'],'yeast-like sx':['Clotrimazole'],'UTI-like sx':['Hydration'],'blood in urine':['Hematuria'],'post IUD/implant removal':['Post-removal'],'IUD/implant problems':['Backup'],'birth control side effects':['Backup'],'pelvic pressure':['Hydration'],'breast pain':['Tylenol'],'possible pregnancy':['Tylenol','Hydration']},
 ent:{'ear pain':['ENT: Tylenol'],'ear wax / blocked ear':['Cerumen'],'sore throat':['ENT: Tylenol','Saline','Cepacol'],'congestion':['Claritin','Saline','Flonase'],'sinus pain':['Claritin','Saline','Flonase'],'nosebleed':['Nosebleed'],'toothache':['Dental: Motrin','Dental: Referral'],'gum swelling':['Dental: Motrin','Dental: Referral'],'jaw pain (TMJ)':['TMJ'],'canker sore':['Saline'],'eye irritation':['Ocular: Artificial'],'conjunctivitis':['Ocular: Artificial'],'stye':['Stye'],'blurred vision':['Ocular: Referral']}
};
/* ---- med safety: contraindications, weekly limit ---- */
const NSAID_RX=/Motrin|Aspirin|Pepto/;
const DECONG_RX=/Sudafed|Actifed/;
function parseBP(){const m=(gVitals.bp||'').match(/(\d{2,3})\s*\/\s*(\d{2,3})/);return m?{s:+m[1],d:+m[2]}:null;}
function otcCI(){
  const ci={nsaid:false,preg:false,ulcer:false,htn:false,bpHigh:false,ssri:false};
  TPLS.forEach(tp=>{const st=state[tp.id];
    if(st.fields.a&&st.fields.a.has('NSAIDs (Motrin/Aspirin)'))ci.nsaid=true;
    if(st.fields.phx&&st.fields.phx.has('hx HTN'))ci.htn=true;
    if(st.fields.m&&st.fields.m.has('BP med'))ci.htn=true;
    if(st.fields.m&&st.fields.m.has('SSRI/antidepressant'))ci.ssri=true;
  });
  const bp=parseBP(); if(bp&&(bp.s>=140||bp.d>=90))ci.bpHigh=true;
  if(adPreg())ci.preg=true;
  if(state.ill&&state.ill.fields.phx&&state.ill.fields.phx.has('hx ulcers'))ci.ulcer=true;
  return ci;
}
function itemConflict(item,ci){
  const r=[];
  if(NSAID_RX.test(item)&&!/Tylenol/.test(item)){
    if(ci.nsaid)r.push('NSAID/salicylate allergy');
    if(ci.preg)r.push('possible pregnancy');
    if(ci.ulcer)r.push('hx of ulcers');
  }
  if(DECONG_RX.test(item)){
    if(ci.htn)r.push('HTN / BP med');
    if(ci.bpHigh)r.push('elevated BP today');
    if(ci.preg)r.push('possible pregnancy');
  }
  if(/Robitussin DM/.test(item)&&ci.ssri)r.push('SSRI/antidepressant (dextromethorphan, serotonin risk)');
  return r;
}
function itemName(i){return i.split(/[:(]/)[0].trim();}
function pharmCount(){
  const set=new Set();
  TPLS.forEach(t=>{state[t.id].plan.forEach(p=>{if(p.includes('— Mendoza Pharmacy'))set.add(p);});});
  return set.size;
}
function planWarnings(t,s){
  const ci=otcCI(),w=[];
  [...s.plan].forEach(p=>{const why=itemConflict(p,ci);if(why.length)w.push('⚠️ '+itemName(p)+' — caution/contraindicated: '+why.join(', ')+'. Reconsider before recommending.');});
  const n=pharmCount();
  if(n>4)w.push('⚠️ '+n+' pharmacy meds selected — the list allows max 4 items per week (per family). Prioritize.');
  return w;
}
function suggestOTC(t,s){
  const map=OTC_MAP[t.id];
  if(!map||!s.cc.size)return{items:[],notes:[]};
  const ci=otcCI();
  let items=[];const notes=[];
  const addKeys=keys=>keys.forEach(k=>{const it=t.plan.find(p=>p.includes(k));if(it&&!items.includes(it))items.push(it);});
  [...s.cc].forEach(cc=>{
    const keys=(map[cc]!==undefined)?map[cc]:(map['*']||[]);
    addKeys(keys);
  });
  const postConc=(t.id==='ha'&&s.cc.has('post-concussion HA'));
  const kept=[],dropped=[];
  items.forEach(i=>{
    const why=itemConflict(i,ci);
    if(postConc&&/Motrin|Aspirin/.test(i)&&!/Tylenol/.test(i))why.push('HA post-trauma');
    why.length?dropped.push({i,why}):kept.push(i);
  });
  items=kept;
  if(dropped.length){
    const reasons=[...new Set(dropped.flatMap(d=>d.why))];
    notes.push('🚫 Omitted for safety ('+reasons.join(', ')+'): '+dropped.map(d=>itemName(d.i)).join(', ')+'.');
    if(dropped.some(d=>/Motrin|Aspirin/.test(d.i))){
      const tyl=t.plan.find(p=>p.includes('Tylenol'));
      if(tyl&&!items.includes(tyl)){items.unshift(tyl);notes.push('Use Tylenol for pain/fever.');}
    }
  }
  if(t.id==='ill'&&s.cc.has('abd pain'))notes.push('⚠️ Undiagnosed abd pain — avoid masking analgesics until a surgical abdomen is ruled out.');
  return{items,notes};
}
function acceptOTC(tid){
  const t=TPLS.find(x=>x.id===tid);
  suggestOTC(t,state[tid]).items.forEach(i=>state[tid].plan.add(i));
  renderMain();renderNote();
}
function otcBoxHtml(t,s,tid){
  const sug=suggestOTC(t,s), warns=planWarnings(t,s);
  if(!sug.items.length&&!sug.notes.length&&!warns.length)return'';
  const head=(sug.items.length||sug.notes.length)?'⭐ Suggested OTC protocol based on screening':'⚠️ Plan review';
  let b=`<div class="sugbox"><div class="sughead">${head}</div>`;
  warns.forEach(n=>b+=`<div class="rfbanner" style="margin:6px 0;font-size:.85em">${n}</div>`);
  sug.notes.forEach(n=>b+=`<div class="fuq" style="margin:6px 0">${n}</div>`);
  if(sug.items.length){
    b+=`<div class="chips">`;
    sug.items.forEach(p2=>{const esc=p2.replace(/'/g,"\\'");b+=`<span class="chip ${s.plan.has(p2)?'on':''}" onclick="togPlan('${tid}','${esc}')">${p2}</span>`;});
    b+=`</div><div class="algo-actions" style="margin-top:8px"><button onclick="acceptOTC('${tid}')">✓ Accept full protocol</button></div>`;
  }
  b+=`</div>`;
  return b;
}

/* ---- Guided interview: the interview IS the algorithm ---- */
let guided=null; // {tpl,i,steps}
function buildSteps(t){
  const st=hmode()==='quick'?[{k:'rf'},{k:'vit'}]:[{k:'cc'},{k:'rf'},{k:'vit'}];
  visFields(t).forEach(f=>{st.push({k:'f',f:f.id}); if(f.id==='sx')st.push({k:'sev'});});
  if(ad.pid&&getP(ad.pid))st.push({k:'ads'},{k:'add'},{k:'done'});else st.push({k:'plan'},{k:'dispo'},{k:'done'});
  return st;
}
function startGuided(){guided={tpl:cur,i:0,steps:buildSteps(TPLS.find(t=>t.id===cur))};renderMain();document.getElementById('main').scrollTop=0;}
function gNext(){if(!guided)return;guided.i=Math.min(guided.i+1,guided.steps.length-1);renderMain();document.getElementById('main').scrollTop=0;}
function gBack(){if(!guided)return;guided.i=Math.max(guided.i-1,0);renderMain();document.getElementById('main').scrollTop=0;}
function gExit(){guided=null;renderMain();}
function gAllNeg(){if(ad.pid&&getP(ad.pid))adRfAll();else allNegRf(guided.tpl);gNext();}
function gToStep(k){if(!guided)return;const i=guided.steps.findIndex(x=>x.k===k);if(i>=0){guided.i=i;renderMain();document.getElementById('main').scrollTop=0;}}
function gEscalate(){
  const t=TPLS.find(x=>x.id===guided.tpl), s=state[guided.tpl];
  const pos=(t.redFlags||[]).filter(f=>s.rf[f]==='pos');
  if(pos.length&&!s.dispoTxt.trim())s.dispoTxt='ESCALATED — red flag present: '+pos.join('; ')+'. Referred to provider/ER per protocol; NCO/provider notified.';
  guided.i=guided.steps.findIndex(x=>x.k==='dispo');
  renderMain();document.getElementById('main').scrollTop=0;
}
function gOpenNote(){sheetTog(true);}
function gFieldCard(t,s,f){
  let inner=`<div class="fname">${f.tag} · ${f.name}</div><div class="qtxt">${ccAsk(t,s,f.id)||f.ask}</div>`;
  if(!f.customOnly){
    inner+=`<div class="chips">`;
    f.opts.forEach(o=>inner+=chipHtml(guided.tpl,f.id,o,s.fields[f.id].has(o)));
    ccExtraOpts(t,s,f.id).forEach(o=>{if(!f.opts.includes(o))inner+=chipHtml(guided.tpl,f.id,o,s.fields[f.id].has(o),false,true);});
    if(f.deny)f.deny.forEach(o=>inner+=chipHtml(guided.tpl,f.id,o,s.fields[f.id].has('DENY::'+o),true));
    inner+=`</div>`;
    if(f.groups){
      f.groups.forEach((g,gi)=>{
        const key='g::'+guided.tpl+'::'+f.id+'::'+gi;
        const cnt=g.opts.filter(o=>s.fields[f.id].has(o)).length;
        inner+=`<details class="dd" ${openDD.has(key)?'open':''} ontoggle="dd('${key}',this.open)"><summary>${g.g}${cnt?' <b class="cnt">'+cnt+'</b>':''}</summary><div class="chips">`;
        g.opts.forEach(o=>inner+=chipHtml(guided.tpl,f.id,o,s.fields[f.id].has(o)));
        inner+=`</div></details>`;
      });
    }
    fuQs(t,s,f.id).forEach(q=>inner+=`<div class="fuq">➜ ${q}</div>`);
  }
  inner+=`<input type="text" placeholder="${f.ph||'other / detail...'}" value="${s.custom[f.id]||''}" oninput="cust('${guided.tpl}','${f.id}',this.value)">`;
  return inner;
}
function renderGuided(){
  const t=TPLS.find(x=>x.id===guided.tpl), s=state[guided.tpl];
  const step=guided.steps[guided.i], total=guided.steps.length;
  let h=`<div class="gtop"><span>${t.icon} ${t.title.split('/')[0].trim()} — ${L('Guided interview','Entrevista guiada')}</span><span class="gn">${guided.i+1}/${total}</span><button class="xbtn" onclick="gExit()" aria-label="Close" title="Close guided interview"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`;
  h+=`<div class="gbar"><div style="width:${Math.round((guided.i+1)/total*100)}%"></div></div>`;
  let inner='';
  let controls=true;
  if(step.k==='cc'){
    inner=`<div class="fname">CC</div><div class="qtxt">"What brings you in today?"</div><div class="chips">`;
    t.ccOpts.forEach(o=>inner+=chipHtml(guided.tpl,'__cc',o,s.cc.has(o)));
    inner+=`</div><input type="text" placeholder="other CC..." value="${s.ccCustom}" oninput="cust('${guided.tpl}','__cc',this.value)">`;
  } else if(step.k==='rf'&&ad.pid&&getP(ad.pid)){
    const P=getP(ad.pid),anyP=rfList(P).some(f=>ad.rf[f]==='pos');
    inner='<div class="fname">🚩 '+L('Safety screening FIRST','Primero: seguridad')+' · '+P.id+'</div>'+adRfBlock(P);
    inner+=anyP?'<div class="rfbanner" style="margin-top:12px">🚩 '+L('RED FLAG — go straight to the decision and escalate.','BANDERA ROJA — ve directo a la decisión y escala.')+'</div><div class="algo-actions"><button style="background:var(--red);color:var(--on-red)" onclick="gToStep(\'add\')">⚠ '+L('Escalate ➜ decision','Escalar ➜ decisión')+'</button></div>'
      :'<div class="algo-actions"><button style="background:var(--green);color:var(--on-green)" onclick="gAllNeg()">✓ '+L('None — all negative, continue','Ninguna — todas negativas, continuar')+'</button></div>';
  } else if(step.k==='ads'){
    const P=getP(ad.pid);inner='<div class="fname">🩺 '+L('ADTMC screening','Tamizaje ADTMC')+' · '+P.id+' '+q$(P.title)+'</div>'+adScreenHtml(P,adEval(P),{noRf:true});
  } else if(step.k==='add'){
    const P=getP(ad.pid);inner='<div class="fname">✅ '+L('Decision and plan','Decisión y plan')+'</div>'+adDecisionHtml(P,adEval(P));
  } else if(step.k==='rf'){
    const anyPos=(t.redFlags||[]).some(f=>s.rf[f]==='pos');
    inner=`<div class="fname">🚩 Safety screening FIRST</div><div class="qtxt">Are any of these red flags present right now?</div><div class="chips">`;
    (t.redFlags||[]).forEach(f=>{
      const st2=s.rf[f]||'';const esc=f.replace(/'/g,"\\'");
      const cls=st2==='neg'?'rfn':(st2==='pos'?'rfp':'');
      const pre=st2==='neg'?'✓ neg: ':(st2==='pos'?'⚠ PRESENT: ':'');
      inner+=`<span class="chip ${cls}" onclick="cycleRf('${guided.tpl}','${esc}')">${pre}${f}</span>`;
    });
    inner+=`</div>`;
    if(anyPos){
      inner+=`<div class="rfbanner" style="margin-top:12px">🚩 RED FLAG — skip the rest of the interview and escalate.</div>`;
      inner+=`<div class="algo-actions"><button style="background:var(--red);color:var(--on-red)" onclick="gEscalate()">⚠ Escalate ➜ disposition</button></div>`;
    } else {
      inner+=`<div class="algo-actions"><button style="background:var(--green);color:var(--on-green)" onclick="gAllNeg()">✓ ${L('None — all negative, continue','Ninguna — todas negativas, continuar')}</button></div>`;
    }
  } else if(step.k==='vit'){
    const v=gVitals;
    inner=`<div class="fname">VS</div><div class="qtxt">Vitals (skip if not taken yet)</div><div class="vit">
      <label>BP<input type="text" value="${v.bp}" placeholder="120/80" oninput="setVit('x','bp',this.value)"></label>
      <label>HR<input type="text" value="${v.hr}" placeholder="72" oninput="setVit('x','hr',this.value)"></label>
      <label>RR<input type="text" value="${v.rr}" placeholder="16" oninput="setVit('x','rr',this.value)"></label>
      <label>TEMP<input type="text" value="${v.temp}" placeholder="98.6°F" oninput="setVit('x','temp',this.value)"></label>
      <label>SpO2<input type="text" value="${v.spo2}" placeholder="98%" oninput="setVit('x','spo2',this.value)"></label>
      <label>PAIN<input type="text" value="${v.pain}" placeholder="6/10" oninput="setVit('x','pain',this.value)"></label>
    </div>`;
  } else if(step.k==='sev'){
    inner=`<div class="fname">S · Severity</div><div class="qtxt">"0 to 10, how bad is it?"</div>
      <div class="sev"><input type="range" min="0" max="10" value="${s.sev===null?0:s.sev}" oninput="setSev('${guided.tpl}',this.value)"><span class="val">${s.sev===null?'—':s.sev+'/10'}</span></div>
      <div class="chips" style="margin-top:10px">
        <span class="chip ${s.duty==='Yes'?'on':''}" onclick="setDuty('${guided.tpl}','Yes')">interferes w/ duty/PT: Yes</span>
        <span class="chip ${s.duty==='No'?'on':''}" onclick="setDuty('${guided.tpl}','No')">No</span>
      </div>${s.sev!==null&&s.sev>=8?`<div class="fuq">⚠️ ${s.sev}/10 — review red flags and vitals before disposition.</div>`:''}`;
  } else if(step.k==='f'){
    inner=gFieldCard(t,s,t.fields.find(x=>x.id===step.f));
  } else if(step.k==='plan'){
    const nsaid=s.fields.a&&s.fields.a.has('NSAIDs (Motrin/Aspirin)');
    inner=`<div class="fname">📋 Plan</div><div class="qtxt">Select what you recommend</div>`;
    inner+=otcBoxHtml(t,s,guided.tpl);
    inner+=`<div class="chips">`;
    t.plan.forEach(p2=>{const esc=p2.replace(/'/g,"\\'");inner+=`<span class="chip ${s.plan.has(p2)?'on':''}" onclick="togPlan('${guided.tpl}','${esc}')">${p2}</span>`;});
    inner+=`</div>`;
  } else if(step.k==='dispo'){
    inner=`<div class="fname">🪖 Disposition</div><div class="qtxt">Recommendation — pending CoC/provider</div><div class="chips">`;
    Object.keys(t.dispo).forEach(k=>{inner+=`<span class="chip ${s.dispo===k?'on':''} ${/RTD|Light Duty|H2F|Quarters/i.test(k)&&(hasPosRF()||adForcesPN())?'blocked':''}" onclick="setDispo('${guided.tpl}','${k}')">${k}</span>`;});
    inner+=`</div><input type="text" placeholder="disposition text (editable)..." value="${s.dispoTxt.replace(/"/g,'&quot;')}" oninput="dispoTxt('${guided.tpl}',this.value)">`;
  } else if(step.k==='done'){
    controls=false;
    const active=TPLS.filter(x=>tplHasContent(x,state[x.id])).length;
    inner=`<div class="fname">✅ Done</div><div class="qtxt">Note ready${active>1?' — '+active+' sections combined':''} (see it in the right panel). What's next?</div>
      <div class="algo-actions">
        <button style="background:var(--green);color:var(--on-green)" onclick="savePatient(this);gExit();">💾 Save ➜ next Soldier</button>
        <button class="ghost" onclick="gExit()">➕ Another complaint (pick another template)</button>
        <button class="ghost" onclick="gExit()">${L('Open form view','Abrir formulario')}</button>
      </div>`;
  }
  h+=`<div class="algoq gcard">${inner}</div>`;
  if(controls){
    h+=`<div class="algo-actions"><button class="ghost" onclick="gBack()">‹ Back</button><button onclick="gNext()">Next ›</button><button class="ghost" onclick="gExit()">Form view</button></div>`;
    h+=`<div class="gskip">Nothing to select? "Next" also skips the question.</div>`;
  }
  return h;
}

/* ---- Reference data ---- */
const MEDS = [
 ['🔴 Fever / Pain Reducers',[
  ['Tylenol (Acetaminophen) 325 mg tabs','2 tabs (650 mg) PO q6h PRN fever/pain','ADTMC: max 2,600 mg/24h (8 tabs) · pediatric forms at pharmacy (2+): weight-based dose on the label · NOT with liver disease/alcohol'],
  ['Motrin (Ibuprofen) 200 mg tabs','2 tabs (400 mg) PO q6h PRN pain/fever/swelling, with food','⚠️ NOT with NSAID allergy, ulcer/GI bleed, pregnancy, renal disease · ADTMC: max 1,600 mg/24h (4 doses of 400 mg). The OTC label says 1,200 mg: if the local pharmacy is stricter, follow the local list']]],
 ['🌡️ Cold — Nasal Congestion / Decongestants',[
  ['Sudafed (Pseudoephedrine) 30 mg tabs · 6+','2 tabs (60 mg) PO q4–6h PRN congestion','max 8 tabs (240 mg)/24h · ⚠️ NOT in HTN, pregnancy, hyperthyroidism, BPH; may cause insomnia/palpitations'],
  ['Actifed (Pseudoephedrine/triprolidine) tabs · 12+','1 tab PO q4–6h PRN congestion/allergy','exact dose per the product box · ⚠️ sedating, NOT in HTN, do not drive'],
  ['Saline 0.65% nasal spray','2 sprays each nostril PRN','safe, no practical limit'],
  ['Afrin (Oxymetazoline) 0.05% nasal spray · 6+','2–3 sprays each nostril q10–12h PRN','⚠️ max 2 doses/24h and MAX 3 DAYS (rebound congestion)']]],
 ['🔵 Allergy — Sneezing / Runny Nose / Itchy Eyes-Throat',[
  ['Benadryl (Diphenhydramine) 25 mg tabs · 12+','1–2 tabs (25–50 mg) PO q6h PRN allergy/itching','max 300 mg/24h · ⚠️ very sedating: no driving or armed duty. Liquid 12.5 mg/5 mL (6+) at pharmacy'],
  ['Claritin (Loratadine) 10 mg tabs · 6+','1 tab PO daily','low sedation · liquid 1 mg/mL (2+) at pharmacy'],
  ['Zyrtec (Cetirizine) 10 mg tabs · 6+','1 tab PO daily','⚠️ may cause mild drowsiness · liquid 1 mg/mL (2+) at pharmacy'],
  ['Allegra (Fexofenadine) 180 mg tabs · 12+','1 tab PO daily with water','do NOT take with fruit juice (↓ absorption)'],
  ['Flonase (Fluticasone) 50 mcg/spray · 12+','2 sprays each nostril daily (then 1 spray daily for maintenance)','full effect takes days, not immediate relief']]],
 ['😮‍💨 Sore Throat / Cough / Chest Congestion',[
  ['Cepacol (Benzocaine/menthol) lozenges · 5+','1 lozenge dissolved slowly q2h PRN sore throat','daily max per label · sx >2 days or with fever → provider'],
  ['Robitussin (Guaifenesin) 100 mg/5 mL · 12+','10–20 mL PO q4h PRN chest congestion','max 6 doses/24h · with water/fluids'],
  ['Robitussin DM (Guaifenesin/dextromethorphan) 100 mg-10 mg/5 mL · 12+','10–20 mL PO q4h PRN cough + congestion','max 6 doses/24h · ⚠️ NOT with SSRI/antidepressant or MAOI; cough w/ blood/SOB → provider']]],
 ['🧴 Topical Preparations',[
  ['Bacitracin ointment (first aid antibiotic)','thin layer 1–3x/day on clean minor wound/abrasion','max 7 days · not on deep wounds, bites or severe burns'],
  ['Clotrimazole 1% vaginal cream (7-day) · 12+','1 full applicator intravaginally HS x7 nights','⚠️ first time, atypical sx or pregnancy → refer to provider first'],
  ['Lotrimin (Clotrimazole) 1% cream · 2+','thin layer BID. Athlete\'s foot x4 wk · jock itch/ringworm x2 wk','no improvement in 2 wk or worsening → provider']]],
 ['🤒 Upset Stomach / Constipation',[
  ['Maalox ES oral liquid','10–20 mL PO QID PRN (after meals and HS)','daily max per label · sx >2 wk → provider · liquid (2+) at pharmacy'],
  ['Pepto-Bismol (Bismuth subsalicylate) 262 mg tabs · 12+','2 tabs (524 mg) PO q30–60 min PRN diarrhea/nausea','max 8 doses/24h, no more than 2 days · ⚠️ NOT with ASA/NSAID allergy, anticoagulants, pregnancy · darkens stool/tongue (masks melena)'],
  ['Colace (Docusate sodium) 100 mg caps','1 cap PO BID PRN constipation','with glasses of water · >1 wk → provider'],
  ['Simethicone 40 mg/0.6 mL oral drops · 2+','adults: 1.2 mL (80 mg) PO q6h PRN bloating, after meals and HS','⚠️ drop formulation: confirm with the product label']]],
 ['💊 Supplements',[
  ['Vitamin D3 (Cholecalciferol) 25 mcg tabs (1,000 IU)','1 tab PO daily with food','supplement, does not treat an acute symptom']]],
 ['💧 Hydration (not a pharmacy-list med)',[
  ['ORS / Gatorade / fluids','1–2 L PO over 2–4h for dehydration','']]],
 ['⛔ NOT on the pharmacy list — verify availability before recommending',[
  ['Aspirin 325 mg','325 mg PO q6h PRN pain','⚠️ avoid if GI bleed / <18yo — not available in self-care'],
  ['Hydrocortisone 1% cream','thin layer BID','avoid face/genitals'],
  ['Melatonin','3–5 mg PO HS PRN insomnia',''],
  ['Imodium (Loperamide)','4 mg initial, then 2 mg after each loose stool','max 8 mg/24h'],
  ['Gas-X (Simethicone) 80 mg chew','80 mg PO q6h PRN bloating','list carries 40 mg/0.6 mL drops'],
  ['Miconazole OTC','per label','replaced by Clotrimazole 1% vaginal cream'],
  ['Debrox (carbamide peroxide)','drops BID x3–4d','cerumen: irrigation by provider'],
  ['Artificial tears','1–2 drops PRN','ocular: verify with pharmacy']]]
];

const QBANK = [
 ['🔴 OPQRST',[
  ['O','When did this start? · Sudden or gradual? · What were you doing when it started?'],
  ['P','What makes it worse? · What makes it better? · Worse with PT, ruck, movement, eating? · Does rest/fluids/meds help?'],
  ['Q','How would you describe the pain? · Sharp, dull, throbbing, burning, pressure, cramping?'],
  ['R','Where exactly is the pain? Point with one finger. · Does it move anywhere else — down your leg/arm/back/head?'],
  ['S','On a scale 0 to 10, how bad is it? · How much does it interfere with duty/PT?'],
  ['T','Constant or intermittent? · Worse morning, night, after PT, after chow? · Better, worse, or the same?']]],
 ['🔵 SAMPLE',[
  ['S','What other symptoms besides the main complaint? · Fever, chills, nausea, vomiting, diarrhea, dizziness, cough, SOB, chest pain?'],
  ['A','Any allergies to meds, food, latex? · Allergic to Motrin, Tylenol, antibiotics?'],
  ['M','What meds are you taking now? · Any OTC, supplements, protein powders?'],
  ['P','Any medical problems I should know about? · Asthma, diabetes, high BP, migraines, anxiety? · Had this before?'],
  ['L','Last time you ate or drank? Did you tolerate it? · Alcohol or energy drinks recently?'],
  ['E','What were you doing before this started? · During PT, ruck, duty, after chow? · Sick contacts, cold exposure, stress?']]]
];

const ASSESS = [
 ['🦶 Ottawa Ankle Rules (does it need an X-ray?)',[
  ['ANKLE X-ray if','malleolar pain + any: bony TTP at posterior edge/tip of lateral OR medial malleolus, OR unable to take 4 steps (now AND at time of injury)'],
  ['FOOT X-ray if','midfoot pain + any: TTP at base of 5th metatarsal, OR navicular TTP, OR unable to take 4 steps'],
  ['Key','if Ottawa negative, fracture probability is very low → conservative management is reasonable']]],
 ['🦵 Ottawa Knee Rules',[
  ['KNEE X-ray if','age ≥55, OR isolated patellar TTP, OR fibular head TTP, OR unable to flex to 90°, OR unable to take 4 steps']]],
 ['🧪 Special tests MSK (screening 68W)',[
  ['SLR (Straight Leg Raise)','supine, raise straight leg 30–70°. POS if it reproduces RADICULAR pain below the knee (not just low back) → radiculopathy'],
  ['Anterior/Posterior Drawer (knee)','90° flexion, pull/push the tibia. Excess translation vs. the good side → ACL/PCL'],
  ['Varus/Valgus stress','knee at 0° and 30°, medial/lateral force. Laxity or pain → MCL/LCL'],
  ['Empty Can (shoulder)','arms 90° abduction, 30° forward, thumbs down, resist upward. Pain/weakness → supraspinatus'],
  ['Painful Arc','pain only between 60–120° of abduction → subacromial impingement'],
  ['FABER (hip)','figure-4. GROIN pain → hip; POSTERIOR pain → sacroiliac'],
  ['Log Roll (hip)','roll the extended leg. Groin pain → intra-articular pathology'],
  ['Tragus pull / chewing (ear)','pain on pulling tragus/pinna → otitis EXTERNA. Red/bulging TM on otoscope → otitis MEDIA']]],
 ['⚡ Quick dermatomes (neuro screening)',[
  ['L4','sensation medial malleolus · strength: ankle dorsiflexion · patellar reflex'],
  ['L5','sensation dorsum of foot / 1st web space · strength: great toe extension'],
  ['S1','sensation lateral foot · strength: plantarflexion (toe raise) · Achilles reflex'],
  ['C6','sensation thumb · biceps reflex'],
  ['C7','sensation middle finger · triceps reflex · elbow extension'],
  ['C8','sensation little finger · grip strength']]],
 ['💧 Signs of dehydration',[
  ['Mild–moderate','dry mucous membranes, thirst, dark/scant urine, cap refill >2 sec, mild tachycardia'],
  ['Orthostatics','BP and HR supine → standing (1–3 min). POS if systolic drops ≥20 or HR rises ≥30 → significant dehydration'],
  ['Severa (→ ER)','lethargy, no urine, dizziness that does not resolve, sustained high HR, cannot tolerate PO']]],
 ['🫃 Abdomen — when to escalate',[
  ['Technique','palpate gently first, start AWAY from the pain, watch the patient\'s face'],
  ['Rebound / Guarding','pain on RELEASE or involuntary rigidity → surgical abdomen until proven otherwise → provider/ER'],
  ['McBurney (RLQ)','TTP at the point between umbilicus and right iliac crest → suspect appendicitis'],
  ['Murphy','RUQ TTP that halts inspiration → suspect gallbladder']]],
 ['👁️ Quick eye / neuro',[
  ['PERRL','equal, round, reactive to light. New anisocoria → escalate'],
  ['Gross acuity','counts fingers? reads phone text? Sudden loss → ER'],
  ['Neuro screening','oriented x4, clear speech, symmetric strength and sensation, steady gait']]]
];

const PROFILES = [
 ['🛌 Rest / Light Duty (RTD with limitations)',[
  'RTD today w/ light duty. No PT, no ruck, no lifting >20 lbs for 24–48h.',
  'RTD w/ duty mods: no running, no jumping, no prolonged standing >30 min. Light duty 48h.',
  'RTD to unit. Recommend rest, hydration, OTC meds. Avoid strenuous activity 24h.',
  'RTD today, excused from PT only for 1 day.',
  'RTD w/ restrictions until re-evaluated if symptoms persist >3d.']],
 ['🛏️ Quarters (24h max, pending approval)',[
  'Recommend quarters x24h for fever, chills, body aches. Monitor hydration.',
  'Quarters 24h for GI upset (diarrhea, vomiting). Re-eval if no improvement.',
  'Recommend quarters until 0600 tomorrow for flu-like sx. RTD if improved.',
  'Quarters 24h, excused from duty/PT. OTC meds + hydration. RTD if afebrile and sx improved.',
  'Recommend quarters for rest and recovery 1 day. Follow up if worsening or no improvement.']],
 ['⚠️ Safe wording (recommendation, NOT a medical order)',[
  'Recommend quarters x24h (pending CoC/provider approval).',
  'Recommend light duty for 48h (per CoC guidance).',
  'Meds are recommendations; to be picked up at Mendoza Pharmacy, not prescribed.',
  'Self-care OTC meds recommended per Self-Care OTC Medication List (Feb 2024) — pick up at Mendoza Pharmacy, no clinic visit required. Not a prescription.',
  'Max 4 OTC items per week per Self-Care OTC list; additional needs → provider evaluation.']],
 ['💊 Med recommendation (self-care, Mendoza Pharmacy)',[
  'Self-care OTC recommended: Tylenol 325 mg x2 tabs q6h PRN pain/fever and Motrin 200 mg x2 tabs q6h PRN w/ food. Pick up at Mendoza Pharmacy.',
  'Self-care OTC recommended: Claritin 10 mg daily + Saline 0.65% nasal spray PRN for allergy/congestion. Pick up at Mendoza Pharmacy.',
  'Self-care OTC recommended: Robitussin DM 10–20 mL q4h PRN cough + hydration. Pick up at Mendoza Pharmacy. Re-eval if >1 week or SOB.',
  'Self-care OTC recommended: Pepto-Bismol 262 mg x2 tabs PRN diarrhea + hydration/BRAT diet. Pick up at Mendoza Pharmacy. Re-eval if >48h or bloody stool.',
  'Self-care OTC recommended: Maalox ES 10–20 mL after meals/HS PRN indigestion. Pick up at Mendoza Pharmacy.',
  'Self-care OTC recommended: Lotrimin (clotrimazole) 1% cream BID — athletes foot x4 wk, jock itch/ringworm x2 wk. Pick up at Mendoza Pharmacy.',
  'Self-care OTC recommended: Bacitracin ointment thin layer 1–3x/day to clean minor wound, max 7 days. Pick up at Mendoza Pharmacy.']],
 ['🏃 H2F Referral (MSK, no red flags)',[
  'RTD — no red flags. Recommend referral to H2F for running/gait instruction, strengthening of weak muscle groups, and injury-prevention classes. Continue conservative care.',
  'RTD w/ light duty x48h (no ruck, no lifting >20 lbs, no running/jumping), then recommend H2F referral for strengthening and return-to-run progression.',
  'Recommend H2F referral for recurrent/overuse MSK pain — movement screen, strength and conditioning, running mechanics. Re-eval at sick call if worsening.']]
];

/* =========================================================
   STATE
========================================================= */
const state = {};   // per-template selections
let patient='';
let editMode=false;
let gVitals={bp:'',hr:'',rr:'',temp:'',spo2:'',pain:''};
function resetState(id){
  const t=TPLS.find(x=>x.id===id);
  state[id]={cc:new Set(),ccCustom:'',fields:{},custom:{},sev:null,duty:null,plan:new Set(),dispo:null,dispoTxt:'',rf:{}};
  t.fields.forEach(f=>{state[id].fields[f.id]=new Set();state[id].custom[f.id]='';});
}
function resetVitals(){gVitals.bp='';gVitals.hr='';gVitals.rr='';gVitals.temp='';gVitals.spo2='';gVitals.pain='';}
TPLS.forEach(t=>resetState(t.id));
let cur='msk';
let view='adtmc'; // adtmc (index) | tpl (case: protocol + OPQRST/AMPLE) | admeds | preguntas | perfiles | guardados
const openDD=new Set();
function dd(k,open){open?openDD.add(k):openDD.delete(k);}
/* Folded sections: each block is a one-line row with a summary; tap to open. Nothing is lost when closed.
   Secciones plegadas: cada bloque es una línea con resumen; toca para abrir. No se pierde nada al cerrar. */
let foldCur={},foldPid=null;
function foldOn(){return settings.fold!==false;}
function isFold(k,auto){if(!foldOn())return true;if(k in foldCur)return foldCur[k];const p=(settings.foldSt||{})[k];return p===undefined?!!auto:p;}
function foldTog(k,auto){const o=!isFold(k,auto);foldCur[k]=o;if(k!=='cc'){settings.foldSt=Object.assign({},settings.foldSt||{},{[k]:o});saveSettings();}renderMain();}
function foldRow(k,title,sum,open,auto){if(!foldOn())return'';return '<div class="fold'+(open?' open':'')+'" role="button" aria-expanded="'+open+'" onclick="foldTog(\''+k+'\','+(auto?1:0)+')"><span class="chev">›</span><b>'+title+'</b><span class="fsum">'+sum+'</span></div>';}

/* ---- persistence (sobrevive refresh / cierre accidental) ---- */
function persist(){
  try{
    const dump={cur,patient:(typeof piiFind==='function'&&piiFind(patient).length)?'':patient,day:new Date().toDateString(),state:{}};
    for(const k in state){const s=state[k];
      dump.state[k]={cc:[...s.cc],ccCustom:(typeof piiFind==='function'&&piiFind(String(s.ccCustom||'')).length)?'':s.ccCustom,
        fields:Object.fromEntries(Object.entries(s.fields).map(([a,b])=>[a,[...b]])),
        custom:Object.fromEntries(Object.entries(s.custom||{}).map(([a,b])=>[a,(typeof piiFind==='function'&&piiFind(String(b||'')).length)?'':b])),sev:s.sev,duty:s.duty,plan:[...s.plan],dispo:s.dispo,dispoTxt:s.dispoTxt,rf:s.rf};}
    dump.gVitals=gVitals;
    localStorage.setItem('sc_state',JSON.stringify(dump));
  }catch(e){}
}
function restore(){
  try{
    const d=JSON.parse(localStorage.getItem('sc_state')||'null'); if(!d||(settings.purge&&d.day!==new Date().toDateString()))return;
    if(d.cur&&TPLS.find(x=>x.id===d.cur))cur=d.cur;
    patient=d.patient||'';
    for(const k in (d.state||{})){
      if(!state[k])continue; const src=d.state[k],dst=state[k];
      dst.cc=new Set(src.cc||[]); dst.ccCustom=src.ccCustom||'';
      for(const fid in dst.fields){dst.fields[fid]=new Set(((src.fields||{})[fid])||[]);dst.custom[fid]=((src.custom||{})[fid])||'';}
      dst.sev=(src.sev===undefined?null:src.sev); dst.duty=src.duty||null;
      dst.plan=new Set(src.plan||[]); dst.dispo=src.dispo||null; dst.dispoTxt=src.dispoTxt||'';
      dst.rf=Object.assign({},src.rf||{});
    }
    Object.assign(gVitals,d.gVitals||{});
  }catch(e){}
}

/* =========================================================
   RENDER NAV
========================================================= */
function renderNav(){
  const n=document.getElementById('nav');
  let h='<div class="grp">Sick call — ADTMC index</div>';
  h+=`<button class="${view==='adtmc'?'active':''}" onclick="goRef('adtmc')">🧭 Index / search${(ad.pid||ad.log.length)?' <span style="color:var(--green)">●</span>':''}<span class="k">D</span></button>`;
  const curP=ad.pid?getP(ad.pid):null;
  Object.keys(CATS).forEach(c=>{
    const items=PR.filter(p=>p.cat===c);
    const open=(curP&&curP.cat===c&&view==='tpl')||openDD.has('nav'+c);
    const any=items.some(p=>ad.pid===p.id||ad.log.some(x=>x.id===p.id));
    h+=`<details class="navgrp" ${open?'open':''} ontoggle="dd('nav${c}',this.open)"><summary>${CATS[c]} <span class="dim">(${items.length})</span>${any?' <span style="color:var(--green)">●</span>':''}</summary>`;
    items.forEach(p=>{const done=ad.log.some(x=>x.id===p.id);
      h+=`<button class="sub ${ad.pid===p.id&&view==='tpl'?'active':''}" onclick="adOpen('${p.id}')"><span class="pid">${p.id}</span> ${q$(p.title)}${done?' <span style="color:var(--green)">✓</span>':''}</button>`;});
    h+='</details>';
  });
  h+='<div class="grp">Reference</div>';
  h+=`<button class="${view==='admeds'?'active':''}" onclick="goRef('admeds')">💊 Meds (ADTMC App. C)<span class="k">M</span></button>`;
  h+=`<button class="${view==='preguntas'?'active':''}" onclick="goRef('preguntas')">❓ OPQRST/SAMPLE Questions<span class="k">Q</span></button>`;
  h+=`<button class="${view==='assess'?'active':''}" onclick="goRef('assess')">🧪 Assessments / Tests<span class="k">A</span></button>`;
  h+=`<button class="${view==='mace'?'active':''}" onclick="goRef('mace')">🧠 MACE 2 (concussion)</button>`;
  h+=`<button class="${view==='perfiles'?'active':''}" onclick="goRef('perfiles')">🪖 Profiles / Wording<span class="k">P</span></button>`;
  const nSaved=getSaved().length;
  h+=`<button class="${view==='guardados'?'active':''}" onclick="goRef('guardados')">💾 Saved${nSaved?' ('+nSaved+')':''}<span class="k">G</span></button>`;
  h+=`<button class="${view==='ajustes'?'active':''}" onclick="goRef('ajustes')">⚙️ Settings / Privacy</button>`;
  n.innerHTML=h;
  updTabs();updPeek();updMulti();try{piiNoteWarn(piiFind(document.getElementById('note').textContent));}catch(e){}
}
/* ===== Phone: bottom tab bar + note sheet ===== */
const TAB_OF={adtmc:'adtmc',tpl:'adtmc',queue:'adtmc',admeds:'admeds',mace:'mace',guardados:'guardados',more:'more',preguntas:'more',assess:'more',perfiles:'more',ajustes:'more'};
function updTabs(){const t=TAB_OF[view]||'adtmc';document.querySelectorAll('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.v===t));}
function tabGo(v){sheetTog(false);if(v==='adtmc'&&ad.pid&&view!=='tpl'&&view!=='adtmc'){const m=protoTpl(ad.pid);cur=m.tid;view='tpl';renderNav();renderMain();renderNote();document.getElementById('main').scrollTop=0;return;}goRef(v);}
function sheetTog(open){const a=document.getElementById('aside');if(!a)return;const o=open===undefined?!a.classList.contains('open'):!!open;a.classList.toggle('open',o);document.body.classList.toggle('sheet-open',o);}
function updPeek(){
  const t=document.getElementById('pkT'),s=document.getElementById('pkS');if(!t||!s)return;
  let hi=null;try{hi=adHighest();}catch(e){}
  t.textContent=L('Note','Nota')+(hi&&LV[hi]?' · '+LV[hi].s:'');
  const txt=(document.getElementById('note')||{}).textContent||'';
  const ln=txt.split('\n').map(x=>x.trim()).filter(Boolean);
  const cc=ln.find(x=>/^(CC|S):/.test(x));
  s.textContent=cc?cc.replace(/^(CC|S):\s*/,''):(ln.length>1?L('Tap to open','Toca para abrir'):L('Tap options — the note builds itself','Toca opciones — la nota se arma sola'));
}
function renderMore(){
  const row=(ic,txt,on)=>'<div class="prow" onclick="'+on+'"><span class="ptit">'+ic+' '+txt+'</span><span class="dim">›</span></div>';
  let h='<h2 class="tpl">'+L('More','Más')+'</h2><p class="tpl-sub">'+L('Reference, saved notes and settings.','Referencias, notas guardadas y ajustes.')+'</p><div class="plist">';
  h+=row('📷',L('Scan patient QR','Escanear QR del paciente'),'iqScan()')+row('📋',L('Triage list','Lista de triaje')+(iqList.length?' ('+iqList.filter(e=>!e.seen).length+')':''),"goRef('queue')")+row('🖨',L('Clinic QR poster (print)','Póster QR de la clínica (imprimir)'),"window.open('poster.html','_blank')");
  h+='</div><div class="plist" style="margin-top:14px">';
  h+=row('❓','OPQRST/SAMPLE Questions',"goRef('preguntas')")+row('🧪','Assessments / Tests',"goRef('assess')")+row('🪖','Profiles / Wording',"goRef('perfiles')")+row('⚙️','Settings / Privacy',"goRef('ajustes')");
  h+='</div><div class="field" style="margin-top:14px"><div class="lab"><span class="tag">Aa</span><span class="name">'+L('Text size','Tamaño de letra')+'</span><span class="ask">'+fsBase+' px</span></div><div class="algo-actions" style="margin-top:0"><button class="ghost" onclick="setFs(-1);renderMain()">A−</button><button class="ghost" onclick="setFs(1);renderMain()">A+</button></div></div>';
  h+='<div class="field"><div class="lab"><span class="tag o">⌫</span><span class="name">'+L('Clear','Borrar')+'</span></div><div class="algo-actions" style="margin-top:0"><button class="ghost" onclick="resetTpl()">Clear section</button><button class="danger" onclick="clearAllAsk(this)">Clear all</button></div></div>';
  return h;
}
function go(id){if(guided&&guided.tpl!==id)guided=null;cur=id;view='tpl';renderNav();renderMain();renderNote();document.getElementById('main').scrollTop=0;}
function goRef(v){view=v;renderNav();renderMain();document.getElementById('main').scrollTop=0;}

/* =========================================================
   RENDER MAIN
========================================================= */
function chipHtml(tid,fid,opt,on,deny=false,extra=false){
  const esc=opt.replace(/'/g,"\\'");
  return `<span class="chip ${on?'on':''} ${deny?'deny':''} ${extra?'x':''}" onclick="tog('${tid}','${fid}','${esc}',${deny})">${deny?(on?'denies ':'deny? '):''}${opt}</span>`;
}
function ccExtraOpts(t,s,fid){
  if(!t.ccExtras)return[];
  const out=[];
  [...s.cc].forEach(cc=>{
    const pack=t.ccExtras[cc];
    if(pack&&pack[fid])pack[fid].forEach(o=>{if(!out.includes(o))out.push(o);});
  });
  return out;
}
function ccAsk(t,s,fid){
  if(!t.ccAsk)return null;
  for(const cc of [...s.cc]){const p=t.ccAsk[cc];if(p&&p[fid])return p[fid];}
  return null;
}
function fuQs(t,s,fid){
  const out=[];
  if(t.fuQ&&t.fuQ[fid]){
    for(const opt in t.fuQ[fid]){ if(s.fields[fid].has(opt)) out.push(t.fuQ[fid][opt]); }
  }
  return out;
}
function renderMain(){
  const m=document.getElementById('main');
  if(view==='adtmc'){m.innerHTML=renderAD();return;}
  if(view==='admeds'){m.innerHTML=renderADMeds();return;}
  if(view==='ajustes'){m.innerHTML=renderSettings();return;}
  if(view==='preguntas'){m.innerHTML=renderQ();return;}
  if(view==='perfiles'){m.innerHTML=renderProfiles();return;}
  if(view==='guardados'){m.innerHTML=renderSaved();return;}
  if(view==='assess'){m.innerHTML=renderAssess();return;}
  if(view==='mace'){m.innerHTML=renderMace();return;}
  if(view==='more'){m.innerHTML=renderMore();return;}
  if(view==='queue'){m.innerHTML=renderQueue();return;}
  if(guided&&view==='tpl'&&guided.tpl===cur){m.innerHTML=renderGuided();return;}
  const t=TPLS.find(x=>x.id===cur), s=state[cur];
  const _hlab={quick:'Reason for visit',focus:'Focused history'}[hmode()]||'History — OPQRST / AMPLE';
  const _rfTop=ad.pid&&getP(ad.pid)&&rfList(getP(ad.pid)).length;
  const _fo=ad.pid&&foldOn();let _sn=0;const _sec=(t)=>'<div class="secbar sb2">'+(++_sn)+' · '+t+'</div>';
  if(ad.pid&&foldPid!==ad.pid){foldPid=ad.pid;delete foldCur.cc;}
  let h=ad.pid?(adHeadHtml(getP(ad.pid))+(_fo?_sec(L('Complaint','Motivo de consulta')):'<div class="secbar">1 · '+(_rfTop?L('Chief complaint & red flags','Motivo de consulta y banderas rojas'):_hlab)+'</div>')):`<h2 class="tpl">${t.icon} ${t.title}</h2><p class="tpl-sub">Select the CC first — <span style="color:var(--chipx-txt)">green problem-specific options</span> will appear in each field. Dashed = "denies". The note builds on the right.</p>`;
  if(hmode()!=='quick')h+=_fo?'<button class="gstart sm" onclick="startGuided()">▶ '+L('Guided interview','Entrevista guiada')+'</button>':`<button class="gstart" onclick="startGuided()">▶ Guided interview — one question at a time</button>`;
  if(hmode()!=='quick')h+=`<div class="warn">${t.er}</div>`;
  if(hmode()!=='full')h+=`<div class="note-hint">${hmode()==='quick'?'This visit does not need a full history.':'Focused history for this complaint.'} <span class="chip" onclick="adFullHist()">+ Add full OPQRST / AMPLE</span></div>`;
  if(!ad.pid)h+=adPatientCard()+adVBanner();

  // Vitals (global — per patient, shared across sections)
  const vv=gVitals;
  if(!ad.pid)h+=`<div class="field"><div class="lab"><span class="tag">VS</span><span class="name">Vitals</span><span class="ask">added at the top of the note</span></div><div class="vit">
    <label>BP<input type="text" value="${vv.bp}" placeholder="120/80" oninput="setVit('${cur}','bp',this.value)"></label>
    <label>HR<input type="text" value="${vv.hr}" placeholder="72" oninput="setVit('${cur}','hr',this.value)"></label>
    <label>RR<input type="text" value="${vv.rr}" placeholder="16" oninput="setVit('${cur}','rr',this.value)"></label>
    <label>TEMP<input type="text" value="${vv.temp}" placeholder="98.6°F" oninput="setVit('${cur}','temp',this.value)"></label>
    <label>SpO2<input type="text" value="${vv.spo2}" placeholder="98%" oninput="setVit('${cur}','spo2',this.value)"></label>
    <label>PAIN<input type="text" value="${vv.pain}" placeholder="6/10" oninput="setVit('${cur}','pain',this.value)"></label>
  </div></div>`;

  // CC
  let _ccOpen=true;
  if(_fo){const _cs=[...s.cc].concat(s.ccCustom&&s.ccCustom.trim()?[s.ccCustom.trim()]:[]);
    if(!('cc' in foldCur))foldCur.cc=!_cs.length;
    _ccOpen=isFold('cc');
    h+=foldRow('cc',hmode()==='quick'?L('Reason for visit','Motivo de la visita'):L('Chief complaint','Motivo de consulta'),_cs.length?'<span class="ok">'+q$(_cs.join(', '))+' ✓</span>':L('tap to choose','toca para elegir'),_ccOpen);}
  if(_ccOpen){
  h+=`<div class="field${_fo?' fbody':''}"><div class="lab"><span class="tag">CC</span><span class="name">${hmode()==='quick'?'Reason for visit':'Chief Complaint'}</span><span class="ask">${hmode()==='quick'?'':'"What brings you in today?"'}</span>${clrBtn(cur,'__cc')}</div>`;
  if(hmode()!=='quick'){h+=`<div class="chips">`;
  t.ccOpts.forEach(o=>h+=chipHtml(cur,'__cc',o,s.cc.has(o)));
  h+=`</div>`;}
  if(s.cc.size>=2)h+=`<div class="fuq">💡 ${s.cc.size} complaints in this section. If they share a mechanism (e.g. fall → knee + wrist), document them together and use "other/detail" to tell sides apart. If they are different systems, open them in separate templates — they combine on their own in the same note.</div>`;
  h+=`<input type="text" placeholder="other CC..." value="${s.ccCustom}" oninput="cust('${cur}','__cc',this.value)"></div>`;
  }
  if(!ad.pid)h+=adSuggestHtml(t,s);
  if(ad.pid&&getP(ad.pid)){const _pp=getP(ad.pid);if(rfList(_pp).length){h+=(_fo?_sec('🚩 '+L('Red flags — screen first','Banderas rojas — primero')):'<div class="secbar">🚩 '+L('Red flags — screen first','Banderas rojas — primero')+'</div>')+adRfBlock(_pp);
    if(rfList(_pp).some(f=>ad.rf[f]==='pos'))h+='<div class="rfbanner">🚩 '+L('Red flag present → Provider Now. You can skip the rest of the history: ','Bandera roja → Provider Now. Puedes saltarte el resto de la historia: ')+'<span class="scr-link" onclick="var e=document.querySelector(\'.resbox\');if(e)e.scrollIntoView({behavior:\'smooth\',block:\'center\'})">'+L('go to decision','ir a la decisión')+' ›</span></div>';
    if(!_fo)h+='<div class="secbar">'+_hlab+'</div>';}}

  // fields — answered letters collapse into a one-line summary as you move on (compact history)
  const vf=visFields(t),hasC=f=>s.fields[f.id].size>0||!!(s.custom[f.id]||'').trim();
  const fi=settings.hcompact===false||!s.focus?-1:vf.findIndex(f=>f.id===s.focus);
  let _hOpen=true;
  if(_fo){h+=_sec(L('History','Historia'));const _nd=vf.filter(hasC).length;
    _hOpen=isFold('hist');
    h+=foldRow('hist',hmode()==='full'?'OPQRST / AMPLE':_hlab,_nd+' '+L('of','de')+' '+vf.length+(s.sev!==null?' · '+s.sev+'/10':''),_hOpen);}
  if(_hOpen){
  h+='<div class="hwrap'+(_fo?' fbody':'')+'">';
  if(vf.length>2){
    h+='<div class="hprog">'+vf.map(f=>'<span class="hl'+(hasC(f)?' done':'')+(f.id===s.focus?' cur':'')+'" onclick="fOpen(\''+cur+'\',\''+f.id+'\')" title="'+q$(f.name)+'">'+f.tag+'</span>').join('')+(fi>0?'<span class="hall" onclick="fOpen(\''+cur+'\',null)">'+L('Show all','Ver todo')+'</span>':'')+'</div>';
  }
  vf.forEach((f,i)=>{
    if(i<fi){
      const sum=hasC(f)?joinSel(f,s):'';
      h+='<div class="field fcol'+(sum?'':' empty')+'" id="fld_'+f.id+'" onclick="fOpen(\''+cur+'\',\''+f.id+'\')"><span class="tag">'+f.tag+'</span><span class="name">'+f.name+'</span><span class="fsum">'+(sum?q$(sum):L('not asked','sin preguntar'))+'</span><span class="chev">›</span></div>';
      return;
    }
    const tagClass = 'OPQRT'.includes(f.tag)&&['o','pw','pb','q','r','rr','t'].includes(f.id)?'o':(['sx','a','m','phx','l','e','s2','m','seen','lmp'].includes(f.id)?'s2':'');
    h+=`<div class="field${f.id===s.focus?' fcur':''}" id="fld_${f.id}"><div class="lab"><span class="tag ${tagClass}">${f.tag}</span><span class="name">${f.name}</span><span class="ask">${ccAsk(t,s,f.id)||f.ask}</span>${clrBtn(cur,f.id)}</div>`;
    if(!f.customOnly){
      h+=`<div class="chips">`;
      f.opts.forEach(o=>h+=chipHtml(cur,f.id,o,s.fields[f.id].has(o)));
      ccExtraOpts(t,s,f.id).forEach(o=>{ if(!f.opts.includes(o)) h+=chipHtml(cur,f.id,o,s.fields[f.id].has(o),false,true); });
      if(f.deny) f.deny.forEach(o=>h+=chipHtml(cur,f.id,o,s.fields[f.id].has('DENY::'+o),true));
      h+=`</div>`;
      if(f.groups){
        f.groups.forEach((g,gi)=>{
          const key=cur+'::'+f.id+'::'+gi;
          const cnt=g.opts.filter(o=>s.fields[f.id].has(o)).length;
          h+=`<details class="dd" ${openDD.has(key)?'open':''} ontoggle="dd('${key}',this.open)"><summary>${g.g}${cnt?' <b class="cnt">'+cnt+'</b>':''}</summary><div class="chips">`;
          g.opts.forEach(o=>h+=chipHtml(cur,f.id,o,s.fields[f.id].has(o)));
          h+=`</div></details>`;
        });
      }
      fuQs(t,s,f.id).forEach(q=>h+=`<div class="fuq">➜ ${q}</div>`);
    }
    h+=`<input type="text" placeholder="${f.ph||'other / detail...'}" value="${s.custom[f.id]||''}" oninput="cust('${cur}','${f.id}',this.value)"></div>`;
  });
  h+='</div>';

  // Severity (all templates)
  h+=`<div class="field"><div class="lab"><span class="tag o">S</span><span class="name">Severity</span><span class="ask">"0 to 10, how bad is it?"</span>${clrBtn(cur,'__sev')}</div>
    <div class="sev"><input type="range" min="0" max="10" value="${s.sev===null?0:s.sev}" oninput="setSev('${cur}',this.value)"><span class="val">${s.sev===null?'—':s.sev+'/10'}</span></div>
    <div class="chips" style="margin-top:8px">
      <span class="chip ${s.duty==='Yes'?'on':''}" onclick="setDuty('${cur}','Yes')">interferes w/ duty/PT: Yes</span>
      <span class="chip ${s.duty==='No'?'on':''}" onclick="setDuty('${cur}','No')">No</span>
    </div>${s.sev!==null&&s.sev>=8?`<div class="fuq">⚠️ ${s.sev}/10 is high severity — review the red flags above and confirm vitals before deciding disposition.</div>`:''}</div>`;
  }

  // Red Flags screening
  if(t.redFlags&&!ad.pid){
    const anyPos=t.redFlags.some(f=>s.rf[f]==='pos');
    if(anyPos)h+=`<div class="rfbanner">🚩 POSITIVE RED FLAG — do NOT recommend RTD/Light Duty/H2F/quarters. Escalate to provider/ER per protocol and notify your NCO/provider.</div>`;
    h+=`<div class="field"><div class="lab"><span class="tag" style="color:var(--red)">🚩</span><span class="name">Red Flags — screening before disposition</span><span class="ask">tap once = negative (green) · twice = PRESENT (red)</span></div><div class="chips">`;
    h+=`<span class="chip" onclick="allNegRf('${cur}')">✓✓ all negative</span>`;
    t.redFlags.forEach(f=>{
      const st=s.rf[f]||'';
      const esc=f.replace(/'/g,"\\'");
      const cls=st==='neg'?'rfn':(st==='pos'?'rfp':'');
      const pre=st==='neg'?'✓ neg: ':(st==='pos'?'⚠ PRESENT: ':'');
      h+=`<span class="chip ${cls}" onclick="cycleRf('${cur}','${esc}')">${pre}${f}</span>`;
    });
    h+=`</div></div>`;
  }

  if(!ad.pid){
  // Plan
  h+=`<div class="field"><div class="lab"><span class="tag">📋</span><span class="name">Plan / Recommendations</span><span class="ask">check what you recommend</span></div>`;
  if(!ad.pid)h+=otcBoxHtml(t,s,cur);
  h+=`<div class="chips">`;
  t.plan.forEach(p=>{const esc=p.replace(/'/g,"\\'");h+=`<span class="chip ${s.plan.has(p)?'on':''}" onclick="togPlan('${cur}','${esc}')">${p}</span>`;});
  h+=`</div></div>`;

  // Dispo
  h+=`<div class="field"><div class="lab"><span class="tag">🪖</span><span class="name">Disposition / Profile</span><span class="ask">recommendation — pending CoC/provider</span></div><div class="chips">`;
  Object.keys(t.dispo).forEach(k=>{h+=`<span class="chip ${s.dispo===k?'on':''} ${/RTD|Light Duty|H2F|Quarters/i.test(k)&&(hasPosRF()||adForcesPN())?'blocked':''}" onclick="setDispo('${cur}','${k}')">${k}</span>`;});
  h+=`</div>`;
  if(t.id==='msk'&&!t.redFlags.some(f=>s.rf[f]==='pos'))h+=`<div class="fuq">💡 MSK without red flags: Light Duty for acute injuries · H2F to learn to run, strengthen weak muscles and for prevention (you can combine them as "Light Duty + H2F").</div>`;
  h+=`<input type="text" placeholder="disposition text (editable)..." value="${s.dispoTxt}" oninput="dispoTxt('${cur}',this.value)"></div>`;

  }
  if(ad.pid){const _p=getP(ad.pid),_R=adEval(_p);h+=(_fo?_sec(L('ADTMC decision points','Puntos de decisión ADTMC')):'<div class="secbar">2 · '+L('ADTMC decision points','Puntos de decisión ADTMC')+'</div>')+adScreenHtml(_p,_R,{noRf:true})+(_fo?_sec(L('Plan','Plan')):'<div class="secbar">3 · Decision and plan</div>')+adDecisionHtml(_p,_R);}
  h+=`<div class="note-hint${_fo?' foot':''}">💡 Remember: write it as a <b>recommendation</b> under CoC/provider supervision, not as a medical order. Meds → "to be picked up at Mendoza Pharmacy".</div>`;
  m.innerHTML=h;
}

/* ---- reference renders ---- */
function renderMeds(){
  let h=`<h2 class="tpl">💊 Meds — Pharmacy list (Self-Care OTC, Feb 2024)</h2><p class="tpl-sub">Only what can be given and picked up at Mendoza Pharmacy without going through the clinic. Dose = adult (12+) per OTC label; pediatric forms on the list (liquids/chewables, 2+) → weight-based dosing on the label, not here. <b>Max 4 items per week per family.</b> Self-care only — not a prescription.</p><div class="ref">`;
  MEDS.forEach(([sec,rows])=>{
    const off=sec.startsWith('⛔');
    h+=`<h3${off?' style="color:var(--red)"':''}>${sec}</h3><table><tr><th>Med</th><th>Dose (adult)</th><th>⚠️ / Notes</th></tr>`;
    rows.forEach(r=>h+=`<tr${off?' style="opacity:.75"':''}><td class="med">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`);
    h+=`</table>`;
  });
  h+=`<h3>⚠️ Escalation</h3><div style="font-size:12.5px;line-height:1.7">Sx &gt;1 week despite OTC → refer to provider.<br>Systemic red flags (fever &gt;103, SOB, CP, neuro deficit, uncontrolled bleeding) → ER.<br>More than 4 items/week or need outside the list → provider.<br>Always document that meds are <b>self-care recommendations</b> — Mendoza Pharmacy, not prescribed.</div></div>`;
  return h;
}
function renderAssess(){
  let h=`<h2 class="tpl">🧪 Assessments / Special Tests</h2><p class="tpl-sub">How to perform each screening test and what a positive means. 68W level — a positive test is documented in EX and escalated, not diagnosed.</p><div class="ref">`;
  if(typeof HOWTO!=='undefined'){h+='<h3>ⓘ '+L('Step-by-step cards','Tarjetas paso a paso')+'</h3><div class="chips" style="margin-bottom:10px">'+Object.keys(HOWTO).map(k=>'<span class="chip" onclick="htOpen(\''+k+'\')">ⓘ '+q$(HOWTO[k].t)+'</span>').join('')+'</div>';}
  ASSESS.forEach(([sec,rows])=>{
    h+=`<h3>${sec}</h3><table><tr><th style="width:32%">Test / Sign</th><th>How / Interpretation</th></tr>`;
    rows.forEach(r=>h+=`<tr><td class="med">${r[0]}</td><td>${r[1]}</td></tr>`);
    h+=`</table>`;
  });
  h+=`</div>`;
  return h;
}
/* ===== MACE 2 — Military Acute Concussion Evaluation (MEDCOM Pam 40-7-21, App. H; DVBIC rev. 10/2018) =====
   Scoring helper only. Nothing here is saved; clearing the page clears it. */
const MC_WORDS={A:['Jacket','Arrow','Pepper','Cotton','Movie'],B:['Dollar','Honey','Mirror','Saddle','Anchor'],C:['Finger','Penny','Blanket','Lemon','Insect'],D:['Baby','Monkey','Perfume','Sunset','Iron'],E:['Candle','Paper','Sugar','Sandwich','Wagon'],F:['Elbow','Apple','Carpet','Saddle','Bubble']};
const MC_DIG={
 A:[['4-9-3','6-2-9'],['3-8-1-4','3-2-7-9'],['6-2-9-7-1','1-5-2-8-5'],['7-1-8-4-6-3','5-3-9-1-4-8']],
 B:[['5-2-6','4-1-5'],['1-7-9-5','4-9-6-8'],['4-8-5-2-7','6-1-8-4-3'],['8-3-1-9-6-4','7-2-7-8-5-6']],
 C:[['1-4-2','6-5-8'],['6-8-3-1','3-4-8-1'],['4-9-1-5-3','6-8-2-5-1'],['3-7-6-5-1-9','9-2-6-5-1-4']],
 D:[['7-8-2','9-2-6'],['4-1-8-3','9-7-2-3'],['1-7-9-2-6','4-1-7-5-2'],['2-6-4-8-1-7','8-4-1-9-3-5']],
 E:[['3-8-2','5-1-8'],['2-7-9-3','2-1-6-9'],['4-1-8-6-9','9-4-1-7-5'],['6-9-7-3-8-2','4-2-7-9-3-8']],
 F:[['2-7-1','4-7-9'],['1-6-8-3','3-9-2-4'],['2-4-7-5-8','8-3-9-6-4'],['5-8-6-2-4-9','3-1-7-8-2-6']]};
const MC_ORI=['What month is this?','What is the date or day of the month?','What day of the week is it?','What year is it?','What time do you think it is? (within 1 hour of actual time)'];
const MC_SYM=['Headache','Dizziness','Memory problems','Balance problems','Nausea/vomiting','Difficulty concentrating','Irritability','Visual disturbances','Ringing in the ears'];
const MC_NEURO=[['Speech fluency','Fluid and effortless; stuttering or struggling to speak is abnormal.'],['Word finding','Difficulty coming up with the name of an object, or grasping to find words, is abnormal.'],['Grip strength','Should be strong and equal bilaterally; unequal or weak is abnormal.'],['Pronator drift','Stand, eyes closed, arms extended forward, palms up, 5–10 s; any arm or palm drift is abnormal.'],['Single leg stance','Arms across chest, hands on shoulders, eyes open then closed 15 s each leg; loss of balance before 8 s on either leg is abnormal.'],['Tandem gait','Six steps heel-to-toe, arms at side; stumbling or shifting feet is abnormal.'],['Pupil response','Round, equal, briskly constrict to direct bright light; unequal size, dilation or constriction delay is abnormal.'],['Eye tracking','Smooth tracking side-to-side and up-down; unequal, irregular or delayed tracking is abnormal.']];
let mace=null;
function mcNew(){mace={blow:null,aoc:null,loc:null,pta:null,wit:null,event:'',sym:[],symNeg:false,h:[null,null,null],list:'A',ori:[0,0,0,0,0],im:[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],rd:[null,null,null,null].map(()=>[null,null]),mo:null,dr:[0,0,0,0,0],neuro:Array(8).fill(null),voms:null};}
function mcSet(k,v,i){if(!mace)mcNew();if(i===undefined)mace[k]=(mace[k]===v?null:v);else mace[k][i]=(mace[k][i]===v?null:v);renderMain();}
function mcFlip(k,i,j){if(!mace)mcNew();if(j===undefined)mace[k][i]=mace[k][i]?0:1;else mace[k][i][j]=mace[k][i][j]?0:1;renderMain();}
function mcSym(s){if(!mace)mcNew();if(s==='NEG'){mace.symNeg=!mace.symNeg;if(mace.symNeg)mace.sym=[];}else{mace.symNeg=false;const x=mace.sym.indexOf(s);if(x<0)mace.sym.push(s);else mace.sym.splice(x,1);}renderMain();}
function mcRD(i,t,v){if(!mace)mcNew();mace.rd[i][t]=(mace.rd[i][t]===v?null:v);if(t===0&&v===true)mace.rd[i][1]=null;renderMain();}
function mcReset(){mcNew();renderMain();}
function mcScore(){
  const m=mace||(mcNew(),mace);
  const ori=m.ori.reduce((a,b)=>a+b,0);
  const im=m.im.flat().reduce((a,b)=>a+b,0);
  let rd=0,stop=false;m.rd.forEach(r=>{if(stop)return;if(r[0]===true||r[1]===true)rd++;else if(r[0]===false&&r[1]===false)stop=true;});
  const conc=rd+(m.mo?1:0);
  const dr=m.dr.reduce((a,b)=>a+b,0);
  const cog=ori+im+conc+dr;
  const ev=[m.aoc,m.loc,m.pta,m.wit].some(x=>x==='Y');
  const screen=m.blow==='Y'&&ev;
  const nAb=m.neuro.filter(x=>x==='A').length;
  return{ori,im,rd,conc,dr,cog,ev,screen,nAb,symPos:m.sym.length>0,hisPos:m.h.some(x=>x==='Y'),cogAb:cog<=25,neuAb:nAb>0,vomsAb:m.voms==='A'};
}
function mcText(){
  const m=mace,S=mcScore();const yn=v=>v==='Y'?'yes':v==='N'?'no':v==='U'?'unknown':'not recorded';
  const L=['MACE 2 (MEDCOM Pam 40-7-21 App H / DVBIC rev 10/2018):'];
  L.push('Screen: blow/jolt to head '+yn(m.blow)+'; AOC '+yn(m.aoc)+', LOC '+yn(m.loc)+', PTA '+yn(m.pta)+', witnessed '+yn(m.wit)+' → '+(S.screen?'POSITIVE concussion screen':'NEGATIVE concussion screen')+'.');
  if(m.sym.length||m.symNeg)L.push('Symptoms: '+(m.sym.length?m.sym.join(', '):'negative for all')+'.');
  L.push('History: concussion in past 12 mo '+yn(m.h[0])+'; headache/migraine disorder '+yn(m.h[1])+'; depression/anxiety/BH '+yn(m.h[2])+'.');
  if(S.screen){
    L.push('Cognitive (list '+m.list+'): orientation '+S.ori+'/5, immediate memory '+S.im+'/15, concentration '+S.conc+'/5, delayed recall '+S.dr+'/5 = '+S.cog+'/30 ('+(S.cogAb?'ABNORMAL ≤25':'normal')+').');
    const ab=MC_NEURO.filter((_,i)=>m.neuro[i]==='A').map(x=>x[0]);
    L.push('Neurological (7–14): '+(m.neuro.every(x=>x===null)?'not recorded':ab.length?'ABNORMAL — '+ab.join(', '):'all normal')+'.');
    L.push('VOMS: '+(m.voms==='A'?'abnormal':m.voms==='N'?'normal':m.voms==='D'?'deferred':'not recorded')+'.');
    const pos=S.cogAb||S.neuAb||S.vomsAb||S.symPos||S.hisPos||m.loc==='Y'||m.aoc==='Y';
    L.push('Result: '+(pos?'POSITIVE component(s) — refer to AEM / provider per ADTMC F-6; min 24 h rest, CMT, progressive return to activity.':'no positive component recorded — 24 h rest, re-evaluate before RTD (ADTMC F-6).'));
  }else{L.push('Negative screen: stop MACE 2; 24-hour rest period (if deployed); follow up per CMT; communicate to leadership; document and code in EHR.');}
  return L.join('\n');
}
function mcCopy(b){if(!mace)mcNew();copyTxt(mcText(),b);}
function mcToNote(){if(!mace)mcNew();const t=mcText();const n=document.getElementById('note');const c0=n.textContent;const base=(c0.trim()&&!/^Pick a complaint/.test(c0))?c0.trimEnd()+'\n\n':'';setNoteMode('manual');n.textContent=base+t;renderNav();}
function mcRow(label,key,opts,idx){const cur=idx===undefined?mace[key]:mace[key][idx];return '<div class="chips">'+opts.map(o=>`<span class="chip ${cur===o[0]?'on':''}" onclick="mcSet('${key}','${o[0]}'${idx===undefined?'':','+idx})">${o[1]}</span>`).join('')+'</div>';}
/* ---- PRA (Progressive Return to Activity) + NSI — ADTMC Appendix H (DVBIC), pp. 267-272. Not saved. ---- */
const PRA_ST=[['Rest','Symptom resolution'],['Light Routine Activity','Introduce and promote limited effort'],['Light Occupation-oriented Activity','Light activities needing combined physical, cognitive and/or balance skills'],['Moderate Activity','Increase intensity and complexity of physical, cognitive and balance activities'],['Intensive Activity','Duration and intensity that parallels the service member’s typical role, function and tempo'],['Unrestricted Activity','Return to pre-injury activities']];
const NSI_Q=['Feeling dizzy','Loss of balance','Poor coordination, clumsy','Headaches','Nausea','Vision problems, blurring, trouble seeing','Sensitivity to light','Hearing difficulty','Sensitivity to noise','Numbness or tingling on parts of body','Changes in taste and/or smell','Loss of appetite or increased appetite','Poor concentration, can’t pay attention, easily distracted','Forgetfulness, can’t remember things','Difficulty making decisions','Slowed thinking, difficulty getting organized, can’t finish things','Fatigue, loss of energy, getting tired easily','Difficulty falling or staying asleep','Feeling anxious or tense','Feeling depressed or sad','Irritability, easily annoyed','Poor frustration tolerance, feeling easily overwhelmed'];
let pra={second:null,stage:1,nsi:{},exert:null};
function praSet(k,v){pra[k]=(pra[k]===v?null:v);if(k==='stage'&&pra.stage===null)pra.stage=1;renderMain();}
function praNsi(i,v){pra.nsi[i]=(pra.nsi[i]===v?undefined:v);renderMain();}
function praReset(){pra={second:null,stage:1,nsi:{},exert:null};renderMain();}
function praEval(){
  const vals=Object.values(pra.nsi),n=vals.length,max=n?Math.max(...vals):null,hi=NSI_Q.map((q,i)=>pra.nsi[i]>=2?q+' ('+pra.nsi[i]+')':null).filter(Boolean);
  let rec='Complete the NSI to decide.';
  if(n){ if(max>=2)rec='NSI ≥2 on '+hi.length+' item(s): do NOT progress — follow up with PCM/provider; if it was worse during an activity, stop and rest for the day, and the next day resume the previous stage only if the NSI is back to 0–1.';
    else rec='All reported items 0–1 (mild)'+(n<NSI_Q.length?' ('+n+'/'+NSI_Q.length+' rated)':'')+': criteria for progression met if there are no new symptoms and ≥24 h were spent in this stage → may advance one stage per day.'+(pra.second===true&&pra.stage<=2?' 2nd concussion in 12 months: Stages 1–2 need 7 consecutive days with NSI 0–1 before Stage 3.':'');}
  return{n,max,hi,rec};
}
function praText(){
  const E=praEval(),st=PRA_ST[pra.stage-1];
  const L2=['PROGRESSIVE RETURN TO ACTIVITY (PRA) — DVBIC / ADTMC Appendix H'];
  L2.push('Concussion in the past 12 months (this is the 2nd): '+(pra.second===true?'YES — need 7 consecutive days with NSI 0–1 at Stages 1 and 2 before Stages 3–5':pra.second===false?'no (first)':'not recorded')+'.');
  L2.push('Current stage: '+pra.stage+' — '+st[0]+' ('+st[1]+').');
  if(pra.exert)L2.push('Exertional testing: '+({N:'not done',A:'asymptomatic',S:'SYMPTOMATIC — stop, consult provider'})[pra.exert]+'.');
  L2.push('NSI: '+(E.n?(E.n+'/'+NSI_Q.length+' items rated, highest '+E.max+(E.hi.length?'; ≥2: '+E.hi.join('; '):'')):'not completed')+'.');
  L2.push('Plan: '+E.rec);
  L2.push('Refer to rehabilitation provider / higher level of care if recovery not progressing as anticipated, no progression in 7 days, symptoms worsening, or symptomatic on exertional testing after Stage 5.');
  return L2.join('\n');
}
function praCopy(b){copyTxt(praText(),b);}
function praToNote(){const t=praText();const n=document.getElementById('note');const c0=n.textContent;const base=(c0.trim()&&!/^Pick a complaint/.test(c0))?c0.trimEnd()+'\n\n':'';setNoteMode('manual');n.textContent=base+t;renderNav();}
function renderPra(){
  const E=praEval();
  const fld=(tag,name,ask,body)=>'<div class="field"><div class="lab"><span class="tag">'+tag+'</span><span class="name">'+name+'</span>'+(ask?'<span class="ask">'+ask+'</span>':'')+'</div>'+body+'</div>';
  const ch=(on,fn,t)=>'<span class="chip '+(on?'on':'')+'" onclick="'+fn+'">'+t+'</span>';
  let h='<div class="secbar">PRA · Progressive return to activity (after the 24 h rest)</div>';
  h+='<div class="note-hint">General guidance (App. H): minimum 24 h recovery; if first concussion in 12 months and asymptomatic, exertional testing can be done; if symptomatic at 24 h / after exertional testing, or it is the 2nd concussion in 12 months, enter the full PRA. Complete the NSI daily and after each stage. Stage 1 education: Acute Concussion / Return to Activity brochures (dvbic.dcoe.mil).</div>';
  h+=fld('12 mo','Second concussion in the past 12 months?','',"<div class='chips'>"+ch(pra.second===true,"praSet('second',true)",'YES (2nd)')+ch(pra.second===false,"praSet('second',false)",'NO (1st)')+'</div>');
  h+=fld('Stage','Current stage','one stage per day at most',"<div class='chips'>"+PRA_ST.map((x,i)=>ch(pra.stage===i+1,"praSet('stage',"+(i+1)+")",(i+1)+' · '+x[0])).join('')+'</div><div class="fuq">'+PRA_ST[pra.stage-1][1]+'</div>');
  h+=fld('Exert','Exertional testing','65–85% of target HR (220−age), ~2 min; stop and consult the provider if symptoms or red flags',"<div class='chips'>"+ch(pra.exert==='N',"praSet('exert','N')",'Not done')+ch(pra.exert==='A',"praSet('exert','A')",'Asymptomatic')+ch(pra.exert==='S',"praSet('exert','S')",'Symptomatic')+'</div>');
  h+='<div class="secbar">NSI · Neurobehavioral Symptom Inventory (0–4)</div><div class="fuq">0 none · 1 mild (occasional, doesn’t disrupt) · 2 moderate (often, occasionally disrupts) · 3 severe · 4 very severe. Progress only if all are 0–1.</div>';
  NSI_Q.forEach((q,i)=>{h+='<div class="field" style="padding:6px 8px"><div class="lab"><span class="name" style="font-weight:500">'+q+'</span></div><div class="chips">'+[0,1,2,3,4].map(v=>ch(pra.nsi[i]===v,'praNsi('+i+','+v+')',String(v))).join('')+'</div></div>';});
  h+='<div class="field"><b>'+(E.n&&E.max>=2?'⚠ HOLD / follow up':E.n?'✓ May progress':'—')+'</b><div style="margin-top:4px;font-size:.9em">'+E.rec+'</div></div>';
  h+='<div class="field"><pre style="white-space:pre-wrap;margin:0;font-size:.85em">'+praText().replace(/</g,'&lt;')+'</pre><div class="algo-actions"><button onclick="praCopy(this)">Copy</button><button class="ghost" onclick="praToNote()">Add to note</button><button class="ghost" onclick="praReset()">↺ Clear PRA</button></div></div>';
  return h;
}
function renderMace(){
  if(!mace)mcNew();const m=mace,S=mcScore();
  const YNU=[['Y','YES'],['N','NO'],['U','UNKNOWN']],YN=[['Y','YES'],['N','NO']];
  const fld=(tag,name,ask,body)=>`<div class="field"><div class="lab"><span class="tag">${tag}</span><span class="name">${name}</span>${ask?`<span class="ask">${ask}</span>`:''}</div>${body}</div>`;
  let h='<h2 class="tpl">🧠 MACE 2 — Military Acute Concussion Evaluation</h2><p class="tpl-sub">ADTMC F-6 / Appendix H (DVBIC rev. 10/2018). Scoring helper: nothing is saved. Findings stay on this screen until you copy them to the note.</p>';
  h+=`<div class="algo-actions" style="margin-bottom:10px"><button class="ghost" onclick="mcReset()">↺ New patient (clear)</button></div>`;
  h+='<div class="secbar">1 · Description of incident</div>';
  h+=fld('1D','Blow or jolt to the head?','Head hit objects / struck by objects / blast wave / acceleration-deceleration',mcRow('','blow',YNU));
  h+='<div class="secbar">2 · Alteration of consciousness or memory</div>';
  h+=fld('2A','Alteration of consciousness (AOC)?','"Were you dazed, confused, or did you see stars?"',mcRow('','aoc',YNU));
  h+=fld('2B','Loss of consciousness (LOC)?','"Did you pass out or black out?"',mcRow('','loc',YNU));
  h+=fld('2C','Post-traumatic amnesia (PTA)?','"What is the last thing you remember before / first thing after?"',mcRow('','pta',YNU));
  h+=fld('2D','AOC, LOC or PTA witnessed?','Ask a witness to verify and estimate duration',mcRow('','wit',YNU));
  h+='<div class="secbar">3 · Symptoms</div>';
  h+=fld('3','Symptoms after the event','check all that apply','<div class="chips">'+MC_SYM.map(s=>`<span class="chip ${m.sym.includes(s)?'on':''}" onclick="mcSym('${s}')">${s}</span>`).join('')+`<span class="chip ${m.symNeg?'on':''}" onclick="mcSym('NEG')">Negative for all symptoms</span></div>`);
  h+='<div class="secbar">4 · History</div>';
  ['Diagnosed with a concussion in the past 12 months (not counting this event)?','History of diagnosed/treated headache disorder or migraine?','History of depression, anxiety, or other behavioral-health concerns?'].forEach((q,i)=>{h+=fld('4'+'ABC'[i],q,'',mcRow('','h',YN,i));});
  h+=`<div class="field" style="border-color:var(${S.screen?'--red':'--line'})"><b>Concussion screening result:</b> ${S.screen?'<span style="color:var(--red)">POSITIVE</span> — continue MACE 2, complete the evaluation before prescribing rest, communicate to line leadership, document and code in the EHR.':(m.blow===null?'<span style="color:var(--dim)">answer 1D and 2A–2D</span>':'<b>NEGATIVE</b> (needs a blow/jolt AND any alteration of consciousness or memory) — stop MACE 2; 24-hour rest period if deployed (avoid activities that worsen symptoms); follow up after rest per CMT; communicate to leadership; document and code in the EHR.')}</div>`;
  if(S.screen){
    h+='<div class="secbar">Cognitive exam — choose one list (A–F) and use it for questions 6, 15 and 16</div><div class="chips">'+Object.keys(MC_WORDS).map(k=>`<span class="chip ${m.list===k?'on':''}" onclick="mace.list='${k}';renderMain()">List ${k}</span>`).join('')+'</div>';
    h+=fld('5','Orientation',`<b>${S.ori}/5</b> — within one hour of actual time`,'<div class="chips">'+MC_ORI.map((q,i)=>`<span class="chip ${m.ori[i]?'on':''}" onclick="mcFlip('ori',${i})">${m.ori[i]?'✓ ':''}${q}</span>`).join('')+'</div>');
    h+=fld('6','Immediate memory',`<b>${S.im}/15</b> — read the list 3 times; mark words repeated correctly`,[0,1,2].map(t=>`<div style="margin-top:6px"><span class="ask">Trial ${t+1}${t===0?': "I am going to test your memory. I will read you a list of words and when I am done, repeat back to me as many words as you can remember, in any order."':': "I am going to repeat that list again. Repeat back to me as many words as you can remember, in any order, even if you said them before."'}</span><div class="chips">${MC_WORDS[m.list].map((w,i)=>`<span class="chip ${m.im[t][i]?'on':''}" onclick="mcFlip('im',${t},${i})">${m.im[t][i]?'✓ ':''}${w}</span>`).join('')}</div></div>`).join(''));
    let rd='<div class="ask" style="margin-bottom:4px">"I am going to read you a string of numbers. When I am finished, repeat them back to me backward — in reverse order. For example, if I said 7-1-9, you would say 9-1-7."</div>';let stop=false;
    MC_DIG[m.list].forEach((p,i)=>{if(stop)return;const r=m.rd[i];rd+=`<div style="margin-top:6px"><b>${p[0]}</b> <span class="chips" style="display:inline-flex"><span class="chip ${r[0]===true?'on':''}" onclick="mcRD(${i},0,true)">correct</span><span class="chip ${r[0]===false?'on':''}" onclick="mcRD(${i},0,false)">incorrect</span></span>`;if(r[0]===false)rd+=` &nbsp; Trial 2: <b>${p[1]}</b> <span class="chips" style="display:inline-flex"><span class="chip ${r[1]===true?'on':''}" onclick="mcRD(${i},1,true)">correct</span><span class="chip ${r[1]===false?'on':''}" onclick="mcRD(${i},1,false)">incorrect</span></span>`;rd+='</div>';if(r[0]===false&&r[1]===false){stop=true;rd+='<div class="fuq">Incorrect on both trials → STOP; score is the number of lengths passed.</div>';}});
    h+=fld('15A','Concentration — reverse digits',`<b>${S.rd}/4</b> — if trial 1 is correct go to the next length; if incorrect give trial 2 of the same length`,rd);
    h+=fld('15B','Months in reverse order',`<b>${m.mo?1:0}/1</b> — all correct: Dec–Nov–Oct–Sep–Aug–Jul–Jun–May–Apr–Mar–Feb–Jan`,`<div class="chips"><span class="chip ${m.mo===true?'on':''}" onclick="mace.mo=mace.mo===true?null:true;renderMain()">All months correct</span><span class="chip ${m.mo===false?'on':''}" onclick="mace.mo=mace.mo===false?null:false;renderMain()">Incorrect</span></div><div class="fuq">Concentration total (15A + 15B): <b>${S.conc}/5</b></div>`);
    h+=fld('16','Delayed recall',`<b>${S.dr}/5</b> — "Do you remember that list of words I read a few minutes earlier? Tell me as many as you can, in any order." Do NOT repeat the list.`,'<div class="chips">'+MC_WORDS[m.list].map((w,i)=>`<span class="chip ${m.dr[i]?'on':''}" onclick="mcFlip('dr',${i})">${m.dr[i]?'✓ ':''}${w}</span>`).join('')+'</div>');
    h+=`<div class="field" style="border-color:var(${S.cogAb?'--red':'--line'})"><b>Cognitive total: ${S.cog}/30</b> (orientation ${S.ori} + immediate memory ${S.im} + concentration ${S.conc} + delayed recall ${S.dr}) — ${S.cogAb?'<span style="color:var(--red)">ABNORMAL (≤25)</span>':'normal (>25)'}</div>`;
    h+='<div class="secbar">Neurological exam (7–14)</div>';
    MC_NEURO.forEach((n,i)=>{h+=fld(String(7+i),n[0],n[1],`<div class="chips"><span class="chip ${m.neuro[i]==='N'?'on':''}" onclick="mcSet('neuro','N',${i})">Normal</span><span class="chip ${m.neuro[i]==='A'?'on':''}" style="${m.neuro[i]==='A'?'background:var(--red);border-color:var(--red);color:var(--on-red)':''}" onclick="mcSet('neuro','A',${i})">Abnormal</span></div>`);});
    h+='<div class="secbar">17 · Vestibular / ocular-motor screening (VOMS)</div>';
    h+=fld('17','VOMS result','Contraindication: unstable cervical spine. Defer if overtly symptomatic or no trained provider. Record headache / dizziness / nausea / fogginess (HDNF, 0–10) before and after each task: smooth pursuits, horizontal & vertical saccades, convergence (≥5 cm near point is abnormal), horizontal & vertical VOR, visual motion sensitivity. Any score above baseline is abnormal.',`<div class="chips"><span class="chip ${m.voms==='N'?'on':''}" onclick="mcSet('voms','N')">Normal</span><span class="chip ${m.voms==='A'?'on':''}" onclick="mcSet('voms','A')">Abnormal</span><span class="chip ${m.voms==='D'?'on':''}" onclick="mcSet('voms','D')">Deferred</span></div>`);
  }
  h+='<div class="secbar">Summary</div><div class="field"><pre style="white-space:pre-wrap;margin:0;font-size:.85em">'+mcText().replace(/</g,'&lt;')+'</pre><div class="algo-actions"><button onclick="mcCopy(this)">Copy</button><button class="ghost" onclick="mcToNote()">Add to note</button></div></div>';
  h+=renderPra();
  h+='<div class="fuq" style="margin-top:8px">After completing MACE 2: document in the EHR with coding (initial TBI screening code Z13.850; primary TBI diagnostic code S06.-, etc. — see DVBIC ICD-10 coding guidance); initiate 24-hour rest; use the Concussion Management Tool (CMT); after the rest period evaluate for Progressive Return to Activity (PRA). The PRA guidance, NSI and stages above follow Appendix H (pp. 267–272); the CMT symptom-cluster treatment tables are not reproduced — use the pamphlet or the provider. This tool does not replace provider judgment.</div>';
  return h;
}

function renderQ(){
  let h=`<h2 class="tpl">❓ Question bank</h2><p class="tpl-sub">What to ask, in order.</p><div class="ref">`;
  QBANK.forEach(([sec,rows])=>{
    h+=`<h3>${sec}</h3>`;
    rows.forEach(r=>h+=`<div class="qline"><span class="qk">${r[0]}</span><span class="q">${r[1]}</span></div>`);
  });
  h+=`</div>`;
  return h;
}
/* ---- Profile builder ---- */
const PB_TYPES=['RTD (full duty)','RTD w/ light duty','Quarters'];
const PB_DUR=['24h','48h','72h','1 week','until re-evaluated'];
const PB_RESTR=['no PT','no ruck','no running','no jumping','no lifting >20 lbs','no prolonged standing >30 min','no overhead activity','no push-ups/sit-ups','no field duty','low-impact PT only','avoid strenuous activity','avoid heat/friction exposure','no driving/operating equipment (sedating med)'];
const PB_FU=['Re-eval if not improved','Re-eval at sick call in 48–72h','Return sooner if symptoms worsen','Provider referral if no improvement'];
const PB_PRESETS=[
 {n:'Acute MSK 48h',t:1,d:1,r:[1,2,3,4],f:[0]},
 {n:'MSK + H2F',t:1,d:1,r:[1,2,3,4],f:[0],h:true},
 {n:'Mild illness 24h',t:1,d:0,r:[0,10],f:[0,2]},
 {n:'Illness — quarters 24h',t:2,d:0,r:[],f:[0,2]},
 {n:'Skin / friction 24h',t:1,d:0,r:[11,0],f:[0]},
 {n:'Sedating med 24h',t:1,d:0,r:[12],f:[2]}
];
let pb={t:null,d:null,r:new Set(),f:new Set(),h:false,c:''};
function pbText(){
  if(pb.t===null)return '';
  const dur=pb.d===null?'':(pb.d===4?' until re-evaluated':' x'+PB_DUR[pb.d]);
  const rs=[...pb.r].sort((a,b)=>a-b).map(i=>PB_RESTR[i]); if(pb.c.trim())rs.push(pb.c.trim());
  const out=[];
  if(pb.t===0){out.push('RTD — cleared for full duty.'); if(rs.length)out.push('Advise: '+rs.join(', ')+'.');}
  else if(pb.t===1){out.push('RTD w/ restrictions'+dur+' (per CoC guidance)'+(rs.length?': '+rs.join(', '):'')+'.');}
  else{out.push('Recommend quarters'+dur+' for rest/recovery (pending CoC/provider approval).'+(rs.length?' On return: '+rs.join(', ')+'.':''));}
  [...pb.f].sort((a,b)=>a-b).forEach(i=>out.push(PB_FU[i]+'.'));
  if(pb.h)out.push('Recommend referral to H2F for running/gait instruction, strengthening of weak muscle groups, and injury-prevention classes.');
  return out.join(' ');
}
function pbSet(k,v){pb[k]=pb[k]===v?null:v;renderMain();}
function pbTog(k,v){pb[k].has(v)?pb[k].delete(v):pb[k].add(v);renderMain();}
function pbH2F(){pb.h=!pb.h;renderMain();}
function pbPreset(i){const q=PB_PRESETS[i];pb={t:q.t,d:q.d,r:new Set(q.r),f:new Set(q.f),h:!!q.h,c:''};renderMain();}
function pbClear(){pb={t:null,d:null,r:new Set(),f:new Set(),h:false,c:''};renderMain();}
function pbCustom(v){pb.c=v;const o=document.getElementById('pbOut');if(o)o.textContent=pbText()||'—';}
function pbSend(btn){
  const txt=pbText(); if(!txt)return;
  const st=state[cur]; st.dispo=null; st.dispoTxt=txt; renderNote();
  if(btn){const o=btn.textContent;btn.textContent='✓ sent to the note';setTimeout(()=>btn.textContent=o,1200);}
}
function renderProfiles(){
  const tcur=TPLS.find(x=>x.id===cur);
  const anyPos=TPLS.some(t=>(t.redFlags||[]).some(f=>state[t.id].rf[f]==='pos'));
  const sedating=TPLS.some(t=>[...state[t.id].plan].some(p=>/Benadryl|Actifed/.test(p)));
  const chip=(on,fn,label)=>`<span class="chip ${on?'on':''}" onclick="${fn}">${label}</span>`;
  let h=`<h2 class="tpl">🪖 Profiles — builder</h2><p class="tpl-sub">Build the recommendation: type, duration, restrictions and follow-up. The text generates itself — copy it or send it to the note's Disposition. Always as a recommendation, not a medical order.</p><div class="ref">`;
  if(anyPos)h+=`<div class="rfbanner">🚩 There is a POSITIVE red flag in a section — do NOT recommend RTD / light duty / quarters. Escalate to provider/ER per protocol.</div>`;
  h+=`<div class="field"><div class="lab"><span class="tag">⚡</span><span class="name">Shortcuts</span><span class="ask">load a combination and adjust it</span></div><div class="chips">`;
  PB_PRESETS.forEach((q,i)=>h+=chip(false,`pbPreset(${i})`,q.n));
  h+=`<span class="chip deny" onclick="pbClear()">clear</span></div></div>`;
  h+=`<div class="field"><div class="lab"><span class="tag">1</span><span class="name">Type</span></div><div class="chips">`;
  PB_TYPES.forEach((x,i)=>h+=chip(pb.t===i,`pbSet('t',${i})`,x));
  h+=`</div></div>`;
  h+=`<div class="field"><div class="lab"><span class="tag">2</span><span class="name">Duration</span><span class="ask">does not apply to RTD full duty</span></div><div class="chips">`;
  PB_DUR.forEach((x,i)=>h+=chip(pb.d===i,`pbSet('d',${i})`,x));
  h+=`</div></div>`;
  h+=`<div class="field"><div class="lab"><span class="tag">3</span><span class="name">Restrictions</span><span class="ask">check all that apply</span></div><div class="chips">`;
  PB_RESTR.forEach((x,i)=>h+=chip(pb.r.has(i),`pbTog('r',${i})`,x));
  h+=`</div>`;
  if(sedating&&!pb.r.has(12))h+=`<div class="fuq">💡 Tu plan incluye un med sedante (Benadryl/Actifed) — ${chip(false,"pbTog('r',12)",'+ no driving/operating equipment')}</div>`;
  h+=`<input type="text" placeholder="other restriction..." value="${pb.c.replace(/"/g,'&quot;')}" oninput="pbCustom(this.value)"></div>`;
  h+=`<div class="field"><div class="lab"><span class="tag">4</span><span class="name">Follow-up / Referral</span></div><div class="chips">`;
  PB_FU.forEach((x,i)=>h+=chip(pb.f.has(i),`pbTog('f',${i})`,x));
  h+=chip(pb.h,'pbH2F()','🏃 H2F referral');
  h+=`</div></div>`;
  const txt=pbText();
  h+=`<div class="sugbox"><div class="sughead">📄 Generated profile</div><div id="pbOut" style="font-family:var(--mono);font-size:.92em;line-height:1.6;white-space:pre-wrap">${txt?escapeHtml(txt):'—'}</div>
   <div class="algo-actions"><button onclick="copyTxt(document.getElementById('pbOut').textContent,this)">Copy</button><button class="ghost" onclick="pbSend(this)">➜ Use in Disposition of ${tcur.icon} ${escapeHtml(tcur.title.split('/')[0].trim())}</button></div></div>`;
  h+=`<h3 style="margin-top:22px">Ready phrases</h3>`;
  PROFILES.forEach(([sec,rows])=>{
    h+=`<h3>${sec}</h3>`;
    rows.forEach(r=>{const esc=r.replace(/'/g,"\\'");h+=`<div class="exline"><span>“${r}”</span><button class="cp" onclick="copyTxt('${esc}',this)">copy</button></div>`;});
  });
  h+=`</div>`;
  return h;
}

/* =========================================================
   ACTIONS
========================================================= */
/* ---- Mutually exclusive options: the LAST tap wins and the contradicting chip is cleared ---- */
const EXC_NONE=new Set(['NKDA','none','no relevant hx','no hx','no radiation','no clear trigger','no new events','NKDA (confirmed)']);
const EXC_SETS=[ // within one field, pick at most one of each set
  ['today','yesterday','2–3d ago','1 week ago','2–3d','1w','recurring for weeks'],
  ['gradual onset','sudden onset'],
  ['right','left','bilateral','midline'],
  ['right side','left side','bilateral'],
  ['one-sided (right)','one-sided (left)','whole head'],
  ['one nostril','both nostrils'],['one eye','both eyes'],
  ['constant','intermittent','episodic','recurrent episodes','daily'],
  ['constant','only during activity','only at rest','only during menses','cyclical'],
  ['only during activity','only at rest'],
  ['getting worse','getting better','same since onset','worsening','improving'],
  ['worse AM','worse PM'],['worse nights','worse mornings'],['lasts hours','lasts all day'],
  ['productive cough','dry cough'],
  ['gait normal','antalgic gait'],
  ['improved on exam','unchanged on exam','worse on exam'],
  ['NKDA (confirmed)','new allergy (note below)'],
  ['better','same','worse']
];
const EXC_SIDES=[ // [good group, bad group] — cannot pick from both
  [['ate chow, tolerating PO','ate chow, hydrated','normal PO intake','eating normally'],
   ['↓ PO intake','fluids only','not tolerating PO','skipped meals','skipping meals','↓ appetite/intake','↓ fluid intake today']]
];
const EXC_CROSS=[ // [field,option] pairs in different fields of the same template
  [['sx','fever'],['exam','afebrile']],
  [['sx','swelling'],['exam','no swelling']]
];
function excOverlap(a,b){a=String(a).toLowerCase();b=String(b).toLowerCase();return a===b||(a.length>3&&b.includes(a))||(b.length>3&&a.includes(b));}
function excApply(s,fid,opt,deny){
  const set=fid==='__cc'?s.cc:s.fields[fid];if(!set)return;
  const key=deny?'DENY::'+opt:opt;
  const drop=o=>{set.delete(o);};
  if(deny){
    drop(opt);                                   // deny X clears positive X in the same field
    [...s.cc].forEach(c=>{if(excOverlap(c,opt))s.cc.delete(c);});
    return;
  }
  drop('DENY::'+opt);                            // positive X clears "denies X"
  Object.keys(s.fields).forEach(f=>[...s.fields[f]].forEach(k=>{if(k.indexOf('DENY::')===0&&excOverlap(k.slice(6),opt)&&(fid==='__cc'||f===fid))s.fields[f].delete(k);}));
  if(EXC_NONE.has(opt)){[...set].forEach(o=>{if(o!==opt&&o.indexOf('DENY::')!==0)set.delete(o);});}
  else EXC_NONE.forEach(n=>drop(n));
  EXC_SETS.forEach(g=>{if(g.includes(opt))g.forEach(o=>{if(o!==opt)drop(o);});});
  EXC_SIDES.forEach(([x,y])=>{if(x.includes(opt))y.forEach(drop);else if(y.includes(opt))x.forEach(drop);});
  if(fid!=='__cc')EXC_CROSS.forEach(([A,B])=>{
    const me=A[0]===fid&&A[1]===opt?B:(B[0]===fid&&B[1]===opt?A:null);
    if(me&&s.fields[me[0]])s.fields[me[0]].delete(me[1]);
  });
}
function tog(tid,fid,opt,deny){
  const s=state[tid];
  const key=deny?'DENY::'+opt:opt;
  const set = fid==='__cc'?s.cc:s.fields[fid];
  if(set.has(key))set.delete(key);
  else{set.add(key);excApply(s,fid,opt,deny);}
  if(fid!=='__cc')s.focus=fid;
  renderMain();renderNote();
  if(fid!=='__cc')fKeep(fid);
}
function fKeep(fid){const el=document.getElementById('fld_'+fid);if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest'});}
function fOpen(tid,fid){const s=state[tid];if(!s)return;s.focus=fid;if(foldOn()&&!isFold('hist'))foldCur.hist=true;renderMain();if(fid)setTimeout(()=>{const el=document.getElementById('fld_'+fid);if(el)el.scrollIntoView({block:'center',behavior:'smooth'});},0);}
function cust(tid,fid,val){
  if(fid==='__cc'){state[tid].ccCustom=val;}else{state[tid].custom[fid]=val;}
  renderNote();
}
function setSev(tid,v){state[tid].sev=v;renderMain();renderNote();}
function setDuty(tid,v){state[tid].duty=state[tid].duty===v?null:v;renderMain();renderNote();}
function togPlan(tid,p){const s=state[tid].plan;s.has(p)?s.delete(p):s.add(p);renderMain();renderNote();}
function setDispo(tid,k){
  const t=TPLS.find(x=>x.id===tid), s=state[tid];
  if(s.dispo===k){s.dispo=null;s.dispoTxt='';}
  else{
    if(/RTD|Light Duty|H2F|Quarters/i.test(k)&&(hasPosRF()||adForcesPN())){s.dispo=null;s.dispoTxt='ESCALATE — red flag present / ADTMC Provider Now. RTD, Light Duty, H2F and quarters NOT recommended until the provider evaluates.';renderMain();renderNote();return;}
    s.dispo=k;s.dispoTxt=t.dispo[k];}
  renderMain();renderNote();
}
function setVit(tid,k,v){gVitals[k]=v;adVU();}
function cycleRf(tid,f){
  const rf=state[tid].rf;
  rf[f]=rf[f]==='neg'?'pos':(rf[f]==='pos'?undefined:'neg');
  if(rf[f]===undefined)delete rf[f];
  renderMain();renderNote();
}
function allNegRf(tid){
  const t=TPLS.find(x=>x.id===tid);
  (t.redFlags||[]).forEach(f=>{if(state[tid].rf[f]!=='pos')state[tid].rf[f]='neg';});
  renderMain();renderNote();
}
function dispoTxt(tid,v){state[tid].dispoTxt=v;renderNote();}
function resetTpl(){
  if(view!=='tpl')return;
  resetState(cur);
  renderMain();renderNote();
}
function clearAllAsk(b){
  if(b.dataset.arm){clearTimeout(b._t);delete b.dataset.arm;b.textContent=b.dataset.lbl;b.classList.remove('armed');resetAll();return;}
  b.dataset.lbl=b.textContent;b.dataset.arm='1';b.classList.add('armed');b.textContent=L('Tap again to clear','Toca otra vez para borrar');
  b._t=setTimeout(()=>{delete b.dataset.arm;b.textContent=b.dataset.lbl;b.classList.remove('armed');},3000);
}
function resetAll(){
  setNoteMode('auto');
  TPLS.forEach(t=>resetState(t.id));resetVitals();adResetAll();
  ad.q='';ad.cat='';ad.excl=[];guided=null;
  medQ='';for(const k in dcUsed)delete dcUsed[k];rfq={n:'',id:'',dob:'',med:''};
  mace=null;pra={second:null,stage:1,nsi:{},exert:null};pb={t:null,d:null,r:new Set(),f:new Set(),h:false,c:''};
  try{localStorage.removeItem('sc_org');}catch(e){}
  patient='';const pi=document.getElementById('ptIn');if(pi)pi.value='';
  if(typeof slipClose==='function')slipClose();if(typeof sheetTog==='function')sheetTog(false);
  view='adtmc';renderNav();renderMain();
  renderNote();persist();adPersist();
  const m=document.getElementById('main');if(m)m.scrollTop=0;
}

/* ---- editar nota a mano ---- */
let manualNote=false;
function setNoteMode(m){
  const el=document.getElementById('note');
  editMode=(m==='edit');manualNote=(m==='manual');el.contentEditable=editMode;
  const eb=document.getElementById('editBtn'),ab=document.getElementById('autoBtn'),nb=document.getElementById('notebanner');
  if(eb){eb.textContent=editMode?'✓ Done':'✏️ Edit';eb.classList.toggle('copied',editMode);}
  if(ab)ab.style.display=m==='auto'?'none':'';
  if(nb){nb.style.display=m==='auto'?'none':'';nb.textContent=editMode?'Editing the note by hand — tap ✓ Done when finished.':'Manual text — selections no longer change the note. Tap ↺ Auto to rebuild it from your answers.';}
  if(m==='auto')renderNote();
  if(editMode)el.focus();
}
function toggleEdit(){setNoteMode(editMode?'manual':'edit');}
/* ---- saved patients ---- */
function getSaved(){try{return JSON.parse(localStorage.getItem('sc_saved')||'[]');}catch(e){return[];}}
function setSaved(a){localStorage.setItem('sc_saved',JSON.stringify(a));}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function savePatient(btn){
  const txt=document.getElementById('note').textContent.trim();
  if(!txt||txt.startsWith('Tap options'))return;
  const pii=piiFind(txt);if(pii.length){piiNoteWarn(pii);if(btn){const o=btn.textContent;btn.textContent=L('Blocked — remove personal info','Bloqueado — quita datos personales');btn.classList.add('armed');setTimeout(()=>{btn.textContent=o;btn.classList.remove('armed');},2500);}return;}
  const arr=getSaved();
  arr.unshift({t:Date.now(),name:patient.trim()||'(no name)',txt,ad:adSnap()});
  setSaved(arr);
  setNoteMode('auto');
  patient='';const pi=document.getElementById('ptIn');if(pi)pi.value='';
  TPLS.forEach(t=>resetState(t.id));resetVitals();adResetAll();
  renderNav();renderMain();renderNote();
  if(btn){const o=btn.textContent;btn.textContent='✓ saved';setTimeout(()=>btn.textContent=o,1000);}
}
function renderSaved(){
  const arr=getSaved();
  let h=`<h2 class="tpl">💾 Saved patients${arr.length?' ('+arr.length+')':''}</h2><p class="tpl-sub">Saved only in this browser. They contain Soldier information — delete them when sick call ends.</p><div class="ref">`;
  if(!arr.length)h+=`<p style="color:var(--dim)">Nothing saved yet. Finish a note and use "Save ➜ next" in the right panel.</p>`;
  arr.forEach((n,i)=>{
    const d=new Date(n.t);
    const hh=String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0');
    h+=`<div class="savedN"><div class="savedH"><b>${escapeHtml(n.name)}</b><span class="tm">${hh}</span><span class="sp"></span><button class="cp" onclick="startFollowUp(${i})" title="Reopen as a follow-up visit (M-1)">↻ follow-up</button><button class="cp" onclick="copySaved(${i},this)">copy</button><button class="cp" onclick="delSaved(${i})">delete</button></div><pre>${escapeHtml(n.txt)}</pre></div>`;
  });
  if(arr.length)h+=`<span class="chip" style="display:inline-block;margin-top:8px" onclick="clearSaved()">🗑️ Delete all</span>`;
  h+=`</div>`;
  return h;
}
function copySaved(i,btn){const arr=getSaved();if(arr[i])copyTxt(arr[i].txt,btn);}
function delSaved(i){const arr=getSaved();arr.splice(i,1);setSaved(arr);renderNav();renderMain();}
function clearSaved(){setSaved([]);renderNav();renderMain();}

/* ---- text size ---- */
let fsBase=parseInt(localStorage.getItem('sc_fs')||'16');
function setFs(d){fsBase=Math.min(19,Math.max(12,fsBase+d));document.body.style.fontSize=fsBase+'px';localStorage.setItem('sc_fs',fsBase);}

/* =========================================================
   NOTE BUILDER
========================================================= */
function joinSel(f,s){
  const sel=[...s.fields[f.id]].filter(x=>!x.startsWith('DENY::'));
  const den=[...s.fields[f.id]].filter(x=>x.startsWith('DENY::')).map(x=>x.slice(6));
  const c=(s.custom[f.id]||'').trim();
  let parts=[...sel]; if(c)parts.push(c);
  let out='';
  if(parts.length){
    if(f.noRadFirst && parts.includes('no radiation')){
      out = parts.length===1 ? 'No radiation' : (f.prefix||'')+parts.filter(x=>x!=='no radiation').join(', ');
    } else {
      out=(f.prefix!==undefined?f.prefix:'')+parts.join(', ');
    }
  }
  if(den.length){ out += (out?'. ':'')+'Denies '+den.join(', '); }
  return out;
}
function tplHasContent(t,s){
  return !!([...s.cc].length||s.ccCustom.trim()||s.plan.size||s.dispoTxt.trim()||s.sev!==null||s.duty||Object.keys(s.rf).length||t.fields.some(f=>s.fields[f.id].size||(s.custom[f.id]||'').trim()));
}
function sectionLines(t,s){
  const L=[];
  const ccParts=[...s.cc]; if(s.ccCustom.trim())ccParts.push(s.ccCustom.trim());
  if(ccParts.length)L.push(s.ccRaw&&!s.cc.size?'CC: '+ccParts.join(', ')+'.':'CC: C/o '+(t.ccPrefix||'')+ccParts.join(', ')+'.');
  t.fields.forEach(f=>{
    const v=joinSel(f,s);
    if(v)L.push(f.tag+': '+v+'.');
  });
  if(s.sev!==null||s.duty){
    let line='S: '+(s.sev!==null?s.sev+'/10':'__/10');
    if(s.duty)line+='. Interferes w/ duty/PT: '+s.duty;
    L.push(line+'.');
  }
  const rfNeg=(t.redFlags||[]).filter(f=>s.rf[f]==='neg');
  const rfAllN=(t.redFlags||[]).length&&rfNeg.length===(t.redFlags||[]).length;
  if(rfAllN)L.push('No red flags.');else if(rfNeg.length)L.push('Red flags: denies '+rfNeg.join(', ')+'.');
  return L;
}
/* ===== SOAP-D note (MEDCOM Pam 40-7-21, Appendix D: Screening Note) =====
   Subjective / Objective / Assessment / Plan / Disposition. Same data as the compact note. */
const SD_HPI=['o','pw','pb','q','r','rr','t','sx','e','seen','s2'];
const SD_AMPLE={a:'Allergies',m:'Meds',phx:'PMH',l:'Last oral intake'};
const SD_CAT={PN:'I — Provider Now',AEM:'II — AEM Now',MCP:'III — Minor Care Protocol (MCP)',SP:'IV — Specialty referral',APPT:'Appointment / referral requested'};
function soapdNote(stamp){
  const entries=noteEntries();
  const active=noteActive();
  const v=gVitals,anyV=Object.values(v).some(x=>String(x).trim());
  if(!active.length&&!entries.length&&!anyV&&!patient.trim())return '';
  const L=[];
  L.push((patient.trim()?('PT: '+patient.trim()+' — '):'')+stamp);
  L.push('');L.push('S — SUBJECTIVE');
  const ccAll=[];active.forEach(t=>{const s=state[t.id];const parts=[...s.cc];if(s.ccCustom.trim())parts.push(s.ccCustom.trim());if(parts.length)ccAll.push(s.ccRaw&&!s.cc.size?'CC: '+parts.join(', ')+'.':'CC: C/o '+(t.ccPrefix||'')+parts.join(', ')+'.');});
  if(ccAll.length)ccAll.forEach(x=>L.push(x));else if(entries.length)L.push('CC: '+entries.map(e=>e.title).join('; ')+'.');
  const prot=entries.map(e=>e.title+' ('+e.id+')');
  if(prot.length)L.push('HPI — protocol: '+prot.join('; ')+'.');
  const ample=[];
  active.forEach(t=>{const s=state[t.id];t.fields.forEach(f=>{const val=joinSel(f,s);if(!val)return;
    if(SD_HPI.includes(f.id))L.push((prot.length?'':'HPI ')+f.tag+': '+val+'.');
    else if(SD_AMPLE[f.id])ample.push(SD_AMPLE[f.id]+': '+val+'.');
    else if(f.id==='lmp'||f.id==='exam'){/* handled below */}
    else L.push(f.tag+': '+val+'.');});
    if(s.sev!==null||s.duty){let line='Severity: '+(s.sev!==null?s.sev+'/10':'__/10');if(s.duty)line+='. Interferes w/ duty/PT: '+s.duty;L.push(line+'.');}});
  ample.forEach(x=>L.push(x));
  if(gFlags.female){const ld=lmpDays();L.push('LMP: '+(gFlags.lmp?(new Date(gFlags.lmp+'T00:00:00').toDateString().slice(4)+' ('+ld+' d ago)'):'not documented')+(gFlags.preg?' — possible pregnancy':'')+(gFlags.lact?' — lactating':'')+'.');}
  active.forEach(t=>{const f=t.fields.find(x=>x.id==='lmp');if(f&&!gFlags.female){const val=joinSel(f,state[t.id]);if(val)L.push('LMP: '+val+'.');}});
  L.push('MRC status / delinquent readiness: '+(gFlags.mrc.trim()||'not documented')+'.');
  if(gFlags.aviation)L.push('Flight/dive status.');
  entries.forEach(e=>{if(e.hpi)L.push('Screening ('+e.id+'): '+e.hpi);});
  L.push('');L.push('O — OBJECTIVE');
  const vl=[['T',v.temp],['HR',v.hr],['BP',v.bp],['RR',v.rr],['SpO2',v.spo2],['Pain',v.pain]].map(x=>x[0]+' '+(String(x[1]).trim()||'__'));
  L.push('VS: '+vl.join(', ')+'.');
  active.forEach(t=>{const s=state[t.id];t.fields.filter(f=>f.id==='exam').forEach(f=>{const val=joinSel(f,s);if(val)L.push('EX: '+val+'.');});});
  entries.forEach(e=>{if(e.pe)L.push('PE ('+e.id+'): '+e.pe);});
  L.push('');L.push('A — ASSESSMENT');
  if(entries.length){L.push('Algorithm / code: '+entries.map(e=>e.title+' ('+e.id+')').join('; ')+'.');
    L.push('Protocol summary:');
    entries.forEach(e=>{if(entries.length>1)L.push(' '+e.title+' ('+e.id+'):');(e.lines||[]).forEach(x=>L.push('  '+x));});
    const pos=[];entries.forEach(e=>(e.pos||[]).forEach(x=>{if(!pos.includes(x))pos.push(x);}));
    if(pos.length)L.push('*** RED FLAG: '+pos.join('; ')+' ***');
  }else L.push('No ADTMC protocol screened.');
  active.forEach(t=>{const rn=(t.redFlags||[]).filter(f=>state[t.id].rf[f]==='pos');if(rn.length)L.push('*** RED FLAG PRESENT: '+rn.join('; ')+' — ESCALATED to provider/ER. ***');});
  L.push('');L.push('P — PLAN');
  const plans=[];active.forEach(t=>[...state[t.id].plan].forEach(p=>{if(!plans.includes(p))plans.push(p);}));
  const A=adNoteParts();
  plans.forEach(p=>L.push('- Recommend '+p+'.'));A.plan.forEach(p=>L.push('- '+p));
  if(plans.some(p=>p.includes('— Mendoza Pharmacy')))L.push('Meds are recommendations; pick up at Mendoza Pharmacy (not a prescription).');
  if(!plans.length&&!A.plan.length)L.push('- Per protocol endpoint / provider direction.');
  L.push('');L.push('D — DISPOSITION');
  const hi=adHighest();
  L.push('Care category: '+(hi?SD_CAT[hi]||LV[hi].s:'not yet determined')+(entries.length>1&&hi?' (higher of the protocols screened)':'')+'.');
  if(hi==='AEM')L.push(settings.aemOn?'Referred to AEM'+(aemWho()?' ('+aemWho()+')':'')+' for evaluation.':'No AEM available in unit — referred to supervising privileged provider (clinic).');
  const mcp=entries.filter(e=>e.level==='MCP').map(e=>e.id);
  if(mcp.length)L.push('MCP protocol(s): '+mcp.join(', ')+'.');
  if(ad.prov.trim())L.push('Provider / AEM notified: '+ad.prov.trim()+'.');
  const dt=active.filter(t=>state[t.id].dispoTxt.trim());
  dt.forEach(t=>L.push('Disposition / counseling'+(dt.length>1?' ('+t.title.split('/')[0].trim()+')':'')+': '+state[t.id].dispoTxt.trim()));
  return L.join('\n');
}
function menuClose(){const m=document.getElementById('moreMenu');if(m)m.open=false;}
document.addEventListener('click',e=>{const m=document.getElementById('moreMenu');if(m&&m.open&&!m.contains(e.target))m.open=false;});
function toggleFmt(){settings.noteFmt=settings.noteFmt==='soapd'?'compact':'soapd';saveSettings();syncFmtBtn();renderNote();}
function syncFmtBtn(){const b=document.getElementById('fmtBtn');if(b){b.textContent=settings.noteFmt==='soapd'?'SOAP-D ✓':'SOAP-D';b.classList.toggle('copied',settings.noteFmt==='soapd');}}

function renderNote(){
  persist();adPersist();
  if(editMode||manualNote){renderNav();return;}
  if(settings.noteFmt==='soapd'){
    const _n=new Date(),_M=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const _st=String(_n.getDate()).padStart(2,'0')+' '+_M[_n.getMonth()]+' '+String(_n.getFullYear()).slice(2)+', '+String(_n.getHours()).padStart(2,'0')+String(_n.getMinutes()).padStart(2,'0');
    const _t=soapdNote(_st);
    if(_t){document.getElementById('note').textContent=_t;renderNav();return;}
  }
  const L=[];const A=adNoteParts();
  // header: date/time + patient
  const now=new Date();
  const MO=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const stamp=String(now.getDate()).padStart(2,'0')+' '+MO[now.getMonth()]+' '+String(now.getFullYear()).slice(2)+', '+String(now.getHours()).padStart(2,'0')+String(now.getMinutes()).padStart(2,'0');
  L.push((patient.trim()?('PT: '+patient.trim()+' — '):'')+stamp);
  // vitals globales
  const v=gVitals, vl=[];
  if(v.bp)vl.push('BP '+v.bp); if(v.hr)vl.push('HR '+v.hr); if(v.rr)vl.push('RR '+v.rr);
  if(v.temp)vl.push('T '+v.temp); if(v.spo2)vl.push('SpO2 '+v.spo2); if(v.pain)vl.push('Pain '+v.pain);
  if(vl.length)L.push('VS: '+vl.join(', '));
  // active sections (any template with content)
  const active=noteActive();
  // positive red flags from ALL sections → top
  const posAll=[];
  active.forEach(t=>{(t.redFlags||[]).forEach(f=>{if(state[t.id].rf[f]==='pos')posAll.push(f);});});
  if(posAll.length)L.push('*** RED FLAG PRESENT: '+posAll.join('; ')+' — ESCALATED to provider/ER. ***');
  if(A.rfpos.length)L.push('*** RED FLAG: '+A.rfpos.join('; ')+' ***');
  if(adHighest()==='PN')L.push('*** SEND TO CLINIC — PROVIDER NOW ***');
  L.push('');
  const multi=active.length>1;
  active.forEach(t=>{
    if(multi)L.push('--- '+t.icon+' '+t.title.split('/')[0].trim().toUpperCase()+' ---');
    L.push(...sectionLines(t,state[t.id]));
    if(multi)L.push('');
  });
  {const _sc=noteEntries().filter(e=>e.hpi||e.pe);if(_sc.length){if(L[L.length-1]!=='')L.push('');_sc.forEach(e=>{const pre=_sc.length>1?e.id+' ':'';if(e.hpi)L.push(pre+'HPI (screening): '+e.hpi);if(e.pe)L.push(pre+'PE (screening): '+e.pe);});}}
  if(A.assess.length){if(L[L.length-1]!=='')L.push('');L.push('ASSESSMENT:');L.push(...A.assess);}
  // combined plan (dedupe across sections)
  const plans=[];
  active.forEach(t=>{[...state[t.id].plan].forEach(p=>{if(!plans.includes(p))plans.push(p);});});
  if(plans.length||A.plan.length){
    if(L[L.length-1]!=='')L.push('');
    L.push('PLAN:');
    plans.forEach(p=>L.push('- Recommend '+p+'.'));
    A.plan.forEach(p=>L.push('- '+p));
    if(plans.some(p=>p.includes('— Mendoza Pharmacy')))L.push('Meds are recommendations; pick up at Mendoza Pharmacy (not a prescription).');
  }
  // dispositions (labeled per section if several)
  const dtpls=active.filter(t=>state[t.id].dispoTxt.trim());
  if(dtpls.length||A.dispo){
    L.push('');
    if(A.dispo)L.push('DISPO: '+A.dispo);
    dtpls.forEach(t=>L.push('DISPO'+(dtpls.length>1?' ('+t.title.split('/')[0].trim()+')':'')+': '+state[t.id].dispoTxt.trim()));
  }
  const hasAny=active.length||vl.length||patient.trim()||A.assess.length;
  const el=document.getElementById('note');
  if(!hasAny){
    el.innerHTML='<span class="dimline">Pick a complaint from the index and tap options — the note writes itself here.\n\nYou can COMBINE complaints: finish one (Done) and open another; the note joins both with one set of vitals.\n\nShortcuts: D index · Q/M/P/A/G references.\nThe green dot ● in the menu = complaint in the note.\n\n"Save ➜ next" files EVERYTHING and clears for the next Soldier.</span>';
  } else {
    el.textContent=L.join('\n');
  }
  renderNav();
}
/* ===== PII guard: personal identifiers must not be typed into notes ===== */
const PII_RX=[
  [/(?<!\d)\d{3}-\d{2}-\d{4}(?!\d)/,'SSN'],
  [/(?<![\d.\/])\d{9}(?![\d.\/])/,'SSN (9 digits)'],
  [/(?<![\d.\/])\d{10}(?![\d.\/])/,'DoD ID (10 digits)'],
  [/\b(?:DOB|D\.O\.B\.?|date of birth|born on)\b/i,'Date of birth'],
  [/(?<!\d)\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}(?!\d)/,'Phone number'],
  [/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/,'Email'],
  [/\b(?:SSN|social security|EDIPI|DoD ?ID)\b/i,'ID number'],
  [/\b(?:MRN|medical record (?:number|no\.?))\b/i,'Medical record number']
];
function piiFind(t){if(!t||t.length<4)return[];const f=[];PII_RX.forEach(([rx,l])=>{if(rx.test(t)&&!f.includes(l))f.push(l);});return f;}
function piiNoteWarn(list){const w=document.getElementById('piiWarn');if(!w)return;
  if(!list||!list.length){w.style.display='none';w.innerHTML='';return;}
  w.innerHTML='🛡️ <b>'+L('Personal info detected','Datos personales detectados')+':</b> '+list.map(q$).join(', ')+'. '+L('Remove it from the note before saving. Never store real patient identifiers.','Quítalos de la nota antes de guardar. Nunca guardes identificadores reales de pacientes.');w.style.display='block';}
document.addEventListener('input',e=>{
  const el=e.target;if(!el||!el.closest||el.closest('#slipOv')||el.dataset.piiOk)return;
  if(!el.closest('#main')&&!el.closest('#aside'))return;
  if(el.id==='note'){piiNoteWarn(piiFind(el.textContent));return;}
  if(!/^(INPUT|TEXTAREA)$/.test(el.tagName)||el.type==='password')return;
  const list=piiFind(el.value);let w=el.nextElementSibling;
  if(!w||!w.classList||!w.classList.contains('pii-warn')){if(!list.length)return;w=document.createElement('div');w.className='pii-warn';el.after(w);}
  w.textContent=list.length?'🛡️ '+L('Looks like personal info','Parece un dato personal')+' ('+list.join(', ')+'). '+L('Do not type patient identifiers here.','No escribas identificadores del paciente aquí.'):'';
  w.style.display=list.length?'block':'none';
},true);
function copyNote(btn){
  const txt=document.getElementById('note').textContent;
  copyTxt(txt,btn);
}
function copyTxt(txt,btn){
  const done=()=>{if(btn){const o=btn.textContent;btn.textContent='✓';btn.classList.add('copied');setTimeout(()=>{btn.textContent=o;btn.classList.remove('copied');},900);}};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done).catch(()=>{fallbackCopy(txt);done();});}
  else{fallbackCopy(txt);done();}
}
function fallbackCopy(txt){
  const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
}

/* keyboard shortcuts */
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)||document.activeElement.isContentEditable)return;
  const n=parseInt(e.key);
  if(false){}
  else if(e.key==='q'||e.key==='Q'){goRef('preguntas');}
  else if(e.key==='m'||e.key==='M'){goRef('admeds');}
  else if(e.key==='p'||e.key==='P'){goRef('perfiles');}
  else if(e.key==='g'||e.key==='G'){goRef('guardados');}
  else if(e.key==='a'||e.key==='A'){goRef('assess');}
  else if(e.key==='d'||e.key==='D'){goRef('adtmc');}
});

const LV={
 PN:{n:'I — PROVIDER NOW',s:'Provider Now',f:'REFER TO CLINIC — Provider Now (ADTMC I)',r:5,c:'pn'},
 AEM:{n:'II — AEM NOW',s:'AEM Now',f:'REFER TO CLINIC — AEM Now (ADTMC II)',r:4,c:'aem'},
 APPT:{n:'Schedule appointment / referral',s:'Schedule appointment / referral',f:'APPOINTMENT / REFERRAL at clinic',r:3,c:'appt'},
 SP:{n:'IV — Specialty referral',s:'Specialty referral',f:'REFER to specialty (ADTMC IV)',r:3,c:'sp'},
 MCP:{n:'III — Minor-Care Protocol (MCP)',s:'Minor-Care Protocol',f:'TREAT HERE — Minor-Care Protocol (ADTMC III)',r:2,c:'mcp'}
};
const CATS={a:'A · ENT',b:'B · MSK',c:'C · GI',d:'D · Cardio/Resp',e:'E · GU',f:'F · Neuro/BH',g:'G · General',h:'H · Eyes',i:'I · Women',j:'J · Skin',k:'K · Environment',l:'L · Misc',m:'M · Return'};
const gFlags={female:false,lmp:'',preg:false,lact:false,aviation:false,mrc:''};
let ad={pid:null,rf:{},rfDone:false,dp:{},dpDone:{},out:{},ret:false,worse:false,prov:'',vovr:false,sympBP:false,stBP:'',stHR:'',q:'',cat:'',prev:null,log:[],sel:{}};
function adResetProto(){ad.iq=null;ad.hfull=false;ad.pid=null;ad.rf={};ad.rfDone=false;ad.dp={};ad.dpDone={};ad.out={};ad.sel={};ad.pl={};ad.dur=null;}
function adResetAll(){adResetProto();ad.linked=[];ad.ret=false;ad.worse=false;ad.prov='';ad.vovr=false;ad.sympBP=false;ad.stBP='';ad.stHR='';ad.prev=null;ad.log=[];
  gFlags.female=false;gFlags.lmp='';gFlags.preg=false;gFlags.lact=false;gFlags.mrc='';}
/* Screening answers -> history / exam wording (data/notetags.js) */
function adTagLines(p){
  const T=(typeof NOTE_TAGS!=='undefined'&&NOTE_TAGS[p.id])||null;const out={hpi:'',pe:''};if(!T)return out;
  // detail: 'minimal' = positives only · 'short' (default) = no red-flag negatives (the note already says "No red flags.") · 'full' = every pertinent negative
  const detail=settings.noteDetail||'short';
  const yes=[],no=[],pe=[];
  const put=(item,isYes,isRf)=>{const t=T[item];if(!t)return;
    const neg=t.inv?isYes:!isYes;
    if(neg&&(detail==='minimal'||(detail==='short'&&isRf)))return;
    if(t.inv){(isYes?no:yes).push(t.inv);return;}
    const txt=isYes?t.y:t.n;if(!txt)return;
    if(t.k==='pe')pe.push(txt);else (isYes?yes:no).push(txt);};
  rfList(p).forEach(f=>{if(ad.rf[f]==='pos')put(f,true,true);else if(ad.rf[f]==='neg')put(f,false,true);});
  p.flow.forEach((st,i)=>{if(!st.items||!ad.dpDone[i])return;const a=ad.dp[i]||[];st.items.forEach((it,j)=>put(it,a.includes(j),false));});
  const uniq=a=>a.filter((x,i)=>a.indexOf(x)===i);
  const y=uniq(yes),n=uniq(no).filter(x=>!y.includes(x));
  out.hpi=[y.length?'Reports '+y.join(', ')+'.':'',n.length?'Denies '+n.join(', ')+'.':''].filter(Boolean).join(' ');
  out.pe=uniq(pe).length?uniq(pe).join('. ')+'.':'';
  return out;
}
function noteEntries(){const ex=new Set(ad.excl||[]);const e=ad.log.filter(x=>!ex.has('ad:'+x.id));
  if(ad.pid&&!ex.has('ad:'+ad.pid)){const p=getP(ad.pid),R=adEval(p);if(R.final||Object.keys(ad.dpDone).length||Object.keys(ad.rf).length)e.push(adEntry(p,R));}return e;}
function noteActive(){const ex=new Set(ad.excl||[]);return TPLS.filter(t=>tplHasContent(t,state[t.id])&&!ex.has('tpl:'+t.id));}
function noteTog(k){const a=ad.excl||(ad.excl=[]);const i=a.indexOf(k);const off=i<0;off?a.push(k):a.splice(i,1);
  if(k.startsWith('ad:')){try{const id=k.slice(3),tid=protoTpl(id).tid,tk='tpl:'+tid;
    const others=ad.log.map(x=>x.id).concat(ad.pid?[ad.pid]:[]).filter(x=>x!==id&&!a.includes('ad:'+x)&&protoTpl(x).tid===tid);
    const j=a.indexOf(tk);if(off&&!others.length&&j<0)a.push(tk);if(!off&&j>=0)a.splice(j,1);}catch(e){}}
  renderNote();}
function updMulti(){
  const box=document.getElementById('multiWarn');if(!box)return;
  const ex=new Set(ad.excl||[]);
  const prot=ad.log.map(x=>({k:'ad:'+x.id,l:x.id+' '+x.title}));
  if(ad.pid&&!ad.log.some(x=>x.id===ad.pid)){const p=getP(ad.pid);prot.push({k:'ad:'+p.id,l:p.id+' '+p.title+' ('+L('in progress','en curso')+')'});}
  const secs=TPLS.filter(t=>tplHasContent(t,state[t.id])).map(t=>({k:'tpl:'+t.id,l:t.title}));
  const grp=(arr,ttl)=>arr.length>1?'<div class="mw-g"><span class="mw-t">'+ttl+'</span>'+arr.map(x=>'<span class="chip '+(ex.has(x.k)?'':'on')+'" onclick="noteTog(\''+x.k+'\')">'+(ex.has(x.k)?'✕ ':'✓ ')+q$(x.l)+'</span>').join('')+'</div>':'';
  const lk=ad.linked||[];const chained=prot.length>1&&prot.slice(1).every(x=>lk.includes(x.k.slice(3)));
  const h=chained?'':grp(prot,L('Protocols','Protocolos'))+grp(secs,L('History sections','Secciones de historia'));
  box.innerHTML=h?'<div class="mw-h">⚠️ '+L('This note has more than one complaint. Tap any that does not belong to this patient to leave it out.','Esta nota tiene más de una queja. Toca la que no sea de este paciente para dejarla fuera.')+'</div>'+h:'';
  box.style.display=h?'block':'none';
  const incl=a=>a.filter(x=>!ex.has(x.k)).length;
  const pk=document.getElementById('pkS');if(pk&&h&&(incl(prot)>1||incl(secs)>1))pk.innerHTML='<b style="color:var(--orange)">⚠️ '+L('More than one complaint — review','Más de una queja — revisar')+'</b>';
}
function adPersist(){try{localStorage.setItem('sc_ad',JSON.stringify({ad,gFlags,day:new Date().toDateString()}));}catch(e){}}
function adRestore(){try{const d=JSON.parse(localStorage.getItem('sc_ad')||'null');if(!d)return;
  if(settings.purge&&d.day!==new Date().toDateString())return;
  Object.assign(ad,d.ad||{});Object.assign(gFlags,d.gFlags||{});}catch(e){}}
const q$=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const getP=id=>PR.find(p=>p.id===id);
const rfList=p=>(p.rf||[]).filter(x=>!/^none/i.test(x));

/* ---- global ADTMC rules: vitals ---- */
function numOf(s){const m=String(s||'').match(/-?\d+(\.\d+)?/);return m?parseFloat(m[0]):null;}
function lmpDays(){if(!gFlags.lmp)return null;const d=new Date(gFlags.lmp+'T00:00:00');if(isNaN(d))return null;return Math.floor((Date.now()-d.getTime())/864e5);}
function adVitals(){
  const v=gVitals,abn=[],warn=[];
  let t=numOf(v.temp);
  if(t!==null){if(/c/i.test(v.temp)&&t<50)t=t*9/5+32; if(t>=100.4)abn.push('Temp '+v.temp+' (≥100.4°F)'); else if(t<=97.0)abn.push('Temp '+v.temp+' (≤97.0°F)');}
  const hr=numOf(v.hr); if(hr!==null&&(hr<60||hr>90))abn.push('HR '+v.hr+' (<60 o >90)');
  const rr=numOf(v.rr); if(rr!==null&&(rr<=8||rr>20))abn.push('RR '+v.rr+' (≤8 o >20)');
  const sp=numOf(v.spo2); if(sp!==null&&sp<93)abn.push('SpO2 '+v.spo2+' (<93%)');
  const bp=parseBP();
  if(bp){
    if(bp.s>=130||bp.d>=80)abn.push('BP '+v.bp+' (≥130/80)');
    if(bp.s<=100||bp.d<=60){ad.sympBP?abn.push('BP '+v.bp+' (≤100/60 symptomatic)'):warn.push('Low BP ('+v.bp+', ≤100/60): if symptomatic → mark "symptomatic" = Provider Now.');}
  }
  const sb=(ad.stBP||'').match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if(bp&&sb){if(bp.s-(+sb[1])>=20||bp.d-(+sb[2])>=10)abn.push('Orthostatic: BP '+v.bp+' → '+ad.stBP+' (drop ≥20 sys / ≥10 dia)');}
  const sh=numOf(ad.stHR); if(hr!==null&&sh!==null&&sh-hr>=20)abn.push('Orthostatic: HR '+hr+' → '+sh+' (+≥20)');
  const pain=numOf(v.pain);
  return{abn,warn,pain};
}
/* ---- evaluate a protocol ---- */
function adEval(p){
  const R={esc:[],warn:[],level:null,final:null,cur:-1,end:p.flow.length-1,tri:[],sum:[],done:false};
  const vit=adVitals();
  if(vit.abn.length){ if(ad.vovr)R.warn.push('Abnormal vitals reviewed and accepted by provider: '+vit.abn.join('; ')); else R.esc.push({lv:'PN',why:'Abnormal vitals (ADTMC global rule): '+vit.abn.join('; ')}); }
  vit.warn.forEach(w=>R.warn.push(w));
  if(vit.pain!==null){ if(vit.pain>=7)R.esc.push({lv:'PN',why:'Pain '+vit.pain+'/10 (7–10 → Provider)'}); else if(vit.pain>=5)R.esc.push({lv:'AEM',why:'Pain '+vit.pain+'/10 (5–6 → at least AEM)'}); }
  const rfs=rfList(p), rfPos=rfs.filter(f=>ad.rf[f]==='pos');
  if(rfPos.length)R.esc.push({lv:'PN',why:'Red flag present: '+rfPos.join('; ')});
  if(ad.worse)R.esc.push({lv:'PN',why:'Worsening on treatment / already seen by provider or AEM (M-1 → clinic)'});
  else if(ad.ret)R.esc.push({lv:'AEM',why:'Return for the same complaint → never below AEM (M-1)'});
  const ld=lmpDays(); if(gFlags.female&&ld!==null&&ld>28)R.warn.push('LMP '+ld+' days ago (>28) → contact provider; consider hCG / pregnancy before giving meds.');
  // walk the flowchart
  let lvl=null;
  for(let i=0;i<p.flow.length;i++){
    const st=p.flow[i];
    if(st.ex!==undefined){
      if(st.out&&st.out.length){const o=ad.out['x'+i]; if(o===undefined){R.cur=i;break;} const oo=st.out[o]; if(oo.d){lvl=oo.d;R.end=i;break;} }
      continue;
    }
    if(!ad.dpDone[i]){R.cur=i;break;}
    const sel=ad.dp[i]||[], min=st.min||1, fired=sel.length>=min;
    if(fired){
      const y=st.yes||{};
      if(y.out){const o=ad.out[i]; if(o===undefined){R.cur=i;break;} const oo=y.out[o]; if(oo.d){lvl=oo.d;R.end=i;break;} continue;}
      if(y.d){lvl=y.d;R.end=i;break;}
      if(y.tri){R.tri=y.tri;R.end=i;break;}
    } else if(st.none&&sel.length===0){lvl=st.none.d;R.end=i;break;}
  }
  if(R.cur===-1&&!lvl&&!R.tri.length&&(p.tx||[]).length)lvl='MCP';
  R.level=lvl;
  R.done=R.cur===-1&&(lvl||R.tri.length);
  const cand=[...R.esc]; if(lvl)cand.push({lv:lvl,why:'Protocol endpoint '+p.id});
  cand.sort((a,b)=>LV[b.lv].r-LV[a.lv].r);
  R.final=cand.length?cand[0].lv:null;
  // if red flags/vitals already force PN the rest of the flow is moot
  R.forced=R.esc.some(e=>e.lv==='PN');
  return R;
}
function adHighest(){ // highest disposition among committed + current
  let best=null;const take=l=>{if(l&&(!best||LV[l].r>LV[best].r))best=l;};
  noteEntries().forEach(e=>take(e.level));
  return best;
}
function adForcesPN(){ // used to block RTD/Light duty chips
  const l=adHighest();return l==='PN';
}
function hasPosRF(){return TPLS.some(t=>(t.redFlags||[]).some(f=>state[t.id].rf[f]==='pos'));}

/* ---- med lookup + safety review ---- */
const MEDRE=[[/ibuprofen|motrin/i,'ibuprofen'],[/acetaminophen|tylenol/i,'acetaminophen'],[/naproxen/i,'naproxen'],[/ketorolac|toradol/i,'ketorolac'],[/analgesic balm|menthol/i,'menthol'],[/lidocaine/i,'lidocaine'],[/phenazopyridine/i,'phenazopyridine'],[/bacitracin|antibiotic ointment|antibacterial ointment/i,'bacitracin'],[/terbinafine|antifungal/i,'terbinafine'],[/azithromycin/i,'azithromycin'],[/ceftriaxone/i,'ceftriaxone'],[/doxycycline/i,'doxycycline'],[/fluconazole/i,'fluconazole'],[/metronidazole/i,'metronidazole'],[/nitrofurantoin/i,'nitrofurantoin'],[/permethrin 5/i,'permethrin5'],[/permethrin/i,'permethrin1'],[/tmp|sulfamethoxazole|bactrim/i,'tmpsmx'],[/valacyclovir/i,'valacyclovir'],[/diphenhydramine|benadryl/i,'diphenhydramine'],[/loratadine|claritin/i,'loratadine'],[/ranitidine|h2/i,'ranitidine'],[/benzocaine|cepacol|lozenge/i,'benzocaine'],[/oxymetazoline|afrin/i,'oxymetazoline'],[/pseudoephedrine|sudafed/i,'pseudoephedrine'],[/guaifenesin/i,'guaifenesin'],[/polyethylene|miralax/i,'peg'],[/docusate|stool softener/i,'docusate'],[/loperamide/i,'loperamide'],[/bisacodyl/i,'bisacodyl'],[/bismuth|pepto/i,'bismuth'],[/albuterol/i,'albuterol'],[/aspirin/i,'aspirin'],[/epinephrine|epi ?pen/i,'epinephrine'],[/glucagon/i,'glucagon'],[/calamine/i,'calamine'],[/burow|aluminum acetate/i,'burow'],[/propylene|artificial tears/i,'tears'],[/hydrocortisone 2\.5/i,'analpram'],[/acetic acid/i,'acetasol'],[/hydrocortisone/i,'hc1'],[/adapalene|retinoid/i,'adapalene'],[/benzoyl/i,'benzoyl'],[/povidone|betadine/i,'povidone']];
function medLookup(name){for(const [re,k] of MEDRE)if(re.test(name))return ADMEDS.find(m=>m.k===k);return null;}
function patientAllergies(){const s=new Set();TPLS.forEach(t=>{const f=state[t.id].fields.a;if(f)f.forEach(x=>s.add(x));});return s;}
function adPreg(){
  const ld=lmpDays();
  return gFlags.preg||(gFlags.female&&ld!==null&&ld>35)||(state.gyn&&(state.gyn.cc.has('possible pregnancy')||state.gyn.cc.has('missed period')))||(state.gyn&&/late|missed|retras|no period|no menstr/i.test(state.gyn.custom.lmp||''));
}
function medSafety(m){
  const w=[],i=[],al=patientAllergies(),ci=otcCI();
  if(m.nsaid&&(al.has('NSAIDs (Motrin/Aspirin)')))w.push('NSAID allergy');
  if(m.k==='aspirin'&&al.has('NSAIDs (Motrin/Aspirin)'))w.push('NSAID/salicylate allergy');
  if(m.k==='bismuth'&&al.has('NSAIDs (Motrin/Aspirin)'))w.push('Salicylate allergy');
  if(m.k==='ceftriaxone'&&['penicillin','amoxicillin','cephalosporins'].some(x=>al.has(x)))w.push('Penicillin/cephalosporin allergy');
  if(m.k==='tmpsmx'&&al.has('sulfa'))w.push('Sulfa allergy');
  if(m.k==='doxycycline'&&al.has('tetracycline'))w.push('Tetracycline allergy');
  if(m.k==='lidocaine'&&al.has('lidocaine'))w.push('Lidocaine allergy');
  if(m.nsaid&&ci.ulcer)w.push('Hx ulcers / GI bleeding');
  if(m.decong&&(ci.htn||ci.bpHigh))w.push('HTN / elevated BP');
  if(adPreg()){ if(/unsafe|class d|avoid|not in 1st|do not use/i.test(m.preg))w.push('Possible pregnancy: '+m.preg); else if(/class c|unknown/i.test(m.preg))i.push('Pregnancy: '+m.preg+' — confirm with provider'); }
  if(gFlags.lact&&/unsafe|not recommended|avoid|not preferred/i.test(m.lac))w.push('Lactation: '+m.lac);
  if(gFlags.aviation)i.push('Flight status: confirm aeromedical class (a combination with a prohibited component is prohibited).');
  if(m.rx)i.push('Prescription required: notify the provider before dispensing (Appendix C).');
  if(m.note)i.push(m.note);
  return{w,i};
}
function medBox(p){
  const seen=new Set(),rows=[];
  (p.meds||[]).forEach(n=>{const m=medLookup(n);const key=m?m.k:n;if(seen.has(key))return;seen.add(key);rows.push({n,m});});
  if(!rows.length)return'';
  let h='<div class="field"><div class="lab"><span class="tag">💊</span><span class="name">Protocol meds — safety review</span><span class="ask">Appendix C · check allergies and LMP before dispensing</span></div>';
  rows.forEach(({n,m})=>{
    if(!m){h+='<div class="medrow"><b>'+q$(n)+'</b> <span class="dim">— not in Appendix C; follow the protocol instruction.</span></div>';return;}
    const s=medSafety(m);
    h+='<div class="medrow'+(s.w.length?' bad':'')+'"><b>'+q$(m.n)+'</b> <span class="dim">('+q$(m.t)+')'+(m.rx?' · <span class="rxb">Rx</span>':'')+'</span><div>'+q$(m.dose)+(m.max?' · <b>max '+q$(m.max)+'</b>':'')+'</div>';
    s.w.forEach(x=>h+='<div class="mw">⚠️ '+q$(x)+'</div>');
    s.i.forEach(x=>h+='<div class="mi">ℹ️ '+q$(x)+'</div>');
    h+='</div>';
  });
  return h+'<div class="fuq">Counsel on indication, side effects and how to take it; check allergies and LMP before dispensing (ADTMC App. C). Mendoza Pharmacy: also follow the local list.</div></div>';
}

/* ---- views ---- */
const CATTPL={a:'ent',b:'msk',c:'ill',d:'ill',e:'gyn',f:'ha',g:'ill',h:'ent',i:'gyn',j:'skin',k:'skin',l:'ill',m:'fu'};
/* ---- History depth per ADTMC protocol: not every complaint needs a full OPQRST/AMPLE ---- */
const HQUICK=['L-4','L-6','L-12','L-8','L-9','L-10','J-12','I-5','I-6','L-5']; // reason for visit + allergies/meds only
const HFOCUS=['J-2','J-3','J-4','J-5','J-6','J-7','J-8','J-9','J-10','J-11','J-13','J-14','J-15','J-16','J-17','J-18',
  'K-1','K-2','K-3','K-4','K-5','K-6','K-7','L-1','L-2','L-3','L-7','A-5','H-2','H-3','I-2','C-5','C-7','M-2'];
const HFIELDS={quick:['a','m','exam'],focus:['o','r','sx','e','a','m','exam','seen','s2','lmp']};
const HCCTXT={'L-4':'Prescription refill request','L-6':'Requests immunization','L-12':'Requests nonprescription / traveling medication','L-8':'Blood pressure check','L-9':'Medical screening for overseas PCS','L-10':'Weight reduction','J-12':'Suture removal','I-5':'Requests Pap / routine pelvic exam','I-6':'Requests contraception information','L-5':'Requests vasectomy'};
function hmode(){if(!ad.pid||ad.hfull)return 'full';return HQUICK.includes(ad.pid)?'quick':(HFOCUS.includes(ad.pid)?'focus':'full');}
function visFields(t){const m=hmode();return m==='full'?t.fields:t.fields.filter(f=>HFIELDS[m].includes(f.id));}
function adFullHist(){ad.hfull=true;ccRawOff();guided=null;renderMain();renderNote();}
function ccRawOff(){const s=state[cur];if(s&&s.ccRaw){if(s.ccCustom===s.ccRawTxt)s.ccCustom='';s.ccRaw=false;s.ccRawTxt='';}}
function protoTpl(id){
  const p=getP(id),pref=(p&&CATTPL[p.cat])||'ill';
  const find=tid=>{const mp=CCMAP[tid]||{};const ccs=[];let hit=false;Object.keys(mp).forEach(cc=>{if(mp[cc].includes(id)){hit=true;if(cc!=='*')ccs.push(cc);}});return hit?{tid,ccs}:null;};
  return find(pref)||Object.keys(CCMAP).map(find).find(Boolean)||{tid:pref,ccs:[]};
}
function adOpen(id){
  foldPid=null;foldCur={};ccRawOff();const keep=ad.prev;adResetProto();ad.pid=id;ad.prev=keep;
  const m=protoTpl(id);if(guided&&guided.tpl!==m.tid)guided=null;
  cur=m.tid;view='tpl';
  if(m.ccs.length===1&&!state[cur].cc.size)state[cur].cc.add(m.ccs[0]);
  if(HQUICK.includes(id)){const s=state[cur];if(!s.ccCustom.trim()){s.ccCustom=HCCTXT[id]||getP(id).title;s.ccRaw=true;s.ccRawTxt=s.ccCustom;}}
  renderNav();renderMain();renderNote();document.getElementById('main').scrollTop=0;
}

function adAnswers(){
  const s=state[cur];if(!s)return'';const a=[...s.cc,s.ccCustom];
  for(const f in s.fields)s.fields[f].forEach(o=>{if(!String(o).startsWith('DENY::'))a.push(o);});
  for(const f in s.custom)a.push(s.custom[f]);
  if(s.sev!==null&&s.sev>=1)a.push(s.sev>=7?'sev-high':s.sev>=5?'sev-mod':'sev-mild');
  let tt=numOf(gVitals.temp);if(tt!==null){if(/c/i.test(gVitals.temp)&&tt<50)tt=tt*9/5+32;if(tt>=100.4)a.push('fever-temp');}
  return a.join(' | ').toLowerCase();
}
function adCut(s,n){s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).replace(/[ ,;:.-]+\S*$/,'')+'…':s;}
function adPlanItems(p){
  const E=PLANS[p.id],ans=adAnswers(),ov=ad.pl||{};
  const test=w=>{try{return new RegExp(w,'i').test(ans);}catch(e){return false;}};
  let adv,meds,act,rtc;
  if(E){adv=(E.adv||[]).map(x=>({t:x.t,w:x.w,def:x.w?test(x.w):true}));meds=(E.meds||[]).map(x=>({t:x.m,w:x.w,def:x.w?test(x.w):false}));act=(E.act||[]).map(x=>({t:x.t,w:x.w,def:x.w?test(x.w):true}));rtc=E.rtc||'';}
  else{adv=(p.tx||[]).slice(0,3).map(t=>({t:adCut(t.replace(/^(MCP [^:]*|Medication|OTC medication):\s*/i,''),60),def:true}));meds=(p.meds||[]).map(m=>({t:m,def:false}));act=(p.act&&p.act!=='None')?[{t:adCut(p.act,70),def:true}]:[];rtc=adCut(p.rtc,75);}
  const fin=(arr,k)=>arr.map((x,i)=>{const key=k+i;x.key=key;x.on=ov[key]!==undefined?ov[key]:x.def;return x;});
  meds=fin(meds,'m');
  meds.forEach(x=>{const m=medLookup(x.t);x.m=m;x.sf=m?medSafety(m):{w:[],i:[]};if(x.sf.w.length&&ov[x.key]===undefined)x.on=false;});
  const sg=adDurSug(p);return{adv:fin(adv,'a'),meds,act:fin(act,'c'),rtc:{t:rtc,key:'r',on:ov.r!==undefined?ov.r:!!rtc},dur:{sel:ad.dur||sg.v,sug:sg.v,src:sg.src}};
}
function adPlTog(k){const p=getP(ad.pid);const it=adPlanItems(p);const all=[...it.adv,...it.meds,...it.act,it.rtc].find(x=>x.key===k);ad.pl[k]=!(all&&all.on);renderMain();renderNote();}
function adMedLine(x){const m=x.m;if(!m)return x.t;return m.n.replace(/\s+\d.*$/,'')+' — '+m.dose;}
function adPlanLines(it){
  const L=[];
  const meds=it.meds.filter(x=>x.on).map(adMedLine);
  if(meds.length)L.push('Meds: '+meds.join('; ')+'.');
  const adv=it.adv.filter(x=>x.on).map(x=>x.t.replace(/[.;]+$/,''));
  if(adv.length)L.push(adv.join('; ')+'.');
  const act=it.act.filter(x=>x.on).map(x=>x.t.replace(/[.;]+$/,''));
  if(act.length){const hasD=act.every(x=>/\b\d+\s*(h|hrs?|hours?|days?)\b/i.test(x));const d=it.dur.sel;L.push('Activity'+(hasD?'':(d==='until re-evaluated'?' until re-evaluated':' x'+d.replace(/ h$/,'h')))+': '+act.join('; ')+'.');}
  if(it.rtc.on&&it.rtc.t)L.push(it.rtc.t.replace(/\.$/,'')+'.');
  return L;
}
function adDPSug(st){
  const a=adAnswers();
  return st.items.map((it,j)=>{
    if(/^no /i.test(it))return -1;
    const w=it.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(x=>x.length>3&&!['with','than','from','this','that','symptoms','present','recent','history','pain','known'].includes(x));
    if(!w.length)return -1;
    return w.every(x=>a.includes(x.replace(/s$/,'')))?j:-1;
  }).filter(j=>j>=0);
}
function adDPUse(i){const st=getP(ad.pid).flow[i];ad.dp[i]=adDPSug(st);ad.dpDone[i]=true;delete ad.out[i];renderMain();renderNote();}

function clrHas(tid,fid){const s=state[tid];if(!s)return false;
  if(fid==='__cc')return s.cc.size>0||!!s.ccCustom;
  if(fid==='__sev')return s.sev!==null||!!s.duty;
  if(fid==='__dispo')return !!s.dispo||!!s.dispoTxt;
  return !!(s.fields[fid]&&s.fields[fid].size)||!!s.custom[fid];}
function clrBtn(tid,fid){return clrHas(tid,fid)?'<span class="clr" onclick="clr(\''+tid+'\',\''+fid+'\')" title="Clear this section">✕ clear</span>':'';}
function clr(tid,fid){const s=state[tid];
  if(fid==='__cc'){s.cc.clear();s.ccCustom='';}
  else if(fid==='__sev'){s.sev=null;s.duty=null;}
  else if(fid==='__dispo'){s.dispo=null;s.dispoTxt='';}
  else{s.fields[fid].clear();s.custom[fid]='';}
  renderMain();renderNote();}
function adClrRf(){ad.rf={};ad.rfDone=false;renderMain();renderNote();}
function adClrPlan(){ad.pl={};ad.dur=null;renderMain();renderNote();}

const DUR_OPTS=['24 h','48 h','72 h','5 days','7 days','until re-evaluated'];
function adDurSug(p){
  const a=p.act||'',r=p.rtc||'';let m;
  if(/x\s*3 days|for 3 days|3 days/i.test(a))return{v:'72 h',src:'ADTMC'};
  if((m=a.match(/x\s*(\d+)(?:\s*[–-]\s*(\d+))?\s*hours?/i))){const n=+(m[2]||m[1]);return{v:n<=24?'24 h':n<=48?'48 h':'72 h',src:'ADTMC'};}
  if(/one day|1 day/i.test(a))return{v:'24 h',src:'ADTMC'};
  if(/1 week|7 days|one week/i.test(r))return{v:'7 days',src:'suggested'};
  if((m=r.match(/(\d+)\s*days?/i))){const d=+m[1];return{v:d>=7?'7 days':d>=5?'5 days':d>=3?'72 h':'48 h',src:'suggested'};}
  if(/24 hours/i.test(r))return{v:'24 h',src:'suggested'};
  return{v:'48 h',src:'suggested'};
}
function adDurSet(v){ad.dur=v;renderMain();renderNote();}
function adBack(){adResetProto();view='adtmc';renderNav();renderMain();renderNote();}
function adSetCat(c){ad.cat=ad.cat===c?'':c;renderMain();}
function adSearch(v){ad.q=v;const el=document.getElementById('adlist');if(el)el.innerHTML=adListItems();}
function adListItems(){
  const q=ad.q.trim().toLowerCase();let out='';
  Object.keys(CATS).forEach(c=>{
    const items=PR.filter(p=>p.cat===c&&(!q||(p.id+' '+p.title+' '+(p.ddx||[]).join(' ')).toLowerCase().includes(q)));
    if(!items.length)return;
    out+='<div class="cathead">'+CATS[c]+'</div>';
    out+=items.map(p=>{const done=ad.log.some(x=>x.id===p.id);return '<div class="prow" onclick="adOpen(\''+p.id+'\')"><span class="pid">'+p.id+'</span><span class="ptit">'+q$(p.title)+'</span>'+(done?'<span style="color:var(--green)">✓</span>':'')+'</div>';}).join('');
  });
  return out||'<p class="dim">No results.</p>';
}
function renderAD(){
  let h='<h2 class="tpl">🧭 Sick call — pick the complaint</h2><p class="tpl-sub">Organized by ADTMC letter (MEDCOM Pam 40-7-21). Each complaint opens one page: red-flag screening, OPQRST/AMPLE interview, plan and disposition.</p>';
  h+=prevHtml();
  if(ad.log.length)h+='<div class="note-hint">In the note: '+ad.log.map(e=>e.id+' '+q$(e.title)).join(' · ')+'</div>';
  h+='<div class="field"><input type="text" placeholder="Search: knee, sore throat, rash, fever, A-1…" value="'+q$(ad.q)+'" oninput="adSearch(this.value)" style="margin-top:0"></div>'+iqIndexRow()+'<div id="adlist" class="plist">'+adListItems()+'</div>';
  return h;
}
function adPatientCard(){return '<details class="dd" ontoggle="dd(\'adpt\',this.open)" '+(openDD.has('adpt')?'open':'')+'><summary>Optional data: female / LMP / pregnancy / MRC</summary>'+adPatientInner()+'</details>';}
function adPatientInner(){
  const ld=lmpDays();
  let h='<div class="field"><div class="lab"><span class="tag s2">PT</span><span class="name">Patient data (ADTMC)</span><span class="ask">sex · LMP · pregnancy · lactation · MRC</span></div><div class="chips">';
  h+='<span class="chip '+(gFlags.female?'on':'')+'" onclick="gfTog(\'female\')">Female</span>';
  if(gFlags.female){
    h+='<span class="chip '+(gFlags.preg?'on':'')+'" onclick="gfTog(\'preg\')">Possible pregnancy / pregnant</span><span class="chip '+(gFlags.lact?'on':'')+'" onclick="gfTog(\'lact\')">Lactating</span>';
  }
  h+='<span class="chip '+(gFlags.aviation?'on':'')+'" onclick="gfTog(\'aviation\')">Flight / dive status</span></div>';
  h+='<div class="subrow">';
  if(gFlags.female)h+='<div class="half"><div class="mini">LMP (date)</div><input type="date" value="'+q$(gFlags.lmp)+'" onchange="gfSet(\'lmp\',this.value)" class="dateIn"></div>';
  h+='<div class="half"><div class="mini">MRC status / delinquent requirements</div><input type="text" value="'+q$(gFlags.mrc)+'" placeholder="e.g. MRC 1, PHA overdue" oninput="gfSet(\'mrc\',this.value,1)"></div></div>';
  if(gFlags.female&&ld!==null)h+='<div class="'+(ld>28?'warn':'note-hint')+'" style="margin-top:8px;margin-bottom:0">LMP '+ld+' days ago'+(ld>28?' — >28 days: contact provider; treat as possible pregnancy until ruled out (hCG).':'.')+'</div>';
  return h+'</div>';
}
function gfTog(k){gFlags[k]=!gFlags[k];if(k==='female'&&!gFlags.female){gFlags.preg=false;gFlags.lact=false;gFlags.lmp='';}renderMain();renderNote();}
function gfSet(k,v,noRender){gFlags[k]=v;if(!noRender)renderMain();renderNote();}
function adVBanner(){
  const v=adVitals();let h='<div id="vbanner">';
  if(v.abn.length)h+='<div class="rfbanner">⚠️ ABNORMAL VITALS (ADTMC global rule) → '+(ad.vovr?'<span style="color:var(--hint-txt)">provider reviewed and cleared to continue</span>':'PROVIDER NOW')+'<br><span style="font-weight:400">'+v.abn.map(q$).join('<br>')+'</span></div>';
  v.warn.forEach(w=>h+='<div class="warn">'+q$(w)+'</div>');
  return h+'</div>';
}
function adVitalsInputs(){
  const vv=gVitals,bad=adVitals();
  const f=(k,l,ph)=>'<label>'+l+'<input type="text" value="'+q$(vv[k])+'" placeholder="'+ph+'" oninput="setVit(\'\',\''+k+'\',this.value)" onchange="adVC()"></label>';
  let h='<div class="field"><div class="lab"><span class="tag">VS</span><span class="name">Vitals</span><span class="ask">optional — only if you have the equipment</span></div><div class="vit">'+f('bp','BP','120/80')+f('hr','HR','72')+f('rr','RR','16')+f('temp','TEMP','98.6')+f('spo2','SpO2','98%')+f('pain','PAIN','0/10')+'</div>';
  h+='<div class="subrow"><div class="half"><div class="mini">Standing (optional, orthostatic): BP</div><input type="text" value="'+q$(ad.stBP)+'" placeholder="110/70" oninput="ad.stBP=this.value;adVU()"></div><div class="half"><div class="mini">Standing HR</div><input type="text" value="'+q$(ad.stHR)+'" placeholder="95" oninput="ad.stHR=this.value;adVU()"></div></div>';
  h+='<div class="chips" style="margin-top:8px"><span class="chip '+(ad.sympBP?'on':'')+'" onclick="ad.sympBP=!ad.sympBP;renderMain();renderNote()">Low BP with symptoms (dizzy/presyncope)</span><span class="chip '+(ad.vovr?'on':'')+'" onclick="ad.vovr=!ad.vovr;renderMain();renderNote()" title="Only if the provider already reviewed and cleared you to continue">Provider reviewed abnormal vitals → continue</span></div></div>';
  return h;
}
function adVC(){if(view==='adtmc'&&ad.pid)renderMain();}
function adVU(){const e=document.getElementById('vbanner');if(e)e.outerHTML=adVBanner();renderNote();}
function adRf(f){ad.rf[f]=ad.rf[f]==='neg'?'pos':(ad.rf[f]==='pos'?undefined:'neg');if(ad.rf[f]===undefined)delete ad.rf[f];renderMain();renderNote();}
function adRfSet(f){ad.rf[f]=ad.rf[f]==='pos'?'neg':'pos';renderMain();renderNote();}
function adRfAll(){rfList(getP(ad.pid)).forEach(f=>{if(ad.rf[f]!=='pos')ad.rf[f]='neg';});ad.rfDone=true;renderMain();renderNote();}
function adDPTog(i,j){const a=ad.dp[i]||(ad.dp[i]=[]);const k=a.indexOf(j);k<0?a.push(j):a.splice(k,1);ad.dpDone[i]=true;delete ad.out[i];renderMain();renderNote();}
function adDPNone(i){ad.dp[i]=[];ad.dpDone[i]=true;delete ad.out[i];renderMain();renderNote();}
function adOut(i,o){ad.out[i]=o;renderMain();renderNote();}
function adUndo(i){delete ad.dpDone[i];delete ad.out[i];delete ad.out['x'+i];renderMain();renderNote();}
function adHeadHtml(p){
  let h='<div class="algo-actions" style="margin:0 0 10px"><button class="ghost" onclick="adBack()">← Index</button></div>';
  h+='<h2 class="tpl"><span class="pid">'+p.id+'</span> '+q$(p.title)+'</h2>'+(foldOn()?'':'<p class="tpl-sub">Step 1: '+({quick:'reason for visit',focus:'focused history'}[hmode()]||'OPQRST / AMPLE interview')+' · Step 2: ADTMC screening · Step 3: decision and plan.</p>');
  h+=adLiveCard(p);
  if(ad.iq)h+=iqBanner(ad.iq);
  return h;
}
function adLiveCard(p){
  let R;try{R=adEval(p);}catch(e){return'';}
  const rfs=rfList(p),nPos=rfs.filter(f=>ad.rf[f]==='pos').length,nScr=rfs.filter(f=>ad.rf[f]).length;
  const go="var e=document.querySelector('.resbox')||[...document.querySelectorAll('.secbar')].pop();if(e)e.scrollIntoView({behavior:'smooth',block:'center'})";
  if(R.final){const lv=LV[R.final];let why=(R.esc.find(e=>e.lv===R.final)||{}).why;
    if(!why){const fired=[];let dn=0;p.flow.forEach((st,i)=>{if(st.items)dn++;const a=ad.dp[i];if(st.items&&a&&a.length)fired.push('DP'+dn+': '+a.map(j=>st.items[j]).filter(Boolean).join(', '));});why=fired.length?fired[fired.length-1]:('Protocol endpoint '+p.id);}
    if(foldOn())return '<div class="livecard lc1 lv-'+lv.c+'" onclick="'+go+'"><div class="lc-r"><b>'+L('Disposition','Disposición')+'</b><span class="lc-h">'+q$(lv.s)+'</span></div><div class="lc-m">'+q$(why)+'</div></div>';
    return '<div class="livecard lv-'+lv.c+'" onclick="'+go+'"><div class="lc-k">'+L('Suggested disposition','Disposición sugerida')+'<span>'+L('live','en vivo')+'</span></div><div class="lc-h">'+q$(lv.s)+'</div><div class="lc-m">'+q$(why)+' · '+L('see decision ↓','ver decisión ↓')+'</div></div>';}
  const pend=[];if(rfs.length&&nScr<rfs.length)pend.push(L('red flags','banderas rojas')+' '+nScr+'/'+rfs.length);
  if(foldOn())return '<div class="livecard lc1 lv-wait" onclick="'+go+'"><div class="lc-r"><b>'+L('Disposition','Disposición')+'</b><span class="lc-s">'+(pend.length?L('Pending · ','Pendiente · ')+pend.join(' · '):L('Answer the decision points','Responde los puntos de decisión'))+'</span></div></div>';
  return '<div class="livecard lv-wait" onclick="'+go+'"><div class="lc-k">'+L('Suggested disposition','Disposición sugerida')+'<span>'+L('live','en vivo')+'</span></div><div class="lc-h">'+L('In progress','En progreso')+'</div><div class="lc-m">'+(pend.length?L('Pending: ','Pendiente: ')+pend.join(' · '):L('Answer the decision points below.','Responde los puntos de decisión abajo.'))+'</div></div>';
}
/* ===== Patient QR questionnaire — medic side (data/intake.js) =====
   Scanned answers live in a short list on this device (no names/IDs), auto-deleted after 12 h or with "Clear list".
   Las respuestas escaneadas viven en una lista corta en este equipo (sin nombres/IDs), se borran solas a las 12 h o con "Borrar lista". */
let iqList=[];
function iqLoad(){try{const a=JSON.parse(localStorage.getItem('sc_iq')||'[]'),now=Date.now();iqList=Array.isArray(a)?a.filter(e=>e&&e.q&&now-e.at<12*3600e3):[];}catch(e){iqList=[];}}
function iqSave(){try{localStorage.setItem('sc_iq',JSON.stringify(iqList));}catch(e){}}
function iqToast(t){const el=document.getElementById('toast')||Object.assign(document.createElement('div'),{id:'toast'});if(!el.parentNode)document.body.appendChild(el);el.textContent=t;el.className='on';clearTimeout(el._h);el._h=setTimeout(()=>el.className='',2600);}
function iqAdd(q){const key=iqEncode(q);if(iqList.some(e=>e.key===key)){iqToast(L('Already in the triage list','Ya está en la lista de triaje'));return false;}
  iqList.push({id:Date.now()+Math.floor(Math.random()*1000),key,q,at:Date.now(),seen:false});iqSave();
  const tr=iqTriage(q);iqToast(L('Added: ','Agregado: ')+(iqWho(q)?iqWho(q)+' · ':'')+iqLvl(tr.c)+' · '+iqAreaTxt(q));return true;}
function iqHash(){const h=location.hash||'';if(!/iq=/.test(h))return;const q=iqDecode(h);try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  if(q){iqAdd(q);view='queue';ad.pid=ad.pid||null;}}
function iqLvl(c){return L(IQ_LV[c][0],IQ_LV[c][1]);}
function iqAreaTxt(q){const a=iqArea(q.a);return L(a[1],a[2]);}
function iqDurTxt(q){return iqLbl(IQ_DUR,q.d,LANG==='es'?2:1);}
function iqAgo(at){const m=Math.max(0,Math.round((Date.now()-at)/60000));return m<1?L('just now','ahora'):m<60?m+' min':Math.floor(m/60)+' h '+(m%60)+' min';}
function iqIndexRow(){const n=iqList.filter(e=>!e.seen).length;
  return '<div class="iq-row"><button class="ghost" onclick="iqScan()">📷 '+L('Scan patient QR','Escanear QR del paciente')+'</button>'+(iqList.length?'<button class="ghost" onclick="goRef(\'queue\')">📋 '+L('Triage list','Lista de triaje')+(n?' <b class="iq-n">'+n+'</b>':'')+'</button>':'')+'</div>';}
function iqFacts(q){const f=[iqDurTxt(q),q.s+'/10'];if(q.w)f.push(L('worse last 2–3 d','peor en 2–3 d'));if(q.r)f.push(L('seen before','ya lo vieron')+(q.rw?L(' — worse',' — peor'):''));if(q.j)f.push(L('stops duty/PT','impide trabajo/PT'));return f;}
function renderQueue(){
  const ord={red:0,orange:1,gray:2};
  const list=iqList.map(e=>Object.assign({tr:iqTriage(e.q)},e)).sort((a,b)=>(a.seen-b.seen)||(ord[a.tr.c]-ord[b.tr.c])||(a.at-b.at));
  let h='<h2 class="tpl">📋 '+L('Triage list','Lista de triaje')+'</h2>';
  h+='<div class="algo-actions" style="margin:0 0 12px"><button onclick="iqScan()">📷 '+L('Scan patient QR','Escanear QR del paciente')+'</button><button class="ghost" onclick="window.open(\'poster.html\',\'_blank\')">🖨 '+L('Clinic poster','Póster')+'</button>'+(iqList.length?'<button class="ghost" onclick="iqClear(this)">'+L('Clear list','Borrar lista')+'</button>':'')+'</div>';
  if(!list.length)return h+'<div class="iq-empty"><b>'+L('No patients yet','Todavía no hay pacientes')+'</b><span>'+L('Soldiers scan the clinic poster, answer ~1 minute of questions and show you their code. Tap “Scan patient QR” and point the camera at their phone.','Los soldados escanean el póster de la clínica, contestan ~1 minuto de preguntas y te enseñan su código. Toca “Escanear QR del paciente” y apunta la cámara a su teléfono.')+'</span></div>';
  const cnt=c=>list.filter(e=>!e.seen&&e.tr.c===c).length;
  h+='<div class="iq-sum"><span class="iq-d red"></span>'+cnt('red')+' '+iqLvl('red')+'<span class="iq-d orange"></span>'+cnt('orange')+' '+iqLvl('orange')+'<span class="iq-d gray"></span>'+cnt('gray')+' '+iqLvl('gray')+'</div>';
  list.forEach(e=>{const q=e.q,pid=iqArea(q.a)[3],pii=piiFind(q.n||'');
    h+='<div class="iq-card '+e.tr.c+(e.seen?' seen':'')+'"><div class="iq-top"><span class="iq-tag '+e.tr.c+'">'+iqLvl(e.tr.c)+'</span><b>'+(iqWho(q)?q$(iqWho(q))+' · ':'')+q$(iqAreaTxt(q))+'</b><span class="iq-ago">'+iqAgo(e.at)+'</span></div>'
     +'<div class="iq-why">'+q$(e.tr.why)+'</div><div class="iq-facts">'+iqFacts(q).map(q$).join(' · ')+'</div>'+iqFUHtml(q)
     +(q.n?'<div class="iq-note">“'+q$(q.n)+'”'+(pii.length?' <span class="pii-warn">⚠ '+L('may contain personal info','puede tener info personal')+'</span>':'')+'</div>':'')
     +'<div class="iq-act"><button onclick="iqStart('+e.id+')">'+(e.seen?L('Open again','Abrir otra vez'):L('Start','Empezar'))+' '+pid+' ›</button><button class="ghost" onclick="iqDel('+e.id+')">'+L('Remove','Quitar')+'</button></div></div>';});
  h+='<p class="note-hint foot">'+L('Suggested triage from the patient\'s own answers — you decide. The list holds only rank + last name (no DoD ID), stays on this device and deletes itself after 12 h — clear it when sick call ends.','Triaje sugerido con las respuestas del propio paciente — tú decides. La lista solo tiene rango + apellido (sin DoD ID), se queda en este equipo y se borra sola a las 12 h — bórrala al terminar sick call.')+'</p>';
  return h;
}
function iqFUHtml(q){const fu=iqFUAns(q);if(!fu.length)return'';return '<div class="iq-fu">'+fu.map(x=>'<span class="'+(x.lv?'lv-'+x.lv:'')+'">'+q$(x.k)+': <b>'+q$(x.v)+'</b></span>').join('')+'</div>';}
function iqDel(id){iqList=iqList.filter(e=>e.id!==id);iqSave();renderMain();}
function iqClear(b){if(b.dataset.arm!=='1'){b.dataset.arm='1';b.classList.add('danger');b.textContent=L('Tap again to clear','Toca otra vez para borrar');setTimeout(()=>{if(b.isConnected){b.dataset.arm='';b.classList.remove('danger');b.textContent=L('Clear list','Borrar lista');}},3000);return;}
  iqList=[];iqSave();renderMain();}
function iqStart(id){const e=iqList.find(x=>x.id===id);if(!e)return;const q=e.q,a=iqArea(q.a);
  e.seen=true;iqSave();
  adOpen(a[3]);
  if(iqWho(q)&&!(patient||'').trim()){patient=iqWho(q);const pi=document.getElementById('ptIn');if(pi)pi.value=patient;}
  const s=state[cur];
  if(!s.cc.size&&!(s.ccCustom||'').trim())s.ccCustom=a[1].toLowerCase();
  const _fu=iqFUAns(q).map(x=>x.en+': '+x.ven).join('; ');
  const _dt={'today':'today','1-3d':'1–3 days ago','4-7d':'4–7 days ago','1-4w':'1–4 weeks ago','1mo+':'more than 1 month ago'}[q.d]||q.d;
  if(s.fields&&s.fields.o&&!(s.custom.o||'').trim())s.custom.o=_dt+(_fu?'. Pt questionnaire — '+_fu:' (pt questionnaire)');
  if(s.sev===null||s.sev===undefined)s.sev=q.s;
  if(!s.duty)s.duty=q.j?'Yes':'No';
  if(q.r){ad.ret=true;ad.worse=!!(q.rw||q.w);}
  ad.iq={q,tr:iqTriage(q)};
  renderMain();renderNote();document.getElementById('main').scrollTop=0;}
function iqBanner(x){const q=x.q,f=q.f||[];
  let h='<div class="iq-ban '+x.tr.c+'"><b>📋 '+(iqWho(q)?q$(iqWho(q))+' · ':'')+L('Patient questionnaire','Cuestionario del paciente')+' · '+iqLvl(x.tr.c)+'</b><span>'+q$(iqFacts(q).join(' · '))+'</span>';
  if(f.length)h+='<span class="iq-rf">🚩 '+L('Patient reported: ','El paciente marcó: ')+q$(f.map(c=>iqLbl(IQ_FLAGS,c,LANG==='es'?2:1)).join(', '))+' — '+L('screen the red flags below now.','revisa las banderas rojas ahora.')+'</span>';
  h+=iqFUHtml(q);
  if(q.n)h+='<span>“'+q$(q.n)+'”</span>';
  return h+'<span class="iq-small">'+L('Onset, severity, duty impact and return visit were pre-filled — check them.','Inicio, severidad, impacto en el trabajo y regreso se prellenaron — revísalos.')+'</span></div>';}
let iqStream=null,iqRaf=0;
function iqLoadJs(src){return new Promise((ok,no)=>{const sc=document.createElement('script');sc.src=src;sc.onload=ok;sc.onerror=no;document.head.appendChild(sc);});}
async function iqScan(){
  sheetTog(false);iqStop();
  const o=document.createElement('div');o.id='scanOv';
  o.innerHTML='<div class="sc-top"><b>'+L('Scan patient QR','Escanear QR del paciente')+'</b><button class="xbtn" onclick="iqStop()" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="sc-box"><video id="scV" playsinline muted autoplay></video><div class="sc-frame"></div></div><div class="sc-msg" id="scM">'+L('Point the camera at the code on the Soldier\'s phone.','Apunta la cámara al código en el teléfono del soldado.')+'</div><label class="sc-photo">🖼 '+L('Choose a photo or screenshot','Elegir foto o captura')+'<input type="file" accept="image/*" onchange="iqPhoto(this)" hidden></label>';
  document.body.appendChild(o);
  const msg=t=>{const m=document.getElementById('scM');if(m)m.innerHTML=t;};
  try{if(!window.jsQR)await iqLoadJs('vendor/jsQR.min.js');}catch(e){msg(L('Could not load the scanner. Connect to the internet once and try again.','No se pudo cargar el escáner. Conéctate a internet una vez e intenta otra vez.'));return;}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){msg(L('This browser has no camera access. Tip: scan the code with the iPhone Camera app — it opens this app with the answers.','Este navegador no tiene acceso a la cámara. Tip: escanea el código con la app Cámara del iPhone — abre esta app con las respuestas.'));return;}
  try{iqStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});}
  catch(e){msg(L('Camera blocked or not available. Allow camera access for this site in Settings, or scan the code with the iPhone Camera app.','Cámara bloqueada o no disponible. Permite la cámara para este sitio en Ajustes, o escanea el código con la app Cámara del iPhone.'));return;}
  const v=document.getElementById('scV');if(!v){iqStop();return;}v.srcObject=iqStream;try{await v.play();}catch(e){}
  const c=document.createElement('canvas'),cx=c.getContext('2d',{willReadFrequently:true});let bad=0;
  const tick=()=>{if(!iqStream)return;
    if(v.readyState>=2&&v.videoWidth){const sc=Math.min(1,640/v.videoWidth);c.width=Math.round(v.videoWidth*sc);c.height=Math.round(v.videoHeight*sc);cx.drawImage(v,0,0,c.width,c.height);
      const r=jsQR(cx.getImageData(0,0,c.width,c.height).data,c.width,c.height,{inversionAttempts:'dontInvert'});
      if(r&&r.data){const q=iqDecode(r.data);if(q){try{navigator.vibrate&&navigator.vibrate(60);}catch(e){}iqStop();iqAdd(q);view='queue';renderNav();renderMain();document.getElementById('main').scrollTop=0;return;}
        if(Date.now()-bad>2500){bad=Date.now();msg(L('That code isn\'t a sick-call questionnaire.','Ese código no es un cuestionario de sick call.'));}}}
    iqRaf=requestAnimationFrame(tick);};
  tick();
}
async function iqPhoto(inp){const f=inp.files&&inp.files[0];if(!f)return;const msg=t=>{const m=document.getElementById('scM');if(m)m.innerHTML=t;};
  try{if(!window.jsQR)await iqLoadJs('vendor/jsQR.min.js');
    const url=URL.createObjectURL(f),im=new Image();im.src=url;await im.decode();
    let q=null;for(const mx of [1600,1000,2400]){const sc=Math.min(1,mx/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);const cx=c.getContext('2d');cx.drawImage(im,0,0,c.width,c.height);
      const r=jsQR(cx.getImageData(0,0,c.width,c.height).data,c.width,c.height);if(r&&r.data){q=iqDecode(r.data);if(q)break;}}
    URL.revokeObjectURL(url);
    if(q){iqStop();iqAdd(q);view='queue';renderNav();renderMain();document.getElementById('main').scrollTop=0;}
    else msg(L('No sick-call code found in that picture. Try a clearer screenshot.','No se encontró un código de sick call en esa imagen. Prueba con una captura más clara.'));
  }catch(e){msg(L('Could not read that picture.','No se pudo leer esa imagen.'));}
  inp.value='';}
function iqStop(){cancelAnimationFrame(iqRaf);if(iqStream){iqStream.getTracks().forEach(t=>t.stop());iqStream=null;}const o=document.getElementById('scanOv');if(o)o.remove();}
/* ===== How-to cards (data/howto.js) ===== */
function htKey(t){if(typeof HOWTO_MATCH==='undefined')return null;const m=HOWTO_MATCH.find(([rx])=>rx.test(t));return m?m[1]:null;}
function htBtn(t){const k=htKey(t);return k?'<span class="htb" role="button" aria-label="How to" title="How to do this" onclick="event.stopPropagation();htOpen(\''+k+'\')">ⓘ</span>':'';}
function htOpen(k){const c=HOWTO[k];if(!c)return;let o=document.getElementById('htOv');if(o)o.remove();o=document.createElement('div');o.id='htOv';
  o.innerHTML='<div class="ht-card" role="dialog" aria-label="'+q$(c.t)+'"><div class="ht-top"><b>'+q$(c.t)+'</b><button class="xbtn" onclick="htClose()" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
   +(c.rev?'':'<div class="ht-rev">'+L('Pending clinical review by the supervising provider','Pendiente de revisión clínica por el proveedor supervisor')+'</div>')
   +'<p class="ht-what">'+q$(c.what)+'</p><h4>'+L('How to do it','Cómo hacerlo')+'</h4><ol>'+c.how.map(x=>'<li>'+q$(x)+'</li>').join('')+'</ol>'
   +'<div class="ht-res"><div><b>'+L('Normal','Normal')+'</b><span>'+q$(c.normal)+'</span></div><div class="pos"><b>'+L('Positive / abnormal','Positivo / anormal')+'</b><span>'+q$(c.pos)+'</span></div></div>'
   +'<p class="ht-act"><b>'+L('What to do','Qué hacer')+':</b> '+q$(c.act)+'</p>'
   +'<p class="ht-unsure">'+L('Not sure how to do it? Mark it as not done and ask your NCO, AEM or provider — never guess.','¿No estás seguro? Márcalo como no hecho y pregunta a tu NCO, AEM o proveedor — nunca adivines.')+'</p>'
   +'<p class="ht-src">'+L('Source','Fuente')+': '+q$(c.src)+'</p></div>';
  o.onclick=e=>{if(e.target===o)htClose();};document.body.appendChild(o);}
function htClose(){const o=document.getElementById('htOv');if(o)o.remove();}
function adRfBlock(p){
  let h='';
  const rfs=rfList(p);
  if(rfs.length){
    const nPos=rfs.filter(f=>ad.rf[f]==='pos').length,nNeg=rfs.filter(f=>ad.rf[f]==='neg').length,allN=!nPos&&nNeg===rfs.length;
    const st=nPos?'<span class="rf-st pos">'+nPos+' PRESENT</span>':(allN?'<span class="rf-st neg">✓ All negative</span>':'<button class="rf-all" onclick="adRfAll()">All negative</button>');
    h+='<div class="rf-head">'+(foldOn()?'<span class="rf-hint">'+L('Switch on = present','Encendido = presente')+'</span>':'<h3>Red flags</h3>')+st+(Object.keys(ad.rf).length?'<span class="clr" onclick="adClrRf()" title="Clear this section">✕ clear</span>':'')+'</div>';
    h+='<div class="rf-list">';
    rfs.forEach(f=>{const v=ad.rf[f]||'';const k=encodeURIComponent(f).replace(/'/g,'%27');
      h+='<div class="rf-row '+v+'" role="switch" aria-checked="'+(v==='pos')+'" onclick="adRfSet(decodeURIComponent(\''+k+'\'))"><span class="rf-ic">!</span><span class="rf-lbl">'+q$(f)+htBtn(f)+(v===''?'<small>'+L('not screened','sin revisar')+'</small>':'')+'</span><span class="tgl'+(v==='pos'?' on':'')+'"></span></div>';});
    h+='</div>'+(foldOn()?'':'<div class="rf-help">'+L('Switch on = PRESENT (Provider Now). Mark the rest with “All negative”.','Encendido = PRESENTE (Provider Now). Marca el resto con “All negative”.')+'</div>');
  }
  return h;
}
function adScreenHtml(p,R,opts){
  let h='';
  if(p.id==='F-6')h+='<div class="note-hint"><span class="chip" onclick="goRef(\'mace\')">🧠 Open MACE 2 tool (scoring)</span></div>';
  if(p.note)h+='<div class="note-hint">'+scrLink(p.note)+'</div>';
  if(p.ddx&&p.ddx.length){if(foldOn()){const o=isFold('ddx');h+=foldRow('ddx',L('Differential','Diferencial'),p.ddx.length+' '+L('options','opciones'),o);if(o)h+='<div class="field fbody" style="font-size:.9em;color:var(--dim)">'+p.ddx.map(q$).join(' · ')+'</div>';}
    else h+='<details class="dd"><summary>Differential (ADTMC)</summary><div style="padding:6px 10px;font-size:.9em;color:var(--dim)">'+p.ddx.map(q$).join(' · ')+'</div></details>';}
  h+=adVBanner();
  if(!(opts&&opts.noRf))h+=adRfBlock(p);
  // flow
  let n=0;const last=R.cur!==-1?R.cur:R.end;
  for(let i=0;i<=last&&i<p.flow.length;i++){
    const st=p.flow[i];
    if(st.ex!==undefined){
      n++;h+='<div class="algoq exq"><div class="fname">Step '+n+' · action</div><div class="qtxt">'+q$(st.ex)+'</div>';
      if(st.out&&st.out.length){h+='<div class="chips">';st.out.forEach((o,k)=>h+='<span class="chip '+(ad.out['x'+i]===k?'on':'')+'" onclick="ad.out[\'x'+i+'\']='+k+';renderMain();renderNote()">'+q$(o.l)+(o.d?' → '+LV[o.d].s:'')+'</span>');h+='</div>';}
      h+='</div>';
      continue;
    }
    n++;
    const sel=ad.dp[i]||[],done=!!ad.dpDone[i],min=st.min||1,fired=done&&sel.length>=min;const sug=done?[]:adDPSug(st);
    h+='<div class="algoq dpq'+(done?(fired?' fired':' clear'):'')+'"><div class="fname">Decision point '+n+(min>1?' · YES to ≥'+min+' → next action':' · any = YES')+'</div>';
    if(st.yes&&st.yes.a)h+='<div class="dpact">'+scrLink(st.yes.a)+'</div>';
    h+='<div class="chips">';
    st.items.forEach((it,j)=>h+='<span class="chip '+(sel.includes(j)?'rfp':(sug.includes(j)?'sug':''))+'" onclick="adDPTog('+i+','+j+')">'+(sel.includes(j)?'YES · ':'')+q$(it)+htBtn(it)+'</span>');
    h+='</div><div class="algo-actions" style="margin-top:8px">'+(sug.length?'<button onclick="adDPUse('+i+')">✓ Use interview answers ('+sug.length+')</button>':'')+'<button class="ghost" onclick="adDPNone('+i+')">'+(st.none?'None':'None / next')+' ➜</button>'+(done?'<button class="ghost" onclick="adUndo('+i+')">↺ redo</button>':'')+'</div>';
    if(done&&!fired&&st.lo)h+='<div class="fuq">'+q$(st.lo)+'</div>';
    if(done&&fired){
      const y=st.yes||{};
      if(y.out){h+='<div class="fuq">Result:</div><div class="chips">';y.out.forEach((o,k)=>h+='<span class="chip '+(ad.out[i]===k?'on':'')+'" onclick="adOut('+i+','+k+')">'+q$(o.l)+(o.d?' → '+LV[o.d].s:' → continue')+'</span>');h+='</div>';}
      else if(y.d)h+='<div class="fuq">● Positive — see decision below.</div>';
      else if(y.tri)h+='<div class="fuq">▲ Screen another protocol: <div class="chips" style="margin-top:6px">'+y.tri.map(t=>scrChip(t,'x')).join('')+'</div></div>';
    }
    if(done&&!fired&&st.none&&sel.length===0)h+='<div class="fuq">● None — see decision below.</div>';
    h+='</div>';
  }
  const _fo=foldOn();
  if(_fo){const vs=[['bp','BP'],['hr','HR'],['temp','T'],['spo2','SpO2']].filter(([k])=>(gVitals[k]||'').trim()).map(([k,l])=>l+' '+gVitals[k].trim());
    if(ad.ret)vs.unshift(L('return visit','regreso'));
    const o=isFold('opt',ad.ret);h+=foldRow('opt',L('Vitals · LMP · return visit','Vitales · FUM · regreso'),vs.length?q$(vs.join(' · ')):L('optional','opcional'),o,ad.ret);
    if(!o)return h;h+='<div class="field fbody">'+adPatientInner()+adVitalsInputs();}
  else h+='<details class="dd" ontoggle="dd(\'adopt\',this.open)" '+((openDD.has('adopt')||ad.ret)?'open':'')+'><summary>Optional: vitals (if taken), LMP, return for same complaint'+(ad.ret?' <b class="cnt">return</b>':'')+'</summary><div style="padding:8px 10px">'+adPatientInner()+adVitalsInputs();
  h+='<div class="field"><div class="lab"><span class="tag s2">↩</span><span class="name">Returning for the same complaint?</span><span class="ask">M-1: never re-screened below AEM</span></div><div class="chips"><span class="chip '+(ad.ret?'on':'')+'" onclick="ad.ret=!ad.ret;if(!ad.ret)ad.worse=false;renderMain();renderNote()">Return for same complaint (already treated)</span>'+(ad.ret?'<span class="chip '+(ad.worse?'on':'')+'" onclick="ad.worse=!ad.worse;renderMain();renderNote()">Worsening / already seen by provider or AEM → clinic</span>':'')+'</div></div>';
  h+=_fo?'</div>':'</div></details>';
  return h;
}
function adDecisionHtml(p,R){
  let h=adResultCard(p,R);
  if(R.final==='MCP'){
    const it=adPlanItems(p);
    h+='<div class="field"><div class="lab"><span class="tag">📋</span><span class="name">Plan — suggested from your answers</span><span class="ask">green = on the note · tap to add/remove</span><span class="clr" onclick="adClrPlan()" title="Back to suggested plan">↺ reset</span></div>';
    const chip=(x,txt)=>'<span class="chip '+(x.on?'on':'')+'" onclick="adPlTog(\''+x.key+'\')">'+(x.on?'✓ ':'')+q$(txt)+'</span>';
    if(it.meds.length){h+='<div class="fuq">Meds (ADTMC App. C)</div><div class="chips">'+it.meds.map(x=>chip(x,adMedLine(x))).join('')+'</div>';
      it.meds.filter(x=>x.on||x.sf.w.length).forEach(x=>{x.sf.w.forEach(w=>{h+='<div class="mw">⚠️ '+q$(x.t)+': '+q$(w)+'</div>';});if(x.on&&x.m&&x.m.max)h+='<div class="mi">'+q$(x.m.n.replace(/\s+\d.*$/,''))+' max '+q$(x.m.max)+(x.m.rx?' · Rx — notify provider first':'')+'</div>';});}
    if(it.adv.length)h+='<div class="fuq">Advice</div><div class="chips">'+it.adv.map(x=>chip(x,x.t)).join('')+'</div>';
    if(it.act.length){h+='<div class="fuq">Activity</div><div class="chips">'+it.act.map(x=>chip(x,x.t)).join('')+'</div>';
      if(it.act.some(x=>x.on)){h+='<div class="fuq">For how long? <span class="dim">(ADTMC gives no duration for most — pick the time you recommend)</span></div><div class="chips">'+DUR_OPTS.map(o=>'<span class="chip '+(it.dur.sel===o?'on':'')+'" onclick="adDurSet(\''+o+'\')">'+(it.dur.sel===o?'✓ ':'')+o+(o===it.dur.sug?' <span class="dim">· '+it.dur.src+'</span>':'')+'</span>').join('')+'</div>';}}
    if(it.rtc.t)h+='<div class="fuq">Return precaution</div><div class="chips">'+chip(it.rtc,it.rtc.t)+'</div>';
    h+='</div>';
    const t=TPLS.find(x=>x.id===cur),s=state[cur];
    h+='<div class="field"><div class="lab"><span class="tag">🪖</span><span class="name">Duty status / profile</span><span class="ask">recommendation — pending CoC/provider</span>'+clrBtn(cur,'__dispo')+'</div><div class="chips">';
    Object.keys(t.dispo).forEach(k=>{h+='<span class="chip '+(s.dispo===k?'on':'')+'" onclick="setDispo(\''+cur+'\',\''+k+'\')">'+k+'</span>';});
    h+='</div><input type="text" placeholder="duty status text (editable)..." value="'+q$(s.dispoTxt)+'" oninput="dispoTxt(\''+cur+'\',this.value)"></div>';
  }
  const _po=isFold('prov');h+=foldRow('prov',L('Notified at clinic','Avisado en la clínica'),ad.prov&&ad.prov.trim()?q$(ad.prov.trim()):L('optional','opcional'),_po);
  if(_po)h+='<div class="field'+(foldOn()?' fbody':'')+'"><div class="lab"><span class="tag s2">☎</span><span class="name">Notified at clinic (optional)</span></div><input type="text" style="margin-top:0" value="'+q$(ad.prov)+'" placeholder="Rank Last name, if you contacted them" oninput="ad.prov=this.value;renderNote()"></div>';
  h+='<div class="algo-actions"><button onclick="adCommit()">✓ Done — add to note, next complaint</button><button class="ghost" onclick="gOpenNote()">View note</button><button class="ghost" onclick="adBack()">Cancel</button></div>';
  return h;
}
function adResultCard(p,R){
  if(!R.final&&!R.tri.length)return R.cur===-1?'<div class="resbox lv-wait"><div class="resh">End of flow: this protocol does not assign a category by itself</div><div class="resn">Follow the actions listed above, consult the provider/AEM and document. The global rules (vitals, red flags, pain) still apply.</div></div>':'<div class="resbox lv-wait"><div class="resh">Answer the decision points to get the disposition</div></div>';
  let h='';
  if(R.final){
    const lv=LV[R.final];
    const lf=R.final==='AEM'?(settings.aemOn?'AEM NOW — see '+(aemWho()?q$(aemWho()):'your AEM')+' (ADTMC II)':'REFER TO CLINIC — AEM Now (ADTMC II) · no AEM in your unit'):lv.f;
    h+='<div class="resbox lv-'+lv.c+'"><div class="resk">DISPOSITION</div><div class="resh">'+lf+'</div>';
    if(R.final==='MCP')h+='<div class="resn">Minor-care protocol '+p.id+' — follow the treatment below.</div>';
    const rs=[...R.esc];if(R.level)rs.push({lv:R.level,why:'Protocol endpoint '+p.id});
    rs.filter(e=>e.lv===R.final).forEach(e=>h+='<div class="resw">• '+q$(e.why)+'</div>');
    if(R.final==='AEM'&&settings.aemOn)h+='<div class="resn">Notify your AEM'+(aemWho()?' ('+q$(aemWho())+')':'')+'. The AEM must physically evaluate the Soldier, confirm your data and direct the plan (ADTMC p. 225). If the AEM is not available → supervising privileged provider (clinic).</div>';
    else if(R.final==='AEM')h+='<div class="resn">No AEM available in your unit (Settings) → per ADTMC Category II the Soldier is seen by the supervising privileged provider. Document OPQRST/AMPLE and send the patient to the clinic.</div>';
    if(R.final==='PN')h+='<div class="resn">Document OPQRST/AMPLE so the clinic has the full picture, and send the patient. Equipment, meds and a provider are there.</div>';
    if(R.forced&&R.level&&R.level!=='PN')h+='<div class="resn">Note: the protocol alone would give '+LV[R.level].s+'; the global rules raise it.</div>';
    h+='</div>';
  }
  if(R.tri.length)h+='<div class="resbox lv-tri"><div class="resk">▲ SCREEN ANOTHER PROTOCOL</div><div class="resn">'+L('Tap one: this protocol is saved in the note and the next one opens.','Toca uno: este protocolo se guarda en la nota y se abre el siguiente.')+'</div><div class="chips" style="margin-top:8px">'+R.tri.map(t=>scrChip(t,'on')).join('')+'</div></div>';
  R.warn.forEach(w=>h+='<div class="warn" style="margin-top:8px">'+q$(w)+'</div>');
  return h;
}
/* "Screen X": finish the current protocol (kept in the note) and open the next one */
function adScreen(id){
  if(!getP(id))return;
  if(ad.pid===id)return;
  if(ad.pid){const p=getP(ad.pid),Rr=adEval(p);if(Rr.final||Rr.tri.length||Object.keys(ad.dpDone).length||Object.keys(ad.rf).length){ad.log.push(adEntry(p,Rr));}}
  (ad.linked||(ad.linked=[])).push(id);
  adOpen(id);
  const t=document.getElementById('toast')||Object.assign(document.createElement('div'),{id:'toast'});if(!t.parentNode)document.body.appendChild(t);
  t.textContent=L('Previous protocol saved in the note — now screening ','Protocolo anterior guardado en la nota — ahora: ')+id;t.className='on';clearTimeout(t._h);t._h=setTimeout(()=>t.className='',2600);
}
function scrChip(t,cls){if(!/^[A-Z]-\d+$/.test(t))return q$(t);const done=ad.log.some(x=>x.id===t),P=getP(t);return '<span class="chip '+(cls||'x')+(done?' done':'')+'" onclick="adScreen(\''+t+'\')">'+(done?'✓ ':'▸ ')+t+(P?' '+q$(P.title):'')+'</span>';}
function scrLink(txt){return q$(txt).replace(/\b([A-M]-\d{1,2})\b/g,(m,id)=>getP(id)&&id!==ad.pid?'<span class="scr-link" onclick="adScreen(\''+id+'\')">'+id+' ›</span>':m);}
function adCommit(){
  const p=getP(ad.pid),R=adEval(p);
  ad.log.push(adEntry(p,R));guided=null;
  adResetProto();view='adtmc';renderNav();renderMain();renderNote();
}
function adProtoLines(p,R){
  const L=[];let n=0;const v=adVitals();
  const anyV=Object.values(gVitals).some(x=>String(x).trim());
  L.push(++n+'. Vitals: '+(!anyV?'not taken (field screening)':(v.abn.length?'ABNORMAL — '+v.abn.join('; ')+(ad.vovr?' (provider reviewed, cleared to continue)':''):'within ADTMC limits'))+'.');
  const rfs=rfList(p),neg=rfs.filter(f=>ad.rf[f]==='neg'),pos=rfs.filter(f=>ad.rf[f]==='pos');
  if(!pos.length&&neg.length&&neg.length===rfs.length)L.push(++n+'. No red flags.');
  else if(pos.length||neg.length)L.push(++n+'. Red flags: '+(pos.length?'PRESENT — '+pos.join('; ')+'. ':'')+(neg.length?'Denies '+neg.join(', ')+'.':''));
  if(ad.ret)L.push(++n+'. Return visit for same complaint'+(ad.worse?' — worsening / previously seen by provider or AEM.':' — not screened below AEM.'));
  for(let i=0;i<p.flow.length;i++){
    const st=p.flow[i];
    if(st.ex!==undefined){const o=ad.out['x'+i];L.push(++n+'. '+st.ex+(o!==undefined&&st.out[o]?' Result: '+st.out[o].l+'.':''));continue;}
    if(!ad.dpDone[i])break;
    const sel=ad.dp[i]||[];
    const ps=st.items.filter((x,j)=>sel.includes(j)),ng=st.items.filter((x,j)=>!sel.includes(j));
    let s=++n+'. '+(ps.length?'Positive: '+ps.join(', ')+'. ':'')+(ng.length?'Negative: '+ng.join(', ')+'.':'');
    if(st.yes&&st.yes.a&&sel.length>=(st.min||1))s+=' Action: '+st.yes.a+'.';
    if(st.yes&&st.yes.out&&ad.out[i]!==undefined)s+=' Result: '+st.yes.out[ad.out[i]].l+'.';
    L.push(s);
  }
  if(R.tri.length)L.push(++n+'. Screen another protocol: '+R.tri.join(', ')+'.');
  return L;
}
function adNoteParts(){
  const out={assess:[],plan:[],dispo:'',rfpos:[]};
  const entries=noteEntries();
  if(!entries.length)return out;
  const ld=lmpDays();
  if(gFlags.female){out.assess.push('LMP: '+(gFlags.lmp?(new Date(gFlags.lmp+'T00:00:00').toDateString().slice(4)+' ('+ld+' d ago)'):'not documented')+(gFlags.preg?' — possible pregnancy':'')+(gFlags.lact?' — lactating':'')+'.');}
  if(gFlags.mrc.trim())out.assess.push('MRC: '+gFlags.mrc.trim()+'.');
  if(gFlags.aviation)out.assess.push('Flight/dive status.');
  entries.forEach(e=>{
    out.assess.push(e.sum);
    (e.pos||[]).forEach(x=>{if(!out.rfpos.includes(x))out.rfpos.push(x);});
    (e.plan||[]).forEach(x=>out.plan.push(x));
  });
  const hi=adHighest();
  const D={PN:'Sent to clinic — needs a provider now.',AEM:settings.aemOn?'Referred to AEM'+(aemWho()?' ('+aemWho()+')':'')+' — evaluation today.':'Sent to clinic — no AEM available; supervising provider evaluation today.',MCP:'Minor care here.',SP:'Specialty referral requested.',APPT:'Appointment/referral requested at clinic.'};
  if(hi&&hi!=='MCP')out.dispo=D[hi]||LV[hi].s;
  if(ad.prov.trim())out.assess.push('Clinic notified: '+ad.prov.trim()+'.');
  return out;
}
function adEntry(p,R){
  const rfs=rfList(p),neg=rfs.filter(f=>ad.rf[f]==='neg'),pos=rfs.filter(f=>ad.rf[f]==='pos');
  const bits=[];
  const anyV=Object.values(gVitals).some(x=>String(x).trim());const v=adVitals();
  if(anyV&&v.abn.length)bits.push('Abnormal vitals: '+v.abn.join('; ')+'.');
  if(pos.length)bits.push('RED FLAG present: '+pos.join('; ')+'.');
  else if(neg.length)bits.push(neg.length===rfs.length?'No red flags.':'Denies '+neg.join(', ')+'.');
  const pf=[];
  for(let i=0;i<p.flow.length;i++){
    const st=p.flow[i];
    if(st.ex!==undefined){const o=ad.out['x'+i];if(o!==undefined&&st.out&&st.out[o])bits.push('Test result: '+st.out[o].l+'.');continue;}
    if(!ad.dpDone[i])break;
    const sel=ad.dp[i]||[];st.items.forEach((x,j)=>{if(sel.includes(j))pf.push(x);});
    if(st.yes&&st.yes.out&&ad.out[i]!==undefined&&sel.length>=(st.min||1))bits.push('Result: '+st.yes.out[ad.out[i]].l+'.');
  }
  if(pf.length)bits.push('Positive: '+pf.join(', ')+'.');
  if(ad.ret)bits.push(ad.worse?'Return visit — worse / already seen by provider or AEM.':'Return visit for the same complaint.');
  const _tg=adTagLines(p);
  return{id:p.id,title:p.title,level:R.final||null,pos,hpi:_tg.hpi,pe:_tg.pe,lines:adProtoLines(p,R),sum:p.title+' ('+p.id+')'+(bits.length||R.final?': ':'')+bits.join(' ')+(R.final?' → '+({PN:'Provider now.',AEM:'AEM today.',MCP:'Minor care.',SP:'Specialty referral.',APPT:'Appointment/referral.'}[R.final]||LV[R.final].s):''),plan:R.final==='MCP'?adPlanLines(adPlanItems(p)):[]};
}
/* ---- suggestions inside the classic templates ---- */
const CCMAP={
 msk:{'back pain':['B-1'],'neck pain':['B-2'],'shoulder pain':['B-3'],'elbow pain':['B-4'],'wrist pain':['B-5'],'hand pain':['B-6'],'hip pain':['B-7'],'groin pain':['E-2','B-7'],'knee pain':['B-8'],'shin splints':['B-11'],'ankle pain':['B-9'],'foot pain':['B-10'],'heel pain':['B-10'],'muscle soreness':['B-11'],'numbness/tingling':['F-3']},
 ha:{'*':['F-2'],'post-concussion HA':['F-6','F-2']},
 ill:{'sore throat':['A-1'],'cough':['A-3'],'congestion':['A-3'],'runny nose':['A-3'],'fever':['G-2'],'chills':['G-2'],'body aches':['G-2'],'fatigue':['G-1'],'dizziness':['F-1'],'nausea':['C-1'],'vomiting':['C-1'],'diarrhea':['C-2'],'constipation':['C-5'],'bloating':['C-3'],'heartburn':['C-7'],'abd pain':['C-3'],'loss of appetite':['G-1'],'night sweats':['G-2'],'swollen glands':['L-7']},
 bh:{'*':['F-5']},
 skin:{'rash':['J-1'],'itching':['J-13'],'hives':['J-13'],'redness':['J-1'],'swelling':['J-1'],'insect bite':['K-7'],'blister':['J-15'],'athletes foot':['J-6'],'jock itch':['J-7'],'razor bumps (PFB)':['J-3'],'ingrown nail':['J-18'],'sunburn':['J-14'],'dry skin':['K-4'],'acne flare':['J-2'],'wart':['J-17'],'irritation':['J-13'],'burning sensation':['J-14']},
 gyn:{'lower abd pain':['C-3','I-3'],'cramps':['I-3'],'irregular menses':['I-3'],'missed period':['I-2'],'heavy bleeding':['I-3'],'spotting':['I-3'],'vaginal discharge':['I-4'],'yeast-like sx':['I-4'],'UTI-like sx':['E-1'],'blood in urine':['E-1'],'post IUD/implant removal':['I-6'],'IUD/implant problems':['I-6'],'birth control side effects':['I-6'],'pelvic pressure':['I-3'],'breast pain':['I-1'],'possible pregnancy':['I-2']},
 ent:{'ear pain':['A-2'],'ear wax / blocked ear':['A-2'],'ringing (tinnitus)':['A-4'],'sore throat':['A-1'],'congestion':['A-3'],'sinus pain':['A-3'],'nosebleed':['A-5'],'toothache':['L-2'],'gum swelling':['L-2'],'jaw pain (TMJ)':['L-2'],'canker sore':['L-3'],'eye irritation':['H-1'],'conjunctivitis':['H-1'],'stye':['H-2'],'blurred vision':['H-3']},
 fu:{'*':['M-1','M-2']}
};
function adSuggest(tid,s){
  const map=CCMAP[tid];if(!map)return[];const out=[];
  [...s.cc].forEach(cc=>{(map[cc]||map['*']||[]).forEach(id=>{if(!out.includes(id))out.push(id);});});
  return out;
}
function adSuggestHtml(t,s){
  const ids=adSuggest(t.id,s);if(!ids.length)return'';
  let h='<div class="sugbox"><div class="sughead">🧭 ADTMC protocol for this CC (the code goes in the note)</div><div class="chips">';
  ids.forEach(id=>{const p=getP(id);if(p)h+='<span class="chip on" onclick="adOpen(\''+id+'\')">'+id+' · '+q$(p.title)+'</span>';});
  return h+'</div><div class="fuq">Abnormal vitals (if taken), red flags or pain ≥7 → Provider Now. The ADTMC screening decides the category; the chips below document the interview.</div></div>';
}
/* ---- ADTMC meds reference: one search bar -> info + daily-max check ---- */
let medQ='';
const dcUsed={}; // doses already taken today, per med (memory only)
function L(en,es){return LANG==='es'?es:en;}
/* Medication refill request: fill-and-copy only. Name / DoD ID / DOB are kept in memory, never stored. */
let rfq={n:'',id:'',dob:'',med:''};
function rfqDob(){const m=(rfq.dob||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return rfq.dob||'';return m[3]+' '+['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][+m[2]-1]+' '+m[1];}
function rfqText(){return ['MEDICATION REFILL REQUEST','Full name: '+(rfq.n.trim()||'________'),'DoD ID: '+(rfq.id.trim()||'________'),'Date of birth: '+(rfqDob()||'________'),'Medication: '+(rfq.med.trim()||'________')].join('\n');}
function rfqUp(k,v){rfq[k]=v;const p=document.getElementById('rfqPrev');if(p)p.textContent=rfqText();}
function rfqCopy(b){copyTxt(rfqText(),b);}
function rfqClear(){rfq={n:'',id:'',dob:'',med:''};renderMain();}
function rfqHtml(){
  const f=(lab,k,type,extra)=>'<label style="display:block;margin-top:6px;font-size:.85em">'+lab+'<input type="'+type+'" value="'+q$(rfq[k])+'" data-pii-ok="1" oninput="rfqUp(\''+k+'\',this.value)" autocomplete="off" '+(extra||'')+' style="margin-top:2px"></label>';
  return '<details class="dd" '+(openDD.has('rfq')?'open':'')+' ontoggle="dd(\'rfq\',this.open)"><summary>'+L('📝 Medication refill request (fill and copy)','📝 Solicitud de resurtido de medicamento (llenar y copiar)')+'</summary><div class="field">'
   +'<div class="fuq">'+L('Name, DoD ID and date of birth are NOT saved — they stay on this screen only until you clear or leave it.','Nombre, DoD ID y fecha de nacimiento NO se guardan — solo están en esta pantalla hasta que la limpies o salgas.')+'</div>'
   +f(L('Full name','Nombre completo'),'n','text','')+f('DoD ID','id','text','inputmode="numeric"')+f(L('Date of birth','Fecha de nacimiento'),'dob','date','')
   +f(L('Medication name','Nombre del medicamento'),'med','text','list="rfqMeds"')
   +'<datalist id="rfqMeds">'+ADMEDS.map(m=>'<option value="'+q$(m.n)+'">').join('')+'</datalist>'
   +'<pre id="rfqPrev" style="white-space:pre-wrap;margin:8px 0 0;font-size:.85em">'+q$(rfqText())+'</pre>'
   +'<div class="algo-actions"><button onclick="rfqCopy(this)">'+L('Copy','Copiar')+'</button><button class="ghost" onclick="rfqClear()">'+L('↺ Clear','↺ Limpiar')+'</button></div></div></details>';
}
function renderADMeds(){
  let h='<h2 class="tpl">💊 ADTMC Meds — Appendix C</h2><p class="tpl-sub">Type a medication, brand or protocol: dose, contraindications, pregnancy, lactation and a daily-max check. <span class="rxb">Rx</span> = requires a privileged-provider prescription.</p>';
  h+=rfqHtml();
  h+='<div class="field"><input type="text" id="medSearch" style="margin-top:0;font-size:1.05em" placeholder="Search medication, brand or protocol (e.g. ibuprofen, Motrin, K-6)…" value="'+q$(medQ)+'" oninput="medQ=this.value;document.getElementById(\'medlist\').innerHTML=adMedItems()" autocomplete="off"></div><div id="medlist">'+adMedItems()+'</div>';
  return h;
}
function dcHtml(m){
  const c=DCALC[m.k];
  if(!c)return '<div class="dim" style="font-size:.82em;margin-top:6px">'+L('No numeric daily maximum in the ADTMC for this medication — follow the dose above.','El ADTMC no da un máximo diario numérico para este medicamento — sigue la dosis indicada arriba.')+'</div>';
  const v=dcUsed[m.k]||0;
  return '<div class="dcbox"><div class="mini"><span>'+L('Daily max check','Verificación del máximo diario')+'</span> — <b>'+q$(c.i)+'</b> <span>'+L('already given today','ya administrada(s) hoy')+'</span></div><div class="dcrow"><button onclick="dcStep(\''+m.k+'\',-1)">−</button><input type="text" inputmode="numeric" id="dc_'+m.k+'" value="'+v+'" oninput="dcSet(\''+m.k+'\',this.value)"><button onclick="dcStep(\''+m.k+'\',1)">+</button></div><div id="dco_'+m.k+'">'+dcOut(m.k)+'</div></div>';
}
function dcSet(k,val){dcUsed[k]=Math.max(0,parseInt(val,10)||0);const o=document.getElementById('dco_'+k);if(o)o.innerHTML=dcOut(k);}
function dcStep(k,d){dcSet(k,(dcUsed[k]||0)+d);const i=document.getElementById('dc_'+k);if(i)i.value=dcUsed[k];}
function dcOut(k){
  const c=DCALC[k],n=dcUsed[k]||0,tot=n*c.q,left=c.max-tot,more=Math.floor(left/c.q);
  let msg;
  const u=L(c.u,{mg:'mg',tbsp:'cda',doses:'dosis'}[c.u]||c.u);
  if(left<0)msg=L('EXCEEDS the ADTMC max by '+(-left)+' '+c.u+' — do NOT give more','EXCEDE el máximo del ADTMC por '+(-left)+' '+u+' — NO dar más');
  else if(more<1)msg=L('at the ADTMC max — no room for another dose','en el máximo del ADTMC — no hay margen para otra dosis');
  else msg=L('room for '+more+' more ('+c.q+' '+c.u+' each'+(c.hrs?', q'+c.hrs+'h interval':'')+')','margen para '+more+' más ('+c.q+' '+u+' c/u'+(c.hrs?', intervalo q'+c.hrs+'h':'')+')');
  return '<div class="'+(left<0||more<1?'rfbanner':'note-hint')+'" style="margin:6px 0 0">'+L('Total today: ','Total hoy: ')+'<b>'+tot+' '+u+'</b> · '+L('ADTMC max ','Máx. ADTMC ')+c.max+' '+u+'/24 h · '+msg+'</div>'+(c.n?'<div class="dim" style="font-size:.8em;margin-top:4px">'+q$(c.n)+'</div>':'');
}
function adMedItems(){
  const q=medQ.trim().toLowerCase();
  const list=ADMEDS.filter(m=>!q||(m.n+' '+m.t+' '+m.alg+' '+m.k).toLowerCase().includes(q));
  if(!list.length)return '<div class="dim" style="padding:10px">'+L('No medication matches','Ningún medicamento coincide con')+' "'+q$(medQ)+'".</div>';
  return list.map(m=>{
    const s=medSafety(m);
    return '<div class="medcard'+(s.w.length?' bad':'')+'"><div class="mh"><b>'+q$(m.n)+'</b> <span class="dim">'+q$(m.t)+'</span>'+(m.rx?' <span class="rxb">Rx</span>':'')+'<span class="ppg dim">p.'+m.pg+'</span></div><div>'+q$(m.dose)+(m.max?' · <b>max '+q$(m.max)+'</b>':'')+'</div><div class="dim" style="font-size:.85em">Protocols: '+q$(m.alg)+'</div><details class="dd"><summary>Contraindications / pregnancy</summary><div style="padding:6px 10px 10px;font-size:.88em;line-height:1.6">'+m.ci.map(c=>'• '+q$(c)).join('<br>')+'<br><b>Pregnancy:</b> '+q$(m.preg)+' · <b>Lactation:</b> '+q$(m.lac)+(m.note?'<br><b>⚠️</b> '+q$(m.note):'')+'</div></details>'+dcHtml(m)+s.w.map(x=>'<div class="mw">⚠️ '+q$(x)+'</div>').join('')+'</div>';
  }).join('');
}

/* =========================================================
   PRIVACY / SETTINGS / EXPORT / FOLLOW-UP
========================================================= */
const settings=(function(){let s={purge:true,pin:'',theme:'green',mode:'dark',noteFmt:'compact',aemOn:false,aemName:''};try{Object.assign(s,JSON.parse(localStorage.getItem('sc_settings')||'{}'));}catch(e){}return s;})();
function aemWho(){return settings.aemName&&settings.aemName.trim()?settings.aemName.trim():'';}
function togAem(){settings.aemOn=!settings.aemOn;saveSettings();renderMain();renderNote();}
function setAemName(v){settings.aemName=v.slice(0,60);saveSettings();renderNote();}
function saveSettings(){try{localStorage.setItem('sc_settings',JSON.stringify(settings));}catch(e){}}
const THEMES=[['green','Orange'],['blue','Blue'],['amber','Green'],['red','Red'],['purple','Purple'],['gray','Gray']];
const THEME_BG={dark:{green:'#000000',blue:'#000000',amber:'#000000',red:'#000000',purple:'#000000',gray:'#000000'},light:'#F2F2F7'};
function applyTheme(){
  const r=document.documentElement;
  const t=THEMES.some(x=>x[0]===settings.theme)?settings.theme:'green';
  const m=settings.mode==='light'?'light':'dark';
  if(t==='green')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t);
  if(m==='light')r.setAttribute('data-mode','light');else r.removeAttribute('data-mode');
  const mt=document.querySelector('meta[name="theme-color"]');
  if(mt)mt.setAttribute('content',m==='light'?THEME_BG.light:THEME_BG.dark[t]);
}
function setTheme(t){settings.theme=t;saveSettings();applyTheme();renderMain();}
function setMode(m){settings.mode=m;saveSettings();applyTheme();renderMain();}
function purgeOld(){
  if(!settings.purge)return;
  try{const today=new Date().toDateString();
    const arr=getSaved().filter(n=>new Date(n.t).toDateString()===today);
    if(arr.length!==getSaved().length)setSaved(arr);}catch(e){}
}
async function hashPin(p){
  try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('sc|'+p));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');}
  catch(e){let h=5381;for(const c of 'sc|'+p)h=((h<<5)+h+c.charCodeAt(0))|0;return 'x'+h;}
}
async function setPin(){
  const v=(document.getElementById('pinNew')||{}).value||'';
  if(!/^\d{4,8}$/.test(v)){alert('PIN: 4 to 8 digits.');return;}
  settings.pin=await hashPin(v);saveSettings();renderMain();
}
function clearPin(){settings.pin='';saveSettings();renderMain();}
async function tryUnlock(){
  const v=document.getElementById('pinIn').value;
  if(await hashPin(v)===settings.pin){document.getElementById('lock').style.display='none';document.getElementById('pinIn').value='';}
  else{document.getElementById('pinMsg').textContent='Wrong PIN';}
}
function lockNow(){if(settings.pin){document.getElementById('lock').style.display='flex';}}
function showLockIfNeeded(){if(settings.pin)document.getElementById('lock').style.display='flex';}
const APP_VER='v16';
function updateApp(b){
  if(b){b.disabled=true;b.textContent=L('Updating…','Actualizando…');}
  const go=()=>{location.href=location.pathname+'?u='+Date.now();};
  const ps=[];
  try{if('serviceWorker' in navigator)ps.push(navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))));}catch(e){}
  try{if(window.caches)ps.push(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))));}catch(e){}
  Promise.all(ps).then(go,go);
}
function wipeAll(){
  if(!confirm('Delete EVERYTHING on this device (saved notes, current note, protocols, settings)?'))return;
  try{['sc_state','sc_saved','sc_ad','sc_settings','sc_fs'].forEach(k=>localStorage.removeItem(k));}catch(e){}
  TPLS.forEach(t=>resetState(t.id));resetVitals();adResetAll();patient='';
  settings.pin='';settings.purge=true;
  const pi=document.getElementById('ptIn');if(pi)pi.value='';
  renderNav();renderMain();renderNote();
}
function togPurge(){settings.purge=!settings.purge;saveSettings();renderMain();}
/* ADTMC Appendices E, F, G — condensed read-only reference (MEDCOM Pam 40-7-21). Paraphrased summaries; the pamphlet is authoritative. */
function appxRef(){
  const ul=a=>'<ul style="margin:4px 0 8px 18px;padding:0;line-height:1.6">'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
  const sec=(k,t,body)=>'<details class="dd" '+(openDD.has(k)?'open':'')+' ontoggle="dd(\''+k+'\',this.open)"><summary>'+t+'</summary><div style="font-size:.88em;color:var(--dim);padding:4px 2px">'+body+'</div></details>';
  const E=ul([
    L('Documentation in MHS EHR (TSWF Core Form) or DA Form 5181 if the EHR is unavailable; upload as soon as feasible.','Documentación en MHS EHR (TSWF Core Form) o DA Form 5181 si no hay acceso al EHR; subirla cuanto antes.'),
    L('Peer feedback monthly (if ≥10 work days in the MTF or ≥20 Soldiers screened): review 10 encounters — vitals and abnormalities, CC/HPI/meds/allergies/LMP, algorithm with key positives and negatives, disposition (meds, limitations, education), consent and final timeout if applicable.','Retroalimentación entre pares mensual (si ≥10 días laborales en el MTF o ≥20 Soldados): revisar 10 encuentros — vitales y anormalidades, CC/HPI/meds/alergias/LMP, algoritmo con positivos y negativos clave, disposición (meds, limitaciones, educación), consentimiento y final timeout si aplica.'),
    L('Unsafe acts seen in direct observation are stopped immediately; the supervising NCO is notified, then the supervising privileged provider.','Los actos inseguros observados directamente se detienen de inmediato; se notifica al NCO supervisor y luego al proveedor privilegiado supervisor.'),
    L('Supervising NCO reviews the consolidated data monthly; feedback weekly during orientation, then monthly.','El NCO supervisor revisa los datos consolidados cada mes; retroalimentación semanal en la orientación y luego mensual.'),
    L('Supervising privileged provider reviews and co-signs all ADTMC notes daily when feasible (otherwise verbal presentation daily, co-sign later), reviews orders the medic adds, and adds lab/x-ray results.','El proveedor privilegiado supervisor revisa y cofirma todas las notas ADTMC a diario cuando es factible (si no, presentación verbal diaria y cofirma después), revisa las órdenes que agrega el médico y agrega resultados de labs/rayos X.'),
    L('Problems: remediation plan on an MFR; events reportable in JPSR (near-miss, no-harm, harm) are filed separately from any review of the medic’s performance.','Problemas: plan de remediación en un MFR; los eventos reportables en JPSR (casi-error, sin daño, con daño) se reportan aparte de cualquier revisión del desempeño del médico.'),
    L('Authority can be suspended or revoked by the supervising provider / medical director; MFR removed from CAF and JCCQAS. Reinstatement: repeat or condensed orientation, more peer reviews, or closer supervision (overseen by the provider, not delegable to the NCO).','La autoridad puede ser suspendida o revocada por el proveedor supervisor / director médico; el MFR se retira del CAF y JCCQAS. Reinstalación: orientación completa o condensada, más revisiones por pares o mayor supervisión (a cargo del proveedor, no delegable al NCO).')
  ]);
  const F=ul([
    L('Virtual health meets the same standard of care as face-to-face. Patient must be consented (written consent on DA Form 4700 per AR 40-68, loaded into the EHR within 48 h).','La salud virtual debe cumplir el mismo estándar de atención que la presencial. El paciente debe dar consentimiento (por escrito en DA Form 4700 según AR 40-68, cargado al EHR en 48 h).'),
    L('The originating-site medic (patient presenter) must be present for the whole visit. Agree on emergency back-up at the start: exchange phone numbers and the patient’s physical address.','El médico del sitio de origen (presentador) debe estar presente toda la visita. Acordar al inicio el respaldo de emergencia: intercambiar teléfonos y la dirección física del paciente.'),
    L('Emergency: the medic starts the emergency action plan (call 911 with address and call-back number, BLS) and stays with the patient; the distant provider stays connected until help arrives. Afterwards: document, patient safety report (PSR), after-action review.','Emergencia: el médico inicia el plan de acción de emergencia (llamar al 911 con dirección y número de contacto, BLS) y permanece con el paciente; el proveedor remoto sigue conectado hasta que llegue ayuda. Después: documentar, reporte de seguridad del paciente (PSR), revisión posterior.'),
    L('Poor candidates for VH: refuses, acutely violent/unstable/agitated, needs monitoring not available on site, symptoms worsened by VTC, news best given in person, hearing/vision/cognitive limits. Walk-in emergencies and SI/HI are not VH — follow the local EAP.','Malos candidatos para VH: se niega, violento/inestable/agitado, necesita monitoreo no disponible en el sitio, síntomas que empeoran con VTC, noticias que deben darse en persona, limitaciones auditivas/visuales/cognitivas. Emergencias y SI/HI no son para VH — seguir el EAP local.'),
    L('Setting: private, quiet, good lighting; never a noisy or public area. Do not let the patient operate the equipment; phones off; “VTC in session” sign on the door; communications check, then present the patient.','Lugar: privado, tranquilo, buena iluminación; nunca un área ruidosa o pública. No dejar que el paciente opere el equipo; teléfonos apagados; letrero de “VTC en sesión”; verificar comunicación y luego presentar al paciente.'),
    L('Documentation by the provider in MHS EHR with modifier 95 (GT if the medic and patient are inside an MTF) plus HCPCS T1014. Required training: Swank “Connect & Communicate”, “Policy & Procedures”, Tele-Health course.','Documentación del proveedor en MHS EHR con modificador 95 (GT si médico y paciente están dentro de un MTF) más código HCPCS T1014. Capacitación requerida: Swank “Connect & Communicate”, “Policy & Procedures”, curso de Tele-Health.')
  ]);
  const G=ul([
    L('ADTMC is delegated authority: the supervising privileged provider delegates through the supervising NCO and stays accountable for the screener’s tasks and outcomes.','ADTMC es autoridad delegada: el proveedor privilegiado supervisor delega a través del NCO supervisor y sigue siendo responsable de las tareas y resultados del screener.'),
    L('Orientation: 4 weeks cumulative clinical validation + 36 h didactic. Revalidate every 2 years, on moving to a new location, or (recommended) when the supervising provider changes. Condensed revalidation: ≥1 week and ≥20 Soldiers screened, each presented to the provider; no 36 h didactic.','Orientación: 4 semanas acumuladas de validación clínica + 36 h didácticas. Revalidar cada 2 años, al cambiar de ubicación o (recomendado) cuando cambia el proveedor supervisor. Revalidación condensada: ≥1 semana y ≥20 Soldados, cada uno presentado al proveedor; sin las 36 h didácticas.'),
    L('Clinical validation: ≥80 Soldiers screened under direct physical supervision; each encounter reviewed (EHR or DA Form 5181) before the Soldier leaves; also physical limitations, patient education on minimal care protocols, appointments, assisting procedures (consent and final timeout), direct specialty referrals.','Validación clínica: ≥80 Soldados evaluados bajo supervisión física directa; cada encuentro revisado (EHR o DA Form 5181) antes de que el Soldado se retire; además limitaciones físicas, educación sobre protocolos de cuidado mínimo, citas, asistir procedimientos (consentimiento y final timeout), referidos directos a especialidad.'),
    L('Didactic (36 h): ADTMC 1, readiness/profiles 1, documentation (EHR, DA 5181, SF 600) 1, local SOPs 1, 68W tasks (MEDCOM Reg 40-50) 12, pharmacy annex meds 2, common sick-call conditions 18.','Didáctica (36 h): ADTMC 1, readiness/perfiles 1, documentación (EHR, DA 5181, SF 600) 1, SOPs locales 1, tareas 68W (MEDCOM Reg 40-50) 12, meds del anexo de farmacia 2, condiciones comunes de sick call 18.'),
    L('After validation the provider delegates by MFR (kept in the CAF, uploaded to JCCQAS) with the Orientation and Competency Validation Assessment Form. Competency list: skin, head injury/MACE, red eye, ear, URI/sinus, EKG, abdominal, MSK, BH, heat/cold, travel medicine, allergic reaction, med familiarization; procedures from vitals, visual acuity, glucometer and EKG through splinting, wound care, suturing and I&D.','Tras la validación el proveedor delega mediante MFR (guardado en el CAF y subido a JCCQAS) con el formulario de evaluación de orientación y validación de competencias. Lista de competencias: piel, trauma craneal/MACE, ojo rojo, oído, URI/senos, EKG, abdominal, MSK, BH, calor/frío, medicina de viaje, reacción alérgica, familiarización de meds; procedimientos desde signos vitales, agudeza visual, glucómetro y EKG hasta férulas, cuidado de heridas, suturas e I&D.')
  ]);
  return '<div class="field"><div class="lab"><span class="tag">📚</span><span class="name">'+L('ADTMC appendices E–G (reference)','Apéndices E–G del ADTMC (referencia)')+'</span><span class="ask">'+L('summary · read-only','resumen · solo lectura')+'</span></div>'
   +sec('apxE',L('E — Safety and quality control (pp. 229–234)','E — Seguridad y control de calidad (págs. 229–234)'),E)
   +sec('apxF',L('F — Virtual health (pp. 235–245)','F — Salud virtual (págs. 235–245)'),F)
   +sec('apxG',L('G — Orientation and competency validation (pp. 246–250)','G — Orientación y validación de competencias (págs. 246–250)'),G)
   +'<div class="fuq">'+L('Condensed paraphrase for quick reference. MEDCOM Pam 40-7-21 (13 Nov 2019) is the authority; follow your supervising provider and local SOP.','Paráfrasis condensada para consulta rápida. MEDCOM Pam 40-7-21 (13 nov 2019) es la autoridad; sigue a tu proveedor supervisor y el SOP local.')+'</div></div>';
}
function renderSettings(){
  let h='<h2 class="tpl">⚙️ Settings / Privacy</h2><p class="tpl-sub">Everything stays on this device (localStorage). Nothing is sent to any server.</p>';
  h+='<div class="field"><div class="lab"><span class="tag">🌐</span><span class="name">Language</span></div><div class="chips"><span class="chip '+(LANG==='en'?'on':'')+'" onclick="setLang(\'en\')">English</span><span class="chip '+(LANG==='es'?'on':'')+'" onclick="setLang(\'es\')">Español</span></div><div class="fuq">Interface language. The note is always written in English.</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">🎨</span><span class="name">Theme</span></div><div class="chips">'+THEMES.map(x=>'<span class="chip '+(settings.theme===x[0]?'on':'')+'" onclick="setTheme(\''+x[0]+'\')">'+x[1]+'</span>').join('')+'</div><div class="chips" style="margin-top:8px"><span class="chip '+(settings.mode!=='light'?'on':'')+'" onclick="setMode(\'dark\')">Dark</span><span class="chip '+(settings.mode==='light'?'on':'')+'" onclick="setMode(\'light\')">Light</span></div><div class="fuq">Color and brightness of the interface. Saved on this device only. The note text is not affected.</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">🩺</span><span class="name">'+L('AEM in my unit','AEM en mi unidad')+'</span><span class="ask">ADTMC II</span></div><div class="chips"><span class="chip '+(settings.aemOn?'on':'')+'" onclick="togAem()">'+(settings.aemOn?L('AEM available','AEM disponible'):L('No AEM — "AEM Now" goes to the clinic','Sin AEM — "AEM Now" va a la clínica'))+'</span></div>'+(settings.aemOn?'<input id="aemName" maxlength="60" autocomplete="off" placeholder="'+L('AEM rank / name (optional)','Rango / nombre del AEM (opcional)')+'" value="'+q$(settings.aemName||'')+'" oninput="setAemName(this.value)" style="margin-top:8px">':'')+'<div class="fuq">'+L('AEM = expeditionary combat medic, special operations medic, flight paramedic, or the supervising NCO when local policy delegates that authority. If no AEM is available, the Soldier is seen by the supervising privileged provider (ADTMC Category II).','AEM = expeditionary combat medic, special operations medic, flight paramedic, o el NCO supervisor cuando la política local le delega esa autoridad. Si no hay AEM disponible, al Soldado lo ve el proveedor privilegiado supervisor (ADTMC Categoría II).')+'</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">✎</span><span class="name">'+L('Note detail (screening)','Detalle de la nota (screening)')+'</span></div><div class="chips">'+[['minimal',L('Minimal — positives only','Mínimo — solo positivos')],['short',L('Short — skip red-flag negatives','Corto — sin negativos de banderas rojas')],['full',L('Full — every pertinent negative','Completo — todos los negativos')]].map(([v,l])=>'<span class="chip '+((settings.noteDetail||'short')===v?'on':'')+'" onclick="settings.noteDetail=\''+v+'\';saveSettings();renderMain();renderNote()">'+l+'</span>').join('')+'</div><div class="fuq">'+L('When all red flags are negative the note already says "No red flags." Short leaves out the long "Denies…" list of each red flag.','Si todas las banderas rojas son negativas, la nota ya dice "No red flags." Corto quita la lista larga de "Denies…" de cada bandera.')+'</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">▸</span><span class="name">'+L('Folded sections','Secciones plegadas')+'</span></div><div class="chips"><span class="chip '+(foldOn()?'on':'')+'" onclick="settings.fold=!foldOn();saveSettings();renderMain()">'+(foldOn()?L('ON — sections show as one line; tap to open','ENCENDIDO — cada sección es una línea; toca para abrir'):L('Off — everything open (classic)','Apagado — todo abierto (clásico)'))+'</span></div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">≡</span><span class="name">'+L('Compact history','Historial compacto')+'</span></div><div class="chips"><span class="chip '+(settings.hcompact!==false?'on':'')+'" onclick="settings.hcompact=settings.hcompact===false;saveSettings();renderMain()">'+(settings.hcompact!==false?L('ON — answered letters fold up as you move on','ENCENDIDO — las letras respondidas se pliegan al avanzar'):L('Off — show every letter open','Apagado — todas las letras abiertas'))+'</span></div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">🛡️</span><span class="name">Daily auto-delete</span></div><div class="chips"><span class="chip '+(settings.purge?'on':'')+'" onclick="togPurge()">'+(settings.purge?'ON — notes and data from previous days are deleted on open':'Off')+'</span></div><div class="fuq">Recommended: notes contain Soldier information (PII/PHI). Export what you need before the day ends.</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">🔒</span><span class="name">Lock PIN</span><span class="ask">'+(settings.pin?'active':'no PIN')+'</span></div>';
  h+=settings.pin?'<div class="algo-actions" style="margin-top:0"><button onclick="lockNow()">Lock now</button><button class="ghost" onclick="clearPin()">Remove PIN</button></div>':'<div class="subrow"><div class="half"><input type="password" id="pinNew" inputmode="numeric" maxlength="8" placeholder="4–8 digit PIN" style="margin-top:0"></div><div><button class="gstart" style="width:auto;padding:8px 16px;margin:0" onclick="setPin()">Save PIN</button></div></div>';
  h+='<div class="fuq">The PIN only hides the screen in this browser; it does not encrypt data. If you forget it, "Delete everything" removes it.</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">💾</span><span class="name">Backup</span></div><div class="algo-actions" style="margin-top:0"><button onclick="exportBackup()">Export saved (.json)</button><button class="ghost" onclick="document.getElementById(\'impF\').click()">Import</button><input type="file" id="impF" accept=".json" style="display:none" onchange="importBackup(this)"></div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">📴</span><span class="name">Offline / install on your phone</span></div><div style="font-size:.9em;line-height:1.7;color:var(--dim)">This file works without internet: save it on your phone and open it from the browser. To install it as an app (home-screen icon), upload <b>SICK_CALL_TOOL.html + manifest.json + sw.js</b> together to HTTPS hosting (e.g. GitHub Pages) and use "Add to Home Screen". Service worker status: <b id="swState">…</b></div></div>';
  h+='<div class="field"><div class="lab"><span class="tag">🔄</span><span class="name">'+L('App version','Versión de la app')+' '+APP_VER+'</span></div><div class="algo-actions" style="margin-top:0"><button onclick="updateApp(this)">'+L('Update app (load latest version)','Actualizar app (cargar la última versión)')+'</button></div><div class="fuq">'+L('Needs internet. Clears the offline copy and reloads the newest files; your saved notes and settings are NOT deleted.','Requiere internet. Borra la copia offline y recarga los archivos más recientes; tus notas y ajustes guardados NO se borran.')+'</div></div>';
  h+='<div class="field"><div class="lab"><span class="tag" style="color:var(--red)">🗑️</span><span class="name">Delete everything</span></div><div class="algo-actions" style="margin-top:0"><button style="background:var(--red);color:var(--on-red)" onclick="wipeAll()">Delete EVERYTHING on this device</button></div></div>';
  h+=appxRef();
  h+='<div class="field"><div class="lab"><span class="tag">ℹ️</span><span class="name">Source and scope</span></div><div style="font-size:.88em;line-height:1.7;color:var(--dim)">Protocols and meds transcribed from MEDCOM Pam 40-7-21 (ADTMC). The tool helps document and avoid skipping steps; it does not replace provider/AEM judgment or the current official version. Local modifications may only be more conservative (raise the level of care), never less.</div></div>';
  setTimeout(()=>{const e=document.getElementById('swState');if(e)e.textContent=('serviceWorker' in navigator&&/^https?:/.test(location.protocol))?(navigator.serviceWorker.controller?'active':'not installed'):'unavailable (local file — works offline anyway)';},0);
  return h;
}
function dl(name,txt,type){const b=new Blob([txt],{type:type||'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
function exportNote(){const t=document.getElementById('note').textContent;if(!t.trim())return;const d=new Date();dl('sickcall_'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'_'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'.txt',t);}
function printNote(){window.print();}
/* DD Form 689 (Individual Sick Slip) — printable replica, prefilled from the note. Name/DoD ID are typed only, never stored. */
function noteIsEmpty(){return !noteEntries().length&&!noteActive().length&&!Object.values(gVitals).some(x=>String(x).trim());}
function slipData(){
  const lines=noteIsEmpty()?[]:document.getElementById('note').textContent.split('\n');
  const cc=[];lines.forEach(l=>{const m=l.match(/^CC: (.*?)\.?$/);if(m){const t=m[1].replace(/^C\/o\s+/i,'').trim();if(t&&!cc.includes(t))cc.push(t);}});
  const i=lines.findIndex(l=>/^ASSESSMENT:|^PLAN:|^DISPO|^A — ASSESSMENT|^P — PLAN|^D — DISPOSITION/.test(l));
  const rem=i<0?'':lines.slice(i).join('\n').replace(/\n{2,}/g,'\n').trim();
  const d=new Date(),ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  const body=(lines.length&&/^(PT:|\d{2} [A-Z]{3} \d{2})/.test(lines[0]))?lines.slice(1):lines;
  const hEnd=i<0?lines.length:i;const hist=lines.slice(lines.length-body.length,hEnd).join('\n').replace(/\n{2,}/g,'\n').trim();
  return{cond:cc.join('; '),ymd,name:patient.trim(),rem,hist,full:lines.join('\n').trim()};
}
function slipOpen(){
  if(typeof sheetTog==='function')sheetTog(false);
  const D=slipData();let org='';try{org=localStorage.getItem('sc_org')||'';}catch(e){}
  let o=document.getElementById('slipOv');if(o)o.remove();
  o=document.createElement('div');o.id='slipOv';
  const cb=(id,l)=>`<label class="sl-cb"><input type="checkbox" id="${id}"><span class="bx"></span>${l}</label>`;
  o.innerHTML=`<div class="sl-bar"><b>DD Form 689 — Individual Sick Slip</b><span class="spacer"></span>
    <button onclick="slipHist(this)" id="slipHistBtn">History below: ON</button><button class="pdfbtn" onclick="slipPdf(this)">📄 Official PDF</button><button onclick="slipPrint()">🖨 Print</button><button class="xbtn" onclick="slipClose()" aria-label="Close" title="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="sl-hint">Fill-in only for printing. Name, DoD ID, rank and signature are NOT saved. Tick the boxes in blocks 10–11 and draw your signature in block 13 with your finger if your SOP authorizes you to sign. Blocks 7–9 stay blank for the Commander.</div>
    <div class="sl-form"><div class="sl-title">INDIVIDUAL SICK SLIP</div>
    <div class="sl-row"><div class="sl-c w65"><label>1. MEDICAL CONDITION <i>(Brief Description)</i></label>${cb('slIll','ILLNESS')}${cb('slInj','INJURY')}<textarea id="slCond" rows="2">${D.cond.replace(/</g,'&lt;')}</textarea></div>
      <div class="sl-c w35"><label>2. DATE <i>(YYYYMMDD)</i></label><input id="slDate" value="${D.ymd}"></div></div>
    <div class="sl-row"><div class="sl-c w65"><label>3. PATIENT'S NAME <i>(Last, First, Middle Initial)</i></label><input id="slName" value="${D.name.replace(/"/g,'&quot;')}"></div>
      <div class="sl-c w35 tall" style="grid-row:span 2"><label>6. ORGANIZATION AND STATION</label><textarea id="slOrg" rows="3" onchange="try{localStorage.setItem('sc_org',this.value)}catch(e){}">${org.replace(/</g,'&lt;')}</textarea></div></div>
    <div class="sl-row"><div class="sl-c w35"><label>4. DoD ID NUMBER</label><input id="slId" inputmode="numeric" autocomplete="off"></div><div class="sl-c w30"><label>5. GRADE / RANK</label><input id="slRk"></div></div>
    <div class="sl-row sl-sec"><div class="sl-c w50 ctr">UNIT COMMANDER'S SECTION</div><div class="sl-c w50 ctr">MEDICAL OFFICER'S SECTION</div></div>
    <div class="sl-row"><div class="sl-c w50"><label>7. IN LINE OF DUTY</label><div class="sl-blank s1"></div><label>8. REMARKS</label><div class="sl-blank s8"></div><label>9. SIGNATURE OF UNIT COMMANDER</label><div class="sl-blank s1"></div></div>
      <div class="sl-c w50"><label>10. IN LINE OF DUTY</label><div class="sl-cbs">${cb('slL1','No (EPTS)')}${cb('slL2','Yes (EPTS)')}</div>
        <label>11. DISPOSITION OF PATIENT</label><div class="sl-cbs g3">${cb('slD1','DUTY')}${cb('slD2','QUARTERS')}${cb('slD3','SICK BAY')}${cb('slD4','HOSPITAL')}${cb('slD5','NOT EXAMINED')}${cb('slD6','OTHER <i>(Specify:)</i>')}</div><input id="slOth" placeholder="Other (specify)" autocomplete="off">
        <label>12. REMARKS</label><textarea id="slRem" rows="3" oninput="slFitAll()">${D.rem.replace(/</g,'&lt;')}</textarea><div id="slWarn" class="sl-warn" style="display:none">Long remarks: may not fit on one page. Shorten them or print the full note separately.</div><label>13. SIGNATURE OF MEDICAL OFFICER</label><div class="sl-sigwrap"><canvas id="slSig" class="sl-sig"></canvas><button type="button" class="sl-noprint sl-sigclr" onclick="slSigClear()">Clear signature</button></div><input id="slSigName" placeholder="Printed name, rank, title (optional)" autocomplete="off"></div></div>
    <div class="sl-foot"><b>DD FORM 689, AUG 2017</b><span>PREVIOUS EDITION IS OBSOLETE.</span><b>Page 1 of 1</b></div></div>
    <div class="sl-cont" id="slCont"><div class="sl-cont-h">CLINICAL HISTORY — continuation of block 12 <span>(${D.ymd})</span></div><textarea id="slHist" oninput="slFitAll()">${(D.hist||'').replace(/</g,'&lt;')}</textarea></div>`;
  o._d=D;document.body.appendChild(o);
  const ill=document.getElementById('slIll'),inj=document.getElementById('slInj');
  ill.onchange=()=>{if(ill.checked)inj.checked=false;};inj.onchange=()=>{if(inj.checked)ill.checked=false;};
  const grp=(ids)=>ids.forEach(i=>{const el=document.getElementById(i);el.addEventListener('change',()=>{if(el.checked)ids.forEach(j=>{if(j!==i)document.getElementById(j).checked=false;});});});
  grp(['slL1','slL2']);grp(['slD1','slD2','slD3','slD4','slD5','slD6']);
  slSigInit();document.body.classList.add('slip-print');slFitAll();
}
let _sigCtx=null;
function slSigInit(){
  const c=document.getElementById('slSig');if(!c)return;
  const r=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=Math.max(200,r.width)*dpr;c.height=70*dpr;
  const x=c.getContext('2d');x.scale(dpr,dpr);x.lineWidth=3;x.lineCap='round';x.lineJoin='round';x.strokeStyle='#000';_sigCtx=x;
  let d=false,lx=0,ly=0;
  const pt=e=>{const b=c.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top];};
  c.onpointerdown=e=>{d=true;[lx,ly]=pt(e);c.setPointerCapture(e.pointerId);e.preventDefault();};
  c.onpointermove=e=>{if(!d)return;const[px,py]=pt(e);x.beginPath();x.moveTo(lx,ly);x.lineTo(px,py);x.stroke();lx=px;ly=py;e.preventDefault();};
  c.onpointerup=c.onpointercancel=()=>{d=false;};
}
function slSigClear(){const c=document.getElementById('slSig');if(c&&_sigCtx){_sigCtx.save();_sigCtx.setTransform(1,0,0,1,0,0);_sigCtx.clearRect(0,0,c.width,c.height);_sigCtx.restore();}}
function slFit(el){if(!el)return;el.style.height='auto';el.style.overflow='hidden';el.style.height=(el.scrollHeight+2)+'px';}
function slFitAll(){const o=document.getElementById('slipOv');if(!o)return;const r=document.getElementById('slRem');if(r){const n=r.value.length;r.style.fontSize=n>1500?'9px':n>900?'10px':n>500?'11px':'';}const hh=document.getElementById('slHist');if(hh){const n=hh.value.length;hh.style.fontSize=n>2200?'8px':n>1400?'9px':n>800?'10px':'';}o.querySelectorAll('textarea').forEach(slFit);const w=document.getElementById('slWarn');if(w&&r){w.style.display=r.value.length>1800?'block':'none';}}
/* ---- Official DD 689 PDF: values drawn on the real form (forms/DD689.pdf) with pdf-lib (vendor/, MIT) ---- */
function loadPdfLib(){return window.PDFLib?Promise.resolve(window.PDFLib):new Promise((ok,no)=>{const sc=document.createElement('script');sc.src='vendor/pdf-lib.min.js';sc.onload=()=>ok(window.PDFLib);sc.onerror=()=>no(new Error('pdf-lib not available offline yet'));document.head.appendChild(sc);});}
function winAnsi(t){return String(t||'').replace(/→/g,'->').replace(/←/g,'<-').replace(/≥/g,'>=').replace(/≤/g,'<=').replace(/↓/g,'decreased ').replace(/↑/g,'increased ').replace(/[✓✔]/g,'v').replace(/[•●]/g,'-').replace(/×/g,'x').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF\u2013\u2014\u2026]/g,'');}
function pdfWrap(font,text,size,width){const out=[];String(text||'').split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(w=>{const t=line?line+' '+w:w;if(font.widthOfTextAtSize(t,size)<=width)line=t;else{if(line)out.push(line);line=w;}});out.push(line);});return out;}
async function slipPdf(btn){
  const o=btn&&btn.textContent;if(btn)btn.textContent=L('Building…','Generando…');
  try{
    const P=await loadPdfLib();const {PDFDocument,StandardFonts,rgb}=P;
    const tpl=await fetch('forms/DD689.pdf').then(r=>{if(!r.ok)throw new Error('form');return r.arrayBuffer();});
    const doc=await PDFDocument.load(tpl);const pg=doc.getPages()[0];const H=pg.getHeight();
    const f=await doc.embedFont(StandardFonts.Helvetica),fb=await doc.embedFont(StandardFonts.HelveticaBold);
    const ink=rgb(0.05,0.1,0.35);
    const v=id=>{const e=document.getElementById(id);return e?winAnsi(e.value||''):'';};
    const ck=id=>{const e=document.getElementById(id);return !!(e&&e.checked);};
    const txt=(t,x,yTop,size,font)=>{if(t)pg.drawText(t,{x,y:H-yTop,size:size||10,font:font||f,color:ink});};
    const box=(t,x,yTop,w,hMax,maxSize,minSize)=>{if(!t)return;let sz=maxSize||10,lines;for(;sz>=(minSize||6);sz-=0.5){lines=pdfWrap(f,t,sz,w);if(lines.length*sz*1.2<=hMax)break;}lines.forEach((l,i)=>txt(l,x,yTop+sz+i*sz*1.2,sz));};
    const X=(labelX,yTop)=>txt('X',labelX-11.5,yTop+8,9,fb);
    // block 1-6
    if(ck('slIll'))X(219,58);if(ck('slInj'))X(277,58);
    box(v('slCond'),47,69,300,24,10,7);
    txt(v('slDate'),371,82,10);
    txt(v('slName'),47,118,10);
    box(v('slOrg'),363,106,215,56,10,7);
    txt(v('slId'),47,154,10);txt(v('slRk'),209,154,10);
    // block 10-11
    if(ck('slL1'))X(340,200);if(ck('slL2'))X(424,200);
    [['slD1',340,234],['slD2',424,234],['slD3',509,234],['slD4',340,251],['slD5',424,251],['slD6',509,251]].forEach(a=>{if(ck(a[0]))X(a[1],a[2]);});
    // block 12 (+ other-specify)
    const oth=v('slOth');box((oth?'Other: '+oth+'\n':'')+v('slRem'),317,280,262,124,9,6);
    // block 13 signature + printed name
    const c=document.getElementById('slSig');
    if(c){const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let ink2=false;for(let i=3;i<d.length;i+=4){if(d[i]){ink2=true;break;}}
      if(ink2){const png=await doc.embedPng(c.toDataURL('image/png'));const w=150,h=w*c.height/c.width;pg.drawImage(png,{x:320,y:H-424-Math.min(h,26),width:w,height:Math.min(h,26)});}}
    txt(v('slSigName'),317,449,8);
    // clinical history in the white space below the form
    const hist=document.getElementById('slCont');
    if(hist&&!hist.classList.contains('off')){const ht=v('slHist').trim();if(ht){
      txt('CLINICAL HISTORY - continuation of block 12 ('+v('slDate')+')',42,486,8,fb);
      pg.drawLine({start:{x:42,y:H-490},end:{x:574,y:H-490},thickness:0.6,color:rgb(0,0,0)});
      const colW=258,top=500,bottom=770;let sz=9,cols;
      for(;sz>=6;sz-=0.5){const lines=pdfWrap(f,ht,sz,colW);const per=Math.floor((bottom-top)/(sz*1.25));if(lines.length<=per*2){cols=[lines.slice(0,per),lines.slice(per)];break;}}
      if(!cols){sz=6;const lines=pdfWrap(f,ht,sz,colW);const per=Math.floor((bottom-top)/(sz*1.25));cols=[lines.slice(0,per),lines.slice(per,per*2)];}
      cols.forEach((col,ci)=>col.forEach((l,i)=>txt(l,42+ci*(colW+16),top+sz+i*sz*1.25,sz)));
    }}
    const bytes=await doc.save();const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
    const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.download='DD689_'+(v('slDate')||'slip')+'.pdf';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},60000);
    if(btn)btn.textContent=o;
  }catch(e){if(btn){btn.textContent=L('PDF failed — use Print','PDF falló — usa Imprimir');setTimeout(()=>btn.textContent=o,3000);}console.error(e);}
}
function slipHist(b){const c=document.getElementById('slCont');if(!c)return;c.classList.toggle('off');b.textContent='History below: '+(c.classList.contains('off')?'OFF':'ON');}
function slipRem(b){const o=document.getElementById('slipOv'),r=document.getElementById('slRem');o._full=!o._full;r.value=o._full?o._d.full:o._d.rem;b.textContent=o._full?'Remarks: full note':'Remarks: A/P/Dispo';slFitAll();}
function slipPrint(){
  slFitAll();
  // inputs print as text: mirror values into attributes so print shows them
  document.querySelectorAll('#slipOv input[type=text],#slipOv input:not([type])').forEach(i=>i.setAttribute('value',i.value));
  document.querySelectorAll('#slipOv input[type=checkbox]').forEach(i=>{if(i.checked)i.setAttribute('checked','');else i.removeAttribute('checked');});
  // textareas print as plain text blocks (iOS can clip textareas when printing)
  document.querySelectorAll('#slipOv textarea').forEach(t=>{if(t.id==='slHist')return;let d=t.nextElementSibling;if(!d||!d.classList.contains('sl-pt')){d=document.createElement('div');d.className='sl-pt';t.after(d);}d.textContent=t.value;d.style.fontSize=getComputedStyle(t).fontSize;});
  const hh=document.getElementById('slHist');if(hh){let pd=document.getElementById('slHistP');if(!pd){pd=document.createElement('div');pd.id='slHistP';hh.after(pd);}pd.textContent=hh.value;const nl=hh.value.split('\n').length,n=hh.value.length;pd.style.fontSize=(nl>34||n>2200)?'7.5pt':(nl>22||n>1400)?'8pt':(nl>12||n>800)?'8.5pt':'9pt';pd.classList.toggle('two',nl>6||n>500);}
  document.body.classList.add('slip-print');window.print();
}
function slipClose(){const o=document.getElementById('slipOv');if(o)o.remove();document.body.classList.remove('slip-print');_sigCtx=null;}

/* ---- DA Form 5181 (Screening Note of Acute Medical Care), prefilled ---- */
function daData(){
  const lines=noteIsEmpty()?[]:document.getElementById('note').textContent.split('\n');
  const ent=noteEntries();
  const cc=[];lines.forEach(l=>{const m=l.match(/^CC: (.*?)\.?$/);if(m){const t=m[1].replace(/^C\/o\s+/i,'').trim();if(t&&!cc.includes(t))cc.push(t);}});
  let al='';lines.forEach(l=>{const m=l.match(/^(?:A:|Allergies:?)\s*(.*?)\.?$/i);if(m&&!al)al=m[1];});
  if(!al){const m=document.getElementById('note').textContent.match(/\bNKDA\b/);if(m)al='NKDA';}
  const hi=adHighest();
  const sum=e=>e.title+' ('+e.id+')\n'+(e.lines||[]).join('\n');
  const plan=[];ent.forEach(e=>(e.plan||[]).forEach(x=>{if(!plan.includes(x))plan.push(x);}));
  const d=new Date(),ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  return{ymd,cc:cc.join('; '),al,v:gVitals,ent,hi,sum,plan,firstVisit:!ad.ret,ret:ad.ret};
}
function daOpen(){
  if(typeof sheetTog==='function')sheetTog(false);
  const D=daData();let org='';try{org=localStorage.getItem('sc_org')||'';}catch(e){}
  let o=document.getElementById('slipOv');if(o)o.remove();
  o=document.createElement('div');o.id='slipOv';
  const E=x=>String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const cb=(id,l,on)=>`<label class="sl-cb"><input type="checkbox" id="${id}"${on?' checked':''}><span class="bx"></span>${l}</label>`;
  const e0=D.ent[0],e1=D.ent[1];
  const rest=D.ent.slice(2).map(D.sum).join('\n\n');
  const com=[D.plan.length?D.plan.map(x=>'- '+x).join('\n'):'',rest?('Additional protocols:\n'+rest):''].filter(Boolean).join('\n');
  const dm={PN:'daD1',AEM:'daD2',MCP:'daD4',SP:'daD5',APPT:'daD5'};
  o.innerHTML=`<div class="sl-bar"><b>DA Form 5181 — Screening Note of Acute Medical Care</b><span class="spacer"></span>
    <button onclick="slipPrint()">🖨 Print</button><button class="xbtn" onclick="slipClose()" aria-label="Close" title="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="sl-hint">Fill-in only for printing. Patient identification (name, SSN/DoD ID, unit) is NOT saved — write it by hand or type it here before printing. Signatures stay blank. Final disposition is a suggestion mapped from the ADTMC category: check it.</div>
    <div class="sl-form da"><div class="sl-title">SCREENING NOTE OF ACUTE MEDICAL CARE</div>
    <div class="sl-row"><div class="sl-c w35"><label>TIME PATIENT DEPARTS UNIT <i>(From DD Form 689)</i></label><input id="daDep"></div>
      <div class="sl-c w65"><label>SCREENER LOCATION</label><div class="sl-row3"><div><label>TIME PATIENT ARRIVES</label><input id="daArr"></div><div><label>TIME ENCOUNTER BEGINS</label><input id="daBeg"></div><div><label>TIME PATIENT LEAVES</label><input id="daLv"></div></div></div></div>
    <div class="sl-row"><div class="sl-c" style="width:20%"><label>DATE <i>(YYYYMMDD)</i></label><input id="daDate" value="${D.ymd}"></div>
      <div class="sl-c" style="width:25%"><label>SCREENER LOCATION</label><textarea id="daOrg" rows="2" onchange="try{localStorage.setItem('sc_org',this.value)}catch(e){}">${E(org)}</textarea></div>
      <div class="sl-c" style="width:35%"><label>CHIEF COMPLAINT</label><textarea id="daCC" rows="2">${E(D.cc)}</textarea></div>
      <div class="sl-c" style="width:20%"><label>DURATION</label><input id="daDur"></div></div>
    <div class="sl-row"><div class="sl-c w50"><label>PATIENT RESIDENCE</label>${cb('daBar','BARRACKS')}${cb('daPost','POST HOUSING')}<br>${cb('daOff','OFF POST')}${cb('daTr','TRANSIENT')}</div>
      <div class="sl-c w50"><label>VITAL SIGNS</label><div class="sl-row3"><div><label>TEMPERATURE</label><input id="daT" value="${E(D.v.temp)}"></div><div><label>ALLERGIES</label><input id="daAl" value="${E(D.al)}"></div></div>
        <div class="sl-row3"><div><label>PULSE</label><input id="daHR" value="${E(D.v.hr)}"></div><div><label>BP</label><input id="daBP" value="${E(D.v.bp)}"></div><div><label>RESP</label><input id="daRR" value="${E(D.v.rr)}"></div></div></div></div>
    <div class="sl-row"><div class="sl-c" style="width:100%"><label style="display:inline">FIRST VISIT FOR THIS COMPLAINT</label> ${cb('daFvY','YES',D.firstVisit)}${cb('daFvN','NO',D.ret)} &nbsp; <label style="display:inline">IF NO, WAS RETURN SCHEDULED/REQUESTED BY CARE PROVIDER?</label> ${cb('daRtY','YES')}${cb('daRtN','NO')}</div></div>
    <div class="sl-row sl-sec"><div class="sl-c w50 ctr">ALGORITHM/CODE <input id="daC1" class="dacode" value="${E(e0?e0.id:'')}"></div><div class="sl-c w50 ctr">ALGORITHM/CODE <input id="daC2" class="dacode" value="${E(e1?e1.id:'')}"></div></div>
    <div class="sl-row"><div class="sl-c w50"><label>ALGORITHM SUMMARY</label><textarea id="daS1" rows="14">${E(e0?D.sum(e0):'')}</textarea></div><div class="sl-c w50"><label>ALGORITHM SUMMARY</label><textarea id="daS2" rows="14">${E(e1?D.sum(e1):'')}</textarea></div></div>
    <div class="sl-row"><div class="sl-c" style="width:100%"><label>COMMENTS <i>(Reasons for referral, method of referral, hospital appointments, self-care protocols, and patient instructions/precautions)</i></label><textarea id="daCom" rows="9">${E(com)}</textarea></div></div>
    <div class="sl-row"><div class="sl-c w50"><label>PATIENT'S IDENTIFICATION <i>(Name, SSN, Unit, Sex, Birthdate and Duty Phone)</i></label><textarea id="daPt" rows="6" autocomplete="off"></textarea></div>
      <div class="sl-c w50"><label>FINAL DISPOSITION</label>${cb('daD1','I - PHYSICIAN STAT',dm[D.hi]==='daD1')}${cb('daD4','IV - SELF CARE PROTOCOL',dm[D.hi]==='daD4')}<br>${cb('daD2','II - PA STAT',dm[D.hi]==='daD2')}${cb('daD5','V - HOSP CLINIC REFERRAL',dm[D.hi]==='daD5')}<br>${cb('daD3','III - PA')}
        <div class="sl-row3" style="margin-top:14px"><div><label>AIDMAN'S SIGNATURE &amp; CODE</label><div class="sl-blank s1"></div></div><div><label>AUDITOR'S INITIALS &amp; DATE (YYYYMMDD)</label><div class="sl-blank s1"></div></div></div></div></div>
    <div class="sl-foot"><b>DA FORM 5181, FEB 2003</b><span>DA FORM 5181-R, OCT 86, IS OBSOLETE.</span><b>Page 1 of 2</b></div></div>`;
  document.body.appendChild(o);
  const grp=(ids)=>ids.forEach(i=>{const el=document.getElementById(i);el.onchange=()=>{if(el.checked)ids.forEach(j=>{if(j!==i)document.getElementById(j).checked=false;});};});
  grp(['daBar','daPost','daOff','daTr']);grp(['daFvY','daFvN']);grp(['daRtY','daRtN']);grp(['daD1','daD2','daD3','daD4','daD5']);
  o.querySelectorAll('textarea').forEach(t=>{t.oninput=()=>slFit(t);});document.body.classList.add('slip-print');slFitAll();
}

function exportBackup(){dl('sickcall_backup.json',JSON.stringify({v:1,saved:getSaved()}),'application/json');}
function importBackup(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d&&Array.isArray(d.saved)){setSaved(d.saved.concat(getSaved()));renderNav();alert('Imported '+d.saved.length+' notes.');}}catch(e){alert('Invalid file.');}};r.readAsText(f);}
/* follow-up: reopen a saved patient as a return visit */
function adSnap(){const ids=ad.log.map(e=>e.id);if(ad.pid)ids.push(ad.pid);return{ids,hi:adHighest(),female:gFlags.female,lmp:gFlags.lmp};}
function startFollowUp(i){
  const n=getSaved()[i];if(!n)return;
  patient=(n.name&&n.name!=='(no name)')?n.name:'';const pi=document.getElementById('ptIn');if(pi)pi.value=patient;
  adResetAll();ad.ret=true;ad.prev={t:n.t,name:n.name,ids:(n.ad&&n.ad.ids)||[],hi:n.ad&&n.ad.hi||null};
  if(n.ad){gFlags.female=!!n.ad.female;gFlags.lmp=n.ad.lmp||'';}
  view='adtmc';renderNav();renderMain();renderNote();document.getElementById('main').scrollTop=0;
}
function prevHtml(){
  if(!ad.prev)return'';const p=ad.prev,d=new Date(p.t);
  return '<div class="sugbox"><div class="sughead">↩ Follow-up for '+q$(p.name)+' — visit of '+d.toLocaleDateString()+'</div><div class="fuq">Prior: '+(p.ids.length?p.ids.join(', '):'—')+(p.hi?' → '+LV[p.hi].s:'')+'. Return for the same complaint: not re-screened below AEM (M-1). Open the matching protocol or M-1/M-2.</div><div class="chips"><span class="chip on" onclick="adOpen(\'M-1\')">M-1 Not improving</span><span class="chip on" onclick="adOpen(\'M-2\')">M-2 Return requested by provider</span>'+p.ids.filter(x=>getP(x)).map(x=>'<span class="chip x" onclick="adOpen(\''+x+'\')">'+x+'</span>').join('')+'</div></div>';
}
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol)){try{navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}}


/* ===== Language (EN / ES) — interface only; the note stays in English ===== */
let LANG='en';try{LANG=localStorage.getItem('sc_lang')==='es'?'es':'en';}catch(e){}
function trStr(s){
  if(ES_DICT[s]!==undefined)return ES_DICT[s];
  const m=s.match(/^([^A-Za-z0-9"“‘'(¿¡]+)(.+)$/);
  if(m&&ES_DICT[m[2]]!==undefined)return m[1]+ES_DICT[m[2]];
  return null;
}
function trSkip(el){return !el||['SCRIPT','STYLE','TEXTAREA'].includes(el.tagName)||(el.closest&&el.closest('#note')&&!el.closest('.dimline'));}
function trNode(root){
  if(LANG!=='es'||!root)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const list=[];
  while(n=w.nextNode())list.push(n);
  list.forEach(n=>{
    const par=n.parentElement;if(trSkip(par))return;
    const orig=n.__en!==undefined?n.__en:n.nodeValue;
    const core=orig.replace(/\s+/g,' ').trim();if(!core)return;
    const t=trStr(core);if(t===null)return;
    const lead=orig.match(/^\s*/)[0],trail=orig.match(/\s*$/)[0];
    n.__en=orig;n.nodeValue=lead+t+trail;
  });
  const els=root.nodeType===1?[root,...root.querySelectorAll('[placeholder],[title]')]:[];
  els.forEach(e=>{['placeholder','title'].forEach(a=>{
    if(!e.getAttribute||!e.hasAttribute(a))return;
    const k='data-en-'+a;const orig=e.hasAttribute(k)?e.getAttribute(k):e.getAttribute(a);
    const t=trStr(String(orig).replace(/\s+/g,' ').trim());if(t===null)return;
    e.setAttribute(k,orig);e.setAttribute(a,t);
  });});
}
function trRestore(){
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){if(n.__en!==undefined){n.nodeValue=n.__en;delete n.__en;}}
  document.querySelectorAll('[data-en-placeholder],[data-en-title]').forEach(e=>{['placeholder','title'].forEach(a=>{const k='data-en-'+a;if(e.hasAttribute(k)){e.setAttribute(a,e.getAttribute(k));e.removeAttribute(k);}});});
}
function setLang(l){
  LANG=l==='es'?'es':'en';try{localStorage.setItem('sc_lang',LANG);}catch(e){}
  document.documentElement.lang=LANG;
  trRestore();
  renderNav();renderMain();renderNote();
  trNode(document.body);
  const be=document.getElementById('lEN'),bs=document.getElementById('lES');
  if(be)be.classList.toggle('on',LANG==='en');if(bs)bs.classList.toggle('on',LANG==='es');
}
new MutationObserver(ms=>{if(LANG!=='es')return;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)trNode(n);else if(n.nodeType===3&&n.parentElement)trNode(n.parentElement);}));}).observe(document.body,{childList:true,subtree:true});
applyTheme();syncFmtBtn();
purgeOld();iqLoad();
restore();adRestore();
document.body.style.fontSize=fsBase+'px';showLockIfNeeded();
if(ad.pid&&getP(ad.pid)){const _m=protoTpl(ad.pid);cur=_m.tid;view='tpl';}else{ad.pid=null;view='adtmc';}
iqHash();
renderNav();renderMain();renderNote();
window.addEventListener('hashchange',()=>{if(/iq=/.test(location.hash)){iqHash();renderNav();renderMain();}});
const _pi=document.getElementById('ptIn'); if(_pi)_pi.value=patient;
setLang(LANG);
