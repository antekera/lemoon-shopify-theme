# Guía, títulos y panel de ayuda

Familias: LM-TYPE, LM-ACTION, LM-LEGAL; shell/editorial/hero/footer/password conservan sus composiciones. Volver al [catálogo](../README.md).

## Fuente y uso

Consumidor: [lemoon-guide-page](../../../sections/lemoon-guide-page.liquid). Reutiliza [heading](../../../snippets/lemoon-ui-heading.liquid) para H1, pasos H2 y ayuda H2, y [action](../../../snippets/lemoon-ui-action.liquid) para navegación. El aside, el índice, los tres pasos y las rutas pertenecen a la sección: **no existe un snippet help-panel**. El shell legal, hero, footer y password se integran desde sus propias secciones, no copiando este aside.

`heading` recibe `text`, `level` (1–6, default 2), `id` y `class`; su nivel no elige tamaño visual. `action` distingue `element: 'a'` de botón (default, `type: 'button'`) y del submit input opt-in de comentarios (`element: 'input', type: 'submit'`). Sus variantes base son primary/default, secondary y tertiary. `style_family: 'local'` conserva las clases del consumidor sin `.button`; no convierte una CTA de guía en variante global.

## Ejemplo en la guía

Dentro de `lemoon-guide-page`, después de resolver `contact_url` desde las rutas existentes:

```liquid
{%- assign help_title = 'sections.lemoon_guide.help_title' | t -%}
{%- assign catalogue_label = 'sections.lemoon_guide.catalogue' | t -%}
{%- assign contact_label = 'sections.lemoon_guide.contact' | t -%}
{%- capture help_id -%}GuideHelp-{{ section.id }}{%- endcapture -%}
<aside class="lemoon-guide__help" aria-labelledby="{{ help_id | escape }}">
  {% render 'lemoon-ui-heading', text: help_title, level: 2, id: help_id %}
  <p>{{ 'sections.lemoon_guide.help_body' | t | escape }}</p>
  <div class="lemoon-guide__links">
    {% render 'lemoon-ui-action', element: 'a', href: routes.all_products_collection_url, label: catalogue_label, style_family: 'local', class: 'lemoon-guide__cta' %}
    {% render 'lemoon-ui-action', element: 'a', href: contact_url, label: contact_label, style_family: 'local' %}
  </div>
</aside>
```

Los textos pasados al snippet no llevan `escape`: se escapan en él. Los atributos y texto emitidos directamente por el consumidor se escapan allí. Este ejemplo compone piezas; no duplica sus implementaciones ni sus estilos.

## Dependencias, estados y comprobación

El [layout](../../../layout/theme.liquid) carga tokens, [base](../../../assets/base.css) y [componentes](../../../assets/lemoon-components.css). La sección conserva su CSS scoped, padding responsive y selectores descendientes; los snippets no necesitan un controlador nuevo. En password se conserva la cadena del layout password, sin asumir el orden del storefront normal.

La guía usa enlaces navegables en normal/hover/foco. Loading, error y selección no son estados de una guía estática. Si otro dueño solicita `disabled` o `loading` en action, el enlace pierde `href` y sale de tabulación; el botón queda deshabilitado nativamente. `aria_expanded`/`aria_pressed` sólo describen un toggle real y preservan `false`; no se añaden a CTAs de navegación. `form_id`, `name`, `value` y submit pertenecen a botones de formularios reales. `icon` reutiliza lemoon-icon (before/default o after); `show_spinner: false` omite el spinner incluso con loading, conservando el nombre accesible.

Conservar un H1, jerarquía de pasos, anclas `Guide-<section>-<step>`, `aria-labelledby` y destinos. Verificar foco, teclado, títulos largos y apilado a ambos lados de 750px. [guide-page.test.js](../../../tests/unit/guide-page.test.js) cubre contrato de guía; [component-library.test.js](../../../tests/unit/component-library.test.js) ejercita snippets reales con fixtures. La integración Shopify y la revisión visual requieren evidencia de la superficie; pasar estas pruebas no las acredita.

## Shell legal: títulos y ayuda

La plantilla [page.politica-de-privacidad.json](../../../templates/page.politica-de-privacidad.json) activa `kind: privacy` y `use_native_privacy: true`. Ese modo usa exclusivamente `shop.privacy_policy.body`, omite la introducción de la sección e ignora `page.content`, `demo_data` y `demo_content`. Si la política nativa está vacía, muestra el estado vacío localizado; no cambia silenciosamente a otra copia. La fecha permanece en el cuerpo aprobado de Shopify, justo después del título de la página. La publicación de la página CMS y los enlaces que la eligen se verifican por separado. El checkbox es opt-in y solo tiene efecto para privacidad; las otras plantillas y el modo CMS/demo conservan su comportamiento.

[lemoon-legal-page](../../../sections/lemoon-legal-page.liquid), usado por envíos, devoluciones, términos, privacidad y garantías, compone heading H1/H2 y action local para el enlace de ayuda. La sección resuelve el título CMS o título de privacidad demo, contacto configurado o ruta `/pages/contact` con root localizado, y conserva intro, CMS/política nativa y demo. El formato aprobado usa una sola columna centrada de hasta 66rem, cuerpo 1.6rem/1.6, H2 2.4rem y H3 2rem; no lleva eyebrow ni navegación lateral. No se convierte el help en un snippet wrapper. Los campos URL de políticas del schema quedan disponibles por compatibilidad con configuraciones guardadas, sin producir un sidebar. Una fecha de vigencia debe venir del contenido aprobado; no usar `page.updated_at` para inventarla. Pasar legal_title/help_title/contact_label sin escape al render; action escapa legal_contact_url una vez. [Pruebas legales](../../../tests/unit/legal-page.test.js) y [comparación DOM](../../../tests/e2e/component-adoption.spec.js) cubren estos contratos locales; sus cinco baselines legales reflejan la retirada de eyebrow/sidebar autorizada, sin probar templates activos de Shopify ni aprobación del contenido.


La plantilla adicional `page.legal` es opt-in. Para los handles de privacidad, términos, reembolso y envío toma exclusivamente el cuerpo nativo correspondiente; si falta o contiene marcadores conocidos sin resolver, presenta el estado vacío, sin fallback silencioso. El texto nativo se muestra sin sustituir marcadores: debe guardarse como contenido listo para checkout. Términos conserva índice accesible. Para garantías y otros handles usa `page.content`; el contenido debe migrarse a CMS antes de cambiar su plantilla. La asignación de páginas y publicación de políticas son pasos independientes.

## Nosotros, servicios y guía de cristales

[lemoon-about-page](../../../sections/lemoon-about-page.liquid) reutiliza heading para un único H1 y conserva un cuerpo richtext editable: relato continuo sin imagen, subtítulos, tarjetas ni acciones. Título y cuerpo vacíos usan los fallbacks localizados; padding y ancho de lectura permanecen locales. El carrusel posterior pertenece a su propia sección.

[lemoon-service-page](../../../sections/lemoon-service-page.liquid) y [lemoon-crystal-guide](../../../sections/lemoon-crystal-guide.liquid) reutilizan heading/action. Mantener H1/H2/H3, IDs de aria-labelledby, clases de enlaces, raíces localizadas, variantes de servicios y la condición de producto configurador en cada dueño. Usar action local para conservar clases específicas, incluida button cuando ya existía; no crear un shell de página o panel help universal. Richtext/CMS, imágenes y schemas permanecen locales.

## Redes sociales de password

[social-icons](../../../snippets/social-icons.liquid) mantiene `class` opcional y orden default facebook, instagram, youtube, tiktok, twitter, pinterest, snapchat, tumblr, vimeo. El nuevo `order` es una lista de nombres soportados separados por coma; se resuelve contra settings.social_<network>_link y omite redes sin URL. Sólo admite las nueve redes existentes.

[main-password-footer](../../../sections/main-password-footer.liquid) reutiliza el snippet con su orden histórico explícito; no reemplaza el footer ni sus textos Shopify:

```liquid
{% render 'social-icons', order: 'twitter,facebook,pinterest,instagram,tiktok,tumblr,snapchat,youtube,vimeo' %}
```

Conservar component-list-social.css, SVG decorativos y etiquetas visually-hidden. El layout password carga dependencias propias. Las [pruebas de consumidores](../../../tests/e2e/consumer-contract.spec.js) comparan orden/semántica local; no comprueban disponibilidad de perfiles ni configuración efectiva del tema activo.

## Guía visual por rostro (LEM-103)

`templates/page.guia-rostro.json` usa exclusivamente [lemoon-face-guide](../../../sections/lemoon-face-guide.liquid). Reutilizar heading/action y [lemoon-quiz-visual](../../../snippets/lemoon-quiz-visual.liquid) con `group: shape`, exactamente el arte del paso Forma del quiz, con [CSS local](../../../assets/lemoon-face-guide.css); no copiar el shell a las otras guías. Seis bloques `family` editan nombre, dos pistas, motivo, imagen/alt y dos valores nativos de forma. Los campos vacíos recurren a locales en/es y a los seis retratos originales. El preset crea las seis familias; el editor puede reordenarlas. Los PNG generados se entregan como WebP: maestros de 1254px para procedencia y derivados responsive `lemoon-face-<familia>-v1-{180,360,640,960}.webp`; miniaturas 180/360, retratos 360/640/960, con dimensiones intrínsecas y `sizes`. Las imágenes de ajuste también son reemplazables; `image_picker` conserva prioridad. El fallback aprobado usa tres ilustraciones raster editoriales con marcadores lemon para puente, pómulos y patilla/oreja; las leyendas HTML llevan el consejo completo. Son educativas y no fotografías de productos o SKUs.

`lemoon-face-guide-links` recibe `block`, `shape_filter` real, `catalogue_url` localizada, `guide_settings`, `instance_id: section.id`. Mapea los valores nativos a los códigos canónicos del quiz: `rectangular`, `round`, `geometric`, `oval`, `aviator`, `cat-eye`; cada render recibe `visual_id` por sección/bloque/posición. El wrapper visual es decorativo y la etiqueta sigue en HTML. Comprueba ambos valores en `filter.values` antes de componer parámetros repetidos de `filter.param_name` con `url_encode`. Si falta uno, CTA al catálogo sin selección y ayuda explícita; los ejemplos individuales solo enlazan valores existentes. Un destino personalizado usa texto neutral, editable, sin prometer filtros. El CTA predeterminado de cada familia dice «Ver armazones»/`View frames`, manteniendo el override editable y su combinación de filtros. El enlace de vuelta al índice, sus parámetros/settings y el wrapper de fila fueron retirados por petición del usuario; la ayuda de fallback queda después del CTA. No añadir metacampos de rostro ni modificar el quiz.

Conservar H1 único, módulos `article` con H2, anclas `FaceFamily-<section>-<block>`, `block.shopify_attributes`, pistas visibles, retratos `contain` con espacio reservado, 16px de cuerpo, targets 44px, foco, forced-colors y recorrido sin JS. El índice y las familias aceptan foco de fragmento; comprobar Atrás/Adelante, edición de filtros en PLP y retorno al contexto de guía en el storefront. La plantilla local no demuestra asignación CMS o publicación.

El único banner de ayuda «¿No reconoces tu forma?» cierra la sección después del ajuste con el token verde existente `--lemoon-surface-tertiary-green`, autorizado solo para este cierre. Sus textos y enlaces catálogo/quiz siguen editables, incluido `catalogue_url`. Se retiraron `final_title` y `final_body` al desaparecer el cierre anterior; el template no guardaba esos valores.

### Publicación de clics de la guía

[lemoon-face-guide.js](../../../assets/lemoon-face-guide.js) se carga como módulo únicamente desde esta sección. `initializeFaceGuideTracking(environment)` instala un handler delegado de `click` y `auxclick` por documento, protegido por `Symbol.for('lemoon.faceGuideTracking')`; un reload de sección reutiliza la delegación y puede solicitar la API de privacidad. El clic primario incluye teclado; el botón medio se procesa solo por `auxclick`. No se usa `preventDefault`, espera de red, almacenamiento de clics ni replay tras consentimiento. Un ejemplo de forma disponible envuelve el SVG decorativo y su label HTML escapado en un único enlace; no hay anclas anidadas o duplicadas. Heading y CTAs conservan los átomos canónicos.

El root lleva `data-face-guide`; los padres de controles llevan `data-face-guide-action`, `data-face-guide-position`, `data-face-guide-destination` y, cuando corresponde, `data-face-guide-family`. Formas individuales usan `data-face-guide-frame` (valor nativo); el CTA nativo completo expone `data-face-guide-shapes` como dos valores separados por `|`, únicamente cuando ambos existen y no se configuró un destino personalizado. Estas entradas pasan por allowlists en `buildFaceGuidePayload(anchor)`; nunca se leen `href`, labels, queries ni datos del visitante.

`publishFaceGuideClick(anchor, environment)` comprueba `Shopify.customerPrivacy.analyticsProcessingAllowed() === true` en cada intento y publica `lemoon:face_guide_click`. Su booleano indica intento, no recepción Shopify/GA4. La API se solicita mediante `Shopify.loadFeatures([{name: 'consent-tracking-api', version: '0.2'}], callback)`; si falta, se omite el clic actual sin esperar ni reemitir. Errores síncronos y rechazos de publicación se absorben para conservar navegación. No reutilizar `currentVisitorConsent()` como sustituto del permiso regional.

Payload fijo: `guide_id: face_shape`; `action`: `face_index/frame_shape/family_catalogue/measure/catalogue/quiz`; `link_position`: `index/family/fit/closing`; `destination`: `face_family/filtered_catalogue/catalogue/measure_guide/style_quiz/custom`. Las tres primeras acciones llevan `face_family` (`oval/round/square/heart/diamond/long`). Un ejemplo individual añade `frame_shape`; un CTA con dos filtros nativos añade `selected_shapes` de exactamente dos códigos distintos `round/rectangular/geometric/oval/aviator/cat-eye`. Un fallback o destino personalizado no promete selecciones. La familia es una elección editorial del enlace, no una inferencia biométrica del visitante.

La entrega del tema no activa el receptor GA4. Consultar [Customer Privacy API](https://shopify.dev/docs/api/customer-privacy) y [emisión de eventos](https://shopify.dev/docs/api/web-pixels-api/emitting-data). Context7 no proporcionó snippets de estas APIs en esta entrega; la sintaxis se verificó contra esas fuentes oficiales. Activación Shopify, consentimiento real y recepción GA4 se verifican aparte.

El fallback raster usa `assets/lemoon-fit-{bridge,cheek,temple}-editorial-v1-{350,700,1400}.webp`: src700, width700/height438, `srcset`350/700/1400, `sizes: (min-width: 750px) 30vw, 90vw`, loadinglazy y alt vacío. Conservar el panel8:5 y `object-fit:contain`, sin recorte. Los anillos señalan zonas de observación; no trasladar los títulos o consejos al raster ni prometer ajuste por ver una ilustración. Los seis retratos de familias y las monturas compartidas con el quiz mantienen sus assets propios.

Referencia anterior: `lemoon-face-guide-illustration` se conserva íntegro como fuente SVG histórica, sin render desde el fallback actual. No borrarlo por ausencia de consumidor estático ni reutilizar sus detalles de geometría como contrato del raster. Sus gradientes/IDs y las iteraciones de cuello/ojos permanecen en el archivo de referencia.

El acento lemon queda limitado al `sparkles` canónico de `lemoon-icon` junto al H1, renderizado con `icon: sparkles`, `size:32` y sin `label`. `.lemoon-face-guide__intro-accent` lo presenta a32px desktop/28px móvil: primer path cerrado en accent sin contorno (`stroke:none`) y segundo path de cruces navy1.1 sin relleno. El span es decorativo, sin interacción; el helper produce aria-hidden y focusablefalse. Wrapper heading flex/gap12 y H1 min-width0/overflow-wrap evitan overflow sin cambiar tipografía. La prueba de botones amarillos se retiró: familias y cierre usan navy/blanco/hoverprimario. No añadir variantes globales al action ni modificar el icon compartido. Forced-colors mantiene Canvas/LinkText en botones y CanvasText/Highlight en el icono.

`.lemoon-face-guide__family-actions` conserva el wrapper de `data-face-guide-action="family_catalogue"`: flex/center bajo750px y flex-start desde750px. Su único enlace mantiene `.lemoon-face-guide__cta` y añade `.lemoon-face-guide__cta--text`: texto navy subrayado con fondo transparente normal/hover, sin borde/radio y target44px mínimo. El CTA del banner conserva su estilo filled. Mantener metadata, href/filtros y hint fuera del wrapper; no hay nuevo emisor de analytics.

El artículo mantiene `tabindex=-1` para navegación por fragmento. Dawn `assets/base.css:733–743` aplica outline/halo global a `*:focus-visible` y `.focused`; la guía lo reemplaza únicamente en `.lemoon-face-guide__family:focus/.focused` por sombra suave usando el token de texto navy10% y espacios existentes4px/20px. No usar focus-within ni quitar foco a los enlaces. En forced-colors, restituir outline2px Highlight y retirar sombra; así el foco del artículo sigue perceptible cuando las sombras no se pintan.
