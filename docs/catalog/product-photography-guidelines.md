# Fotografía de productos — guía de operación

Estado: **propuesta normativa de LEM-71, revisada independientemente y pendiente de aprobación humana**. No acredita fotos producidas, productos aprobados ni cargas en Shopify. [Investigación y contratos](product-photography-research.md) conserva fuentes, revisiones y reservas.

## Qué preparar

Usa una unidad real identificada por producto, SKU y variante. No representes un color con la foto recoloreada de otro. Confirma qué incluye la oferta antes de mostrar estuches, accesorios o cristales; una fotografía no acredita materiales, protección UV, compatibilidad óptica ni garantías.

La identidad aprobada está en [DESIGN.md](../../DESIGN.md#7-marca-imágenes-y-superficies) y [Brand Guidelines](../design/brand-guidelines.md): producto completo sobre blanco o gris muy claro; lifestyle con luz natural, personas diversas y entornos limpios. Esta guía no cambia colores, tipografía ni componentes. No incrustes precios, sellos, slogans ni texto técnico en las fotografías.

**Ruta por defecto sin compra:** celular disponible, cámara trasera principal, apoyo estable, mesa junto a una ventana con luz indirecta y fondo blanco mate continuo disponible. Usa una hoja o cartulina blanca como rebote. Si ya tienes caja de luz o trípode, puedes usarlos; no son requisito para preparar el estándar. Si el lugar o equipo disponible no permite pasar QA, registra el problema y detén la aceptación de esas fotos: no compres ni contrates sin decisión del responsable. No se ha inventariado el equipo de Lemoon.

## Vistas por producto y variante visual

“Obligatoria” es el mínimo propuesto para aceptar un juego de fotos. Studio ya exige las primeras cuatro vistas de objeto en su revisión final; ninguna foto opcional las reemplaza. Repite el juego cuando cambie color, textura o geometría. Si dos tallas comparten foto, el responsable debe confirmar que la geometría visible corresponde a ambas y registrar la reutilización; nunca copiar cotas entre tallas por semejanza.

| Vista | Exigencia | Captura y criterio de selección | Campo actual de Studio |
| --- | --- | --- | --- |
| Frontal | Obligatoria | Frente paralelo a cámara, puente centrado, cristales nivelados, patillas abiertas; armazón completo. Será la principal del producto y la asignada a su variante | `front` |
| 45° / perspectiva | Obligatoria | Girar el producto, mantener cámara; frente completo y patilla del lado derecho de la imagen visible. Repetir el lado en el catálogo | `diagonal` |
| Lateral / patilla completa | Obligatoria | Perfil aproximado de 90°, frente a izquierda, punta de patilla a derecha; bisagra y patilla enteras | `side` |
| Posterior | Obligatoria por compatibilidad con Studio | Interior hacia cámara, puente centrado, ambas bisagras y patillas abiertas completas | `back` |
| Detalle / bisagra / textura | Condicional: si el juego general no permite examinar ese rasgo relevante | Acercamiento real, nítido y sin aumento generado. Puede mostrar solo el detalle si se identifica como tal; nunca portada | Sin ángulo específico; conservar fuera de Studio o incorporar por flujo autorizado de Shopify, sin falsear `front`/`back` |
| Patilla interior / inscripción | Condicional: si aporta identificación o información confirmada | Fotografiar inscripción legible; no inferir material ni medidas desde una imagen borrosa | Sin ángulo específico; misma reserva que detalle |
| Plegado | Opcional | Producto completo con patillas cerradas; no sustituye posterior | `closed` |
| En persona / lifestyle | Opcional, cuando aporte contexto y exista autorización de uso | Persona real con esa variante; ojos y armazón visibles, sin belleza ni modificación facial. No demuestra calce universal | `on-model-man`, `on-model-woman`; `on-model` es legado. Las etiquetas de Studio no obligan a producir dos retratos ni fijan público del producto |
| Referencia física de escala | Condicional: cuando sea necesaria para explicar tamaño | Foto separada con regla en el mismo plano y unidad legible; sin perspectiva que sugiera medidas falsas | Sin ángulo específico; guardar en manifiesto. No subir con una etiqueta engañosa |

El **SVG de medidas es un diagrama informativo**, no fotografía ni prueba de medición. La guía de talla consume `custom.frame_dimensions`; solo admite cotas verificadas para el producto/talla. No extraigas milímetros de píxeles. Si falta un dato, registra “no disponible”. Un retrato tampoco sustituye medidas verificadas.

## Captura repetible

1. Limpia la lente del celular y el armazón con materiales apropiados para la pieza. Retira huellas y polvo sin modificar acabados. Identifica el producto antes de moverlo al set.
2. Evita sol directo y mezcla de ventana con lámparas de distinto color. Usa luz amplia y difusa; aleja o gira el set si los reflejos tapan puente, bisagras o contorno. No borres reflejos que cambien la apariencia del cristal.
3. Mantén fijo el celular a la altura del puente para frontal. Usa la cámara principal sin zoom digital, filtros, modo retrato ni embellecimiento. Aléjate si la cercanía deforma el frente. Revisa enfoque en el producto, no en el fondo.
4. Bloquea enfoque/exposición si el dispositivo lo permite; vuelve a enfocar cuando cambie el plano. El bloqueo de exposición no equivale a balance de blancos bloqueado. Si existe control de blancos, conserva el ajuste durante el juego. Si no, revisa dominantes entre tomas y repite si cambia la luz.
5. Marca en la mesa la posición del apoyo y del producto. Anota celular/cámara, lente, altura/distancia del set, luz y ajustes disponibles; son registros de repetibilidad, no cotas del armazón.
6. Toma una referencia de luz/color al inicio y cuando cambie la iluminación. Una hoja blanca sirve para detectar dominantes, no certifica colorimetría. Usa una carta neutra calibrada solo si ya está disponible; no atribuyas calibración al set sin medición.
7. Captura las cuatro vistas y los detalles necesarios. Selecciona comparando con la pieza física bajo luz neutra: conservar transparencia, vetas, acabado y tono. Una pantalla sin calibrar limita la exactitud; no prometer coincidencia absoluta entre pantallas.

## Selección, edición y exportación

Todos los valores siguientes son **objetivos propuestos**, no límites de Shopify ni resultados medidos sobre un catálogo real.

| Parámetro | Propuesta para operación |
| --- | --- |
| Lienzo comercial | 1:1, export de 2048 × 2048 px cuando el original lo permita; conservar original de mayor resolución. No ampliar con IA ni interpolar para fingir detalle |
| Ocupación del producto | Empezar con 80–90% del ancho útil y al menos 5% de margen en cada borde; mismo tamaño aparente entre variantes de una misma vista. Si las patillas no caben, reducir proporcionalmente el conjunto, sin cortarlas |
| Fondo | Blanco mate uniforme por defecto; gris muy claro permitido por identidad. No quitar blancos/transparencias del propio armazón para uniformar el fondo |
| Edición permitida | Exposición y blancos moderados con referencia; enderezar cámara, ajustar solo fondo/lienzo y escala uniforme. No cambiar geometría, color, veta, logos, espesor ni rayas reales del producto |
| Formato | JPEG RGB convertido a sRGB para fotografía opaca; PNG si se requiere transparencia o si JPEG destruye bordes finos. Studio admite JPEG/PNG/WebP; conservar HEIC/RAW como originales, convertir una copia para ese flujo |
| Compresión | Exportar una sola vez desde el editable. Empezar en calidad alta; si el editor usa escala 0–100, 85–95 es un punto de prueba, no equivalencia entre aplicaciones. Revisar al 100% bisagras, alambres y transparencias |
| Peso | Objetivo orientativo ≤2 MB por export comercial, sin sacrificar fidelidad; si no se logra, registrar excepción y priorizar calidad. Mantener siempre menos de 20 MB para Shopify, aunque Studio permita archivos mayores |
| Variantes responsive | Entregar un archivo fuente por vista; el tema/CDN pide tamaños. No crear archivos por breakpoint ni subir una miniatura como principal |
| Privacidad | Normalizar orientación en píxeles; quitar geolocalización y metadatos personales del export público, conservando registro privado del original |

No sacrifiques armazón para llenar un bloque: las superficies usan `contain`, pero PDP añade detección de margen blanco y mezcla visual con el fondo. Revisa el resultado real, especialmente armazones transparentes y blancos. Si el consumidor corta o altera el aspecto, registra una incidencia del consumidor; no deformes ni recolorees la foto para compensarlo.

**Remoción de fondo:** no es obligatoria. Primero resuelve fondo y luz en captura. Si usas una herramienta ya disponible, trabaja sobre copia con máscara reversible y compara al 100% sobre blanco y gris: comprobar puente, huecos, bisagras, patillas finas y transparencias. Rechaza halos, partes borradas o reconstruidas. No aceptar una sugerencia automática sin revisión.

**IA:** puede ayudar a proponer alt o una máscara, siempre revisados contra el original y la pieza. No generar SKU, completar partes ocultas, cambiar color, limpiar defectos reales ni usar aumento generativo para inventar textura. Una escena conceptual/editorial va separada, identificada y nunca reemplaza la foto comercial. No subir originales privados a un servicio sin autorización para ese uso.

## Archivo y trazabilidad

Conserva `originales/`, `editables/` y `exports/` separados por producto/variante. No sobrescribas el original ni reexportes repetidamente un JPEG. Guarda ajustes, máscara si existe, versión, autor y aprobación. El repositorio no define una carpeta compartida oficial: hasta que su responsable la confirme, conserva el archivo bajo custodia del operador y entrega su ubicación al coordinador; no publiques rutas privadas ni enlaces firmados en documentación pública.

Nombre propuesto: `lemoon-{producto}-{variante}-{vista}-{secuencia}-v{revision}.{ext}`. Minúsculas ASCII, guiones, identificadores estables y sin datos personales; el nombre no asocia automáticamente una variante ni selecciona vistas en el tema.

Ejemplos **sintéticos**, sin producto, color comercial ni medidas reales:

- `lemoon-demo-001-negro-front-01-v1.jpg`
- `lemoon-demo-001-negro-diagonal-02-v1.jpg`
- `lemoon-demo-001-negro-side-03-v1.jpg`
- `lemoon-demo-001-negro-back-04-v1.jpg`
- `lemoon-demo-001-negro-detail-bisagra-05-v1.jpg`

Registra un manifiesto por juego; puede ser una planilla sin automatización. Campos: producto/SKU/ID de variante y nombre exacto de opción Color, vista, original y checksum, editable, export/versión, ancho/alto/peso/perfil, descripción/alt, derechos/consentimiento si aplica, revisión de fidelidad, responsable/fecha y estado. Tras una carga autorizada, añadir ID de media, asociación y orden verificados en Shopify; antes de esa carga, dejar esos campos pendientes. En Studio añadir `photoId`, `angle` y `candidateId` si existe, sin confundir archivo fuente con candidato procesado.

Fila sintética: `demo-001 | variante-sintetica-negro | diagonal | lemoon-demo-001-negro-diagonal-02-v1.jpg | 2048×2048 | peso por medir | media pendiente | revisión pendiente`. No rellenar tamaños del producto ni checksums ficticios.

## Alt, marcadores y asociación

Describe modelo, color confirmado y vista con lenguaje breve. Ejemplos sintéticos: “Armazón Demo 001 negro, vista frontal”; “Bisagra del armazón Demo 001 negro, detalle lateral”. Evita “imagen de”, listas SEO y beneficios no demostrados. El objetivo editorial es alrededor de 125 caracteres, sin borrar información necesaria para cumplirlo.

Una fotografía que permite examinar producto es informativa. Una escena que solo ambienta y cuyo contenido no aporta información puede usar `alt=""` en su superficie; si funciona como enlace sin otro nombre, necesita una alternativa que explique su destino. No vaciar el alt de media comercial para esconder metadatos técnicos. Las cotas de un diagrama deben tener equivalente textual accesible con unidad y valores reales; no meter una tabla completa de medidas solo en alt. [Criterio W3C](https://www.w3.org/WAI/tutorials/images/decision-tree/).

**Compatibilidad vigente del tema:** el hover de tarjeta busca marcadores dentro del alt. Para diagonal de una variante usa `card-diagonal:{nombre exacto de Color en minúsculas}` al final de una descripción humana. Ejemplo sintético: `Armazón Demo 001 negro, vista diagonal; card-diagonal:negro`. No uses el slug del archivo si la opción real se llama distinto. Si los nombres de color se contienen entre sí, la búsqueda por substring puede ser ambigua: registrar y comprobar, sin inventar nuevos delimitadores.

`card-view:diagonal` es respaldo general y puede mostrar otro color cuando hay variantes; no usarlo como sustituto del marcador específico. `card-model:{color}` es respaldo legado del swatch; no etiquetar una foto frontal como modelo. Marcadores pueden aparecer en alt de PDP/buscador: es deuda de compatibilidad, no buena semántica accesible ni promesa de ocultación. La migración a metadatos separados requiere otro cambio, fuera de esta guía.

Studio **no añade estos marcadores automáticamente ni acredita asociación de media a variante** en la revisión inspeccionada. No asumas que nombrar un archivo `front` o subirlo en ese ángulo configura el tema. El operador debe verificar por un flujo autorizado la portada frontal, la imagen asignada a cada variante, el alt y las diagonales específicas. No se modifica Shopify al redactar esta guía.

## Checklist de entrega por juego

- [ ] **Captura:** producto/SKU/variante identificados; cuatro vistas de objeto completas; detalle/escala justificados cuando corresponda; luz y orientación consistentes; derechos y consentimiento disponibles.
- [ ] **Selección:** nitidez al 100%, sin movimiento ni reflejos que oculten rasgos; comparación con unidad física; ninguna variante recoloreada ni evidencia generada.
- [ ] **Edición:** original intacto, copia editable y ajustes recuperables; sin deformación ni cambio de acabado; máscaras comprobadas en bordes y transparencias.
- [ ] **Export:** resolución/proporción/peso/perfil registrados; sin recorte del armazón en vistas completas, sin compresión destructiva, orientación correcta y sin ubicación personal en el export.
- [ ] **Asociación:** manifiesto actualizado; frontal principal y por variante, diagonal identificada por Color real, orden de galería revisado; ángulos no soportados no falseados en Studio. Si no hubo carga autorizada, marcar pendiente.
- [ ] **QA de destino, tras carga autorizada:** tarjeta normal/hover y cambio de cada color, PDP/zoom/miniaturas, configurador con variante, quiz según versión desplegada; probar móvil 390px y escritorio 1440px, además del cambio 749/750px. Son anchos de prueba propuestos, no QA ya ejecutado.
- [ ] **Ausencias:** revisar secundaria ausente, variante sin foto y producto sin media; no aceptar demo/fallback como foto final ni color de otra variante como evidencia del seleccionado.
- [ ] **Aceptación:** guardar evidencia de destino y defectos; revisa un segundo responsable y luego el revisor humano designado. Una aprobación de fotos no autoriza publicación ni activación comercial.

Si falla fidelidad, repite captura. Si falla asociación/render, conserva las fotos y reporta el consumidor afectado. No hay cuota de productos para aprobar esta guía: la producción y aceptación del catálogo corresponden a LEM-70 y sus entregas autorizadas.
