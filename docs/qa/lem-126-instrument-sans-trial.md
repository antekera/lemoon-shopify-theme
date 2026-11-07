# LEM-126 — prueba y adopción de Instrument Sans

> Estado actual: Instrument Sans aprobada definitivamente por el usuario el 07-11-2026. El registro siguiente describe la fase de prueba previa; la adopción y sincronización documental se registran al final.

07-11-2026. El usuario aprobó la 404 entregada («estoy ok con los cambios») y pidió aprovechar el PR para probar Instrument Sans en lugar de Hanken Grotesk. La aprobación anterior corresponde a la 404 con sección SHA256 `b65f011a8237915aad1c01fc9cf6e45035333194748e76cac890b166ebc3293b` y asset v2 SHA256 `3822cc4f749281b48485b22ddacc8c745eb96fec2cf306bc42b987083465cb6b`; no es aprobación definitiva de la nueva fuente ni de una revisión PR aún no subida.

## Alcance de la prueba

- Token `--lemoon-font-body`: Instrument Sans. Cargas Google Fonts CSS2 en `layout/theme.liquid` y `layout/password.liquid`, pesos 400/500/600/700, `display=swap`.
- Password consume el token en sus dos antiguos hardcodes. La etiqueta de la galería identifica la fuente ensayada.
- Urbanist, logo, tamaños, pesos, interlíneas y espaciados se conservan. No se modificó contenido comercial ni el layout de la 404.
- DESIGN.md y guía de marca conservan la referencia aprobada anterior y explicitan que la sustitución en esta rama es una prueba pendiente de elección final; inventarios MD/JSON actualizados.
- [Instrument Sans propuesta por el usuario](https://fonts.google.com/specimen/Instrument+Sans?preview.script=Latn). Sintaxis contrastada con [Google Fonts CSS2](https://developers.google.com/fonts/docs/css2) mediante Context7 y endpoint CSS oficial consultado con éxito.

## Preview y comprobación

Tema no publicado **189821550760**, servidor local `http://127.0.0.1:9295/lemoon-404-preview?pb=0`. El filtro de sincronización de `theme dev` se amplió de los cinco archivos 404 a esos cinco más `layout/theme.liquid`, `layout/password.liquid`, `assets/lemoon-tokens.css`, `assets/lemoon-password.css` y `sections/lemoon-design-system.liquid`. El resto del tema procede de la copia remota original. Producción no publicada desde esta rama.

- `SHOPIFY_FLAG_NO_INPUT=1 shopify theme check --fail-level error`: **298 archivos, cero offenses**, exit 0.
- Pruebas existentes `home-sections`, `launch-page` y `not-found-page` con Node 24.19.0: **19/19 PASS**. Se actualizó únicamente la expectativa existente de familia Google Fonts en `tests/unit/home-sections.test.js`.
- Chromium nativo Shopify local: **21/21 comprobaciones**, siete por ancho 390/820/1440. Carga explícita de las cuatro FontFace mediante `document.fonts.load`; comprobación de estado loaded de Instrument Sans 400/500/600/700, familia computada en body/párrafo/cuatro enlaces e H1 Urbanist; H1 32/40px, párrafo 16px, enlaces 14px; ilustración completa, cuatro destinos y sin overflow. Cero pageerror en esa ejecución.
- Capturas móvil y escritorio inspeccionadas en `/tmp/lem126-instrument-qa/`. Captura previa Hanken conservada como `hanken-before.png` para comparación visual; no constituye un pixel diff.
- Revisión independiente acotada al delta tipográfico: **Approved**, sin bloqueos. Responsabilidad de solo lectura, sin aislamiento técnico de permisos.
- `git diff --check`: PASS.

## Límites y estado

La comprobación visual nativa se hizo sobre la 404, no sobre todo el sitio ni la página de contraseña; esta última tiene inspección de carga/herencia y cobertura unitaria focal. No se afirma auditoría tipográfica general, rendimiento ni ausencia total de mensajes de consola: en el navegador de Orca se observaron avisos de reconexión de hot reload y de una integración que requiere HTTPS. No son fallos de descarga de la fuente.

Al finalizar esta fase de prueba, la elección definitiva todavía estaba pendiente. La aprobación posterior y su efecto vigente se registran a continuación.

## Adopción definitiva y sincronización documental

El 07-11-2026 el usuario eligió expresamente Instrument Sans como fuente definitiva y autorizó enviar los cambios y reemplazar las referencias anteriores del proyecto y Google Docs. Se conserva Urbanist y el logo. DESIGN.md es el contrato vigente; se retiró el estado de prueba de la guía de marca y del inventario activo.

Se actualizaron las referencias operativas en DESIGN, guía y biblioteca de componentes, inventario MD/JSON, prompt de diseño, especificaciones de quiz y gift card, plan de páginas y documento de referencias 404. La skill local de auditoría de tokens y su validador Python esperan Instrument Sans. La plantilla standalone de gift card también carga la fuente nueva; no se habilitó la venta ni emisión de gift cards. Las únicas menciones restantes a la fuente anterior en el repositorio corresponden a los antecedentes de prueba y a la captura previa, explícitamente históricos.

Google Docs editados en sus ubicaciones existentes, con control de revisión y lectura posterior de todas las pestañas devueltas:

- [Guía de marca y uso para agentes](https://docs.google.com/document/d/1FNauT1gFr3ona9ZwJf9_LEWHZ0bWS5mC4SK7Tv2cMR4/edit): dos sustituciones.
- [Manual de marketing, contenidos y escalamiento](https://docs.google.com/document/d/14SZgR6e0fNOorzuqYSgyn3NZ2c1sfM-nOIRybJvbYyo/edit): una sustitución.
- [Benchmark Ecommerce Ópticas](https://docs.google.com/document/d/1OEcTYdpm2UzMueDgMB6QGI_ubU_pDLQV1cOSGBjMdtY/edit): una sustitución en la referencia de identidad Lemoon; sin cambios en las observaciones de competidores.

Las cuatro sustituciones se confirmaron por respuesta de escritura y readback: cero menciones de la fuente anterior en esos documentos. La búsqueda Drive de la fuente anterior identificó estos tres documentos accesibles de Lemoon; no se modificaron documentos de otros proyectos ni fuentes Figma. El estado de revisión de los demás contenidos de cada documento no cambia.

Gate final local: Vitest **397/397 pruebas, 42/42 archivos**, sin fallos ni skips, Node 24.19.0; `python3 -B scripts/test_codex_workflows.py all` PASS y regresiones del validador **9/9 PASS**. Theme Check **298 archivos, cero offenses**, exit 0. Evidencia en `/tmp/lem126-final-qa/`; capturas y los 21 checks nativos anteriores se conservan como cobertura focal de la 404 y su cadena de fuentes sin cambios. No se repitió una suite completa de navegador y la página gift card no tiene nueva prueba nativa.

Revisiones independientes: código sin bloqueos de runtime y convenciones **Ready to push**; los estados documentales anteriores de aprobación/upload se conciliaron con la aprobación humana y preview registrados. Revisiones de solo lectura por responsabilidad, sin aislamiento técnico de permisos.

Entrega autorizada: commit y push de esta rama al PR #65. Merge, cierre Linear y publicación en producción permanecen separados de esta solicitud. El tema no publicado 189821550760 conserva el preview autorizado.

## Integración de main para resolver el conflicto del PR

Después del primer envío `409d380d`, GitHub detectó conflicto con `origin/main@14dfae93`. Se integró esa base en la rama del PR, conservando el quiz y sus registros de inventario; no se fusionó el PR a main. Único archivo con conflicto textual: `docs/design/component-inventory.json`. Resolución desde el inventario de main más la adopción tipográfica y el asset decorativo 404: **555 rutas únicas = todas las rutas del índice en los ocho roots**, sin faltantes ni extras. Las cinco referencias normativas de fuente incorporadas desde main (documentos del quiz y helper de render) se actualizaron a Instrument Sans, preservando los resultados visuales históricos como históricos.

Gate sobre el árbol integrado: **463/463 unitarias, 45/45 archivos**, cero fallos/skips, Node 24.19.0; workflows Python `all` PASS, **9/9** regresiones; Theme Check **314 archivos, cero offenses**. Evidencia `/tmp/lem126-merge-qa/`, archivada en Git common dir con el resto. No se repitió e2e local del quiz; los servicios de otras sesiones se conservaron y CI realiza sus checks aislados tras enviar la resolución. Los resultados anteriores 397/298 corresponden al árbol previo a esta integración.

El preview no publicado conserva la sincronización de los diez archivos de 404/fuente documentados, ampliada a `templates/gift_card.liquid` para incluir su carga de fuente coherente. No se activan gift cards ni se publica producción.
