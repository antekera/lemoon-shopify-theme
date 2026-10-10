# Notificaciones de tarjetas de regalo

Plantillas de revisión para la tienda Lemoon, en español. No forman parte del
bundle del tema: Shopify administra las notificaciones de clientes por separado.
`shop.email_logo_url`, `shop.name` y `shop.email` usan la configuración real.
Sin logo configurado se muestra el nombre de la tienda. Las fuentes seguras para
correo evitan depender de tipografías externas. El azul y el fondo cálido replican
los colores de la marca; estos valores deben estar inline para los clientes de
correo y no pueden usar las variables CSS del storefront.

| Archivo | Notificación de Shopify |
| --- | --- |
| `es/gift-card-created.liquid` | Nueva tarjeta de regalo, cuerpo HTML |
| `es/gift-card-created.subject.liquid` | Nueva tarjeta de regalo, asunto |
| `es/gift-card-receipt.liquid` | Recibo de tarjeta de regalo, cuerpo HTML |
| `es/gift-card-receipt.subject.liquid` | Recibo de tarjeta de regalo, asunto |

Ambas se probaron con **Previsualizar plantilla con contenido**, sin guardar ni
enviar una prueba. La muestra nativa de Shopify usa $100 y un código ficticio;
no es una tarjeta emitida. LEM-9 permanece In Progress hasta revisión.

## Aplicación después de revisar

1. En Configuración → Notificaciones → Notificaciones de clientes, abrir la
   notificación correspondiente y Editar código.
2. Conservar una copia de los valores actuales del asunto y cuerpo para revertir.
3. Copiar cada archivo en su campo y elegir **Previsualizar plantilla con contenido**.
4. Confirmar asunto, destinatario, mensaje, monto, código y enlace. Guardar aplica
   la notificación a futuros envíos de toda la tienda; no es un borrador del tema.
5. Después de aprobar la aplicación, probar la entrega y los enlaces en clientes
   de correo reales. No emitir saldo ni efectuar una compra para una revisión visual.

La plantilla de recibo conserva `gift_card.send_on` para tarjetas programadas
por otros canales. El formulario de compra preparado no ofrece programación.
Vencimiento y Wallet aparecen solo si Shopify los proporciona. No se inventan
restricciones comerciales ni cobertura presencial. El enlace nativo de la tarjeta
incluye su acceso privado; no debe almacenarse en capturas de pedidos reales.

## Verificación

`tests/unit/gift-notifications.test.js` renderiza Liquid con LiquidJS fijado en
dependencias de desarrollo. Solo los filtros Shopify de dinero/código/asset se
modelan para datos sintéticos. La muestra nativa es la autoridad para formato
real de moneda. `tests/e2e/gift-notifications.spec.js` verifica ese HTML en navegador:
320/390/820/1440px, código, monto, mensaje, enlaces, programación y ausencia de JS.
Estas pruebas no certifican el soporte de Outlook/Gmail ni la entrega real.
`locale_direction` pertenece al contexto nativo de notificaciones y aparece en
los dos originales de Shopify. Una anotación de Theme Check limita la excepción
a esa línea: el resto de cada plantilla conserva la comprobación de objetos
indefinidos. La prueba RTL verifica que la dirección del correo se preserve.
