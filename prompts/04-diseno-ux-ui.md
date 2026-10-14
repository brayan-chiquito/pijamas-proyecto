# Fase 4 — Diseño UX/UI y configuración de pen.dev

## Rol

Diseñador de producto con experiencia en comercio electrónico de moda y en sistemas de diseño implementables.

## Contexto

`AGENTS.md`, `docs/ux-ui.md`, `docs/navigation.md`, `design/README.md`, `docs/decisions/006-pen-dev-diseno.md`.

## Prerrequisito (lo hace el desarrollador, no el agente)

Extensión pen.dev instalada en Cursor, `design/pijamas.pen` creado y abierto, MCP habilitado con el servidor `pencil` visible en Cursor. Si no se cumple, ejecutar la **ruta alternativa** de este prompt.

## Objetivo

Materializar el sistema visual en un lienzo revisable: tokens, componentes y las 5 pantallas clave en móvil y escritorio, listos para trasladar a código con fidelidad.

## Tareas (ruta pen.dev)

1. Llamar a `get_app_state()` y confirmar que el documento activo es `design/pijamas.pen`. Si no, detenerse e indicarlo.
2. Crear la página `00 Tokens` con la paleta (HEX exactos), tipografías Fraunces/Nunito Sans, escala tipográfica, espaciado, radios y sombras de `docs/ux-ui.md`.
3. Crear `01 Componentes` con las variantes y estados listados en la sección 5 de `docs/ux-ui.md`.
4. Crear `02 Inicio`, `03 Catálogo`, `04 Producto`, `05 Carrito y resumen`, `06 Institucional` en 390 px y 1440 px, incluyendo estados vacío y variante agotada donde corresponde.
5. Exportar PNG de cada pantalla a `design/exports/`.
6. Registrar en `docs/ux-ui.md` cualquier ajuste de token decidido en el lienzo.

## Tareas (ruta alternativa sin pen.dev)

1. Verificar que `/dev/ui` existe (fase 5); si no, crearla con todos los componentes y estados.
2. Producir capturas con Playwright de `/dev/ui` y de las 5 pantallas con datos de seed en 390 y 1440 px, guardarlas en `design/exports/`.
3. Revisar contra `docs/ux-ui.md` y corregir desviaciones.

## Restricciones

- No inventar comandos ni herramientas de pen.dev que no aparezcan en su documentación oficial; consultar https://docs.pencil.dev si algo falta.
- No editar `.pen` manualmente.
- Fuente de verdad de valores: `docs/ux-ui.md`.
- Sin modo oscuro en esta versión.

## Archivos

`design/pijamas.pen`, `design/exports/*.png`, `docs/ux-ui.md` (ajustes).

## Pruebas

Revisión visual: contraste con herramienta (los pares de la tabla de colores), tamaños táctiles ≥ 44 px en los componentes.

## Criterios de aceptación

- Las 7 páginas del lienzo existen con el contenido indicado (o las capturas equivalentes en la ruta alternativa).
- Ningún color fuera de la paleta; ninguna tipografía fuera de las dos definidas.
- Estados agotado, pocas unidades, vacío y error representados.

## Condiciones que impiden cerrar

- Documento `.pen` no confirmado por `get_app_state()` en la ruta pen.dev.
- Pantallas solo en escritorio (falta móvil) o viceversa.

## Resumen final

Lista de pantallas y componentes diseñados, ajustes de tokens, decisiones visuales abiertas para la propietaria (p. ej. estilo fotográfico).
