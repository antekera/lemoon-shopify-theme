# LEM-126 — ilustración armazón + gesto lemon, QA local

07-11-2026. Dirección elegida por el usuario: «vamos con tu recomendacion: Armazón + gesto lemon». Base `f51ab4940fe7788086efd34ef9a5ede5562c5041` más delta local sin commit. No modifica la evidencia histórica del [QA Shopify del 6 de noviembre](lem-126-404-validation.md); ese registro no valida el nuevo asset remoto.

> Registro histórico de la primera integración de la ilustración, con buscador. La corrección posterior solicitada por el usuario retira ese buscador; sus comprobaciones se registran al final y sustituyen esa parte de la aceptación local.

## Entrega

- `sections/main-404.liquid`: ilustración decorativa y 404 como texto independiente dentro del panel beige; imagen completa fluida, alt vacío y conjunto aria-hidden. Mensajes, formulario, parámetros, enlaces y schema conservados.
- `assets/lemoon-404-frame-lemon-v1.webp`: alpha, 960×640, 49.374 bytes. Generación con herramienta integrada; [prompt y procedencia](../design/assets/lem-126/generation.json).
- Contrato visual e inventarios MD/JSON actualizados; sin nueva biblioteca, JS ni locales.
- Preview aislado de la sección: `http://127.0.0.1:4186/404`. El render local usa fuentes del worktree y rutas de salida hacia lemoon.cl; no representa el header/footer ni el motor nativo Shopify.

## Comprobaciones ejecutadas

```sh
SHOPIFY_FLAG_NO_INPUT=1 shopify theme check --fail-level error
npx --yes --package=node@24.19.0 node node_modules/vitest/vitest.mjs run tests/unit/not-found-page.test.js
npx --yes --package=node@24.19.0 node /tmp/lem126-lemon-qa/check.cjs
git diff --check
```

- Theme Check: **296 archivos, cero offenses**, exit 0.
- Unitarias focales existentes: **2/2 PASS**, Node 24.19.0 / Vitest 5.0.3.
- Chromium local: **51/51 comprobaciones**, 17 por viewport 390×844, 820×1180 y 1440×900. Imagen cargada sin crop, sin overflow, foco visible, orden input→botón→home→catálogo, validación nativa vacía, búsqueda GET interceptada con `q=Colca`, `type=product` y `options[prefix]=last`, destinos esperados por atributos, decoración y texto independiente; cero pageerror.
- Capturas móvil/escritorio inspeccionadas visualmente. Evidencia y scripts locales en `/tmp/lem126-lemon-qa/`; no son assets publicados ni artefactos persistentes del repositorio.
- JSON del inventario consistente: 520 rutas únicas, 487 mapped y 33 excluded; asset binario registrado y asociado a LM-UTILITY. Enlaces relativos de los documentos modificados comprobados.
- Revisión independiente de código/documentación: **Approved**, sin hallazgos ni correcciones requeridas sobre el delta. Responsabilidad de solo lectura, sin aislamiento técnico de permisos.

SHA256 sección: `f3664f089723199c20300c0cc49d5bea1a7f8add053f0c9226ea9bf5016b75d5`.

SHA256 WebP: `be9ede332dbd38facde81124ee239593eafb1a49906847969338440af405f3d8`.

## Límites

El HTTP 404 local lo emite el servidor de preview; la búsqueda se interceptó y no se probaron sus destinos remotos. No acredita Liquid nativo, Shopify storefront, Firefox/WebKit, dispositivos físicos ni lectores de pantalla. Render final pendiente de revisión visual humana. Sin commit, push, merge, cambio de Linear ni upload/publicación Shopify en esta entrega.

## Corrección posterior: sin buscador, cuatro enlaces útiles

Petición explícita del usuario del 07-11-2026: retirar el buscador y añadir enlaces útiles. Se eliminó el formulario y su CSS local, que no usaba el input compartido. Se conservan inicio/catálogo y se incorporan FAQ `/pages/preguntas-frecuentes` y contacto `/pages/contact`, con etiquetas y explicación coherentes en es/en propuestas por copywriter. La navegación se etiqueta desde el H1 mediante ID de sección. Los enlaces tienen un único contorno navy de 2px, offset 2px y `box-shadow: none`, también para el fallback `.focused`. La ilustración no cambia.

Pruebas unitarias y storefront versionadas actualizadas al nuevo alcance en `tests/unit/not-found-page.test.js` y `tests/storefront/not-found.spec.js`. El caso de búsqueda se reemplaza por navegación de los cuatro enlaces; la suite storefront no se ejecutó contra Shopify sin subir este cambio.

- `SHOPIFY_FLAG_NO_INPUT=1 shopify theme check --fail-level error`: **297 archivos, cero offenses**, exit 0.
- Unitarias focales con Node 24.19.0: **2/2 PASS**.
- Chromium local: **42/42 comprobaciones** (14 por viewport 390×844, 820×1180 y 1440×900): sin formulario/input/botón, cuatro enlaces correctos y visibles de al menos 44px, teclado con foco único sin sombra y fallback `.focused`, imagen cargada completa y sin overflow; cero pageerror.
- Revisión independiente del delta: **Approved**, sin hallazgos bloqueantes. Sin repetir la revisión del asset ni atribuir aislamiento técnico.
- Evidencia local: `/tmp/lem126-links-qa/` (scripts, resultados, logs y capturas). Los destinos se comprueban como atributos; no se acredita disponibilidad remota de las páginas.
- `git diff --check`: PASS. SHA256 de la sección corregida: `a883c6437ee29a8562c174d706794bb573f95086a24b9f6fc1dd209475369dbe`.

Los resultados anteriores de búsqueda son históricos y quedan sustituidos por esta comprobación del alcance solicitado. El nuevo render sigue siendo local, sin header/footer, sin publicación, push ni cambios de estado del ticket.

## Revisión visual v2: limón separado del armazón

Petición posterior del usuario: el limón de v1 parecía incrustado en el lente. Se editó la ilustración con imagegen integrado para separar ambos objetos mediante espacio transparente visible y reducir los trazos decorativos. Nueva pieza activa `assets/lemoon-404-frame-lemon-v2.webp`: alpha, 960×640, 34.528 bytes. El original v1 se conserva en `docs/design/assets/lem-126/lemoon-404-frame-lemon-v1.webp`; [prompt de edición y procedencia](../design/assets/lem-126/generation-v2.json).

En runtime solo cambia la referencia al asset; dimensiones, CSS, textos y cuatro enlaces permanecen como en la corrección anterior. Se actualizan DESIGN e inventarios para apuntar a v2. No se repitió la suite de navegación de 42 comprobaciones, que es evidencia histórica sobre los controles conservados.

Comprobación focal actual: carga de v2 a 960×640, cuatro enlaces presentes y ausencia de overflow en 390×844, 820×1180 y 1440×900 mediante el navegador de Orca. Capturas desktop/móvil inspeccionadas: armazón y limón separados, imagen completa. Theme Check: **298 archivos, cero offenses**, exit 0. `git diff --check`: PASS. Preview LiquidJS aislado; no acredita Shopify remoto ni aprobación visual humana final. Sin publicación ni push.

SHA256 v2: `3822cc4f749281b48485b22ddacc8c745eb96fec2cf306bc42b987083465cb6b`.

SHA256 sección con v2: `b65f011a8237915aad1c01fc9cf6e45035333194748e76cac890b166ebc3293b`.

## Preview nativo Shopify solicitado por el usuario

Petición posterior: ver la página en Shopify local. Se creó una copia no publicada del tema actual mediante `shopify theme duplicate`: **189821550760**, nombre **LEM-126 - 404 local preview**, origen publicado observado **155307737256**. El dev compartido 189557964968 y los servicios de main en 9292/9294 estaban activos y se conservaron.

Servicio nativo en `http://127.0.0.1:9295/lemoon-404-preview?pb=0`, ejecutado desde este worktree con `shopify theme dev --store=lemoon-8277.myshopify.com --theme=189821550760 --host=127.0.0.1 --port=9295 --nodelete` y cinco filtros `--only`: `sections/main-404.liquid`, `templates/404.json`, `locales/es.json`, `locales/en.default.json`, `assets/lemoon-404-frame-lemon-v2.webp`. Contraseña del storefront cargada desde el entorno local sin imprimirla. No se sincronizan settings_data, header/footer ni archivos ajenos; el shell procede de la copia remota del tema publicado.

Verificación actual: GET devuelve **HTTP 404**, identidad `Shopify.theme.id=189821550760`, rol `unpublished`, H1 localizado, cuatro enlaces y ausencia del buscador local de la sección. Ilustración v2 cargada con ancho intrínseco 960; header/footer presentes en DOM. Sin texto Liquid error en la respuesta inspeccionada. Captura de navegador revisada visualmente. No constituye una suite completa de destinos, interacción, responsive ni auditoría del shell. La copia conserva contenido comercial del tema de origen; esta comprobación no lo aprueba.

Terminal Orca del servidor: `term_478a98c7-b39a-4891-8217-8d160e9848ed`. El comando mantiene sincronización de los cinco archivos mientras esté activo. Esta etapa sí sube archivos al tema de preview a petición del usuario; las menciones anteriores de «sin upload» describen etapas históricas. Sin publicación en producción, commit, merge ni cambio de Linear.

## Corrección del comentario de revisión: conservar idioma

Comentario `4501782035` del PR #65, revisado contra `8fc2954a`: los nuevos enlaces FAQ/contacto usaban rutas fijas y perdían el prefijo al navegar desde `/en`. Ambos se construyen ahora con `routes.root_url | append: '/pages/…' | replace: '//', '/'`, igual que el enlace FAQ existente en Contacto. Home, catálogo, textos, foco y diseño permanecen iguales; inventario MD/JSON actualizado.

Regresión renderizando la sección Liquid con el helper existente: antes fallaban `/en` y `/en/`, mientras `/` pasaba; después pasan las tres variantes y los cuatro hrefs conservan su destino sin barras duplicadas. Suites `not-found-page` y `contact-page`: **10/10 PASS**, dos archivos, Node 24.19.0. Theme Check: **314 archivos, cero offenses**. `git diff --check` PASS. Revisión independiente focal **Approved**, sin bloqueos, de solo lectura por responsabilidad y sin aislamiento técnico.

Evidencia `/tmp/lem126-locale-qa/` (red/green/report/hashes), archivada con las demás entregas en Git common dir. No se repitió la suite completa ni navegador: este check prueba construcción de enlaces, no disponibilidad de páginas CMS localizadas. Corrección enviada al mismo PR, sin merge ni publicación en producción.
