### PR Summary

Completa la presentación de las páginas de compra, guías, soporte y contenido con la identidad de Lemoon y el flujo refinado de selección de lentes de Figma. Incluye contenido editable, datos comerciales de prueba autorizados, pruebas por página y un registro de revisión; los tickets continúan In Progress.

### Why are these changes introduced?

El home, PDP y PLP ya tenían el diseño de Lemoon; las páginas restantes conservaban estructura de Dawn, contenido incompleto o recorridos sin validar. El inventario y las dependencias están en `docs/design/remaining-pages-plan.md`.

### What approach did you take?

## Summary

```text
sections / templates     carrito, búsqueda, editorial, guías, soporte y gift card
assets / snippets        interacción, SVG explicativos y preferencias de cookies
locales                  textos y configuración en español e inglés
notifications            correos preparados para revisión separada en Admin
tests                    unitarias, componentes y escenarios storefront
docs/design / content    previews, evidencia, borradores y asignaciones pendientes
```

El configurador usa las cajas claras de Figma 412:979, conserva los saltos de pasos y consulta variantes reales. Las capacidades pendientes de catálogo, laboratorio, receta guardada y extracción con IA permanecen identificadas como dependencias; la implementación no afirma que estén operativas.

### Other considerations

El branding del checkout y el menú de cuentas existen en un perfil nativo borrador, fuera del bundle de tema. El artículo y el producto gift card también siguen en borrador. Las plantillas de notificación requieren aplicación separada después de revisar. Las políticas muestran datos de demostración de Servioptic SpA y requieren condiciones comerciales definitivas.

### Decision log

| Decisión | Motivo | Límite |
| --- | --- | --- |
| Conservar superficies nativas de checkout y cuentas | Respeta el plan Basic y el seguimiento de Shopify | Branding en borrador; pagos y pedidos reales pendientes |
| Revisar páginas mediante templates alternativos | Permite revisar cada página antes de asignarla | 14 asignaciones CMS siguen pendientes |
| Usar datos ficticios claramente identificados | Permite revisar el contenido comercial autorizado | No constituye datos fiscales ni condiciones operativas |

### Visual impact on existing themes

Cambian carrito, búsqueda, blog, artículo, página genérica, 404 y tarjeta emitida. Se agregan templates de guías, servicios, políticas y compra de gift card. Footer, PDP y configurador ajustan sus enlaces e interacciones. Las asignaciones CMS pendientes no cambian por copiar los archivos.

### Testing steps/scenarios

## Evidence

- **Antes:** el test de recarga de sección del configurador fallaba porque los paneles quedaban ocultos. **Después:** pasa, conserva la selección tras una segunda carga y avanza una sola vez; también se verificó la recarga en el editor nativo.
- **Antes:** Theme Check con `--fail-level warning` fallaba por dos objetos del contexto de notificaciones. **Después:** la excepción se limita a esas dos líneas; el comando exacto de CI con Shopify CLI 4.8.5 inspecciona 252 archivos sin infracciones y el render RTL sigue pasando.
- `npm test`: 175 unitarias y 127 pruebas de navegador locales aprobadas.
- La corrida HTTPS registrada de guías, contacto y soporte pasó 51 casos en escritorio, tablet y móvil. Otras suites conservan evidencia por página; la corrida completa de todo el storefront no está aprobada. Las últimas peticiones de carrito/contenido recibieron HTTP 429 de Cloudflare y se detuvieron.
- Pendiente: revisión del usuario por página, recepción real de contacto, persistencia y aislamiento de cuentas, detalle con pedido real, pago, emisión/canje de gift card y publicación de contenido aprobado.

### Demo links

- [Índice de previews y límites](remaining-pages-preview.md)
- [Registro de evidencia](remaining-pages-review.md)
- [Perfil borrador de checkout](https://admin.shopify.com/store/lemoon-8277/settings/checkout/editor/profiles/7112229032?page=checkout&context=branding)

### Checklist

- [x] Resumen de cambios y evidencia de validación
- [x] Revisión de código y convenciones sin hallazgos pendientes
- [x] Theme Check con el gate de advertencias de CI
- [x] Pruebas locales en varios anchos y pruebas HTTPS por página registradas
- [ ] Revisión visual del usuario por página
- [ ] Verificación en varios navegadores
- [ ] Pruebas de operaciones reales y publicación aprobada

## Merge Danger

**Door:** two-way. Los archivos de tema se pueden revertir; este PR no aplica los borradores de Admin ni cambia asignaciones CMS.

**Blast Radius:** storefront. Afecta navegación y recorridos compartidos de compra; verificar carrito, búsqueda y PDP además de las páginas nuevas. El workflow existente de Lighthouse crea y elimina un tema de desarrollo transitorio en CI.
