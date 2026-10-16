# Contributing / Cómo contribuir

**Commits and pull requests are always bilingual: English first, then Spanish.**
**Los commits y pull requests son siempre bilingües: primero inglés, luego español.**

Commit message / Mensaje de commit:
```
Fix DD 689 printing on iPhone / Arreglo de impresión del DD 689 en iPhone

EN: Short explanation of what changed and why.
ES: Explicación corta de qué cambió y por qué.
```

Rules / Reglas:
- Never commit real patient information. / Nunca subas información real de pacientes.
- Update `CHANGELOG.md` (both languages) for user-visible changes. / Actualiza `CHANGELOG.md` (ambos idiomas) en cambios visibles.
- Changes go through a branch and a pull request; merge with "Squash and merge". / Los cambios van en una rama y un pull request; mezcla con "Squash and merge".

## Releasing a version / Publicar una versión
Bump `APP_VER` in `app.js`, the cache name in `sw.js` **and** `version.json` to the same value (e.g. `v19`). Installed apps compare `version.json` with their `APP_VER` and update themselves.
Sube `APP_VER` en `app.js`, el nombre del caché en `sw.js` **y** `version.json` al mismo valor. Las apps instaladas comparan `version.json` con su `APP_VER` y se actualizan solas.

For every release with a new feature, add an entry at the **top** of `data/whatsnew.js` (same `v` as `APP_VER`, 1–3 short items, EN + ES). Medics see it once in a "What's new" popup after the update.
En cada versión con algo nuevo, agrega una entrada **arriba** en `data/whatsnew.js` (mismo `v` que `APP_VER`, 1–3 puntos cortos, EN + ES). Los médicos la ven una vez en la ventana "Novedades" después de actualizar.

## Medic access / Acceso de médicos
`data/access.js` holds the root public key(s), the revocation list and the enforcement date. The root **private** key is never committed — it lives only on the owner's phone (More → Access). To revoke an approver or a single approval, add its ID to `REVOKED` and release a new version.
`data/access.js` guarda la(s) llave(s) públicas raíz, la lista de revocados y la fecha de obligatoriedad. La llave **privada** raíz nunca se sube — solo vive en el teléfono del dueño. Para revocar, agrega el ID a `REVOKED` y publica una versión nueva.
