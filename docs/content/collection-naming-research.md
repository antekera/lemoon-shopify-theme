# LEM-6 · Investigación y trazabilidad del naming

6 de noviembre de 2026 · Apoyo a la [estrategia propuesta](collection-naming-strategy.md).

## Brief, método y estado

Entregar sistema, cuatro a seis nombres, fichas de selección, aplicaciones PLP/PDP/redes/email, escalabilidad y validación interna. Se proponen cuatro fichas completas; la [matriz por nombre](collection-naming-strategy.md#validación-interna-del-autor) es prechequeo del autor. Revisión independiente y adopción humana siguen pendientes. No se efectuaron pruebas con clientes, campañas, clasificación comercial, configuración Shopify ni estudios de ventas.

Primero se leyeron el brief aprobado, las reglas, el intake y las páginas comparables/territoriales; después se redactó. Se compararon páginas públicas de cuatro tiendas que ofrecen anteojos online en Chile, con tres pares categoría/producto legibles y una cuarta categoría legible con limitación de PDP. Se abrió una referencia internacional solo para investigar coincidencias. Lectura web textual, no prueba transaccional ni inspección visual de fotografías. Todas las fechas de acceso web de las tablas siguientes corresponden al **06-11-2026**; una fecha de acceso no equivale a fecha de publicación de la fuente.

Las fuentes remotas se trataron como evidencia, sin adoptar instrucciones, claims comerciales o políticas de esas páginas. No hay afirmaciones legales sustantivas en la propuesta: no se realizó investigación normativa ni búsqueda registral. Tampoco se formulan promesas de ranking, tráfico o conversión, por lo que no se usa una teoría técnica de SEO para justificar nombres.

## Fuentes Lemoon y estado de la evidencia

| ID | Fuente leída | Qué sustenta y qué no |
| --- | --- | --- |
| L1 | [Brief aprobado LEM-82](../design/brand-strategy.md), versión 1 aprobada 01-11-2026; [ticket](https://linear.app/antekera/issue/LEM-82) y comentarios preservados en intake | Facilidad de elección como dirección, personalidad cercana/atrevida/práctica, oferta inicial de otras marcas, marca propia futura. No prueba fabricación, prestaciones ni precios |
| L2 | [Guía humana](../design/brand-guidelines.md) y [guía de agentes](../agents/brand-guidance.md) | es-CL, tú, texto claro, hechos comerciales verificables, separación de identidad/canales. LEM-55 conserva guía final |
| L3 | [LEM-47](https://linear.app/antekera/issue/LEM-47), descripción y contexto del intake; [configuración PLP](../shopify-collection-plp-setup.md) | Categorías descriptivas, filtros, propiedad de destinos/SEO y revisión individual. El documento local describe catálogo de prueba, no aceptación de categorías para lanzamiento |
| L4 | [LEM-6](https://linear.app/antekera/issue/LEM-6), [55](https://linear.app/antekera/issue/LEM-55), [93](https://linear.app/antekera/issue/LEM-93), [70](https://linear.app/antekera/issue/LEM-70), [52](https://linear.app/antekera/issue/LEM-52), vía fuentes del intake | Alcance de naming, propiedad editorial/datos/contenido/surtido. Ninguna aprobación ajena se aplica a estos nombres |
| L5 | Snapshot heredado `/tmp/lem-next-design-intake.json`, `generatedAt=2026-11-06T05:14:18.597Z`, sección `shopify.products`/`collections` | Registros ilustrativos y valores observados. No se refrescó Shopify ni se verificaron marcas, modelos, fotografías, disponibilidad comercial o surtido final |
| L6 | [Notas de políticas](policies-review-notes.md) y [datos comerciales de prueba](commercial-test-data.json) | Advertencia sobre datos demo; no se incorporan sus cifras, contactos, condiciones ni supuestas prestaciones |
| L7 | Intento de apertura de [lemoon.cl](https://lemoon.cl/) | La herramienta devolvió página inaccesible; no se leyó el storefront ni se confirma su estado público desde esta investigación |
| L8 | [Inventario de páginas](../design/page-inventory.md), sección Colecciones y destinos complementarios; [inventario de assets](../design/asset-inventory.md), fila solar | Ambos registran `/collections/lentes-de-sol`; conciliación documental con el handle de L5, sin prueba HTTP ni cambios de navegación |

### Procedencia y reconciliación de fuentes internas

Se reutiliza el intake verificado `/tmp/lem-next-brand-intake.{md,json}` del run `run_a3795861cfd6`, generado `2026-11-06T06:35:26.836610+00:00`. El JSON se comparó byte a byte con el archivo del mismo nombre del run en el directorio Git común `lemoon-agency/runs/`: coincidencia. La inspección pertinente incluye texto completo de LEM-6 y descripciones de 82/47/93/70/52, guía y contexto de 55, comentarios relevantes de aprobación/estado y ownership del intake. No se afirma una nueva consulta live de Linear en esta autoría.

Pins de evidencia reutilizable:

- Intake de marca JSON SHA-256: `f7583657f641073a75c0dc0a850e0026e55e3bb52dfc1bcc02c2405af37ddd85`.
- Snapshot de catálogo L5 SHA-256: `4cc81d75df0ef6d3a784ac9fa685431de9dc3f07a9e7409fa3a7b580059bcd65`.
- Brief L1 SHA-256: `7fa1955c8bae41ec264521c6c456f791bcf208330a3da58931649ee8092bd3f0`; brief y dos guías coinciden con sus hashes del intake al leerlos en esta rama.

Discrepancias pertinentes: el benchmark histórico de LEM-6 atribuye nombres y efectos comerciales sin evidencia actual; se sustituye por observaciones limitadas de C1–C4. Su frase sobre «SEO gratuito» no se adopta como hecho. El catálogo usa títulos con prefijo Lemoon aunque L1 reserva producto propio al futuro: se conservan como títulos observados de prueba, sin derivar marca/fabricación. LEM-47 contiene una definición histórica booleana de compatibilidad que no coincide con el tipo observado de lista de referencias en L5 y con la corrección de LEM-93; ningún criterio de naming usa ese campo o intenta resolver su migración. Las notas de políticas son antiguas y no certifican operación actual; no se usan para introducir promesas.

Conciliación documental de rutas, 06-11-2026: la primera versión de esta propuesta usó `/collections/sol` como abreviación y la atribuyó incorrectamente a L3/L5. En L5 la colección solar es `gid://shopify/Collection/512083132584`, con handle `lentes-de-sol` y título «Lentes de sol»; no hay un registro de colección con handle `sol`. L8 y la fila solar de LEM-47 preservada en el intake también indican `/collections/lentes-de-sol`. No se encontró en esas fuentes respaldo para atribuir la abreviación a una decisión histórica o propuesta de LEM-47. Los ejemplos solares se corrigen al destino observado; no se verifica ni inventa un alias, redirección, cambio de handle o navegación. Esta conciliación local no refresca la investigación web original ni el catálogo.

No se adoptan propuestas no fusionadas de diseño, fotografía, campañas o back office. Estas dos notas no reemplazan la documentación canónica de marca ni la arquitectura de LEM-47.

## Comparación de tiendas: páginas abiertas y leídas

### C1 · Bonoboss

- [Home y navegación](https://bonoboss.cl/): legible; categorías funcionales y accesos por forma/material/color, CTA a colecciones y tarjetas con nombres de modelo.
- [Colección de ópticos](https://bonoboss.cl/collections/lentes-opticos-para-hombre-y-mujer): legible; agrupa productos bajo un destino descriptivo.
- [Producto Galápagos Clip Sol](https://bonoboss.cl/collections/lentes-opticos-clip-sol-gafa-optica-polarizada/products/galapagos-clip-sol?variant=48576935657722): legible; nombre de modelo, variantes cromáticas y acción de agregar al carro. Se observó oferta online chilena; no se compró.

**Distinción útil:** Galápagos identifica un modelo; ópticos identifica un conjunto funcional. No se toma un nombre de modelo como evidencia de una colección editorial. **Aplicación a Lemoon:** conservar categoría y marca/modelo, añadir nombre editorial secundario. **Límite:** no se verificó rendimiento del naming ni todo su catálogo; claims de producto, promociones y políticas no se trasladan. Los ejemplos antiguos de LEM-6 no se certifican por abrir esta muestra actual.

### C2 · Karün Chile

- [Home](https://www.anteojoskarun.cl/): legible; accesos funcionales, formas y materiales.
- [Anteojos ópticos](https://www.anteojoskarun.cl/collections/lentes-opticos): legible; tarjetas como Chiloe Negro y Mara Naranjo, con acceso a producto.
- [Chiloe Negro](https://www.anteojoskarun.cl/products/lentes-opticos-chiloe-negro): legible; producto, configuración y carro/checkout, con contenido comercial para Chile. No se ejecutó compra.

**Distinción útil:** nombre de producto y color conviven bajo categoría descriptiva. **Aplicación a Lemoon:** separar modelo y variante, y no extender una etiqueta de color al producto entero. **Límite:** las afirmaciones ambientales/productivas de Karün son propias; no sustentan atributos de Lemoon. Calbuco y Chucao no aparecieron al buscar esas palabras en la categoría consultada; esto no demuestra su ausencia global ni valida la lista histórica del ticket.

### C3 · Ben & Frank Chile

- [Home](https://www.benandfrank.cl/) y [Ópticos](https://www.benandfrank.cl/shop/category/opticos-41): legibles; categoría funcional y modelos Marcela, Rivera, Testa y Billie, entre otros enlaces visibles.
- [Templos](https://www.benandfrank.cl/stores): abierto; el enlace corresponde a locales, **no a una colección editorial**.
- [Marcela](https://www.benandfrank.cl/shop/product/optical/marcelaoptico): timeout. [Rivera](https://www.benandfrank.cl/shop/product/optical/riveraoptico): primera apertura devolvió título/página; lectura posterior falló por timeout. No se usa como PDP plenamente leída ni evidencia detallada de compra.

**Distinción útil:** el texto de navegación puede parecer metafórico sin representar una selección de productos; inspeccionar su destino. **Aplicación a Lemoon:** no deducir entidades Shopify de una palabra de campaña. **Límite:** cobertura de categoría y navegación, sin atribuir detalles del configurador o transacción. Se suma C4 para que el mínimo investigado no dependa de esta PDP inestable.

### C4 · Óptica El Bosque, Chile

- [Lentes de lectura](https://www.opticaelbosque.cl/categoria-producto/lentes-de-lectura/): legible; categoría funcional con tarjetas de marca/modelo y descriptores de color/patrón. El footer identifica Las Condes, Santiago de Chile.
- [FEDON PABLO Jaspeado café con negro](https://www.opticaelbosque.cl/producto/fedon-pablo-jaspeado-cafe-con-negro/): legible; marca/modelo, selector de aumento y botón Agregar al Carro. Evidencia de oferta online, sin compra.
- [Cómo comprar](https://www.opticaelbosque.cl/pagina-ejemplo/): el enlace real del sitio devuelve 404; no se utiliza para verificar operación.

**Distinción útil:** un comercio puede conservar marca/modelo de terceros y añadir atributos comprensibles. **Aplicación a Lemoon:** el descriptor aclara el patrón sin renombrar proveedor/modelo. **Límite:** sirve como referencia de jerarquía comercial, no de equivalencia técnica entre lentes de lectura y la oferta Lemoon. «Bosque» coincide con parte del nombre de esta tienda: mantener **Bosque Jaspeado** completo, explicado como selección de Lemoon, y revisar posible confusión antes de adoptar.

### Síntesis editorial, sin causalidad comercial

Los casos leídos muestran categorías comprensibles y nombres de modelo que pueden convivir. No prueban que una nueva selección editorial venda más, reduzca costos, genere comunidad o produzca descubrimiento orgánico. La propuesta de dos palabras y cuatro criterios es una decisión creativa de Lemoon para revisión; no una práctica universal deducida de las tiendas. No se copian nombres, frases promocionales, identidades o políticas ajenas.

## Fuentes primarias del territorio y límites de significado

Páginas abiertas y leídas el 06-11-2026; soporte puntual por nombre. No implican participación, patrocinio o respaldo institucional.

| ID y candidato | Fuente primaria exacta | Hecho usado | Interpretación creada y límites |
| --- | --- | --- | --- |
| T1 · Duna Clara | [Municipalidad de Concón · Campo Dunar](https://www.concon.cl/medio_ambiente/campo_dunar) | Describe el campo dunar de Concón y la acción del viento en acumulaciones de arena | Clara se refiere al frente transparente propuesto; no propiedad de la arena, origen ni composición de los lentes |
| T2 · Roca Gráfica | [Chile Travel · Valle de la Luna](https://chile.travel/blog/que-debes-saber-valle-luna-2/), artículo con fecha 19-05-2025 | Identifica Tres Marías como formación de rocas del Valle de la Luna | Gráfica/negro/angular son interpretación y criterios de producto; no hechos geológicos del lugar |
| T3 · Bosque Jaspeado | [CONAF · Parque Nacional Bosque Fray Jorge](https://www.conaf.cl/parque_nacionales/parque-nacional-bosque-fray-jorge/) | Identifica bosque relicto y localización en Coquimbo | Jaspeado es una asociación visual con patrón, no categoría botánica, clima, material, fauna ni promesa ecológica |
| T4 · Lago Curvo | [Chile Travel · Lago General Carrera y Capillas de Mármol](https://chile.travel/atractivos/lago-general-carrera-y-capillas-de-marmol/), actualizado 07-01-2026 | Describe aguas turquesas y tonos azules del entorno lacustre | Curvo se aplica a la silueta frontal del marco; no al contorno geográfico del lago ni a especificaciones del cristal |

Se evita atribuir etimologías, voces indígenas o simbolismos locales. Los compuestos no se presentan como nombres tradicionales ni retratos representativos de Chile. Tampoco se incorporan datos turísticos operativos, extensiones, alturas o edades geológicas, innecesarios para el naming. La conexión chilena es inspiración documentada y contextual, no exclusividad de esos paisajes en el país.

## Ilustraciones de catálogo: campos realmente observados

Fuente común L5. IDs completos de producto/variante usan los prefijos `gid://shopify/Product/` y `gid://shopify/ProductVariant/`, respectivamente. Se omiten precios y disponibilidad, que no sirven para probar membresía editorial. No se usaron paquetes Dalton ni medidas inferidas. No se revisaron imágenes; un título/opción no acredita por sí solo el aspecto real.

| ID de evidencia | Producto / variante observados | Campos observados usados | Aplicación y límite |
| --- | --- | --- | --- |
| E1 | Producto `15403828838568`, «Muestra de catálogo — Solar ovalado transparente»; variante `67602785075368` | `selectedOptions: Color=Transparente`; `custom.frame_shape=ovalado`; `productType=Muestra de navegación` | Duna Clara: ilustra color; transparencia frontal pendiente. El destino solar deriva del contexto de muestra, no de un tipo comercial normalizado aprobado |
| E2 | Producto `15403836604584`, «Muestra de catálogo — Solar rectangular»; variante `67602827673768` | `Color=Negro`; `frame_shape=rectangular`; `productType=Muestra solar` | Roca Gráfica: ilustra conjunción color/forma; negro liso y foto real pendientes |
| E3 | Producto `9581567869096`, «Lemoon Artico»; variante `67608895619240` Carey; contrapunto `55898368049320` Azul | `Color=Carey` o `Azul`; `frame_shape=cuadrado`; `productType=Óptico`; `style_quiz_demo=true` | Bosque Jaspeado: nombre Carey no prueba tonos/manchas; falta foto. Azul no entra por ser cuadrado. Título demo no acredita marca/modelo comercial |
| E4 | Producto `9581568229544`, «Lemoon Inca»; variante `55898368377000` Azul | `Color=Azul`; `frame_shape=redondo`; `productType=Óptico` | Lago Curvo: ilustra color/forma; uniformidad y foto pendientes. La ausencia de un flag demo explícito no aprueba un registro como surtido real |

El snapshot registra los handles `opticos`, `lentes-de-sol` y `accesorios`, de los que se derivan las rutas de referencia `/collections/opticos`, `/collections/lentes-de-sol` y `/collections/accesorios`; no se probó su respuesta HTTP. Contiene además variedad suficiente para **ilustrar reglas**. No confirma cuatro grupos actuales listos para vender. Las fichas ofrecen copy terminado de propuesta y criterios completos; la decisión de activación comercial exige evidencia posterior de los responsables. Esa distinción no reduce el alcance de autoría de LEM-6.

## Coincidencias públicas: búsqueda orientativa y decisiones

Fecha 06-11-2026. Se buscaron los cuatro compuestos entre comillas con «anteojos lentes colección» y con «lentes». También se compararon nombres completos sin distinción de caja/tildes contra títulos de productos y colecciones de L5: ninguna coincidencia completa. No se afirma haber revisado todas las variantes de marca, motores, mercados o registros. Los resultados pueden devolver palabras separadas pese a las comillas.

| ID | Resultado leído / límite | Decisión editorial |
| --- | --- | --- |
| X1 | [Saint Germain · Duna Tortoise Latte](https://www.saintgermainbrand.com.br/produtos/oculos-de-grau-redondo-duna-tortoise-latte/?entry_path=category), página abierta: Duna aparece como modelo de anteojos en Brasil; no se observó el compuesto Duna Clara | Conservar nombre completo y descriptor de selección; riesgo residual pendiente de revisión humana. No contar esta fuente como tienda chilena ni copiar su nombre/modelo |
| X2 | [Arttefacto](https://arttefacto.com/), página abierta: «Bosque jaspeado» figura como opción cromática de ropa; C4 además usa El Bosque como nombre de óptica | La frase no es exclusiva y Bosque aislado puede confundir. Mantener compuesto y selección editorial de Lemoon; valorar confusión en revisión, sin ocultar coincidencia |
| X3 | Consultas exactas de Roca Gráfica y Lago Curvo: los resultados consultados no identificaron una colección/modelo óptico con esos compuestos. Igual para los compuestos finales de Duna Clara y Bosque Jaspeado en la cohorte óptica consultada | Es resultado acotado de búsqueda, no certificación de originalidad absoluta, disponibilidad ni ausencia global. No se declara libre un nombre |

Antes de escribir la versión final se descartó «Bosque Cálido»: la búsqueda preliminar mostró usos comerciales ajenos y podía sugerir una descripción climática no pretendida. Se eligió Jaspeado por su vínculo explícito con el patrón, conservando la coincidencia X2 como limitación. Los nombres finales son propuestas creadas para este brief; ninguna fuente concede derechos de uso ni se inició trámite INAPI. LEM-83/85 conservan su responsabilidad.

## Validación de autor y pendientes concretos

La [matriz de la estrategia](collection-naming-strategy.md#validación-interna-del-autor) cubre cada nombre: escritura/pronunciación, distinción, coincidencias, coherencia producto/canales, tono, procedencia del significado y riesgos. Se revisaron las cuatro fichas y los cuatro canales por ficha, incluidos asunto y cuerpo de email. Los textos propuestos no incorporan precios, stock, promociones, contactos, plazos, fabricación, beneficios ambientales, médicos o de ajuste.

Preguntas de adopción para Miguel: ¿aprueba el sistema y estos cuatro nombres completos en esta versión? ¿Jaspeado y Gráfica se entienden con sus descriptores? ¿Acepta para revisión de uso los riesgos orientativos X1/X2 o solicita sustituir alguno? No se suplanta su respuesta por el prechequeo del autor.

Decisiones posteriores de aplicación: LEM-70 verifica proveedor/modelo y fotografías de variantes reales; LEM-93 concilia atributos; LEM-52 confirma oferta comercial; LEM-47 decide cómo aplicar la capa editorial conservando categorías/destinos, sin exigir nuevas landings. LEM-55 mantiene voz y mensajes finales. Falta dictamen del revisor independiente y aprobación humana antes de adoptar; no se describe aquí un panel pendiente como si ya hubiera ocurrido. No se modificaron esas tareas ni se les asignaron miembros del catálogo.

Verificación documental local: lectura integral de ambos archivos, comparación entre fichas/canales y criterios, comprobación de enlaces Markdown locales, búsqueda de duplicados de nombres y revisión del alcance/espacios. No se ejecutan Theme Check, Vitest, pruebas de storefront ni se atribuye CI a esta autoría Markdown; la entrega al coordinador registra comandos y hashes reales en un reporte temporal separado.
