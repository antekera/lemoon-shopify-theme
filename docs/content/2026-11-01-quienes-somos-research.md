# LEM-108 — Quiénes somos: fuentes y decisiones finales

Actualización: 2 de noviembre de 2026. Entrega de referencia para la PR #47 y su vista previa en tema no publicado; sin publicación de la tienda.

## Contenido y composición

- Un H1, «Ver bien. Sentirte tú.», y seis párrafos de relato continuo en español de Chile, con trato de tú.
- Sin imagen, placeholder abstracto, tarjetas, subtítulos internos ni CTAs dentro del relato. Tipografía y espacio conforme a DESIGN.md.
- Título y cuerpo editables en la sección. El texto completo se conserva en [el draft](2026-11-01-quienes-somos-draft.md).
- Eslogan global separado: `settings.brand_slogan`, en Configuración del tema → Información de marca → Eslogan. Valor aprobado: «Se te ven bien».
- El eslogan aparece después del cuerpo, en su propio párrafo. No se duplica en el richtext; un valor vacío lo oculta.
- Carrusel posterior con la colección `all`, selección aleatoria de hasta ocho productos disponibles con precio positivo, mediante el componente existente.
- Newsletter del footer omitida únicamente cuando el handle de página es `nosotros`; las demás páginas conservan su configuración.

## Hechos y dirección confirmados

Miguel confirmó en esta conversación un equipo de profesionales con muchos años de experiencia en el rubro óptico en Chile, combinado con conocimientos en tecnología. También confirmó la dirección de compra online cómoda, con información y asesoría claras y rápidas. No se añaden cifras de años ni títulos profesionales específicos.

El propósito es facilitar la elección y compra de lentes, con productos bonitos y atención a la calidad. La calidad se expresa como compromiso, sin certificar prestaciones, materiales, fabricación propia, resultados clínicos ni durabilidad. La propuesta aporta al rubro sin confrontación con cadenas. El copy omite nombres personales, precio y proveedores por decisión expresa.

Fuentes internas: [brief estratégico aprobado LEM-82](../design/brand-strategy.md), [guía de marca](../design/brand-guidelines.md), [DESIGN.md](../../DESIGN.md) y confirmaciones directas de Miguel del 01–02-11-2026. La aprobación de estrategia no sustituye la revisión humana de esta página.

## Referencias editoriales consultadas

La referencia principal, elegida por Miguel, es Warby Parker — History. El coordinador abrió su página completa el 02-11-2026. Se toma la secuencia narrativa de propósito, historia, producto y experiencia, con redacción original; no sus frases, identidad, precios, fabricación o donaciones.

Las otras seis referencias se abrieron mediante lectura web el 01-11-2026. Registran lo que cada marca comunica; sus afirmaciones no son hechos de Lemoon ni pruebas independientes de su operación.

| Fuente | Aporte y límite |
| --- | --- |
| [Warby Parker — History](https://www.warbyparker.com/history) | Estructura principal: relato seguido. Lectura atribuida al coordinador, 02-11-2026. |
| [Ace & Tate — Our story](https://www.aceandtate.com/gb/about/our-story) | Cercanía y economía de texto; sin trasladar servicios o promesas ambientales. |
| [Cubitts — About](https://cubitts.com/pages/about) | Atención al objeto y sus detalles; sin atribuir taller, laboratorio, reparaciones o cristales de esa marca a Lemoon. |
| [MOSCOT — The Moscot Story](https://moscot.com/pages/the-moscot-story) | Coherencia entre identidad e historia. Documento abierto; consultas posteriores devolvieron timeout, con cobertura parcial. |
| [Karün — Sobre nosotros](https://www.anteojoskarun.cl/pages/sobre-nosotros) | Relación entre propósito y decisiones; sin trasladar origen, impacto o certificaciones. |
| [Untold — Sobre nosotros](https://www.untold.cl/pages/sobre-nosotros) | Detalles que apoyan un relato de calidad; sin adoptar materiales, artesanía ni proveedores. |
| [Rotter & Krauss — Empresa B](https://www.ryk.cl/empresab.html) | Compromisos vinculados a acciones; página temática de marca, sin adoptar métricas, certificaciones ni servicios clínicos. |

No se hizo una auditoría visual responsive ni una prueba de compra de esos referentes. `https://lemoon.cl` resultó inaccesible por la herramienta web en la consulta inicial; esa lectura no certifica el contenido público actual.

## Límites de entrega y aceptación

- La página CMS `/pages/nosotros` conserva `templateSuffix: page`; la vista previa usa `view=nosotros`. La asignación CMS y la metadata pública no se cambian con esa vista previa.
- El título SEO y la meta description del draft siguen como propuesta, no como configuración CMS verificada.
- El catálogo incluye muestras. Disponibilidad y precio positivo no prueban que un producto sea comercialmente definitivo; su revisión previa al lanzamiento continúa pendiente.
- La integración está destinada a un tema no publicado. Preview, merge y publicación son etapas distintas; esta entrega no autoriza publicar.
- La revisión humana del resultado completo y la evidencia final de aceptación siguen pendientes. Las verificaciones del tema, storefront y controles se reportan por el coordinador con sus resultados reales.
- Estas notas documentan contenido y alcance; no sustituyen pruebas de runtime, aprobación de producción ni cierre de LEM-108.
