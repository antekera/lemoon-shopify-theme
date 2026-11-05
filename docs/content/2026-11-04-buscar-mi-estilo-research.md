# LEM-11 — Estudio y factibilidad de «Buscar mi estilo»

Fecha inicial: 04-11-2026 (Chile). Actualización: 05-11-2026. Etapa: investigación previa a implementación. Propuesta para revisión de Miguel; no constituye diseño aprobado ni validación de venta en producción.

## Recomendación

Crear una guía interactiva de estilo con cinco etapas: forma del marco, color, textura/acabado/material, uso y tamaño. Usar selección de imágenes, progreso visible y resultados que expliquen su relación con las respuestas. Estas cinco señales concretas reemplazan las preguntas generales de personalidad de la propuesta anterior. Reutilizar la base del tema, enriquecer su catálogo editorial y mantener el acceso directo a explorar productos. Un motor determinista es suficiente para esta primera versión; no hace falta añadir IA ni un proveedor de quiz para conseguir una experiencia cuidada.

El diferencial propuesto es una **selección que puedes ajustar**: un grupo de lentes ordenado por afinidad, con hasta tres destacados como entrada y acceso al resto de la selección pertinente. Cada una lleva un motivo concreto y respeta disponibilidad y categoría. El precio se muestra como información comercial; no se pregunta presupuesto ni se utiliza para puntuar la afinidad o decidir el estilo. Los refinamientos de esta guía también son de estilo. Este es un objetivo de producto por probar, no una ventaja exclusiva demostrada frente al mercado.

## Encargo y antecedentes vigentes

- Usuario: test entretenido, vistoso y amigable, utilizable por hombres y mujeres de distintas edades; preguntas que ayuden a elegir armazones, grupos o características. Investigar mercado y factibilidad antes de implementar.
- [LEM-11](https://linear.app/antekera/issue/LEM-11/style-quiz-recomendador-de-armazones-web), leído el 04-11: incluido en MVP, 3–5 preguntas, 2–3 recomendaciones y catálogo real. La ruta vigente es `/pages/buscar-mi-estilo`; `/guia-estilo` y `/armazones` son referencias históricas que no fijan URLs Shopify actuales.
- [Benchmark existente de LEM-81](https://docs.google.com/document/d/1OEcTYdpm2UzMueDgMB6QGI_ubU_pDLQV1cOSGBjMdtY/edit), leído nuevamente mediante Drive: contiene los referentes internacionales y chilenos ya usados. Se revalidaron fuentes actuales seleccionadas; sus conclusiones de conversión y antiguas prioridades no son prueba de resultados ni decisiones nuevas.
- [Contrato visual](../../DESIGN.md), [marca](../design/brand-guidelines.md), [estrategia](../design/brand-strategy.md) y [compra ADR-002](../architecture/adr-002-eyewear-purchase.md) rigen la propuesta. El precio inicial es del marco; cristales y tratamientos compatibles se añaden aparte.

## Qué se investigó y con qué límites

La [matriz de fuentes](2026-11-04-buscar-mi-estilo-market-sources.md) contiene enlaces, observaciones y límites por competidor. Es investigación cualitativa de una muestra intencional, no un censo del mercado ni prueba de usabilidad o rendimiento comercial. Se priorizan las mismas marcas del benchmark previo y referencias directamente útiles para el quiz.

| Referente | Qué aporta a la decisión | Qué trasladar a Lemoon |
| --- | --- | --- |
| [Warby Parker](https://www.warbyparker.com/quiz/frames) | Recorrido por pasos. Se comprobaron en navegador tipo de producto, preferencia de presentación, formas y colores; selección múltiple en formas/colores. | Mostrar objetos para elegir y permitir no tener preferencia. No adoptar el filtro por género como puerta obligatoria. |
| [Zenni](https://www.zennioptical.com/quiz/frames) | Entrada de cinco preguntas; ópticos, sol o ambos en el primer paso. | Dar una salida clara a quien todavía está explorando. |
| [EyeBuyDirect](https://www.eyebuydirect.com/quiz/glasses-frame-finder) | Banco amplio que reúne gustos, características y datos de ajuste. | Tomar su cobertura como banco de ideas; seleccionar solo lo que cambie nuestra recomendación. |
| [Zeelool](https://www.zeelool.com/campaigns/eyeglasses-style-picks) | Estilos editoriales y exploración por categorías junto al quiz. Su FAQ describe tres preguntas. | Dejar cambiar de dirección después del resultado; un estilo orienta sin fijar una identidad. |
| [Ace & Tate](https://www.aceandtate.com/de-en/help/glasses-size) | Guía de tamaño separada de gusto estético. | Ofrecer medidas y ayuda de ajuste como información complementaria. |
| [GMO Chile](https://gmo.cl/collections/probador-virtual), [Karün Chile](https://www.anteojoskarun.cl/), [Rotter & Krauss](https://www.ryk.cl/) | Referencias locales de descubrimiento, catálogo, ayuda y presentación de producto. La matriz precisa qué pudo abrirse. | Vocabulario comprensible en Chile y continuidad hacia el catálogo. No se demostró un quiz equivalente en estas páginas. |
| [Ben & Frank Chile](https://www.benandfrank.cl/quiz/frutilentes) | El 05-11 se abrió la ruta actual y se inspeccionaron las primeras tres etapas con capturas. | Retomar ritmo visual y cercanía; cada pregunta de Lemoon tendrá utilidad para elegir preferencias. |

**Observación visual directa:** en el paso de formas de Warby se vio un título central, fotografía de cada armazón en tarjetas claras, retícula de tres columnas a aproximadamente 1230 px, selección múltiple, botón de no preferencia y progreso superior. La primera captura cayó durante la transición; se descartó como evidencia de composición estable y se inspeccionó una segunda. El 04-11 solo se recorrieron las primeras pantallas. El 05-11 se comprobaron además materiales, tamaño estimado, uso de lentes de contacto y captura opcional de email; no apareció presupuesto en este recorrido. Al omitir email, la pantalla previa al resultado comunica un precio de entrada, sin pedir elegir rango. No se validaron sus resultados o comportamiento móvil. El texto extraído de otras fuentes no acredita sus animaciones o calidad visual.

**Página Lemoon:** la apertura en navegador de la URL solicitada redirigió a `https://lemoon.cl/password`. Esto confirma el bloqueo público observado, no el funcionamiento del quiz detrás de él. No se inspeccionó el catálogo autenticado ni la asignación CMS de esa página.

## Oportunidad de contenido

Proponer decisiones fáciles de imaginar: qué te gusta, qué buscas y qué quieres priorizar. Evitar un interrogatorio técnico o preguntas decorativas que no cambien el resultado. Si se pregunta por una actividad, un material o un color, debe existir un dato verificable que pueda influir en la selección.

No exigir conocer la forma del rostro para empezar. Puede incorporarse como ayuda opcional con ilustraciones y «No sé», sin convertirla en una regla sobre qué puede usar alguien. Esta propuesta modifica el énfasis de la especificación anterior y debe acordarse al definir el diseño final.

## Recorrido revisado — cinco señales de estilo

La aclaración de Miguel del 05-11 guía esta revisión: ayudar a expresar forma, color, textura, uso y tamaño para encontrar un grupo de lentes que encaje con lo buscado. La versión anterior de cuatro preguntas queda sustituida. Texto original para revisar; opciones finales condicionadas por catálogo. La duración se medirá en un prototipo, sin prometer segundos antes de probarlo.

**Entrada:** «Encuentra tu estilo Lemoon». Apoyo: «Elige las formas y detalles que te gustan. Te mostramos lentes para seguir explorando». Si hace falta separar ópticos y sol, ofrecer ese contexto en la portada, con «Ambos», antes de las cinco etapas. No contarlo como uno de los cinco ejes ni convertirlo en una barrera para empezar; si se exige escogerlo, contará como decisión adicional al medir esfuerzo. No preguntar género, edad o presupuesto.

| Etapa | Pregunta original propuesta | Opciones visuales para evaluar | Señal que aporta |
| --- | --- | --- | --- |
| 1. Forma | **¿Qué formas te hacen mirar dos veces?** | Redondos/ovalados; cuadrados/rectangulares; cat-eye; aviador; geométricos. Hasta dos, más «Quiero explorar». Fotografías frontales comparables, con nombres sencillos. | Preferencia por la silueta del marco. No diagnostica ni restringe por forma del rostro. |
| 2. Color | **¿Qué colores van contigo?** | Negro/gris; café/ámbar; tonos claros; azules/verdes; colores intensos, según surtido real. Permitir varias familias o «Me gustan varios». Muestras acompañadas por un marco completo. | Paleta preferida de la variante; no asignar colores por piel, género o edad. No mezclar aquí estampado y color como si fueran lo mismo. |
| 3. Textura y detalles | **Acércate un poco: ¿qué detalles te gustan?** | Galería con acercamientos y marco completo. Grupos opcionales: superficie mate/brillante; aspecto liso/carey-veteado; material/construcción acetato/metal/combinado; transparencia si hay muestras reales. «Sin preferencia» por grupo. | Registrar acabado, patrón, material y transparencia por separado, aunque se exploren en la misma pantalla. No deducir una preferencia de otra. |
| 4. Uso | **¿En qué planes te ves con ellos?** | Trabajo o estudio; todos los días; salir o cambiar de look; paseos al aire libre; «Un poco de todo». Escenas reales, hasta dos. | Contexto de estilo y versatilidad editorial. No recomendar automáticamente filtro azul, lentes de sol, protección deportiva ni una solución clínica. |
| 5. Tamaño | **¿Qué presencia te gusta que tengan?** | Compactos; proporción intermedia; grandes/oversize; «Quiero comparar». Comparar sobre la misma persona o en una ilustración con escala constante. Dentro del paso, ayuda opcional «¿Ya tienes unos que te acomodan?» para consultar medidas. | Separar proporción estética de talla física. Oversize describe la apariencia; no significa que la cabeza sea ancha. Las medidas conocidas ayudan por una vía distinta, sin adivinarlas. |

### Cómo mantenerlo ligero

Una etapa por pantalla, con una imagen protagonista y elecciones claras. Multiselección solo donde es útil; permitir saltar sin penalización. No obligar a responder todos los subgrupos de detalles. Si la etapa 3 resulta cargada, comenzar por una galería de acabados/patrones y dejar «Ver materiales» como expansión voluntaria. No esconder preguntas obligatorias adicionales bajo una etiqueta de cinco pasos.

Para distinguir preferencias, variar la característica preguntada y mantener comparables las demás: formas de color/acabado similar; acabados sobre la misma forma y tono cuando sea posible; tamaños sobre una misma referencia visual. Elegir un marco negro redondo no permite concluir automáticamente que la persona prefiera negro **y** redondo: usar las respuestas específicas para confirmar cada señal. Cada tarjeta explica qué se está eligiendo.

La diversión puede venir de acercar detalles, armar una pequeña paleta y ver cómo se forma la selección. Evitar preguntas decorativas sobre personalidad que no tengan una relación editorial definida con los productos.

### Tres distinciones para la curaduría

- **Acetato o metal:** material/construcción, sustentado en datos del fabricante o catálogo.
- **Mate o brillante:** acabado de superficie; una fotografía aislada no siempre lo demuestra.
- **Carey/vetas:** patrón visual, no una textura táctil ni un material específico. Transparente/translúcido describe transmisión de luz; puede combinarse con distintos tonos y acabados.

«Textura» será la invitación visual amigable, pero los datos distinguirán esas características. Usar fotografías macro reales, sin representar una sensación táctil como verificada a partir de una pantalla. Si un atributo no existe o no está confirmado, no ofrecerlo como respuesta ni inventar una coincidencia.

## Qué encontramos al profundizar el 05-11

| Fuente primaria | Observación adicional | Aplicación al test |
| --- | --- | --- |
| [Warby: acetato mate](https://www.warbyparker.com/matte-acetate) | Colección y FAQ distinguen superficie de bajo brillo de acabado brillante dentro del acetato. | Merece una elección visual de acabado, separada de material. La colección no demuestra una pregunta de acabado en su quiz. |
| [Zenni: quiz](https://www.zennioptical.com/quiz/frames) | Se recorrieron las cinco pantallas de la ruta ópticos y se llegó al PLP de resultados. Incluye estilo multiselección, formas ilustradas y preferencia de apoyo nasal; algunas preguntas permiten ver todas las opciones. | Elección múltiple y salida para quien no sabe. La calidad de personalización no fue evaluada: se escogieron opciones amplias. |
| [Ben & Frank Chile: test actual](https://www.benandfrank.cl/quiz/frutilentes) | Se vieron las primeras tres etapas: una metáfora lúdica, experiencia de tamaño al probar lentes ajenos y descripción de mandíbula. Fotos de frutas, bloques de color, alternancia de lados y progreso. | Separar entretenimiento visual de utilidad de cada respuesta. La experiencia de talla es una pista, no una medida. Preguntas incrustadas en imágenes: Lemoon debe conservar texto HTML accesible. |
| [Cubitts: tallas](https://cubitts.com/pages/cubitts-size-guide) | Diferencia dimensiones y ajuste, e incorpora la intención oversize en la explicación estética. | No usar una única etiqueta pequeño/grande para mezclar apariencia, ancho físico y ajuste. Sus umbrales no son tallas universales para Lemoon. |
| [Zenni: medidas](https://www.zennioptical.com/help/frames-fitting/frame-sizing) | Explica los números del marco existente y ofrece guía por dimensiones. | Ayuda opcional con medidas; no convertir los números de un lente en ancho total sin los datos pertinentes. No se implementan escaneo ni medición facial. |

El [anexo de fuentes](2026-11-04-buscar-mi-estilo-market-sources.md) amplía ejemplos de producto, color, acabado y descubrimiento en Chile y exterior. Se distingue recorrido visible de contenido precargado en el DOM: el resultado oculto de Ben & Frank no se considera un resultado generado por nuestras respuestas. No se completaron sus cinco etapas ni se comprobó su motor. El fallo previo de acceso se mantiene como límite fechado del 04-11, no como estado actual de la ruta que sí abrió.

## Resultado: un rango de lentes para explorar

Mostrar «Tu selección de estilo», con las preferencias elegidas y hasta tres productos destacados. Debe ser una entrada a un grupo de opciones reales, no una conclusión única de “este es tu lente”. Los demás candidatos pertinentes se pueden recorrer dentro del resultado o mediante un enlace que preserve los criterios soportados por el catálogo. Si el enlace pierde el ranking, no prometer que lo conserva.

- Resumen editable: por ejemplo, «Formas redondeadas · tonos cálidos · mate · uso diario · proporción compacta». Solo aparecen preferencias declaradas.
- Cada destacado explica dos coincidencias comprobadas. Si no hay coincidencia exacta, distinguir una opción cercana y decir qué cambia.
- Refinamientos de estilo: «Ver otras formas», «Cambiar paleta», «Probar otro acabado» o «Comparar tamaños». Evitar interpretar cualquier cambio como deseo de algo más atrevido.
- Mantener variedad entre productos; varios colores del mismo modelo no ocupan todos los destacados por defecto. Si la persona quiere comparar variantes, mostrarlas como variantes.
- Precio visible del marco, con cristales y tratamientos aparte conforme a ADR-002. El precio no entra al cuestionario ni al puntaje. Los controles comerciales del PLP pertenecen a su recorrido habitual, no a las señales de estilo.

La afinidad combina preferencias; no exige que el catálogo cumpla simultáneamente todas las opciones mediante una intersección rígida. Usar coincidencias para ordenar, no para eliminar prematuramente. Disponibilidad/categoría y requisitos comerciales reales siguen comprobándose. Si una persona declara medidas como condición, no relajarlas silenciosamente; indicar qué productos tienen medidas comparables o solicitar revisión. La preferencia oversize por sí sola nunca fija medidas.

Ante pocas coincidencias, mostrar lo disponible y sugerir cambiar una preferencia explícita; no rellenar con agotados ni con coincidencias inventadas. No prometer comodidad, ajuste perfecto, análisis facial ni porcentajes de compatibilidad. Las reglas de afinidad y los ejemplos concretos se calibrarán contra catálogo con negocio antes de implementar.

## Inclusión y dirección visual

- Las mismas opciones para cualquier género. Evitar que edad o género determinen estilos permitidos. Fotografías con diversidad de edades y apariencias; los gustos los declara cada persona.
- “Cualquier edad” en la experiencia no significa disponibilidad de tallas infantiles. Si se quiere recomendar a niñas y niños, se debe confirmar surtido y medidas apropiadas. No pedir fecha de nacimiento para descubrir gustos.
- Lenguaje cercano en es-CL, con tú y humor breve; evitar jerga generacional, anglicismos y pruebas cronometradas. Mantener texto además de imágenes o colores.
- Proponer riqueza mediante fotografía, escala, encuadre, superposición decorativa moderada, retículas y transiciones, usando Urbanist/Hanken y navy/beige/lemon existentes. No requiere una identidad nueva. Sombras o composiciones nuevas deben revisarse en el diseño y documentarse si alteran DESIGN.md.
- Controles amplios, teclado, foco visible, anuncios del cambio de paso, selección perceptible sin depender del color, alternativa a cualquier gesto de arrastrar y resultado usable con zoom. Deslizar puede ser una mejora opcional, no el único mecanismo.
- No pedir selfie, receta, email ni cuenta para mostrar recomendaciones. Guardar o compartir resultados sería una ampliación posterior con finalidad y datos definidos.

## Factibilidad técnica

### Base comprobada en el repositorio

Lectura estática sobre `43709a870128fb11af369d8a9f064f601774208c`:

| Archivo | Qué existe | Trabajo probable |
| --- | --- | --- |
| `sections/lemoon-style-quiz.liquid` | Cuatro fieldsets, progreso, resultados, productos seleccionados mediante bloques y controles de presupuesto. Hasta 20 bloques. | Nuevas elecciones visuales, datos de afinidad y explicación de recomendaciones. |
| `assets/lemoon-style-quiz.js` | Estado de pasos, volver/reiniciar y ranking por coincidencia exacta de rostro/estilo/uso; presupuesto estricto, deduplicación y hasta tres productos. | Retirar presupuesto obligatorio y su exclusión inicial; añadir multiselección, pesos, refinamiento y diversidad. No es un recomendador de aprendizaje automático. |
| `templates/page.buscar-mi-estilo.json` | Colección `opticos`, cinco handles curados y dos umbrales de precio de muestra. | Verificar surtido/configuración real y ampliar a sol si se elige ese alcance. |
| `tests/unit/style-quiz.test.js`, `tests/storefront/style-quiz.spec.js` | Casos para ranking, presupuesto, filtros y recorrido. | Adaptar pruebas a la especificación aprobada; su existencia no prueba que pasen hoy. |

La sección elige la variante disponible más barata, pero muestra la imagen principal del producto. Si se recomienda por color, es necesario enlazar y mostrar la **misma variante** que justificó la recomendación. Esta es una condición concreta para ampliar el motor. También hay que distinguir “vendible” de unidades físicas en bodega.

### Opciones

| Enfoque | Esfuerzo relativo | Dependencias / recomendación |
| --- | --- | --- |
| Tema + curaduría explícita | Medio | Recomendado para MVP. Liquid publica datos comerciales permitidos; JS ordena candidatos en el navegador. Sin secretos ni servidor nuevo. |
| App externa de quiz | Medio al integrar; costo recurrente por cotizar | Evaluar solo si aporta edición/operación necesaria. Revisar plan vigente, branding, accesibilidad, tracking y sincronización de variantes antes de elegir proveedor. No se cotizó una app en este estudio. |
| IA / análisis de selfie / probador | Alto | Requiere evaluación separada de proveedor, datos, permisos, costo y calidad. No es requisito del resultado propuesto. |

La inferencia “viable dentro del tema” se apoya en el código existente y la documentación Shopify consultada mediante Context7, no en una implementación nueva. Los riesgos principales son catálogo y curaduría, no cómputo.

### Datos mínimos y reglas propuestas

Primero inventariar los campos existentes; no crear metacampos paralelos por defecto. Por candidato: producto/variante, categoría, imagen, URL, precio/moneda y disponibilidad; afinidades por forma, color, acabado, patrón, material/transparencia, contexto de uso y proporción visual con fuente. Las medidas físicas se conservan en campos separados. Mantener separados **forma del marco**, **forma del rostro** y **tamaño/medidas**.

Para empezar puede conservarse la curaduría por bloques. Para crecer conviene una taxonomía administrable en Shopify con responsable de mantenerla. Cada candidato debe aceptar varias afinidades, no una sola etiqueta incompatible con la nueva multiselección. Definir quién mantiene cada atributo y si corresponde al producto, variante o curaduría editorial. Una respuesta de uso solo influye si tiene un mapeo editorial revisado; no se deduce una prestación. No cargar sin límites el catálogo entero en cada visita.

Regla conceptual: filtrar requisitos firmes → sumar preferencias suaves → deduplicar → diversificar → explicar coincidencias. Pesos exactos pendientes de calibrar con pares de respuestas y resultados esperados revisados por negocio. Si todo se omite, ofrecer selección editorial identificada como tal. No convertir la falta de datos en una coincidencia.

Shopify documenta los productos de colección y sus límites de paginación; no asumir que una iteración entrega todo el surtido. Para un conjunto curado pequeño, los bloques actuales evitan depender de un recorrido global. [Referencia de colección](https://shopify.dev/docs/api/liquid/objects/collection).

Los filtros nativos se reflejan en URLs de colección/búsqueda y dependen de los filtros configurados. El código actual intenta descubrir el parámetro de precio leyendo el PLP, con fallback. Debe verificarse el contrato real antes de prometer “Ver todos con mis preferencias”; enlazar una colección no preserva por sí mismo el orden del ranking. [Storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering).

La disponibilidad y el precio deben pertenecer a la variante elegida. Shopify expone esos datos en Liquid; el stock puede cambiar después de renderizar y el recorrido de compra debe volver a comprobarlo. [Variant](https://shopify.dev/docs/api/liquid/objects/variant). La compatibilidad con receta se consulta según ADR-002; el quiz termina en la PDP y no autoriza fabricación ni sustituye al configurador/laboratorio.

## Cómo comprobar que mejora la experiencia

Antes de implementar, revisar cinco perfiles de respuestas con catálogo real: formas redondas y mate, tonos intensos y metal, uso combinado, proporción oversize con talla conocida y sin preferencias. Añadir búsqueda de sol como verificación de contexto. Debe haber trazabilidad entre elección y resultado, y estados honestos con cero/uno/dos candidatos.

Después de implementar: ranking y variantes; navegación completa; selección múltiple; volver/reiniciar; imágenes y precios coherentes; catálogo filtrado cuando esté soportado; sin JS; teclado, zoom, movimiento reducido y responsive. Coordinar medición con LEM-35: inicio/finalización por paso, clic en recomendación y compra atribuible, con política de datos aplicable. No activar analítica ni registrar respuestas personales por inferencia de este documento.

Objetivos por validar: que las personas entiendan las preguntas sin ayuda, puedan explicar por qué recibieron el resultado y lleguen a una PDP pertinente. Para afirmar mejora comercial haría falta comparar uso y conversión con una línea base o experimento; las referencias no demuestran ese efecto en Lemoon.

## Decisiones para la siguiente etapa

1. Revisar las cinco etapas de forma, color, textura/detalles, uso y tamaño; reducir carga de la tercera sin perder la distinción entre atributos.
2. Confirmar catálogo de lanzamiento: ópticos, sol, ambos y disponibilidad de tallas infantiles.
3. Clasificar productos/variantes y resolver precios, fotografías y atributos antes de fijar ejemplos finales.
4. Preparar diseño mobile/desktop de entrada, pregunta, resultado y vacío para revisión humana; conciliar `style-quiz-spec.md` con LEM-11.

No se modificaron código de tema, locales, catálogo, CMS o publicaciones en esta etapa. No se ejecutaron tests de runtime ni Theme Check porque el delta es documental. La investigación y sus propuestas quedan disponibles para revisión; el ticket completo sigue en ejecución.

## Revisión de esta entrega

Revisión de la versión inicial (04-11), anterior a las nuevas cinco etapas, por `lemoon-copy-reviewer`: aceptado como borrador, sin hallazgos materiales pendientes tras corregir el enlace exacto de GMO y aclarar que el precio base del marco ya está decidido por ADR-002. Se contrastaron fuentes seleccionadas y Liquid/JS; Zenni Discovery devolvió timeout al revisor. No se repitieron recorridos completos ni inspección visual. Responsabilidad de solo lectura sin aislamiento técnico de permisos. Esta revisión no aprueba diseño, implementación o producción.

Verificación documental local: ambos archivos sin espacios al final de línea ni enlaces locales ausentes. Guardados sin commit en `chore/lem-11-style-quiz-research`, worktree `/Users/miguel/orca/workspaces/lemoon-theme/lem-11-style-quiz-research`. LEM-11 pasó de Todo a In Progress al iniciar esta investigación; la etapa documental no completa el ticket de implementación.

## Ajuste solicitado el 05-11-2026

**Registro del primer ajuste, sustituido por la segunda aclaración de estilo que sigue:** Miguel considera que preguntar por rango de precio puede limitar el descubrimiento. Se retira esa pregunta de la propuesta y se recomienda seleccionar primero por afinidad, mostrar precios transparentes y ofrecer un filtro opcional después. La idea de que todas las personas escogerían el tramo bajo no está medida; no se usa como hecho del mercado. Esta actualización documental no modifica el motor existente ni se presenta como parte de la revisión independiente anterior.

La segunda aclaración del 05-11 precisa los cinco ejes de estilo y amplía la investigación. Sustituye la recomendación de cuatro preguntas y el refinamiento económico dentro del test. La implementación anterior con presupuesto permanece descrita como estado estático del código, no como comportamiento propuesto.

Revisión independiente de esta revisión de cinco etapas, 05-11: `lemoon-copy-reviewer` aceptó el borrador sin hallazgos materiales pendientes, tras conciliar historial de presupuesto, transparencia fuera de color y grupo de resultados con hasta tres destacados. Contraste puntual de Cubitts, MOSCOT y Karün; evidencia de navegador atribuida al coordinador. Revisión por responsabilidad de lectura, sin aislamiento técnico; no valida implementación ni producción.
