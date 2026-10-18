# Arranca la tienda de demostración solo con Docker Desktop.
# Uso (desde la raíz del repo):
#   powershell -ExecutionPolicy Bypass -File .\scripts\demo-up.ps1

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host 'Si hay un Postgres de desarrollo en el puerto 5433, se detiene para liberarlo...'
cmd /c "docker rm -f pijamas-postgres >nul 2>&1"

Write-Host '1/4 Postgres...'
docker compose -f docker-compose.demo.yml up -d postgres
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '2/4 Esperando a que Postgres esté listo...'
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  docker exec pijamas-demo-postgres pg_isready -U postgres -d pijamas 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 2
}
if (-not $ready) {
  Write-Error 'Postgres no respondió a tiempo. Revisa Docker Desktop.'
  exit 1
}

Write-Host '3/4 Construyendo la app (incluye catálogo de demostración; la primera vez tarda varios minutos)...'
docker compose -f docker-compose.demo.yml build web
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '4/4 Levantando la tienda...'
docker compose -f docker-compose.demo.yml up -d web
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ''
Write-Host 'Listo.'
Write-Host '  Tienda:  http://localhost:3000'
Write-Host '  Panel:   http://localhost:3000/admin'
Write-Host '  Usuario: admin@pijamas.local'
Write-Host '  Clave:   cambia-esta-clave'
Write-Host ''
Write-Host 'Parar:    docker compose -f docker-compose.demo.yml down'
Write-Host 'Borrar datos de demo: docker compose -f docker-compose.demo.yml down -v'
