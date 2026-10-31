# ADR-001 — Shopify como única plataforma de comercio

**Estado:** decisión vigente, ratificada por Miguel el 29-10-2026 en [LEM-84](https://linear.app/antekera/issue/LEM-84).

## Contexto

Lemoon desarrolla su storefront como un tema Shopify Liquid basado en Dawn. El plan original contemplaba Jumpseller y BSale; la adopción de Shopify reemplazó ese diseño operativo. Mantener dos maestros de comercio produciría ambigüedad sobre precios, disponibilidad, clientes y pedidos, y duplicaría la conciliación y las integraciones.

El alcance vigente incluye la compra de armazones con opciones compatibles y las capacidades de receta del MVP. La antigua descripción «frame-only, sin configurador» fue reemplazada por [LEM-31](https://linear.app/antekera/issue/LEM-31). Las prioridades de [LEM-56](https://linear.app/antekera/issue/LEM-56) mantienen configurador, receta compartida, recepción en back office, carga desde perfil y correos dentro del MVP.

## Decisión

Shopify es la única plataforma de comercio de Lemoon y la fuente de verdad de sus datos comerciales. El tema presenta esos datos y usa las capacidades nativas de carrito, checkout y cuentas de Shopify. Las capacidades propias del back office complementan esa plataforma sin convertirse en un segundo maestro comercial.

### Propiedad de datos y superficies

| Dominio | Fuente y responsabilidad |
| --- | --- |
| Catálogo, productos, variantes y SKU | Shopify. Inventariar y reutilizar las definiciones y asociaciones existentes antes de crear otras; calidad y contrato de datos en [LEM-93](https://linear.app/antekera/issue/LEM-93). |
| Precios y opciones vendibles | Shopify. Mostrar y cobrar las configuraciones realmente asociadas al armazón, compatibles y disponibles. No crear importes cobrables solo en JavaScript ni deducirlos de una maqueta. |
| Inventario y disponibilidad | Shopify. La configuración comercial y la operación del catálogo corresponden a [LEM-52](https://linear.app/antekera/issue/LEM-52). |
| Clientes y pedidos | Shopify. Los procesos propios conservan sus referencias a cliente, pedido y línea; no mantienen un registro comercial maestro paralelo. |
| Storefront | Tema Liquid/Dawn de este repositorio; [DESIGN.md](../../DESIGN.md) es el contrato visual y el [inventario de páginas](../design/page-inventory.md) localiza las superficies y sus responsables. |
| Carrito, checkout y estado del pedido | Capacidades nativas Shopify, dentro de las opciones del plan contratado: [LEM-98](https://linear.app/antekera/issue/LEM-98), [LEM-120](https://linear.app/antekera/issue/LEM-120) y [LEM-121](https://linear.app/antekera/issue/LEM-121). |
| Cuentas y perfil comercial | Cuentas nativas Shopify. La entrada de receta desde perfil se integra por [LEM-138](https://linear.app/antekera/issue/LEM-138); su existencia no autoriza otra identidad o autenticación independiente. |
| Recetas y gestión propia | Capacidad compartida del storefront en [LEM-24](https://linear.app/antekera/issue/LEM-24); servidor, persistencia y recepción/admin en [LEM-140](https://linear.app/antekera/issue/LEM-140), dentro de [lemoon-next-backoffice](https://github.com/antekera/lemoon-next-backoffice). Su contrato define acceso, estados y asociaciones con Shopify. |

### Configurador, receta y comunicaciones del MVP

El configurador de [LEM-23](https://linear.app/antekera/issue/LEM-23) ofrece las opciones existentes para cada armazón. Comprar solo el armazón sigue siendo válido y usa la configuración reducida aplicable. `custom.lens_compatible` indica únicamente si admite lentes con receta: no enumera tratamientos ni garantiza cualquier graduación. Las opciones concretas y sus requisitos deben verificarse por separado en Shopify; filtro azul no implica por sí mismo receta.

Se permite pagar antes de aportar la receta. Configurador y perfil consumen la misma capacidad de carga y reemplazo: una receta vigente por cliente, sustituida solo después de una recepción exitosa, preservando las asociaciones históricas de pedidos y fórmulas. [LEM-140](https://linear.app/antekera/issue/LEM-140) define el contrato servidor/admin; este ADR no fija endpoints, almacenamiento, permisos ni una autenticación nueva.

Los correos transaccionales de compra, receta, despacho y reembolso pertenecen a [LEM-139](https://linear.app/antekera/issue/LEM-139). La confirmación de compra y la confirmación de recepción de receta son eventos distintos. Ni una maqueta ni un formulario local acreditan recepción en back office, reemplazo persistente o entrega de correo: cada ticket debe validar su integración real.

### Emisión tributaria y condiciones comerciales

La emisión de boletas, facturas y notas de crédito **permanece sin verificar** y corresponde a [LEM-51](https://linear.app/antekera/issue/LEM-51), coordinado con [LEM-13](https://linear.app/antekera/issue/LEM-13) para habilitación tributaria. Ese trabajo debe confirmar responsable y método de emisión, vínculo pedido/documento, venta y devolución de prueba, prevención de duplicados y contingencia/conciliación en [LEM-63](https://linear.app/antekera/issue/LEM-63). Una confirmación de pedido de Shopify no acredita un DTE.

La decisión no selecciona ni contrata una app tributaria o proveedor. Las capacidades, disponibilidad, tarifas, medios de pago y configuración comercial deben validarse en sus tickets responsables, en particular [LEM-52](https://linear.app/antekera/issue/LEM-52) y [LEM-120](https://linear.app/antekera/issue/LEM-120). Las estimaciones antiguas, precios de prototipos, valores renderizados y datos de muestra no constituyen condiciones comerciales aprobadas.

## Consecuencias

- Fulfillment, devoluciones, reembolsos y conciliación toman los pedidos e inventario de Shopify como referencia. [LEM-49](https://linear.app/antekera/issue/LEM-49) define el proceso de devoluciones; la nota de crédito conserva la validación tributaria de LEM-51.
- WhatsApp y futuras capacidades de CRM consultan Shopify. No requieren un ERP adicional por esta decisión ni amplían por sí mismas el alcance del MVP.
- Se prefieren funciones disponibles en Shopify. Solo se evalúan apps o integraciones para necesidades concretas verificadas, dentro de las capacidades y costos vigentes del plan.
- El back office mantiene responsabilidades propias para recetas y operación, con contrato e identificadores compartidos. No reemplaza catálogo, precios, stock, clientes, pedidos, carrito o checkout.
- Jumpseller y BSale quedan superados como dependencias operativas e integraciones por construir. Se preservan el checkout antiguo y su trabajo histórico; este ADR no autoriza borrarlos, limpiar sus repositorios ni ejecutar migraciones de datos o servicios.
- La ratificación arquitectónica no acredita publicación, pagos, recepción de recetas, envío de notificaciones ni preparación de lanzamiento. Esas aceptaciones requieren evidencia propia; la evaluación de lanzamiento corresponde a [LEM-59](https://linear.app/antekera/issue/LEM-59).

## Referencias de implementación

- [PDP óptica](../../sections/lemoon-eyewear-product.liquid): consume variantes, disponibilidad y precios de Shopify. El [setup de PDP](../shopify-eyewear-pdp-setup.md) describe un prototipo; sus valores no fijan el catálogo comercial.
- [Configurador](../../sections/lens-configurator.liquid) y [comportamiento del configurador](../../assets/lens-configurator.js): superficies locales del flujo; no sustituyen la aceptación de LEM-23/24/140.
- [Layout](../../layout/theme.liquid), [carrito](../../sections/main-cart-footer.liquid) y [header](../../sections/header.liquid): rutas nativas y accesos a checkout/cuenta.
- [Shopify: carrito en temas](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart) y [componente de cuenta](https://shopify.dev/docs/storefronts/themes/customer-engagement/account-component): referencia de las superficies nativas, sin prometer personalizaciones ajenas al plan.
