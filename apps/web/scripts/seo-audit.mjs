const base = process.env.SEO_AUDIT_URL || 'http://localhost:3001'

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' })
  const html = await response.text()
  return { status: response.status, html, headers: response.headers }
}

function meta(html, name) {
  const match = html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${name}"`, 'i'))
  return match?.[1] ?? null
}

function canonical(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? null
}

function title(html) {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null
}

function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  )
}

function h1Count(html) {
  return [...html.matchAll(/<h1[\s>]/g)].length
}

const failures = []
function check(name, ok, detail) {
  const mark = ok ? 'ok' : 'fallo'
  console.info(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures.push(name)
}

const robots = await get('/robots.txt')
check('robots 200', robots.status === 200, String(robots.status))
check('robots bloquea el carrito', robots.html.includes('Disallow: /carrito'))
check('robots publica el sitemap', /Sitemap: .+\/sitemap\.xml/.test(robots.html))

const sitemap = await get('/sitemap.xml')
check('sitemap 200', sitemap.status === 200)
for (const slug of ['pijama-estampado-rojo', 'pijama-infantil-rayas', 'bata-suave-de-casa']) {
  check(`sitemap incluye ${slug}`, sitemap.html.includes(`/productos/${slug}`))
}
check('sitemap no incluye el carrito', !sitemap.html.includes('/carrito'))

const home = await get('/')
const homeLd = jsonLd(home.html)
check('inicio 200', home.status === 200)
check('inicio un h1', h1Count(home.html) === 1, String(h1Count(home.html)))
check('inicio Organization', homeLd.some((item) => item['@type'] === 'Organization'))
check('inicio WebSite', homeLd.some((item) => item['@type'] === 'WebSite'))
check('inicio canonical', canonical(home.html)?.endsWith('/') === true || canonical(home.html) === `${base}/` || Boolean(canonical(home.html)))

const product = await get('/productos/pijama-largo-algodon-rosa')
const productLd = jsonLd(product.html)
const group = productLd.find((item) => item['@type'] === 'ProductGroup')
check('producto 200', product.status === 200)
check('producto un h1', h1Count(product.html) === 1, String(h1Count(product.html)))
check('producto título', Boolean(title(product.html)?.includes('Pijama largo de seda rosa')))
check('producto descripción', Boolean(meta(product.html, 'description')))
check('producto canonical', canonical(product.html)?.includes('/productos/pijama-largo-algodon-rosa') === true)
check('producto ProductGroup', Boolean(group))
check('producto sin reseñas inventadas', !product.html.includes('aggregateRating') && !product.html.includes('review'))
const variant = group?.hasVariant?.[0]
const offer = variant?.offers
check('oferta con precio', Number(offer?.price) > 0, String(offer?.price))
check('oferta con moneda COP', offer?.priceCurrency === 'COP', String(offer?.priceCurrency))
check('oferta con disponibilidad', typeof offer?.availability === 'string' && offer.availability.includes('schema.org'))
check('variante agotada marcada', group?.hasVariant?.some((item) => item.offers?.availability?.includes('OutOfStock')) === true)
check('imágenes en el marcado', Array.isArray(group?.image) && group.image.length > 0, String(group?.image?.length))

const sale = await get('/productos/pijama-corto-saten')
const saleGroup = jsonLd(sale.html).find((item) => item['@type'] === 'ProductGroup')
check('precio de oferta 79900', saleGroup?.hasVariant?.[0]?.offers?.price === '79900', String(saleGroup?.hasVariant?.[0]?.offers?.price))

const filtered = await get('/productos?categoria=mujer&orden=novedades')
check('filtros noindex', meta(filtered.html, 'robots')?.includes('noindex') === true, meta(filtered.html, 'robots') ?? '')
check('filtros canonical sin consulta', canonical(filtered.html)?.includes('?') === false, canonical(filtered.html) ?? '')

const search = await get('/buscar?q=pijama')
check('búsqueda noindex', meta(search.html, 'robots')?.includes('noindex') === true)

const cart = await get('/carrito')
check('carrito noindex', meta(cart.html, 'robots')?.includes('noindex') === true, meta(cart.html, 'robots') ?? 'sin meta')

const faq = await get('/preguntas-frecuentes')
const faqLd = jsonLd(faq.html).find((item) => item['@type'] === 'FAQPage')
check('FAQPage', Boolean(faqLd))
check('FAQ con respuesta', Boolean(faqLd?.mainEntity?.[0]?.acceptedAnswer?.text))

const missing = await get('/esta-pagina-no-existe')
check('404 real', missing.status === 404, String(missing.status))

const catalog = await get('/productos')
check('catálogo con segunda imagen de la bata', (catalog.html.match(/bata/g) || []).length >= 2)

console.info(failures.length === 0 ? '\nSEO local: sin fallos' : `\nFallos: ${failures.join(', ')}`)
process.exit(failures.length === 0 ? 0 : 1)
