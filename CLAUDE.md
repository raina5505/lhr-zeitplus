# Arbeitsweise in diesem Repo

- Bei **jeder** Änderung am Script: `@version` und `const VERSION` hochzählen und das **README.md** mitpflegen (betroffene Funktionsbeschreibung + neue Zeile im Änderungsprotokoll, Abschnitt 9). Das README ist die Admin-/Nutzer-Anleitung und ist im Script unter „Hilfe zu LHR Zeit +“ verlinkt.
- Vor dem Push: Syntax-Check (`node -e "new Function(require('fs').readFileSync('lhr-zeitplus.user.js','utf8'))"`).
