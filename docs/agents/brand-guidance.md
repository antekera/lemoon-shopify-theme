# Aplicar la marca Lemoon

Consultar esta guía al crear o revisar identidad, imágenes, piezas de canal o contenido de marca. La [guía humana](../design/brand-guidelines.md) reúne las aplicaciones; [DESIGN.md](../../DESIGN.md) conserva el único contrato visual del storefront.

## Procedimiento

1. Identificar superficie, ticket propietario y entregable autorizado. Leer la aplicación correspondiente en la guía humana y localizar su familia en DESIGN.md o el [inventario de secciones](../design/section-inventory.md). Terminar con una fuente y un destino concretos para cada pieza.
2. Seleccionar archivos desde el [inventario de assets](../design/asset-inventory.md) y la [galería LEM-97](../design/assets/lem-97/README.md). Usar el wordmark oficial para el logo completo y los exports de inicial l navy con hoja amarilla para favicon, Apple o avatar. Conservar trazados/proporción del SVG y fondo opaco de los raster. Terminar con cada archivo asociado a su uso; las categorías genéricas cubren solo Ópticos, Lentes de sol y Accesorios, nunca SKU.
3. Reutilizar reglas confirmadas. Aplicar tokens, tipografía, responsive y accesibilidad de DESIGN.md en el storefront. Checkout/cuentas usan su editor nativo; administración usa sus patrones propios. Ante una decisión faltante o contradictoria, registrar la pregunta en el ticket responsable de la tabla de la guía humana y resolverla antes de implementar lo que dependa de ella.
4. Confirmar contenido comercial con el dueño de la página o campaña. Para redacción de páginas, seguir la ruta `lemoon-copywriter` de AGENTS.md. LEM-82 define estrategia y LEM-55 mensajes finales; esta consolidación no los aprueba. Terminar con hechos verificables o pendientes explícitos, sin publicar muestras como promesas.
5. Verificar cada aplicación en su destino: proporción y crop del logo, legibilidad, punto focal, móvil/desktop y accesibilidad pertinente. Registrar archivos/revisión, fuentes consultadas, comprobaciones ejecutadas y límites de cobertura en el reporte de entrega. Inspección documental y render comprobado se reportan por separado.

## Límites de decisión

- Cambios del contrato visual requieren autorización y actualización de DESIGN.md; una pieza de campaña o una exploración Figma no lo sustituye.
- LEM-80 resuelve variantes, mínimos y área de seguridad; LEM-71 fotografía real; LEM-78 exports restantes; LEM-132 biblioteca y estados; LEM-139 integración de email. No cerrar esas dependencias desde una guía.
- El registro histórico de favicon/OG en `/password` no certifica otras páginas, temas de desarrollo ni cargas sociales. Distinguir export disponible, configuración registrada y render verificado.
- La imagen de contraseña solicitada reutiliza `assets/lemoon-hero-slide-2-desktop.jpg`; no requiere diseñar otra identidad. Su ajuste y render se verifican en su propia superficie.
- Los agentes devuelven evidencia al coordinador. La revisión humana del ticket y revisión entregada precede a merges y finalización conforme a AGENTS.md; una autorrevisión documental no es revisión independiente ni aprobación de marca.

## Criterio de entrega

Cada aplicación identifica fuente, archivo, destino y verificación, o un pendiente con su ticket responsable. El reporte declara las referencias Figma realmente abiertas y las comprobaciones visuales realmente ejecutadas; la guía de producto conserva instrucciones utilizables, sin logs ni hashes de diagnóstico.
