# ADR-007: Variantes explícitas y categorías planas

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

Las pijamas se venden por talla y, a menudo, por color. Hay que decidir cómo modelar variantes y existencias de forma comprensible para una persona no técnica y consultable para filtros.

## Decisión

- Cada producto declara `inventoryMode`: `none` (solo disponible/no), `simple` (existencias globales) o `variants`.
- En modo `variants`, el producto define `options` (p. ej. Talla: S, M, L; Color: Rosa) y una lista explícita de `variants`, cada una con la combinación de opciones, existencias, SKU opcional, precio opcional e imagen opcional.
- Las variantes se crean manualmente en el panel (con ≤ 200 productos es manejable); se evaluará un botón "generar combinaciones" si la propietaria lo pide.
- Las categorías son planas (sin jerarquía); las agrupaciones curadas se modelan como colecciones y los atributos filtrables como etiquetas.

## Alternativas

- Producto por color (un documento por color, variantes solo por talla): más documentos, más mantenimiento de descripciones duplicadas.
- Jerarquía de categorías: URLs más profundas y lógica de migas más compleja sin beneficio claro para un catálogo de este tamaño.
- Plugin de e-commerce de Payload: orientado a checkout y pagos, fuera de alcance.

## Consecuencias

- Filtros de talla/color consultan `variants.selectedOptions.value`.
- Validación en servidor: combinaciones únicas y coherentes con `options`.
- La disponibilidad del producto se deriva de sus variantes.
