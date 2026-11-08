# Guía de medidas PDP y página — propuesta de diseño para desarrollo

Estado: **implementación autorizada por Miguel, pendiente de revisión humana del resultado**, 07-11-2026. Alcance solicitado: preparar LEM-129 (modal PDP) y LEM-105 (`/pages/como-medir-tus-lentes`), con Zeelool como referencia principal. No autoriza merge, carga de catálogo ni publicación. La composición implementada se registra en `DESIGN.md`, que conserva el contrato visual y la fuente de tokens. Esta especificación mantiene la trazabilidad de la propuesta autorizada.

## 1. Fuentes y decisiones

### Confirmado

- Miguel eligió [Zeelool Grover / Size Chart](https://www.zeelool.com/goods-detail/ZJGT078897-02) como referencia principal. La investigación del coordinador comprobó en escritorio apertura, captura y conversión de unidades: contenido en bloques continuos, diagramas frontal/lateral y lectura visual del código de patilla. No se verificaron móvil, teclado ni foco del competidor.
- `DESIGN.md`, `docs/design/brand-guidelines.md`, `docs/design/brand-strategy.md`, inventario de secciones y recetas `product-card-grid.md` / `guide-help.md` gobiernan identidad y reutilización.
- Existe el contenido compartido `lemoon-size-guide-content`, el dibujo/lista `lemoon-frame-dimensions`, dos adaptadores de diálogo y una página `lemoon-guide-page` con tres pasos. La plantilla `page.guia-medidas.json` ya declara `guide_kind: measurements`.
- Lectura Shopify comunicada por el coordinador en esta preparación: página `161807204520`, handle `como-medir-tus-lentes`, publicada desde 04-10-2026, título «Cómo medir tus lentes», **templateSuffix vacío** y dos párrafos genéricos. La plantilla del repositorio aún no está asignada a esa página. Contacto `121882443944`, handle `contact`, publicado y template `contact`. Asignar/actualizar páginas es una etapa de integración autorizada por separado, no una acción realizada por este documento.
- Los datos auditados están en [la auditoría Shopify](../../content/2026-11-07-size-guide-data-audit.md); los patrones y recursos observados, en [el estudio del modal](../../content/2026-11-07-size-guide-modal-research.md) y [el estudio internacional](../../content/2026-11-07-size-guide-international-research.md).

### Discrepancias y límites

- Zeelool usa un modal centrado; Lemoon tiene drawer lateral de máximo 480px. **Se propone conservar el shell Lemoon y adaptar la composición interior**, sin otro motor de diálogo ni un cambio global de radios/anchos.
- La tabla Zeelool no es un contrato de tallas Lemoon. Se omite en ambas superficies. Talla textual, presencia visual y medidas numéricas no son intercambiables.
- La guía actual usa textos de traducción y no expone contenido editable en el editor. LEM-105 exige añadir edición acotada a `measurements`, sin alterar las otras cuatro guías.
- `DESIGN.md` localiza la familia Figma Modal `33:14`; no hay en esta preparación un nodo específico de guía de medidas confirmado. No se atribuye una inspección nueva a Figma ni se importan valores del modal genérico de compra.

### Propuesta que necesita aceptación

Dentro del drawer, lectura continua de **medidas → cómo compararlas → características disponibles**. El contenido inline de PDP conserva sus pestañas actuales. La página desarrolla el mismo lenguaje gráfico en tres pasos educativos. Se proponen ilustraciones originales, no activos de Zeelool.

## 2. Modal de PDP: composición

Reutilizar el `<dialog>` y sus openers de PDP estándar y óptica. Apertura sin navegación, cierre visible, Escape, retorno al opener, ciclo de foco, bloqueo de scroll exterior y movimiento reducido permanecen bajo los dueños actuales.

Orden dentro del diálogo:

1. H2 «Guía de medidas» y nombre del producto como contexto secundario escapado; sin repetir precio ni acciones de compra.
2. H3 «Medidas de este armazón», selector mm/pulgadas y dibujo frontal/lateral con referencias A–E. Debajo, lista HTML de las medidas disponibles. mm inicial; cambiar unidades solo convierte esta lista, no el código educativo ni otros bloques de PDP.
3. H3 «Compara con tus lentes»: patilla ilustrada, inscripción educativa y tres filas de explicación (miniicono, código con segmento destacado, nombre/definición). El ejemplo se identifica antes del gráfico y nunca sustituye las cifras del producto.
4. Características y datos declarados de ajuste como dos listas bajo H3, solo cuando haya datos. Mantener forma/material/peso/género y talla/clasificación de ancho/rostros declarados que antes existían en las pestañas; no trasladarlos a recomendaciones automáticas ni borrar datos al retirar las pestañas del diálogo. La advertencia de ajuste acompaña a la segunda lista. Sin datos, omitir estas secciones secundarias; el vacío principal de medidas sigue visible.
5. Enlace «Cómo medir tus lentes» a la página válida y canal de ayuda existente. El enlace no es necesario para entender las cifras ni sustituye la ayuda breve dentro del modal.

El modo continuo se activa mediante `presentation: 'dialog'` en `lemoon-size-guide-content`. Su modo por defecto conserva `tablist/tab/tabpanel` para los consumidores inline. No esconder pestañas con CSS: el modo de diálogo emite encabezados y secciones semánticas sin roles de tab ni controles invisibles.

### Estados de datos

| Entrada | Presentación |
| --- | --- |
| Cinco números positivos conocidos | Diagrama/lista completos; sin promesa de escala o calce. |
| Datos parciales | Solo filas/cifras válidas; las referencias visuales no aportan números ausentes. Mostrar aviso breve de información parcial. |
| JSON vacío, claves ajenas o todos inválidos | Mensaje localizado sin selector ni lista vacía; la ayuda educativa sigue disponible. |
| Etiqueta de talla sin JSON | Mostrar la etiqueta declarada en su sección; no reconstruir `frame_dimensions` desde ella. |
| Sin información secundaria | Omitir listas secundarias, conservando medidas/ayuda/cierre. |

Validación actual: `frame_width`, `lens_width`, `bridge`, `lens_height`, `temple`; números JSON positivos, no texto numérico coercionado. Se mantiene el contrato auditado. No crear metaobjects ni usar los del quiz para esta función.

## 3. Página guía: lectura educativa y edición

Mantener ruta `/pages/como-medir-tus-lentes` y template `page.guia-medidas.json`; verificar después su asignación real en Shopify. No seleccionar un producto representativo ni leer datos de Dalton para la página.

H1: `page.title` cuando exista; fallback de traducción del modo measurements. El título se edita en la página Shopify, sin un segundo override de título. Intro del editor o fallback localizado. Metadata SEO se mantiene en los campos nativos de la página; no derivar SEO del nombre de un producto.

Conservar la familia existente: índice de tres pasos, anclas, cuerpo de pasos y panel final de ayuda. Para measurements, el hero contiene título e intro; retirar su figura genérica duplicada y colocar las ilustraciones en el paso que explican. Los demás `guide_kind` conservan markup, textos, hero y comportamiento actuales.

| Paso | Contenido y recurso |
| --- | --- |
| 1. Leer la patilla | Tres números y significado; reutiliza el bloque de comparación sin repetir su H2. Los números se presentan como ejemplo educativo. Si el armazón no tiene inscripción legible, pasar al paso 2. |
| 2. Medir el armazón | Esquema original A–E, definiciones de las cinco magnitudes e instrucción con una regla real en mm. No se entrega una regla en pantalla o imprimible a escala ni una herramienta de medición por foto. La instrucción y las cotas bastan; no se añade un tercer recurso gráfico obligatorio. |
| 3. Comparar con la ficha | Comparar la misma magnitud y unidad, consultar datos disponibles en la PDP y pedir ayuda cuando falten. Sin calculadora de talla, tabla universal ni diagnóstico por rostro. |

Nuevos settings de sección, usados exclusivamente cuando `guide_kind == measurements`:

- `measurements_intro`: richtext.
- `measurements_step_1_title`, `measurements_step_2_title`, `measurements_step_3_title`: text.
- `measurements_step_1_body`, `measurements_step_2_body`, `measurements_step_3_body`: richtext.
- `measurements_help_body`: richtext.

Vacíos usan fallbacks locales aprobados; labels y defaults del schema localizados. El cuerpo richtext no se envuelve en otro `<p>`. Los gráficos, etiquetas y ejemplo estructurado pertenecen a componentes/traducciones y no se editan como HTML libre. Textos definitivos y SEO proceden del copywriter y requieren revisión; este documento no sustituye su entrega.

Mantener padding configurable y fórmula móvil de la sección. No agregar un aside paralelo ni una nueva FAQ para esta página. Ayuda resuelve la ruta existente `/pages/contact` con raíz localizada; catálogo usa `routes.all_products_collection_url`. No inventar teléfono, WhatsApp ni tiempos de respuesta.

## 4. Componentes compartidos y archivos

| Archivo | Responsabilidad / interfaz propuesta |
| --- | --- |
| Crear `snippets/lemoon-frame-measurement-diagram.liquid` | SVG original frontal/lateral con referencias A–E, sin números de producto incrustados. Inputs explícitos `instance_id` (string único), `label` (string descriptivo localizado). Un solo dibujo para PDP y guía. |
| Modificar `snippets/lemoon-frame-dimensions.liquid` | Conservar validación, selector y lista numérica; renderizar el dibujo compartido. Añadir `instance_id` al contrato y pasarlo desde los consumidores para asociaciones accesibles. |
| Crear `snippets/lemoon-size-guide-comparison.liquid` | Inscripción educativa, miniiconos y tres filas con un segmento destacado. Inputs: `instance_id` string, `heading_level` number (default 2), `show_heading` boolean (default true), `compact` boolean (default false). No recibe `product` ni consulta catálogo. |
| Crear `assets/component-lemoon-size-guide.css` | Estilos únicamente de dibujo/comparación compartidos; cargar una vez por superficie que los use. No nuevo JavaScript para gráficos estáticos. |
| Modificar `snippets/lemoon-size-guide-content.liquid` | Input opcional `presentation` (default `tabs`, alternativa `dialog`); dialog continuo, inline intacto. Reutilizar datos y listas existentes sin otro contrato de compatibilidad. |
| Modificar `snippets/lemoon-product-size-guide.liquid` y `sections/lemoon-eyewear-product.liquid` | Pasar `presentation: 'dialog'` e IDs únicos; mantener sus controles y límites de interacción. |
| Modificar `assets/lemoon-pdp-layout.css` | Composición local del contenido continuo, con aislamiento a la guía de medidas; no recolorear ni reformar compra/configurador. |
| Modificar `sections/lemoon-guide-page.liquid` y `templates/page.guia-medidas.json` | Aplicar la composición y edición solo a measurements; las otras guías retienen su contrato. |
| Modificar `config/settings_schema.json` | Conservar `lemoon_size_guide_page` y sus valores guardados; corregir su info para describir el enlace del modal a la guía completa, no la inserción del cuerpo completo. No borrar `lemoon_size_guide_placeholder` ni cambiar su uso legacy en los consumidores inline. |
| Modificar `locales/es.json` y `locales/en.default.json` | Labels, fallbacks, ayudas, unidad y alt/aria de storefront en ambos idiomas; es-CL visible en español. |
| Modificar `locales/es.schema.json` y `locales/en.default.schema.json` | Labels/info/defaults de schema del editor, incluidos nuevos settings y el info de `lemoon_size_guide_page`. No colocar traducciones del editor en los JSON de storefront. |
| Documentar en `docs/design/component-inventory.md/.json`, recetas y `DESIGN.md` | Registrar componentes y la excepción de composición una vez aprobada. No crear otro `DESIGN.md` paralelo. |

`instance_id` distingue producto, sección y ubicación (`dialog`, `inline`, `page`). Las dependencias CSS se cargan en los hosts actuales que ya cargan PDP tools/layout; no usar `@import` ni volver a incluir el diálogo dentro de la página.

Secuencia para el plan: componentes compartidos → contenido de modal → página measurements → integración y QA conjunto. Una entrega integrada puede usar el PR existente con aceptación separada de LEM-129 y LEM-105; no confundir la aprobación anterior de alcance con aprobación de esta nueva composición.

## 5. Lenguaje gráfico y medidas

Frontal limpio, lateral con curva de patilla, trazos navy de la familia existente, sin textura ni sombras decorativas. A–E se relacionan con nombres/cifras HTML. Ilustración de patilla propia y esquemática; un ejemplo numérico legible se mantiene separado de las medidas reales y no cambia al elegir pulgadas. Su nota compartida es universal —ejemplo educativo, no medidas de un producto específico— para funcionar también en la página sin añadir un parámetro de contexto. Resaltar el segmento mediante peso, contorno/subrayado y texto, además del color; no copiar el violeta Zeelool ni requerir hover.

Propuesta de convención editorial: ancho total exterior del frente, ancho horizontal/alto máximo del cristal, distancia del puente entre cristales y longitud de patilla desde bisagra siguiendo el quiebre hasta el extremo. La futura carga debe registrar la misma magnitud que el dibujo. **Los 140mm existentes de Dalton no quedan certificados por esta convención**: el responsable de catálogo debe confirmar sus extremos antes de publicar esa cota. No convertir bisagra-bisagra en ancho exterior por cálculo.

Si esa confirmación no llega, puede completarse el desarrollo educativo con fixtures identificados y fallback, pero no afirmar que un SKU tiene un ancho total verificado. No introducir un campo de aprobación ficticio ni migrar los datos para resolverlo.

## 6. Tipografía, color, espaciado y responsive

La integración de `main` en `5bcb463b` conserva Instrument Sans, adoptada en PR65 después de la propuesta inicial con Hanken. Reutilizar tokens semánticos de `DESIGN.md`: Urbanist en títulos/acciones, Instrument Sans en lectura/labels, `--lemoon-text-brand`, `--lemoon-text-primary/secondary`, `--lemoon-surface-page/warm`, `--lemoon-border-default/strong`. Un panel cálido agrupa las medidas; la ayuda es lectura sobre blanco. No nuevos aliases ni colores.

- Drawer: máximo local 480px, altura máxima 100dvh y scroll interno existentes. Padding lateral actual 32px desde 750 y 24px bajo 750; separar bloques con `--lemoon-space-8`, filas con `--lemoon-space-4`. Título de diálogo conserva 24px; H3 usa el rol local aprobado o base H3 sin crear una tercera escala.
- Diagramas frontal/lateral del drawer: siempre apilados, porque su ancho máximo es 480px incluso a viewport 1440. En la página independiente pueden usar dos columnas desde 750 solo cuando cada dibujo y cota resulten legibles; bajo 750 se apilan. No reducir texto para forzar columnas.
- Filas del código: miniicono, código y definición; a 390 el nombre/definición puede bajar de línea, manteniendo código completo. No tabla con scroll lateral para este contenido.
- Página: conservar `.page-width`, índice y layout de pasos de la familia. A partir de 990, índice lateral existente y contenido; por debajo, índice estático sobre pasos. A 390 todas las ilustraciones y filas se apilan. El retiro del hero visual afecta solo measurements.
- Reutilizar H1 local de guía (Urbanist light 4.6rem / 3.4rem móvil), intro 1.8rem / 1.6rem móvil y H2 local 2.8rem / 2.4rem móvil. Se mantienen las excepciones actuales, no se generalizan a otras páginas.
- Selector nativo de unidades conserva altura y mínimo 48px, contorno y foco del contrato. Targets de iconos/cierre ≥44px, sin cambiar el tamaño de sus dibujos.

Validar 390×844, 820×1180 y 1440×900; además ambos lados de 750/990 cuando afecten composición. Reflow a 320 y zoom de texto 200% sin recorte, solapamiento de cierre ni overflow de página.

## 7. Accesibilidad, navegación y estados

Una página con un H1; el diálogo usa H2 y sus bloques H3. SVG informativo tiene nombre accesible; miniiconos redundantes son decorativos. Nombres, unidades y medidas permanecen en HTML, con asociaciones legibles sin color ni imagen. No enlaces o targets dentro del SVG.

No se añade foco a dibujos estáticos. El diálogo sigue usando los controladores existentes: Escape, cierre, retorno, Tab/Shift+Tab con controles visibles y scroll interior. El modo inline conserva flechas/Home/End y selección ARIA. La nueva composición no debe dejar roles/IDs de pestañas huérfanos.

Enlace de guía desde modal: resolver `settings.lemoon_size_guide_page` solo si apunta a una página existente, con template `guia-medidas` y destino válido publicado en la comprobación de integración; si no, omitir el enlace y conservar instrucciones breves. No incrustar el cuerpo completo de la página CMS dentro del modal (el comportamiento anterior podía introducir una guía larga o duplicación). La publicación/visibilidad se verifica sobre Shopify, no desde el fixture. No mover al usuario a la guía automáticamente.

No se fijan mínimos de “calce seguro”, recomendaciones clínicas, rangos RX/DP ni compatibilidades. El estado parcial/sin medidas se expresa en texto y no imita un error de red. Los gráficos estáticos no necesitan skeleton, spinner ni loading inventado.

## 8. Aceptación por superficie y límites de entrega

| Superficie | Evidencia necesaria |
| --- | --- |
| Modal estándar y óptico | Apertura sin salir, cinco/parciales/cero medidas, conversión local, secciones secundarias preservadas, cierre y foco con contenido largo, IDs únicos junto al inline; capturas a los tres anchos. |
| Página measurements | Página y plantilla reales reconciliadas, H1/SEO nativos y contenido editable probado en editor; tres anclas, gráficos/copy definitivos, contacto y catálogo válidos, móvil/teclado/reflow. |
| Regresión | Otras cuatro guías mantienen contenido/hero/schema guardado; PDP inline conserva pestañas y compra/configurador/media no cambian. |
| Compartidos | Ejemplo educativo claramente marcado, no usa números SKU, no aparece en fallback como dato real; estilo y textos coherentes en ambas superficies. |

Pruebas locales y Theme Check probarán el código correspondiente; no prueban carga de catálogo, publicación, inbox ni un tema comercial actualizado. La preparación inicial fue documental; sus comprobaciones no acreditaban runtime. La implementación y sus pruebas posteriores se registran por revisión en el plan y el informe QA, sin reutilizar resultados anteriores como prueba de un head nuevo. La aprobación del diseño, la aprobación del entregable de cada ticket, merge y publicación siguen siendo etapas distintas.

Pendientes concretos antes de presentar producción: revisión humana del entregable integrado, confirmación de convención física por catálogo y comprobación real de página/editor/SEO/asignación/enlaces en un entorno autorizado. No hay autorización aquí para subir un tema, cambiar medidas o activar una ruta.
