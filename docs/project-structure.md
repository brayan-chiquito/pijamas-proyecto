# Estructura del monorepo

Gestor: **pnpm 10** (vía `corepack`), workspaces declarados en `pnpm-workspace.yaml`. Sin orquestador adicional (Turborepo/Nx) mientras haya dos paquetes; los scripts raíz usan `pnpm -r` y filtros.

```
pijamas/
├── .cursor/
│   └── rules/                      # Reglas específicas por área (frontend, payload, tests)
├── .github/workflows/
│   ├── ci.yml                      # typecheck, lint, test, build, e2e, audit
│   └── backup.yml                  # pg_dump semanal
├── apps/
│   └── web/
│       ├── public/                 # favicon, iconos, OG por defecto
│       ├── src/
│       │   ├── app/
│       │   │   ├── (frontend)/     # Tienda pública (ver docs/navigation.md)
│       │   │   ├── (payload)/      # Admin y API generados por Payload
│       │   │   └── next/           # preview, exit-preview, revalidate
│       │   ├── access/             # Funciones de control de acceso
│       │   ├── collections/        # Users, Media, Products, Categories, Collections, Tags, Pages, Faqs
│       │   ├── globals/            # SiteSettings, Navigation, HomePage, SizeGuide
│       │   ├── fields/             # Campos reutilizables (slug, seo, link)
│       │   ├── hooks/              # Hooks de Payload (revalidate, publishedAt)
│       │   ├── components/
│       │   │   ├── ui/             # Primitivas de diseño sin dominio
│       │   │   ├── store/          # Componentes de tienda (ProductCard, VariantSelector, Cart…)
│       │   │   ├── layout/         # Header, Footer, AnnouncementBar
│       │   │   └── richtext/       # Serializador Lexical → React
│       │   ├── lib/
│       │   │   ├── payload.ts      # getPayload() memoizado
│       │   │   ├── catalog/        # Consultas tipadas con caché y etiquetas
│       │   │   ├── seo/            # metadata helpers, JSON-LD builders
│       │   │   └── cart/           # store zustand + hidratación + revalidación
│       │   ├── styles/
│       │   │   ├── globals.css     # @import tailwindcss + tokens
│       │   │   └── tokens.css      # @theme con la paleta y escalas
│       │   ├── migrations/         # Migraciones SQL generadas por Payload
│       │   ├── seed/               # Datos de demostración
│       │   ├── payload.config.ts
│       │   └── payload-types.ts    # Generado (no editar)
│       ├── tests/
│       │   ├── integration/
│       │   └── e2e/
│       ├── next.config.ts
│       ├── playwright.config.ts
│       ├── vitest.config.ts
│       ├── Dockerfile
│       ├── .env.example
│       └── package.json
├── packages/
│   └── domain/                     # @pijamas/domain
│       ├── src/
│       │   ├── money.ts            # formatPrice, tipos de dinero
│       │   ├── pricing.ts          # getEffectivePrice, descuentos
│       │   ├── availability.ts     # getAvailability
│       │   ├── cart.ts             # tipos de línea, computeCartTotals
│       │   ├── whatsapp.ts         # normalizePhone, buildMessage, buildUrl
│       │   ├── slug.ts             # slugify
│       │   ├── schemas.ts          # Zod: checkout, catálogo, teléfono
│       │   └── index.ts
│       ├── vitest.config.ts
│       └── package.json
├── design/                         # pen.dev
├── docs/                           # Documentación (este directorio)
├── prompts/                        # Prompts por fase
├── AGENTS.md
├── docker-compose.yml
├── eslint.config.mjs
├── .prettierrc
├── .editorconfig
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

## Reglas de dependencia

- `packages/domain` no depende de React, Next ni Payload. Solo `zod`.
- `apps/web` depende de `@pijamas/domain` (`workspace:*`).
- Los componentes de `ui/` no importan de `lib/payload` ni de `payload-types`.
- Los componentes de `store/` reciben datos ya mapeados a tipos de dominio (`ProductSummary`, `ProductDetail`), construidos en `lib/catalog/mappers.ts` a partir de `payload-types`. Así el frontend no se acopla al CMS.

## Scripts raíz

| Script | Acción |
| --- | --- |
| `pnpm dev` | `pnpm --filter web dev` |
| `pnpm build` | `pnpm -r build` |
| `pnpm typecheck` | `pnpm -r typecheck` |
| `pnpm lint` / `pnpm lint:fix` | ESLint en todo el repo |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test` | `pnpm -r test` |
| `pnpm test:integration`, `pnpm test:e2e` | Delegan en `web` |
| `pnpm check` | typecheck + lint + test |
| `pnpm db:up` / `pnpm db:down` | Docker Compose |
