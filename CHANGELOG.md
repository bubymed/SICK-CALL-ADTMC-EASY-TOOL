# Changelog / Registro de cambios

Bilingual summary of everything added or fixed, newest first. PR numbers refer to this repository.
Resumen bilingüe de todo lo agregado o corregido, lo más nuevo primero. Los números de PR son de este repositorio.

## Unreleased / Próximo
- **AEM availability setting (Settings):** if your unit has no AEM, "AEM Now" says to send the Soldier to the clinic (supervising provider, ADTMC Category II); if it does, it names your AEM. Default: no AEM.
  **Ajuste de AEM disponible (Ajustes):** si tu unidad no tiene AEM, "AEM Now" indica mandar al Soldado a la clínica (proveedor supervisor, ADTMC Categoría II); si lo tiene, muestra el nombre de tu AEM. Predeterminado: sin AEM.
- **DD 689:** blocks 10–11 are real checkboxes; finger-drawn signature + printed name for block 13 (not saved); fixed the dark/clipped print preview on iPhone (#26).
  **DD 689:** los bloques 10–11 son casillas reales; firma con el dedo y nombre impreso en el bloque 13 (no se guarda); se arregló la vista previa de impresión oscura/cortada en iPhone (#26).

## Update tools & layout / Herramientas de actualización y diseño
- Remarks (DD 689) and DA 5181 text boxes auto-grow so text is never cut off (#25).
  Las observaciones (DD 689) y los cuadros de texto del DA 5181 crecen solos para que nada se corte (#25).
- Note toolbar: "⋯ More" dropdown with .txt, Print, DA 5181, DD 689 (#24); buttons stay inside the column (#23).
  Barra de la nota: menú "⋯ More" con .txt, imprimir, DA 5181 y DD 689 (#24); los botones ya no se salen de la columna (#23).
- Service worker repaired (network-first), "Update app" button and version label, cache v10 (#22).
  Service worker reparado (primero red), botón "Update app" y etiqueta de versión, caché v10 (#22).

## Documentation & forms / Documentación y formularios
- README: known limits and refill/med list corrected (#19, #21).
  README: límites conocidos y lista de meds/resurtido corregidos (#19, #21).
- Medication refill request template (name, DoD ID, DOB, medication); nothing is stored (#20).
  Plantilla de solicitud de resurtido (nombre, DoD ID, fecha de nacimiento, medicamento); no se guarda nada (#20).
- PRA + NSI module (ADTMC Appendix H) under MACE 2 (#18).
  Módulo PRA + NSI (Apéndice H del ADTMC) dentro de MACE 2 (#18).
- ADTMC Appendices E–G as bilingual reference in Settings (#17).
  Apéndices E–G del ADTMC como referencia bilingüe en Ajustes (#17).
- Printable DA Form 5181 prefilled from the note (#16).
  DA Form 5181 imprimible, prellenado desde la nota (#16).
- SOAP-D note format per Appendix D (#15).
  Formato de nota SOAP-D según el Apéndice D (#15).
- MACE 2 concussion tool with automatic scoring (#14).
  Herramienta MACE 2 de conmoción con puntaje automático (#14).

## ADTMC audit / Auditoría del ADTMC (#6–#13)
- Protocols compared against the pamphlet diagrams: exam and test steps moved to their own pre-steps, missing steps added (categories C–F, H–M; A and G matched). Offline cache bumped (#13).
  Protocolos comparados con los diagramas del pamphlet: examen y pruebas pasan a pasos previos propios, se agregaron pasos faltantes (categorías C–F, H–M; A y G coincidían). Caché offline actualizado (#13).

## Foundations / Base (#1–#5)
- Printable DD 689 sick slip, blocks 1, 2, 3, 6, 12 prefilled; name, ID and rank are not saved (#5).
  Hoja DD 689 imprimible, bloques 1, 2, 3, 6 y 12 prellenados; nombre, ID y rango no se guardan (#5).
- Short history modes: quick / focused / full (#4).
  Modos de historial corto: rápido / enfocado / completo (#4).
- Mutually exclusive interview options, last tap wins (#3).
  Opciones de entrevista mutuamente excluyentes, gana el último toque (#3).
- Medication search with per-drug daily-maximum check (#2).
  Búsqueda de medicamentos con control de dosis máxima diaria (#2).
- Theme selector (6 colors, dark/light) and correct ADTMC name (#1).
  Selector de tema (6 colores, oscuro/claro) y nombre correcto del ADTMC (#1).
