# Prompts por fase para Cursor

Cada archivo es un prompt independiente para ejecutar una fase con Cursor (modo Agent). Se ejecutan en orden; una fase no comienza hasta que la anterior cumple sus criterios de aceptación.

## Cómo usar un prompt

1. Abre un chat nuevo en Cursor.
2. Adjunta el archivo del prompt (`@prompts/NN-...md`) y escribe: "Ejecuta esta fase".
3. El agente debe leer primero `AGENTS.md` y los archivos de contexto indicados, inspeccionar el repositorio y solo entonces modificar archivos.
4. Al terminar, el agente entrega el resumen de decisiones, cambios y pendientes, y actualiza la tabla de estado de este archivo.

## Estructura común de cada prompt

- **Rol** que asume Cursor.
- **Contexto** (archivos que debe leer).
- **Objetivo** de la fase.
- **Tareas**.
- **Restricciones** técnicas y de diseño.
- **Archivos** que crea o modifica.
- **Pruebas** que ejecuta.
- **Criterios de aceptación**.
- **Condiciones que impiden cerrar la fase**.
- **Resumen final** que debe entregar.

## Estado

| Fase | Prompt | Estado | Notas |
| --- | --- | --- | --- |
| 1 | [01-analisis-requisitos.md](01-analisis-requisitos.md) | Completada (2026-10-12) | `docs/requirements.md`, riesgos y pendientes |
| 2 | [02-investigacion-arquitectura.md](02-investigacion-arquitectura.md) | Completada (2026-10-12) | `docs/architecture.md`, ADR 001–008, `docs/costs.md` |
| 3 | [03-monorepo-configuracion.md](03-monorepo-configuracion.md) | Completada (2026-10-12) | pnpm workspaces, `@pijamas/domain`, `apps/web` con Payload y Postgres en Docker. CI en `.github/workflows/ci.yml` (`pnpm check`) |
| 4 | [04-diseno-ux-ui.md](04-diseno-ux-ui.md) | Completada (2026-10-12) | Lienzo `.pen` omitido a propósito: la tienda implementada es el diseño. Falta `/dev/ui` (fase 5) |
| 5 | [05-sistema-visual-componentes.md](05-sistema-visual-componentes.md) | Parcial | `/dev/ui` incluye botones, etiquetas, precios, vacío, diálogo, panel, acordeón y aviso. Faltan pruebas de contraste y capturas |
| 6 | [06-catalogo-paginas-publicas.md](06-catalogo-paginas-publicas.md) | Completada (2026-10-12) | Inicio, catálogo, categorías, colecciones, producto, páginas, FAQ, contacto, 404. Verificado en el navegador |
| 7 | [07-carrito-whatsapp.md](07-carrito-whatsapp.md) | Completada (2026-10-12) | Carrito persistente, resumen y `wa.me` con precios reconfirmados. Verificado en el navegador |
| 8 | [08-panel-administrativo.md](08-panel-administrativo.md) | Completada (2026-10-12) | Colecciones, globals, acceso, seed y panel en español. El inicio de sesión de demostración abre el panel |
| 9 | [09-seo-tecnico.md](09-seo-tecnico.md) | Parcial | Metadata, JSON-LD, sitemap, robots, `noindex`, canonical de paginación e imagen Open Graph medida a 1200×630. Falta Rich Results en una URL pública |
| 10 | [10-seguridad-accesibilidad-rendimiento.md](10-seguridad-accesibilidad-rendimiento.md) | Parcial | CSP en Report-Only. axe sin fallos graves. Lighthouse móvil ≥ 90 en inicio, categoría y producto sobre el build local |
| 11 | [11-pruebas-revision.md](11-pruebas-revision.md) | Parcial | E2E de WhatsApp, 404, filtros, paginación, talla, precio, panel y móvil. Faltan cobertura ≥ 90 % y la revisión Bugbot |
| 12 | [12-despliegue-documentacion.md](12-despliegue-documentacion.md) | Parcial | Guía, Dockerfile, imagen local y copia local. El workflow de GitHub no tiene el secreto `DATABASE_URI` (no hay `gh` ni base alcanzable desde Actions). El despliegue real queda fuera |

Actualiza esta tabla al cerrar cada fase.
