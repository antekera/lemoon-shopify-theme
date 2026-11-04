---
description: Fuentes y sincronización manual de datos en políticas y páginas informativas
---

# Fuentes de datos legales y comerciales

Aplica esta regla al cambiar identidad de la empresa, datos de contacto, dirección de devolución, plazo de entrega o contenido de políticas. Antes de editar, consulta la configuración y el tema realmente publicados, las páginas y plantillas asignadas, y el PR en curso: la tabla describe la implementación, no acredita que un cambio de rama esté desplegado.

## Dónde actualizar

| Dato o contenido | Fuente y superficies que deben revisarse |
| --- | --- |
| Razón social | Metacampo de tienda `custom.razon_social`. El footer de la rama y `lemoon-business-content` lo usan; los textos de las políticas escritas que incluyen el nombre son copias estáticas en Configuración → Políticas. Revisar también el nombre configurado en el footer del tema publicado. |
| RUT | `custom.rut_empresa` es consumido por `lemoon-business-content` en determinadas rutas legales. El valor de prueba no es válido; no mostrarlo ni sustituirlo por otro sin instrucción del titular. La política nativa de privacidad puede contener un marcador pendiente. |
| Domicilio legal | `custom.domicilio_legal` se pasa a `lemoon-business-content`. Cuando no existe, no inventar un domicilio. Revisar por separado el texto estático o marcador en cada política nativa. |
| Plazo estimado de entrega | Metacampo `custom.plazo_entrega_receta`; `lemoon-delivery-estimate` lo usa para FAQ y contenido de sección legal compatible. Su nombre histórico no limita el alcance a pedidos con receta. La política nativa de envío contiene una copia estática: editarla también y verificar checkout y demás páginas que prometan plazos. |
| Dirección de devolución | El ajuste `return_address` de la sección legal se usa para el marcador `[DIRECCION_DEVOLUCION]` en contenido de sección. La definición de tienda `custom.direccion_devoluciones` existe, pero no se encontró un consumidor en este tema; no asumir que alimenta ese ajuste ni la política nativa. Comprobar y actualizar cada superficie aplicable solo con una dirección confirmada. |
| Correo de contacto | Configuración → Políticas → Información de contacto es la fuente del bloque de la página de contacto en la rama que incorpora esa integración. Otras políticas y el ajuste de correo del footer pueden contener valores propios; revisarlos y actualizarlos cuando corresponda. |
| WhatsApp | El ajuste `whatsapp_number` de la sección Footer del tema determina el enlace `wa.me`. Sin número se omite el enlace en la rama correspondiente. Verificar el valor del tema de destino; no tratar el teléfono general de la tienda como WhatsApp sin confirmación. |
| Texto legal | Configuración → Políticas contiene privacidad, términos, reembolso, envío y contacto. La plantilla `page.legal` preparada en la rama lee las políticas nativas por página; hasta que esté desplegada y asignada, las plantillas anteriores pueden seguir usando copias de contenido. Garantías y FAQ mantienen contenido de página/tema que debe revisarse por separado. |

## Procedimiento

1. Identifica el dato solicitado y confirma su valor con el titular o una fuente de Shopify adecuada. No uses valores de prueba ni datos incompletos como definitivos.
2. Actualiza las fuentes que correspondan y compara todas las superficies afectadas: plantilla asignada, política nativa, páginas relacionadas, footer y checkout. Las políticas escritas personalizadas no ejecutan automáticamente los marcadores o metacampos del tema; si incluyen el dato como texto, actualízalo manualmente. No activar políticas automatizadas de Shopify sin revisar el reemplazo de contenido.
3. Mantén la misma información y los mismos plazos en las superficies aplicables. En la política de privacidad revisa marcadores pendientes también en el checkout nativo, donde el tema no los resuelve. No afirmes sincronización automática sin una integración implementada y verificada.
4. Antes de borrar una definición, ajuste o valor de Shopify, identifica sus consumidores en el tema publicado, otras plantillas, checkout, apps, automatizaciones y trabajos en curso. Una búsqueda en este repositorio no prueba que esté sin uso. Conserva datos y campos si falta evidencia, y documenta cualquier migración y verificación antes de retirarlos.
5. Registra resultados y pendientes en el ticket pre go live LEM-143 cuando afecten identidad, devoluciones o coherencia pública. Publicación del tema y cambios de contenido conservan sus autorizaciones y controles propios.
