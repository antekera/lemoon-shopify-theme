# Estrategia SKU

Referencia técnica del formato SKU, su diccionario y el tratamiento de
identificadores en Product Studio y Shopify.

## Formato

`NNNNFFCCMMTT`: doce dígitos, sin guiones ni prefijo, conservados como texto.

| Bloque | Contenido                                              | Ancho                |
| ------ | ------------------------------------------------------ | -------------------- |
| NNNN   | Correlativo del modelo, en orden de ingreso validado   | 4 dígitos; 0001–9999 |
| FF     | Forma                                                  | 2 dígitos            |
| CC     | Color o configuración visual específica de la variante | 2 dígitos            |
| MM     | Material                                               | 2 dígitos            |
| TT     | Talla comercial: pequeño, mediano o grande             | 2 dígitos            |

El mismo modelo comparte correlativo entre sus variantes. Cada código de
atributo admite 01–99; 00 está reservado y no sustituye datos faltantes. Detener
la asignación al agotar un bloque y revisar una ampliación versionada, sin
truncar, reciclar ni cambiar el largo silenciosamente.

Ejemplo sintético: `000102030102` = modelo 0001, forma 02/redondo, color 03/negro,
material 01/acetato y talla 02/mediano. Las equivalencias numéricas, salvo la
referencia negro 03 indicada por el usuario, siguen como propuesta para revisión.
La elección del formato no aprueba automáticamente el diccionario completo.

Ancho de lente, puente y patilla permanecen como tres medidas separadas; no se
concatenan en el SKU ni se convierten automáticamente en S/M/L. Presencia visual
compacta/intermedia/oversize tampoco determina talla física.

## Diccionario e instrucciones

El [Google Doc de estrategia y equivalencias](https://docs.google.com/document/d/11aPHY_CSaTI9GcmLZsqjRliNOl48cCxd-94h41GS4F4)
contiene las tablas y la instrucción de la sección 5, con formato de código.
Está en la carpeta Drive de Lemoon. En el back office se versionaron:

- [Contrato del asignador y límites de integración](https://github.com/antekera/lemoon-next-backoffice/blob/95fc3c572edfc73a988a482f41bd3bb3473b68bb/docs/product-studio/SKU_ASSIGNMENT.md).
- [Prompt v1](https://github.com/antekera/lemoon-next-backoffice/blob/95fc3c572edfc73a988a482f41bd3bb3473b68bb/services/api/src/ai/prompts/sku-assignment-v1.md).
- [Diccionario v1 en JSON](https://github.com/antekera/lemoon-next-backoffice/blob/95fc3c572edfc73a988a482f41bd3bb3473b68bb/services/api/src/ai/prompts/sku-dictionary-v1.json), estado `draft`: 10 formas, 10 colores, 6 materiales y 3 tallas.

Las equivalencias se mantienen en esos artefactos; el tema no crea otro
diccionario numérico. Cambiar etiquetas no debe cambiar códigos adoptados ni
renumerar SKU. Shopify conserva la fuente comercial según [ADR-001](../architecture/adr-001-shopify-commerce.md).

Los filtros amplios como neutros o claros pueden contener variantes físicas
distintas. Si dos variantes del mismo modelo comparten los cinco bloques,
detenerse y revisar la configuración específica. Dos carey o dos bicolor no
reciben el mismo CC si representan variantes distintas; no resolver la colisión
eligiendo la primera etiqueta o asignando otro correlativo al mismo modelo.

## Relación con Shopify

Accesos a las definiciones en el administrador:

- [Declaraciones de metacampos y metaobjetos](https://admin.shopify.com/store/lemoon-8277/settings/custom_data).
- [Metaobjeto Afinidad de estilo Lemoon](https://admin.shopify.com/store/lemoon-8277/settings/custom_data/metaobjects/lemoon_style_trait).

El [contrato de catálogo existente](style-quiz.md) mantiene forma/material/talla
como metacampos controlados y afinidades como referencias a `lemoon_style_trait`.
No todos estos atributos son hoy metaobjetos. Los códigos numéricos de SKU no
reemplazan códigos fuente como `black` ni requieren convertir definiciones como
efecto de documentarlos. Conciliar el mapeo con las definiciones reales de cada
tienda antes de implementar.

El SKU corresponde a una variante vendible. Usar referencias Shopify de producto,
variante e inventario para enlazar registros; el título no establece identidad.
Un SKU interno de doce dígitos no se convierte por ello en GTIN, EAN o UPC.
Conservar los identificadores externos verificados en sus campos propios.

## Referencia manual en Product Studio

El campo manual se guarda como atributo interno `sku` del borrador, con evidencia,
actor y control de revisión existentes. Acepta texto de 1–255 caracteres,
conservando ceros, mayúsculas y separadores históricos. No está restringido al
formato nuevo porque también admite referencias existentes. No crea `custom.sku`
ni asigna o cambia SKU de las variantes de Shopify.

Ambas fuentes de sugerencias de IA rechazan el atributo SKU. La referencia queda
fuera de los hechos de generación editorial y por sí sola no habilita generar
contenido; el prompt de copia pasa a `catalog-copy-generation-v4`.
