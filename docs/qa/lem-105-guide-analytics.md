# Guía de medidas · eventos analíticos locales · 08-11-2026

La validación de la extracción exclusiva de página para el PR se registra en [lem-105-approved-page-pr.md](lem-105-approved-page-pr.md). Las cifras siguientes corresponden al workspace integrado anterior.

Entrega: publisher en la página measurements y receptor GA4 preparado fuera de assets. [Contrato, eventos, fuentes y activación](../analytics/measurement-guide.md). No se conectó un custom pixel en Shopify ni se publicó tema alguno. La ingesta GA4, atribución/sesión y convivencia con el canal Google siguen pendientes de verificación real tras la entrega autorizada.

## Validación histórica del workspace integrado

- Node24.19.0 / ShopifyCLI4.8.5: Theme Check,320 archivos,0 observaciones.
- Suite unitaria completa: **524/524 PASS**,52 archivos. Focal: **23/23 PASS** (14 nuevas de publisher/receptor y9 de la guía).
- E2E: **21/21 PASS**,31.7s, Chromium,0 skip/retry (11 de analítica y10 de la guía existente).
- Cobertura: Analytics permitido/denegado/revocado/ausente, API fallida, descarte previo al permiso, documento oculto, vistas únicas, IO real, BFCache, ES/EN, puntero/teclado, catálogo sin bloquear navegación, allowlist y contexto saneado del receptor, dedup y sandbox VM sin red.
- Preview9452 ES/EN: HTTP200, hooks/idioma correctos, publisher servido con hash esperado y dependencia cookie-preferences200. Fue un smoke HTTP; no ejecutó SDK live ni publicó eventos Google/Shopify.
- Revisiones independientes de código y convenciones aprobadas sin hallazgos pendientes. Roles solo lectura conductual, sin aislamiento técnico de permisos.

El primer test de deep link asumía que otros pasos no se exponían: la traza mostró heading1/2 visibles durante scroll suave antes del3. Se ajustó el test a la semántica de exposición≥50%, conservando guía/pasos únicos y0clicks de índice; la entrada3 aislada se prueba en unit. Se corrigió también un test de pasos inválidos que antes fallaba por mismatch de idioma. No se relajó el consentimiento ni se ejecutó envío real de Google.

El receptor se corrigió para pasar contexto canónico saneado también al config del SDK, antes de cargarlo, además de los cuatro eventos. La documentación no afirma ausencia de eventos automáticos/cookies del SDK ni atribución validada entre sandboxes.

El validador empaquetado con la skill Shopify no pudo iniciarse por una dependencia faltante; se usó el CLI oficial fijado y las pruebas citadas. No se alteró el plugin ni node_modules.

## Revisión exacta

HEAD base `2caa06df99d61817bd3028bcc7d7fe95494d8817` + cambios locales; no es el SHA de una entrega publicada.

```text
7b6c89981c4a75057d37082bcf56d1664ef4c0d1bd953a98a5982735621988a6 assets/lemoon-measurement-guide-analytics.js
a2b0426ce8494a337bed5bf56edb8feb77c0449c9d7316c7152388a99196fe64 scripts/shopify-pixels/lemoon-measurement-guide-ga4.js
1b0d09acf6f2c6fd5a4a91d387893b4bbecb0ae7d5d3f7915e2c9b79b46aed8e sections/lemoon-guide-page.liquid
```

Manifest temporal: `/tmp/lem105-guide-analytics-validation/manifest.json`. Logs, eventos de prueba, capturas y evidencia inicial en `/tmp/lem105-guide-analytics-validation`; copia de entrega preservada en Git común. Puerto4192 propio cerrado. Preview9452 y servicios ajenos preservados.
