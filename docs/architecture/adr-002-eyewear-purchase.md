# ADR-002 — Compra de armazones, configuración y receta

**Estado:** definición de producto aprobada por Miguel el 02-11-2026 en la conversación de [LEM-31](https://linear.app/antekera/issue/LEM-31). La aprobación de la definición no certifica implementación ni pruebas. [LEM-23](https://linear.app/antekera/issue/LEM-23) coordina la entrega del configurador.

## Decisión y motivo

El cliente elige un marco y puede comprarlo solo o añadir cristales y tratamientos compatibles. Se reemplaza la decisión histórica «solo armazón, sin configurador»: esa restricción excluía opciones necesarias para el lanzamiento. La oferta se determina por cada producto, sin prometer compatibilidad universal.

La definición completa se conserva en el [documento de decisión](https://docs.google.com/document/d/1s-RvXkfW8G29FDpA7SPEg5Chbc1wO3m7Kcks9LQu0Bw/edit). Este ADR recoge las reglas que deben aplicar los agentes del tema. Ante cambios posteriores aprobados, conciliar esta referencia con LEM-31 y su consumidor LEM-23.

## Oferta, recorrido y precio

- El lanzamiento incluye armazones, cristales y tratamientos compatibles, opciones de sol con o sin receta y accesorios. Los lentes de contacto quedan para una etapa posterior.
- Cualquier marco puede comprarse solo, incluso para adaptarlo después en otra óptica. Conservar esa elección sin obligar a añadir cristales o tratamientos.
- Los accesorios se agregan directamente al carrito. En la mayoría de los armazones, Comprar/Agregar abre el configurador: primero marco, luego cristales y tratamientos. Mantener un único recorrido de carrito y checkout.
- El precio inicial corresponde **solo al marco**, también en modelos de sol. Los cristales, incluidos los de sol, y tratamientos se suman aparte; mostrar desglose y total coherentes hasta el pedido.
- Shopify determina catálogo, variantes, asociaciones, disponibilidad y cargos, conforme a [ADR-001](adr-001-shopify-commerce.md). Inventariar lo existente antes de crear o convertir datos; los paquetes de un prototipo no fijan la oferta comercial.
- `custom.lens_compatible` indica admisión de lentes con receta. Las opciones concretas y sus requisitos se verifican por separado: no admitir receta no descarta automáticamente filtro azul o tinte. Ofrecer y cobrar únicamente opciones compatibles y disponibles.

## Receta y pago

La receta se representa mediante campos estructurados. Desde el lanzamiento, el cliente puede completarlos manualmente o subir una imagen para que **Gemini** proponga su prellenado. Siempre debe revisar, corregir si corresponde y confirmar los campos. Una lectura fallida o incompleta permite continuar manualmente; la IA no inventa valores ni sustituye la revisión del laboratorio.

Configurador y perfil consumen la misma capacidad de receta de [LEM-24](https://linear.app/antekera/issue/LEM-24), con servidor/admin en [LEM-140](https://linear.app/antekera/issue/LEM-140) y entrada posterior desde perfil en [LEM-138](https://linear.app/antekera/issue/LEM-138). Se conserva una receta vigente por cliente y la trazabilidad de la fórmula asociada al pedido. Un reemplazo fallido conserva la anterior; uno exitoso no modifica silenciosamente pedidos ya procesados ni autoriza borrar evidencias históricas.

Se permite pagar el total de las opciones elegidas, incluidos cristales, con receta pendiente y aportarla después desde el perfil. Las opciones fijan el precio de esa compra; después se verifica la compatibilidad de la receta. Las compras de solo marco y las opciones sin requisito de receta no la exigen.

## Laboratorio e incidencias

Cuando se requiere receta, el técnico del laboratorio al que se encargarán los lentes verifica su compatibilidad antes de mandar a fabricar. Distinguir pago confirmado, receta recibida, campos confirmados por el cliente y revisión del técnico; el nombre y registro técnico de esos estados deben acordarse con el back office.

Si la receta es incompatible, solicitar una receta corregida/compatible antes de fabricar. El cliente puede cargarla o enviarla por correo o WhatsApp. Esos canales de atención no implican una integración automática: la incorporación al pedido y nueva verificación deben coordinarse con LEM-24/140.

Si hace falta cambiar opciones y hay diferencia de precio, acordarla con el cliente y cobrarla aparte; una transferencia bancaria es una alternativa prevista. Registrar el ajuste y pago vinculados al pedido Shopify. Si la solución no procede o el cliente no acepta, cancelar y reembolsar, con la regularización de boleta que Miguel describió como anulación. [LEM-51](https://linear.app/antekera/issue/LEM-51) define el procedimiento tributario aplicable; este ADR no determina ni ejecuta ese mecanismo.

## Aplicación por los agentes

| Trabajo | Contrato y responsable |
| --- | --- |
| Oferta y cargos reales | LEM-93/52: confirmar datos y asociaciones. LEM-10: comunicar precio base y adicionales. |
| Entrada y selección | LEM-46/23: PDP y configurador; conservar solo marco, volver/editar y recuperación ante stock, incompatibilidad o error. |
| Persistencia comercial | LEM-98/120/121: selección, cantidades, asociaciones y cargos coherentes hasta el pedido. |
| Receta y comunicación | LEM-24/140/138: capacidad compartida, Gemini, confirmación, recepción y revisión del laboratorio; LEM-139: comunicar el estado real. |

Los planes o tickets anteriores que dejan OCR para después o la revisión del laboratorio sin definir deben conciliarse con esta decisión. Gemini es requisito de lanzamiento; automatizar WhatsApp y nuevas capacidades clínicas o sistemas de fabricación no queda incluido por esta definición.

Antes de implementar, verificar el contrato real de catálogo, campos de receta, autenticación/permisos y mecanismo de entrega al laboratorio. Quedan por concretar la recepción desde atención, conciliación de transferencias y operación tributaria. Este documento no fija endpoints, modelo/versión de Gemini, almacenamiento, scopes ni automatización de fabricación.

Validar solo marco, accesorios directos, sol con cristales cobrados aparte, opciones incompatibles, total hasta pedido, receta manual/Gemini con confirmación, pago con receta pendiente, aporte posterior y revisión/corrección previa a fabricación. Coordinar diferencias y cancelación con sus responsables. Registrar ejecución y evidencia en la [planilla única de QA](https://docs.google.com/spreadsheets/d/1-9lFVbk4erK1CuuN8-dLEuxduo4pVDHMWSYHN05sJvE/edit#gid=979175146); la existencia del ADR no acredita esos resultados.
