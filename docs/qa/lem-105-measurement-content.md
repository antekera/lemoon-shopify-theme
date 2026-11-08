# LEM-105 — contenido desarrollado de la guía de medidas

Miguel pidió desarrollar el contenido de la página existente, sobre `45bafbaae0187755c91042f401b18acbb19b489e`. Se integran redacción es-CL y versión equivalente en inglés, conservando el diseño y los dibujos aprobados.

## Contenido integrado

1. **Lee el código de la patilla:** dónde buscarlo, qué representan los tres valores y cómo continuar si la inscripción no se distingue.
2. **Mide el armazón en milímetros:** preparación y alineación de la regla; instrucciones específicas A–E para ancho total, ancho del cristal, puente, alto del cristal y largo de patilla. Distingue extremos exteriores de medición entre bisagras; la patilla curva puede seguirse con cinta flexible sin forzarla.
3. **Compara con la ficha del modelo:** misma magnitud, extremos y unidad; tratamiento de datos ausentes y etiquetas de talla; medidas similares no garantizan comodidad idéntica. Ayuda también para quien no tiene lentes de referencia.

El ejemplo educativo y sus cifras permanecen separados de los datos de producto. No se añadieron tallas universales, tolerancias, recetas, DP, promesas comerciales ni contactos nuevos. El contenido completo aparece en la [propuesta y mapa es/en](../content/2026-11-08-como-medir-tus-lentes-draft.md), con [investigación y fuentes](../content/2026-11-08-como-medir-tus-lentes-research.md). SEO propuesto solo en el documento; no se escribió en Admin.

## Alcance y revisión

Solo cambian cuatro locales: 13 valores de storefront y ocho defaults del editor por idioma. Los ocho defaults coinciden con sus fallbacks; no se modifica contenido que un comerciante ya haya guardado. Comentarios/estructura JSON y todos los valores ajenos se conservan. Las cinco definiciones desarrolladas tienen como consumidor la página de medidas; el contenido del modal permanece intacto.

No hay cambios en Liquid, CSS, JavaScript, SVG, schema estructural, templates, settings o datos Shopify. El render conserva los tres pasos y los ocho campos editoriales existentes. Recuento observado:746 palabras contando índice, labels y bloques compartidos.

El copywriter abrió cuatro referentes chilenos y fuentes técnicas primarias extranjeras. La revisión editorial independiente reabrió Lens, Bonoboss y Karün, además de Zeelool, Warby Parker y Zenni; Ben & Frank dio timeout en esa segunda lectura y no sustenta ninguna afirmación material. La convención exterior se declara propia del esquema y no certifica las cifras de un SKU. Resultado editorial: **Approved para la preview local integrada**, sin hallazgos. La aprobación humana del contenido sigue pendiente. Revisión de solo lectura conductual, sin aislamiento técnico de capacidades.

## Verificación

- **502/502 unitarias**,48 archivos; **10/10 E2E de página**, Chromium,8.9s, sin fallos/omitidos/reintentos. Se reutilizaron pruebas existentes, sin añadir tests para un cambio editorial reversible.
- **Theme Check:317 archivos sin observaciones**, CLI4.8.5, umbral warning, Node24.19.0.
- Responsive390/820/1440, límites749/750/989/990, reflow320 y texto200%, anclas, editor/fallbacks y rutas localizadas. El fixture `locale=en` prueba rutas; la revisión del texto inglés se hizo con el renderer en idioma `en.default`.
- JSON válido,42 cambios de valores exactamente dentro del alcance permitido, paridad de ocho defaults en ambos idiomas y `git diff --check` limpio.
- [Página1440](lem-105-measurement-content/page-1440.png) y [página390](lem-105-measurement-content/page-390.png).

Logs y hashes: `/tmp/lem105-content/unit.log`, `e2e-page.log`, `theme-check.log` e `integrated-manifest.json`; cinco capturas finales y fuente estable en `/tmp/lem105-content/validation-ssovvk7w`. Registro editorial local: `.superpowers/sdd/2026-11-07-size-guide-pdp-page/measurement-content-copy-review.md`.

## Preview y límites

[Abrir página con Tailscale](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes). Servidor4189 con snapshot inmutable por acceso privado9451; los enlaces muestran el último snapshot servido y las capturas fijan esta revisión.

La prueba usa LiquidJS/Chromium. No acredita Shopify nativo, asignación/guardado real en editor, SEO publicado, enlaces públicos actuales ni medidas físicas del catálogo. Se mantiene PR64 en borrador y no se publica, hace merge ni completa ningún ticket.
