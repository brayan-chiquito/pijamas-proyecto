# Entornos, despliegue y mantenimiento

## 1. Entornos

| Entorno | Base de datos | Imágenes | URL | Uso |
| --- | --- | --- | --- | --- |
| Local | Postgres en Docker (`docker compose up -d`, puerto **5433** del host) | Disco local (`apps/web/media`, ignorado en git) | `http://localhost:3000` | Desarrollo y pruebas |
| Vista previa (Vercel Preview) | Rama de Neon por PR (integración Neon–Vercel) o base `pijamas_preview` | Store de Blob de pruebas | `*.vercel.app` | Revisión de PR |
| Producción | Neon `main` | Store de Blob de producción | Dominio propio | Tienda real |

## 2. Variables de entorno (`.env.example` es el contrato)

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DATABASE_URI` | Sí | Cadena de conexión Postgres (`postgres://user:pass@host/db?sslmode=require` en Neon) |
| `PAYLOAD_SECRET` | Sí | ≥ 32 caracteres aleatorios (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SERVER_URL` | Sí | URL pública absoluta sin barra final (canonicals, OG, sitemap) |
| `PREVIEW_SECRET` | Sí | Secreto para activar la vista previa |
| `REVALIDATION_SECRET` | Sí | Secreto para `/next/revalidate` |
| `BLOB_READ_WRITE_TOKEN` | Producción | Token de Vercel Blob (vacío en local → disco) |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Solo seed | Primer usuario administrador |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Opcional | Recuperación de contraseña; sin SMTP se desactiva |
| `NEXT_PUBLIC_GA_ID` | Opcional | Google Analytics 4 |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Opcional | Verificación de Search Console |
| `CRON_SECRET` | Opcional | Protección de tareas programadas si se añaden |

Nunca se comprometen valores reales. En Vercel se cargan en Project Settings → Environment Variables por entorno.

## 3. Instalación local

```bash
corepack enable                 # habilita pnpm (Node 22)
pnpm install
cp .env.example .env            # editar valores
docker compose up -d            # Postgres 17 en localhost:5433
pnpm --filter web payload migrate
pnpm --filter web seed          # datos de demostración y usuario admin
pnpm dev                        # http://localhost:3000 y /admin
```

## 4. Despliegue en Vercel (producción)

1. Crear proyecto en Vercel (plan **Pro**, uso comercial) apuntando a `apps/web` como Root Directory, framework Next.js, package manager pnpm.
2. Instalar la integración de Neon desde el Marketplace de Vercel (crea `DATABASE_URI` por entorno) o pegar la cadena manualmente.
3. Crear un store de Vercel Blob y vincularlo (`BLOB_READ_WRITE_TOKEN`).
4. Añadir el resto de variables.
5. Build command: `pnpm --filter web build` (ejecuta `payload migrate` antes del build mediante script `prebuild` en producción). Node 22.
6. Dominio: añadir dominio, forzar `https`, redirigir `www` → apex (o al revés, pero uno solo).
7. Primer acceso a `/admin`: crear el primer usuario (o ejecutar `seed` con `SEED_ADMIN_*` una sola vez desde local apuntando a producción).
8. Verificar la lista de la sección 8.

Migraciones: Payload genera migraciones SQL con `pnpm --filter web payload migrate:create`. Se versionan en `apps/web/src/migrations/`. En producción se aplican en el `prebuild`. Nunca se usa `push` automático de esquema en producción.

## 5. Alternativa de alojamiento (contenedor)

`apps/web/Dockerfile` (multi-stage, `output: 'standalone'`, `sharp` incluido). El contexto es la raíz del repositorio:

```bash
docker build -f apps/web/Dockerfile -t pijamas .
```

La compilación conecta a Postgres para prerenderizar. El valor por defecto apunta al Postgres local de Docker Desktop (`host.docker.internal:5433`). En otro entorno pasa la cadena real: `--build-arg DATABASE_URI=...`. Esa cadena no queda como secreto de ejecución; al arrancar el contenedor hay que volver a definir `DATABASE_URI` y `PAYLOAD_SECRET`.

Variables iguales salvo `BLOB_READ_WRITE_TOKEN`, que se sustituye por `S3_*` con el adaptador `@payloadcms/storage-s3` (Cloudflare R2 u otro compatible). `PAYLOAD_DB_PUSH` debe quedar vacío en el contenedor. Pasos genéricos para Railway/Render/Coolify:

1. Crear servicio desde el repositorio con el Dockerfile; puerto 3000.
2. Base de datos Postgres gestionada por el proveedor o Neon.
3. Configurar variables; ejecutar `pnpm --filter web payload migrate` en el primer despliegue.
4. Dominio y TLS gestionados por el proveedor.

Costo estimado: 5–10 USD/mes (ver `docs/costs.md`).

## 6. Mantenimiento

| Frecuencia | Tarea | Responsable |
| --- | --- | --- |
| Semanal (automático) | `pg_dump` de producción a almacenamiento privado (GitHub Actions `backup.yml` con `DATABASE_URI` como secreto y subida a Blob privado o a un bucket S3) | Desarrollador configura; corre solo |
| Semanal | Revisar uso en Neon (CU-horas, almacenamiento) y Vercel (crédito) | Propietaria o desarrollador |
| Mensual | `pnpm up` de dependencias menores; `pnpm audit`; desplegar | Desarrollador |
| Inmediato | Parches de seguridad de Next.js/Payload | Desarrollador |
| Mensual | Exportación de imágenes (`export:media`) | Desarrollador |
| Trimestral | Prueba de restauración de copia en base de datos de prueba | Desarrollador |
| Tras lanzamiento | Search Console: cobertura, listados de comerciante, Core Web Vitals | Propietaria con guía |

## 7. Restauración

```bash
# Base de datos
pg_restore --clean --no-owner -d "$DATABASE_URI" backup.dump
# o psql "$DATABASE_URI" < backup.sql
# Imágenes: volver a subir desde la exportación mediante el script import:media
```

Procedimiento probado en la fase 12 contra una base vacía; tiempo objetivo de recuperación: < 1 hora.

## 8. Lista de verificación de lanzamiento

- [ ] Variables de producción completas; `PAYLOAD_SECRET` y secretos únicos (no los de local).
- [ ] Migraciones aplicadas; `seed` no ejecutado en producción salvo el usuario admin.
- [ ] Usuario admin con contraseña fuerte; usuarios de prueba eliminados.
- [ ] WhatsApp real configurado y probado desde Android, iOS y escritorio.
- [ ] Dominio con https, redirección única, `NEXT_PUBLIC_SERVER_URL` correcto.
- [ ] `robots.txt`, `sitemap.xml`, 404, Open Graph verificados.
- [ ] Lighthouse móvil ≥ 90 en inicio, categoría y producto.
- [ ] Search Console verificado y sitemap enviado.
- [ ] Copia de seguridad automática ejecutada al menos una vez con éxito.
- [ ] `docs/admin-guide.md` entregada a la propietaria y sesión de capacitación realizada.

## 9. Rotación de secretos

- `PAYLOAD_SECRET`: cambiarlo invalida todas las sesiones; hacerlo en horario de baja actividad y avisar a los editores.
- `BLOB_READ_WRITE_TOKEN`: regenerar en Vercel y actualizar la variable; sin impacto en archivos existentes.
- Contraseña de base de datos: rotar en Neon y actualizar `DATABASE_URI`.
