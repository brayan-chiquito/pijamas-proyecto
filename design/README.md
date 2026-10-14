# Diseño con pen.dev

Guía operativa. La evaluación completa y el sistema visual están en `docs/ux-ui.md` (sección 11) y `docs/decisions/006-pen-dev-diseno.md`.

**Estado:** el archivo `pijamas.pen` no se va a crear. Las pantallas de la tienda ya son el diseño. Los pasos de abajo quedan por si más adelante se quiere un lienzo.

## Instalación (verificado en docs.pencil.dev, 2026-10-12)

1. En Cursor: vista de Extensiones → buscar **pen.dev** → Instalar.
2. Crear el archivo `design/pijamas.pen` (clic derecho → Nuevo archivo, o paleta de comandos → `pen.dev: New File`). Si se abre como texto: paleta de comandos → `pen.dev: Toggle Design Mode`.
3. Habilitar la integración con Cursor: en pen.dev, Ajustes (⚙️) → MCP → activar el cliente Cursor → recargar la ventana de Cursor → comprobar que `pencil` aparece en la lista de servidores MCP de Cursor.
4. Para funciones de agente se requiere cuenta (`pen login` o `PEN_CLI_KEY`). Las funciones del editor no la necesitan.

Si algún comando no aparece, recarga la ventana (`Developer: Reload Window`). Consulta la documentación oficial para cambios: https://docs.pencil.dev

## Organización del documento `pijamas.pen`

| Página del lienzo | Contenido | Tamaños |
| --- | --- | --- |
| `00 Tokens` | Paleta, tipografías, escala, radios, sombras (copiar valores de `docs/ux-ui.md`) | — |
| `01 Componentes` | Button, Badge, Price, ProductCard, VariantSelector, QuantityInput, Input, Sheet, Toast, Breadcrumbs, EmptyState | — |
| `02 Inicio` | Hero, categorías, destacados, promo, confianza, pie | 390 × auto y 1440 × auto |
| `03 Catálogo` | Grid, filtros (abiertos en móvil), orden, paginación, estado vacío | 390 y 1440 |
| `04 Producto` | Galería, panel de compra con talla agotada, descripción, relacionados | 390 y 1440 |
| `05 Carrito y resumen` | Sheet del carrito, `/carrito`, `/finalizar-pedido` con aviso de WhatsApp | 390 y 1440 |
| `06 Institucional` | Página de texto y FAQ en acordeón | 390 y 1440 |

Exportaciones PNG de referencia en `design/exports/<pantalla>-<viewport>.png` (opcional, para comparar con capturas de Playwright).

## Flujo con Cursor

1. Abrir `design/pijamas.pen` y ejecutar `prompts/04-diseno-ux-ui.md`. El prompt pide al agente confirmar el documento activo con `get_app_state()` antes de editar.
2. Iterar en el lienzo. Cualquier cambio de valor (color, tamaño) se refleja primero en `docs/ux-ui.md` y después en `tokens.css`.
3. En las fases 5 y 6, el agente consulta `get_style` y el documento para trasladar medidas y jerarquías a componentes Tailwind.
4. Fidelidad: comparar capturas de la implementación con las exportaciones; corregir desviaciones de espaciado > 8 px o colores fuera de tokens.

## Reglas

- No editar archivos `.pen` manualmente (indicación de la documentación oficial).
- Mantener un único documento `.pen` para evitar divergencias.
- El panel administrativo no se diseña aquí.

## Alternativa sin pen.dev

La ruta `/dev/ui` de la aplicación (solo en desarrollo) muestra todos los componentes con sus variantes y estados. Las decisiones visuales se toman sobre esa página con capturas de Playwright. Esta ruta existe en cualquier caso.
