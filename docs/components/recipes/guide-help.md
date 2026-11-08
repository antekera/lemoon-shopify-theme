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

## Guía educativa de medidas

El modo `measurements` de `lemoon-guide-page` mantiene el índice, las anclas y la ayuda de familia, con H1 desde `page.title` (fallback localizado). Sus campos `measurements_intro`, `measurements_step_{1,2,3}_title`, `measurements_step_{1,2,3}_body` y `measurements_help_body` pertenecen al editor de la sección y se ignoran en las otras cuatro guías. Intro/cuerpos/ayuda son richtext sin wrapper `<p>` adicional; un valor vacío o compuesto solo por espacios/párrafos vacíos usa el fallback localizado. El título de página y SEO permanecen en sus campos nativos.

Reutilizar los recursos compartidos, sin un SKU de ejemplo:

```liquid
{% render 'lemoon-size-guide-comparison', instance_id: comparison_instance_id, show_heading: false %}
{% render 'lemoon-frame-measurement-diagram', instance_id: measurement_instance_id, label: diagram_label %}
```

`lemoon-size-guide-comparison` admite `heading_level` (2 por defecto), `show_heading` (true salvo false explícito) y `compact` (false). Muestra código educativo 52 □ 18–145, tres segmentos con énfasis semántico/subrayado, miniiconos decorativos y texto HTML. No recibe producto ni consulta catálogo. `lemoon-frame-measurement-diagram` recibe `instance_id` y descripción `label`; emite vistas con títulos accesibles únicos, referencias A–E y figcaption sin escala. Las cifras reales pertenecen exclusivamente al consumidor `lemoon-frame-dimensions`.

La sección carga `component-lemoon-size-guide.css` solo en measurements. No crea un diálogo ni una herramienta para medir en pantalla. La página usa los destinos de catálogo/contacto de la familia y no vuelve a un producto arbitrario. Verificar template asignado y contenido editable real en Shopify aparte de los fixtures locales; la existencia de `page.guia-medidas.json` no acredita esa asignación.

La forma vigente usa Donnalyn ZJGT372549-04, referencia elegida por el usuario: aperturas cuadradas altas, esquinas suaves amplias, puente sencillo y patillas curvadas, redibujadas desde frontal y tres cuartos. Conservar IDs por instance_id para títulos/gradientes/paths y margen al 200 %. A–E y las definiciones HTML describen magnitudes del producto, no cifras del referente. No incrustar fotos, logos, estampado ni valores comerciales.
