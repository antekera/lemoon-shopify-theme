# Chrome iOS: recorte inicial de la parte superior

Estado al 07-11-2026: **reproducido en el iPhone del usuario; causa exacta y arreglo sin confirmar**. No se aplicó una corrección CSS ni se publicó un cambio para este problema. El fix de callbacks del hero es independiente.

## Alcance y entorno

El usuario informa recorte/parpadeo al recargar cualquier página en Chrome de iPhone, mientras Safari funciona bien. Equipo declarado: iPhone 18 Pro Max. Los registros físicos actuales identifican Chrome iOS `157.0.8103.37`, iOS `27_0_1`, viewport de 440 px de ancho. Se probaron recarga por gesto y botón del menú; ambas presentan el síntoma.

La investigación utilizó HTML y recursos leídos del tema live `155307737256`, tras el deploy de main `a6b769cc`, y copias/controles temporales servidos en una URL privada de Tailscale. Estos controles no modifican Shopify y no son una validación nativa de un parche. Las comprobaciones automatizadas usan Chromium de escritorio con viewport móvil; no reproducen el compositor nativo de Chrome iOS.

## Evidencia observada

- La barra conserva 33 px de altura. En la captura de recarga desde el menú, su posición medida es y=0, la del header y=33, `scrollY=0` y `visualViewport.offsetTop=0`, aunque la parte superior se ve oculta bajo la barra de direcciones.
- En los registros del gesto, `scrollY` negativo explica el movimiento de las coordenadas: en 882 muestras con main, `rect.top + scrollY` permanece en 0 para la barra, 33 para el header y 134 para main. Esto explica ese movimiento durante el gesto, pero **no explica por sí solo el recorte visual con coordenadas normales**.
- Desactivar sticky no elimina el síntoma. Tampoco lo eliminan desactivar JavaScript, el scroll suave, el grupo de altura porcentual/flex de la raíz o los fondos fijos.
- La ausencia de entradas `layout-shift` en estos registros no prueba CLS cero: no se estableció soporte del API en el navegador físico.

## Controles comunicados por el usuario

| Control temporal | Resultado físico |
| --- | --- |
| HTML mínimo, CSS integrado, sin tema/JS; respuesta 200 | Funciona |
| Mismo HTML mínimo; respuesta 404 | Funciona |
| HTML completo con CSS; respuestas 404 y 200 | Falla en ambas |
| HTML completo sin CSS del tema | Funciona |
| HTML mínimo con CSS del tema | Falla |
| CSS global y CSS de componentes, por separado, sobre HTML mínimo | Fallan ambos |
| HTML mínimo con una hoja externa sin reglas visuales | Falla |
| CSS del tema integrado en HTML, sin hojas CSS externas | Falla |

La última hoja de control solo declara `:root { --bar-css-control: 1; }`; la variable no se consume. La comprobación automatizada no encontró diferencias en las propiedades computadas estándar de html/body/barra/header/main respecto del mínimo de referencia. No hay Shopify, JavaScript ni reglas visuales de Lemoon en ese control.

## Conclusión y límites

El recorte se reproduce fuera del tema; **no se ha identificado una regla CSS de Lemoon responsable**. Atribuirlo al CSS del tema a partir del primer cruce fue prematuro. La divergencia entre posiciones DOM normales y contenido visualmente oculto es compatible con una interacción de composición/insets de Chrome iOS, pero no demuestra un defecto concreto del navegador ni descarta todas las interacciones con el documento.

Como antecedente primario, [un cambio de Chromium sobre restauración de insets](https://chromium.googlesource.com/chromium/src/ios/+/65462cd8d72daa0b8ce0e049de0a97c79ab68da3) corrige otro caso de contenido inicialmente oculto bajo la toolbar. Es una referencia de mecanismo, no confirmación de que este caso sea el mismo ni de que una versión concreta lo resuelva.

Límites de los controles:

- La hoja trivial se insertó antes del meta viewport; el tema nativo coloca el viewport antes de las hojas. Esa diferencia de orden impide equiparar los casos sin reservas.
- El control con todo el CSS integrado conserva recursos externos de fuentes/imágenes; no elimina todos los factores de red.
- Los primeros registros terminaban a los 5 s; posteriormente se añadieron muestras durante recarga/pagehide. Las capturas físicas siguen siendo necesarias para reconocer el recorte que no aparece en los rectángulos DOM.

No se propone compensar con un margen, altura, padding o reset de scroll arbitrario: no hay una señal DOM validada que distinga el render correcto del recortado. No se afirma resuelto el problema. Falta identificar un mecanismo reproducible a nivel del navegador o validar un workaround en el dispositivo físico sin romper cargas correctas, navegación, zoom o la recarga por gesto.

## Artefactos

La evidencia manual se conserva en el directorio común de Git, bajo `lemoon-agency/runs/hero-callback-binding/announcement-investigation/`: `phone-records.jsonl`, `physical-document-coordinates.json`, `independent-coordinate-audit.json`, capturas físicas, controles HTML/CSS y sus manifests/verificaciones. Las credenciales de autenticación se cargaron desde el entorno sin imprimirlas; los JSON de diagnóstico no recogen cookies ni valores de formularios. Estos artefactos no se incorporan a los archivos del tema. Es evidencia de esta sesión, no sincronización con Shopify ni una suite de aceptación del arreglo pendiente.
