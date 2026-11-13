/* Operator's manual (docs/manual/*.pdf) — chapter list with the PDF page where each starts.
   Generated with the manual build; keep pages in sync when the PDF is rebuilt.
   Manual del operador — lista de capítulos con la página del PDF donde empieza cada uno. */
const MANUAL={ver:'v37',
 pdf:{en:'docs/manual/Sick-Call-Manual-EN.pdf',es:'docs/manual/Sick-Call-Manual-ES.pdf'},
 ch:[
  ['1','Introduction','Introducción',4],
  ['2','Installation and first start','Instalación y primer inicio',6],
  ['3','Medic, approver and guest access','Acceso de médicos, aprobadores e invitados',9,10],
  ['4','Screen tour','Recorrido por la pantalla',14,15],
  ['5','Seeing a patient: Protocols tab','Atender a un paciente: pestaña Protocolos',15,16],
  ['6','The note and forms','La nota y los formularios',20,21],
  ['7','Saved patients','Pacientes guardados',23,24],
  ['8','Soldier QR check-in and triage list','Registro con QR del soldado y lista de triaje',24,25],
  ['9','Meds tab','Pestaña Meds',28,29],
  ['10','MACE tab (MACE 2)','Pestaña MACE (MACE 2)',30,31],
  ['11','More: references, profiles and settings','Más: referencias, profiles y ajustes',32,33],
  ['12','Privacy and security','Privacidad y seguridad',37,38],
  ['13','Troubleshooting','Solución de problemas',38,39],
  ['14','Glossary','Glosario',39,40],
  ['15','Under the hood: code and architecture','Bajo el capó: código y arquitectura',41,42],
  ['A','ADTMC protocol list','Lista de protocolos ADTMC',45,46],
  ['B','Version history','Historial de versiones',49,50],
  ['C','Credits, license and contact','Créditos, licencia y contacto',50,52]],
 // which chapter explains the screen you came from / qué capítulo explica la pantalla de donde vienes
 ctx:{gate:'2',adtmc:'5',tpl:'5',admeds:'9',mace:'10',guardados:'7',queue:'8',clinic:'11',access:'3',preguntas:'11',assess:'11',perfiles:'11',ajustes:'11',more:'4'}
};
