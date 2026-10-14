# Estrategia SEO técnico y lista de comprobación

Basada en la documentación de Google Search Central vigente (consultada 2026-10-12). No se prometen posiciones. Se distingue entre **requisito técnico** (RT, lo implementa el código), **buena práctica** (BP) y **acción comercial** (AC, depende de contenido o trabajo posterior de la propietaria).

## 1. Renderizado e indexación

| Tipo | Medida | Implementación |
| --- | --- | --- |
| RT | Todo el contenido indexable se entrega en el HTML inicial | Server Components; el carrito es el único estado de cliente |
| RT | Páginas de catálogo, categoría, colección, producto e institucionales cacheadas con ISR por etiquetas | `"use cache"` + `cacheTag`; revalidación por hooks de Payload |
| RT | Borradores nunca accesibles sin cookie de vista previa | `draftMode()` + `payload.find({ draft })` solo en preview |
| RT | `noindex` en `/carrito`, `/finalizar-pedido`, `/buscar`, `/admin`, vistas previas y páginas con filtros | `robots` en `generateMetadata`; `robots.txt` bloquea `/admin` y `/api` |

## 2. URLs

| Tipo | Medida |
| --- | --- |
| RT | Estructura: `/productos/[slug]`, `/categorias/[slug]`, `/colecciones/[slug]`, `/[slug]` para páginas; minúsculas, guiones, sin acentos (slugify) |
| RT | `rel="canonical"` absoluto en todas las páginas; en catálogo con filtros/orden apunta a la URL base de la categoría o catálogo; `?page=N` conserva canonical propio (paginación indexable) |
| RT | Redirección 301 automática al cambiar un slug publicado (plugin de redirecciones + aviso en el panel) |
| RT | Dominio único con `https`, sin `www` duplicado (configurar redirección en el host) |
| BP | Slugs descriptivos: `pijama-largo-algodon-rosa` en lugar de `producto-123` (el panel autogenera desde el título; se puede editar) |

## 3. Títulos, descripciones y encabezados

| Tipo | Medida |
| --- | --- |
| RT | `<title>` único por página: `{SEO title | título} · {sufijo del sitio}`; metadescripción desde SEO o descripción corta; sin duplicados |
| RT | Un h1 por página; secciones con h2; subsecciones h3 |
| RT | Plugin SEO de Payload con vista previa de fragmento y contadores de longitud (recomendación 50–60 / 120–155 caracteres) |
| AC | Redactar descripciones únicas por producto y categoría; evitar copiar texto de proveedores |

## 4. Datos estructurados (JSON-LD)

Decisión según la documentación de Google: la tienda **vende el producto** aunque el cierre sea por WhatsApp, por lo que la página de producto es una página "donde los compradores pueden comprar" y aplica el marcado de **listado de comerciante** (`Product` con `Offer` anidado). Requisitos verificados: `Offer` (no `AggregateOffer`), `price` > 0, `priceCurrency`, `availability`; la página debe describir un único producto o sus variantes.

| Página | Tipos | Reglas |
| --- | --- | --- |
| Producto | `Product` + `Offer` (o varios `Offer` por variante con precio distinto), `BreadcrumbList` | `name`, `image[]` (todas las imágenes), `description`, `sku` si existe, `brand` (nombre del sitio), `offers.price` = precio vigente (promocional si aplica) en formato decimal con punto, `priceCurrency` desde configuración, `availability` mapeado desde la disponibilidad real (`InStock`, `LimitedAvailability`, `OutOfStock`), `url` canónica, `priceValidUntil` **no** se emite (no hay fecha real), `itemCondition: NewCondition`. **No** se emiten `review`, `aggregateRating` ni `shippingDetails`/`hasMerchantReturnPolicy` a menos que existan datos reales en el panel |
| Variantes | `ProductGroup` con `hasVariant` | Solo cuando el producto tiene variantes; `variesBy` (size, color) |
| Categoría / colección / catálogo | `BreadcrumbList`, `CollectionPage` (opcional) | Sin `ItemList` de productos salvo que se evalúe su utilidad |
| Inicio | `Organization` (nombre, logo, `sameAs` desde redes configuradas, `contactPoint` con WhatsApp/teléfono si existen), `WebSite` | Sin `SearchAction` salvo que la búsqueda interna esté lista y se decida exponerla |
| FAQ | `FAQPage` solo en `/preguntas-frecuentes` | Google limita la visibilidad de este resultado enriquecido a sitios gubernamentales y de salud; se incluye por semántica, sin esperar resultado enriquecido |

Validación: Rich Results Test sin errores; Search Console → informe "Listados de comerciante" sin errores tras indexación. Prohibido marcar precios, disponibilidad o valoraciones inexistentes.

## 5. Sitemap y robots

- `sitemap.ts`: productos publicados, categorías, colecciones, páginas, FAQ, inicio; `lastModified` desde `updatedAt`; excluye borradores y rutas `noindex`. Si supera 50 000 URL se divide (no aplica).
- `robots.ts`: `Allow: /`, `Disallow: /admin`, `/api`, `/carrito`, `/finalizar-pedido`, `/buscar`, `/next`; `Sitemap: https://dominio/sitemap.xml`.
- Enviar el sitemap en Search Console (AC).

## 6. Enlazado interno

- Migas de pan en producto y categoría.
- Productos relacionados (manual o automático por categoría).
- Categorías destacadas y colecciones en inicio y pie.
- Enlaces a categorías desde páginas institucionales cuando tenga sentido (AC).

## 7. Imágenes

- `next/image` con `sizes` por componente, AVIF/WebP, `priority` solo en la imagen LCP.
- `alt` obligatorio en el panel; `altOverride` por producto para contexto.
- Nombres de archivo descriptivos recomendados al subir (AC).
- Imágenes Open Graph 1200×630 generadas desde la imagen principal (`opengraph-image.tsx`) con fallback a la OG por defecto.

## 8. Mobile-first y rendimiento

Ver `docs/requirements.md` (RNF-PERF). Core Web Vitals se miden con Speed Insights y Search Console; Lighthouse CI en cada despliegue de producción (umbral 90 móvil).

## 9. Contenido duplicado y parámetros

| Caso | Tratamiento |
| --- | --- |
| Filtros (`?talla=M&color=rosa`) | `noindex, follow` + canonical a la base |
| Orden (`?orden=precio-asc`) | Igual que filtros |
| Paginación (`?page=2`) | Indexable, canonical propia, enlaces `<a href>` reales |
| Búsqueda (`/buscar?q=`) | `noindex` |
| Mismo producto en varias colecciones | Una sola URL de producto; las colecciones enlazan a ella |
| Vista previa | Cookie de draft, `noindex`, no enlazada |

## 10. Open Graph y compartir

`openGraph` y `twitter` en `generateMetadata`: título, descripción, imagen, `type: website` (Next no soporta `product` como tipo en la API de metadata; se añaden `product:price:amount` y `product:price:currency` como `other`), `locale: es_CO` (configurable), `siteName`.

## 11. Integraciones

- Google Search Console: verificación por etiqueta `<meta name="google-site-verification">` configurable por variable `NEXT_PUBLIC_GSC_VERIFICATION` (sin tocar código).
- Analítica: Vercel Web Analytics (sin cookies) activada por defecto; GA4 opcional por `NEXT_PUBLIC_GA_ID`, cargado con `next/script` `afterInteractive` y solo tras aceptar cookies si se habilita el banner (AC: decidir según normativa local).
- Google Merchant Center (AC, opcional): el marcado de listado de comerciante facilita la coincidencia con un feed si en el futuro se crea.

## 12. Lista de comprobación antes del lanzamiento

- [ ] Títulos y descripciones únicos en inicio, categorías, 100 % de productos publicados.
- [ ] `alt` presente en todas las imágenes publicadas (consulta en el panel).
- [ ] Rich Results Test sin errores en 3 productos (con y sin variantes, con promoción).
- [ ] `sitemap.xml` y `robots.txt` accesibles y correctos en producción.
- [ ] Canonicals correctas en catálogo con filtros y paginación.
- [ ] 404 real (código HTTP 404) en slugs inexistentes.
- [ ] Redirección http→https y www→apex.
- [ ] Lighthouse móvil ≥ 90 en inicio, categoría y producto.
- [ ] Search Console verificado, sitemap enviado.
- [ ] Open Graph verificado al compartir un producto en WhatsApp.
