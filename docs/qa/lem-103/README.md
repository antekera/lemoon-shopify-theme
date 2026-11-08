# LEM-103 — Evidencia de implementación local

08-11-2026 · rama `feat/lem-103-face-shape-guide` · base `5bcb463bdd655720724b1df7c5c5be728e8d7100` + implementación revisada. Esta evidencia acredita código y recorrido local; no acredita asignación CMS, render Liquid alojado en Shopify ni publicación.

Estado más reciente: [estrella sin contorno azul](#estrella-sin-contorno-azul). Las revisiones anteriores se conservan como evidencia histórica.

## Resultado

Seis familias editables, dos pistas y dos monturas por familia; índice de anclas, ayuda de ajuste y salida a la PLP con los dos valores nativos de forma seleccionados. Contenido y navegación funcionan sin JavaScript; la instrumentación opcional posterior usa el módulo local de Analytics. Imágenes originales con tamaños responsive y contenido esencial en HTML.

- [Móvil390](mobile-390.png), [módulo móvil](mobile-family.png), [escritorio1440](desktop-1440.png): capturas vistas por coordinación en la vista local con shell del storefront. Las pruebas adicionales cubren820px y otros anchos.
- [Combinaciones de catálogo comprobadas](../../design/face-guide-proposal/catalogue-links-readback.json): seis URLs en colección real autenticada; todas seleccionan ambos valores y muestran9–13resultados del catálogo actual, que incluye muestras. No son conteos para publicar.
- [Investigación y texto](../../content/2026-11-08-face-shape-guide-research.md): tres tiendas chilenas y tres internacionales. Estructura/arte aprobados por Miguel antes de integrar.

## Pruebas ejecutadas

Node24.19.0, servidor de fixtures aislado en4177; el servidor compartido4173 se conservó.

| Ejecución | Resultado | Alcance |
| --- | --- | --- |
| `shopify theme check --fail-level error` | 321archivos, cero observaciones | Tema final después del ajuste responsive |
| `npm test` | 492unitarias +287Chromium; cero fallos/saltos | Suite completa antes del ajuste de tamaños responsive |
| `npm run test:unit -- tests/unit/face-guide.test.js tests/unit/guide-page.test.js` | 22/22 | Refresco final tras dicho ajuste |
| `npm run test:e2e -- tests/e2e/face-guide.spec.js --workers=2` | 14/14 Chromium | Guía final |
| `npm run test:e2e:cross-browser -- tests/e2e/face-guide.spec.js --workers=2` | 14/14 Firefox +14/14 WebKit | Guía final |

Las pruebas renderizan el Liquid real mediante LiquidJS, con objetos Shopify deterministas y destino de navegación simulado. Cubren contenido editable/escape, imágenes reemplazables, filtros repetidos, parámetros con tildes/espacios, fallback completo, enlaces localizados, teclado/foco, imágenes responsive, seis familias visibles sin JS y ausencia de overflow390/820/1440. No sustituyen el editor/render Shopify.

El manifiesto de pruebas archivado por coordinación contiene46hashes; todos coincidieron con la revisión final. Identificadores principales:

- Sección SHA256: `e1392f28f147f0f2485deffde3b2d5c2c989600bf9315bc6515192991b81c16e`.
- CSS SHA256: `0a15058a7c47c8f255f209f3eb82141566b85f08b6e78efb24d5dddad1851a44`.
- Enlaces SHA256: `bbe864a0b3f264883d3fe672745cab6f2482c8c7854531ed7e996066c2f21e4e`.
- Copia es-CL SHA256: `9fc6f1bf3dd4a5281bbf4ef241ae5ff87e245dbc73ee50226e8d026b8dc6224c`.

## Recorrido hacia PLP real

La vista local en4191/HTTPS9453 renderiza la sección de la rama con un shell visual capturado del storefront; los GET de catálogo usan el preview Shopify existente9296, sin subir archivos ni modificar catálogo. Se usó una lectura fechada de los valores reales de `frame_shape` para el objeto de colección de esta vista; el Liquid desplegado consultará la colección de Shopify directamente.

1. Desde el índice, «Redondo» abrió su módulo. «Ver Rectangulares y Geométricos» llegó a `/collections/all` con ambos parámetros, seleccionados en las dos representaciones del formulario nativo, y9tarjetas/9lentes.
2. Atrás volvió a la guía. «Ver Ovalados y Ojo de gato» llegó a PLP con ambos valores y11tarjetas/11lentes; se comprobó codificación del espacio.
3. Al quitar el chip «Ojo de gato» y esperar la actualización asíncrona, quedaron únicamente Ovalados y6tarjetas/6lentes. La primera lectura inmediatamente posterior al clic aún mostraba el DOM anterior; no se contó como fallo ni como resultado final.
4. Se volvió a la guía y se inspeccionó escritorio1440 y móvil390. El preview anterior9452 permanece disponible.

## Revisión independiente y rendimiento

Código: Approved, sin hallazgos restantes. El P2 inicial de miniaturas grandes se corrigió con180/360px en índice y360/640/960px en módulos; el índice pasó de2.368.756bytes a75.788bytes DPR1 /240.002bytes DPR2. No se solicitan maestros1254 en el render. La revisión comprobó390/1440 DPR1/2, sin overflow y contraste de texto mínimo observado7,30:1. No constituye medición de Core Web Vitals de producción.

Convenciones: Ready to push, sin P1/P2/P3; schema, locales, tokens, bloques e inventarios verificados. Editorial: Approved para copia integrada; seis fuentes comerciales reabiertas y guía de ajuste Warby Parker accesible. ABDO no pudo reabrirse por timeout/conexión cerrada; se registró el límite. Los tres reviewers actuaron por responsabilidad de solo lectura, sin aislamiento técnico de permisos.

## Pendientes para activación

Revisión humana de la implementación entregada; integración por PR, subida autorizada a un tema de revisión, asignación `page.guia-rostro` a la página existente, verificación de editor/textos/imágenes y metadata, recorrido completo y QA real Shopify, registro final de aceptación y autorización independiente de publicación. No se han realizado cambios en Shopify. Conservar el handle y los enlaces existentes.

## Corrección SVG solicitada por Miguel — 08-11-2026

La guía reutiliza directamente `lemoon-quiz-visual`, grupo `shape`, del paso Forma del quiz. Se comprobó igualdad exacta de los doce SVG renderizados con sus equivalentes canónicos. El snippet compartido del quiz permanece intacto. Los tres SVG de ajuste se redibujaron con anatomía frontal, tres cuartos y perfil, contornos navy y volumen suave marfil/gris, mediante tokens existentes. Los textos y las salidas filtradas a PLP se conservan.

- [Monturas escritorio](quiz-shapes-v2-1440.png) y [móvil](quiz-shapes-v2-390.png).
- [Ajuste escritorio](fit-svg-v2-1440.png) y [móvil](fit-svg-v2-390.png).

Capturas Chromium del render local vistas por coordinación; sin overflow a390/1440. La captura móvil oculta únicamente durante la captura el header fijo del shell para evitar que tape el dibujo; no se altera el tema. El capturador nativo Orca produjo imágenes blancas y no se utilizó como evidencia visual de esta corrección.

Refresco específico:22/22 unitarias,14/14 Chromium,14/14 Firefox y14/14 WebKit; cero fallos o saltos. Theme Check319archivos, cero observaciones; `git diff --check` limpio. Se verificaron60IDs únicos al renderizar dos instancias y referencias de gradientes válidas. El helper local incorpora el mismo adaptador `handleize` que el renderer del quiz; no se modifica Liquid de Shopify para acomodar el fixture.

La suite completa y los46hashes anteriores son evidencia histórica. De esos46archivos cambian únicamente sección, CSS, ambos snippets de la guía y helper de pruebas; los otros41coinciden. Hashes de la corrección:

| Archivo | SHA256 |
| --- | --- |
| `sections/lemoon-face-guide.liquid` | `5574fe79ecccd5bd1e8eb7e62c9a3547019b138284789aea5808f287a66aacef` |
| `assets/lemoon-face-guide.css` | `e1a59bc52f23182c1cbc6f044c3cc0ed8fffe3ddc108b5e0e0d13eb6f714194b` |
| `snippets/lemoon-face-guide-links.liquid` | `a6975634d38fed2a15d675e51b446b43d14307a0e7f7ccacaca4f9180bee699a` |
| `snippets/lemoon-face-guide-illustration.liquid` | `cc56784d9922bcbc77ae80d42930c18b06a5417a4cd3aee8e95012cf78b2783b` |

Revisión independiente del delta: **Approved — Ready to push**, sin P1/P2/P3. Se reconstruyeron los archivos previos retirando solo el delta de sección, enlaces, CSS y helper; filtros y CTAs permanecen intactos. Se comprobaron las doce siluetas canónicas, IDs/gradientes, capturas y archivos protegidos. No se repitió la revisión editorial porque la copia no cambió. Solo lectura por responsabilidad, sin aislamiento técnico.

El alcance sigue siendo local. La asignación CMS, integración por PR y QA Shopify permanecen pendientes según el apartado anterior.

## Ajustes de navegación, ilustraciones y banner único

08-11-2026, segunda corrección explícita de Miguel. Cada familia coloca «Ver formas» a la derecha del botón PLP; el enlace vuelve al índice. A anchos pequeños el texto del botón envuelve dentro de su superficie y el enlace conserva un target de44px. Pómulos y Patillas tienen perfiles nasales/labiales suaves y uniones continuas entre aros, bisagra, brazo y oreja; se retiraron trazos superpuestos. El SVG de Puente permanece idéntico a la revisión previa.

«¿No reconoces tu forma?» es el único banner, después de la sección de ajuste, con `--lemoon-surface-tertiary-green` (`#DFE9DE`). Conserva textos editables, catálogo y quiz. Sustituye el antiguo cierre y se retiraron sus campos `final_title`/`final_body`, todavía sin activar en Shopify. Los cambios de locales se limitan al grupo de esta guía.

- Acciones por familia: [390px](family-actions-v3-390.png), [1440px](family-actions-v3-1440.png).
- Ilustraciones: [390px](fit-svg-v3-390.png), [1440px](fit-svg-v3-1440.png).
- Banner final: [390px](single-banner-v3-390.png), [1440px](single-banner-v3-1440.png).

Capturas del render local Chromium inspeccionadas. Comprobación geométrica a320/390/820/1440:24filas con el enlace a la derecha, target de44px, un banner después de ajuste, fondo calculado `rgb(223, 233, 222)` y ausencia de overflow en la guía. A320 el shell de anuncios ajeno conserva2px de overflow; no se modificó como parte de esta corrección. Para las capturas se ocultó exclusivamente el header fijo del shell, sin cambios de producto.

Verificación sobre los hashes siguientes:22/22 unitarias y14/14 en cada navegador Chromium, Firefox y WebKit, sin fallos/saltos. Theme Check318archivos/cero observaciones; schema/locales y `git diff --check` correctos. Las doce siluetas de montura siguen idénticas al quiz. Dos instancias producen58IDs únicos con referencias de gradiente válidas; se eliminan dos IDs por la retirada del banner duplicado. Las suites completas anteriores no se volvieron a ejecutar y son históricas.

| Archivo | SHA256 |
| --- | --- |
| `sections/lemoon-face-guide.liquid` | `4bfaa7e747ff771003ec8cc876ba204a1eb1ee9e85f6af50f19bbb811b1e0149` |
| `snippets/lemoon-face-guide-links.liquid` | `3b26d9bea9137f09aaa668d554bf07a80706541a2ffafd7257fbde5c58dd3880` |
| `snippets/lemoon-face-guide-illustration.liquid` | `afd64e939b0689aa93fe5d6c6b0ebc3f61ffd286defca1b406b52f12b813f7f5` |
| `assets/lemoon-face-guide.css` | `1e1abe8dd8389eac0bd9a789c0f6155e3c9a2b78eab3568a710cb38604860fc3` |

Revisión independiente acotada: **Approved / Ready to push**, sin P1/P2/P3. Confirmó los cuatro hashes congelados, Puente idéntico,58IDs sin duplicados/referencias faltantes, un solo banner tras ajuste, seis etiquetas/anclas «Ver formas», overrides CMS escapados, paridad de claves y referencias del schema; inspeccionó las seis capturas v3. No repitió suites ni QA Shopify. Solo lectura por responsabilidad, sin aislamiento técnico.

Se mantienen los límites y pendientes de activación Shopify indicados arriba.

## Botón único y ojo de Pómulos

08-11-2026, última corrección explícita de Miguel. Se retiran los seis enlaces «Ver formas» y sus inputs/settings/CSS sin uso. Los seis botones filtrados predeterminados dicen «Ver armazones» / “View frames”; conservan sus dos filtros y overrides editables. Los fallbacks honestos al catálogo siguen vigentes. El banner verde no cambia.

El ojo lejano de Pómulos incorpora almendra, iris, pupila y brillo en perspectiva, dentro del rostro y del aro. Se comprobó que el resto del SVG coincide con v3; Puente y Patillas no se modifican.

Capturas locales vistas: [acciones390](family-actions-v4-390.png), [acciones1440](family-actions-v4-1440.png), [ajuste390](fit-svg-v4-390.png), [ajuste1440](fit-svg-v4-1440.png). Sin overflow en la guía; seis botones con texto exacto/altura50px, cero enlaces «Ver formas» y URLs filtradas intactas en ambos anchos. El header fijo del shell se oculta solo al capturar, como en las revisiones previas.

Refresco final:22/22 unitarias y14/14 Chromium, sin fallos/saltos; Theme Check318archivos, cero observaciones; schema/locales y `git diff --check` correctos. Doce siluetas idénticas al quiz,58IDs únicos entre dos instancias y gradientes válidos. Firefox/WebKit y suites completas anteriores se conservan como evidencia histórica y no se repiten para esta corrección acotada.

Hashes finales: sección `ba9661f9fc214c156e702ff5c3db2ac17f483348bf5cea4fce3fd819918c4d91`; links `a6975634d38fed2a15d675e51b446b43d14307a0e7f7ccacaca4f9180bee699a`; SVG `9bf5074ef1892b7db348050c9a7fa3a2be823d5f4a8bae675948cadc4175b96b`; CSS `663e7499b787b4b2b5c9d09bc2edce59cb5dc8de7b7a0962ec06defef31cc55e`.

Revisión independiente acotada **Approved / Ready to push**, sin P1/P2/P3. Confirmó cuatro hashes, Puente/Patillas idénticos, textos en/es, ausencia de retorno, IDs/gradientes, overrides escapados, filtros/fallback y schema/locales; inspeccionó las cuatro capturas v4. Solo lectura por responsabilidad, sin aislamiento técnico. No repitió suites ni QA remoto.

El alcance y los pendientes de activación Shopify permanecen iguales.

## Medición de clics y revalidación de recomendaciones

08-11-2026. Módulo local `lemoon-face-guide.js` cargado únicamente por esta sección. Publica `lemoon:face_guide_click` en27 enlaces:6índice,12formas,6botones de familia,1medidas y2cierre. SVG y nombre de cada forma disponible comparten un solo enlace semántico. Acciones, posición, destino, familia y formas usan valores controlados; sin textos arbitrarios, URLs/query ni IDs de clientes. Comprueba Analytics permitido por Shopify en cada clic, sin replay ni bloqueo de navegación; ausencia de API o errores no detienen el recorrido.

El [receptor y contrato GA4](../../analytics/face-guide-clicks.md) están preparados como archivos de integración, **sin activar en Shopify/GA4**. El receptor atiende `api.customerPrivacy` del sandbox, prepara el SDK solo en esta guía con permiso y envía `face_guide_click`, sin reenviar pageviews/comercio. La revisión inicial detectó y reprodujo un P1 por usar el global de App Pixels; se corrigió al acceso documentado de Custom Pixels. Reproducción antigua falló y el caso corregido pasó; revisión independiente posterior Approved y P1 cerrado con8 escenarios propios en VM. La revisión actúa por responsabilidad de solo lectura, sin aislamiento técnico.

Verificación final: **80/80 unitarias** (58Analytics+22guías) y **16/16 Chromium**, sin fallos/saltos. Navegador prueba27clics con publicación simulada, navegación, teclado/SVG, singleton y consentimiento/revocación. VM prueba receptor, datos permitidos, stream específico, warmup/errores/API documentada y ausencia de replay. Theme Check318archivos/cero observaciones y `git diff --check` limpio. Firefox/WebKit y la suite completa anteriores siguen siendo históricos. No hay prueba de recepción remota Google ni render alojado Shopify.

Se reabrieron nueve fuentes primarias, incluidas tres tiendas chilenas. Los cinco primeros pares se conservan; Alargado cambia a **aviador + redondo**, con texto que pide comparar altura/fotos/medidas sin garantía por forma. [Matriz y límites de las fuentes](../../content/2026-11-08-face-shape-guide-research.md#revalidación-de-los-seis-pares--8-de-noviembre-de-2026). Editorial independiente Approved: BrightEyes recuperado indexado y Zenni/PDP abiertos; el PDF Maui Jim no pudo reabrirse en la revisión independiente, por lo que no se atribuye verificación propia a ese revisor.

La nueva URL de Alargado se abrió en el preview Shopify existente: dos valores seleccionados en ambas representaciones del formulario,12tarjetas/12lentes. Lectura fechada en `catalogue-links-readback.json`; la fila anterior se archivó como histórica. Las cantidades incluyen muestras. [Alargado390](long-revalidated-390.png), [Alargado1440](long-revalidated-1440.png), [tarjetas390](tracking-frame-links-390.png), [tarjetas1440](tracking-frame-links-1440.png): vistas por coordinación,27 enlaces, cero errores de página y sin overflow en guía.

Identificadores finales: JS del tema `0192f990e579f376f8b2a2bc050d46a26d9bb02fdbfa27afeac48f47ff8d3a75`; sección `a19be738c6b3f164f0456ba0f0d0935364c0876e2b08577a98ada4c1821784b8`; helper enlaces `400faf8af40dc8c8cbb52e967613a019c44a41c72c715f5ca343edb6450de9cc`; receptor `ab4195e672233254feab24d9ad3fd096c98afd9307874162dc7ade727d7dc942`.

Pendiente de entrega operativa: revisión humana/PR y subida autorizada, CMS/editor Shopify, activar receptor/dimensiones y validar Pixel Helper/GA4 Tiempo real o DebugView con permisos concedidos y denegados. La existencia del código y las pruebas con mocks no demuestran datos recibidos en Google.

## Acabado inferior de Pómulos y Patillas

08-11-2026. Corrección visual solicitada por Miguel: los dos cuellos acababan en el borde inferior de250unidades del SVG. Se sustituyeron únicamente esos dos bloques por bustos de base curva, sin trazo horizontal de cierre y con contornos laterales que se desvanecen usando el gradiente existente. No se cambian viewBox, CSS ni imágenes del editor.

[Escritorio1440](fit-neck-refined-1440.png) y [móvil390](fit-neck-refined-390.png) inspeccionados por coordinación e implementador. MáximoY geométrico del busto:242,5 en Pómulos y243,75 en Patillas; quedan7,5/6,25unidades de aire antes del borde250. Ambos conservan continuidad de mandíbula/cuello y acabado suave marfil/gris. Puente, ojos, monturas y perfiles permanecen idénticos al baseline; se verificó que el resto del SVG no cambia al retirar exclusivamente los dos bloques nuevos.

Validación acotada:22/22 unitarias de guías; Theme Check318archivos/cero observaciones; `git diff --check` limpio. Sin overflow390/1440; doce SVG de montura iguales al quiz,58IDs únicos entre dos instancias y referencias de gradientes válidas. Analytics, receptor GA4, sección, enlaces, plantilla y locales coinciden con la revisión previa. Sus pruebas anteriores se conservan como evidencia histórica y no se repiten para dos trazados decorativos.

SVG SHA256: `51cae400aa3f1fed159b98d943ae394143097af76860a3ab91dd6639f7fa213f`.

Revisión independiente acotada **Approved / Ready to push**, sin P1/P2/P3: hash y delta exactos confirmados, gradientes/IDs válidos, ambas capturas inspeccionadas sin regresiones. Revisión por responsabilidad de solo lectura, sin aislamiento técnico.

El alcance continúa siendo local; no hay activación, subida ni publicación Shopify como parte de esta corrección.

## Acento lemon en botones de familia

08-11-2026. Por petición explícita de Miguel, los seis botones «Ver armazones» usan `--lemoon-action-accent` (#F7E600), texto/borde navy y hover `--lemoon-action-accent-hover` (#E6D600). El CTA del banner verde conserva navy. Solo se modifican dos reglas locales y el grupo de colores forzados de la hoja de esta guía; no hay cambios de markup, eventos ni destinos.

[Móvil390](lemon-cta-390.png) y [escritorio1440](lemon-cta-1440.png), inspeccionados. Comprobación de estilos calculados para los seis botones: contraste texto/fondo12,80:1 en reposo y11,00:1 en hover, foco navy2px, altura50px, sin overflow. En colores forzados, reposo/hover usan Canvas y LinkText. El cierre permanece navy. Theme Check318archivos/cero observaciones y diff limpio. Revisión independiente Approved sin hallazgos; solo lectura por responsabilidad, sin aislamiento técnico. Para este ajuste visual se ejecutó QA de navegador específica; las suites funcionales previas se conservan como históricas.

CSS SHA256 `91783fc431b75a1147dbb80b609aa425e9733972b3e9ad5b57c23915409a3625`. Cambio local, sin upload ni publicación Shopify.

## Unión continua de cabeza y cuello

08-11-2026. Miguel observó que suavizar la base no había resuelto la separación aparente de cabeza y cuello. Se rehacen Pómulos y Patillas como **una única silueta opaca** que recorre cabeza, cuello y hombros. La mandíbula pasa a una línea interior al30%; el contorno exterior permanece visible en los laterales del cuello y solo se desvanece al llegar a los hombros. Se conservan el margen inferior, las gafas, los ojos, la nariz, las orejas y Puente.

[Escritorio1440](fit-neck-joined-1440.png) y [móvil390](fit-neck-joined-390.png) vistos por coordinación, implementador y revisor independiente. La revisión comprobó expresamente la continuidad visual, además de los hashes. `isPointInFill` confirma ocho puntos de unión dentro de los mismos dos paths de cuerpo en cada ancho; ambos paths abarcan cabeza y cuello completos y terminan dentro del viewBox (Y242,5/243,75). Sin overflow.

22/22 unitarias de guías; Theme Check318archivos/cero observaciones y diff limpio. Doce SVG de monturas idénticos al quiz,62IDs únicos entre dos instancias y referencias de gradiente válidas; los cuatro IDs adicionales pertenecen a los nuevos gradientes de contorno. Revisión independiente Approved sin hallazgos: el resto del SVG coincide con el baseline al retirar defs/bloques de silueta y mandíbula modificados. Solo lectura por responsabilidad, sin aislamiento técnico. Los checks anteriores de Analytics y color se conservan como históricos, sin cambios en sus fuentes.

SVG SHA256 `466790fd22049e233f6f764c02c125f730a3d01ef9bc8a52c325e28a145c8350`. Alcance local, sin subida ni publicación Shopify.

## Icono lemon y botones navy

08-11-2026. Miguel descartó el botón amarillo y pidió probar un icono. Se restauran los seis CTAs navy con texto blanco y hover navy. El acento lemon queda en un único `sparkles` decorativo canónico, junto al H1:32px escritorio/28px móvil, relleno de la forma principal amarillo y contorno navy. El título mantiene su texto y semántica; el icono no se anuncia ni recibe foco. El snippet compartido del icono no cambia.

[Título390](lemon-icon-title-390.png), [título1440](lemon-icon-title-1440.png), [botón390](navy-cta-restored-390.png), [botón1440](navy-cta-restored-1440.png), vistos por coordinación/implementador/revisor. Comprobación real a320/390/1440:1H1/1icono decorativo, seis botones navy/blanco, hover correcto, Canvas/LinkText en colores forzados y sin overflow.22/22 unitarias de guías; Theme Check318archivos/cero observaciones y diff limpio. Revisión independiente Approved sin hallazgos, por responsabilidad de solo lectura y sin aislamiento técnico. La medición y los dibujos conservan sus fuentes; las pruebas funcionales anteriores son históricas.

Sección SHA256 `78aad6d82f79a2026013f87699e4a8453485b63bb27a8177ef82da8369eefe60`; CSS `903bbf4d067de05b6e6ab2b4ddb7c825a79db956d99c1a4196310391f06cd7f2`. Sin subida ni publicación Shopify.

## Botones a la derecha y refresco de Analytics

08-11-2026. Los seis «Ver armazones» se alinean al borde derecho del contenedor de texto mediante una clase en el wrapper existente y una regla flex local. Metadata, destinos, texto, foco y eventos permanecen iguales. [Móvil390](right-aligned-cta-390.png), [escritorio1440](right-aligned-cta-1440.png), vistos por coordinación/implementador/revisor. En320/390/1440, los seis bordes derechos coinciden con el contenedor (delta0), altura50px, navy/blanco y sin overflow.

Analytics ya estaba instrumentado; no se agrega un emisor duplicado. Se refrescaron **80/80 unitarias** y **16/16 Chromium**, sin fallos/saltos:27clics, navegación, teclado/SVG, payload controlado, consentimiento/revocación y ausencia de duplicados. JS y receptor conservan hashes aprobados. Sigue pendiente conectar el receptor/dimensiones y comprobar recepción real en GA4; las pruebas usan publisher simulado y pixel VM. Theme Check318archivos/cero observaciones y diff limpio. Revisión independiente acotada Approved sin hallazgos; solo lectura por responsabilidad, sin aislamiento técnico.

Links SHA256 `001c7a40625e720165aae9d68ccdb7dd6b656b14aeb25f0773f7bb4954dcdd43`; CSS `7a0955fc0ee9747a32e95cfa614e070392e5ae6d4462ab9d4424f638ef9f30c9`. Sin subida ni publicación Shopify.

## Raster editorial con zonas señaladas

08-11-2026. Miguel aprobó la nueva dirección raster de grafito y acuarela digital y pidió destacar las áreas de ajuste. Se generaron tres vistas individuales con `image_gen` integrado, a partir de la lámina aprobada, y se integraron como fallback de la sección de ajuste. [Masters, prompts y manifiesto](../../design/face-guide-proposal/raster-fit-marked-v1/README.md). Los anillos lemon destacan apoyo del puente sobre la nariz, separación entre aro/pómulo y curva de la patilla detrás de la oreja; no añaden medidas ni garantías de calce. Títulos y explicación siguen en HTML.

[Móvil390](raster-fit-marked-390.png) y [escritorio1440](raster-fit-marked-1440.png) vistos por raíz/implementador/revisor. Tres imágenes decodificadas, ningún SVG inline en ajuste, cabezas/cuellos/hombros completos, marcas legibles y sin overflow. `contain`8:5 y espacio reservado; lazy/alt vacío. Los tres selectores de imagen del editor mantienen prioridad. Los nueve WebP350/700/1400 suman246.180bytes y la serie700 suma50.316bytes. Los PNG de procedencia quedan en documentación, sin cargarse en el storefront. Los SVG previos se conservan como legado, fuera del render por defecto; las seis familias y siluetas canónicas del quiz se preservan.

Resultado final: **83/83 unitarias** y **16/16 Chromium**, sin fallos/saltos. Cobertura nueva: prioridad de cada imagen del editor, decode real de las nueve variantes, tres viewports390/820/1440 sin JavaScript, reserva estable antes/después de carga, sin SVG inline en ajuste. Se corrigió una aserción de prueba sobre redondeo de dimensiones intrínsecas CSS de `srcset`; los archivos/implementación no tenían ese fallo. Theme Check319archivos/cero observaciones, schema30settings y diff limpio. Inventario599rutas únicas. Revisión independiente Approved sin hallazgos; solo lectura por responsabilidad, sin aislamiento técnico.

Sección SHA256 `793ff04aaa7d38ad688438481ca9936d0e1ded1fc37a13ad890d323b9621dfad`. Analytics y su receptor, filtros, locales y CTAs conservan sus fuentes revisadas. Las pruebas locales no acreditan render alojado/editor Shopify, ajuste físico de productos, publicación ni recepción GA4; esos pendientes se mantienen.

## Enlaces de texto y resaltado suave

08-11-2026. Por petición de Miguel, las seis salidas de familia «Ver armazones» pasan a enlaces de texto navy subrayados, sin fondo ni borde de botón. Se centran bajo750px y se alinean a la izquierda desde750px. Conservaron href, filtros, overrides, metadata de Analytics, área de toque mínima44px y foco de teclado. El botón del banner final conserva su presentación.

El contorno procedía de `*:focus-visible`/`.focused` de Dawn al enfocar cada artículo con `tabindex=-1`. El ajuste se limita a `.lemoon-face-guide__family:focus`/`.focused`: sombra navy10%, sin outline en modo normal. Los enlaces mantienen su contorno2px; en colores forzados el artículo usa Highlight2px porque las sombras no se muestran. No se añaden JavaScript ni estados de selección persistentes.

[Móvil390](text-link-shadow-390.png) y [escritorio1440](text-link-shadow-1440.png), capturas del módulo con margen para ver la sombra, inspeccionadas por coordinación. Comprobación local a320/390/749/750/820/1440:36enlaces y36destinos de ancla con alineación correcta, fondo transparente, subrayado, targets44+, sombra, foco de enlace, colores forzados y banner conservados. Sin elementos de la guía fuera del viewport. A320 el shell de announcement-bar heredado tiene2px de overflow por su slider-button; se documenta como límite ajeno al delta, sin cambiar header. En los demás anchos tampoco hay overflow de documento.

Se refrescaron **16/16 Chromium** sin fallos ni saltos, incluidos navegación a filtros, teclado y27eventos. Las83unitarias de la integración raster son evidencia histórica, sin cambios de lógica o nuevas pruebas por este ajuste CSS. Theme Check319archivos/cero observaciones; diff limpio. Revisión independiente del delta **Approved / Ready to push**, sin hallazgos P1/P2/P3; hashes y baseline reconstruido, documentación y ambas capturas verificados. Solo lectura por responsabilidad, sin aislamiento técnico.

CSS SHA256 `3f78e36b0c7b2cba1af8e86294450a9bcb8206ba30481b69816b9ee82fffa438`; snippet de enlaces `9cced699fc91dea0be87af15792a031fdd9952ac4c9f35f44de69f0825219c96`. Assets raster, sección, Analytics y receptor no cambian. Alcance local, sin subida ni publicación Shopify ni activación GA4.

## Estrella sin contorno azul

08-11-2026. Por petición de Miguel se añade únicamente `stroke:none` al primer path del icono de cabecera, conservando relleno lemon, tamaño, disposición y las cruces decorativas. El icono compartido no cambia. [Móvil390](star-no-outline-390.png) y [escritorio1440](star-no-outline-1440.png): comprobación local de estilos calculados, fill #F7E600 y stroke none en ambos anchos. Captura móvil inspeccionada; Theme Check319archivos/cero observaciones. Sin cambios de navegación, assets raster ni Analytics; pruebas funcionales previas históricas. Diff limpio. Sin upload ni publicación Shopify.

## Preparación del PR

08-11-2026. Revalidación previa al commit del conjunto: **553/553 unitarias en48archivos** y Theme Check319archivos/cero observaciones. La última ejecución de navegador de esta guía pasó16/16Chromium tras los enlaces textuales y la sombra; el ajuste posterior de `stroke:none` es exclusivamente decorativo y se verificó en el navegador a390/1440. `git diff --check` limpio. Rama alineada con origin/main al preparar la entrega. La revisión humana, publicación/metadata Shopify y activación/recepción GA4 conservan sus gates separados.
