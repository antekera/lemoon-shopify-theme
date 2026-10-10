# Encuentra tu lente ideal — LEM-11

Fecha: 2026-10-10. Rama: `feat/remaining-storefront-pages`.

Página pendiente dentro del alcance de personalización de páginas aprobado.
Ruta existente del footer: `/pages/buscar-mi-estilo`. Conservar el ticket en
In Progress para revisión del usuario, su hito M9 y etiqueta POST-MVP.

## Referencias verificadas

- [Ticket LEM-11](https://linear.app/antekera/issue/LEM-11/style-quiz-recomendador-de-armazones-web):
  tres a cinco preguntas, dos o tres productos y acceso al catálogo filtrado.
- Figma `9EgE1vntKfwoQIQTzBUBNg`, Cover `0:1`: el outline consultado incluye
  accesos «ENCONTRAR MI FIT» y «ENCUENTRA TU FIT», pero no pantallas del quiz.
  Contexto y captura obtenidos de `269:583`, Home / Desktop / Direction 02,
  para la identidad visual compartida. La página nueva no debe presentarse
  como réplica de un diseño de quiz que no se encontró.
- [Warby Parker, Frames Quiz](https://www.warbyparker.com/quiz/frames):
  preguntas individuales con alternativas sencillas y posibilidad de no saber.
- [Ace & Tate, guía de tallas](https://www.aceandtate.com/de-en/help/glasses-size):
  el ajuste necesita medidas y comprobación física. Las preferencias de estilo
  no demuestran comodidad, compatibilidad de receta ni ajuste clínico.
- Catálogo Shopify consultado: productos activos con variantes reales, pero
  nombres, precios e imágenes actuales incluyen datos de demostración. No
  reemplazar esos datos con precios o fotografías inventadas para el resultado.

## Recorrido y contenido

Cuatro preguntas: forma del rostro (incluye «No estoy seguro»), estilo,
uso principal y presupuesto. Alternativas breves en español chileno, sin
pedir fotografías, correo ni receta. Selección con radios nativos; continuar
valida una respuesta, volver conserva respuestas y reiniciar limpia el flujo.

El resultado muestra hasta tres armazones disponibles, su fotografía,
nombre y precio de una variante comprable, con enlace directo a esa variante.
El presupuesto es un límite estricto. Si faltan productos, se muestran los
que existen; si ninguno cumple el presupuesto, se informa el estado vacío
y se permite ajustar respuestas. Nunca completar resultados con productos
inventados, agotados o fuera de presupuesto.

La curaduría reside en bloques de producto editables y preferencias explícitas
por rostro, estilo y uso. Evitar deducir significado de tags ambiguos: el
catálogo actual mezcla forma del armazón y forma del rostro. La puntuación
ordena afinidades de estilo; el texto describe orientación editorial.

El acceso al PLP usa solamente filtros expuestos por Shopify para la colección
seleccionada. Para presupuesto, leer el `param_name` del filtro nativo de
precio; convertir las subunidades del precio a unidades monetarias en la URL.
Si el filtro no está disponible, mostrar un enlace al catálogo con un texto
que no prometa filtrado. No inventar valores de forma que el catálogo no admita.

La primera comprobación del HTML renderizado confirmó los cinco productos y
sus variantes, pero `catalogue.filters` estaba vacío en la plantilla de página.
El PLP de ópticos sí expone `filter.v.price.lte`. Por ello la sección debe
consultar una vez el HTML del catálogo del mismo origen, con tiempo máximo,
y habilitar el enlace de presupuesto únicamente si encuentra su control de
precio nativo. Ante contraseña, error o ausencia del control, conserva el
enlace general y su etiqueta sin prometer filtros.

## Diseño y accesibilidad

Conservar header y footer actuales. Urbanist ligero para el título; Hanken
Grotesk para lectura. Fondo blanco, tarjetas claras, navy para acciones y
acento lemon discreto. CSS limitado a la sección y tokens existentes.
Una columna en mobile, alternativas amplias, controles de al menos 44 px.

Mostrar progreso textual, legend por pregunta y resultado anunciado.
Mover el foco a la pregunta o resultado al avanzar; errores visibles y
asociados al grupo. La experiencia sin JavaScript conserva una selección
editorial real y acceso al catálogo. No guardar respuestas ni registrar eventos.

## Validación requerida

Pruebas unitarias del ranking, presupuesto estricto, disponibilidad,
deduplicación y enlaces de filtro. Pruebas storefront del recorrido completo,
volver, reiniciar, enlace de producto, enlace al PLP, falta de JavaScript y
ausencia de overflow en desktop, tablet y mobile. Revisiones de código y
convenciones, Theme Check y revisión visual del HTML realmente renderizado.

La plantilla alternativa permite revisar la página sin asignarla globalmente
al CMS publicado. Una respuesta de contraseña de Shopify no cuenta como
validación del quiz; documentar esa limitación si impide una corrida live.
