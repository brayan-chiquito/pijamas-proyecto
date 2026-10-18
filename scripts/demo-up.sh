#!/usr/bin/env bash
# Arranca la tienda de demostración solo con Docker.
# Uso (desde la raíz del repo):
#   chmod +x scripts/demo-up.sh && ./scripts/demo-up.sh

set -euo pipefail
cd "$(dirname "$0")/.."

compose=(docker compose -f docker-compose.demo.yml)

echo "Si hay un Postgres de desarrollo en el puerto 5433, se detiene para liberarlo..."
docker rm -f pijamas-postgres >/dev/null 2>&1 || true

echo "1/4 Postgres..."
"${compose[@]}" up -d postgres

echo "2/4 Esperando a que Postgres esté listo..."
ready=0
for _ in $(seq 1 60); do
  if docker exec pijamas-demo-postgres pg_isready -U postgres -d pijamas >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done
if [[ "$ready" -ne 1 ]]; then
  echo "Postgres no respondió a tiempo. Revisa Docker." >&2
  exit 1
fi

echo "3/4 Construyendo la app (incluye catálogo de demostración; la primera vez tarda varios minutos)..."
"${compose[@]}" build web

echo "4/5 Levantando la tienda..."
"${compose[@]}" up -d web

echo "5/5 Sincronizando fotos al disco local (por si luego usas pnpm)..."
mkdir -p apps/web/media
docker run --rm \
  -v pijamas-demo_pijamas-demo-media:/from \
  -v "$(pwd)/apps/web/media:/to" \
  alpine sh -c 'cp -a /from/. /to/'

echo
echo "Listo."
echo "  Tienda:  http://localhost:3000"
echo "  Panel:   http://localhost:3000/admin"
echo "  Usuario: admin@pijamas.local"
echo "  Clave:   cambia-esta-clave"
echo
echo "Parar:    docker compose -f docker-compose.demo.yml down"
echo "Borrar datos de demo: docker compose -f docker-compose.demo.yml down -v"
