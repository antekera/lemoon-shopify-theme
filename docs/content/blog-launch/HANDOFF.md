# LEM-109 / LEM-110 — entrega para revisión

Fecha: 01-11-2026. Rama: `miguelantekera/lem-109-shopify-blog-listado`. Base: `b0c3168b61e8be6ecad638f6bc1824e5125cb120`. Cambios locales sin commit ni push.

## Resultado

### Fechas, carrusel y newsletter navy — 02-11-2026

Solicitudes adicionales del usuario: ocultar fechas visibles, añadir carrusel de productos en la nota y reemplazar en blog/artículo la newsletter cálida por la tarjeta navy anterior.

- Guardado en el editor del tema activo 155307737256: blog predeterminado `show_date=false`; bloque título de artículo predeterminado `blog_show_date=false`; nueva sección de Destacados Lemoon después del artículo, colección Ópticos, ocho productos, título «Encuentra tu próximo par», enlace «Ver armazones», sin quick-add ni carga diferida. Verificación storefront: cero elementos time en ambos main; ocho productos y flecha derecha cambia scrollLeft de 0 a 1102. Captura `/tmp/lemoon-article-carousel.jpg`. La colección incluye productos de muestra existentes; no se alteraron catálogo, precios ni disponibilidad. Los templates locales predeterminado/editorial reflejan la configuración; el template editorial oculto no se modificó en el editor remoto.
- Newsletter navy implementada y revisada localmente, **pendiente de publicación de código**: `sections/footer.liquid` y nuevo `assets/section-lemoon-editorial-newsletter.css`. Un único formulario del footer, solo variante editorial en blog/article, con consentimiento requerido desmarcado; otras páginas conservan su presentación. No cambia la entrega de correo. Vista local: `/tmp/lemoon-newsletter-navy-preview.jpg`.
- Se leyó el footer activo mediante pull dirigido a `/tmp/lem109-live-footer-kk3aru`, sin tocar el workspace. Su exclusión reciente para Nosotros se preservó exactamente. Hash base remoto: `dbc8105814fbdca2fda10ed9f08f491b0b033017d98a8c78c1cb120fcab3a78c`.
- La revisión inicial fijó hashes previos; las correcciones posteriores de breadcrumb, alineación y foco se identifican mediante el commit de entrega. Revisión independiente Approved, incluida comparación con snapshot remoto. Revisor con responsabilidad de lectura, sin aislamiento técnico.
- Pruebas: 327/327 unitarias antes de integrar el guard de Nosotros; después 37/37 focalizadas, incluido guard y footer cálido sin cambios. Navegador local: Chromium 41/41; Firefox/WebKit 12/12. Se detectaron y corrigieron foco navy sobre navy y presupuesto CSS de home; foco final mediante borde reservado transparente de 2px que cambia a lemon, forced-colors Highlight; el nodo CAPTCHA fuera de la grilla evita el salto de 12px, CSS editorial cargado solo en blog/article. Theme Check final del coordinador: 291 archivos sin infracciones. Diff limpio. No se empujó código al tema ni se cambió su protección por contraseña.

### Publicación y ajustes del blog — 02-11-2026

El usuario autorizó expresamente publicar las cuatro notas. [Lectura de retorno](shopify-publication-readback.json): las cuatro publicadas y los cuerpos/resúmenes preservados. El borrador anterior ajeno al lote no se publicó. El manifest refleja el estado publicado.

En el editor del tema activo `lemoon-shopify-theme/main` (155307737256) se guardó `show_newsletter=false` en el blog predeterminado; en su editor de idioma se cambiaron la etiqueta superior y el enlace del artículo de Journal a Blog. Se verificó el storefront con ese tema seleccionado: cuatro notas, etiqueta Blog y solo newsletter del footer. Se actualizaron también los dos templates locales de blog y las claves es/en. No se ejecutó un push del tema local ni se publicaron los cambios previos de las secciones Liquid. La vista previa del navegador estaba inicialmente en el tema borrador LEM-108 (189663019176); ese tema no se editó.

Prueba real del newsletter del footer con el correo indicado por el usuario: POST aceptado, `customer_posted=true`, mensaje «Gracias por suscribirte.». Shopify devuelve el registro con tag newsletter, estado SUBSCRIBED y SINGLE_OPT_IN; la fecha de consentimiento ya era 31-10-2026, por lo que el ensayo no prueba un alta nueva. No se alteró ni reinició ese consentimiento. No se confirmó recepción de un correo: Messaging quedó en blanco incluso después de recargar y Mail/iCloud seguía sincronizando; la búsqueda acotada al remitente Lemoon no mostró un nuevo mensaje en ese momento. No se afirma ausencia de una automatización por no poder inspeccionarla.

Verificaciones locales de estos ajustes: Theme Check, 290 archivos sin infracciones; 19 pruebas unitarias de blog/artículo aprobadas. Captura del storefront Shopify: `/tmp/lemoon-blog-publicado.jpg`. La tienda conserva su protección por contraseña; publicar artículos no modifica esa configuración.

### Retiro del disclaimer — 02-11-2026

Por solicitud expresa del usuario se retiró el disclaimer de ilustración de los cuatro cuerpos en Shopify y de los HTML locales. El manifest ya no define un caption visible. La [verificación posterior](shopify-caption-removal-readback.json) confirma que ese párrafo fue el único cambio en Shopify y que los cuatro artículos siguen ocultos; se preservaron los demás campos. Los respaldos anteriores conservan el texto histórico. Manifest actual: `7ab6be3ddefb08887e11632aeb2185a5c94b5624711861fa27f0c0bb3c268c18`.

### Ajuste editorial — 02-11-2026

Se reescribieron los cuatro artículos tras el doble chequeo de estilo: medidas sin repeticiones, tres looks completos con prendas/colores/ocasión, almacenamiento breve y una historia cat-eye centrada en su origen. Se eliminaron el mínimo artificial de palabras, los ejercicios genéricos y los cierres repetidos. Los cuerpos tienen 244/326/212/217 palabras, incluido el crédito de imagen.

La segunda revisión independiente aprobó la versión corregida como borrador, sin hallazgos pendientes, después de volver a consultar las fuentes. Se actualizaron los cuatro artículos existentes en Shopify: cuerpo, resumen y SEO; las propuestas sociales se ajustaron en el manifest local. La [lectura de retorno editorial](shopify-editorial-readback.json) confirma los cuerpos, extractos y SEO, los cuatro ocultos y los títulos, handles, categorías, imágenes y templates preservados. [Respaldo anterior](shopify-editorial-before.json). Sigue pendiente la revisión humana; no se publicaron artículos, redes ni tema.

La evidencia de pruebas de tema que sigue corresponde a la implementación anterior y no se volvió a ejecutar para este cambio exclusivo de contenido. En esta revisión se comprobó HTML balanceado, enlaces HTTPS, resumen/manifest, crédito único y lectura de retorno real de Shopify. La revisión editorial no tuvo aislamiento técnico de permisos.

El blog de Shopify se llama **Una nueva mirada** y conserva `/blogs/news`. Se actualizó su título y descripción SEO. Se preservó el artículo anterior oculto. Se crearon cuatro artículos nuevos, todos **ocultos**, editables en Shopify, con imagen destacada original, alt, extracto, categoría, fuentes y metadata SEO. No se programaron publicaciones ni se enviaron piezas sociales.

| Entrada editable | Categoría |
| --- | --- |
| [Qué significan los números de tus lentes](https://pzsrt4-1u.myshopify.com/admin/articles/635166687400) | Elegir tus lentes |
| [Un armazón, tres formas de llevarlo](https://pzsrt4-1u.myshopify.com/admin/articles/635166720168) | Estilo |
| [Cómo guardar tus lentes cuando sales](https://pzsrt4-1u.myshopify.com/admin/articles/635166752936) | Cuidado |
| [De dónde vienen los marcos cat-eye](https://pzsrt4-1u.myshopify.com/admin/articles/635166785704) | Historias |

## Templates y CMS

Los templates `blog.json`/`blog.editorial.json` y `article.json`/`article.editorial.json` ya seleccionaban las secciones correctas; no necesitan duplicación. Los artículos nuevos usan el template predeterminado. Las secciones actualizadas consumen los objetos nativos de Shopify; los cuerpos no están incrustados en Liquid ni requieren un cambio de tema por cada publicación.

- Listado: título del blog CMS, destacado con categoría/extracto, categorías dinámicas, grilla 3/2/1, paginación, recuperación por etiqueta y composición con una sola entrada.
- Detalle: título, bajada, fecha/autor configurables, lectura estimada, hero y cuerpo responsive, figuras/créditos, video YouTube/Vimeo 16:9, compartir y retorno. Hasta tres lecturas del mismo blog priorizan etiquetas compartidas, excluyen el artículo actual y no duplican resultados. Se conservan comentarios nativos.
- Los embeds se agregan al HTML de Shopify con título accesible, sin autoplay y con fuente/enlace alternativo. Ningún video es obligatorio para estos cuatro artículos ni se agregó una URL ficticia.
- Las imágenes son ilustraciones conceptuales creadas con IA; no representan productos del catálogo ni artefactos históricos. [Origen, prompts y CDN](assets/README.md).
- [Manifest editorial y propuestas sociales](articles.json); [investigación](../2026-11-01-blog-launch-research.md).

## Evidencia

- [Lectura de retorno Shopify inicial](shopify-readback.json), anterior a los ajustes editoriales; la versión actual se verifica en [lectura de retorno editorial](shopify-editorial-readback.json).
- [Metadata del blog verificada](shopify-blog-metadata.json).
- Theme Check: 286 archivos, cero infracciones, `SHOPIFY_FLAG_NO_INPUT=1 shopify theme check --fail-level error`.
- `npm run test:unit`: 39 archivos y 315 pruebas aprobadas. Journal: 19 unitarias focalizadas; `npx playwright test tests/e2e/journal-editorial.spec.js`: 9/9 Chromium; `npx playwright test --config playwright.cross-browser.config.js tests/e2e/journal-editorial.spec.js`: 18/18 Firefox/WebKit.
- Las pruebas de journal renderizan Liquid real de secciones/snippets con adaptaciones explícitas de filtros/tags Shopify. Las pruebas incluyen CMS/escape, contenidos vacíos, paginación, imágenes presentes/ausentes, relacionados, medios, títulos largos, teclado y geometría a 390/749/750/989/990/1280px.
- Inspección adicional con los cuerpos e imágenes devueltos por Shopify: listado y artículo a 390/1280px, sin overflow, todas las imágenes cargadas y con tamaño visible, un título visible por tarjeta. Capturas locales: `/tmp/lem109-110-preview/{blog,article}-{390,1280}.png`. Es composición local del contenido leído, no render del storefront Shopify.
- Revisión independiente de código: Approved; convenciones: Ready to push; contenido/fuentes/ilustraciones: Approved as draft. Revisores con responsabilidad de solo lectura y permisos heredados; no hubo aislamiento técnico impuesto.
- `git diff --check` limpio. El validador auxiliar del plugin Shopify no pudo iniciar por falta de `@shopify/theme-check-common`; se ejecutó el Theme Check instalado, sin modificar dependencias.

## Límites y siguiente revisión

Las modificaciones Liquid y CSS de esta rama siguen locales; los ajustes de fecha y carrusel se guardaron directamente en el editor del tema activo. No hay una vista previa Shopify que integre todo el código pendiente. Figma tiene nodos registrados, pero la cuota Starter del conector impidió volver a inspeccionarlos; se aplicó el diseño aprobado en conversación sobre la familia existente.

Las cuatro entradas fueron publicadas por instrucción del usuario y son editables en Shopify. La tienda conserva protección por contraseña. La cadencia sugerida es quincenal; los textos sociales son propuestas, sin programación. Los tickets permanecen In Progress: no se reclama cierre ni preparación final de producción sin revisar el resultado integrado en una vista previa Shopify.

## Hashes de entrega

- main-blog.liquid: `42e505576076dcefb801beb37bd5f15d962cab2042caf34c8c6fa2c570728419`
- main-article.liquid: `185283dda73788c1ddb0f299cbc4a363d4e1169070f1bcb7a61bbc32a9605aa5`
- articles.json, revisión editorial 02-11-2026: `dd327a68ab449f91672e2dfc157e7ece850bd771da88ee80bb6b5f2d140e5793`
