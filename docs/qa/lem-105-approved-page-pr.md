# LEM-105 · extracción aprobada de página para el PR · 08-11-2026

Base probada: `2caa06df99d61817bd3028bcc7d7fe95494d8817` con el delta de página de esta entrega. Checkout aislado: `/tmp/lem105-approved-page-pr-20261108`. La sección conserva SHA-256 `1b0d09acf6f2c6fd5a4a91d387893b4bbecb0ae7d5d3f7915e2c9b79b46aed8e`, coincidente con [la aprobación humana](lem-105-page-approval.json).

Incluye el botón de catálogo accent reutilizable, la ayuda sin acción de consulta, la corrección final del paso 3 en es/en y defaults del editor, y el publisher analítico aprobado con receptor GA4 preparado fuera del tema. DESIGN, receta e inventarios documentan solo este alcance. La extracción no incorpora los refinamientos en curso del modal PDP ni los drawers compartidos; los SVG y CSS de la guía permanecen en su versión base. Los locales runtime omiten únicamente la nueva clave exclusiva del modal. El manifiesto conserva los hashes del preview integrado original como contexto histórico y distingue los hashes de la extracción.

## Validación de esta extracción

Node `24.19.0`, Shopify CLI `4.8.5`. Comandos ejecutados desde el checkout aislado:

```sh
node node_modules/vitest/vitest.mjs run
SIZE_GUIDE_PORT=4194 node node_modules/@playwright/test/cli.js test --config tests/e2e/measurement-guide-analytics.config.js --output /tmp/lem105-approved-page-browser-results
SHOPIFY_FLAG_NO_INPUT=1 node /Users/miguel/.npm/_npx/c98b30e981802b68/node_modules/@shopify/cli/bin/run.js theme check --fail-level warning
SHOPIFY_FLAG_NO_INPUT=1 node /Users/miguel/.npm/_npx/c98b30e981802b68/node_modules/@shopify/cli/bin/run.js theme check --fail-level error
git diff --check
```

- Unitarias completas de esta extracción: **519/519 PASS**, 50 archivos, 1.33 s.
- Chromium: **21/21 PASS**, 32.2 s, sin retries ni skips: 10 pruebas de página y 11 de analítica. Incluye 390/820/1440 px, breakpoints, 320 px y texto al 200 %, navegación/foco/colores de CTA, es/en y consentimiento nativo simulado.
- Theme Check: **319 archivos, cero observaciones**, tanto al umbral warning como error.
- Capturas de página y CTA generadas en `/tmp/lem105-approved-page-browser-results`; logs unit/e2e/theme-check en `/tmp/lem105-approved-page-*.log`.

Estas son pruebas de Liquid local con fixtures, sin envío de eventos real. Los resultados anteriores de 524 tests/320 archivos pertenecen al workspace integrado histórico y no se trasladan a esta extracción. El estado nativo de CMS/editor/asignación y la ingesta GA4 permanecen fuera de esta evidencia. No se publicó Shopify, no se instaló un pixel, ni hubo merge. La actualización del PR corresponde al coordinador.
