# ADR-006: pen.dev para diseño acotado de pantallas clave

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

El brief pide evaluar Pencil.dev (hoy pen.dev) antes de diseñar. Verificado en docs.pencil.dev el 2026-10-12: extensión para Cursor/VS Code, archivos `.pen` versionables, integración MCP (`get_style`, `read_skill`, `get_app_state`, `execute`), flujo diseño↔código con agente, actualmente gratuito.

## Decisión

Usar pen.dev **de forma acotada**: tokens, componentes base y 5 pantallas (inicio, catálogo, producto, carrito/resumen, institucional) en un único `design/pijamas.pen`. La fuente de verdad de valores numéricos sigue siendo `docs/ux-ui.md` → `tokens.css`. El panel administrativo no se diseña (lo genera Payload).

## Alternativas

- Figma: estándar de la industria, pero externo al repositorio, sin MCP nativo en Cursor y con licencias para edición colaborativa.
- Sin herramienta de diseño, directamente en código: viable, pero cada iteración visual cuesta más que en un lienzo; se mantiene como ruta alternativa (`/dev/ui`).

## Consecuencias

- El desarrollador debe instalar la extensión y habilitar MCP (pasos en `design/README.md`); si no está disponible, la fase 4 sigue la alternativa sin bloquear el proyecto.
- Límites del plan gratuito no verificados: se asume uso ligero del agente.
- Los `.pen` no se editan a mano (indicación de la documentación oficial).

## Actualización (2026-10-12): cierre sin lienzo

No se crea `design/pijamas.pen`. La tienda ya está implementada y revisada en el navegador, así que un lienzo repetiría pantallas que ya existen y no cambiaría el producto. En este entorno no está el servidor MCP de pen.dev, y el archivo no se puede editar a mano. La fuente visual queda en `docs/ux-ui.md`, los tokens y las páginas publicadas. La galería `/dev/ui` sigue en la fase 5.
