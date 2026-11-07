# LEM-11 · Ajustes aprobados: estado de entrega

Fecha: 06-11-2026. Base del tema `5391d588`; rama `fix/lem-11-quiz-copy-feedback`. Miguel aprobó la especificación y la implementación con «Apruebo. Procede.». Esto autoriza preparar el cambio; la entrega corregida, el merge y la publicación conservan sus verificaciones correspondientes.

## Contrato

[Especificación aprobada](../specs/2026-11-06-lem-11-descubre-tu-estilo.md) y [plan](../superpowers/plans/2026-11-06-quiz-native-filters.md). La salida es la colección nativa completa con filtros editables. No hay ranking alternativo, filtrado de tarjetas ya paginadas ni parámetros inventados como respaldo. Las preguntas omitidas no agregan restricciones.

## Shopify: acciones verificadas

- Tienda: `gid://shopify/Shop/76333711528`, dominio canónico `pzsrt4-1u.myshopify.com`, dominio público `lemoon.cl`; acceso Admin mediante alias `lemoon-8277`.
- Diccionario existente: 21 entradas de `lemoon_style_trait`, definición `37833048232`, acceso storefront público. Se conservó el diccionario, incluidas las entradas de legado.
- Se crearon y leyeron nuevamente seis definiciones `PRODUCTVARIANT`, todas `list.metaobject_reference`, acceso `PUBLIC_READ` y referencia a la definición anterior:

| Campo `custom` | ID de definición |
| --- | --- |
| `style_filter_color` | `520378515624` |
| `style_filter_finish` | `520378548392` |
| `style_filter_pattern` | `520378581160` |
| `style_filter_transparency` | `520378613928` |
| `style_filter_use` | `520378646696` |
| `style_filter_presence` | `520378679464` |

- Se prepararon 60 proyecciones en las diez variantes de los cinco productos demo identificados: Ártico, Estero, Faro, Génova y Jade. Se derivaron de la lectura actual, respetando reemplazo completo por criterio; no se copiaron las asignaciones antiguas como estado actual.
- La lectura posterior comparó los 60 valores esperados y los valores fuente de producto/variante: coincidencia completa y fuentes semánticamente intactas. Las escrituras incluyeron CAS sobre campos derivados ausentes; las tandas con guardias de fuente existente enviaron exactamente el mismo valor. Un reintento de Faro Azul protegió los derivados y se comprobó contra la fuente en la lectura final, sin afirmar atomicidad global.
- No se escribieron precios, stock, estados, compatibilidades, fotos, medidas ni peso. Esta afirmación describe el alcance de las mutaciones; no es una comparación exhaustiva de todos los campos comerciales remotos.
- Search & Discovery guardó el filtro nativo de tipo de producto con etiqueta **Tipo de lentes**, ID `77524861096`. Una lectura autenticada real de `/collections/all` confirmó `filter.p.product_type` junto a los filtros anteriores.

Los backups y lecturas sanitizadas están en el directorio Git común `delivery-evidence/lem-11-copy-feedback/`: `definitions-dictionary-before.json`, `demo-products-before-native-projections.json`, `demo-products-after-native-projections.json`, `page-menus-before.json` y lecturas de filtros. No contienen contraseña ni token. Los IDs anteriores son evidencia de esta tienda, no constantes que deban copiarse a otra.

## Configuración activada y comprobación nativa

Search & Discovery mostró errores intermitentes al seleccionar Color y después de guardar Acabado. La lectura posterior confirmó que el guardado de Acabado sí se aplicó: no se repitió a ciegas. Recuperada la sesión, se guardaron los demás campos con operador OR y etiquetas **Familia de color, Acabado, Patrón, Transparencia, Uso y Presencia visual**. Se conservaron los filtros anteriores.

IDs de configuración observados: tipo77524861096, color77525385384, patrón77525418152, transparencia77525516456, uso77525614760 y presencia77525647528. El ID de Acabado no se capturó; su exposición se verificó directamente en storefront. Son IDs administrativos de esta tienda, no constantes del tema.

La lectura autenticada final de `/collections/all` confirmó los seis parámetros `filter.v.m.custom.style_filter_*`, además de tipo, forma, material y los filtros anteriores. No hubo error Liquid. La lista de valores expone únicamente atributos asignados del grupo correspondiente; no mostró las21entradas mezcladas del diccionario.

El quiz verifica `collections['all'].filters` antes de enviar cada criterio. Si un filtro se deshabilita después, conserva respuestas y catálogo alternativo, sin generar una URL parcial.

La QA sobre la colección publicada detectó que concatenar GIDs antes de URLSearchParams produce una coma codificada `%2C`: la combinación devolvió cero resultados y ningún chip activo. El formulario nativo repite el parámetro y devolvió cinco productos con dos chips; una coma literal también funcionó. El helper se corrigió para seguir exactamente la forma nativa repetida. Tres regresiones con GIDs reales fallaron sobre1b1165 y pasaron con la corrección.

Comprobaciones nativas ya observadas: OR por colores, AND color/acabado (Estero y Faro), contradicción entre variantes (cero resultados real), edición/eliminación de chips, ordenación conservando filtros y paginación Óptico (38productos,15por página, segunda página sin IDs repetidos). Las tarjetas Carey conservaron contexto de variante, imagen, precio y swatch; la interacción del swatch alternativo se comprueba por separado. La matriz final pasó **48/48 comprobaciones nativas**, sin errores de runtime. Los seis criterios combinados seleccionaron Génova/Jade; esa comprobación usa el valor legado translúcido para validar el índice, no una opción nueva del quiz. Transparentes no tiene asignaciones actuales y devolvió cero honesto con opción de limpiar filtros. La prueba de swatch Azul desde Carey también conservó imagen, selección y variante real en PDP; la URL publicada contiene parámetros variant repetidos, pero Shopify resolvió el último y no se demostró fallo funcional. No se amplió el delta de tarjeta por esa observación. No se confunde esta QA de colección publicada con el quiz nuevo aún no publicado. Un recorrido adicional ejecutó el controlador local con el diccionario/exposición reales y abrió la colección publicada mediante el puente de preview: neutral + Carey + brillante + todos los días + oversize devolvió Génova y Jade, sin preferencias omitidas. Tampoco acredita el Liquid del quiz nuevo publicado.

## Página y menús: activación coordinada pendiente

La página existente `161787576488` sigue publicada con título `Encuentra tu lente ideal`, handle `buscar-mi-estilo` y plantilla interna `buscar-mi-estilo`. La nueva rama prepara los accesos a `/pages/descubre-tu-estilo`; no se cambió el CMS mientras la entrega del tema y sus filtros siguen pendientes.

En la activación, actualizar esa misma página a título `Descubre tu estilo`, handle `descubre-tu-estilo`, conservando plantilla y publicación y usando `redirectNewHandle:false`. Actualizar solo el enlace correspondiente en `footer-how-to`, `footer-services-review` y `footer-services-mobile-review`, preservando los demás elementos y la asociación PAGE. El backup contiene los tres árboles originales. La consulta paginada de redirects para la ruta antigua devolvió cero entradas; repetirla antes y después. La aceptación exige nueva ruta natural funcional y antigua HTTP404 sin redirección.

Esta coordinación no autoriza un push al tema publicado. Las pruebas del CMS posteriores a la activación y la publicación del código deben quedar registradas por separado.

## Back office y límites de integración

Delta aislado en `feat/lem-11-native-style-filters`, base PR9 `48ca70e`, integrado con árbol idéntico en PR9 mediante `859ba02379a3d9f11febac9136cd28c5c762d650`, repositorio `antekera/lemoon-next-backoffice`. Amplía vocabulario y prepara publicación/refresh de seis campos efectivos por variante. Se preserva el checkout propietario, incluido su `apps/web/next-env.d.ts` modificado (SHA2560f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc).

Verificación final del back office:206/206pruebas,1020aserciones, tipos/lint/formato y builds domain/API/infra. Web compiló con Webpack (14/14rutas) ante una limitación local de Turbopack y dependencias enlazadas. La revisión y QA independientes detectaron y cerraron una carrera de variante creada antes de activar ready: la lectura final ahora verifica las seis listas derivadas reales y devuelve conflicto si una falta o cambió. Cinco regresiones permanentes y la reproducción original pasaron; no se afirma atomicidad global. CI Quality42322375153SUCCESS sobre859ba02.

La derivación debe consumir fuentes Shopify frescas y resolver el diccionario de la tienda. La fuente ausente no se crea artificialmente para obtener una guardia: esa condición requiere relectura y convergencia acotada, no ofrece una transacción global. Un fallo o fuente incompleta debe impedir marcar el producto como listo.

La reconciliación autenticada y los eventos existentes de producto son superficies de código; no prueban scopes, flags efectivos ni despliegue. La emisión de un evento por cualquier edición directa de metacampos requiere evidencia nativa adicional. No se inventan topics `metafields/create`, `metafields/update` o `metafields/delete`, ausentes de la referencia utilizada. La garantía automática de actualización posterior conserva este gap operativo hasta verificar un mecanismo real.

## Verificación local y revisión

Validación final de las fuentes locales:

- `npm run test:unit`: **462/462**, después de reproducir y corregir referencias neutral ausentes y serialización nativa múltiple (pruebas rojas conservadas).
- `npm run test:e2e -- tests/e2e/style-quiz.spec.js --reporter=list`: **25/25 Chromium** en la revisión final.
- `npm run test:e2e:cross-browser -- tests/e2e/style-quiz.spec.js --reporter=list`: **50/50 Firefox/WebKit** en la revisión final.
- La suite Chromium completa anterior pasó **271/271** sobre los mismos controladores/layout; dos casos de historial agregados después se ejecutaron también por separado. No se etiqueta esa ejecución anterior como una nueva suite completa.
- Theme Check: **cero infracciones** (última ejecución: 340 archivos inspeccionados); diff-check limpio.
- Revisión independiente de código **Approved**, P2 de neutral completo cerrado; revisión de convenciones **Ready to push**, sin hallazgos. Responsabilidad de solo lectura sin aislamiento técnico.

Hashes SHA-256 de runtime revisados: controlador `8925653b3d90314878c3e970f4ee515130608099a6ec0f2a55f0229e986f204e`; helper `07768b105bc32d54b1c2a36fdb47bff36c10a8dfccbcc5129e63b552547d2fde`; CSS `d46bca540b660db96c724b4177b86165a55e113a7dbe78dc17be0b97305d7ca2`; sección `8ac661da4e791b0c6f865209b0d64537d8497f8bee4ebe45b5c562f4125d8991`.

El retorno reconstruido se prueba con un ID de documento distinto; no se demostró bfcache real. Zoom se comprueba mediante reflow equivalente a 720px CSS, sin controlar zoom del navegador. La prueba de primera pintura fija fuentes externas para aislar la carga del módulo: no mide LCP ni estabilidad de carga de fuentes. Las doce pruebas storefront están preparadas pero no ejecutadas porque aún falta la configuración y entrega remota.

 Fixtures LiquidJS y navegador comprueban el comportamiento del código, no la indexación Shopify ni la entrega de webhooks. La colección publicada seleccionó la variante relevante en los cinco casos Carey y en el cambio a Azul probado. Esto es evidencia acotada a esos escenarios, no a todo el catálogo comercial.

Referencias primarias: [filtros nativos y semántica](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering), [variante relevante de producto](https://shopify.dev/docs/api/liquid/objects/product#product-selected_or_first_available_variant), [topics de webhook](https://shopify.dev/docs/api/admin-graphql/2026-01/enums/WebhookSubscriptionTopic).
