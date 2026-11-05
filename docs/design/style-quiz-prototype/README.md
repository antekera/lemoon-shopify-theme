# LEM-11 · Propuesta de diseño del quiz

Diseño editable y prototipo para revisión humana, preparado el 5 de noviembre de 2026. Esta entrega continúa la [investigación de contenido y factibilidad](../../content/2026-11-04-buscar-mi-estilo-research.md); todavía no implementa la página de Shopify.

- [Archivo editable en Figma](https://www.figma.com/design/Z6qNxx6rSmYAbA1q23yvs1)
- [Prototipo móvil](https://www.figma.com/proto/Z6qNxx6rSmYAbA1q23yvs1?node-id=11-169&starting-point-node-id=11%3A169)
- [Prototipo escritorio](https://www.figma.com/proto/Z6qNxx6rSmYAbA1q23yvs1?node-id=11-733&starting-point-node-id=11%3A733)
- [Migración del equipo Lemoon al equipo personal](../figma-team-migration-2026-11-05.md)

## Recorrido propuesto

Entrada → forma → color → detalles → uso → tamaño → selección. Cinco preguntas, multiselección y salida «Muéstrame variedad». Sin presupuesto, clasificación por género ni pregunta de edad. El catálogo infantil y la disponibilidad por talla siguen sujetos a datos reales.

| Paso | Contenido | Móvil | Escritorio |
| --- | --- | --- | --- |
| Entrada | Tu próximo par. Muy tú. / acceso directo al catálogo | `11:169` | `11:733` |
| Forma | Redondos, rectangulares, cat-eye, aviador, geométricos | `11:199` | `11:765` |
| Color | Negros y grises, cafés y miel, tonos claros, colores protagonistas | `11:305` | `12:2` |
| Detalles | Acabados, patrones y materiales en pestañas separadas | `11:381` | `11:869` |
| Uso | Trabajo o estudio, todos los días, salir/cambiar look, aire libre | `11:459` | `12:78` |
| Tamaño | Presencia compacta, intermedia u oversize, con ayuda de medidas | `11:545` | `11:949` |
| Selección | Hasta tres referencias, cinco accesos para editar y selección completa | `11:646` | `11:1051` |

El archivo contiene **26 frames**: los siete anteriores en ambas resoluciones, cuatro variantes de pestañas, dos estados móviles de coincidencias, dos ayudas de medidas, dos vistas de catálogo y dos paneles de referencia. Las dimensiones base son 390 y 1440 px; algunos frames crecen con el contenido.

## Tratamiento visual y activos

Se usan el wordmark SVG del repositorio, navy `#0b1f3a`, cálido `#f7f4ee`, acento limón `#f7e600`, Urbanist y Hanken Grotesk. La portada reutiliza `assets/lemoon-category-opticos-generic-v1.jpg`, activo editorial genérico que no acredita un SKU. Las siluetas, escenas y muestras son vectores editables conceptuales; no son fotografías de productos disponibles.

La búsqueda de bibliotecas y el intento de importar componentes originales no encontraron una biblioteca Lemoon publicada utilizable. Se compuso el diseño con capas nativas y variables locales de referencia; no quedó vinculado a una biblioteca compartida. No se publicó una biblioteca nueva.

La escala de títulos Light y los botones en sentence case son una **propuesta local pendiente de aprobación**. No sustituyen el contrato global de `DESIGN.md`, que no se modificó. La implementación debe resolver esta decisión antes de integrar estilos.

## Interacciones y evidencia

Se configuraron 163 nodos interactivos, con navegación, selección booleana reversible, conservación de elecciones entre pasos, pestañas, apertura/cierre de paneles y reinicio de variables al volver a empezar. Hay cuatro inicios de presentación: móvil, escritorio, pocas coincidencias y sin coincidencias.

Se comprobó manualmente en la presentación móvil: entrada, selección y deselección de forma, paso por color, pestañas Patrones y Materiales, selección de opciones, uso, tamaño, apertura/cierre de ayuda de medidas, llegada a resultados y apertura del panel de referencia. La estructura de enlaces se comprobó sin destinos faltantes; no se pulsaron exhaustivamente todos los enlaces ni se recorrió todo el flujo de escritorio.

Las capturas conservadas muestran la revisión visual de forma, acabados, patrón carey, tamaño, resultados y entrada de escritorio. El rol `lemoon-design-lead` revisó de forma independiente el concepto y confirmó resueltos tres hallazgos: aviador poco distinguible, preferencias móviles desbordadas y patrón carey sin representación visible. Veredicto: sin bloqueantes visuales para presentar el concepto a revisión humana. Esta revisión fue de solo lectura por responsabilidad, sin aislamiento técnico de permisos.

## Límites y decisiones antes de implementar

- Los resultados y el catálogo del prototipo son muestras fijas. No existe conexión con Shopify, stock ni motor de afinidad; el panel de detalle usa una referencia única.
- Falta diseñar y validar el resumen que muestre valores elegidos y razones concretas de afinidad. Los cinco accesos actuales solo llevan a editar cada eje.
- La transparencia debe tratarse como atributo propio si el catálogo la admite; no está representada por «Tonos claros» ni incluida aún como opción.
- La presencia oversize es estética. Las medidas físicas y la compatibilidad con la persona deben apoyarse en datos de producto; el prototipo solo explica cómo comparar ancho de lente, puente y patilla.
- Las ilustraciones de acabados y patrones deben contrastarse con fotografías reales comparables antes de su uso comercial. No atribuir acetato, metal u otros materiales a productos sin verificar datos.
- Figma no acredita teclado, foco, lectores de pantalla, movimiento reducido ni responsive entre ambos anchos. Eso requiere implementación y pruebas de storefront.

No hubo cambios de tema, commit, push, PR ni publicación en Shopify en esta etapa. LEM-11 continúa como trabajo en curso hasta revisar el diseño y completar su implementación y aceptación.
