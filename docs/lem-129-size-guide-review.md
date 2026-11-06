# LEM-129 — Revisión del modal de medidas

## Alcance y revisión humana pendiente

Rama `feat/lem-129-size-guide-modal`, base `0cada135da9534cd91b29b50cf0db9a64184e962`. Cambios en el contenido compartido de la guía y sus consumidores PDP estándar y óptica. Miguel confirmó «Solo el modal de la PDP» el 06-11-2026, registrado en el comentario Linear `ed5ed092-abb2-4408-b8c3-0360c451e767`: no se agrega entrada desde Home. Esta aclaración define el alcance; no aprueba el PR ni autoriza merge o publicación. LEM-105 y el resto de LEM-46 conservan sus entregables separados.

## Resultado implementado

- Medidas desde `custom.frame_dimensions`: números JSON positivos en `frame_width`, `lens_width`, `bridge`, `lens_height` y `temple`. Los campos ausentes o inválidos se omiten; si ninguno es válido se muestra el mensaje localizado, sin selector ni cifras de ejemplo.
- Esquema frontal/lateral sin escala, con referencias A–E correspondientes a las filas de medidas disponibles. No representa una fotografía ni geometría específica del SKU.
- Pestañas Medidas, Características y Talla y rostro; paneles enfocables, cierre persistente durante scroll y conversión de unidades limitada a su bloque.
- Se conserva el diálogo nativo y los controladores existentes.

## Fuentes

Contrato vigente: `DESIGN.md`, guías y estrategia de marca, receta `docs/components/recipes/product-card-grid.md`, inventarios y ADR-002. El rol de diseño inspeccionó el frame Figma `33:14` del archivo `9EgE1vntKfwoQIQTzBUBNg`: corresponde a una confirmación de compra genérica, no a esta guía. No se extrapolan sus fuentes/radios históricos.

Consulta Shopify de solo lectura del 06-11-2026: `lemoon-dalton-prototipo`, ID `15409107763368`, UNLISTED, plantilla `optica`, 20 variantes. `frame_dimensions` contiene 140/54/17/42/145 mm y peso 22.5 g. Son valores configurados, no evidencia de medición física. El conector identifica el dominio actual `pzsrt4-1u.myshopify.com`; la documentación conserva el alias histórico. La lista de temas confirmó live `155307737256` y development `189557964968`.

## Vista local

El fixture genera el contenido desde los snippets Liquid actuales y usa datos sintéticos identificados expresamente. No certifica el render de Shopify ni el catálogo comercial.

- PDP estándar: `http://127.0.0.1:4189/tests/fixtures/size-guide.html?shell=standard`
- PDP óptica: `http://127.0.0.1:4189/tests/fixtures/size-guide.html?shell=eyewear`
- Estados: añadir `&scenario=partial`, `missing`, `empty-object`, `unknown`, `invalid` o `long`.

## Límites de entrega

No se subió ni publicó ningún tema, ni se modificaron productos/metafields. El alcance PDP está confirmado; la entrega queda pendiente de revisión humana explícita antes de merge y cierre. QA sobre un tema Shopify actualizado requiere una publicación de desarrollo autorizada por separado. Las revisiones de agentes tienen responsabilidad de solo lectura, sin aislamiento técnico de permisos.

## Verificación reproducible

Usar Node `24.19.0` de `.nvmrc`.

```sh
npm ci
npm run test:unit
npx playwright test --config tests/e2e/size-guide.config.js
npx playwright test tests/e2e/eyewear-product.spec.js
npx --yes @shopify/cli@4.8.5 theme check --fail-level error
```

La prueba unitaria de fallback se ejecutó contra los snippets originales exportados fuera del checkout: 4 fallos de 6 casos. Con la corrección, 6/6 pasan. La suite unitaria completa tiene 403 pruebas aprobadas y la regresión E2E existente de PDP óptica, 10/10. La comprobación del tema inspeccionó 296 archivos sin infracciones.

QA específico: 10/10 pruebas Chromium aprobadas sobre ambos consumidores a 390/820/1440: apertura, cierre visible/Escape, retorno del foco, ciclo Tab/Shift+Tab, flechas/Home/End, unidades, datos parciales/ausentes/inválidos y scroll largo. Las pruebas iniciales descubrieron salida de Tab a la barra del navegador; se corrigió el límite en el componente compartido, recalculando los controles visibles después de cambiar pestaña. El fixture óptico necesitó incorporar el reset `box-sizing` del layout real; no se cambió producción para compensar esa omisión.

Revisión independiente de código aprobada; convención de selector corregida a 48px y revisión de convenciones aprobada. Diseño inspeccionó capturas de los dos consumidores a los tres anchos, pestañas, vacío y scroll: sin hallazgos bloqueantes. La etiqueta accesible frontal/lateral sin escala fue revisada por copywriter. Capturas locales en `/tmp/lem129-qa/`; logs en `/tmp/lem129-{unit-final,size-guide-e2e-final,eyewear-e2e,theme-check-final}.log`. Las capturas usan fuentes de respaldo; no se certifican las fuentes descargadas, Safari/Firefox ni el render Shopify actualizado.

CI del runtime `ba95b03f6b827e4e387be921408f9ed622c91101`: Theme Check y Lighthouse Harness Validation aprobados en la ejecución `42163602597`. Los jobs Lighthouse, Mobile Search Tests y Python Workflow Tests se omitieron por las reglas de alcance; no se presentan como pruebas ejecutadas. La actualización posterior de alcance modifica únicamente este informe.
