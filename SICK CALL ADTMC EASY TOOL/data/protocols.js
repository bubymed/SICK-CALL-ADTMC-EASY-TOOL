// ADTMC protocols (MEDCOM Pam 40-7-21, Appendix B) — transcribed data + tiny helpers P/DP/EX.
/* =========================================================
   ADTMC ENGINE — MEDCOM Pam 40-7-21 (Adult Telehealth/Minor-care protocols)
   Protocol data is transcribed from the pamphlet; the engine follows its flowcharts.
========================================================= */
const PR=[];
const P=(id,cat,title,o)=>PR.push(Object.assign({id,cat,title},o));
const DP=(items,yes,opts)=>Object.assign({items,yes:yes||{}},opts||{});
const EX=(a,out)=>({ex:a,out:out||[]});
/* ===== A. EAR, NOSE, THROAT ===== */
P("A-1","a","Sore Throat / Hoarseness",{pg:19,
 ddx:["Viral infections","Bacterial infections","Meningitis","Neck deep tissue infection","Candida infection","Strep throat"],
 rf:["Shortness of breath","Stridor","Deviated uvula","Drooling / trouble swallowing","Stiff neck"],
 act:"None",
 flow:[
  DP(["Symptoms >10 days","Immunosuppression","Inhaled steroid","Fever"],{d:"PN"}),
  DP(["Fever","No cough","Tonsillar exudate","Swollen anterior cervical nodes"],{a:"Perform rapid strep (RADT) + culture test (barracks, positive close contact, immunosuppressed contact, h/o ARF)",out:[{l:"Test positive",d:"AEM"},{l:"Test negative",go:"next"}]},{min:3,lo:"Yes to 0–2 → continue"}),
  DP(["Cold symptoms present","Ear pain present"],{tri:["A-3","A-2"]})
 ],
 tx:["MCP sore throat: pain → lozenges first line, ibuprofen second line; elevated temperature → acetaminophen; salt-water gargles and warm fluids for inflammation. Rest and plenty of water.","MCP hoarseness: rest the vocal cords and avoid irritants (cigarette smoking, yelling, heartburn, post-nasal drip). Counsel on tobacco cessation if applicable.","Hoarseness >2 weeks needs a full laryngeal exam by a provider."],
 rtc:"Return if not improving in 3 days, or IMMEDIATELY if worsening symptoms or any red flag.",
 meds:["Lozenges (benzocaine/menthol)","Ibuprofen","Acetaminophen"]});

P("A-2","a","Ear Pain / Drainage / Trauma",{pg:21,
 ddx:["Otitis media/externa","Eustachian tube dysfunction","Nasopharyngeal pathology","Deep space head/neck infections","Meningitis","Mastoiditis","Ruptured ear drum","TMJ dysfunction"],
 rf:["Stiff neck AND fever","Posterior ear pain and/or mastoid erythema"],
 act:"Otitis externa: avoid situations requiring ear plugs; no swimming. Eustachian tube dysfunction: no scuba diving.",
 flow:[
  DP(["Severe ear pain","Ear drainage"],{a:"Otoscope exam: TM redness, opacification, bulging, immobility, rupture; ear canal (EC) redness, swollen, tender",out:[{l:"Otitis media",d:"PN"},{l:"Moderate–severe otitis externa",d:"PN"},{l:"No TM involvement, mild EC findings",go:"next"}]}),
  DP(["Vertigo","Going on for >7 days","Decreased hearing","Foreign body in ear","Visual trauma to ear"],{d:"PN"}),
  DP(["Cold symptoms or sore throat present"],{tri:["A-3","A-1"]})
 ],
 tx:["MCP mild otitis externa: soak a cotton-ball wick with OTC ear drops, place in ear 24 h while using drops; remove wick and continue drops 1 week (3 days after symptoms resolve); keep ear canal dry; ibuprofen PRN pain.","MCP TMJ: refer to dental if hx of teeth grinding; ibuprofen PRN; avoid triggers (excess chewing, gum). Home jaw isometrics: jaw open 1 inch, push down against loosely fisted hand, then forward against hand, 5 sec each, 5 reps, 3 sessions/day."],
 rtc:"Return if not improving in 3 days, worsening symptoms, dizziness, loss of hearing, or stiff neck. Otitis externa not resolved in 1 week → return.",
 meds:["OTC ear drops","Ibuprofen"]});

P("A-3","a","Cold Symptoms / Allergies / Cough",{pg:23,
 note:"If the Soldier says \"I have a cold\", ask \"What do you mean by a cold?\" — if the complaint fits another protocol, use that protocol.",
 ddx:["Allergic or seasonal rhinitis","Bacterial pharyngitis or tonsillitis","Acute bacterial rhinosinusitis","Influenza","Pertussis"],
 rf:["Abnormal vital signs","Shortness of breath","Stiff neck","Altered mental status","Coughing up blood clots or frank blood"],
 act:"Consider quarters / contagious precautions while febrile.",
 flow:[
  DP(["Productive cough >7 days","Severe sinus pain, dental pain"],{d:"PN",a:"Place mask"}),
  DP(["Symptoms >7 days","Rebound symptoms","Purulent discharge"],{d:"AEM",a:"Place mask"})
 ],
 tx:["MCP cold: drink plenty of fluids, rest, cover mouth when coughing, wash hands to prevent spread; stop or limit smoking.","Ibuprofen for pain, acetaminophen for elevated temperature, decongestant for nasal congestion, guaifenesin for mucus, antihistamine for allergies."],
 rtc:"Return if not improving in 7 days, worsening symptoms, new sinus pain, lightheadedness, neck pain, or fever.",
 meds:["Ibuprofen","Acetaminophen","Pseudoephedrine","Guaifenesin","Antihistamine"]});

P("A-4","a","Ringing in the Ears / Hearing Problem",{pg:25,
 ddx:["Cerumen impaction","Otitis media","Otosclerosis","Ruptured ear drum","Eustachian tube dysfunction","Hearing loss","Disorders of the jaw joint","Severe anxiety","Neck injuries"],
 rf:["Altered mental status","Focal neurological symptom or sign","Dizziness"],
 act:"Avoid loud noise exposure x48 hours.",
 flow:[
  DP(["Ringing >24 hours","Ringing without mechanism of injury","Dizziness","Visual trauma","Decreased hearing"],{d:"PN"}),
  DP(["Loud noise exposure or trauma within 24 hours","Ear drainage","Ear pain"],{a:"Otoscope exam: TM opacification, immobility, rupture; EC foreign body, wax buildup",out:[{l:"Abnormal (wax/foreign body/TM abnormal) → ear irrigation only if wax AND TM intact",d:"PN"},{l:"Normal exam",go:"next"}]}),
  DP(["Ear pain","Cold symptoms"],{tri:["A-2","A-3"]})
 ],
 tx:["Ringing after exposure to excessive noise should resolve within 24 hours. Stress correctly fitted hearing protection.","Temporary sensation of hearing loss can be due to colds or ear infections — screen those protocols."],
 rtc:"Return if ringing does not resolve after 24 hours, or if dizziness (spinning), ear pain, hearing loss, or worsening symptoms develop. Check hearing at follow-up.",
 meds:[]});

P("A-5","a","Nosebleed / Nose Trauma",{pg:27,
 ddx:["Upper respiratory infections","Allergic or viral rhinitis","Trauma","Bleeding disorder","Foreign body"],
 rf:["Airway compromise","Orthostatic hypotension","Bleeding from gums","Inability to move eye"],
 act:"None",
 flow:[
  EX("STOP THE BLEEDING: (1) tilt head forward (2) blow nose gently (3) two sprays of oxymetazoline (4) pinch nose with index finger and thumb for 5 minutes",[{l:"Bleeding NOT controlled",d:"PN"},{l:"Bleeding controlled",go:"next"}]),
  DP(["Cut or deformity","Anticoagulation","Intra-nasal meds","High blood pressure","Purulent discharge","Recurrent without a cold"],{d:"AEM"}),
  DP(["Current cold","Runny nose","Allergy symptoms"],{tri:["A-3"]})
 ],
 tx:["Do not blow the nose vigorously or wipe the middle of the nose.","Medications: nasal saline for prevention if the air is dry; oxymetazoline if recurrent with nasal symptoms. Humidifier if air is dry."],
 rtc:"Return if unable to stop a recurrent nosebleed (head forward + pressure 5 min), bleeding from other sites, lightheaded or tired, losing a significant amount of blood (soaks a washcloth — bring it), or recurrent without a common cold.",
 meds:["Oxymetazoline","Saline nasal spray"]});

/* ===== B. MUSCULOSKELETAL ===== */
const MSK_TX=(extra)=>["Provide home exercise program; activity modification as appropriate.","Intermittent ice or heat for inflammation."+(extra&&extra.ice?" "+extra.ice:""),"Medication: analgesic balm for mild pain; ibuprofen (1st line) and ketorolac (2nd line) for moderate pain as needed.","Refer to PT if direct access is available."];
const MSK_RTC="Follow-up: immediate follow-up for DP1 or DP2 symptoms. Routine follow-up for any symptoms that do not improve or worsen. Seek care if pain prevents normal duties, symptoms worsen, or last >1 week.";
P("B-1","b","Back Pain",{pg:29,
 ddx:["Muscle sprain/strain","Fracture","Infection","Renal stone/UTI","Arthritis","Cauda equina syndrome"],
 rf:["Fever","Saddle anesthesia","Urinary retention / incontinence","Fecal incontinence","Motor deficits","Trauma with vertebral tenderness or neuropathy","Dysuria / frequency","Chest / abdominal pain"],
 act:"No repetitive bending or lifting but may lift/carry up to 40 lbs. Stretching + core strengthening home program during PT. No ruck marching, running or jumping, but may walk, bike or swim for cardio.",
 flow:[
  DP(["Any red flag present","No significant mechanism of injury (as printed in ADTMC B-1)"],{d:"PN"}),
  DP(["Radicular symptoms below the knee"],{d:"AEM",a:"PT if available"})
 ],
 tx:MSK_TX(),rtc:MSK_RTC+" Encourage weight loss if obesity is a factor.",meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-2","b","Neck Pain",{pg:31,
 ddx:["Muscle strain","Fracture","Meningitis","Flu","Deep neck space infection"],
 rf:["Bony step-off / midline tenderness to palpation","Inability to flex neck","Fever","Recent HEENT or dental infection"],
 act:"No rucking or jumping. Consider limiting Kevlar use. Restrict driving if limited ROM. Stretching + core strengthening home program during PT.",
 flow:[
  DP(["Red flags present","Significant mechanism of injury"],{d:"PN",a:"Immobilize head and neck if associated with trauma; support ABCs as required"}),
  DP(["Radiating pain, numbness, tingling, weakness"],{d:"AEM",a:"PT if available"})
 ],
 tx:MSK_TX({ice:"Neck ROM at least twice daily, ideally after 20 min of ice; not vigorous enough to cause pain."}),rtc:MSK_RTC,meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-3","b","Shoulder Pain",{pg:33,
 ddx:["Tendon inflammation/tear","Instability (dislocation)","Arthritis","Fracture","Myocardial infarction"],
 rf:["Distal pulses abnormal","Distal sensation abnormal","Deformity","Cardiac symptoms"],
 act:"May lift, push, pull up to 5 lbs. No overhead lifting or repetitive activities. Stretching + core strengthening home program during PT.",
 flow:[
  DP(["Red flags present","Red / warm joint","Abdominal symptoms"],{d:"PN",a:"Immobilize the injured extremity before transport or referral"}),
  DP(["Symptoms >3 weeks","Neurologic symptoms","Limited motion","Laceration"],{d:"AEM",a:"Sling the injured extremity for comfort before transport or referral; PT if available"})
 ],
 tx:MSK_TX(),rtc:MSK_RTC,meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-4","b","Elbow Pain",{pg:35,
 ddx:["Muscle strain","Fracture","Dislocation","Tendonitis","Bursitis"],
 rf:["Distal pulses abnormal","Distal sensation abnormal","Deformity"],
 act:"May lift, push, pull up to 5 lbs. No repetitive bending of elbow or turning/bending of wrist. Stretching + core strengthening home program during PT.",
 flow:[
  DP(["Red flags present","Red / warm","Diffuse pain"],{d:"PN",a:"Immobilize the injured extremity before transport or referral"}),
  DP(["Limited ROM","Neck / shoulder symptoms","Symptoms >2 weeks","Ulnar hand symptoms","Swelling"],{d:"AEM",a:"PT if available"})
 ],
 tx:MSK_TX(),rtc:MSK_RTC,meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-5","b","Wrist Pain",{pg:37,
 ddx:["Fracture","Carpal tunnel","Arthritis","Bursitis","Tendonitis","Muscle strain"],
 rf:["Distal pulses abnormal","Distal sensation abnormal","Deformity","Open fracture"],
 act:"May lift, push, pull up to 5 lbs. May wrap or wear a brace for comfort. No repetitive bending of wrist. Stretching + core strengthening home program during PT.",
 flow:[
  DP(["Red flags present","Red / warm","Trauma / FOOSH (fall on outstretched hand)","No mechanism of injury"],{d:"PN",a:"Immobilize the injured extremity before transport or referral"}),
  DP(["Index / thumb symptoms","Clicking / popping","Mobile mass over tendon","Laceration","Inability to do job"],{d:"AEM",a:"PT if available"})
 ],
 tx:MSK_TX(),rtc:MSK_RTC,meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-6","b","Hand Pain",{pg:39,
 ddx:["Fracture / dislocation","Gout","Carpal tunnel syndrome","Arthritis","Tendonitis","Muscle strain"],
 rf:["Abnormal capillary refill","Abnormal distal sensation","Palmar infection","Deformity","Significant burn"],
 act:"Paronychia: keep area clean and dry. Sprained finger: may lift, push, pull up to 5 lbs; may tape or brace for comfort; no contact sports.",
 flow:[
  DP(["Red flags present","Crush injury","History of punching"],{d:"PN",a:"Immobilize or wrap the injured extremity before transport"}),
  DP(["Finger catching / locking","Laceration","Ulcers","Abscess"],{d:"AEM",a:"PT if appropriate"})
 ],
 tx:["Paronychia: warm soaks 10–15 min, 3x/day, with topical antibiotic cream after each soak. Ibuprofen (1st line) or acetaminophen (2nd line) for pain; ketorolac (3rd line) may be used once on presentation for moderate pain.","Sprained finger: activity modification, intermittent ice for swelling, ibuprofen (1st line) or acetaminophen (2nd line); buddy-splint to adjacent finger."],
 rtc:"Paronychia: return if worsening, spreading redness, abscess formation, or not improving in 2 days. Sprain: return if worsening or not improving.",meds:["Ibuprofen","Acetaminophen","Ketorolac","Topical antibiotic"]});

P("B-7","b","Hip Pain",{pg:41,
 ddx:["Arthritis","Stress fracture","Trochanteric bursitis","Tendinitis","Muscle strain","Hernia","Referred pain"],
 rf:["Abnormal PMS (pulse / motor / sensation)","Deformity","High-energy trauma","Suspected stress fracture (increased weight bearing or exercise, endurance training, change in routine)","Severe pain"],
 act:"No running or jumping but may walk up to ¼ mile at own pace/distance and stand up to 20 min. May lift, carry, push, pull up to 25 lbs. No repetitive lifting from floor. Stretching + core strengthening during PT.",
 flow:[
  DP(["Red flags present"],{d:"PN",a:"Immobilize hip/femur as indicated if trauma. Stress injury: crutches (toe-touch). Follow BSI policy"}),
  DP(["Paresthesia","Not worse with direct pressure / hip flexion","Limited ROM"],{d:"AEM",a:"PT if available"})
 ],
 tx:["Provide home exercise program; activity modification as appropriate.","Intermittent ice or heat for inflammation.","Medication: analgesic balm for mild pain; ibuprofen (1st line) and ketorolac (2nd line) for moderate pain.","Refer to PT if direct access is available."],
 rtc:MSK_RTC,meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-8","b","Knee Pain",{pg:43,
 ddx:["Ligament or cartilage injury","Arthritis","Overuse injury","Infection / inflammation","Bursitis"],
 rf:["Abnormal PMS (pulse / motor / sensation)","Deformity","High-energy trauma"],
 act:"No running or jumping but may walk up to ¼ mile at own pace/distance and stand up to 15 min. No repetitive squatting but may lift, carry, push, pull up to 25 lbs. Stretching + core strengthening during PT. May wear brace or wrap.",
 flow:[
  DP(["Red flags present","Red / warm","Immediate swelling after trauma","No mechanism of injury"],{d:"PN",a:"Immobilize the injured extremity before transport"}),
  DP(["Swelling","Decreased ROM","Previous knee injury"],{d:"AEM",a:"PT if available"})
 ],
 tx:MSK_TX({ice:"ROM exercises 3x/day after 20 min ice, not vigorous enough to cause pain."}),rtc:MSK_RTC+" Return if knee catches / locks / gives out.",meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-9","b","Ankle Pain",{pg:45,
 ddx:["Sprain / strain","Fracture","Tendon rupture","Arthritis","Bursitis","Tendinopathy"],
 rf:["Abnormal distal pulse","Abnormal sensation","Deformity"],
 act:"No running, jumping, rucking but may walk up to ¼ mile at own pace/distance and stand up to 20 min. May lift, carry up to 25 lbs. Limit walking over uneven terrain. Stretching/strengthening during PT. May wear brace or wrap.",
 flow:[
  DP(["Red flags present","Calf squeeze test positive (foot does not plantar-flex; Achilles rupture)","Pain unrelated to overuse or injury"],{d:"PN",a:"Immobilize the injured extremity before transport"}),
  DP(["Ottawa ankle/foot rules positive (can't bear weight 4 steps; posterior tip medial/lateral malleolus tenderness; proximal 5th metatarsal tenderness)","Squeeze test positive (syndesmosis)","Medial injury"],{d:"AEM",a:"X-ray, crutches and PT education; PT if available"})
 ],
 tx:["Provide home exercise program, wrap the ankle, activity modification as appropriate.","Intermittent ice for swelling; elevate.","Medication: analgesic balm for mild pain; ibuprofen (1st line) and ketorolac (2nd line) for moderate pain.","Refer to PT if direct access is available."],
 rtc:"Immediate follow-up for DP1 or DP2 symptoms. Return to clinic if worsening or not improving within 1 week.",meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

P("B-10","b","Foot Pain",{pg:47,
 ddx:["Injury","Overuse","Plantar fasciitis","Tarsal tunnel syndrome","Achilles tendinopathy","Ingrown toenail","Bunion"],
 rf:["Abnormal distal pulse","Abnormal sensation","Deformity","Suspected stress fracture (increased weight bearing or exercise, endurance training, change in routine)"],
 act:"No running, jumping, rucking but may walk up to ¼ mile at own pace/distance and stand up to 20 min. May lift, carry up to 25 lbs. Stretching/strengthening during PT.",
 flow:[
  DP(["Red flag present","Constant pain","Pain unrelated to overuse or injury"],{d:"PN",a:"Immobilize the injured extremity before transport. Stress injury: crutches (toe-touch). BSI policy"}),
  DP(["Numbness","Red and warm","Abscess"],{d:"AEM",a:"PT if appropriate"})
 ],
 tx:["Ingrown toenail: soak in soap and water 20 min, 3x/day; place cotton under the nail. Consult provider if toenail removal required (J-18).","Subungual hematoma: discuss with supervisor; if approved, treat; soak in soap and water 2x/day for 3 days.","Plantar fasciitis: home stretch/strengthen program, intermittent ice, ibuprofen PRN, activity modification, arch support; PT if direct access.","Blisters / callus (J-15): moleskin; consider activity modification. Plantar wart (J-16/J-17): discuss with supervising provider.","All foot MCPs: ibuprofen (1st line) and ketorolac (2nd line) for moderate pain."],
 rtc:"Return if worsens, new symptoms, not improving within 1 week, or interferes with normal duties.",meds:["Ibuprofen","Ketorolac"]});

P("B-11","b","Extremity, Non-Joint Pain",{pg:49,
 ddx:["Fracture","Laceration","Bruise","Stress reaction"],
 rf:["Abnormal distal pulse","Abnormal sensation","Deformity","Cola-colored urine","Inability to urinate"],
 act:"Use the activity limitations of the closest joint protocol above.",
 flow:[
  DP(["Red flags present","Severe pain","Suspected stress fracture","Swelling, erythema"],{d:"PN",a:"Immobilize extremity. Start IV for suspected rhabdomyolysis. Crutches for suspected BSI. BSI policy"}),
  DP(["Abnormal joint function, limited ROM or loss of strength","Laceration","Pain >1 week"],{d:"AEM",a:"Provide crutch if needed; PT if available"})
 ],
 tx:MSK_TX(),rtc:"Return to clinic if worsening or not improving within 1 week.",meds:["Analgesic balm","Ibuprofen","Ketorolac"]});

/* ===== C. GASTROINTESTINAL ===== */
P("C-1","c","Nausea / Vomiting",{pg:51,
 ddx:["Medication","Infection","Intense pain","Pregnancy","Concussion","Heartburn"],
 rf:["Vomiting blood or coffee grounds, melena","Neurologic symptoms","Chest pain","Abdominal pain followed by nausea","Abdominal distension"],
 act:"No food handling, if working in a DFAC, until symptoms have resolved x48 hours.",
 flow:[
  DP(["Chemotherapy","BMI <18","Diabetes","Recent head trauma within 72 hours"],{d:"PN"}),
  DP(["Greater than 72 hours","Signs of fluid depletion / orthostatic hypotension","Unable to maintain oral intake"],{d:"AEM",a:"Pregnancy screen / test (females)"}),
  DP(["Headache (migraine)","Heartburn","Dizziness","Pregnancy","Other symptoms"],{tri:["F-2","C-7","F-1","I-2"]})
 ],
 tx:["Hand-washing protocol. Special food-handler precautions.","Notify supervising NCO if DFAC food is suspected or multiple cases are identified.","Clear-liquid diet: broth, sports drinks, clear non-caffeinated soft drinks, fruit juice, ice chips to maintain calories and hydration. When vomiting is controlled, start BRAT diet (simple carbohydrates)."],
 rtc:"Return if not improved in 48 hours, or any red flag / other symptoms develop.",meds:[]});

P("C-2","c","Diarrhea",{pg:53,
 ddx:["Food intolerance","Medication","Infection (viral/bacterial)","Dizziness","Chest pain","Ear pain","Heartburn"],
 rf:["Vomiting blood or coffee grounds, melena","Severe abdominal pain","Significant weight loss"],
 act:"No food handling, if working in a DFAC, until symptoms resolved x48 hours. Must have access to a restroom within 2 minutes.",
 flow:[
  DP(["Recent hospital stay","Recent antibiotics","Bloody diarrhea","History of inflammatory bowel disease","Severe abdominal pain"],{d:"PN"}),
  DP([">6 unformed stools in 24 hours","Hypovolemia","3+ days"],{d:"AEM"})
 ],
 tx:["Medication: bismuth subsalicylate (1st line) as needed; discuss with provider before giving Imodium (loperamide) (2nd line).","Clear-liquid diet: broth, sports drinks, clear non-caffeinated soft drinks, fruit juice, ice chips. When diarrhea is controlled, start BRAT diet."],
 rtc:"Return if not improved in 1 week, or any red flag / other symptoms develop.",meds:["Bismuth subsalicylate","Loperamide (provider approval)"]});

P("C-3","c","Abdominal and Flank Pain",{pg:55,
 ddx:["MI, AAA","Appendicitis","Pancreatitis, hepatitis","Heartburn","Ectopic pregnancy","Testicular torsion","Pelvic inflammatory disease"],
 rf:["Abnormal vitals","Abdominal rigidity / rebound (bump chair)","Severe pain","Fever with jaundice and RUQ pain","Confirmed pregnancy","Alcoholism","Immunocompromised","RLQ pain"],
 act:"No running, jumping, riding in vehicle over uneven terrain. Aerobic activity at own pace/distance. Abdominal training at own intensity/reps.",
 flow:[
  DP(["Melena","Coffee-ground emesis","Periumbilical pain","Abdominal trauma within 72 hours","Age 40+","Chest pain and nausea"],{d:"PN",a:"Do a pregnancy screen/test (females) first"}),
  DP(["Loss of appetite","Pain followed by nausea","Present for 1+ weeks","Testicular symptoms"],{d:"AEM"}),
  DP(["Nausea / vomiting","Diarrhea","Female pelvic pain","Constipation x3 days","Urinary symptoms","Heartburn"],{tri:["C-1","C-2","I-3","C-5","E-1","C-7"]})
 ],
 tx:["Hydration with 8 glasses of water per day and a well-balanced, high-fiber diet.","Keep a food diary to see if symptoms relate to a particular food."],
 rtc:"Follow-up in 3 days if symptoms have not resolved, or earlier if symptoms worsen, new symptoms develop, or red flags become present.",meds:[]});

P("C-4","c","Rectal Pain / Itching / Bleeding",{pg:57,
 ddx:["Gastrointestinal bleed","Cancer","Infection","IBD","Hemorrhoid / fissure"],
 rf:["Toilet FULL of blood","Vomiting blood or coffee grounds","Melena","Lightheaded"],
 act:"None",
 flow:[
  DP(["Weight loss","Night sweats","Family history of early GI cancer","Change in stool","Mucus with stool","Hemoccult positive","Unable to obtain stool sample"],{d:"PN"}),
  DP(["History of anal sex","Low back problems"],{d:"AEM"})
 ],
 tx:["Sit in warm water 30 min a day. Wash area with warm water and blot dry to keep clean.","Drink 8 glasses of liquid a day and eat high-fiber foods.","Medication: polyethylene glycol (1st line) or docusate sodium (2nd line) to soften stool; hydrocortisone-pramoxine cream (3rd line) if needed for inflammation and pain."],
 rtc:"Return if not improved in 1 week, symptoms worsen, or new symptoms develop.",meds:["Polyethylene glycol","Docusate","Hydrocortisone-pramoxine cream"]});

P("C-5","c","Constipation",{pg:59,
 ddx:["Obstruction","Cancer","Hypothyroidism","Constipation","Associated with hemorrhoids"],
 rf:["Diarrhea at night","Iron deficiency anemia","Vomiting"],
 act:"None",
 flow:[
  DP(["Any red flag","Weight change","Fatigue","Temperature sensitivity","Depression"],{d:"PN"}),
  DP(["Rectal bleeding"],{tri:["C-4"]})
 ],
 tx:["Counsel to drink 8 glasses of water per day and eat high-fiber foods.","Medication: bisacodyl for acute constipation, followed by polyethylene glycol for 2 weeks (1st line) or docusate sodium for 1 week (2nd line)."],
 rtc:"Return for blood in stool, abdominal pain, or no BM for 3 days.",meds:["Bisacodyl","Polyethylene glycol","Docusate"]});

P("C-6","c","Difficulty Swallowing (Dysphagia)",{pg:61,
 ddx:["Food bolus obstruction","Esophagitis","Ring, web, achalasia","Throat infection"],
 rf:["Airway compromise","Coughing / choking when swallowing"],
 act:"None",
 flow:[
  DP(["Sudden onset during eating","Inability to swallow (drooling)"],{d:"PN",a:"Glucagon (provider-ordered) only if unable to transport within 24 hours of onset"}),
  DP(["Started BEFORE a sore throat"],{d:"AEM"}),
  DP(["Sore throat started FIRST"],{tri:["A-1"]})
 ],
 tx:["Do NOT give meat tenderizer for esophageal food impaction (risk of serious esophageal injury).","Glucagon may relax the esophagus when endoscopy is unavailable — must be prescribed by the supervising privileged provider."],
 rtc:"Follow supervising provider direction.",meds:[]});

P("C-7","c","Heartburn",{pg:63,
 ddx:["Gastroesophageal reflux","Myocardial infarction","Stomach/duodenal ulcer","Cancer","Pancreatitis"],
 rf:["Vomiting blood or coffee grounds","Melena","Angina, SOB","Radiation to back"],
 act:"None",
 flow:[
  DP(["Tachycardia","Sweating","Shoulder / jaw pain"],{d:"PN",a:"Oxygen, EKG, chewable aspirin (if no signs of bleeding); do not wait to start these before notifying the provider"}),
  DP([">2 weeks","History of ulcer","Unexplained weight loss","Anorexia, vomiting","Dysphagia","Odynophagia"],{d:"AEM"}),
  DP(["Symptoms are NOT classic heartburn"],{tri:"Screen the other symptoms present"})
 ],
 tx:["Medication: H2-blocker as needed (up to 2 doses in 24 hours). NOTE: ADTMC (2019) lists ranitidine, which was withdrawn from the U.S. market in 2020 — use the locally approved H2-blocker (e.g., famotidine) or antacid per pharmacy/provider.","Lifestyle modification: weight loss if indicated, smoking cessation, elevate head of bed, avoid chocolate/caffeine/spicy foods/alcohol."],
 rtc:"Return if any red flag or other symptoms develop, not improved with minor care, or taking the med more than once per week on average.",meds:["H2-blocker / antacid"]});

/* ===== D. CARDIORESPIRATORY ===== */
P("D-1","d","Shortness of Breath",{pg:65,
 ddx:["Asthma","Anxiety","Myocardial infarction","Pulmonary embolism","Pneumonia, bronchitis","Deconditioning"],
 rf:["Cyanosis","Ancillary (accessory) muscle use","SpO2 <90%","SIRS criteria","Airway swelling","Hives","Altered mental status (AMS)"],
 act:"Cold symptoms: aerobic training at own pace/distance x3 days; limit exposure to temperatures <50°F.",
 flow:[
  DP(["Irregular pulse","Sweating","Chest, shoulder, jaw pain or pressure","History or family history of heart problems"],{d:"PN",a:"Oxygen, EKG, IV, aspirin 325 mg"}),
  DP(["Elevated temperature","Productive cough","Symptoms >10 days","History of asthma / wheeze"],{d:"AEM"}),
  DP(["Cold-like symptoms","Allergy symptoms","History of panic attacks"],{},{none:{d:"AEM",l:"NONE of these → AEM Now"}})
 ],
 tx:["Cold or allergy symptoms: use A-3 minor-care protocol.","Panic-attack symptoms: check EKG; monitor pulse oximeter; supervised deep-breathing exercises. Refer to provider NOW if oxygenation decreases or symptoms do not resolve. Refer to behavioral health after dyspnea has resolved."],
 rtc:"Refer to provider now if oxygenation decreases or symptoms do not resolve.",meds:[]});

P("D-2","d","Chest Pain",{pg:67,
 ddx:["Myocardial infarction","Pulmonary embolism","Pneumonia, bronchitis","Anxiety","Heartburn","Musculoskeletal"],
 rf:["Irregular pulse","History or family history of heart problems","Shoulder / jaw pain or pressure"],
 act:"MSK chest pain: may lift, push up to 25 lbs. Cold symptoms: aerobic training at own pace/distance x3 days; limit exposure to temperatures <50°F.",
 flow:[
  DP(["Any red flag","Abnormal vitals","Abnormal EKG","Sweating","Age 40+"],{d:"PN",a:"Obtain EKG first. Oxygen, IV, chewable aspirin"}),
  DP(["Productive cough >7 days","Elevated temperature","Symptoms >10 days"],{d:"AEM"}),
  DP(["Cold-like symptoms","Reproducible chest pain","Heartburn","History of panic attacks"],{},{none:{d:"AEM",l:"NONE of these → AEM Now"}})
 ],
 tx:["Cold-like symptoms: A-3 protocol. Heartburn: C-7 protocol.","Panic-attack symptoms: check EKG; monitor pulse ox; supervised deep breathing; refer to provider now if oxygenation decreases or symptoms do not resolve; refer to BH after dyspnea resolved.","Musculoskeletal: ibuprofen or acetaminophen for pain, analgesic balm for muscle/tendons. Temporary profile x3 days if needed."],
 rtc:"Return if pain increases, not improved in 4 days, shortness of breath / dizziness / new symptoms develop.",meds:["Ibuprofen","Acetaminophen","Analgesic balm"]});

/* ===== E. GENITOURINARY ===== */
P("E-1","e","Painful / Frequent Urination",{pg:69,
 ddx:["Kidney infection","Urinary tract infection","Kidney stone","Uncontrolled diabetes","BPH","STI, vaginitis"],
 rf:["Systemic inflammatory response syndrome (SIRS)","Flank pain","Severe abdominal pain","Gross hematuria or passing blood clots"],
 act:"None",
 flow:[
  DP(["Any red flag","Fever T >100.4","History of diabetes","Nausea and vomiting","Vaginal symptoms","Vulvar ulcer","Pain with intercourse","Cola-colored urine"],{d:"PN",a:"Pregnancy test. UA, urine culture if available"}),
  DP(["Male","History of kidney stones","Pregnant","3+ UTIs in 12 months","Recent urinary catheter","Red urine, not menstrual-cycle related"],{d:"AEM",a:"UA, urine culture"})
 ],
 tx:["UTI: drink 8+ glasses of water/day. Phenazopyridine as needed (counsel: turns urine orange; may stain contacts).","First-line agent: trimethoprim/sulfamethoxazole — if the MTF antibiotic resistance is >20% or patient has a sulfa allergy, use the second-line agent.","Second-line agent: nitrofurantoin — if allergic to nitrofurantoin, refer to AEM."],
 rtc:"Return if symptoms not improving within 24 hours, new symptoms, or worsening symptoms.",meds:["Phenazopyridine","Trimethoprim/sulfamethoxazole (provider order)","Nitrofurantoin (provider order)"]});

P("E-2","e","Groin / Testicular Pain or Urethral Discharge",{pg:71,
 ddx:["Testicular torsion","Hernia","Muscle/tendon strain","Stress fracture","Hip injury"],
 rf:["Pain with testes supported","Suspected stress fracture (increased weight bearing or exercise, endurance training, change in routine)","Severe pain"],
 act:"Epididymitis: walk at own pace/distance; no running, jumping, riding in military vehicle over uneven terrain; may stand up to 15 min.",
 flow:[
  DP(["Any red flag","Nausea and vomiting"],{d:"PN",a:"Stress fracture: crutches with toe-touch weight bearing"}),
  DP(["Hematuria"],{d:"AEM",a:"STD screen and UA"})
 ],
 tx:["MCP MSK: home exercise program, intermittent ice or heat IAW local protocol if worse with activity.","MCP epididymitis: intermittent ice and testicular support if improved with support; activity modification; ibuprofen (1st line) and ketorolac (2nd line) for moderate pain; provide screening, treatment and counseling if urologic symptoms present.","MCP urethral discharge: provide screening; if discharge present or recent known STI exposure, treat potential gonorrhea/chlamydia with ceftriaxone and azithromycin (per provider order). Contagious — abstain from intercourse x1 week after treatment. Notify provider; refer to community health."],
 rtc:"Epididymitis/MSK: return if worsening pain, new symptoms, or not improved within 1 week. Urethral discharge: return if not improving within 48 hours, new or worsening symptoms.",meds:["Ibuprofen","Ketorolac","Ceftriaxone + azithromycin (provider order)"]});

P("E-3","e","Sexually Transmitted Infection (STI)",{pg:73,
 note:"The partial-differential table printed under E-3 in the pamphlet repeats E-2's list (testicular torsion, hernia, strain...). Use clinical judgment (GC/CT, HSV, syphilis, trichomonas, HPV).",
 ddx:["Testicular torsion","Hernia","Muscle/tendon strain","Stress fracture","Hip injury"],
 rf:["Female pelvic pain with intercourse","Pregnant","Orthostatic","Fever"],
 act:"None",
 flow:[
  DP(["Any red flag","Worsening despite treatment","Severe illness","Vaginal symptoms"],{d:"PN",a:"Pregnancy test. STD screen and UA"}),
  DP(["Skin lesion","Rash"],{d:"AEM"})
 ],
 tx:["Counsel on avoiding sexual contact until diagnosis is confirmed/ruled out, safe-sex practices, and risks of high-risk sexual behavior.","STD screen. Provide treatment with ceftriaxone and azithromycin if positive or symptomatic (per provider order). Notify provider. Refer to community health."],
 rtc:"Return if worsening symptoms, new symptoms, or not improving within 2 days.",meds:["Ceftriaxone + azithromycin (provider order)"]});

P("E-4","e","Problems with Voiding",{pg:75,
 ddx:["Urinary obstruction","Benign prostatic hypertrophy","UTI, STI","Stress incontinence"],
 rf:["Inability to void x12 hours","Fever","Cola-colored urine","Blood or clots in urine"],
 act:"Incontinence: access to a restroom; no jumping.",
 flow:[
  DP(["Any red flag","Vaginal symptoms","Post-void dribbling","Weak stream","Difficulty starting to urinate"],{d:"PN",a:"Urinalysis, pregnancy test"}),
  DP(["Pregnant","Male >40 years old"],{d:"AEM",a:"Urinalysis, pregnancy test"})
 ],
 tx:["If urethral discharge is present, use protocol E-3.","If UA is leukocyte-esterase positive, 2+ WBCs, or UTI symptoms in a female, use E-1.","If leaking urine when coughing, sneezing, jumping — counsel patient on home (pelvic floor) exercises."],
 rtc:"Return if worsening symptoms, new symptoms arise, or not improved within the stated time frame.",meds:[]});

/* ===== F. NEUROPSYCHIATRIC (F-1) ===== */
P("F-1","f","Dizziness / Faintness / Blackout",{pg:77,
 ddx:["Orthostatic hypotension","Vasovagal syncope","Vertigo","Anxiety","Heart arrhythmia","Intracranial bleed","Seizure, drugs, alcohol"],
 rf:["Abnormal vital signs","Irregular pulse","Witnessed or history of seizure","Severe headache","Heat injury"],
 act:"No driving x72 hours.",
 flow:[
  DP(["Any red flag","Suspect drugs / alcohol","Altered mental status","Unstable gait","Diabetic"],{d:"PN",a:"Hypotensive → start IV fluids. Irregular pulse → EKG. Heat exposure → cool"}),
  DP(["Vertigo","Appears anxious","Prevents normal duties"],{d:"AEM"})
 ],
 tx:["Reflex syncope (situation/symptoms before the incident): have the patient lie down with legs crossed and elevated until symptoms resolve. Observe 30 minutes after symptoms resolve to make sure they do not return.","Counsel to increase electrolyte intake; counsel on situations that increase risk of recurrence, symptoms to watch for, and early interventions."],
 rtc:"Return if worsening symptoms, new symptoms arise, or recurrence of the incident.",meds:[]});

/* ===== F. NEUROPSYCHIATRIC (F-2 .. F-6) ===== */
P("F-2","f","Headache",{pg:79,
 note:"The flowchart image for F-2 is missing from the supplied PDF (p.80 shows only the header table). Decision points below are built from the printed narrative (DP1/DP2) on p.79 — verify against your official copy.",
 ddx:["Migraine headache","Tension headache","Caffeine withdrawal","Infection / meningitis","Intracranial hemorrhage"],
 rf:["Sudden onset, severe","Focal neurologic signs","Blown pupil","Severe hypertension (>220 systolic or >110 diastolic)","Fever","Vision change / loss"],
 act:"May wear sunglasses indoors. Limit loud noises. Walk at own pace/distance. No running, rucking, jumping. (One day of physical-activity modification if necessary.)",
 flow:[
  DP(["Any red flag","Sudden worst headache of life","Focal neurologic sign","Blown pupil","Severe hypertension (>220/110) — lay down in quiet, dark room","Fever + unable to touch chin to chest","Altered mental status (ask name, day, year, where)"],{d:"PN"}),
  DP(["Nausea","Uncontrolled high blood pressure","Failed initial treatment","Change from the Soldier's usual headache","Pregnancy (pre-eclampsia if >20 weeks)"],{d:"AEM"})
 ],
 tx:["MCP headache: ibuprofen, naproxen, or ketorolac as needed. May provide physical-activity modification for one day if necessary."],
 rtc:"Return to clinic if confusion, vision problems, nausea, or fever develop; if pain is so severe normal duties are impossible; or headache lasts over 24 hours.",meds:["Ibuprofen","Naproxen","Ketorolac"]});

P("F-3","f","Numbness / Tingling / Paralysis / Weakness",{pg:81,
 ddx:["Viral syndrome / fatigue","Stroke","Nerve compression","Hypoglycemia","Hyperventilation","Depression","Lyme disease"],
 rf:["Localized to a region or one side","Recent trauma","Loss of consciousness","Bowel/bladder incontinence"],
 act:"Insomnia: allow 8 hours of uninterrupted sleep in a 24-hour period. Viral syndrome: PT at own pace/reps/distance x3 days.",
 flow:[
  DP(["Any red flag","Back pain","Severe headache","Blood glucose <70","Diabetic on insulin","Tick exposure"],{d:"PN",a:"Finger-stick glucose first. Glucose <70 → provide sugar/food if available"}),
  DP(["Fever","Prevents normal activities","First occurrence of symptoms","Pregnant (pregnancy test)","Depressed","Age 35+"],{d:"AEM"})
 ],
 tx:["Hyperventilation (RR >14/min): reassure; have Soldier practice relaxed breathing. If symptoms do not resolve within 10 minutes → refer to AEM. If resolved → refer to behavioral health if available.","Viral syndrome: ibuprofen PRN for fatigue/body aches; drink plenty of water; get plenty of sleep.","Insomnia / fatigue / stress: sleep-hygiene education; consider diphenhydramine or melatonin nightly x3 nights; recommend self-reflection to relieve stress; routine BH referral if available."],
 rtc:"Return to clinic if not improving, new symptoms arise, or symptoms worsen.",meds:["Ibuprofen","Diphenhydramine / melatonin"]});

P("F-4","f","Drowsiness / Confusion",{pg:83,
 ddx:["Hypoglycemia","Hypotension","Hypoxia","Concussion","Infection","Intoxication"],
 rf:["Abnormal vital signs","Altered mental status","Focal neurological deficit","Recent trauma"],
 act:"Allow 8 hours of uninterrupted sleep in any 24-hour period.",
 flow:[
  DP(["Any red flag","Unable to touch chin to chest","Hypoglycemia","History of alcoholism","History of narcotics","History of seizures"],{d:"PN",a:"Finger-stick glucose first. Glucose <70 → give glucose. SpO2 <90 → start oxygen. Hx alcohol → thiamine. Hx narcotics → naloxone"}),
  DP(["Sudden onset","Heat exposure","Positive UDS","Positive blood alcohol","Medication changes"],{d:"AEM",a:"Blood alcohol, UDS. Check RECTAL temp if heat exposure is a concern"})
 ],
 tx:["Viral syndrome: ibuprofen PRN for fatigue/body aches; drink plenty of water; get plenty of sleep; screen other symptoms as needed.","Insomnia / fatigue / stress: sleep-hygiene education; consider melatonin or activity modification; recommend self-reflection; routine BH referral if available."],
 rtc:"Return to clinic if not improving, new symptoms arise, or symptoms worsen. If drowsiness/confusion is not from a condition above → refer to AEM.",meds:["Ibuprofen","Melatonin"]});

P("F-5","f","Depression / Nervousness / Anxiety / Tension",{pg:85,
 qs:{
  "Suicide screen (ask every Soldier)":["In the past month, have you wished you were dead or wished you could go to sleep and not wake up?","Have you had any thoughts about killing yourself?","If YES: Have you thought of how you might do this?","Have you started to work out or have you worked out the details of how to kill yourself?","Do you have any intention of acting on these thoughts?"],
  "Depression screen (PHQ-2)":["Over the past 2 weeks, have you often been bothered by feeling down, depressed, or hopeless?","Over the past 2 weeks, have you often been bothered by having little interest or pleasure in doing things?"]
 },
 note:"If YES to suicidality: stay calm, express concern, do not be judgmental or argumentative. DO NOT leave the Soldier alone. Remove means of self-harm. Do not leave the Soldier waiting alone in a busy waiting room. Inform leadership.",
 ddx:["Depression","Anxiety","Hypoxia","Hypo/hyperthyroidism","Substance intoxication or withdrawal"],
 rf:["Homicidal intent or attempt","Suicide intent or attempt","Self-injury","Altered mental status"],
 act:"Escort to Behavioral Health or Emergency Room.",
 flow:[
  DP(["Any red flag","Positive suicide screen","Abnormal vital signs","Severe emotional distress"],{d:"PN",a:"Inform leadership. Do NOT leave Soldier alone. Remove means of self-harm"}),
  DP(["Positive depression screen","Difficulty adjusting to injury or pain","Escorted due to safety concerns","Other indications of depression / anxiety"],{d:"AEM",a:"Obtain list of ALL medications and amounts taken. Ask if currently receiving BH services"})
 ],
 tx:["Offer assistance through Behavioral Health, Chaplain, Chain of Command, Army Community Services, Military and Family Life Consultants, Military OneSource, or Army Wellness Center. Offer to escort the Soldier to the service. Must be CLEARED by the supervising medic before the Soldier leaves the screening area."],
 rtc:"Do not allow the Soldier to leave the screening area until cleared by the supervising medic.",meds:[]});

P("F-6","f","Mild Traumatic Brain Injury (Concussion)",{pg:87,
 note:"All possible mTBI → MACE 2 exam, documented in the medical record. Observable signs: lying motionless, slow to get up, disorientation/confusion, blank look, balance difficulty, facial injury after head trauma.",
 ddx:["Headache / migraine","Concussion","Intracerebral hemorrhage","Anxiety","Stroke","Spinal cord injury","Seizure","Dehydration"],
 rf:["Deteriorating level of consciousness","Double vision","Increased restlessness, combative or agitated behavior","Repeat vomiting","Positive result from structural brain injury detection device (if available)","Seizure","Weakness or tingling in arms or legs","Severe or worsening headache","Abnormal neuro exam","Battle sign, raccoon eyes","Suspected skull fracture","Anticoagulant use"],
 act:"Minimum 24-hour rest: (1) rest with extremely limited cognitive activity; (2) limit physical activity to daily living and extremely light leisure; (3) avoid working, exercising, video games, studying, driving; (4) avoid any potentially concussive events; (5) avoid caffeine and alcohol. Reassess with MACE 2 after 24 h rest. Use CMT + PRA for specific management.",
 flow:[
  DP(["Any red flag","Amnesia 30+ min before the event","Neurological deficit","High-impact head injury"],{d:"PN",a:"Perform MACE 2 exam first"}),
  DP(["MACE 2 cognitive score ≤25 (<26)","Nausea, dizziness","Headache","Memory / concentration problem","Balance / visual problem","Ringing in the ears","Altered or loss of consciousness","History of prior TBIs","Any abnormal neuro or VOMS exam"],{d:"AEM"})
 ],
 tx:["All POSITIVE MACE 2 screens → refer to AEM or provider for further evaluation (min 24 h rest, follow-up every 24–48 h up to 7 days; CMT + progressive return to activity).","NEGATIVE MACE 2: review the Acute Concussion Educational Brochure; mandatory 24-hour rest; re-evaluate after 24 h BEFORE return to duty, including exertional testing if asymptomatic.","More information: https://dvbic.dcoe.mil"],
 rtc:"Return to clinic if symptoms worsen or new symptoms develop.",meds:[]});

/* ===== G. CONSTITUTIONAL ===== */
P("G-1","g","Fatigue",{pg:90,
 ddx:["Sleep debt","Sleep apnea","Anemia","Anxiety disorders","Chronic infection/inflammation","Chronic fatigue syndrome","Acute liver failure"],
 rf:["Suicide ideation","Homicide ideation","Shortness of breath","Stiff neck","Melena"],
 act:"Allow 8 hours of uninterrupted sleep within a 24-hour period.",
 flow:[
  DP(["Any red flag","Depression","Loss of libido","Weight change","Menorrhagia / anemia >3 weeks","Snoring","USPSTF screening / PHA out of date"],{d:"PN"}),
  DP(["Cold, sore throat symptoms","Rectal bleeding","Other symptoms"],{tri:["A-3","A-1","C-4"]})
 ],
 tx:["OTC medication: diphenhydramine to assist with sleep if needed.","Referral: Wellness Center for relaxation exercises for stress; ACS for anger management; Behavioral Health or Chaplain for stress or support."],
 rtc:"Return if not improving in 1 week, or immediately if red flags, development of new symptoms, or inability to perform daily activities.",meds:["Diphenhydramine"]});

P("G-2","g","Fever / Chills",{pg:92,
 ddx:["Malaise","Cold symptoms","Sore throat, ear pain","Heat/cold injury","Diarrhea","Pain with urination"],
 rf:["Heat injury","Stiff neck","Light sensitivity","Pregnant","Seizure","Lightheaded"],
 act:"For a fever: consider quarters x24–48 hours (must discuss with supervising privileged provider).",
 flow:[
  DP(["Abnormal vitals","HIV positive","Immunosuppression","Overseas travel within 6 months","Tick or mosquito bite","Malaria area","Animal exposure","IV drug use"],{d:"PN"}),
  DP(["Cold","Sore throat symptoms","Ear pain","Diarrhea","Pain with urination","Other symptoms"],{tri:["A-3","A-1","A-2","C-2","E-1"]})
 ],
 tx:["OTC medication: acetaminophen PRN for elevated temperature (no other medications containing acetaminophen; no alcohol). Ibuprofen PRN for malaise.","Stay hydrated — drink fluids to keep urine mostly clear. Get plenty of rest."],
 rtc:"Return if red flags, new symptoms, lasts longer than 48 hours, or fever not controlled with acetaminophen.",meds:["Acetaminophen","Ibuprofen"]});

/* ===== H. EYE ===== */
P("H-1","h","Eye Pain / Redness / Discharge / Itching / Injury",{pg:94,
 note:"Do NOT perform the fluorescein exam if there is concern for an open globe or ruptured eye.",
 ddx:["Blepharitis","Allergies","Conjunctivitis","Corneal abrasion / trauma","Subconjunctival hemorrhage","Keratitis / iritis"],
 rf:["Fixed, abnormal pupil","Visual acuity change","Observed foreign body","Penetration, rupture","Chemical exposure","Fluid level over iris, pupil"],
 act:"None",
 flow:[
  DP(["Any red flag","Contact lens wearer","Fluorescein uptake","Recent eye surgery","Associated head trauma","Double vision"],{d:"PN",a:"Eye exam + fluorescein*. Chemical → irrigation. Foreign body → Fox shield. Head trauma → stabilize neck. Other → cover eye"}),
  DP(["Thick yellow or green discharge","Painful","Light sensitivity","Inability to keep eye open","Trauma","History of foreign body, getting better"],{d:"AEM"})
 ],
 tx:["Stye: warm compress x15 min, 4x/day, followed by massaging the area.","Blepharitis: warm compresses (like stye), avoid make-up, wash with warm water and tear-free shampoo.","Dry eyes: artificial tears / lubricating drops as needed.","Viral/allergic conjunctivitis: warm or cool compresses, topical antihistamine/decongestant drops, contagion precautions.","Subconjunctival hemorrhage: demarcated area of blood outside the iris with normal vision, no discharge, light sensitivity or foreign-body sensation; typically resolves in 1–2 weeks."],
 rtc:"Return if worsening or new symptoms develop.",meds:["Artificial tears","Antihistamine/decongestant eye drops"]});

P("H-2","h","Eyelid Problem",{pg:96,
 ddx:["Stye, blepharitis","Dermatitis","Infection","Eyelid laceration"],
 rf:["Open globe","High-risk laceration","Decreased visual acuity","Double vision"],
 act:"None",
 flow:[
  DP(["Any red flag","Fixed pupil","Moderate–severe pain"],{d:"PN",a:"Eye exam (visual). Fox shield / protective cover. Head trauma → stabilize neck"}),
  DP(["Significant redness, swelling","Rash >1 week"],{d:"AEM"})
 ],
 tx:["Stye / chalazion: warm compress x15 min, 4x/day, followed by massaging the area.","Blepharitis: warm compresses (like stye), avoid make-up, wash with warm water and tear-free shampoo.","Contact dermatitis: avoid the exposure; hydrocortisone ointment 1% twice a day for 1 week."],
 rtc:"Return if worsening, new symptoms develop, or not improving within 1 week.",meds:["Hydrocortisone 1% ointment"]});

P("H-3","h","Decreased Vision / Seeing Spots / Request for Glasses",{pg:98,
 ddx:["Trauma","Migraine","Hemorrhage","Infection","Ischemia, stroke"],
 rf:["Trauma","Recent surgery","Chemical exposure","Fluid level over iris, pupil","Neurologic deficits"],
 act:"None",
 flow:[
  DP(["Any red flag","Observed foreign body","Partial visual field affected"],{d:"PN",a:"Eye exam. Fox shield / protective cover. Head trauma → stabilize neck"}),
  DP(["Contact wearer","Onset within 7 days","Painful","Red","Headache"],{d:"AEM"})
 ],
 tx:["Decreased visual acuity worse than 20/40, gradual onset: refer to optometry for evaluation for glasses.","Floaters are common and benign — provide reassurance."],
 rtc:"Return if the condition is worsening or new symptoms develop.",meds:[]});

P("H-4","h","Seeing Double (Diplopia)",{pg:100,
 ddx:["Intoxication","Prescription eyeglasses","Muscle weakness","Trauma"],
 rf:["Trauma","Neurologic deficits"],
 act:"No driving. No firing weapon. No duties requiring depth perception.",
 flow:[
  DP(["Any red flag","Red eye","Associated pain"],{d:"PN",a:"Visual acuity. Head trauma → stabilize neck"}),
  DP(["Appears intoxicated","Diplopia resolves with 1 eye shut"],{d:"AEM"})
 ],
 tx:["Long-standing history or started with new eyeglasses: refer to optometry and patch the eye for symptomatic relief. No driving a vehicle, firing a weapon, or other duties requiring depth perception until evaluated by an optometrist."],
 rtc:"Return if symptoms worsen or new symptoms develop.",meds:[]});

/* ===== I. GYNECOLOGICAL ===== */
P("I-1","i","Breast Problems",{pg:102,
 ddx:["Cyclical breast pain","Musculoskeletal issue","Large breasts","Mastitis, abscess","Cancer"],
 rf:["Skin changes","Mass","Bloody nipple discharge"],
 act:"No running, jumping, rucking. Walk at own pace/distance. May lift, carry, push up to 25 lbs.",
 flow:[
  DP(["Any red flag","Temp >100.4","Red, swollen breast","Focal breast pain but no other symptoms","Family history of early breast cancer"],{d:"PN"}),
  DP(["Male with history of testosterone supplement","Female breastfeeding","Repeat visit"],{d:"AEM"})
 ],
 tx:["Large breasts: educate on physical support (well-fitting bra). Ice/heat (1st line) or acetaminophen (2nd line) for mild pain; ibuprofen (1st line) or ketorolac (2nd line) for moderate pain.","Extramammary / musculoskeletal pain: ice/heat for inflammation, methyl salicylate (1st line) or acetaminophen (2nd line) for mild pain; ibuprofen (1st line) or ketorolac (2nd line) for moderate pain. Activity modification as needed.","Female diffuse breast pain: ice/heat, methyl salicylate (1st) or acetaminophen (2nd) for mild pain; ibuprofen (1st) or ketorolac (2nd) for moderate pain. Reassure; refer to provider if Soldier is still concerned about breast cancer risk."],
 rtc:"Return if not improving within 3 days, worsening symptoms, or development of new symptoms.",meds:["Ice/heat","Methyl salicylate","Acetaminophen","Ibuprofen","Ketorolac"]});

P("I-2","i","Suspects Pregnancy",{pg:104,
 ddx:["Irregular menstrual cycle","Pregnancy"],
 rf:["Positive hCG AND pelvic pain","History of ectopic pregnancy","Vaginal bleeding"],
 act:"None",
 flow:[
  DP(["Any red flag (positive hCG + pelvic pain; h/o ectopic; vaginal bleeding)"],{d:"PN",a:"Check urine hCG first"}),
  DP(["Positive hCG without other symptoms"],{d:"AEM"})
 ],
 tx:["Counsel the Soldier to avoid alcohol and NSAID medications.","Urine hCG obtained >7–8 days after conception should be positive."],
 rtc:"Return to clinic in 1 week if she still has not had a cycle.",meds:[]});

P("I-3","i","Menstrual Problems / Vaginal Bleeding",{pg:106,
 note:"Take a menses history: length, severity (clots, # pads), medications. Missed periods → I-2; discharge → I-4; abdominal pain → C-3.",
 ddx:["Heavy menstrual cycle","Irregular menstrual cycle","Birth control side effect","Miscarriage","Ectopic pregnancy"],
 rf:["Sexual assault","Trauma","Severe pain","Pregnant"],
 act:"Aerobic exercise at own pace/distance x3 days. Must have access to a restroom every hour.",
 flow:[
  DP(["Any red flag","Non-midline pelvic pain","Pain with intercourse","Post-menopause","Bleeding >10 days, not on birth control"],{d:"PN",a:"Check hCG first"}),
  DP(["New problem","Failed previous self-care","Menstrual pain onset after age 25","Progression of symptoms","Menses <21 or >35 days","Spotting >1 pad / 2 hrs","Prevents normal duties"],{d:"AEM"})
 ],
 tx:["Menstrual cramps: NSAID such as naproxen or ibuprofen as needed for pain, with food, for up to 7 days. Ketorolac (Toradol) as a one-time dose for moderate pain. Warm compress over the abdomen."],
 rtc:"Return if symptoms are worsening, new symptoms develop, or symptoms not controlled with the MCP.",meds:["Naproxen","Ibuprofen","Ketorolac (1x dose)"]});

P("I-4","i","Vaginal Discharge / Itching / Irritation / Pain",{pg:108,
 note:"If external/vaginal discomfort comes with urinary symptoms (frequency, urgency, internal dysuria) → screen E-1.",
 ddx:["Bacterial vaginosis","Yeast infection","Trichomonas","Pelvic inflammatory disease","STI"],
 rf:["Fever","Pregnant","Non-midline pelvic pain","Pain with intercourse"],
 act:"None",
 flow:[
  DP(["Any red flag","Recurrent vaginitis","Presence of IUD","Vaginal discharge","Genital lesion / ulcer","Vaginal lump / mass","Pelvic pain during exercise"],{d:"PN",a:"Check hCG first"}),
  DP(["Moderate vaginal pain","Presentation different from the treatment-protocol descriptions"],{d:"AEM"})
 ],
 tx:["Yeast infection: treat with fluconazole (per protocol/provider order).","Bacterial vaginosis: treat with metronidazole x7 days (per protocol/provider order)."],
 rtc:"Return if symptoms are worsening, new symptoms develop, or the MCP does not resolve symptoms.",meds:["Fluconazole","Metronidazole"]});

P("I-5","i","Request for Pap / Routine Pelvic Exam",{pg:110,
 note:"If cycle is late, check pregnancy test (pregnant → AEM). Review prior pap results; if abnormal, find the clinical plan of care and check it was followed. USPSTF: first Pap at 21; ages 21–29 Pap every 3 yrs; 30+ Pap every 3 yrs, or Pap+HPV every 5 yrs if both negative; HPV vaccine up to age 26; G/C screening yearly for women <26.",
 ddx:[],rf:[],act:"None",
 flow:[
  DP(["Pregnant","Abnormal previous Pap","Total hysterectomy"],{d:"PN",a:"Check hCG"}),
  DP(["1st Pap, age 21+","Age 21–29: Pap every 3 yrs","Age 30+: Pap every 3 yrs, or Pap + HPV every 5 yrs if negative","Additional screening: HPV vaccine","G/C screening"],{d:"APPT"})
 ],
 tx:[],rtc:"",meds:[]});

P("I-6","i","Request for Information on Contraception",{pg:111,
 note:"Determine LMP; pregnancy test if late; prior contraceptive history. Long-acting methods (implant, IUD) are most effective; injectables/oral/patch/ring depend on consistent use; condoms and behavioral modification least effective. Check hCG if requesting Depo-Provera. If male: discuss vasectomy with AEM and follow local referral protocol.",
 ddx:[],rf:[],act:"None",
 flow:[
  DP(["Pregnant","Medication side-effects","History of recent unprotected sex"],{d:"PN",a:"Screening: check hCG"}),
  DP(["Discuss effectiveness of each type of contraceptive","Discuss contraceptive preferences","Discuss additional benefits"],{d:"APPT",a:"Schedule appointment or referral (routine for injectable/oral/patch/ring; procedural or referral for implant/IUD)"})
 ],
 tx:[],rtc:"",meds:[]});

/* ===== J. DERMATOLOGICAL (J-1 .. J-8) ===== */
P("J-1","j","Unknown Cause of Skin Disorder / Complaint",{pg:112,
 ddx:["Eczema","Hives","Contact dermatitis","Athlete's foot","Heat rash","Drug reaction"],
 rf:["Airway compromise / swelling"],
 act:"Keep area clean and dry.",
 flow:[
  DP(["New medication","Fever","Painful (not sunburn)","Failed previous treatment or worsening"],{d:"PN"}),
  DP(["Change in color","Oozing blood or fluid","Present >4 weeks"],{d:"AEM"})
 ],
 tx:["Continue the current skin treatment regimen if it has not been completed/followed for the necessary time (usually 2–3 weeks).","Screen according to the pertinent algorithm if you can identify the skin condition.","Refer to AEM for further evaluation if you cannot identify the skin condition."],
 rtc:"",meds:[]});

P("J-2","j","Acne",{pg:114,
 ddx:["Acne vulgaris","Pseudofolliculitis barbae","Folliculitis","Acne rosacea","Hyperandrogenism"],
 rf:["None"],act:"None",
 flow:[
  DP(["Requesting birth control","Positive hCG","Hyperandrogenism signs","Draining lesion","Acute onset","Requiring limitations in protective equipment"],{d:"PN",a:"Check hCG first"}),
  DP(["Acne interferes with wearing equipment","Moderate–severe inflammatory acne","Scarring or hyperpigmentation","Failed initial treatment","Appears very self-conscious"],{d:"AEM"})
 ],
 tx:["Comedones: confirm negative pregnancy test (if female) and no fish allergy. Topical retinoid, pea-size, to affected dry-face area at night; decrease to every other night if irritation / dry skin occurs.","Mild–moderate inflammation: add topical combination of benzoyl peroxide + antibiotic in the morning (retinoid at night)."],
 rtc:"Return if symptoms worsening, new symptoms developing, or not controlled with MCP within 2 weeks.",meds:["Topical retinoid","Benzoyl peroxide / topical antibiotic"]});

P("J-3","j","Shaving Problem — Pseudofolliculitis Barbae",{pg:116,
 ddx:["Acne","Pseudofolliculitis barbae","Folliculitis","Tinea barbae","Acne keloidalis nuchae"],
 rf:["Facial cellulitis"],act:"Shaving profile in eProfile.",
 flow:[
  DP(["Any red flag","Abscess requiring drainage on face or neck","Signs of scarring","Requiring limitations on protective equipment"],{d:"PN"}),
  DP(["Failed conservative therapy","Requesting profile"],{d:"AEM"})
 ],
 tx:["Counsel on shaving routine: wash face in a circular motion, warm compress and leave shaving cream on 5 min prior to shaving, use a single-blade razor.","Topical retinoid with or without a low-potency steroid once a day at night as an adjunct."],
 rtc:"Return if symptoms worsening, new symptoms developing, or not controlled with MCP.",meds:["Topical retinoid","Low-potency steroid"]});

P("J-4","j","Dandruff (Scaling of the Scalp)",{pg:118,
 ddx:["Pemphigus foliaceous","Tinea capitis","Psoriasis","Allergic contact dermatitis","Seborrheic dermatitis"],
 rf:["Scaling with visible inflammation","Abnormal sensation","Painful erosions"],act:"None",
 flow:[
  DP(["Any red flag"],{d:"PN"}),
  DP(["2nd complaint","Medicated shampoo not (stopped) working","Developed new / worsening symptoms"],{d:"AEM"})
 ],
 tx:["Antifungal shampoo daily (minimum 2–3 times per week) for several weeks until remission.","Manage stress. Spend a few minutes outdoors in the sun (DO NOT sunbathe)."],
 rtc:"Return if mild dandruff still present after 3–4 weeks of antifungal shampoo, symptoms worsen, or new symptoms begin.",meds:["Antifungal shampoo"]});

P("J-5","j","Hair Loss",{pg:120,
 ddx:["Alopecia","Traction hair loss","Alopecia areata","Tinea capitis","Acne keloidalis nuchae"],
 rf:["None"],act:"None",
 flow:[
  DP(["New medication","Lack of hair follicles","Smooth, circular hair loss"],{d:"PN"}),
  DP(["Tinea capitis","Papules, pustules","Erythema"],{d:"AEM"})
 ],
 tx:["Traction hair loss: avoid tight hair styles, chemical relaxants, and applying heat to hair until resolved. Refer to AEM if signs of inflammation.","Male/female pattern hair loss: discuss suspected diagnosis with the AEM, then counsel the patient."],
 rtc:"Return if symptoms worsen or new symptoms begin.",meds:[]});

P("J-6","j","Athlete's Foot (Tinea Pedis)",{pg:122,
 ddx:["Interdigital tinea pedis","Hyperkeratotic (moccasin-type) tinea pedis","Vesiculobullous (inflammatory) tinea pedis"],
 rf:["Diabetic Soldiers","Significant erosions / ulcerations or malodor in affected area","Soldiers with weakened immune systems"],act:"None",
 flow:[
  DP(["Any red flag"],{d:"PN"}),
  DP(["Rash with no improvement or response to medication","Blisters and ulcers"],{d:"AEM"})
 ],
 tx:["Antifungal lotion, ointment, powder or spray applied twice a day for 4–8 weeks.","Prevention: keep feet dry, change socks regularly, well-ventilated shoes, foot protection in public places, antifungal powder daily, alternate shoes, do not share shoes."],
 rtc:"Return if the fungal infection does not respond, symptoms worsen, or new symptoms develop.",meds:["Topical antifungal (clotrimazole/tolnaftate/miconazole)"]});

P("J-7","j","Jock Itch (Tinea Cruris)",{pg:124,
 ddx:["Inverse psoriasis","Erythrasma","Seborrheic dermatitis","Candidal intertrigo"],
 rf:["Diabetes","Immunodeficiency"],act:"None",
 flow:[
  DP(["Any red flag"],{d:"PN",a:"Perform KOH examination"}),
  DP(["Itchy, red rash in the groin area","No improvement in 2 weeks","Recurring infection"],{d:"AEM",a:"Perform KOH examination"})
 ],
 tx:["Topical antifungal medication twice a day for 2 weeks (for an itchy, red, ring-shaped groin rash).","Preventive: hygiene — keep groin area clean and dry."],
 rtc:"Return if symptoms worsen, new symptoms develop, not improving within 2 weeks, or infection returns within a few weeks after medication.",meds:["Topical antifungal"]});

P("J-8","j","Tinea Versicolor (Scaling, Depigmented Spots on Chest, Back, Upper Arms)",{pg:126,
 ddx:["Seborrheic dermatitis","Tinea corporis","Vitiligo","Secondary syphilis"],
 rf:["None"],act:"None",
 flow:[
  DP(["Failed treatment","Widespread"],{d:"PN",a:"Perform KOH examination"}),
  DP(["Recurrent","Unidentified","Atypical presentation"],{d:"AEM"})
 ],
 tx:["Topical antifungal medication twice a day for 1 week.","Hypo/hyper-pigmented areas can remain for months after effective treatment.","If atypical: screen per the identified lesion; if unable to identify, refer to AEM."],
 rtc:"Return for worsening symptoms, new symptoms, or presence of scale in the lesions after treatment.",meds:["Topical antifungal"]});

/* ===== J. DERMATOLOGICAL (J-9 .. J-18) ===== */
P("J-9","j","Boils / Abscess",{pg:128,
 ddx:["Abscess","Furuncle / carbuncle","Cellulitis","Folliculitis","Hidradenitis"],
 rf:["Location over tailbone","SIRS","Worsening on antibiotics","Palm of hand","Over a joint","Black eschar"],
 act:"Keep area clean and dry.",
 flow:[
  DP(["Fever","Rapid progression","Cellulitis","Indwelling medical device"],{d:"PN",a:"Prepare informed consent, timeout and I&D set-up if provider requests."}),
  DP(["Fluctuant mass","Multiple abscesses","Drained abscess >5 cm"],{d:"AEM"})
 ],
 tx:["Warm moist compress 20 minutes every 4 hours."],
 rtc:"Return if fever/chills, re-accumulation, red streaks, increased swelling, or not improving in 3 days.",meds:[]});

P("J-10","j","Fever Blister / Cold Sore",{pg:130,
 ddx:["Herpes labialis","Impetigo","Aphthous ulcer","Herpes simplex keratitis"],
 rf:["Eye pain"],act:"None",
 flow:[
  DP(["Burns","Eczema","Fever","Severe pain"],{d:"PN"}),
  DP(["Sore throat","Sore on the hand","Pustule with yellow crusting"],{d:"AEM"})
 ],
 tx:["Counsel on contagion (avoid kissing / sharing utensils, wash hands).","1st line: docosanol cream 5 times daily.","2nd line: valacyclovir per provider order."],
 rtc:"Return if not resolved in 10 days.",meds:["Docosanol","Valacyclovir"]});

P("J-11","j","Abrasion / Laceration",{pg:132,
 ddx:["Abrasion","Laceration","Puncture wound","Bite wound"],
 rf:["SIRS","Animal bite / scratch"],act:"Keep area clean and dry.",
 flow:[
  DP(["Fever","Red streaks","Oozing fluid","Tetanus risk","High-risk wound"],{d:"PN"}),
  DP(["Erythema >1 inch","Increased warmth","Increased tenderness","Laceration"],{d:"AEM"})
 ],
 tx:["Wash with soap and water; irrigate.","Apply antibiotic ointment and sterile dressing.","Provide wound-care materials and teach dressing changes."],
 rtc:"Return if signs of infection or not healing.",meds:["Antibiotic ointment"]});

P("J-12","j","Suture Removal",{pg:134,
 ddx:["Routine suture removal"],
 rf:["Fever","Pus / redness / swelling at the site"],act:"None",
 flow:[
  DP(["Fever","Pus, redness or swelling at the site"],{d:"PN"}),
  DP(["Incomplete wound closure"],{d:"AEM"}),
  EX("Remove sutures (the same number as were placed).",[])
 ],
 tx:["Bacitracin to the scar.","Sun protection / sunscreen for 3 months."],
 rtc:"Return if wound opens or shows signs of infection.",meds:["Bacitracin"]});

P("J-13","j","Drug Rash / Contact Dermatitis",{pg:136,
 ddx:["Hives (urticaria)","Irritant contact dermatitis","Allergic contact dermatitis","Drug eruption"],
 rf:["Airway swelling","Wheezing","Anaphylaxis"],
 act:"Avoid the agent; latex-free gloves or moisturizing soap.",
 flow:[
  DP(["Blistering","Oral involvement","Petechiae","Fever"],{d:"PN",a:"Emergency stabilization if needed: O2, IV fluids, airway, epinephrine auto-injector."}),
  DP(["No new medication within 2 weeks","Itchy rash with other symptoms"],{d:"AEM"})
 ],
 tx:["Hives: avoid the agent, discuss with AEM, diphenhydramine (Benadryl) TID x3 days.","Irritant contact dermatitis: avoidance, moisturizer / Cetaphil, hydrocortisone ointment TID 1–2 weeks.","Allergic contact dermatitis: avoidance, hydrocortisone TID 1–2 weeks, Burow's solution compresses q4h x30 min."],
 rtc:"Return if worsening, new symptoms, or not improving.",meds:["Diphenhydramine","Hydrocortisone","Burow's solution"]});

P("J-14","j","Burns / Sunburn",{pg:138,
 ddx:["Sunburn","1st-degree burn","2nd-degree burn","Chemical / thermal burn"],
 rf:["Trouble breathing","Altered mental status / drowsy","High-risk location","Circumferential burn"],
 act:"Keep clean; avoid additional heat exposure.",
 flow:[
  DP(["Deep 2nd/3rd-degree burn",">10% of body","Trauma","Severe pain"],{d:"PN",a:"Emergency resuscitation before transport."}),
  DP(["Second-degree burn","Secondary infection","Sunburn >25% of body","Exhaustion","Unable to perform duties"],{d:"AEM"})
 ],
 tx:["Cool compresses.","Ibuprofen or acetaminophen for pain.","Keep clean and uncovered.","Aloe vera."],
 rtc:"Return if worsening, new symptoms, or not improving within 3 days.",meds:["Ibuprofen","Acetaminophen","Aloe vera"]});

P("J-15","j","Friction Blisters",{pg:140,
 ddx:["Friction blister","Contact dermatitis","SJS/TEN (rare)"],
 rf:["Fever / malaise","Epidermal sloughing"],
 act:"No running, rucking or jumping; walk at own pace.",
 flow:[
  DP(["Flu-like symptoms","Painful erythematous macules","Exposure to new medications"],{d:"PN"}),
  DP(["Large open blister","Erythema or other signs of infection"],{d:"AEM"})
 ],
 tx:["Wash with betadine and apply antibacterial ointment to the blister only.","Moleskin dressing (tincture of benzoin optional).","Two pairs of socks: thin non-cotton pair under boot socks.","Re-evaluate every 24 hours."],
 rtc:"Return if dressing comes off, blisters make wearing boots impossible, pain is disabling, or signs of infection.",meds:["Antibacterial ointment","Moleskin"]});

P("J-16","j","Corns on Feet",{pg:142,
 ddx:["Corn (heloma)","Callus","Plantar wart","Bunion","Hammer / mallet toe"],
 rf:["None"],act:"None",
 flow:[
  EX("Perform foot exam first.",[]),
  DP(["Diabetes mellitus","Decreased peripheral sensation to light touch","Lesion freely bleeds with paring"],{d:"PN"}),
  DP(["Plantar wart","Interferes with normal duty","Bunion","Mallet / hammer toe","Decreased toe motion"],{d:"AEM"})
 ],
 tx:["Foot care and properly fitting footwear; padding / paring per local MCP."],
 rtc:"Return if worsening, new symptoms, or not controlled with MCP.",meds:[]});

P("J-17","j","Cutaneous Warts",{pg:144,
 ddx:["Common wart","Plantar wart","Flat wart"],
 rf:["None"],act:"None",
 flow:[
  DP(["Bleeding","Sensitive area",">10 warts","Upcoming mission limiting treatment","Signs of infection / inflammation","Treatment >12 weeks"],{d:"PN"}),
  DP([">3 warts","Treatment >4 weeks","Medic not trained","Complication from treatment"],{d:"AEM"})
 ],
 tx:["Get AEM approval first.","Consent and timeout.","Cryotherapy: 2 freeze-thaw cycles (30–60 s) and/or salicylic acid."],
 rtc:"Return in 2 weeks.",meds:["Salicylic acid"]});

P("J-18","j","Ingrown Toenail",{pg:146,
 ddx:["Ingrown toenail","Paronychia","Cellulitis"],
 rf:["Red streaks up the foot","Gangrene","Black eschar"],
 act:"No running or rucking; walk at own pace.",
 flow:[
  DP(["Cellulitis","Immunocompromised","Diabetic","Severe infection","Recurrent ingrown nail","Severe pain / limping"],{d:"PN"}),
  DP(["Moderate infection","Limitations to duty"],{d:"AEM"})
 ],
 tx:["Proper nail trimming and shoes.","Soak 15 minutes TID.","Cotton or dental floss under the nail edge.","Hydrocortisone 1%.","Duty limitations up to 3 days."],
 rtc:"Return if worse or not improved after 1 week.",meds:["Hydrocortisone 1%"]});

/* ===== K. ENVIRONMENTAL (K-1 .. K-7) ===== */
P("K-1","k","Heat Injury / Hyperthermia (Cramps, Exhaustion, Heatstroke)",{pg:148,
 ddx:["Heatstroke","Heat cramps","Heat exhaustion","Fever / infection","Dehydration","Hyperthyroidism"],
 rf:["Altered mental status","Abnormal vital signs"],
 act:"No significant exercise x 48 hours; limit exposure to hot environments.",
 flow:[
  DP(["Confused, delirious or unresponsive","Skin dry","Temperature >103°F"],{d:"PN",a:"1) Ice sheets / douse with water. 2) Start IV as ordered by provider. 3) Monitor rectal temperature. 4) Transport to emergency treatment area."}),
  DP(["Sweating profusely with headache, weakness, dizziness and/or nausea","Painful cramps of extremities/abdominal muscles with normal body temperature"],{d:"AEM"})
 ],
 tx:["COOL: place the Soldier in a cool or shaded place.","HYDRATE: at least 1 liter of cool water in the first 30 minutes, then at least 1 liter per hour for the next 2 hours. Advise decreased activity for the next 24 hours.","REASSESS: if symptoms do not begin to resolve within 30 minutes, get worse, or temperature exceeds 101°F, refer to the privileged provider."],
 rtc:"Refer to provider if no improvement in 30 min, worsening, or temp >101°F.",meds:[]});

P("K-2","k","Hypothermia",{pg:150,
 ddx:["Environmental exposure","Exhaustion / malnutrition","Hypothyroidism","Sepsis"],
 rf:["T <96°F","Altered mental status","Abnormal vital signs","Frostbite","Trauma"],
 act:"Limit exposure to cold environments.",
 flow:[
  DP(["Red flags","Neurologic symptoms","Infection"],{d:"PN",a:"Take rectal temp. Support ABCs, IVs, transport horizontal on stretcher, start warming."}),
  DP(["History of psych meds or narcotics","History of alcohol abuse","Severe pain"],{d:"AEM"}),
  DP(["Immersion foot"],{tri:["K-3"]})
 ],
 tx:["Cold without criteria for hypothermia: move to a warm area, remove wet clothes, rewarm through body heat and space/hypothermia blanket. Monitor closely and elevate care if not improving within 30 minutes.","Do not place numb area by heat source (risk of burns)."],
 rtc:"Elevate care if not improving within 30 minutes.",meds:[],
 note:"Hypothermia levels: mild T 90–95°F (shivering, tachycardia); moderate 82–90°F (lethargy, bradycardia); severe <82°F (coma, may appear dead — resuscitation still possible). Transport horizontally; low exertion of peripheral muscles."});

P("K-3","k","Immersion Foot (Non-Freezing Cold Injury)",{pg:152,
 ddx:["Non-freezing cold injury","Cold urticaria","Raynaud phenomenon","Frostbite"],
 rf:["Gangrene / necrosis","Hemorrhagic blisters","Hypothermia","Frostbite","Trauma"],
 act:"Limit activities for 3 days; elevate affected extremity x 3 days.",
 flow:[
  DP(["Red flags","Severe pain","Signs of infection"],{d:"PN",a:"Remove wet clothes; rewarm the Soldier if hypothermic."}),
  DP(["Unable to perform duties","Symptoms >1 week","Pain not controlled"],{d:"AEM"})
 ],
 tx:["Rest, elevate and air-dry the affected extremity at room temperature. Limit activities for 3 days. Do NOT rub; do NOT rewarm the extremity unless frostbite is also present.","Rehydrate with warm IV fluids; tetanus prophylaxis (AEM approval required).","Toradol for moderate pain; ibuprofen for minor pain; amitriptyline at night as needed (provider prescription required).","A fan to cool the extremity can help pain."],
 rtc:"Return if worsening, signs of infection, new symptoms, or not improving after 1 week.",meds:["Ibuprofen"]});

P("K-4","k","Chapped Skin / Windburn",{pg:154,
 ddx:["Chapping / windburn","Cold injury","Skin infection"],
 rf:["None listed"],act:"None",
 flow:[
  DP(["Diffuse symptoms","Not exposed to dry wind","Signs of infection"],{d:"AEM"})
 ],
 tx:["Cover affected skin area so it is no longer exposed to drying wind.","Apply moisturizing lotion (oil-based cream or ointment) to affected area.","Petroleum jelly or lip balm to the lips if needed."],
 rtc:"Return if worsening, signs of infection, or new symptoms.",meds:["Moisturizing lotion","Petroleum jelly / lip balm"],
 note:"Numbness can be a sign of cold injury."});

P("K-5","k","Frostbite",{pg:155,
 ddx:["Frostbite","Hypothermia","Trench / immersion foot"],
 rf:["Cold, numb, clumsy area","White / grayish-yellow, hard or waxy skin","Hypothermia"],act:"None",
 flow:[
  DP(["White or grayish-yellow color","Hard or waxy to touch","Blisters or cyanosis after rewarming","Hypothermia"],{d:"PN",a:"Pad or splint area; move to warm area; remove wet clothing; rewarm with body heat / space blanket; do NOT rub or place near heat source; do not rewarm if chance of refreezing; tetanus prophylaxis."}),
  DP(["Trench foot suspected"],{tri:["K-3"]})
 ],
 tx:["Pad or splint the affected area. Avoid walking/standing on frostbitten feet; if walking required for evacuation, do not rewarm prior to walking.","Move Soldier to warm area; remove wet clothing.","Do not rewarm if possibility of refreezing. Rewarm by placing area in warm water or using body heat and space blanket. Do not place near heat source or rub."],
 rtc:"",meds:[]});

P("K-6","k","Crabs / Lice (Pediculosis)",{pg:156,
 ddx:["Lice","Scabies","Contact dermatitis","Fungal infection","Hair casts"],
 rf:["None"],act:"None",
 flow:[
  DP(["Secondary infection","No nits or lice seen"],{d:"AEM"})
 ],
 tx:["Launder clothes and bed linens in hot water (>149°F), or dry clean; if unable, seal in a bag for 2 weeks.","Body lice: permethrin 5% cream to body (in addition to laundering).","Head lice: wash hair without conditioner, towel dry, apply permethrin cream, leave 10 min, rinse with warm water; remove nits with close-toothed comb; repeat in 1 week if nits/lice persist.","Pubic lice: screen for other STIs; treat sexual partners at the same time; permethrin cream to cool dry areas (groin, buttocks, upper thighs, trunk, axillae) 10 min, rinse with warm water; follow-up in 10 days."],
 rtc:"Follow-up in 10 days for repeat evaluation (40% not cleared with one treatment).",meds:["Permethrin 1% cream","Permethrin 5% cream"]});

P("K-7","k","Insect Bites (not crabs/lice)",{pg:158,
 ddx:["Insect bite","Skin infection","Contact dermatitis"],
 rf:["Swelling of lips or tongue","Trouble breathing / wheezing","Abnormal vital signs"],act:"None",
 flow:[
  DP(["Wheezing, shortness of breath","Hives or history of allergy / severe reaction","Poisonous insect (brown recluse, black widow, etc.)"],{d:"PN",a:"Epinephrine pen if indicated."}),
  DP(["No signs of bite","Blister, ulcer or moderate-severe pain"],{d:"AEM"})
 ],
 tx:["Remove any stinger, tick head or other biting apparatus; clean site with betadine solution.","Calamine lotion or hydrocortisone 1% cream every 6 hours as needed for itching.","Cold compress / ice pack for swelling.","Document any history of tick bite and bite location."],
 rtc:"Return if symptoms worsen, new symptoms develop, or not improving within 48 hours.",meds:["Calamine lotion","Hydrocortisone 1%"]});

/* ===== L. MISCELLANEOUS (L-1 .. L-5) ===== */
P("L-1","l","Exposed to Hepatitis B / C or HIV",{pg:160,
 ddx:["Low-risk exposure","High-risk exposure"],
 rf:["Known infection (source)","High-risk contact"],act:"None",
 flow:[
  DP(["Red flags","High-risk exposure","Exposure with HIV","Exposure in a lab"],{d:"PN",a:"Wound care; document the exposure."}),
  DP([">7 days from exposure","No-risk exposure"],{d:"AEM"})
 ],
 tx:["Wash wound with soap and water, or flush mucous membranes with saline/water. Clean with alcohol-based hand hygiene agent.","Document: source person and Soldier risk factors, serologic tests (HIV, Hep B, Hep C), type of exposure (hollow-bore needle, scalpel), time of incident, body fluid, body location/depth, contact time. If source is known infected: most recent viral load and treatment/drug resistance.","HIV PEP should be started within 2 h, no later than 72 h. Hep B immunoglobulin within 24 h, no later than 1 week."],
 rtc:"",meds:[],
 note:"Use where no local policy exists. Intact skin is a barrier; cuts, abrasions, dermatitis are NOT intact skin. Feces, nasal secretions, saliva, sputum, sweat, tears, urine are not infectious unless blood is present. Document HCP info (HepB immunization dates, titer, prior HBV/HCV testing, tetanus status, meds, conditions) and exposure details before the patient leaves."});

P("L-2","l","Dental Problems",{pg:162,
 ddx:["Tooth cavity","Poor dental hygiene","Temporomandibular joint pain","Infection","Heart attack"],
 rf:["Exposed pulp","Avulsed tooth","Severe pain","Trauma","Chest pain / SOB"],act:"None",
 flow:[
  DP(["Red flags","Loose tooth","Abscess / infection","Gingivitis, periodontitis"],{d:"PN",a:"Dentist or Provider Now."}),
  DP(["Broken tooth (pulp not showing)","Issue not listed above","Jaw pain not from trauma"],{d:"AEM",a:"Dentist or AEM Now."})
 ],
 tx:["Furry tongue: brush tongue with toothpaste and soft toothbrush 3 times per day.","White plaque (leukoplakia): counsel on surveillance during yearly dental exams; if indurated area, refer to dentist now.","Bad breath: screen for causes; refer to provider/dentist if indicated; otherwise counsel on oral hygiene (brush 3x/day, floss daily)."],
 rtc:"Return if not improving within 1 week or new symptoms develop.",meds:[],
 note:"Dental pain may be non-dental (myofascial, migraine, maxillary sinusitis, ear, TMJ, nerve pain). Jaw pain with SOB, sweating, lightheadedness or chest pain = cardiac until proven otherwise."});

P("L-3","l","Sores in the Mouth",{pg:164,
 ddx:["Aphthous ulcers","Herpes simplex virus","Hand, foot and mouth disease","Stevens-Johnson syndrome"],
 rf:["Diffuse lesions","Bloody diarrhea"],act:"None",
 flow:[
  DP(["Red flags","Painless lesion","Also located in groin","History of bloody diarrhea","Diffuse rash","Present >2 weeks"],{d:"PN",a:"Oral exam."}),
  DP(["Cluster of ulcers","Ulcer >5 mm"],{d:"AEM"})
 ],
 tx:["Aphthous ulcer: apply ¼ inch of triamcinolone acetate oral paste to the ulcer at bedtime; resolves in 10–14 days.","Hand, foot and mouth disease: acetaminophen (or Toradol) every 6 h for fever, ibuprofen every 6 h for malaise, lozenges or lidocaine gargle for sore throat; salt-water gargles."],
 rtc:"Return if worsening, new symptoms, not controlled with MCP, or not resolved within 2 weeks.",meds:["Triamcinolone oral paste","Acetaminophen","Ibuprofen"]});

P("L-4","l","Prescription Refill",{pg:166,
 ddx:["Refill request"],rf:["None"],act:"None",
 flow:[
  DP(["Narcotic or psychiatric medication","Sleeping medication","Birth control","Chronic medication"],{d:"APPT",a:"Place secure message or T-Con for provider."}),
  DP(["Acute condition that failed initial treatment","Prescription medication"],{d:"AEM",a:"Refer to AEM."})
 ],
 tx:["Provide acute OTC medication. Re-provide acute medication only if the Soldier lost the original; review the medical record for how long the medication is supposed to continue."],
 rtc:"",meds:[],
 note:"Birth control refills are screened under I-6. A request for additional acute medication means the illness is not responding: re-screen by complaint."});

P("L-5","l","Requests a Vasectomy",{pg:167,
 ddx:["Request for permanent contraception"],rf:["None"],act:"None",
 flow:[
  DP(["Not in a stable relationship","No children","Under 30 years old","PCC performs vasectomies"],{d:"APPT",a:"Provide counseling; schedule appointment with PCC."})
 ],
 tx:["Counsel before scheduling: contraception options, brief procedure overview, permanence (reversal ~50% effective). Not effective until lack of sperm is confirmed by lab test around 3 months; use alternate birth control until then. Pregnancy still occurs in ~2%. Condoms needed for STI protection. Rest 2–4 days with scrotal support and ice; about 2 weeks before full duty.","If none of the above apply: message provider (secure message, T-Con) or follow local policy."],
 rtc:"",meds:[]});

/* ===== L-6 .. L-12, M-1, M-2 ===== */
P("L-6","l","Needs an Immunization",{pg:168,
 ddx:["Routine / required immunization"],rf:["None"],act:"None",
 flow:[
  DP(["Rabies","Immunization not required","Requested early","Contraindication for immunization","Medic not trained"],{d:"AEM",a:"Provide counseling. Rabies → Provider Now."})
 ],
 tx:["If the clinic does not have the immunization, refer to the appropriate location (readiness clinic, immunization clinic).","Obtain approval from the AEM. Counsel the patient; confirm no contraindications.","Provide the vaccine per package insert. Document in the required databases or per local policy."],
 rtc:"Return if redness/infection at site, rash, anaphylaxis, seizure, fever or any other serious symptom after the vaccine.",meds:[],
 note:"Contraindications needing evaluation: severe reaction to a vaccine, eggs/egg protein, neomycin or streptomycin; immunocompromised, around an immunocompromised person, or pregnant."});

P("L-7","l","Lymph Node Enlargement",{pg:169,
 ddx:["Reactive node (infection / inflammation)","Systemic illness","Malignancy"],
 rf:["Any red flag"],act:"None",
 flow:[
  DP(["Multiple body areas","Unexplained weight loss","Supraclavicular","Posterior cervical","Not mobile","Not soft (hard / rubbery)","No recent infection (within 2 weeks)"],{d:"PN",a:"Perform lymph node exam."}),
  DP(["Infection / inflammation symptoms present"],{tri:["ADTMC protocol for the infection symptoms"]})
 ],
 tx:["Screen according to the infection or inflammation symptoms."],
 rtc:"",meds:[]});

P("L-8","l","Blood Pressure Check",{pg:170,
 ddx:["Hypertension","Hypotension","Orthostatic hypotension"],
 rf:["BP >180/120 (severe / urgency)"],act:"None",
 flow:[
  DP(["BP greater than 150/90 (recheck after 5 min; still >150/90)","Systolic <90","Difference >15 mmHg between arms"],{d:"PN",a:"Lay in a dark, quiet room if BP elevated."}),
  DP(["Last day of the 5-day BP check","Orthostatic hypotension (SBP drop ≥20, DBP drop ≥10 or HR rise ≥20 with standing)"],{d:"AEM",a:"Start IV fluids if orthostatic."})
 ],
 tx:["If not the last BP check, remind the Soldier to return for the next check."],
 rtc:"Return for next scheduled BP check.",meds:[],
 note:"BP >180/120 is hypertensive urgency: lay down in dark quiet room while awaiting transport/provider."});

P("L-9","l","Medical Screening for Overseas PCS",{pg:171,
 ddx:["Overseas PCS screening"],rf:["None"],act:"None",
 flow:[
  DP(["MEDPROS RED"],{d:"APPT",a:"Record review. Schedule appointment or refer for service; instruct on how to correct readiness deficiencies."}),
  DP(["Non-deployable profile","Behavioral health appointment","Specialty care appointment","Pregnant / postpartum"],{d:"APPT",a:"Schedule appointment (referral to provider before form is signed)."})
 ],
 tx:["If no deficiencies: fill out the form on paper; provider reviews and signs. Instruct Soldier to wait or return at a later time per provider availability / local policy."],
 rtc:"",meds:[],
 note:"Record review: behavioral health appts, specialty care appts, e-profile, deployment health assessments, pregnancy status, MEDPROS (hearing, dental, immunizations, HIV, vision, PHA)."});

P("L-10","l","Weight Reduction",{pg:172,
 ddx:["Obesity","Hypothyroidism","Sleep apnea","PCOS","Depression"],rf:["None"],act:"None",
 flow:[
  DP(["Enrolled in Army Body Composition Program","BMI >30 and not muscular build","Struggling with weight >6 months","History of failing","Height/weight/tape"],{d:"APPT",a:"Screening labs (TSH, lipids, fasting glucose, LFTs), IBHC referral, dietitian referral. Schedule provider appointment."}),
  DP(["New issue","BMI ≥25","Recent profile"],{d:"SP",a:"Wellness Center or Dietitian referral."})
 ],
 tx:["Provide information on community resources: Wellness Center, dietitian, athletic trainer, strength & conditioning coach; offer Integrated Behavioral Health referral."],
 rtc:"",meds:[]});

P("L-11","l","Complaint Not on the List",{pg:173,
 ddx:["Undifferentiated complaint"],
 rf:["Appears sick / unstable (pale, sweaty, dazed)","Altered mental status","Uncomfortable (cannot stop moving)","Abnormal vital signs","Pain ≥5"],act:"None",
 flow:[
  DP(["Appears sick, AMS, uncomfortable","HR >100, RR >20","BP >150/90","Moderate–severe pain"],{d:"PN"}),
  DP(["Complaint does not apply to another algorithm on the list"],{d:"AEM"}),
  EX("If the complaint is another way of saying a listed complaint, screen with that protocol.",[])
 ],
 tx:[],rtc:"",meds:[]});

P("L-12","l","Request for Nonprescription or Traveling Medications",{pg:174,
 ddx:["OTC request","Travel medication request"],rf:["None"],act:"None",
 flow:[
  DP(["Current symptoms are present"],{tri:["Screen the symptoms with the matching protocol; discuss with AEM"]}),
  DP(["Traveling on TDY to a location without easy access to medical care"],{d:"APPT",a:"Local SOP or discuss with provider; provide travel-pack medications only as authorized."})
 ],
 tx:["Screen first: OTCs can be dangerous if not used properly.","Travel pack examples: ibuprofen (pain), diphenhydramine (allergy), pseudoephedrine (congestion), loperamide and ciprofloxacin (diarrhea), doxycycline (malaria prophylaxis). The supervising privileged provider MUST approve all travel medications."],
 rtc:"",meds:["Ibuprofen","Diphenhydramine","Pseudoephedrine","Loperamide","Ciprofloxacin","Doxycycline"]});

P("M-1","m","No Signs of Improvement (Not Getting Better)",{pg:175,
 ddx:["Treatment failure","Wrong diagnosis"],rf:["Worsening on treatment"],act:"None",
 flow:[
  DP(["Worsening on treatment","Previously saw Provider or AEM"],{d:"PN",a:"Rescreen algorithm."}),
  DP(["Previously screened as Self-Care or AEM"],{d:"AEM"})
 ],
 tx:[],rtc:"",meds:[],
 note:"Do NOT screen to a minor-care protocol. Do not screen below AEM for the same issue previously treated with MCP. Soldier may elevate to Provider Now if uncomfortable seeing an AEM."});

P("M-2","m","Return Requested by Provider",{pg:176,
 ddx:["Scheduled follow-up"],rf:["Screening dispositions as Provider Now"],act:"None",
 flow:[
  DP(["Screening dispositioned as Provider Now","Condition worsening","Not improving"],{d:"PN",a:"Rescreen if acutely ill."}),
  DP(["Previously seen by Provider or Specialty Clinic requesting follow-up"],{d:"APPT",a:"Discuss with AEM; schedule appointment (original provider if possible)."})
 ],
 tx:["Write the previous level of care and the name of the privileged provider on the screening note. Explain to the Soldier when the follow-up will be."],
 rtc:"",meds:[]});
