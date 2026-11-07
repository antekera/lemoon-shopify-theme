# Guía de medidas PDP y página — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preparar una guía coherente en el modal PDP (LEM-129) y en `/pages/como-medir-tus-lentes` (LEM-105), con composición basada en Zeelool y datos de producto reales.

**Architecture:** Reutilizar el diálogo nativo y sus dos adaptadores. Compartir dibujos originales y el bloque didáctico; presentar contenido continuo solo dentro del diálogo y conservar las pestañas inline. Extender exclusivamente el modo `measurements` de la sección de guías existente con texto editable; conservar las otras cuatro guías.

**Tech Stack:** Shopify Liquid, schema JSON, CSS, JS existente; Node24.19.0, LiquidJS10.30.0, Vitest5.0.3, Playwright1.63.0, Shopify CLI4.8.5.

**Spec:** [Propuesta de diseño](../specs/2026-11-07-size-guide-pdp-page-design.md). [Copy propuesto](../../content/2026-11-07-size-guide-copy-draft.md). [Auditoría de datos](../../content/2026-11-07-size-guide-data-audit.md).

**Estado:** planificación preparada para revisión humana. Las tareas siguientes **no están ejecutadas**. El runtime actual `ba95b03f` / head documental `e19bbe75` y su CI previo no prueban esta nueva composición ni la página ampliada.

## Global Constraints

- Alcance: modal PDP y página de guía; sin entrada desde Home ni cambios de compra, receta, compatibilidad, precios o catálogo.
- Zeelool es referencia principal de composición; ilustraciones y copy originales, identidad/tokens de `DESIGN.md`.
- Mantener el drawer local de máximo480px y los controladores existentes; sin segundo motor de diálogos.
- Medidas: `custom.frame_dimensions` JSON con `frame_width`, `lens_width`, `bridge`, `lens_height`, `temple`; solo números positivos conocidos. No derivar medidas desde talla, estilo o fotografía.
- mm inicial; conversión solo del bloque de producto. El código didáctico permanece en mm, identificado como ejemplo.
- Página genérica sin SKU; no importar valores de Dalton. No tabla de rangos, escaneo, DP, video obligatorio ni calce universal.
- Textos storefront localizados en `locales/es.json` / `en.default.json`; schema en `locales/es.schema.json` / `en.default.schema.json`.
- Publicación, asignación de plantilla y escrituras CMS/SEO son etapas externas separadas; este plan no las ejecuta ni autoriza subir un tema.

## Review Focus

- Un producto solo con talla textual debe mostrar el vacío de medidas sin generar cifras (tarea2).
- Inline y diálogo juntos necesitan IDs únicos y unidades independientes; retirar tabs del diálogo no retira las pestañas inline (tareas1/2).
- Una guía CMS extensa no debe incrustarse entera en el modal ni provocar un enlace hacia sí mismo (tareas2/3).
- Editor con richtext vacío o solo párrafo vacío usa fallback; títulos de página/líneas largas y texto200% deben conservar jerarquía y reflow (tarea3).
- La página publicada existe, pero su `templateSuffix` es `null`; archivo local o preview con `view=` no acredita asignación real (tarea4).

## Evidencia de partida y entrega Git

- Worktree actual `lem-129-size-guide-modal`, rama `feat/lem-129-size-guide-modal`, head `e19bbe75d07798fcccfd1994a210ad6f6c9aede3`; PR64 abierto. No se apila sobre quiz ni configurador.
- La base del PR era `0cada135`; antes de implementar, revisar el main actual y coordinación con LEM-134, sin importar su trabajo ni modificar documentos ajenos. Si hace falta integración de base, hacerla en una rama limpia con sus verificaciones; no reset/stash del worktree.
- Propuesta de entrega: continuar PR64 en borrador, ampliar su descripción para los dos tickets y separar commits de compartidos, modal y página. Cada ticket conserva aceptación y aprobación humana propia; compartir PR no los cierra automáticamente.
- Este paquete de preparación no equivale a aceptar el modal previo ni la nueva página. LEM-129 y LEM-105 permanecen In Progress mientras se prepara la revisión del resultado completo.

## Tarea1 — Recursos gráficos compartidos

**Ownership:** theme-developer, solo los archivos de esta tarea; coordinar antes de que los consumidores cambien. No está solo en el repositorio: preservar el trabajo de los demás.

**Files:** crear `snippets/lemoon-frame-measurement-diagram.liquid`, `snippets/lemoon-size-guide-comparison.liquid`, `assets/component-lemoon-size-guide.css`, `tests/unit/size-guide-components.test.js`; modificar `snippets/lemoon-frame-dimensions.liquid` y locales storefront.

**Interfaces:**
- `lemoon-frame-measurement-diagram`: `instance_id:string`, `label:string`; SVG original A–E sin datos de producto ni consulta global de catálogo.
- `lemoon-frame-dimensions`: conserva `dimensions`, `dialog`; añade `instance_id` y renderiza el dibujo, manteniendo validación y lista HTML.
- `lemoon-size-guide-comparison`: `instance_id:string`, `heading_level:number=2`, `show_heading:boolean=true`, `compact:boolean=false`; tres filas de código/miniicono/explicación, sin parámetro product. La nota de ejemplo debe funcionar en página y modal sin decir «este producto» en una página genérica.

- [ ] Escribir pruebas de render: nombres y unidades accesibles en HTML; dibujo sin cifras SKU; ejemplo52□18–145 rotulado educativo; tres segmentos destacados sin depender solo del color; dos instancias sin IDs duplicados. Rechazar formularios, scripts, URLs de activos de terceros o herramientas de medición en pantalla.
- [ ] Ejecutar `npm run test:unit -- tests/unit/size-guide-components.test.js`; comprobar fallos por los nuevos componentes ausentes, sin alterar el checkout compartido para simular el baseline.
- [ ] Crear ilustraciones propias y CSS local usando tokens. La patilla muestra su recorrido/quiebre; no introducir una regla imprimible o con escala física en pantalla. Las cotas y la instrucción indican los extremos exteriores al comparar con una regla real; no se necesita un tercer gráfico obligatorio.
- [ ] Ejecutar pruebas nuevas y `tests/unit/size-guide.test.js`; los casos completos/parciales/vacíos originales deben seguir pasando. La nueva pieza visual no cambia el contrato numérico.
- [ ] Registrar compartidos en `docs/design/component-inventory.md/.json` y `docs/components/recipes/product-card-grid.md` / `guide-help.md`, con alcance e inputs. Commit acotado: `feat: add shared size guide illustrations`.

## Tarea2 — Modal PDP continuo

**Ownership:** theme-developer para snippets/call sites/CSS; theme-test-engineer para pruebas/fixtures, sin editar producción para hacerlas pasar.

**Files:** modificar `snippets/lemoon-size-guide-content.liquid`, `snippets/lemoon-product-size-guide.liquid`, `sections/lemoon-eyewear-product.liquid`, `sections/main-product.liquid`, `assets/lemoon-pdp-layout.css`, `config/settings_schema.json`, locales storefront/schema, `tests/helpers/size-guide-renderer.mjs`, `tests/unit/size-guide.test.js`, `tests/e2e/size-guide.spec.js` y el caso de guía de `tests/e2e/eyewear-product.spec.js`. Revisar `snippets/lemoon-frame-information.liquid` solo para argumentos/IDs necesarios; su presentación inline conserva el default. No tocar JS del diálogo salvo defecto demostrado por las pruebas.

**Interfaces:** `lemoon-size-guide-content(product,instance_id,presentation='tabs')`; los dos diálogos pasan `presentation:'dialog'`. En el modo dialog, bloques H3 de medidas→comparación→características/ajuste disponibles. El modo default mantiene tablist/tab/tabpanel y teclado existentes.

- [ ] Añadir pruebas de render para `presentation:'dialog'`: no tablist/tab/tabpanel; hay cinco medidas/código educativo separados; datos secundarios preservados cuando existen; cero medidas sin selector ni filas ficticias. `presentation` ausente conserva tres tabs.
- [ ] Añadir casos: JSON parcial; claves inválidas; talla sin JSON; producto sin secundarios; nombres largos escapados; página CMS con contenido largo cuyo cuerpo no aparece dentro del modal.
- [ ] Ejecutar las pruebas enfocadas y confirmar el fallo del contrato nuevo antes de implementar la rama dialog.
- [ ] Integrar bloques continuos dentro del shell actual, con H2 único del diálogo y H3 hijos. Cargar CSS compartido desde los hosts main-product/óptica; pasar IDs diferenciados a dibujo inline/dialog. La página no recibe ni renderiza el diálogo.
- [ ] Resolver enlace de guía desde el page setting existente solo con página válida y plantilla `guia-medidas`; no inyectar `page.content`. Actualizar la información del setting para explicar su nuevo uso como destino, conservando valores guardados y fallback inline legado. Sin `preview_theme_id` en enlaces finales.
- [ ] Actualizar el fixture de guía a markup renderizado actual. El caso de guía del test óptico debe usar el renderer dinámico; no regenerar la captura completa del producto ni alterar sus casos de compra/configurador.
- [ ] Ejecutar `npx playwright test --config tests/e2e/size-guide.config.js`: ambos shells a390/820/1440; abrir sin navegación, cierre visible, Escape, Tab/Shift+Tab, retorno al opener, scroll interno, unidades locales. Añadir una aparición inline para comprobar que conserva tabs/flechas/Home/End y que su cifra mm no cambia al convertir el diálogo.
- [ ] Confirmar dibujo apilado en el drawer480px también a1440viewport; targets44px/campo48px y contenido200% sin recorte. Registrar composición aprobada en `DESIGN.md` e inventarios. Commit: `feat: refine PDP size guide around measurement comparison`.

## Tarea3 — Página educativa editable

**Ownership:** theme-developer, edición solo de `guide_kind == measurements`; writer/reviewer entregan copy aprobado y tester verifica las cinco guías.

**Files:** modificar `sections/lemoon-guide-page.liquid`, `templates/page.guia-medidas.json`, locales storefront/schema y `tests/unit/guide-page.test.js`; crear `tests/helpers/size-guide-page-renderer.mjs` y `tests/e2e/size-guide-page.spec.js`; extender la ruta de fixture en `tests/e2e/fixture-server.mjs`. Actualizar documentación de componentes y `docs/content/page-template-assignments.json` como evidencia solo después de verificar asignación real.

**Interfaces:** los tres pasos existentes mantienen anclas `Guide-{section.id}-{1,2,3}`. H1 usa `page.title`, fallback localizado. Inputs editor: `measurements_intro`, `measurements_step_{1,2,3}_title`, `measurements_step_{1,2,3}_body`, `measurements_help_body`. Cuerpo/intro/ayuda son richtext; títulos text. Un vacío significativo usa el fallback aprobado.

- [ ] Añadir pruebas: un H1 y sus tres anclas; titleCMS escapado; intro/cuerpo/ayuda override solo en measurements; párrafo vacío no crea un bloque mudo; richtext no envuelto en otro p; código/diagrama educativos sin `data-mm` de un SKU ni selector de conversión vacío.
- [ ] Para cada otra guía (`face`, `order`, `try_on`, `prescription`), renderizar con los nuevos settings llenos y comprobar que los ignora y conserva hero/texto/IDs previos. No cambiar sus traducciones.
- [ ] Ejecutar `npm run test:unit -- tests/unit/guide-page.test.js` y confirmar los fallos de las capacidades nuevas.
- [ ] Integrar título/intro y tres pasos según el spec: patilla/código, medidas/regla, comparación con PDP. Retirar solo en measurements el hero gráfico genérico duplicado. Reutilizar comparación con `show_heading:false` bajo el H2 del paso y gráfico A–E sin números reales.
- [ ] Cargar CSS compartido solo cuando se usa; aplicar editor overrides y fallbacks sin mover las demás guías a un CMS nuevo. Mantener padding e índice de la familia. Para richtext, identificar vacío real sin descartar formatos válidos.
- [ ] Crear fixture de página renderizado con título y settings CMS sintéticos identificados; ruta nueva `/tests/fixtures/size-guide-page.html`. Probar enlaces con raíz `/` y `/en`, contacto `/pages/contact`, catálogo nativo, tres anclas, teclado y reflow390/820/1440. No inventar un botón que regresa a un producto arbitrario.
- [ ] Ejecutar pruebas de página y regresión de las cinco guías. Commit: `feat: complete editable frame measurement guide page`.

## Tarea4 — Validación, integración Shopify y handoff

**Ownership:** coordinator para evidencia/PR/Linear; test engineer y reviewers separados para comprobación. Reviewer read-only por responsabilidad; no afirmar aislamiento técnico inexistente.

- [ ] Revisar el delta completo y ejecutar `npm run test:unit`, pruebas E2E afectadas y `SHOPIFY_FLAG_NO_INPUT=1 npx --yes @shopify/cli@4.8.5 theme check --fail-level error` con Node24.19.0. Ejecutar también los checks requeridos por CI para el head final; no usar resultados del modal anterior para cerrar esta composición.
- [ ] Revisar capturas de390/820/1440, reflow320, texto200%, movimiento reducido, lectura de ejemplo y ausencia de desbordamiento. Navegador local prueba fixtures; un paso separado debe comprobar Liquid real/Shopify cuando exista preview autorizado.
- [ ] Revisiones independientes: editorial/fuentes, diseño contra spec/Zeelool y `DESIGN.md`, código y convenciones. Corregir hallazgos y refrescar las pruebas afectadas. Ejemplos educativos son contenido funcional claramente rotulado, no placeholders comerciales.
- [ ] Antes de cualquier escritura externa, confirmar entorno y autorización vigente. Snapshot: página ID161807204520, handle`como-medir-tus-lentes`, publicada con `templateSuffix:null`; Contacto ID121882443944, handle`contact`, publicada con suffix`contact`. La plantilla local no acredita la asignación.
- [ ] Preparar el contenido editable/SEO aprobados. Asignar `guia-medidas` y seleccionar la página en settings únicamente en el entorno autorizado que tenga los cambios. Conservar el bodyCMS previo para recuperación; no borrarlo para ocultar una discrepancia. No guardar este JSON de settings en Git.
- [ ] Verificar URL canónica sin `view=`, un H1, SEO, edición real y retorno desde guía al catálogo. Comprobar entrada desde footer/menu existente, destino de ayuda y enlace del modal con y sin página válida. No dar por probado el inbox de Contacto por este enlace.
- [ ] Confirmar con responsable de catálogo la convención exterior de ancho total y los datos del SKU usado en QA. Registrar faltantes en LEM-70/93 existentes, sin crear mediciones ficticias ni bloquear la página genérica por no tener un producto final.
- [ ] Registrar pruebas reales en la planilla QA enlazada por LEM-105; diferenciar fixture, storefront, editor y catálogo. Entregar PR/SHAs/previews y límites a revisión humana de **cada ticket**.
- [ ] Mantener sin merge/Done/publicación hasta sus autorizaciones correspondientes. Ante falta de preview, aprobación o datos físicos, registrar el hecho concreto y no afirmar producción-ready.

## Revisión del plan antes de implementar

Cobertura: gráficos compartidos→tarea1; modal→tarea2; guía editable→tarea3; carga/QA/revisión→tarea4. Los cinco riesgos de Review Focus tienen comprobación en su tarea. Las interfaces usan los mismos nombres que el spec. No se añaden dependencias ni pruebas para validar la mera existencia de estos documentos.

Pendiente de Miguel: revisar la composición propuesta, el copy y este plan. Se conserva la ruta de roles solicitada: theme-developer implementa por tareas; theme-test-engineer verifica; diseño, copy y código/convenciones reciben revisiones independientes. No se inicia runtime desde esta preparación.
