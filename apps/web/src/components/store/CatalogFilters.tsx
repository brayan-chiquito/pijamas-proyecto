import Link from 'next/link'

import type { CatalogFilters } from '@pijamas/domain'

export function CatalogFilters({
  filters,
  sizes,
  colors,
  categories,
  action,
}: {
  filters: CatalogFilters
  sizes: string[]
  colors: string[]
  categories: { slug: string; title: string }[]
  action: string
}) {
  return (
    <form action={action} className="space-y-6 rounded-md bg-white p-4 shadow-card">
      <fieldset>
        <legend className="text-sm font-semibold">Categoría</legend>
        <div className="mt-2 space-y-2">
          {categories.map((category) => (
            <label key={category.slug} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="categoria"
                value={category.slug}
                defaultChecked={filters.categories.includes(category.slug)}
              />
              {category.title}
            </label>
          ))}
        </div>
      </fieldset>
      {sizes.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold">Talla</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <label key={size} className="min-h-11 min-w-11">
                <input
                  type="checkbox"
                  name="talla"
                  value={size}
                  defaultChecked={filters.sizes.includes(size)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-cream-200 px-3 text-sm peer-checked:border-plum-700 peer-checked:bg-plum-100">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      {colors.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold">Color</legend>
          <div className="mt-2 space-y-2">
            {colors.map((color) => (
              <label key={color} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="color"
                  value={color}
                  defaultChecked={filters.colors.includes(color)}
                />
                {color}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" name="disponible" value="1" defaultChecked={filters.onlyAvailable} />
        Solo disponibles
      </label>
      <label className="block text-sm font-semibold">
        Orden
        <select
          name="orden"
          defaultValue={filters.sort}
          className="mt-2 min-h-11 w-full rounded-sm border border-cream-200 bg-white px-3"
        >
          <option value="novedades">Novedades</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre</option>
        </select>
      </label>
      <button type="submit" className="min-h-11 w-full rounded-md bg-plum-700 px-4 text-sm font-semibold text-white">
        Aplicar filtros
      </button>
      <Link href={action} className="block text-center text-sm text-plum-700">
        Limpiar
      </Link>
    </form>
  )
}

export function Pagination({
  page,
  pageCount,
  path,
}: {
  page: number
  pageCount: number
  path: string
}) {
  if (pageCount <= 1) return null
  return (
    <nav aria-label="Paginación" className="mt-10 flex justify-center gap-2">
      {Array.from({ length: pageCount }, (_, index) => {
        const number = index + 1
        const href = number === 1 ? path : `${path}${path.includes('?') ? '&' : '?'}page=${number}`
        return (
          <Link
            key={number}
            href={href}
            aria-current={number === page ? 'page' : undefined}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-cream-200 aria-[current=page]:bg-plum-700 aria-[current=page]:text-white"
          >
            {number}
          </Link>
        )
      })}
    </nav>
  )
}
