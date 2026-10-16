/* "What's new" popup — shown once per version to medics who open the app after an update.
   Ventana "Novedades" — se muestra una vez por versión a los médicos que abren la app después de una actualización.
   Add a new entry at the TOP for every feature release (same value as APP_VER). Keep it short: 1–3 items.
   go: optional button target — a tab/view name ('admeds', 'perfiles', 'more') or 'proto:J-3'. */
const WHATSNEW=[
 {v:'v26',items:[
   {i:'👤',en:'<b>Cleaner start screen + guest mode</b> — anyone can "Continue as a guest" with reference tools only (Meds, MACE, Assessments). Protocols, profiles and notes stay for approved medics.',es:'<b>Pantalla de inicio más limpia + modo invitado</b> — cualquiera puede "Continuar como invitado" solo con referencias (Meds, MACE, Assessments). Los protocolos, perfiles y notas siguen siendo para médicos aprobados.'},
   {i:'🧠',en:'<b>Cleaner MACE 2</b> — live result at the top and folded sections (screening, cognitive, neuro, PRA); NSI on one line per symptom.',es:'<b>MACE 2 más limpio</b> — resultado en vivo arriba y secciones plegadas (tamizaje, cognitivo, neuro, PRA); NSI en una línea por síntoma.',go:'mace',btn:['Open MACE','Abrir MACE']}]},
 {v:'v25',items:[
   {i:'🆕',en:'<b>What\'s new window</b> — after each update you\'ll see this card with the new features.',es:'<b>Ventana de novedades</b> — después de cada actualización verás esta tarjeta con lo nuevo.'}]},
 {v:'v24',items:[
   {i:'🪒',en:'<b>Shaving profile (PFB)</b> — on ADTMC J-3 and More → Profiles: pick Mild / Moderate / Severe and get the phase, plan and e-Profile wording to copy. Soldiers can also check in for it on the QR questionnaire.',es:'<b>Perfil de afeitar (PFB)</b> — en ADTMC J-3 y Más → Perfiles: escoge Leve / Moderado / Severo y te da la fase, el plan y el texto para el e-Profile. Los soldados también lo pueden marcar en el cuestionario QR.',go:'proto:J-3',btn:['Open J-3','Abrir J-3']}]},
 {v:'v23',items:[
   {i:'ⓘ',en:'<b>"What is it for" on every med</b> — tap ⓘ next to a med: what it does, what it\'s best for and when to pick another.',es:'<b>"Para qué sirve" en cada medicamento</b> — toca ⓘ junto al med: qué hace, para qué es mejor y cuándo escoger otro.',go:'admeds',btn:['Open Meds','Abrir Meds']}]},
 {v:'v22',items:[
   {i:'💊',en:'<b>Meds by groups</b> — the Meds tab is organized by use with an All / OTC / Rx filter, plus the clinic <b>Pharmacy Self-Care OTC list</b> (Aug 2025).',es:'<b>Meds por grupos</b> — la pestaña Meds está organizada por uso con filtro Todos / OTC / Rx, y la <b>lista Self-Care OTC de farmacia</b> (ago 2025).',go:'admeds',btn:['Open Meds','Abrir Meds']}]},
 {v:'v21',items:[
   {i:'📲',en:'<b>Install button</b> — add the app to your Home Screen from the button at the top (Android and iPhone).',es:'<b>Botón Instalar</b> — agrega la app a tu pantalla de inicio con el botón de arriba (Android y iPhone).'}]}
];
