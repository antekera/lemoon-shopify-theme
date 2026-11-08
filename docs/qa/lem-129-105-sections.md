# LEM-129 / LEM-105 — diseño de secciones

Miguel aprobó el dibujo de `8611a1f4` y pidió continuar diseñando las secciones y entregar preview. La aprobación gráfica no se extiende al nuevo layout, al PR completo ni a publicación. Base de esta revisión: `8611a1f4d1b84ad1eeccaa7240e6914771077d9e`; [manifiesto exacto de fuentes probadas](lem-129-105-sections/tested-sources.json).

## Resultado revisable

- **Modal:** selector y cinco cifras disponibles antes de los dibujos, también en el orden de lectura del DOM. A390×844 todas las filas del fixture completo aparecen sin scroll. El modo inline conserva diagrama → selector → cifras, sus pestañas y controles.
- **Comparación:** código, nota educativa y perspectiva agrupados en warm. Las tres explicaciones quedan al lado solo con ancho útil suficiente; en el modal y en móvil se apilan. La página omite explícitamente la introducción repetida del componente, conservando la instrucción del paso, el ejemplo y todas sus definiciones.
- **Página:** índice de24rem desde990px; lectura acotada a70ch, pasos/divisores coherentes, definiciones A–E en filas y ayuda final blanca con las acciones existentes. Las otras cuatro guías conservan su render normalizado en es/en y su schema.
- **Dibujo aprobado preservado:** perspectiva SVG byte-idéntica, SHA256 `77904b8470148f5b829cd91009f43cc264ed955bc34586a7a17035797dac2294`; miniiconos y frontal/lateral sin cambios. No se modificaron locales, datos físicos, compra/configurador, JavaScript o settings.

Los parámetros nuevos son `values_first` en `lemoon-frame-dimensions` (false por omisión; true solo en el diálogo continuo) y `show_intro` en comparación (true salvo false explícito; la página lo omite). Las recetas, inventarios y DESIGN describen ambos contratos y el orden nuevo.

## Evidencia

- [Modal anterior: las cifras quedaban bajo el esquema](lem-129-105-sections/before-modal-390.png).
- [Modal actual: cifras en primera vista](lem-129-105-sections/modal-390.png).
- [Ejemplo dentro del modal](lem-129-105-sections/modal-example-390.png).
- [Página1440](lem-129-105-sections/page-1440.png) y [página390](lem-129-105-sections/page-390.png).

## Verificación nueva

| Comprobación | Resultado |
| --- | --- |
| Unitarias completas,48 archivos | **502/502**, cero fallos/omitidos |
| E2E afectadas Chromium | **39/39**,32.9s, cero fallos/omitidos/reintentos |
| Theme Check, CLI4.8.5 / Node24.19.0, umbral warning | **316 archivos, cero observaciones** |
| Nuevos casos | 3 unitarias +2 E2E; ambos E2E fallan en el snapshot anterior y pasan en el candidato |
| Revisión independiente de código y diseño | **Approved**, sin hallazgos pendientes |
| Revisión independiente de convenciones | **Ready to push**, sin hallazgos |
| Schema y otras cuatro guías | Schema idéntico;8 renders es/en normalizados idénticos a la base |
| SVG aprobado, IDs, datos y controles | Preservados; cierre/foco/conversión/estados cubiertos |
| `git diff --check` | PASS |

La suite afectada cubre ambos shells390/820/1440, página y límites749/750/989/990, reflow320 y texto HTML/control/SVG al200%, teclado/Escape/retorno de foco, scroll interno, datos parciales/ausentes/inválidos, unidades locales, editor/fallbacks y enlace modal→guía. La revisión visual añade capturas a820/990 para comprobar las columnas según ancho útil y el cambio del índice: a820 hay dos columnas del ejemplo; a990 se apila porque el índice deja638px de contenido; a1440 vuelve a dos columnas de514px.

Logs, manifiestos y19 capturas: `/tmp/lem129-sections-validation/stable-qf9sb2fu`. Rojo contra snapshot8611a1f4: `/tmp/lem129-sections-validation/red-first-view-results`. Theme Check: `/tmp/lem129-sections-design/theme-check.log`. Informes de revisión locales: `.superpowers/sdd/2026-11-07-size-guide-pdp-page/sections-*-review.md`. Revisiones de solo lectura conductual, sin aislamiento técnico de capacidades. No se repitieron las300 E2E globales para este alcance local.

## Preview y pendientes

- [Modal PDP](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=complete): pulsar «Guía de medidas».
- [Página guía](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes).
- [Modal óptico](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=eyewear&scenario=complete).

Servidor4189 con snapshot inmutable, acceso privado por Tailscale9451. Los enlaces muestran el último snapshot compartido; el manifiesto y las capturas fijan esta revisión. Son fixtures LiquidJS/Chromium con cifras sintéticas identificadas; no acreditan Shopify nativo, editor, SEO ni datos físicos de un SKU. LEM-129/105 permanecen In Progress y PR64 en borrador: pendientes integración nativa y revisión humana del resultado completo. Sin publicación, merge ni cierre de tickets.
