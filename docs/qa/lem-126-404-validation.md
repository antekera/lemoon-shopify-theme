# LEM-126 — validación de Página 404

> Registro histórico del 06-11-2026. La revisión visual aprobada por el usuario y el preview nativo posteriores se documentan en [QA de la ilustración y enlaces](lem-126-404-lemon-local.md) y [adopción de Instrument Sans](lem-126-instrument-sans-trial.md). Los resultados de búsqueda de esta ejecución describen la versión anterior, previa a su retirada solicitada.

Fecha: 06-11-2026 (UTC y America/Santiago). Resultado: **already_satisfied para la superficie 404**, con limitaciones y hallazgo de destino documentados abajo; revisión independiente **Approved**, con aprobación humana del ticket pendiente.

## Revisión y fuentes

- Repositorio verificado: `https://github.com/antekera/lemoon-shopify-theme.git`.
- Base y HEAD probado: `0cada135da9534cd91b29b50cf0db9a64184e962`.
- Rama nueva renombrada de `antekera/lem-126-404-validation` a `chore/lem-126-404-validation`, tras comprobar libre el nombre; árbol inicial limpio.
- Único cambio de repositorio: este documento. No se modificaron implementación, locales, tests, configuración ni dependencias versionadas; sin commit/push, cambios Linear ni uploads.
- Criterios y comentario `5e59b03d-22d7-4390-97ac-006be509c287` leídos del intake completo de raíz: `run_d31cea15c394-lem-next-batch-intake.json`, entrada `criticalSources` / LEM-126. El comentario exige prueba actual, revisión y aprobación humana específica; no acredita cierre.
- Fuentes remotas proporcionadas por raíz: `run_d31cea15c394-lem126-theme-sources.json` y `run_d31cea15c394-lem126-preview-access-result.json`, en `/Users/miguel/Projects/lemoon/lemoon-theme/.git/lemoon-agency/runs/`.
- Tema publicado observado por navegador: **155307737256**, origen `https://lemoon.cl`. La captura API de raíz indica rol MAIN. Cada visita y destino del suplemento comprobó `Shopify.theme.id`.

| Fuente | MD5 local, coincidente con captura API remota |
| --- | --- |
| `sections/main-404.liquid` | `4ee54ba2f012ce9bbd866971aa619ddf` |
| `templates/404.json` | `23b80f80e65a594aeb785a00caeafee0` |

Los MD5 verifican estos dos archivos, no la totalidad del tema publicado. El contenido español, CSS, labels y acciones se comprobaron además en el DOM real. No se usaron el dev sin template ni el servidor ajeno 9292 como evidencia.

## Aceptación observada

URL inexistente: `/lemoon-page-that-does-not-exist-20261010`. Navegador Chromium de Playwright 1.63.0. Tamaños: 390×844, 820×1180 y 1440×900; ejecución de los dos casos existentes también con `isMobile/hasTouch` en móvil.

| Criterio del ticket | Evidencia actual | Resultado |
| --- | --- | --- |
| Error coherente con Lemoon y mensaje claro | Un H1 «No encontramos esta página», descripción es-CL, panel 404, navy/beige, composición existente y capturas contrastadas con DESIGN.md | Pasa; sin cambio de diseño ni nueva aprobación visual |
| Home, búsqueda y catálogo | Home `/` y catálogo `/collections/all` activados por teclado; HTTP 200 y mismo tema en los tres tamaños | Pasa |
| HTTP 404 y navegación accesible | Respuesta final auténtica 404, permanece ruta inexistente; no meta refresh ni redirect al home | Pasa |
| Español y responsive móvil/tablet/desktop | Mensaje, labels, enlaces y botón visibles; sin overflow horizontal; controles dentro del viewport; alturas input 50 px, botón 48 px y enlaces 44 px | Pasa |
| Teclado, estados, enlaces y flujo principal | Foco input → botón → home → catálogo con outline ≥2 px; query vacía retiene foco con `valueMissing`; búsqueda `Colca` por Tab/Enter produce `/search?q=Colca&type=product`, HTTP 200 y mismo tema | Pasa |

No hubo errores Liquid/traducción ni excepciones JavaScript en la 404 durante el suplemento. Título observado: `404 No encontrado – lemoon`; canonical nativo `https://lemoon.cl/404`, sin canonical al home. Al introducir `preview_theme_id`, Shopify puede normalizar la query mediante 302 conservando la misma ruta y terminar en 404; no se confunde ese paso de preview con una redirección SEO al home. La navegación final con `?pb=0` y estado autenticado conserva HTTP 404; detalle en `captures.json`.

## Comandos y resultados

Ejecutados desde este worktree salvo rutas absolutas. Evidencias locales fuera del repositorio: `/tmp/lem126-qa-20261106/`.

```sh
npm ci --ignore-scripts
/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/unit/not-found-page.test.js
SHOPIFY_FLAG_NO_INPUT=1 shopify theme check --fail-level error
STOREFRONT_PREVIEW_THEME_ID=155307737256 STOREFRONT_URL=https://lemoon.cl /opt/homebrew/opt/node@24/bin/node --env-file=/Users/miguel/Projects/lemoon/lemoon-theme/.env node_modules/@playwright/test/cli.js test --config=/tmp/lem126-storefront.config.mjs
STOREFRONT_PREVIEW_THEME_ID=155307737256 STOREFRONT_URL=https://lemoon.cl /opt/homebrew/opt/node@24/bin/node --env-file=/Users/miguel/Projects/lemoon/lemoon-theme/.env node_modules/@playwright/test/cli.js test --config=/tmp/lem126-hidden.config.mjs
/opt/homebrew/opt/node@24/bin/node --env-file=/Users/miguel/Projects/lemoon/lemoon-theme/.env /tmp/lem126-qa-20261106/supplement.mjs
/opt/homebrew/opt/node@24/bin/node --env-file=/Users/miguel/Projects/lemoon/lemoon-theme/.env /tmp/lem126-qa-20261106/capture.mjs
```

- Instalación locked: exit 0, 41 paquetes; avisos de engines y un aviso npm de vulnerabilidad alta, sin actualizar dependencias. Aunque la ruta dice node@24, el binario devuelve **v25.9.0**, fuera del engine exacto 24.19.0 del proyecto y del rango Vitest; limitación de entorno.
- Vitest focal: **2 passed, 0 failed, 0 skipped**, exit 0 (`vitest.log`). Son contratos estáticos existentes; no acreditan render remoto por sí solos.
- Theme Check CLI 4.6.1: **296 archivos, cero offenses**, exit 0 (`theme-check.log`); sin autocorrección ni upload.
- Casos existentes sin preparar privacidad: **2 passed / 4 failed**; banner nativo interceptaba Tab y clicks (`playwright-before-privacy.log`). No se interpretó como defecto de la sección.
- Casos existentes con preparación de privacidad: **5 passed / 1 failed**, fallo móvil de foco con toolbar de preview (`playwright-original-privacy.log`, `playwright.json`). No se afirma que el archivo original haya pasado entero sin adaptar navegación.
- Copia temporal de los mismos dos casos, conservando todas las aserciones y cambiando únicamente imports absolutos y query de navegación `?pb=0`: **6 passed / 0 failed / 0 skipped**, exit 0 (`playwright-hidden.log`, `playwright-preview-hidden.json`, `specs/not-found.spec.mjs`). La query oculta toolbar Shopify y no cambia el source del tema.
- Suplemento real: **30 comprobaciones pasan** (10 por viewport), exit 0 (`supplement.json` y `.log`); temas, respuestas, teclado, targets, overflow, validación vacía y errores se evalúan contra Shopify, no fixtures.
- Capturas: `mobile.png`, `tablet.png`, `desktop.png`, `captures.json`; screenshot tras comprobar ruta, 404 y tema, desde scroll superior. Revisadas visualmente, sin campos password ni cookies. Las capturas no ratifican las ofertas comerciales del header/footer.

Autenticación: helper local idéntico a `208fe3f6:tests/helpers/storefront-auth.mjs`; solo password storefront, sin usar credenciales de app. `/tmp/lem126-auth-setup.mjs` añade la acción real de rechazar cookies cuando aparece el banner nativo; se usó foco/Enter porque la barra de preview podía tapar el botón. Estado temporal con modo 0600 eliminado en teardown/finally; traces, vídeos y screenshots automáticos desactivados. Hubo intentos de configuración fallidos antes de la ejecución final (storageState no resuelto al importar configuración, interferencias de banner/toolbar y una expectativa demasiado estricta del canonical); no se ocultaron fallos de producto ni se aumentaron retries. Los intentos instrumentales detenidos no aportan aceptación.

## Validación posterior de coordinación

Fuente: `/tmp/lem126-qa-20261106/coordinator-validation.json`, registro del 06-11-2026 sobre la misma base `0cada135da9534cd91b29b50cf0db9a64184e962`. Coordinación registró **Node 24.19.0 vía paquete npx**, **2/2 pruebas unitarias existentes de not-found-page PASS** y **Shopify CLI 4.8.5**, comando `npx @shopify/cli@4.8.5 theme check --fail-level warning`, con **296 archivos y cero offenses, PASS**. Este registro cierra el gap de entorno para esos checks; no sustituye el entorno ni los resultados originales del autor documentados arriba. Leí la evidencia de coordinación sin repetir sus comandos; no se reejecutó ni revalidó el browser en esta actualización y no se cambiaron archivos runtime locales o remotos.

Revisión independiente: **Approved** para el documento y la aceptación funcional 404 en la base indicada, según `/tmp/lem-126-independent-review.md`; sin correcciones requeridas para ese alcance. Se conserva el hallazgo adyacente del hero fuera de esta rama. **La aprobación humana específica continúa pendiente** y este veredicto no autoriza merge, publicación ni cierre del ticket.

## Hallazgo fuera de la 404 y límites

Al volver a `/`, se registran dos excepciones por viewport: `this.getBoundingClientRect is not a function`, stacks `ResizeObserver.updateHeight` y `updateHeight`, asset remoto `lemoon-hero.js?v=127545578972382641661791420427:1:2994`. Reproducción: autenticar, visitar la 404, activar «Volver al inicio» y escuchar `pageerror`; la home carga HTTP 200 y conserva tema, pero su hero emite esos errores. El suplemento conserva path y stack en `supplement.json` para distinguirlos de la 404. En source local `assets/lemoon-hero.js:18`, `this.updateHeight ||= this.updateHeight.bind(this)` conserva la función de prototipo sin ligarla; posible causa y arreglo mínimo propuesto: asignar binding de forma efectiva, sujeto al owner y revisión del hero. **No se editó ese archivo**, no se verificó su checksum remoto y no se declara validación general de home ni ausencia total de errores en todos los destinos.

Sin prueba Firefox/WebKit, dispositivos físicos, lectores de pantalla, auditoría WCAG completa ni pixel diff con Figma remoto. No se hicieron pedidos, suscripciones, envíos de contacto, cambios de catálogo o consentimientos de terceros; el rechazo de cookies solo afecta la sesión de QA. No hubo nuevos tests versionados porque la evidencia real resolvió los criterios sin cambiar comportamiento. Esta ejecución es de solo lectura por responsabilidad, sin aislamiento técnico de permisos; la revisión independiente concluyó **Approved** según `/tmp/lem-126-independent-review.md`, sin hallazgos bloqueantes para el alcance 404. La aprobación humana y cualquier cierre de ticket siguen pendientes; raíz decide además seguimiento del hero y conservación de artefactos temporales.
