# ADR-008: Precios como enteros en la unidad menor de la moneda

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

Los totales del carrito deben ser consistentes y los datos estructurados exigen precios exactos. La aritmética en coma flotante produce errores de redondeo.

## Decisión

Los campos `price` y `salePrice` almacenan enteros en la unidad menor (centavos para USD/EUR; pesos para COP, que no usa decimales en la práctica). La moneda y el locale viven en `site-settings`. `@pijamas/domain` expone `formatPrice(minorUnits, currency, locale)` y `toDecimalString(minorUnits, currency)` para JSON-LD.

## Consecuencias

- El panel muestra el campo con una descripción clara ("Precio en pesos, sin puntos ni decimales" para COP; "en centavos" para monedas con decimales). Se añade un componente de campo personalizado con vista previa formateada para evitar confusiones.
- Todas las sumas son enteras y exactas.
- Cambiar de moneda requiere revisar los precios cargados (documentado en la guía de administración).
