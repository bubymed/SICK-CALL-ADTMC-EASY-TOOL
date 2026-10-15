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
