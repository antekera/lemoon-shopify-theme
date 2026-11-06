# LEM-145 — Auditoría de Lemoon Product Studio y Shopify

Corte: **05-11-2026 America/Santiago / 06-11-2026 UTC**. Auditoría de lectura; no cambia catálogo, runtime, permisos, canales ni despliegues. **Aceptación incompleta: mantener In Progress** hasta obtener las evidencias de app/ambientes y revisión humana indicadas abajo. Shopify Catalog y novedades no son por sí solos bloqueos del go live.

## Fuentes y alcance reproducible

- [Ticket LEM-145](https://linear.app/antekera/issue/LEM-145), descripción y dos comentarios releídos mediante conector al inicio; [LEM-93](https://linear.app/antekera/issue/LEM-93) contrastado íntegramente y conservado en [evidencia](product-studio-shopify-audit-evidence/lem93.json).
- Tema: remoto `https://github.com/antekera/lemoon-shopify-theme.git`, base y HEAD `0cada135da9534cd91b29b50cf0db9a64184e962`, worktree aislado, rama renombrada de la automática limpia a `chore/lem-145-product-studio-audit` antes de editar. Sin commit/push.
- [Backoffice PR9](https://github.com/antekera/lemoon-next-backoffice/pull/9), fuente fijada `48ca70e15faa9c6c249e8805fc598b460c50f0f2`: [STYLE_METADATA](https://github.com/antekera/lemoon-next-backoffice/blob/48ca70e15faa9c6c249e8805fc598b460c50f0f2/docs/product-studio/STYLE_METADATA.md), CONSOLIDATED_BASE, OPERATIONS_RUNBOOK, SHOPIFY_DRAFT_ACTIVATION_PLAN y código. Remoto comprobado `antekera/lemoon-next-backoffice`; se preservó `apps/web/next-env.d.ts` ajeno modificado.
- [Tema PR60](https://github.com/antekera/lemoon-shopify-theme/pull/60), fuente `208fe3f61efb40e3855e88ac1be9cdf50bb7fa22`: [guía canónica de estilo](https://github.com/antekera/lemoon-shopify-theme/blob/208fe3f61efb40e3855e88ac1be9cdf50bb7fa22/docs/catalog/style-quiz.md). Checkout solo lectura con cambios posteriores de fotos/diseño preservados; no son parte del SHA auditado. LEM-23/configurador y servicios 3000/4175/9292 preservados.
- Reglas AGENTS de ambos repos y reglas Liquid/schema/Git/workflow/API/seguridad/integración leídas. Las descripciones históricas de arquitectura en reglas del backoffice no sustituyen los módulos actuales `apps/`, `services/` y `packages/`.
- Shopify: consultas **del conector del agente**, no del token de Lemoon Admin. [Identidad verificada por raíz](product-studio-shopify-audit-evidence/shop-identity.json): Shop `76333711528`, lemoon, dominio permanente `pzsrt4-1u.myshopify.com`, dominio principal `lemoon.cl`. La dirección histórica `lemoon-8277.myshopify.com` converge a `/password`; la configuración app en `infra/cdk.json:9` ya usa el dominio permanente. Esto no prueba aceptación OAuth de alias ni fecha de cambio.
- [Definiciones](product-studio-shopify-audit-evidence/definitions.json), [accesos](product-studio-shopify-audit-evidence/access1.json), [diccionario](product-studio-shopify-audit-evidence/dictionary.json), [productos 1](product-studio-shopify-audit-evidence/products.json)/[2](product-studio-shopify-audit-evidence/products2.json), inventario en seis páginas y [resumen calculado](product-studio-shopify-audit-evidence/catalog-summary.json). Metadatos de widgets/reseñas ajenos omitidos; sin clientes, pedidos, tokens, direcciones o `.env`.

## Inventario real y propiedad

La lectura terminó todas las páginas: **60 productos, 116 variantes; 58 ACTIVE, uno UNLISTED y una tarjeta de regalo DRAFT**. No quedó `hasNextPage=true` en productos, variantes, metacampos, medios o niveles de inventario. Moneda CLP, plan Basic, no Partner Development ni Plus. ACTIVE no certifica publicación en cada canal, venta real o calidad comercial.

| Dato | Shopify observado | Studio/propietario y límite |
| --- | --- | --- |
| Forma/material | `custom.frame_shape` y `frame_material`: texto controlado, 10 formas/6 materiales | Atributos aprobados por operador; mapper valida choices; no deducir desde una foto |
| Ancho/talla | `frame_width`: estrecho/estándar/ancho; `frame_size`: tres opciones físicas existentes | Atributos aprobados; talla no equivale a presencia oversize |
| Medidas/peso | `frame_dimensions` JSON; `frame_weight` decimal; prueba Dalton con medidas, cinco demos quiz sin medidas/peso | mm: frame_width/lens_width/bridge/lens_height/temple; gramos. Solo valores verificados, no inferencia óptica |
| Compatibilidad | **`custom.lens_compatible = list.metaobject_reference`**, definición destino `18370035880` (`tipo_de_lente`, 8 entradas declaradas) | Mapper conserva referencias; NO booleanizar ni migrar durante precarga. [ADR-002](../architecture/adr-002-eyewear-purchase.md) y LEM-93/23 gobiernan interpretación de compra |
| Otros metacampos | `face_shapes_compatible`, `gender`, `prescription_type`, `try_on_url`; campos mm-google-shopping y Search & Discovery | Definiciones reales inventariadas; no implican cobertura ni escritura por Studio. Gender y prescription_type sin acceso storefront; no ampliar acceso automáticamente |
| Estilo | `style_traits` en producto/variante: lista de referencias al diccionario `37833048232`; `style_quiz_ready` y `style_quiz_demo` booleanos de producto | Seed inicial opcional aprobado; cambios posteriores pertenecen a Shopify |
| Metaobjetos | `tipo_de_lente` 8, `lemoon_style_trait` 18, `shopify--knowledge-base-fact` 7 entradas declaradas | Diccionario merchant-owned y PUBLIC_READ storefront. Knowledge Base NONE storefront; no auditamos los hechos de sus siete entradas |
| Variantes/opciones/SKU | 116; Color y otras opciones; Dalton UNLISTED tiene Color/Lentes/Índice y 20 variantes. Tres SKU vacíos corresponden a gift card; duplicateSkuCount=0 en 116 inventory items | Shopify/LEM-52/64. Studio no crea combinaciones, SKU ni inventario; alta nueva solo DRAFT. Prototipo no fija oferta aprobada |
| Precio/compare-at | Rango leído 299–144900 CLP; 44 variantes con compare-at, todas mayores a su precio; ninguna inválida en esa comparación | Shopify/LEM-52; LEM-144 gobierna descuentos. Rango bajo merece validar fuentes comerciales, no corrección automática. Studio no administra precios ni descuentos |
| Costo | `unitCost=null` en los 116 items | Ausente, no costo cero ni margen calculable; LEM-52 verifica fuente/permiso. Lectura del conector no acredita lectura app |
| Stock | 93 tracked, 23 no tracked; 24 variantes con inventoryQuantity ≤0; niveles available/on_hand/committed leídos sin domicilios | Shopify/LEM-52, no disponibilidad universal. DENY/CONTINUE y tracking afectan venta; stock de muestra no certifica existencias finales |
| Categoría | 59 productos sin categoría; gift card clasificada | Calidad pendiente LEM-52/70. `productType` no reemplaza taxonomía. `category=null` tampoco prueba clasificación interna Catalog ni rechazo por sí solo |
| Medios | Cuatro sin medios: tres cristales de muestra ACTIVE y gift card DRAFT; los demás tienen media de producto | LEM-71/70: revisar imágenes finales/variantes. Media READY prueba procesamiento, no fidelidad, derechos, portada ni asociación por color |

Las 19 definiciones de producto y 12 de variante consultadas devuelven ALL_VALID. Esto valida tipos/valores ante Shopify, no la veracidad de atributos, stock o precio. Existen imágenes y clasificaciones sintéticas: cinco productos (`artico`, `estero`, `faro`, `genova`, `jade`) tienen ready=true **y demo=true**; sus diez variantes resuelven seis grupos efectivos, conservando forma/material de producto. No se certifican como productos finales.

## Contraste LEM-93 y contrato de estilo

LEM-93 conserva una especificación histórica booleana de lens_compatible y una actualización que reconoce la lista real. Prevalecen la definición remota y el contrato de referencias del mapper: conciliar documentación bajo LEM-93, sin cambiar tipos como efecto lateral. Forma/material siguen a nivel producto, sin override en esta versión. No usar género, presupuesto ni forma de rostro como clasificación del quiz.

| Grupo | Pares criterio/código reales; 18 en total |
| --- | --- |
| color | black, brown, light, bold |
| finish | matte, glossy |
| pattern | plain, tortoise |
| transparency | opaque, translucent, transparent |
| use | work, everyday, going_out, outdoors |
| presence | compact, medium, oversize |

Las 18 entradas leídas son únicas por pareja, del mismo tipo/definición y coinciden con `packages/domain/src/style-metadata.ts` de PR9 y guía PR60. Shopify restringe group y code separadamente: la validez cruzada del par depende de la validación Studio/operador. La resolución consulta la tienda, pagina y comprueba duplicados; no usa IDs demo como constantes ni crea otro diccionario. `style_traits` de ambos owners apunta a la misma definición. IDs usados aquí son evidencia de este corte, no configuración portable.

La variante reemplaza todo un criterio del producto; criterio ausente/lista vacía hereda. No mezclar color de una variante con acabado de otra. Se valida pertenencia del ID de variante al producto, también en writer. Variante desconocida, lista incompleta o diccionario inaccesible bloquean. Productos nuevos no admiten overrides hasta existir variantes Shopify reales.

## Flujo, sincronización, aprobación y concurrencia

Evidencia de código fijada en PR9: [sync](https://github.com/antekera/lemoon-next-backoffice/blob/48ca70e15faa9c6c249e8805fc598b460c50f0f2/services/api/src/services/studio-shopify-sync.ts), [planner](https://github.com/antekera/lemoon-next-backoffice/blob/48ca70e15faa9c6c249e8805fc598b460c50f0f2/services/api/src/shopify/studio-style-metadata.ts), [writer](https://github.com/antekera/lemoon-next-backoffice/blob/48ca70e15faa9c6c249e8805fc598b460c50f0f2/services/api/src/shopify/studio-writer.ts), [reader](https://github.com/antekera/lemoon-next-backoffice/blob/48ca70e15faa9c6c249e8805fc598b460c50f0f2/services/api/src/shopify/catalog-products.ts).

1. Shopify alimenta proyección local por sincronización; la proyección no es otra fuente comercial. Reader valida datos y páginas; reintenta hasta tres veces red, 429/5xx y throttling, con espera acotada/Retry-After. Guardar en Studio o refrescar bandeja no demuestra sincronización remota.
2. Fotos/atributos/textos propuestos requieren aprobación humana/evidencia. `revision` y `content.edition`/`expectedEdition` protegen ediciones; actor/fecha se asignan en servidor. Vieja edición devuelve 409; ausencia inválida 400; permisos 401/403. Generación IA no aprueba ni publica.
3. `studio:publish`, configuración habilitada, revisión vigente y acción `save_draft` son gates de escritura. Selección determinista de cuatro vistas y contenido aprobado vigente; `ensureCurrent` relee antes de cada mutación y después de preparación asíncrona. No cancela solicitudes ya enviadas.
4. Núcleo existente compara updatedAt con snapshot antes de actualizar título/descripción/SEO; es detección optimista previa, **no CAS atómico sobre productUpdate**. Handle determinista detecta borrador remoto no registrado; requiere conciliación, no creación repetida ciega. Tags se agregan, no se reemplaza toda taxonomía.
5. Con `styleMetadata` aprobado, todos sus metacampos y atributos previos usan seed-only: ausente → `compareDigest:null`; igual → omitir; diferente/tipo incompatible → conflicto sin tomar nuevo digest para sobreescribir. JSON/sets de referencias se comparan canónicamente. Preservar cambios posteriores Shopify.
6. Sin bloque de estilo se mantiene ruta legacy de metacampos con digest leído; **no afirmar que todo Studio es seed-only**. Los guards de snapshot/aprobación siguen aplicando; no convertir contratos legacy durante esta auditoría.
7. Lotes por owner; ready=true se guarda al final tras releer cobertura de todas las variantes y confirmar ausencia de seeds pendientes. Atomicidad de metafieldsSet es por petición (máximo 25), no entre owners, núcleo, tags y medios. Fallo parcial conserva pasos; reintento relee/omite igualdad y bloquea diferencias. Medios con resultado incierto requieren conciliación manual.
8. Writer no implementa retry HTTP general dentro de `query`; errores registran `shopify_request_failed`, reencolan o fallan en intento final. No atribuir al writer el retry del reader. `style_dictionary_unavailable` queda en conflicto explícito; nunca amplía scopes.
9. Tras escritura prevista, sync relee Shopify para proyección y comprueba DRAFT en alta. No configura publicaciones, no promete productos vendibles. Escrituras reales fuera del alcance: aquí solo código, CI y lecturas con conector.

El reader no proyecta precio, compare-at, costo o niveles de inventario como modelo comercial de Studio. Evitar ampliar Studio para duplicar el Admin: mantenerlos en Shopify y documentar el paso comercial de LEM-52/64 después del DRAFT.

**Gap de medios contrastado:** `StudioPhoto` no tiene variantId; los ángulos del dominio no incluyen detalle/escala. `attachMedia` usa productUpdate con medios de producto; no asocia medios a variantes ni genera `card-diagonal` por color. La aprobación de cuatro vistas no certifica portada o swatch correcto. Bajo LEM-71/70 revisar asignación manual nativa por variante; cualquier extensión futura requiere decisión separada. Documentos nuevos de LEM-71 son propuestas en revisión, no aprobación del contrato.

## Canales, Shopify Catalog y WebMCP

[Publications actuales](product-studio-shopify-audit-evidence/publications.json): Tienda online, Point of Sale, Google & YouTube y Facebook & Instagram; cuatro AppCatalog ACTIVE, todos autoPublish=false, activeRegions vacíos. **AppCatalog ACTIVE no es elegibilidad en Shopify Catalog global**, ni cuenta Merchant Center aprobada, ni campaña activa. No se habilitó ningún canal. Falta inspección de aprobación/errores dentro de cada canal; no inferir ausencia de Agentic desde publications.

Plan Basic satisface el umbral de plan documentado para Catalog. Sin embargo, los HEAD actuales de los dominios convergen a `/password`: la tienda privada incumple el requisito de acceso público al momento del corte. Hay título y precios positivos en el inventario; cuatro productos sin imagen y el UNLISTED incumplen condiciones de producto. No se deduce que los otros sean elegibles: faltan historial/standing, exclusiones internas, SEO, URL/publicación efectiva y diagnóstico de **Sales channels → Agentic → Sources → Shopify Catalog**. Ver [requisitos oficiales](https://help.shopify.com/en/manual/shopify-catalog/requirements) y [diagnóstico de Sources](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/products), acceso 06-11-2026 UTC. La ausencia de taxonomía es deuda de datos, no un mensaje de rechazo obtenido de Shopify.

Intento de lectura UI: inventario CUA mostró pestañas Admin existentes, pero tanto createBrowserTab como getTab fallaron con `Cannot read properties of undefined (reading 'timeoutMs')`; no se alcanzó Sources, no se hizo login ni cambio. Responsable LEM-52/Miguel para aportar captura sanitizada de motivo/contador y mapping, sin activar canales. No retirar password como prueba: necesita la autorización de publicación correspondiente.

[WebMCP oficial](https://shopify.dev/docs/api/web-mcp), consultado 06-11-2026 UTC: disponible en Liquid, soporte de agentes limitado a Chromium; consulta catálogo/variantes y usa Standard Actions para carrito en la sesión. Es compatibilidad a revisar, no un backend para Studio. Los datos actuales permiten identificar variantes por GID/opciones; no prueban que un agente ejecute el configurador de LEM-23, compatibilidades de lentes, cargos adicionales o receta pendiente. No ejecutar add_to_cart/checkout para esta auditoría de lectura. QA futuro: verificar show_variant con color correcto y lectura de precio/disponibilidad; comprar marco/cristales requiere aceptación LEM-23/98, sin atajo que omita configuración. **Compatibilidad documental parcial; ejecución WebMCP Lemoon no verificada.**

Hydrogen se revisó únicamente por capacidades reutilizables: Storefront API, Standard Actions y scripts de Shopify también sirven a otros consumidores. [Documentación actual](https://shopify.dev/docs/api/hydrogen/latest) y [anuncio Fall '26](https://www.shopify.com/news/fall-26-edition-developer), acceso 06-11-2026 UTC. Liquid ya recibe WebMCP: ninguna migración, dependencia nueva ni cambio de arquitectura recomendado.

## Matriz de decisión

Esfuerzo S = hasta 1 jornada, M = 2–3, L = más de 3; **estimaciones de auditoría**, no presupuesto aprobado. Costo separa licencia/consumo de trabajo; no se inventan tarifas de la tienda.

| Capacidad actual | Recurso nativo | Compatibilidad/gap | Valor | Esfuerzo/costo | Evidencia | Recomendación / dueño |
| --- | --- | --- | --- | --- | --- | --- |
| Precios/SKU/stock fuera de Studio | Admin Products/Variants/Inventory | Datos existen; costos ausentes y precios por confirmar | Evitar venta incorrecta | M operativo; plan contratado, costo de producto pendiente | Inventario/summary | Validar Shopify directamente; LEM-52/64 |
| Descuentos de tarjetas/PDP | compareAtPrice y descuentos Shopify | 44 pares válidos numéricamente; no prueban promoción autorizada | Precio coherente | S–M; sin app extra propuesta | products; LEM-144 | Mantener ticket existente; no inferir oferta |
| Atributos y estilo revisados | Metafields/metaobjects merchant-owned + CAS | 18 pares/refs reales compatibles; app token sin acreditar | Evitar clasificación falsa/overwrite | S de verificación; sin licencia nueva propuesta; consumo API sujeto a límites | definitions/access/dictionary; planner | Reutilizar PR9; LEM-93/70/64 |
| Descubrimiento/recomendaciones | Search & Discovery | Definiciones nativas presentes; no sustituye reglas del quiz ni confirma configuración de app | Mejor búsqueda sin motor paralelo | S–M; app oficial gratuita | [App Store](https://apps.shopify.com/search-and-discovery), acceso 06-11 UTC | Usar capacidades existentes; mejoras opcionales LEM-11/93 |
| Fotos de cuatro vistas | Media nativa y asociación de variante en Admin | Studio solo adjunta al producto, no asigna por color | Evitar foto equivocada al vender | M operativo; edición manual sin app nueva; producción foto pendiente | writer/dominio; media | LEM-71/70/64: portada y asociación manual con lectura posterior |
| Generación visual propia | Google Product Studio (herramienta distinta) | Generación de imagen no reemplaza revisión, evidencia ni sync Studio; restricciones para productos médicos y video regional | Opcional, fidelidad no garantizada | Piloto S; Google declara gratuito; video no disponible en Chile según lista actual | [Google oficial](https://support.google.com/merchants/answer/13709443?hl=en-GB), acceso 06-11 UTC | No adoptar como requisito; LEM-71 evalúa restricciones de SKU/uso antes de proponer |
| Publicación/descubrimiento externo | Shopify Catalog / Agentic | Tienda privada; Sources inaccesible, calidad y standing pendientes | Alcance potencial, no go-live gate | S diagnóstico; no presuponer comisión cero: tarifas/condiciones por canal en Admin | publicaciones/identity; [términos §6](https://www.shopify.com/legal/terms-agentic-storefronts), acceso 06-11 UTC | Evaluar LEM-52 después de datos; no activar |
| Agente en storefront | WebMCP/Standard Actions | Liquid compatible documentalmente; configurador y cargos sin QA | Acceso estructurado sin integración paralela | M QA; no tarifa separada publicada en referencia consultada; costos de venta/plan siguen | WebMCP oficial; ADR-002 | LEM-23/98 verifican recorrido; no prometer soporte completo |
| Nuevo storefront | Hydrogen/Storefront API | Capacidad disponible; no resuelve gaps de datos/app | Sin valor inmediato demostrado | L; desarrollo/operación adicional sin presupuesto | API/anuncio oficiales | Descartar migración en LEM-145 |

Fuentes de novedades se consultaron en vivo, no se usan las notas antiguas como disponibilidad actual. El anuncio enumera también Shop.dev/Catalog API, Universal Checkout, App Events y nueva arquitectura de temas: no resuelven la aprobación/carga del catálogo aquí ni acreditan acceso local. No se añaden dependencias. Para Admin API considerar [límites oficiales](https://shopify.dev/docs/api/usage/limits): una consulta de inventario de costo 1248 fue rechazada por exceder 1000 y se resolvió en seis páginas pequeñas; no es fallo comercial ni motivo para activar bulk writers.

## Backlog acotado, ordenado y con dueños existentes

No se crean ni reestructuran tickets, ni se reabre trabajo completado. Los estados son de la lectura de discovery de la raíz, no nuevas transiciones de este worker.

| Orden / naturaleza | Dueño existente | Aceptación observable antes de ejecutar o cerrar |
| --- | --- | --- |
| 1. Evidencia de app/ambiente para carga Studio | [LEM-70](https://linear.app/antekera/issue/LEM-70) y [LEM-64](https://linear.app/antekera/issue/LEM-64); auditoría LEM-145 | Token propio identifica tienda/app y muestra scopes/lecturas requeridas; versión y flags efectivos por ambiente sin secretos; decisión humana de activación separada |
| 2. Datos necesarios para vender | [LEM-52](https://linear.app/antekera/issue/LEM-52) | Fuente de precio/SKU/stock/costo y estructura por producto final conciliada con Shopify, categoría revisada y listado de muestras excluidas/aprobadas; no ajustar stock por fixture |
| 3. Contrato y primera carga de estilo | [LEM-93](https://linear.app/antekera/issue/LEM-93), LEM-70/64 | Lens compatible documentado como referencias; 18 pares resueltos por tienda, campos ausentes protegidos, conflictos conciliados y demo separado de final; autorizar cualquier escritura aparte |
| 4. Medios y correspondencia por variante | [LEM-71](https://linear.app/antekera/issue/LEM-71), LEM-70/64 | Fotos verificadas por SKU/color, portada/card y asociación de variante leídas de vuelta; no equiparar READY con fidelidad; propuesta LEM-71 necesita revisión humana |
| 5. Mostrar descuentos correctos, si se selecciona | [LEM-144](https://linear.app/antekera/issue/LEM-144) | Precio/compare-at de misma variante y campaña autorizada; QA sin atribuir descuento condicionado como ahorro general |
| 6. Opcional: Catalog y recorrido de agentes | LEM-52 para elegibilidad/canales; [LEM-23](https://linear.app/antekera/issue/LEM-23)/LEM-98 para compra; LEM-11 para descubrimiento | Sources/errores y tarifas documentados sin activar; QA agent/variante/configuración no omite opciones ni cargos. No bloquea publicación por falta de adopción de novedades |

## Aceptación del ticket, evidencia y pendientes

| Criterio LEM-145 | Estado de esta auditoría |
| --- | --- |
| Inventario metadata/atributos/variantes/SKU/precio/compare-at/costo/stock/media y contraste LEM-93 | Cubierto por lecturas paginadas y código; fuentes comerciales finales y asociación de medios no certificadas |
| Lectura/escritura/sync, propiedad, concurrencia, errores/reintentos y aprobación | Código/CI contrastados; **incompleto remoto**: no token propio ni flags efectivos dev/prod ni escritura real autorizada |
| Recursos nativos, disponibilidad/restricciones/costo | Cubierto documentalmente; tarifa efectiva de canales requiere Admin, no se propone adopción automática |
| Shopify Catalog elegibilidad/canales/calidad | Canales y causas observables cubiertos; **incompleto diagnóstico Sources/standing** por fallo de acceso UI |
| WebMCP / Hydrogen sin migración | Evaluación cubierta; QA ejecutable de herramientas sobre configuración real pendiente y separado |
| Matriz | Entregada arriba |
| Backlog acotado con aceptación y dueño | Entregado arriba; sin acciones externas |
| Revisión humana y selección | **Pendiente del revisor humano designado**; este documento no aprueba cambios ni cierre |
| Estilo: 18 pares, pertenencia, definición, flags y medidas | Código y diccionario actual compatibles; diez variantes demo con seis grupos; no atribuir hechos físicos finales |
| Precarga solo ausentes, igualdad/diferencias y concurrencia | Planner/writer/sync + CI fijada cubren fixtures; lectura actual no demuestra ejecución de seed remoto |
| Evidencia/aprobación, validación y conflictos/reintentos aislados | PR9 CI SUCCESS al SHA fijado; no repetir 185 pruebas sin cambio runtime; validación con token app/instalación sigue pendiente |

### Gaps que requieren una evidencia concreta

1. **Token propio Lemoon Admin (LEM-70/64; responsable técnico backoffice y Miguel).** No hay evidencia vigente accesible de instalación/scopes/lectura de definiciones y diccionario con esa identidad. Entregar respuesta sanitizada de identidad shop/app y scopes `read_products`, `write_products`, `read_metaobjects`, acceso a definiciones (`read_metaobject_definitions` según instalación) y lectura de definiciones/18 pares con API 2026-01; cualquier denegación debe conservarse. Una lectura no prueba permisos de escritura efectivos ni resultado de mutación. No compartir token ni ampliar scopes para producir prueba.
2. **Separación efectiva desarrollo/producción (mismos dueños).** Fuente `infra/cdk.json` propone `studioWriteEnabled=true` y `catalogAutomationEnabled=true`; no demuestra configuración desplegada. Entregar identificador de ambiente/revisión desplegada, tienda, banderas/roles efectivos sanitizados y límites del writer. La historia del runbook no acredita el estado actual. No desplegar ni arrancar servicios de sync para verificar.
3. **Shopify Catalog (LEM-52/Miguel).** Entregar captura/lectura actual Sources con contador o motivo exacto, producto excluido/mapping, estado de canales y tarifas aplicables; tienda privada ya es causa observable. Resolver UI no autoriza quitar password ni activar canales.
4. **Revisión y decisiones humanas (LEM-145).** Revisar esta matriz/revisión independiente y seleccionar cambios con dueños; consentimiento de otra entrega no sustituye esta aceptación.

Consulta agrupada enviada a raíz; respondió que no dispone de las tres primeras evidencias vigentes y ordenó registrar gaps, continuar y mantener aceptación incompleta. Identidad de tienda sí quedó resuelta con evidencia incorporada. No hace falta inventar una solución ni bloquear el resto de la auditoría.

## Validación y límites de entrega

[CI PR9](product-studio-shopify-audit-evidence/pr9-ci.json): head `48ca70e15faa9c6c249e8805fc598b460c50f0f2`, OPEN, job verify SUCCESS, [run 42082295959](https://github.com/antekera/lemoon-next-backoffice/actions/runs/42082295959/job/127438214725). Log consultado: **185 pass, 0 fail, 49 archivos**, validate/build/synth. Suites `studio-style-{metadata,writer,sync,final-review,metadata-routes,persistence}` incluyen pares inválidos/duplicados, pertenencia, CAS null, igualdad, edición posterior, paginación, carrera de revisión, fallo parcial y ready al final. No se ejecutó otra vez la suite ni se escribieron tests que espejen documentos.

Para esta entrega documental: validar JSON, referencias locales, hashes de fuentes/evidencias y `git diff --check`; ver [manifest](product-studio-shopify-audit-evidence/manifest.json) e informe del worker. No se ejecuta theme check ni browser QA de layout porque no hay cambios de tema/runtime; no se afirma validación storefront. No se ejecutaron writers, scripts de configuración, mutaciones, app install, ampliación de scopes, Git commit/push/merge ni cambios Linear. La revisión independiente posterior pertenece a raíz; esta auditoría no está técnicamente aislada por permisos read-only.
