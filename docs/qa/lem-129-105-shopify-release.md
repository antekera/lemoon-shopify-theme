# LEM-129/105 — separación e integración Shopify

Preparación del 08-11-2026. Nueva petición de Miguel: cargar medidas de prueba, integrar página y PDP en Shopify y dejar el modal únicamente como referencia. Este documento registra preparación; no acredita publicación ni carga ejecutada.

## Cambio revisable

Modal continuo genérico con esquema frontal/lateral, cinco definiciones A–E y ejemplo de patilla. Sin nombre, cifras, material, talla o ajuste del SKU; sin selector de unidades. La única sección de características PDP mantiene tres pestañas con tabla mm, características y ajuste declarados. En óptica ocupa la columna izquierda de detalles junto a los acordeones, preservando SKU. La página comparte las definiciones, dibujos y textos aprobados. No cambia compra, precios, variantes, recetas ni compatibilidad.

## Catálogo leído y carga preparada

Shopify conectado: `pzsrt4-1u.myshopify.com`, dominio público `lemoon.cl`. Paginación completa: 60 productos. Definición existente PRODUCT `custom.frame_dimensions`: JSON, PUBLIC_READ, sin validaciones adicionales. Se reutiliza sin crear metacampos/metaobjects ni cambiar su tipo.

48 armazones (39 ópticos y nueve solares); Dalton ya tiene cinco números y se conserva íntegro. Hay 47 armazones sin el campo: 17 perfiles de prueba medianos, 18 pequeños, diez grandes y dos infantiles. Se excluyen ocho accesorios, tres cristales sueltos y una gift card. Los nombres de perfiles organizan datos de prueba, no son una clasificación física ni una recomendación de calce.

| Perfil sintético | Cantidad | Ancho total | Cristal | Puente | Alto | Patilla |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Pequeño | 18 | 134 | 49 | 16 | 38 | 142 |
| Mediano | 17 | 142 | 54 | 17 | 42 | 145 |
| Grande | 10 | 150 | 58 | 18 | 46 | 145 |
| Infantil | 2 | 118 | 46 | 16 | 34 | 130 |

Valores en mm, elegidos como muestras. Los tres números de los perfiles adultos coinciden con los códigos de talla de demostración ya presentes para evitar contradicciones de la muestra; ancho/alto e infantil son sintéticos. Ninguno se afirma como medición física. No hay derivación en Liquid ni regla de ajuste automático.

Añadir exclusivamente la etiqueta `lemoon-measurements-demo` con tagsAdd, preservando todas las demás. Crear solo el campo ausente mediante metafieldsSet con compareDigest:null, en lotes de máximo 25. Si aparece un valor concurrente, detener y conciliar. Aviso visible junto a cifras: «Medidas de prueba para revisar esta página. No corresponden a medidas físicas verificadas del producto.» No se etiquetan ni sobrescriben datos previos de Dalton. Se conserva snapshot de valores/tags antes de escribir y se exige lectura posterior completa.

## Preparación del tema

Tema publicado leído con API y CLI: `lemoon-shopify-theme/main`, ID 155307737256. Se descargó a un directorio temporal independiente; ninguno de los17 archivos runtime del delta previo tenía cambios propios divergentes frente a origin/main. Las plantillas product/product.optica/page.guia-medidas existen en el tema actual. Se prepara una copia inédita para revisión; no se utiliza ni sobrescribe el tema dev compartido 189557964968.

Página CMS publicada `como-medir-tus-lentes`, ID 161807204520: templateSuffix todavía vacío al leer. La revisión nativa puede abrir la plantilla con `view=guia-medidas`. Activación final: asignar únicamente templateSuffix guia-medidas, conservar título/handle/body/publicación y enlazar mediante setting lemoon_size_guide_page en configuración existente preservada. No se añade ruta Home ni se asigna template óptico a productos estándar.

## Orden de activación

1. Validar cambio local y revisiones independientes; crear preview Shopify separado con configuración copiada del publicado.
2. Revisar página y ambos tipos de PDP en ese tema. Las dimensiones ausentes siguen vacías hasta la carga.
3. Inmediatamente antes del push MAIN, identificar nuevamente nombre/ID y pedir la confirmación explícita exigida por AGENTS y push-theme-production/SKILL.md.
4. Tras esa confirmación y con árbol limpio, subir exclusivamente archivos del delta revisado, sin eliminar archivos ni reemplazar configuración ajena. Integrar el único setting de página conservando la configuración actual.
5. Asignar template de página y cargar muestras etiquetadas cuando el aviso ya esté visible en el código del tema publicado; así no se muestran números sintéticos sin identificar en el tema anterior.
6. Leer nuevamente 47 campos/tags, comprobar Dalton y exclusiones intactos; QA nativa de página/PDP, modal sin cifras, única tabla, enlace, foco/Escape/overflow. Separar publicación de aprobación de PR/merge y estados de tickets.

## Verificación

503/503 pruebas unitarias (48 archivos) y 39/39 Playwright afectadas, más revisión de código sin bloqueos y convenciones Ready to push. Theme Check CLI4.8.5:318 archivos, sin incidencias, --fail-level warning. El cambio posterior de la primera frase del paso3 redirige a Características del producto → Medidas en ambos idiomas/defaults/draft; comprobado después con 9/9 unitarias de página y 10/10 E2E. El validador Liquid del plugin Shopify no inicia por dependencia ausente @shopify/theme-check-common; no se modificó el plugin. Shopify CLI4.8.5 Theme Check proporciona la validación local requerida. Las revisiones independientes en esta sesión tienen alcance de solo lectura conductual, sin aislamiento técnico de permisos.

Nota menor de revisión: los handlers y estilos anteriores de [data-units] quedan inertes sin emisor en esta guía. Se preservan los controladores existentes para mantener el delta acotado. Revisión editorial del aviso y nuevo destino del paso3: Approved.

El tema compuesto para revisión (copia del publicado + 19 archivos runtime del delta y un setting de enlace) también pasó Theme Check:265 archivos, sin incidencias, --fail-level warning. Código: aprobado con nota menor; convenciones: Ready to push; copy integrado: Approved. Pruebas Chromium/LiquidJS locales no acreditan todavía ejecución Shopify.

## Preview Shopify verificado

Tema inédito **LEM-129-105 - Medidas review**, ID **189847371944**, role UNPUBLISHED y processing:false, creado desde la copia del tema publicado. Código runtime **18ad662ccdbbe21f4276ac232af16c6135c9984e**. El tema MAIN 155307737256 conserva updatedAt 2026-11-07T18:24:03Z; no se modificó.

- [Dalton óptica](https://lemoon.cl/products/lemoon-dalton-prototipo?preview_theme_id=189847371944&pb=0): una tabla 140/54/17/42/145, características Pantóstico/Acetato/22.5 g/Unisex en su pestaña y SKU conservado. Modal con referencias sin ninguna de esas cifras/características; dos Tabs completan el ciclo y Escape restaura el opener en Chrome de escritorio.
- [Ártico estándar](https://lemoon.cl/products/lemoon-artico?preview_theme_id=189847371944&pb=0): sección única, vacío correcto sin inventar cifras, modal genérico y Escape/retorno comprobados.
- [Página](https://lemoon.cl/pages/como-medir-tus-lentes?preview_theme_id=189847371944&view=guia-medidas&pb=0): H1 y tres pasos completos, esquema/definiciones y destino corregido del paso3. Se usa view porque el templateSuffix CMS global todavía permanece vacío.

Smoke manual en Chrome con render Shopify nativo: página y sección óptica revisadas a 390/820/1440 mediante toolbar responsive (Fit to window); índice estático móvil y lateral escritorio, tabla/definiciones sin recorte visible, sección óptica apilada móvil y junto a acordeones en escritorio. Drawer óptico a 390 ocupa el ancho disponible con dibujos apilados y cierre visible. Es comprobación visual manual, no medición automática de overflow ni una suite nativa completa. Matriz automatizada de 390/820/1440 y 320/200% pertenece a fixtures Chromium. No se enviaron compras ni se probó checkout.

El curl inicial al dominio recibió 429; Chrome con sesión existente cargó las tres rutas y los recursos de revisión correctamente. El host de control de navegador no estuvo disponible; el smoke usó Chrome por la API nativa de accesibilidad. Las capturas mostradas en conversación son evidencia de UI, sin fingir archivos de screenshot guardados.

[Preview Tailscale PDP con aviso](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=demo) y [página](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes): snapshot inmutable 18ad662c, HTTP 200 y servidor 4189. Se conservan los servicios ajenos.

Pendientes: confirmación inmediata MAIN, integración del setting/plantilla, carga etiquetada de 47 campos y readback/QA posterior. Conservados ambos tickets In Progress y PR 64 en borrador; ninguna aprobación automática equivale a aceptación humana o merge.
