# LEM-105 — correcciones de página, 08-11-2026

Petición revisada en desarrollo local: retirar el segundo párrafo del paso 1, situar la nota educativa debajo del dibujo en tamaño menor, señalar la inscripción en la cara interior de la patilla y aclarar la comparación en la página del producto cuando las medidas difieren.

## Resultado

- Paso1 conserva solo el primer párrafo; se retira íntegro «También puedes encontrar…».
- Solo la página activa annotated_temple:true: grabado ilustrativo 52□18–145, contorno y guía navy decorativos en la patilla lejana. Código principal accesible en HTML; los 15 elementos path/circle de la perspectiva base y los demás dibujos aprobados permanecen exactos. El default del modal y las otras cuatro guías conservan su render previo.
- Nota educativa como figcaption bajo el dibujo, token 12px con color secundario existente. Texto ampliado 200% llega a 24px y conserva reflow.
- Paso3 «Compara las medidas en la página del producto» y cierre que explica ancho del frente, alto del cristal y función del puente/patillas. Compara diferencias concretas sin dar tolerancia universal, prometer calce ni convertir fotos en cifras.
- Tres valores de storefront y tres defaults editoriales por idioma, 12 modificaciones en total; draft y research sincronizados. Revisión editorial independiente Approved; fuente Zeelool reabierta por autor y revisor.

## Verificación

Base 79370f6c con delta local revisado, fijado por hashes de fuente en los artifacts. Node 24.19.0, Shopify CLI 4.8.5.

- 15/15 unitarias focales de size-guide-components y guide-page.
- 10/10 E2E página con size-guide.config.js, puerto 4190, sin fallos/omitidos/retries. No se repitieron las 503 unitarias completas.
- Theme Check final: 318 archivos, cero incidencias al umbral warning; diff --check limpio.
- Capturas 390/820/1440 y reflow 320/texto 200%. Revisión visual independiente Approved, código Approved y convenciones Ready to push. Restricción read-only conductual, sin aislamiento técnico de permisos.
- El proxy final pasó seis navegaciones/recargas consecutivas en un mismo contexto persistente a 390/820/1440: HTTP 200, URL sin password, H1/paso 3 correctos, nota debajo 12px, asset 200, sin overflow/erroresJavaScript ni Set-Cookie. GET/HEAD con metadatos coherentes.

[Ejemplo móvil](lem-105-page-refinements/example-card-390.png) · [Página 1440](lem-105-page-refinements/page-1440.png).

## Preview local y límites

[Guía por Tailscale](https://miguels-mac-mini.tail51dddb.ts.net:9452/pages/como-medir-tus-lentes?view=guia-medidas&pb=0). El helper scripts/preview-size-guide-page.mjs renderiza la sección Liquid y sus traducciones locales en cada petición, mantiene ID/clases del wrapper y sirve solo la hoja CSS allowlisted. Conserva header/footer desde un snapshot HTML nativo autorizado del tema de revisión anterior al delta. Ese shell conserva el título CMS español también al explorar la ruta en; el cuerpo sí usa las traducciones inglesas. No es QA de la nueva sección en el render nativo de Shopify, CMS o editor activo.

El proxy de uso local en /tmp/lem129-shopify-local-proxy.cjs responde únicamente GET/HEAD de las rutas de esta guía desde los snapshots 0600 en /tmp/lem105-native-shell-es.html y-en.html, sin llamadas upstream, cookies de respuesta ni caché. Header X-Lemoon-Local-Preview:liquidjs-native-shell-snapshot. Si falta un snapshot o su wrapper no es válido, devuelve 502; no sustituye genéricamente el documento. PDP, catálogo, POST y otras rutas conservan la transmisión anterior. El navegador mantiene sus cookies almacenadas; la guía no escribe Set-Cookie.

El primer overlay conectado al backend produjo redirecciones intermitentes a /password al reutilizar sesión. Eliminar Cookie entrante no corrigió la persistencia; se retiró ese filtro. Ese fallo se conserva como histórico en el artifact inicial, sin atribuirlo a una cookie específica. El modo final explícitamente local fue comprobado con 6/6 cargas persistentes. No se cambió autenticación del storefront ni un tema remoto para resolverlo.

Artifacts completos: /tmp/lem105-page-refinements-validation/run-6mpm1itf (suites/fixtures y fallo inicial) y /tmp/lem105-preview-snapshot-stability (fix final estable). Se preservan en Git common/delivery-evidence al cerrar este checkpoint.

No hubo pushes a Shopify, cambios de catálogo/página CMS, merge o publicación. El tema de revisión remoto conserva la versión anterior; estas correcciones permanecen en el worktree y el preview local para revisión humana.

## Variante reutilizable de catálogo

A petición del usuario, el enlace «Ver catálogo» de measurements utiliza el snippet lemoon-ui-action con variant:accent en familia base. Fondo --lemoon-action-accent (#F7E600), texto --lemoon-text-brand (#0B1F3A) y hover --lemoon-action-accent-hover (#E6D600). Los otros modos de guía conservan su acción local. Se documenta el nuevo contrato en DESIGN, receta e inventarios; no se deduce de una variante Figma anterior.

Verificación del delta: 40/40 unitarias focales y 10/10 E2E página, sin fallos/omitidos/retries, más prueba focal de loading en forced-colors para button/input. Se preservan href, foco visible, targets 44/48px, estados bloqueados y spinner. Una transición hover falló inicialmente por el scroll suave del test que desplazaba 42px el objetivo; se corrigió solo la precondición scrollIntoViewIfNeeded, conservando assertions y trazas iniciales. No se repitió la suite global.

Theme Check de 318 archivos sin incidencias al umbral warning. Revisión independiente de código Approved tras restaurar el respaldo de texto loading en forced-colors; convenciones Ready to push, sin que ese veredicto autorice publicar. Solo lectura conductual, sin aislamiento técnico.

Overlay 9452 a 390px: colores/hover correctos, CSS global local 200, botón 44px, sin overflow/errores. El helper de preview ahora permite también lemoon-components.css y cambia únicamente su href para esta página; el resto del shell conserva el snapshot anterior. No hubo nueva subida a Shopify ni cambios de tema remoto. Artifact completo: /tmp/lem105-accent-action-validation/run-kvu4egc2.

[Botón de catálogo local](lem-105-page-refinements/catalogue-accent-390.png).

### Retiro de acción de consulta final · 08-11-2026

Por petición del usuario, la ayuda final de measurements conserva solo «Ver catálogo». El enlace de contacto de las otras cuatro guías y el footer global permanecen en sus dueños. Validación:9/9 unitarias de guía y10/10 E2E de página; Theme Check sin observaciones. Preview9452 HTTP200 con0 enlaces «Consultar una medida» en la ayuda y contacto del footer conservado. Evidencia local en `/tmp/lem105-remove-contact-validation`; sin publicación Shopify.

### Cierre del paso3 · 08-11-2026

Se retiró únicamente la oración final que remitía a consultar por modelo y medida, sincronizando es/en, defaults del editor y draft. Unitarias de guía9/9 PASS; preview9452 ES/EN HTTP200 confirma la ausencia y conserva la oración previa y el catálogo. Sin cambios publicados en Shopify.
