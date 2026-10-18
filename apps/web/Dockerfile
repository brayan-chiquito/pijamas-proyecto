# Contexto de build: la raíz del repositorio.
# Demo local (Postgres del compose en el host):
#   docker compose -f docker-compose.demo.yml up -d postgres
#   docker compose -f docker-compose.demo.yml build web
#   docker compose -f docker-compose.demo.yml up -d web
# O usa el script: scripts/demo-up.ps1 / scripts/demo-up.sh
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.34.7 --activate

FROM base AS deps
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

# Solo seed (sin build de Next). Útil para reinicializar el catálogo de demo.
FROM deps AS seeder
WORKDIR /app
ENV NODE_OPTIONS=--no-deprecation
ENV PAYLOAD_DB_PUSH=true
CMD ["pnpm", "--filter", "web", "seed"]

FROM deps AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_DB_PUSH=true
ENV NODE_OPTIONS=--no-deprecation
# La compilación prerenderiza y el seed escribe en Postgres.
# Con Docker Desktop, el Postgres del compose (puerto 5433) se alcanza así:
ARG DATABASE_URI=postgres://postgres:postgres@host.docker.internal:5433/pijamas
ARG COMPILE_TOKEN=cambia-este-secreto-por-uno-de-al-menos-32-caracteres
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ARG SEED_ADMIN_EMAIL=admin@pijamas.local
ARG SEED_ADMIN_PASSWORD=cambia-esta-clave
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$COMPILE_TOKEN
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV SEED_ADMIN_EMAIL=$SEED_ADMIN_EMAIL
ENV SEED_ADMIN_PASSWORD=$SEED_ADMIN_PASSWORD
RUN pnpm --filter web seed && pnpm --filter web build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
  && mkdir -p /app/apps/web/media \
  && chown -R nextjs:nodejs /app
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/media ./apps/web/media
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
