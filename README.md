# Tienda online de pijamas

Tienda profesional para la venta de pijamas con catálogo administrable, carrito y cierre de pedido por WhatsApp. Construida con Next.js 16 y Payload CMS 3 en una sola aplicación, pensada para que la propietaria gestione productos, precios, fotografías y textos sin tocar código.

## Documentación

| Documento | Contenido |
| --- | --- |
| [`docs/brief.md`](docs/brief.md) | Prompt maestro original con los requisitos del encargo |
| [`docs/requirements.md`](docs/requirements.md) | Requisitos funcionales y no funcionales, riesgos, decisiones pendientes |
| [`docs/architecture.md`](docs/architecture.md) | Comparativa tecnológica, arquitectura recomendada, versiones fijadas |
| [`docs/decisions/`](docs/decisions/README.md) | Registro de decisiones (ADR) |
| [`docs/data-model.md`](docs/data-model.md) | Colecciones, globals, relaciones y reglas de negocio |
| [`docs/navigation.md`](docs/navigation.md) | Mapa de navegación y definición de pantallas |
| [`docs/ux-ui.md`](docs/ux-ui.md) | Sistema visual, componentes, accesibilidad y evaluación de pen.dev |
| [`docs/seo.md`](docs/seo.md) | Estrategia SEO técnico y lista de comprobación |
| [`docs/security.md`](docs/security.md) | Controles y criterios de seguridad |
| [`docs/testing.md`](docs/testing.md) | Estrategia de pruebas y criterios de aceptación |
| [`docs/deployment.md`](docs/deployment.md) | Entornos, variables, despliegue, copias de seguridad y mantenimiento |
| [`docs/costs.md`](docs/costs.md) | Estimación de costos iniciales y recurrentes |
| [`docs/project-structure.md`](docs/project-structure.md) | Estructura del monorepo y reglas de dependencia |
| [`docs/admin-guide.md`](docs/admin-guide.md) | Guía de uso del panel para la propietaria |
| [`docs/local-testing.md`](docs/local-testing.md) | Cómo arrancar en local y probar tienda + panel |
| [`prompts/`](prompts/README.md) | Prompts por fase para ejecutar el proyecto con Cursor |
| [`AGENTS.md`](AGENTS.md) | Reglas y convenciones para agentes de Cursor |
| [`design/README.md`](design/README.md) | Flujo de diseño con pen.dev |

## Stack

- **Next.js 16.4** (App Router, React 19.3, Server Components, ISR por etiquetas)
- **Payload CMS 3.90** embebido: panel en `/admin`, autenticación, control de acceso, borradores, vista previa en vivo, subida de imágenes
- **PostgreSQL** (Docker en local, Neon en producción)
- **Tailwind CSS 4** con tokens propios, primitivas accesibles de `radix-ui`
- **`@pijamas/domain`**: lógica de negocio pura (precios, disponibilidad, carrito, WhatsApp) con Zod y Vitest
- **Playwright** para flujos críticos; **Vitest** para unitarias e integración
- **pnpm** workspaces (monorepo mínimo)

## Requisitos

- **Probar solo con Docker:** Docker Desktop (no hace falta instalar Node)
- **Desarrollar:** Node.js 22 LTS (probado con 22.13), pnpm 10 (`corepack enable`) y Docker Desktop (Postgres)

## Probar solo con Docker (otra máquina / cliente)

Desde la raíz del repositorio, con Docker Desktop en marcha:

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File .\scripts\demo-up.ps1
```

```bash
# macOS / Linux
chmod +x scripts/demo-up.sh && ./scripts/demo-up.sh
```

- Tienda: http://localhost:3000  
- Panel: http://localhost:3000/admin  
- Usuario: `admin@pijamas.local` · Contraseña: `cambia-esta-clave`

La primera vez construye la imagen (varios minutos). Después basta con:

```bash
docker compose -f docker-compose.demo.yml up -d
```

Parar: `docker compose -f docker-compose.demo.yml down`  
Borrar datos de demo: `docker compose -f docker-compose.demo.yml down -v`

Detalle: [`docs/local-testing.md`](docs/local-testing.md).

## Instalación para desarrollo (Node + pnpm)

```bash
corepack enable
pnpm install
cp apps/web/.env.example apps/web/.env     # editar valores
pnpm db:up                                  # Postgres 17 en localhost:5433
pnpm --filter web payload migrate
pnpm --filter web seed                      # datos de demostración y usuario admin
pnpm dev                                    # http://localhost:3000  ·  panel en /admin
```

Credenciales iniciales del panel: las definidas en `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` del `.env`.

## Comandos

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (tienda + panel) |
| `pnpm build` | Build de producción de todos los paquetes |
| `pnpm typecheck` | Comprobación de tipos |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test` | Pruebas unitarias y de componentes |
| `pnpm test:integration` | Pruebas contra Postgres (requiere `pnpm db:up`) |
| `pnpm test:e2e` | Playwright |
| `pnpm check` | typecheck + lint + test |
| `pnpm --filter web payload migrate:create` | Generar migración tras cambiar colecciones |
| `pnpm --filter web generate:types` | Regenerar `payload-types.ts` |
| `pnpm db:up` / `pnpm db:down` | Levantar / detener Postgres local (solo base, para desarrollo) |
| `pnpm demo:docker` | Tienda completa con Docker (`scripts/demo-up`) |

## Funcionamiento

1. La propietaria crea productos, categorías, colecciones y contenido en `/admin`. Puede guardar borradores, previsualizar en vivo y publicar.
2. Al publicar, los hooks de Payload revalidan las etiquetas de caché de Next.js; la tienda muestra el cambio en segundos sin despliegue.
3. El visitante navega el catálogo (filtros por talla, color, precio), elige variantes, agrega al carrito (persistido en el navegador) y revisa el resumen en `/finalizar-pedido`.
4. El botón "Enviar pedido por WhatsApp" abre `https://wa.me/<número>?text=<pedido>` con el detalle; la venta se confirma en la conversación. El número y el saludo se configuran en el panel.

## Estado del proyecto

Consulta `prompts/README.md` para ver el avance por fase y los criterios de aceptación de cada una.

## Licencia

Código propietario del encargo. Las dependencias conservan sus licencias (Next.js y Payload: MIT).
