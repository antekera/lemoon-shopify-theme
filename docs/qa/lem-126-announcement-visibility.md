# Barra de anuncios — visibilidad durante la primera rotación

07-11-2026. El usuario reportó movimiento bajo la barra al navegar desde un iPhone por el preview HTTPS de Tailscale. Luego precisó el síntoma: «el texto del carousel en la barra al principio está escondido».

## Diagnóstico y alcance

Las mediciones nativas no reprodujeron un cambio temporal de altura en la barra al navegar: Chromium HTTP/HTTPS y WebKit con iPhone emulado mantuvieron la geometría bajo cargas normales, fuentes/CSS demorados y cambios de viewport. Las alturas con borde observado fueron aproximadamente 33px móvil, 45px tablet y 37px desktop; no son una medida de CLS de campo. El caso físico UIKit/Safari no está cubierto por WebKit de escritorio.

El primer mensaje está en el HTML y se observó visible antes de inicializar global.js en los casos de carga analizados. Las capturas tempranas se hicieron sin la espera automática de fuentes de Playwright, para no ocultar un posible FOIT. No se logró demostrar que el primer paint físico del iPhone fuera el origen.

Sí se reprodujo un intervalo de texto invisible o casi invisible durante la **primera rotación automática**, alrededor de tres segundos después de cargar: Dawn aplica un fade-out al mensaje actual y un fade-in demorado al siguiente. En preview HTTPS se observaron cinco frames con opacidad menor que .05 en Chromium (incluido un frame de 0) y ocho en WebKit (mínimo .000763), aproximadamente 65–68ms; sin cambio de altura de la barra. Esto explica un vacío visual al comenzar la interacción, sin atribuirle un salto de altura no demostrado.

## Corrección

Solo `assets/lemoon-announcement-bar.css`: la regla local `.lemoon-announcement-bar .announcement-bar__message` establece `animation: none` y `opacity: 1`. La carga local está después de Dawn tanto en Home como en las páginas interiores. El mensaje saliente conserva su opacidad hasta el cambio al siguiente. No se modifica global.js, velocidad, controles, autoplay, reduced motion, fuentes ni dimensiones. El texto largo y el zoom conservan crecimiento natural, sin recorte por una altura rígida. DESIGN y el contrato LM-HERO MD/JSON registran esta regla.

## Pruebas

- Regresión añadida a `tests/e2e/announcement-bar.spec.js`: muestreo por frame durante la primera rotación real, verificando opacidad del mensaje dentro del viewport y altura estable.
- RED antes del patch: falló en ambos motores; mínimo de opacidad visible 0 en Chromium y .000274 en WebKit.
- GREEN después: **6/6 casos**, tres por motor (Chromium y WebKit), incluidos controles/manual/reduced motion, altura móvil y regresión nueva. Mínimo de opacidad visible **1** en ambos; altura del fixture estable a 32px. Fixture aislado en 4188, sin usar ni detener servidores de otras sesiones.
- Theme Check: **314 archivos, cero offenses**, exit 0. `git diff --check`: PASS.
- Revisión independiente del delta: **Approved**, sin bloqueos. Solo lectura por responsabilidad, sin aislamiento técnico de permisos.

Evidencia en `/tmp/lem126-announcement-qa/`, con diagnóstico, probes, resultados RED/GREEN, muestreos y capturas. Los tests de fixtures no acreditan por sí solos el render nativo Shopify; la comprobación posterior del preview se registra abajo. No se hizo una medición de LCP de campo ni se certifica haber reproducido todo el comportamiento de un iPhone físico.

## Comprobación nativa posterior

Se amplió el servicio `shopify theme dev` del preview no publicado **189821550760** para sincronizar también `assets/lemoon-announcement-bar.css`, conservando los once filtros anteriores. URL HTTPS de Tailscale: `https://miguels-mac-mini.tail51dddb.ts.net:9449/lemoon-404-preview?pb=0`.

Ventana de seis segundos con viewport 390px: Chromium **375 frames**, WebKit **602 frames**, ambos con HTTP 404 e identidad de tema correcta. Mínimo de opacidad del mensaje visible **1** durante toda la ventana; cero frames vacíos por fade. Altura de barra y posición superior del header **33px constantes**, incluido el borde. Se observó el segundo mensaje activo en ambos motores, confirmando que autoplay sigue operativo. El primer intento WebKit recibió HTTP 502 del servicio de preview y no aportó evidencia de UI; se conserva separado y un único reintento confirmó la superficie válida.

Registros: `green-native-transition-chromium.json` y `green-native-transition-webkit.json`. Evidencia archivada en Git common dir `lemoon-agency/runs/lem126-final-20261107/lem126-announcement-qa/`, con manifest SHA256. Revisión general **Approved** y convenciones **Ready to push** sobre el delta; sin aislamiento técnico de permisos. Sin publicación en producción ni merge del PR. La verificación física de la percepción inicial en UIKit/Safari sigue correspondiendo al iPhone del usuario.
