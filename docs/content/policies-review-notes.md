# Políticas: evidencia y datos pendientes

Revisión: 10 de octubre de 2026. Documento de trabajo; no publicado.

Shopify tiene una política nativa de privacidad actualizada el 18 de agosto de
2026. No devuelve políticas nativas de reembolso, envío ni términos. La política
actual conserva texto generado que menciona contraseñas y un teléfono vacío;
la tienda usa cuentas nuevas de Shopify, sin contraseña administrada por el tema.
También requiere definir el tratamiento de recetas y revisar proveedores reales.

## Base para devolución y garantía

La información vigente de SERNAC describe la garantía legal de seis meses y la
posibilidad de elegir reparación, cambio o devolución cuando corresponda. Para
compras a distancia describe el retracto de diez días desde la recepción, sujeto
a las condiciones legales. No debe sustituirse por una garantía voluntaria sin
explicar la diferencia.

La excepción de productos confeccionados según especificaciones del consumidor
no debe aplicarse de forma automática a todo el catálogo óptico. Su alcance y la
información previa necesitan revisión para la oferta concreta de Lemoon.

Fuentes oficiales:

- [Garantía legal](https://www.sernac.gov.cl/portal/604/w3-propertyvalue-8062.html).
- [Derechos en comercio electrónico](https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html).
- [Interpretación del retracto](https://www.sernac.cl/portal/618/articles-76816_archivo_01.pdf).

## Privacidad y recetas

[La Ley 21.719](https://www.bcn.cl/leychile/Navegar?idNorma=1209272&idParte=10527471&idVersion=2026-12-01)
figura con vigencia diferida al 1 de diciembre de 2026. La redacción debe distinguir
la situación vigente de la adaptación futura y describir la operación real.

Datos a confirmar antes de redactar y publicar condiciones definitivas:

- Razón social, RUT y domicilio del responsable.
- Correo público definitivo: Admin configura ayuda@lemoon.cl; footer usa hola@lemoon.cl.
- Direcciones y procedimiento para devoluciones, costos, plazo operativo de reembolso.
- Alcance de la promesa de 30 días y garantía de 365 días que aparece en contenido del tema.
- Cobertura, tarifas y tiempos de preparación/transporte reales; fabricación óptica separada del despacho.
- Quién revisa las recetas, proveedores destinatarios, plazo de conservación y canal de eliminación.
- Apps de analítica/marketing efectivamente activas y configuración de consentimiento.

Las tarifas, plazos, identidad legal y prácticas de conservación no se deducen
_del diseño_. No se reemplazó la política activa ni se publicaron términos nuevos.

## Escenario comercial de prueba autorizado

El usuario autorizó continuar con datos comerciales de prueba y corrigió la
razón social a **Servioptic SpA**. Se prepararon nueve páginas de muestra con
contenido editable y un aviso visible. La configuración de sección `demo_data`
permite activarlo o desactivarlo; por defecto es false para nuevas instancias.
Las plantillas de revisión de esta rama lo activan explícitamente.

La identidad y los valores de muestra están en
[commercial-test-data.json](commercial-test-data.json): RUT 00.000.000-0,
domicilio Avenida de Ejemplo 123, correo contacto@servioptic.example, horario
09:00–18:00 de lunes a viernes; tarifas $3.990/$5.990, envío sin costo sobre
$70.000, plazos de preparación y transporte separados, devolución voluntaria de
30 días, cobertura voluntaria de 365 días y propuesta de conservación de receta
de 90 días. El RUT no es válido para facturación y el correo no recibe mensajes.

Los datos desbloquean la revisión de contenido y recorridos de prueba. No
configuran impuestos, tarifas de checkout, convenios, proveedores de pago ni
eliminación de archivos. La política nativa publicada y el CMS quedan intactos.
El borrador de privacidad se revisa con `/pages/contact?view=privacidad`.
Las referencias de retracto y garantía legal se contrastaron nuevamente con
[SERNAC](https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html); las
condiciones voluntarias de muestra no reemplazan esos derechos.

Validación de esta adición: 129 pruebas unitarias globales y 63 casos storefront
focalizados aprobados en escritorio, tablet y móvil (27 nuevos de datos de
prueba y 36 recorridos existentes de soporte/contacto). Theme Check: 239 archivos
sin incidencias; ambas revisiones aprobadas. El primer intento del preview usó
plantillas anteriores por sincronización fuera de orden; después de reactivar
la sincronización de secciones y templates, la corrida completa pasó.
