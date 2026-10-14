# Estrategia de pruebas y criterios de aceptación

## 1. Pirámide

| Nivel | Herramienta | Alcance | Dónde |
| --- | --- | --- | --- |
| Unitarias | Vitest 5 | `@pijamas/domain`: precios, disponibilidad, totales, mensaje y URL de WhatsApp, normalización de teléfono, esquemas Zod, slugify | `packages/domain/src/**/*.test.ts` |
| Integración | Vitest 5 + Payload Local API contra Postgres de pruebas | Control de acceso, validaciones de campos, hooks (revalidación, publishedAt, slug), consultas del catálogo (`apps/web/src/lib/catalog`) | `apps/web/tests/integration/**` |
| Componentes | Vitest + Testing Library (jsdom) | `VariantSelector`, `QuantityInput`, `Price`, `ProductCard`, store del carrito | `apps/web/src/components/**/*.test.tsx` |
| E2E | Playwright 1.64 (Chromium móvil y escritorio) | Flujos críticos: navegar → producto → variante → carrito → resumen → URL de WhatsApp; filtros; 404; panel: login y publicar producto | `apps/web/tests/e2e/**` |
| Accesibilidad | `@axe-core/playwright` dentro de E2E | Inicio, catálogo, producto, carrito, resumen | Misma suite E2E |
| Rendimiento | Lighthouse CI (`@lhci/cli`) sobre build de producción | Inicio, categoría, producto; móvil | `lighthouserc.json`, job de CI |
| Estático | TypeScript `--noEmit`, ESLint 9 (flat), Prettier | Todo el monorepo | `pnpm typecheck`, `pnpm lint`, `pnpm format:check` |

## 2. Comandos

```bash
pnpm test              # unitarias + componentes (todas las workspaces)
pnpm test:integration  # requiere DATABASE_URI de pruebas (docker compose up -d)
pnpm test:e2e          # levanta la app (webServer de Playwright) y ejecuta E2E
pnpm typecheck
pnpm lint
pnpm check             # typecheck + lint + test (puerta de calidad local)
```

## 3. Datos de prueba

- Unitarias: fixtures en memoria (`packages/domain/src/__fixtures__`).
- Integración y E2E: base de datos `pijamas_test` creada por `docker-compose.yml`; `pnpm --filter web seed --env test` carga el conjunto mínimo (3 categorías, 6 productos con/sin variantes, 1 agotado, 1 en promoción, globals con WhatsApp de prueba `573001112233`).
- Cada prueba de integración corre en transacción o limpia las colecciones que toca.

## 4. Casos obligatorios por módulo

### 4.1 `@pijamas/domain`

- `getEffectivePrice`: sin promoción; con promoción; variante con override; variante con override promocional; promoción ≥ precio se ignora.
- `getAvailability`: `none` disponible/no; `simple` 0, 1..umbral, > umbral; `variants` agregado (todas agotadas → agotado; alguna baja → pocas unidades).
- `computeCartTotals`: líneas vacías; cantidades múltiples; redondeo en enteros (unidad menor); precios promocionales.
- `buildWhatsAppMessage`: 1 línea; varias; con variante; con nota; sin ciudad; caracteres especiales (`&`, `#`, `+`, emoji, acentos); longitud razonable (< 4 000 caracteres con 20 líneas).
- `buildWhatsAppUrl`: número normalizado; `text` codificado (`%0A` saltos de línea); rechaza número inválido.
- `normalizeWhatsAppPhone`: `+57 300 111 2233` → `573001112233`; rechaza letras, < 8 o > 15 dígitos.
- `formatPrice`: COP sin decimales; USD con 2 decimales; locale `es-CO`.
- Esquemas Zod: `checkoutFormSchema` (nombre obligatorio 2–80, nota ≤ 500), `catalogSearchParamsSchema` (valores inválidos descartados).

### 4.2 Payload (integración)

- Anónimo solo lee publicados; autenticado lee borradores.
- Editor no cambia roles; admin sí.
- `salePrice >= price` → error de validación con mensaje en español.
- Publicar producto sin imágenes → error.
- `slug` duplicado → error.
- Cambio de slug publicado → se crea redirección (si se implementa automático) o aviso.
- Hook `afterChange` llama a `revalidateTag` con las etiquetas correctas (mock).

### 4.3 Tienda (E2E)

1. **Compra por WhatsApp (móvil)**: inicio → categoría → producto con variantes → seleccionar talla M y color → cantidad 2 → agregar → mini-carrito muestra 2 unidades y total correcto → `/finalizar-pedido` → nombre vacío muestra error → completar → botón genera URL `https://wa.me/573001112233?text=...` → decodificar y comprobar que contiene nombre, línea de producto con variante, cantidad, total, y que no contiene "confirmado".
2. **Variante agotada**: botón de talla agotada deshabilitado con texto "Agotado"; botón agregar deshabilitado; CTA de consulta visible.
3. **Filtros**: `/productos?talla=M&orden=precio-asc` muestra solo productos con M ordenados; `<link rel="canonical">` apunta a `/productos`; meta robots `noindex`.
4. **Paginación**: `?page=2` indexable con canonical propia.
5. **Precio cambiado**: modificar precio vía API autenticada → recargar `/carrito` → aviso de cambio y total actualizado.
6. **404**: `/productos/no-existe` responde 404 y muestra `not-found`.
7. **Panel**: login, crear producto borrador, vista previa muestra el borrador en `/productos/[slug]` con cookie, publicar, la tienda lo muestra sin reiniciar.
8. **Accesibilidad**: axe sin violaciones críticas/serias en las 5 páginas; navegación por teclado del selector de variantes.

## 5. Criterios de aceptación por fase

Cada prompt de `prompts/` incluye su lista. Regla general: una fase no se cierra si falla `pnpm check`, si hay pruebas omitidas (`.skip`) sin justificación escrita, o si una funcionalidad "funciona en la interfaz" pero no tiene prueba del nivel indicado en la sección 4.

## 6. CI (GitHub Actions, `.github/workflows/ci.yml`)

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck && pnpm lint && pnpm format:check`
3. `pnpm test`
4. Servicio Postgres → `pnpm test:integration`
5. `pnpm --filter web build` → `pnpm test:e2e`
6. `pnpm audit --prod --audit-level=high`
7. (Solo en `main`) Lighthouse CI contra la URL de vista previa de Vercel.

## 7. Lo que no se prueba automáticamente (y cómo se verifica)

- Apertura real de WhatsApp en dispositivos: prueba manual en Android, iOS y escritorio con WhatsApp Web antes del lanzamiento (lista en `docs/deployment.md`).
- Calidad de las fotografías y textos: revisión editorial de la propietaria.
- Lector de pantalla: sesión manual con NVDA en Windows en las 4 pantallas clave.
