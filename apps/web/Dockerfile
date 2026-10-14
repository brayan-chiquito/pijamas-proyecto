# Contexto de build: la raíz del repositorio.
# docker build -f apps/web/Dockerfile -t pijamas .
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.34.7 --activate

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_DB_PUSH=false
# La compilación prerenderiza páginas y necesita una base alcanzable desde el contenedor.
# En Docker Desktop, el Postgres local del host está en host.docker.internal:5433.
ARG DATABASE_URI=postgres://postgres:postgres@host.docker.internal:5433/pijamas
ARG COMPILE_TOKEN=secreto-solo-para-compilar-la-imagen-no-usar-en-runtime
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV DATABASE_URI=$DATABASE_URI
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
RUN PAYLOAD_SECRET="$COMPILE_TOKEN" pnpm --filter web build

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
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
