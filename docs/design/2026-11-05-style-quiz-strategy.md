# LEM-11 · Estrategia de implementación y acabado visual

## Decisión de partida

Miguel aprobó el contenido, las secciones, el layout y la organización del [prototipo Figma](https://www.figma.com/design/Z6qNxx6rSmYAbA1q23yvs1) como boceto. Solicitó construir la funcionalidad y después profundizar en formas, paddings, iconos, fotografías, texturas y SVG. Esta aprobación no fija como definitivos los dibujos, pesos tipográficos, radios ni estados del boceto.

Ampliación explícita del alcance: el resultado debe entregar un grupo de productos usando las product cards del tema. LEM-11 incluye auditar y completar los atributos de Shopify que necesita el quiz, preparar los productos de prueba iniciales y dejar el modelo y el procedimiento disponibles para los productos finales. La tarea no queda satisfecha con un quiz que solo funcione con atributos escritos en bloques de la plantilla o datos ficticios dentro del JavaScript.

Recomendación: dos etapas con una preparación visual breve. Fijar primero las dimensiones y responsabilidades de los componentes; construir el recorrido completo; después perfeccionar la expresión visual sobre los mismos componentes. Esta estrategia es una propuesta para la siguiente implementación, no evidencia de que haya comenzado.

Fuentes operativas: [contrato visual](../../DESIGN.md), [marca](brand-guidelines.md), [brief aprobado](brand-strategy.md), [iconos](icon-library.md), [investigación](../content/2026-11-04-buscar-mi-estilo-research.md) y [alcance del prototipo](style-quiz-prototype/README.md). No se volvió a inspeccionar el Figma en esta entrega; se usaron sus capturas y el registro local de la entrega anterior.

## Enfoques considerados

| Enfoque | Beneficio | Costo o riesgo |
| --- | --- | --- |
| Base funcional y después acabado, con contrato visual mínimo inicial | Permite comprobar el recomendador y sustituir activos sin cambiar la lógica | Exige separar decisiones visuales finales de las dimensiones que afectan los componentes |
| Terminar todo el diseño en Figma antes de programar | Mayor certeza visual inicial | Aplaza las pruebas con datos reales y puede producir imágenes para opciones que el catálogo no respalda |
| Terminar cada pantalla por completo antes de pasar a la siguiente | Cada paso luce terminado pronto | Facilita inconsistencias y retrabajo cuando se prueba el recorrido completo |

Se recomienda el primero. Miguel eligió explícitamente **editorial con momentos lúdicos** al responder la consulta de dirección visual: producto protagonista, ritmo visual, superficies cálidas y respuestas perceptibles al elegir. Esta elección fija la dirección; los acabados concretos se desarrollan y revisan sobre las pantallas representativas.

## Preparación breve

- Estabilizar proporciones de medios, límites de ancho, jerarquía, paddings, radios y estados reutilizando DESIGN.md. Reservar espacio real para imágenes finales y textos variables.
- Conservar la familia existente de iconos: lienzo 24 px, trazo 1,75 px, remates redondos. Las ilustraciones de armazones constituyen otra familia, consistente internamente.
- Usar clases y variables locales del quiz cuando sean necesarias; cualquier excepción aprobada del contrato se registra en DESIGN.md. La estrategia no crea otra paleta ni otra tipografía.
- Inventariar atributos y fotografías de catálogo antes de ofrecer respuestas. Confirmar alcance ópticos/sol y surtido infantil en datos reales. No extrapolar la oferta comercial desde el prototipo.
- Definir ejemplos esperados de recomendaciones para cinco perfiles y un caso sin preferencias; calibrar las reglas con catálogo real.

## Etapa 1 · Recorrido funcional

### Catálogo y atributos · parte obligatoria de la etapa

La [auditoría inicial de Shopify](2026-11-05-style-quiz-catalog-audit.md) confirmó campos existentes de forma, material, ancho y tamaño; las cinco referencias iniciales tienen diez variantes y carecen de los atributos nuevos de detalle/uso/proporción. Se reutilizan las definiciones compatibles y se completan las faltantes. El catálogo, sus valores controlados y las asignaciones pertenecen a Shopify.

1. Definir el diccionario de atributos: forma, familia de color, acabado, patrón, material, transparencia, contexto de uso y proporción visual. Mantener medidas físicas independientes. Identificar nivel producto/variante, valores permitidos, fuente y reglas de herencia para cada atributo.
2. Crear las definiciones faltantes y, donde se requieran valores compartidos con contenido visual, los metaobjetos y sus referencias. Respetar los campos y consumidores existentes; no convertir sus tipos ni renombrarlos sin revisar y preservar los datos. Evaluar los atributos estándar de categoría antes de duplicarlos.
3. Cargar las entradas controladas y asignarlas a los productos/variantes de prueba con trazabilidad. Los atributos conocidos se reutilizan; lo desconocido se verifica o queda pendiente. Los casos sintéticos se distinguen de hechos comerciales y no se comunican como características verificadas del catálogo final.
4. Leer de vuelta las asignaciones y verificar el acceso necesario del storefront, referencias válidas y coherencia entre opciones y variantes. Registrar cobertura por eje y faltantes.
5. Entregar guía de alta y actualización de productos finales: campos, valores admitidos, ejemplos, imágenes, verificación y consecuencias de dejar un atributo vacío. Reutilizar una plantilla de carga o procedimiento repetible según el método que soporte la tienda; no dar por supuesto que el CSV estándar cubre todas las referencias o valores de variante.

La selección no usa presupuesto, género ni forma del rostro como sustitutos de los ejes aprobados. «Carey» describe patrón y no determina por sí solo una familia de color. «Grande» o las medidas actuales no determinan automáticamente oversize. «Uso» es afinidad editorial y no una prestación técnica.

### Producto

Implementar entrada, cinco ejes, selección múltiple, omitir, volver, reiniciar, ayuda de medidas y recuperación al editar. Acabado, patrón, material y transparencia mantienen datos independientes. Proporción oversize y medidas físicas también.

El resultado muestra las preferencias elegidas una sola vez antes del listado, un conjunto ordenado de candidatos y hasta doce productos iniciales; las tarjetas conservan su presentación de catálogo sin razones por producto. El precio se presenta como información comercial, sin preguntar presupuesto ni participar en el ranking. Si se omite todo, se identifica la selección editorial. Cero, una o dos coincidencias tienen estados útiles; no se rellenan con falsas coincidencias.

El bloque de resultados es una composición del quiz que reutiliza `snippets/card-product.liquid`, sus estilos y comportamiento existentes. Presenta el grupo completo ordenado por afinidad, con ampliación o paginación cuando corresponda; el lote inicial de doce no es el límite del conjunto. Editar una respuesta actualiza el grupo y el resumen de preferencias. La carga de más resultados conserva selección, orden y deduplicación. No requiere un widget de terceros.

### Implementación propuesta

Evolucionar la sección, JavaScript, plantilla y pruebas actuales del quiz. Mantener separados los datos de las preguntas, el estado de respuestas, el cálculo de afinidad y la presentación. Los activos visuales se asignan a cada opción de modo que puedan sustituirse sin alterar su significado ni puntuación. Evitar un framework, servicio o app adicional sin una necesidad demostrada.

La tarjeta enlaza, representa y explica la misma variante recomendada. La disponibilidad y atributos se verifican; un dato ausente no cuenta como afinidad. El uso aporta contexto editorial, sin inventar prestaciones de los cristales. El quiz termina en la PDP y conserva el contrato de compra de [ADR-002](../architecture/adr-002-eyewear-purchase.md).

La tarjeta canónica actualmente consume imagen/precio/URL de producto y opciones de swatch. Su integración debe resolver explícitamente la variante inicial recomendada y comprobar sus cambios de swatch. Cualquier extensión de su contrato será opcional y conservará el comportamiento del resto de consumidores, con pruebas de regresión. Seguir la [receta de product card y grid](../components/recipes/product-card-grid.md).

La selección completa debe conservar las preferencias en la experiencia entregada. No prometer que una colección nativa mantiene el ranking sin comprobarlo; se elegirá la solución más pequeña que preserve ese comportamiento.

### Entrega y comprobación

Página funcional con estilo base coherente, activos provisionales identificados y datos comprobados. Pruebas relevantes de ranking, multiselección, omisión, variantes, diversidad y estados escasos; recorrido móvil/escritorio; teclado, foco, zoom, responsive y movimiento reducido. Fallback útil sin JavaScript. Revisiones de código, convenciones y diseño antes del handoff. Theme Check y pruebas del proyecto aplicables; la cobertura local se distingue de storefront.

La aceptación incluye evidencia en Shopify de definiciones, entradas y asignaciones de los productos de prueba, lectura real en el storefront y un procedimiento reproducible para el catálogo final. Tener un campo definido no equivale a tener los productos clasificados. Registrar la matriz respuesta → atributos → productos/variantes esperados → tarjetas obtenidas, incluyendo datos faltantes, agotados y cambios de color. Si falta una familia en los cinco productos iniciales, la cobertura se declara y se completa con casos de prueba adecuados; no se etiqueta un producto arbitrariamente para forzar un resultado.

## Etapa 2 · Dirección de arte y acabado

Perfeccionar primero tres pantallas representativas: entrada, detalles y resultados. Juntas permiten evaluar portada, elección visual, fotografías macro, selección y presentación de producto. Comparar una dirección principal con una alternativa concreta de tratamiento visual; resolver la dirección antes de producir todos los activos.

| Superficie | Tratamiento propuesto | Fuente preferida |
| --- | --- | --- |
| Entrada | Escena editorial, composición y punto focal distintos para móvil/escritorio | Activo editorial existente o generado según brief; producto real si se representa un SKU |
| Forma | Siluetas frontales de escala óptica, peso y perspectiva consistentes | SVG editable diseñado con referencias verificadas |
| Color | Paletas limpias y una muestra de armazón de escala constante cuando aporte claridad | CSS/SVG y fotografías reales de variantes |
| Detalles | Macros comparables de mate/brillo, liso/carey y construcciones | Fotografías reales bajo luz y escala controladas |
| Uso | Escenas cercanas con una misma dirección de luz y composición, o una familia de ilustraciones | Fotografía editorial o generación conceptual coherente |
| Tamaño | Mismo rostro y cámara, modificando solo proporción aparente; ayuda técnica separada | Diagrama o SVG controlado |
| Resultados | Producto real completo, resumen único de preferencias y edición visible; dos columnas móviles | Imágenes y datos de la variante |

El refinamiento cubre espaciado óptico, alineación de imágenes, saltos de línea, radios, bordes, sombras puntuales y estados de interacción. Las texturas de superficie tienen una función acotada, sin competir con las muestras de producto. Las animaciones comunican selección/progreso y respetan movimiento reducido. No se usan esperas artificiales para simular análisis.

La calidad se evalúa por consistencia, claridad de comparación, tactilidad de los controles, legibilidad y continuidad entre pasos. La referencia internacional sirve para esos criterios; no se copian textos, activos o una identidad completa de un competidor.

## Modelos y producción de activos

Puede mantenerse GPT-6.1 Sol High como opción de trabajo para especificación, lógica, SVG, prompts y revisión. No se afirma ni modifica desde aquí el modelo o esfuerzo efectivos de la sesión. La [documentación oficial de Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) documenta texto/código y uso de herramientas; la [generación de imágenes](https://developers.openai.com/api/docs/guides/tools-image-generation) usa modelos especializados.

Para imágenes, preparar un brief maestro y subprompts por familia. Comparar primero dos piezas representativas —portada y escena de uso— y elegir el generador por fidelidad al brief, consistencia y facilidad de edición. Producir el resto con las mismas referencias de estilo. No elegir un modelo distinto por pregunta como criterio de partida.

Cada subprompt contiene: finalidad, referencia aprobada, sujeto, composición, cámara/escala, luz, paleta, material, relación de aspecto, recorte móvil, área libre para texto HTML, restricciones y criterio de aceptación. Se conservan prompt, entradas, salida seleccionada y uso previsto.

Brief inicial para una escena editorial conceptual, pendiente de elegir dirección:

> Crear una escena editorial para el paso «[uso]» de Lemoon. Debe comunicar «[contexto]» con una composición cercana y cotidiana. Mantener la luz, paleta cálida, tratamiento de materiales y perspectiva de la referencia aprobada adjunta. Entregar en «[relación de aspecto]», con el motivo principal dentro de «[zona segura móvil]» y espacio libre en «[zona de composición]». Imagen sin texto, logotipos, sellos ni interfaz. Los textos se incorporarán como HTML. Esta escena comunica contexto y no representa un producto en venta. Criterio: se reconoce el uso y funciona junto a las otras escenas sin cambiar de lenguaje visual.

Los campos del brief se resuelven antes de ejecutar una generación. Para fotografías comerciales, utilizar el activo original de la variante y preservar geometría/color; una generación editorial no acredita la apariencia, textura, transparencia, material ni ajuste de un producto. La ficha de cada activo distingue editorial, diagrama y producto.

## Secuencia y puntos de revisión

1. Confirmar alcance del catálogo y contrato mínimo; cerrar diccionario de atributos y ejemplos de afinidad bajo la dirección visual ya elegida.
2. Preparar definiciones, entradas y productos/variantes de prueba en Shopify, y comprobar su lectura.
3. Implementar y demostrar todo el recorrido y el grupo de product cards con esos datos, manteniendo una lista explícita de activos provisionales.
4. Revisar las tres pantallas representativas de acabado; resolver excepciones visuales antes de extenderlas.
5. Producir activos, trasladar la dirección al resto del flujo y repetir QA afectado, incluyendo calidad/peso/recorte de imágenes.
6. Revisión humana de la entrega. Merge, cierre del ticket y publicación mantienen sus pasos propios; ninguna de las dos etapas equivale por sí sola a lanzamiento.

La implementación comienza con la especificación y plan correspondientes, tomando la organización aprobada como base. Esta revisión incorporó alcance de catálogo y una auditoría de solo lectura de Shopify; no modificó código del tema, Figma ni datos/configuración de Shopify.
