# LEM-134 · Paquete editable de revisión

Abrir `index.html` directamente desde este checkout. Sin build, dependencias nuevas, servidor ni peticiones Shopify. Requiere conservar `../../../assets/lemoon-tokens.css` y `../../../assets/lemoon-logo-refined-navy.svg`; el manifest registra sus hashes. Fuentes locales y licencias upstream verbatim en `fonts/`. Copiar solo esta carpeta fuera del checkout requiere incluir esas dos dependencias manteniendo rutas, o reubicarlas explícitamente; no es un archivo HTML autocontenido.

La especificación canónica de esta propuesta está en [pdp-design-spec.md](../pdp-design-spec.md); el contrato visual del tema sigue en [DESIGN.md](../../../DESIGN.md). Modificar `index.html`, `proposal.css` y `proposal.js` para revisar layout/estados; no son código listo para copiar al storefront. La barra superior permite elegir15 estados. Ningún control crea carrito, recibe receta o escribe en Figma.

Revisar primero renders main-1440 /820 /390, luego estados `soldout`, `nodata`, `partial`, `long`, `invalid`, `loading`, `error`, `quantity`, `compatible`, `incompatible`, `pricechange`, `single`, `accessory`, `sun`. Todos tienen captura local. Las composiciones usan datos observados como muestras internas, espacios de media no vinculados y estados condicionales simulados expresos. No se atribuye una fotografía de categoría o demo a un SKU.

Decisiones para Miguel: CTA único lemon de entrada al recorrido; texto visible de color; atributos breves cerca de compra; contain en thumbnails sin alteración no verificada; controles y fallback accesibles. Su revisión no adopta otras propuestas23/129 ni autoriza despliegue.

`references/figma-*` son snapshots leídos el06-11-2026 del archivo existente; no versión inmutable. Los TXT contienen código devuelto por la herramienta como referencia con URLs temporales suprimidas; los hashes originales de contexto constan en figma-observations.json. Las capturas guardadas solo son evidencia, no assets de implementación. Las alternativas269/270 no se adoptan.

Reproducir render con `node render.cjs` usando Playwright ya instalado en el checkout principal indicado dentro del script, o `LEMOON_PLAYWRIGHT_MODULE` con ruta al módulo instalado. No instalar dependencias. `render-checks.json` registra navegador, anchos, tamaños computados, fuentes/media y resultados; `manifest.json` registra hashes, tamaños y procedencia incluidos tokens y logo externos a la carpeta. La autorrevisión no reemplaza revisión independiente/humana.

Láminas de estados: [1](renders/state-sheet-1.png), [2](renders/state-sheet-2.png), [3](renders/state-sheet-3.png), [4](renders/state-sheet-4.png), con [fuente editable](state-sheets.html).

Correcciones P2: `node render-state-corrections.cjs` genera evidencia específica en `state-correction-checks.json`; `render-checks.json` conserva la ejecución histórica anterior. Regenera solo nodata/Dalton/partial a390/1440, disclosures expandidos de esos contextos y accesorio/sol, recuperación local y hojas1/3. Capturas nuevas `*-expanded-*`, `partial-secondary-*` y `partial-retry-*` permiten revisar el resultado. La recuperación es una simulación de slots sin fotografía ni petición de red.
