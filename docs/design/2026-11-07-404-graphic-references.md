# LEM-126 — recursos gráficos y componentes para dar personalidad a la 404

Fecha: 07-11-2026. **Exploración y propuestas para revisión**, sin aprobación de una nueva composición. No modifica la página, el contrato visual, el ticket ni el PR existente.

## Objetivo y alcance

La 404 funciona, pero su panel beige con el número aislado comunica poco de Lemoon. El objetivo solicitado es revisar nuestras referencias, listar recursos gráficos y componentes y seleccionar candidatos antes de diseñar. Buscamos una experiencia cercana, atrevida y práctica, reconocible como marca de lentes; conservar mensaje claro, búsqueda, home, catálogo, HTTP 404 y accesibilidad.

La revisión parte del [benchmark guardado de LEM-81](https://docs.google.com/document/d/1OEcTYdpm2UzMueDgMB6QGI_ubU_pDLQV1cOSGBjMdtY/edit), leído nuevamente por el conector de Drive. Su corpus es histórico (agosto, consolidado en octubre): 24 fichas de sitios y una entrada de categoría, aunque el encabezado dice 25 tiendas. Para este ejercicio visual se eligieron cuatro referentes pertinentes; no se reauditaron las 24 tiendas ni sus condiciones comerciales.

## Referencias contrastadas ahora

| Referencia | Observación actual | Lectura para Lemoon, propuesta |
| --- | --- | --- |
| [Ben & Frank Chile](https://www.benandfrank.cl/) | Home observada en navegador: composición partida, escena cotidiana junto a retrato con lentes, texto editorial grande, contraste de color y botones redondos. Navegación y quiz con vocabulario propio. | Dar una idea visual y una voz reconocibles a una superficie funcional. Conservar Urbanist/Instrument Sans y vocabulario Lemoon: no importar su serif, jerga ni campaña. |
| [Warby Parker](https://www.warbyparker.com/) | Home observada: foto protagonista, jerarquía tipográfica, acciones agrupadas y mosaico editorial de producto/personas. En [ruta inexistente](https://www.warbyparker.com/lemoon-reference-missing-page), la página muestra 404, disculpa y enlace al inicio, sin ilustración protagonista. | Tomar la jerarquía editorial y la claridad de salida. Su 404 austera no resuelve por sí sola el objetivo de personalidad que buscamos. |
| [Ace & Tate](https://www.aceandtate.com/be) | Home cargada con fotografía de armazones en una composición de objetos; la inspección visual quedó parcialmente cubierta por selectores de región y cookies. La lectura web identifica módulos de colección, categorías con imagen y productos. | Alternativa de bodegón editorial con lentes como objeto. Evidencia parcial: no se afirma revisión completa de su composición ni de su 404. La raíz redirigió a Bélgica. |
| [Bonoboss](https://bonoboss.cl/) | Home observada en navegador: fotografía lifestyle a gran escala, seguida por producto en entorno natural; títulos y acceso a colección sobre imagen. | Construir contexto y carácter alrededor del producto. Puede servir para campaña/categoría; una foto hero completa parece excesiva para esta 404. |

Las rutas inexistentes de Ben & Frank no ofrecieron contenido útil en la sesión observada; no se deduce de esa carga vacía un diseño o defecto de su 404. Karün figura en el corpus, pero sus dominios consultados no fueron accesibles mediante la herramienta web: no se usa como observación actual. No se identificó en esta muestra una ilustración 404 externa que deba copiarse. La propuesta ilustrada siguiente nace de los recursos propios de Lemoon.

## Inventario gráfico: qué tenemos y qué elegir

| Elemento | Fuente / disponibilidad real | Selección propuesta para 404 |
| --- | --- | --- |
| Ilustración orgánica: limones, hojas y ondas | [Arte del footer](../../assets/footer-abstract-transparent.png), PNG transparente 2172×724, inspeccionado visualmente. G04 en [inventario](asset-inventory.md), consumidor en `sections/footer.liquid`. | **Referencia interna principal.** Reutilizar su lenguaje orgánico en una pieza original. La pieza completa puede ser alternativa rápida, evitando duplicarla con el footer. El PNG no acredita disponer de capas vectoriales separadas. |
| Siluetas lineales de armazones | [Snippet canónico](../../snippets/lemoon-frame-shape.liquid): diez formas, incluida redonda, rectangular, panto y aviador. Son iconos pequeños para navegación. | **Sí, como vocabulario óptico.** Un armazón protagonista; al ampliarlo hay que diseñar una ilustración, no estirar automáticamente un icono de 28×18. |
| Limón y hoja como detalles | Motivos presentes en el arte del footer y la inicial de marca; el [logo oficial](../../assets/lemoon-logo-refined-navy.svg) tiene uso y proporciones propios. | **Sí, en detalles originales.** No desarmar ni deformar el wordmark ni tratar el avatar como mascota. |
| Navy, beige y acento lemon | Tokens aprobados en [DESIGN.md](../../DESIGN.md) y [guía de marca](brand-guidelines.md). | **Sí.** Navy para estructura/trazo, beige para soporte y amarillo puntual. La ilustración del footer contiene otros colores: su existencia no aprueba ampliar la paleta de UI. |
| Número 404 como composición gráfica | Hoy existe como texto grande dentro de un panel; [sección actual](../../sections/main-404.liquid). | **Sí, integrado con la ilustración.** Seguir mostrando el mensaje de error como texto HTML independiente y legible. |
| Fotografía lifestyle | Familias existentes en [inventario de assets](asset-inventory.md); protagonismo del producto según DESIGN.md. | **Alternativa, no primera selección.** Menos específica para “ruta perdida”; exige elegir foto y crop apropiados. |
| Bodegón / recorte de armazón | Recurso visual observado en las referencias; medios reales de producto deben verificarse con su dueño. | **Alternativa.** No presentar una imagen de categoría generada como SKU real ni inventar detalles del producto. |
| Texturas, stickers, garabatos | No se estableció una familia canónica para esta 404 en los documentos revisados. | **No sumar por defecto.** Una ilustración central puede aportar la personalidad sin abrir varios estilos nuevos. |
| Mascota o personaje recurrente | No se encontró una mascota aprobada en las fuentes revisadas. | **Descartar en esta iteración.** Crearía una decisión de identidad más amplia que la página. |
| Animación decorativa / parallax | DESIGN.md reserva el movimiento para respuesta y continuidad de estado. | **No necesaria.** La pieza estática debe resolver el objetivo; no introducir dependencias para decorar la 404. |

## Componentes: conservar, adaptar o reservar

| Componente / patrón | Existencia o referencia | Decisión propuesta |
| --- | --- | --- |
| Composición texto + visual | Actual `main-404.liquid`, familia LM-UTILITY del [inventario de componentes](component-inventory.md). | **Adaptar.** Cambiar el panel del número por la pieza elegida; revisar proporción y orden móvil. |
| Título y explicación breve | LM-TYPE; mensaje localizado existente. Jerarquía editorial también presente en las referencias. | **Conservar.** Una futura alternativa de copy requiere su revisión editorial; este ejercicio no la aprueba. |
| Búsqueda con etiqueta visible | Campo y botón actuales; LM-FIELD / LM-ACTION. | **Conservar.** Su valor es recuperar la navegación; no esconderla detrás de la ilustración. |
| Inicio y catálogo | Enlaces actuales y rutas nativas. | **Conservar y jerarquizar.** Una salida principal y otra secundaria, sin eliminar capacidades existentes. |
| Iconos de búsqueda/flecha | [Biblioteca canónica](../../snippets/lemoon-icon.liquid), LM-ICON. | **Reutilizar si ayudan a leer la acción.** No equivalen a una ilustración de marca por sí solos. |
| Tarjetas de categorías con imagen | Patrón observado en Ace & Tate y recursos de categoría locales. | **Reservar.** Solo considerar si se necesita una segunda zona de recuperación; sumar tres tarjetas ahora recargaría la página. |
| Grilla o carrusel de productos | Referencias comerciales y componentes locales de catálogo. | **Reservar para catálogo/PDP/home.** No necesario para esta decisión gráfica. |
| Quiz de estilo | Ben & Frank y Warby Parker ofrecen orientación en su navegación. | **No agregar aquí en esta iteración.** Su presencia en competidores no decide su integración en Lemoon. |
| Franjas promocionales, newsletter, reseñas | Presentes en referencias y/o shell comercial. | **No agregar como bloques de recuperación 404.** Mantener el foco en encontrar una salida. |

Las recetas y familias se consultaron en [docs/components/README.md](../components/README.md) y el inventario; este documento no certifica una nueva implementación. El trazo de un icono se toma del SVG canónico: existen medidas documentales inconsistentes entre guías y no se fijó una nueva medida aquí.

## Tres direcciones para elegir

1. **Armazón + gesto lemon — recomendada.** Ilustración original de un armazón buscando o enmarcando el 404, con pequeñas formas de limón/hoja. Trazo navy, soporte beige y amarillo localizado. Producto reconocible, humor suave y conexión con el lenguaje gráfico propio. Requiere producir y revisar una pieza nueva; no hay un asset 404 aprobado listo para integrar.
2. **Horizonte Lemoon — menor producción.** Reutilizar el arte abstracto existente como único recurso amplio junto a una composición tipográfica más intencional. Comprobar que el footer no repita inmediatamente la misma escena. Conserva identidad, pero el formato horizontal puede perder motivos en móvil.
3. **Bodegón editorial de lentes.** Fotografía propia o autorizada, composición tranquila con el número y mucho aire. Más cercana a las referencias fotográficas; depende de un asset apropiado y aporta menos juego gráfico específico al error.

La primera dirección es la selección recomendada, **todavía propuesta**. No cambia el eslogan ni introduce otro sistema de identidad. En esta etapa no se generó la ilustración ni se diseñó un mockup.

## Fuentes y verificación

- Estrategia: [brief aprobado LEM-82](brand-strategy.md), personalidad cercana/atrevida/práctica y producto protagonista; [procedimiento de marca](../agents/brand-guidance.md).
- Contrato: [DESIGN.md](../../DESIGN.md), tipografía/color, responsive, movimiento y componentes; [guía humana](brand-guidelines.md).
- Disponibilidad: [inventario gráfico](asset-inventory.md), G04/C02 y fila de 404 sin asset propio; [inventario técnico](component-inventory.md), LM-UTILITY/LM-TYPE/LM-FIELD/LM-ACTION/LM-ICON.
- Corpus de referencias: Google Doc de LEM-81, consultado en esta sesión; observaciones históricas separadas de lecturas actuales.
- Inspección actual: home de Ben & Frank, Warby Parker, Ace & Tate (parcial) y Bonoboss; 404 renderizada de Warby Parker; archivo local del footer; fuentes locales de la sección y siluetas. Capturas de esta sesión en el directorio temporal de screenshots de Orca, no añadidas como assets del tema. No se reabrió Figma ni se afirma fidelidad a un frame 404 aprobado.
- Revisión de recursos internos delegada a un agente con responsabilidad de solo lectura; no es aislamiento técnico de permisos ni aprobación humana de diseño.
- Sin cambios de Liquid/CSS/locales, sin pruebas funcionales nuevas, commit, push, merge o publicación. La aceptación histórica de la 404 corresponde a [su registro de QA](../qa/lem-126-404-validation.md); una futura modificación visual necesitará verificación sobre el nuevo resultado.
