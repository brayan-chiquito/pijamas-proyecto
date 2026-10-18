# Cómo probar la tienda en local

Hay dos caminos: **solo Docker** (recomendado para el cliente) o **Node + pnpm** (desarrollo).

## Opción A — Solo Docker (sin instalar Node)

Requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) en marcha.

Desde la raíz del repositorio:

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File .\scripts\demo-up.ps1
```

```bash
# macOS / Linux
chmod +x scripts/demo-up.sh && ./scripts/demo-up.sh
```

También: `pnpm demo:docker` si ya tienes Node/pnpm en esa máquina.

Qué hace el script:

1. Libera el puerto 5433 si había un Postgres de desarrollo.
2. Levanta Postgres 17.
3. Construye la imagen de la tienda (incluye catálogo de demostración; la primera vez tarda varios minutos).
4. Publica la app en el puerto 3000.

- Tienda: [http://localhost:3000](http://localhost:3000)
- Panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Correo: `admin@pijamas.local`
- Contraseña: `cambia-esta-clave`

Ya construido, en siguientes arranques:

```bash
docker compose -f docker-compose.demo.yml up -d
```

Parar:

```bash
docker compose -f docker-compose.demo.yml down
```

Borrar base e imágenes de demo (vuelve a seed al reconstruir):

```bash
docker compose -f docker-compose.demo.yml down -v
```

Volver a cargar solo el catálogo de demostración (sin rebuild completo):

```bash
docker compose -f docker-compose.demo.yml --profile seed run --rm seed
```

Archivos: `docker-compose.demo.yml`, `apps/web/Dockerfile`, `scripts/demo-up.ps1`, `scripts/demo-up.sh`.

## Opción B — Desarrollo con Node + pnpm

Requisitos: Node.js 22, pnpm 10 (`corepack enable`), Docker Desktop (solo Postgres).

```bash
corepack enable
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm db:up
pnpm --filter web seed
pnpm dev
```

- Tienda: [http://localhost:3000](http://localhost:3000)
- Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

Credenciales: `SEED_ADMIN_*` en `apps/web/.env`.

## Qué puede editar el administrador

Desde el panel, sin tocar código:

| Qué | Dónde en el panel |
| --- | --- |
| Productos (nombre, precio, fotos, tallas, publicar) | **Catálogo → Productos** |
| Portada (textos del hero, fotos, destacados) | **Contenido → Página de inicio** |
| Páginas (envíos, cambios, contacto…) | **Contenido → Páginas** |
| Menú y pie | **Sitio → Navegación** |
| WhatsApp y datos de la tienda | **Sitio → Configuración del sitio** |
| Fotos | **Sistema → Imágenes** |

Detalle paso a paso: [`docs/admin-guide.md`](admin-guide.md).

## Prueba rápida recomendada (10 minutos)

1. Abre la tienda y revisa el inicio (el hero debe cambiar de foto solo).
2. Entra a un producto, elige talla y color, agrégalo al carrito.
3. Ve a **Finalizar pedido**, rellena el nombre y abre WhatsApp (debe llevar el mensaje con el pedido).
4. Entra a `/admin` con las credenciales de arriba.
5. Abre **Productos**, edita la descripción corta de uno, pulsa **Publicar cambios**.
6. Recarga la ficha en la tienda: el texto debe actualizarse en segundos.
7. Abre **Página de inicio**, cambia el título del primer hero, publica y recarga `/`.

## Si algo no abre

| Síntoma | Qué hacer |
| --- | --- |
| Puerto 3000 ocupado | Cierra el otro `pnpm dev` o cambia el mapeo en `docker-compose.demo.yml`. |
| Puerto 5433 ocupado | El script detiene `pijamas-postgres`. Si sigue fallando: `docker ps` y para el contenedor que use 5433. |
| Build falla al conectar a Postgres | Asegúrate de que el paso 1 del script dejó Postgres sano (`docker ps`). |
| Panel sin productos | `docker compose -f docker-compose.demo.yml --profile seed run --rm seed` |
| No entra al admin | Correo y contraseña de demostración de arriba. |
| Imágenes rotas tras usar Docker y luego `pnpm` | El script `demo-up` ya copia las fotos a `apps/web/media`. Si faltan: vuelve a ejecutar `demo-up` o `pnpm --filter web seed`. |
