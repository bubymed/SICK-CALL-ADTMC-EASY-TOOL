/* Shaving profile — Pseudofolliculitis Barbae (PFB) phased plan, from the clinic guidance (TB MED 287, Army Directive 2025-13).
   Perfil de afeitar — plan por fases para PFB, según la guía de la clínica.
   The medic recommends; the provider/AEM decides and writes the e-Profile (ADTMC J-3: "Requesting profile" → AEM). */
const PFB={
 m:{n:'Mild',es:'Leve',ph:'Phase I',days:'30 days',dx:'few papules, minimal irritation, no pustules',
  dxes:'pocos granitos, poca irritación, sin pus',
  plan:['Shave every 2–3 days with proper pre- and post-shave technique: warm water + mild soap, rough washcloth, pre-shave lotion, shave in the direction of hair growth, aloe-based aftershave.',
   'Daily medicated/hydrating aftershave lotion with anti-inflammatory properties (e.g. aloe vera, vitamin E).',
   'Do not stretch the skin or shave over the same area more than once.',
   'Weekend breaks from shaving when the mission allows.',
   'No plucking or pulling hairs.',
   'Alpha-hydroxy acid lotion on non-shave mornings to reduce hyperkeratosis (if tolerated).'],
  sh:'Every 2–3 days; resume daily shaving once the condition improves.',auth:'Every 2–3 days'},
 mo:{n:'Moderate',es:'Moderado',ph:'Phase II',days:'60 days',dx:'scattered papules, hyperpigmentation, no pustules',
  dxes:'granitos dispersos, manchas oscuras, sin pus',
  plan:['Shave every 2–3 days with the proper technique (as in Mild).',
   'Medicated topicals per dermatologic guidance (provider Rx):',
   '• AM: Clindamycin 1% lotion after the post-shave steps.',
   '• PM, every other night: Tretinoin 0.025% cream, pea-sized amount to the beard area.',
   '• PRN: Hydrocortisone 1% cream for inflammation, no more than 3 days/week.',
   'If no response after 4 weeks: option to trial a chemical depilatory (calcium thioglycolate).'],
  sh:'Every 2–3 days until improvement, then increase to daily shaving as tolerated.',auth:'Every 2–3 days'},
 s:{n:'Severe',es:'Severo',ph:'Phase II–III',days:'up to 90 days total (Phase II + III)',dx:'numerous papules, pustules, denuded areas',
  dxes:'muchos granitos, granitos con pus, áreas en carne viva',
  plan:['Suspend shaving during treatment: beard max 1/4 inch, neatly trimmed with electric clippers, no styling.',
   'Let the beard grow to release ingrown hairs; manually dislodge visible hair loops without breaking the skin.',
   'AM: Benzoyl peroxide 5% gel to affected areas; let dry 5–10 min before moisturizer (provider Rx).',
   'PRN: Hydrocortisone 1% cream for inflammation, no more than 3 days/week.',
   'Move to the Moderate plan once the lesions resolve.'],
  sh:'No shaving until cleared by the provider; then every 2–3 days during the transition phase.',auth:'No shaving, 1/4 inch max beard length, neatly trimmed with electric clippers'}
};
const PFB_RF=['Facial cellulitis (spreading redness, swelling, fever)','Abscess needing drainage on face or neck','Signs of scarring','Needs limits on protective equipment (mask seal)'];
function pfbProfile(k){const x=PFB[k];if(!x)return'';
 return 'Instructions to Commanders: Soldier is undergoing medical treatment for pseudofolliculitis barbae ('+x.n+'). Soldier is to follow prescribed shaving technique and treatment plan as detailed in TB MED 287 and Army Directive 2025-13.\n'
  +'Shaving authorization: '+x.auth+(k==='s'?'; return to shaving every 2–3 days when cleared by provider.':'; return to daily shaving when cleared.')+'\n'
  +'Treatment plan: Soldier is using prescribed topical regimen and proper shaving technique to reduce recurrence. Periodic re-evaluation is required at the end of the treatment phase.\n'
  +'Profile duration: '+x.ph+' – '+x.days+'.';}
function pfbNote(k){const x=PFB[k];if(!x)return'';return 'PFB '+x.n.toLowerCase()+' ('+x.dx+'). Requests shaving profile — recommend '+x.ph+' ('+x.days+') per clinic PFB guidance; shaving: '+x.sh+' For provider/AEM review and e-Profile.';}
