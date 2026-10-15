// Screening answers -> note wording (history vs exam), per protocol.
// y = text when the item is marked YES/present, n = text when screened NO (pertinent negative); null = say nothing.
// Items not listed here (or protocols not listed) are simply not written into the history/exam lines.
const NOTE_TAGS={
 'A-1':{
  'Shortness of breath':{k:'hpi',y:'shortness of breath',n:'shortness of breath'},
  'Stridor':{k:'pe',y:'Stridor present',n:'No stridor'},
  'Deviated uvula':{k:'pe',y:'Uvula deviated',n:'Uvula midline'},
  'Drooling / trouble swallowing':{k:'hpi',y:'drooling / trouble swallowing',n:'drooling or trouble swallowing'},
  'Stiff neck':{k:'hpi',y:'stiff neck',n:'stiff neck'},
  'Symptoms >10 days':{k:'hpi',y:'symptoms > 10 days',n:'symptoms > 10 days'},
  'Immunosuppression':{k:'hpi',y:'immunosuppression',n:'immunosuppression'},
  'Inhaled steroid':{k:'hpi',y:'inhaled steroid use',n:'inhaled steroid use'},
  'Fever':{k:'hpi',y:'fever',n:'fever'},
  'No cough':{k:'hpi',y:null,n:null,inv:'cough'},
  'Tonsillar exudate':{k:'pe',y:'Tonsillar exudate',n:'No tonsillar exudate'},
  'Swollen anterior cervical nodes':{k:'pe',y:'Swollen anterior cervical nodes',n:'No anterior cervical lymphadenopathy'},
  'Cold symptoms present':{k:'hpi',y:'cold symptoms',n:'cold symptoms'},
  'Ear pain present':{k:'hpi',y:'ear pain',n:'ear pain'}
 },
 'A-3':{
  'Abnormal vital signs':{k:'pe',y:'Abnormal vital signs',n:null},
  'Shortness of breath':{k:'hpi',y:'shortness of breath',n:'shortness of breath'},
  'Stiff neck':{k:'hpi',y:'stiff neck',n:'stiff neck'},
  'Altered mental status':{k:'pe',y:'Altered mental status',n:'Alert, mental status normal'},
  'Coughing up blood clots or frank blood':{k:'hpi',y:'coughing up blood',n:'coughing up blood'},
  'Productive cough >7 days':{k:'hpi',y:'productive cough > 7 days',n:'productive cough > 7 days'},
  'Severe sinus pain, dental pain':{k:'hpi',y:'severe sinus / dental pain',n:'severe sinus or dental pain'},
  'Symptoms >7 days':{k:'hpi',y:'symptoms > 7 days',n:'symptoms > 7 days'},
  'Rebound symptoms':{k:'hpi',y:'rebound symptoms',n:'rebound symptoms'},
  'Purulent discharge':{k:'hpi',y:'purulent discharge',n:'purulent discharge'}
 },
 'B-1':{
  'Fever':{k:'hpi',y:'fever',n:'fever'},
  'Saddle anesthesia':{k:'hpi',y:'saddle anesthesia',n:'saddle anesthesia'},
  'Urinary retention / incontinence':{k:'hpi',y:'urinary retention / incontinence',n:'urinary retention or incontinence'},
  'Fecal incontinence':{k:'hpi',y:'fecal incontinence',n:'fecal incontinence'},
  'Motor deficits':{k:'pe',y:'Motor deficit',n:'No motor deficits'},
  'Trauma with vertebral tenderness or neuropathy':{k:'pe',y:'Trauma with vertebral tenderness / neuropathy',n:'No vertebral tenderness after trauma'},
  'Dysuria / frequency':{k:'hpi',y:'dysuria / frequency',n:'dysuria or frequency'},
  'Chest / abdominal pain':{k:'hpi',y:'chest / abdominal pain',n:'chest or abdominal pain'},
  'Radicular symptoms below the knee':{k:'hpi',y:'radicular symptoms below the knee',n:'radicular symptoms below the knee'}
 },
 'B-8':{
  'Abnormal PMS (pulse / motor / sensation)':{k:'pe',y:'Abnormal distal PMS',n:'Distal PMS intact'},
  'Deformity':{k:'pe',y:'Deformity',n:'No deformity'},
  'High-energy trauma':{k:'hpi',y:'high-energy trauma',n:'high-energy trauma'},
  'Red / warm':{k:'pe',y:'Knee red / warm',n:'No redness or warmth'},
  'Immediate swelling after trauma':{k:'hpi',y:'immediate swelling after trauma',n:'immediate swelling after trauma'},
  'No mechanism of injury':{k:'hpi',y:'no mechanism of injury',n:null},
  'Swelling':{k:'pe',y:'Swelling',n:'No swelling'},
  'Decreased ROM':{k:'pe',y:'Decreased ROM',n:'Full ROM'},
  'Previous knee injury':{k:'hpi',y:'previous knee injury',n:'previous knee injury'}
 },
 'B-9':{
  'Abnormal distal pulse':{k:'pe',y:'Abnormal distal pulse',n:'Distal pulse intact'},
  'Abnormal sensation':{k:'pe',y:'Abnormal sensation',n:'Sensation intact'},
  'Deformity':{k:'pe',y:'Deformity',n:'No deformity'},
  'Calf squeeze test positive (foot does not plantar-flex; Achilles rupture)':{k:'pe',y:'Calf squeeze (Thompson) test positive',n:'Calf squeeze (Thompson) test negative'},
  'Pain unrelated to overuse or injury':{k:'hpi',y:'pain unrelated to overuse or injury',n:null},
  'Ottawa ankle/foot rules positive (can\'t bear weight 4 steps; posterior tip medial/lateral malleolus tenderness; proximal 5th metatarsal tenderness)':{k:'pe',y:'Ottawa ankle/foot rules positive',n:'Ottawa ankle/foot rules negative'},
  'Squeeze test positive (syndesmosis)':{k:'pe',y:'Syndesmosis squeeze test positive',n:'Syndesmosis squeeze test negative'},
  'Medial injury':{k:'pe',y:'Medial ankle injury',n:null}
 },
 'C-1':{
  'Vomiting blood or coffee grounds, melena':{k:'hpi',y:'hematemesis / coffee-ground emesis / melena',n:'hematemesis or melena'},
  'Neurologic symptoms':{k:'hpi',y:'neurologic symptoms',n:'neurologic symptoms'},
  'Chest pain':{k:'hpi',y:'chest pain',n:'chest pain'},
  'Abdominal pain followed by nausea':{k:'hpi',y:'abdominal pain followed by nausea',n:'abdominal pain preceding nausea'},
  'Abdominal distension':{k:'pe',y:'Abdominal distension',n:'No abdominal distension'},
  'Chemotherapy':{k:'hpi',y:'chemotherapy',n:'chemotherapy'},
  'BMI <18':{k:'pe',y:'BMI < 18',n:null},
  'Diabetes':{k:'hpi',y:'diabetes',n:'diabetes'},
  'Recent head trauma within 72 hours':{k:'hpi',y:'head trauma within 72 hours',n:'recent head trauma'},
  'Greater than 72 hours':{k:'hpi',y:'symptoms > 72 hours',n:'symptoms > 72 hours'},
  'Signs of fluid depletion / orthostatic hypotension':{k:'pe',y:'Signs of fluid depletion / orthostatic hypotension',n:'No signs of fluid depletion'},
  'Unable to maintain oral intake':{k:'hpi',y:'unable to maintain oral intake',n:'inability to keep fluids down'}
 }
};
// ---- batch 2 ----
Object.assign(NOTE_TAGS,{
 'A-2':{
  'Stiff neck AND fever':{k:'hpi',y:'stiff neck with fever',n:'stiff neck or fever'},
  'Posterior ear pain and/or mastoid erythema':{k:'pe',y:'Posterior ear pain / mastoid erythema',n:'No mastoid tenderness or erythema'},
  'Severe ear pain':{k:'hpi',y:'severe ear pain',n:'severe ear pain'},
  'Ear drainage':{k:'hpi',y:'ear drainage',n:'ear drainage'},
  'Vertigo':{k:'hpi',y:'vertigo',n:'vertigo'},
  'Going on for >7 days':{k:'hpi',y:'symptoms > 7 days',n:'symptoms > 7 days'},
  'Decreased hearing':{k:'hpi',y:'decreased hearing',n:'decreased hearing'},
  'Foreign body in ear':{k:'pe',y:'Foreign body in ear',n:'No foreign body in ear'},
  'Visual trauma to ear':{k:'pe',y:'Visible trauma to ear',n:'No visible ear trauma'},
  'Cold symptoms or sore throat present':{k:'hpi',y:'cold symptoms / sore throat',n:'cold symptoms or sore throat'}
 },
 'B-2':{
  'Bony step-off / midline tenderness to palpation':{k:'pe',y:'Midline tenderness / bony step-off',n:'No midline tenderness or step-off'},
  'Inability to flex neck':{k:'pe',y:'Unable to flex neck',n:'Able to flex neck'},
  'Fever':{k:'hpi',y:'fever',n:'fever'},
  'Recent HEENT or dental infection':{k:'hpi',y:'recent HEENT / dental infection',n:'recent HEENT or dental infection'},
  'Significant mechanism of injury':{k:'hpi',y:'significant mechanism of injury',n:'significant mechanism of injury'},
  'Radiating pain, numbness, tingling, weakness':{k:'hpi',y:'radiating pain / numbness / tingling / weakness',n:'radiating pain, numbness, tingling or weakness'}
 },
 'B-3':{
  'Distal pulses abnormal':{k:'pe',y:'Abnormal distal pulses',n:'Distal pulses intact'},
  'Distal sensation abnormal':{k:'pe',y:'Abnormal distal sensation',n:'Distal sensation intact'},
  'Deformity':{k:'pe',y:'Deformity',n:'No deformity'},
  'Cardiac symptoms':{k:'hpi',y:'cardiac symptoms',n:'cardiac symptoms'},
  'Red / warm joint':{k:'pe',y:'Joint red / warm',n:'No joint redness or warmth'},
  'Abdominal symptoms':{k:'hpi',y:'abdominal symptoms',n:'abdominal symptoms'},
  'Symptoms >3 weeks':{k:'hpi',y:'symptoms > 3 weeks',n:'symptoms > 3 weeks'},
  'Neurologic symptoms':{k:'hpi',y:'neurologic symptoms',n:'neurologic symptoms'},
  'Limited motion':{k:'pe',y:'Limited ROM',n:'Full ROM'},
  'Laceration':{k:'pe',y:'Laceration',n:'No laceration'}
 },
 'B-7':{
  'Abnormal PMS (pulse / motor / sensation)':{k:'pe',y:'Abnormal distal PMS',n:'Distal PMS intact'},
  'Deformity':{k:'pe',y:'Deformity',n:'No deformity'},
  'High-energy trauma':{k:'hpi',y:'high-energy trauma',n:'high-energy trauma'},
  'Suspected stress fracture (increased weight bearing or exercise, endurance training, change in routine)':{k:'hpi',y:'risk factors for stress fracture (increased load / endurance training / change in routine)',n:null},
  'Severe pain':{k:'hpi',y:'severe pain',n:'severe pain'},
  'Paresthesia':{k:'hpi',y:'paresthesia',n:'paresthesia'},
  'Not worse with direct pressure / hip flexion':{k:'pe',y:'Pain not reproduced with direct pressure / hip flexion',n:'Pain reproduced with direct pressure / hip flexion'},
  'Limited ROM':{k:'pe',y:'Limited ROM',n:'Full ROM'}
 },
 'B-10':{
  'Abnormal distal pulse':{k:'pe',y:'Abnormal distal pulse',n:'Distal pulse intact'},
  'Abnormal sensation':{k:'pe',y:'Abnormal sensation',n:'Sensation intact'},
  'Deformity':{k:'pe',y:'Deformity',n:'No deformity'},
  'Suspected stress fracture (increased weight bearing or exercise, endurance training, change in routine)':{k:'hpi',y:'risk factors for stress fracture (increased load / endurance training / change in routine)',n:null},
  'Constant pain':{k:'hpi',y:'constant pain',n:'constant pain'},
  'Pain unrelated to overuse or injury':{k:'hpi',y:'pain unrelated to overuse or injury',n:null},
  'Numbness':{k:'hpi',y:'numbness',n:'numbness'},
  'Red and warm':{k:'pe',y:'Red and warm',n:'No redness or warmth'},
  'Abscess':{k:'pe',y:'Abscess',n:'No abscess'}
 },
 'C-2':{
  'Vomiting blood or coffee grounds, melena':{k:'hpi',y:'hematemesis / coffee-ground emesis / melena',n:'hematemesis or melena'},
  'Severe abdominal pain':{k:'hpi',y:'severe abdominal pain',n:'severe abdominal pain'},
  'Significant weight loss':{k:'hpi',y:'significant weight loss',n:'significant weight loss'},
  'Recent hospital stay':{k:'hpi',y:'recent hospital stay',n:'recent hospital stay'},
  'Recent antibiotics':{k:'hpi',y:'recent antibiotics',n:'recent antibiotics'},
  'Bloody diarrhea':{k:'hpi',y:'bloody diarrhea',n:'bloody diarrhea'},
  'History of inflammatory bowel disease':{k:'hpi',y:'history of IBD',n:'history of IBD'},
  '>6 unformed stools in 24 hours':{k:'hpi',y:'> 6 unformed stools in 24 h',n:'> 6 unformed stools in 24 h'},
  'Hypovolemia':{k:'pe',y:'Signs of hypovolemia',n:'No signs of hypovolemia'},
  '3+ days':{k:'hpi',y:'symptoms 3+ days',n:'symptoms 3+ days'}
 },
 'D-1':{
  'Cyanosis':{k:'pe',y:'Cyanosis',n:'No cyanosis'},
  'Ancillary (accessory) muscle use':{k:'pe',y:'Accessory muscle use',n:'No accessory muscle use'},
  'SpO2 <90%':{k:'pe',y:'SpO2 < 90%',n:null},
  'SIRS criteria':{k:'pe',y:'Meets SIRS criteria',n:null},
  'Airway swelling':{k:'pe',y:'Airway swelling',n:'No airway swelling'},
  'Hives':{k:'pe',y:'Hives',n:'No hives'},
  'Altered mental status (AMS)':{k:'pe',y:'Altered mental status',n:'Alert, mental status normal'},
  'Irregular pulse':{k:'pe',y:'Irregular pulse',n:'Regular pulse'},
  'Sweating':{k:'hpi',y:'sweating',n:'sweating'},
  'Chest, shoulder, jaw pain or pressure':{k:'hpi',y:'chest / shoulder / jaw pain or pressure',n:'chest, shoulder or jaw pain or pressure'},
  'History or family history of heart problems':{k:'hpi',y:'personal / family history of heart problems',n:'personal or family history of heart problems'},
  'Elevated temperature':{k:'pe',y:'Elevated temperature',n:'Afebrile'},
  'Productive cough':{k:'hpi',y:'productive cough',n:'productive cough'},
  'Symptoms >10 days':{k:'hpi',y:'symptoms > 10 days',n:'symptoms > 10 days'},
  'History of asthma / wheeze':{k:'hpi',y:'history of asthma / wheeze',n:'history of asthma or wheeze'},
  'Cold-like symptoms':{k:'hpi',y:'cold-like symptoms',n:'cold-like symptoms'},
  'Allergy symptoms':{k:'hpi',y:'allergy symptoms',n:'allergy symptoms'},
  'History of panic attacks':{k:'hpi',y:'history of panic attacks',n:'history of panic attacks'}
 },
 'E-1':{
  'Systemic inflammatory response syndrome (SIRS)':{k:'pe',y:'Meets SIRS criteria',n:null},
  'Flank pain':{k:'hpi',y:'flank pain',n:'flank pain'},
  'Severe abdominal pain':{k:'hpi',y:'severe abdominal pain',n:'severe abdominal pain'},
  'Gross hematuria or passing blood clots':{k:'hpi',y:'gross hematuria / passing clots',n:'gross hematuria'},
  'Fever T >100.4':{k:'pe',y:'Temp > 100.4 F',n:null},
  'History of diabetes':{k:'hpi',y:'history of diabetes',n:'history of diabetes'},
  'Nausea and vomiting':{k:'hpi',y:'nausea and vomiting',n:'nausea or vomiting'},
  'Vaginal symptoms':{k:'hpi',y:'vaginal symptoms',n:null},
  'Vulvar ulcer':{k:'hpi',y:'vulvar ulcer',n:null},
  'Pain with intercourse':{k:'hpi',y:'pain with intercourse',n:null},
  'Cola-colored urine':{k:'hpi',y:'cola-colored urine',n:'cola-colored urine'},
  'History of kidney stones':{k:'hpi',y:'history of kidney stones',n:'history of kidney stones'},
  '3+ UTIs in 12 months':{k:'hpi',y:'3+ UTIs in 12 months',n:'recurrent UTIs'},
  'Recent urinary catheter':{k:'hpi',y:'recent urinary catheter',n:'recent urinary catheter'},
  'Red urine, not menstrual-cycle related':{k:'hpi',y:'red urine not related to menses',n:'red urine'}
 },
 'F-1':{
  'Abnormal vital signs':{k:'pe',y:'Abnormal vital signs',n:null},
  'Irregular pulse':{k:'pe',y:'Irregular pulse',n:'Regular pulse'},
  'Witnessed or history of seizure':{k:'hpi',y:'witnessed / history of seizure',n:'seizure'},
  'Severe headache':{k:'hpi',y:'severe headache',n:'severe headache'},
  'Heat injury':{k:'hpi',y:'possible heat injury',n:'heat exposure / heat injury'},
  'Suspect drugs / alcohol':{k:'hpi',y:'possible drug / alcohol involvement',n:'drug or alcohol use'},
  'Altered mental status':{k:'pe',y:'Altered mental status',n:'Alert, mental status normal'},
  'Unstable gait':{k:'pe',y:'Unstable gait',n:'Steady gait'},
  'Diabetic':{k:'hpi',y:'diabetes',n:'diabetes'},
  'Vertigo':{k:'hpi',y:'vertigo',n:'vertigo'},
  'Appears anxious':{k:'pe',y:'Appears anxious',n:null},
  'Prevents normal duties':{k:'hpi',y:'symptoms prevent normal duties',n:'symptoms preventing normal duties'}
 },
 'J-1':{
  'Airway compromise / swelling':{k:'pe',y:'Airway compromise / swelling',n:'No airway swelling'},
  'New medication':{k:'hpi',y:'new medication',n:'new medication'},
  'Fever':{k:'hpi',y:'fever',n:'fever'},
  'Painful (not sunburn)':{k:'hpi',y:'painful lesion (not sunburn)',n:'pain at the site'},
  'Failed previous treatment or worsening':{k:'hpi',y:'failed previous treatment / worsening',n:'worsening or failed treatment'},
  'Change in color':{k:'pe',y:'Change in color',n:null},
  'Oozing blood or fluid':{k:'pe',y:'Oozing blood / fluid',n:'No oozing'},
  'Present >4 weeks':{k:'hpi',y:'present > 4 weeks',n:null}
 }
});
