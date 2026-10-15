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
