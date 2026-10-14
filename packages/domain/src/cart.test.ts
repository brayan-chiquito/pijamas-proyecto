import {
  addCartLine,
  applyRevalidation,
  clampQuantity,
  computeCartTotals,
  makeCartLineId,
  MAX_CART_LINES,
  MAX_LINE_QUANTITY,
  removeCartLine,
  updateCartLineQuantity,
  type CartLine,
} from './cart'

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: 'p1',
    productId: 'p1',
    productSlug: 'pijama-rosa',
    title: 'Pijama rosa',
    variantId: null,
    variantLabel: null,
    unitPrice: 59900,
    compareAtPrice: null,
    quantity: 1,
    imageUrl: null,
    imageAlt: null,
    maxQuantity: null,
    ...overrides,
  }
}

describe('makeCartLineId', () => {
  it('distingue producto solo y producto con variante', () => {
    expect(makeCartLineId('p1')).toBe('p1')
    expect(makeCartLineId('p1', 'v2')).toBe('p1:v2')
    expect(makeCartLineId('p1', null)).toBe('p1')
  })
})

describe('clampQuantity', () => {
  it('limita al máximo de línea y al máximo de existencias', () => {
    expect(clampQuantity(200)).toBe(MAX_LINE_QUANTITY)
    expect(clampQuantity(5, 2)).toBe(2)
    expect(clampQuantity(0)).toBe(0)
    expect(clampQuantity(2.9)).toBe(2)
    expect(clampQuantity(Number.NaN)).toBe(1)
  })
})

describe('computeCartTotals', () => {
  it('suma cantidades y subtotales enteros', () => {
    const totals = computeCartTotals([
      line({ id: 'a', unitPrice: 59900, quantity: 2 }),
      line({ id: 'b', unitPrice: 49900, quantity: 1 }),
    ])
    expect(totals.itemCount).toBe(3)
    expect(totals.subtotal).toBe(59900 * 2 + 49900)
    expect(totals.lines).toEqual([
      { id: 'a', lineTotal: 119800 },
      { id: 'b', lineTotal: 49900 },
    ])
  })

  it('carrito vacío suma cero', () => {
    expect(computeCartTotals([])).toEqual({ subtotal: 0, itemCount: 0, lines: [] })
  })
})

describe('addCartLine', () => {
  it('suma cantidades de la misma variante y respeta el máximo', () => {
    const first = addCartLine([], line({ quantity: 2, maxQuantity: 3 }))
    const second = addCartLine(first, line({ quantity: 2, maxQuantity: 3, title: 'Actualizado' }))
    expect(second).toHaveLength(1)
    expect(second[0]?.quantity).toBe(3)
    expect(second[0]?.title).toBe('Actualizado')
  })

  it('crea líneas distintas para variantes distintas', () => {
    const next = addCartLine(
      [line({ id: 'p1:s', variantId: 's' })],
      line({ id: 'p1:m', variantId: 'm' }),
    )
    expect(next).toHaveLength(2)
  })

  it('no agrega una línea con cantidad 0', () => {
    expect(addCartLine([], line({ quantity: 0, maxQuantity: 0 }))).toHaveLength(0)
  })

  it('rechaza superar el máximo de productos distintos', () => {
    const lines = Array.from({ length: MAX_CART_LINES }, (_, index) =>
      line({ id: `p${index}`, productId: `p${index}` }),
    )
    expect(() => addCartLine(lines, line({ id: 'nuevo', productId: 'nuevo' }))).toThrow(RangeError)
  })
})

describe('updateCartLineQuantity y removeCartLine', () => {
  it('cantidad 0 elimina la línea', () => {
    const next = updateCartLineQuantity([line({ quantity: 2 })], 'p1', 0)
    expect(next).toHaveLength(0)
  })

  it('respeta el máximo de existencias al actualizar', () => {
    const next = updateCartLineQuantity([line({ quantity: 1, maxQuantity: 4 })], 'p1', 9)
    expect(next[0]?.quantity).toBe(4)
  })

  it('removeCartLine elimina solo la línea indicada', () => {
    const next = removeCartLine([line({ id: 'a' }), line({ id: 'b' })], 'a')
    expect(next.map((item) => item.id)).toEqual(['b'])
  })
})

describe('applyRevalidation', () => {
  it('actualiza precios, reduce cantidades y elimina líneas retiradas', () => {
    const current = [
      line({ id: 'a', unitPrice: 100 }),
      line({ id: 'b', quantity: 3 }),
      line({ id: 'c' }),
    ]
    const next = applyRevalidation(current, [
      {
        id: 'a',
        status: 'price_changed',
        previousUnitPrice: 100,
        line: line({ id: 'a', unitPrice: 120 }),
      },
      {
        id: 'b',
        status: 'quantity_reduced',
        line: line({ id: 'b', quantity: 1, maxQuantity: 1 }),
      },
      { id: 'c', status: 'removed', line: null },
    ])
    expect(next.map((item) => item.id)).toEqual(['a', 'b'])
    expect(next[0]?.unitPrice).toBe(120)
    expect(next[1]?.quantity).toBe(1)
  })

  it('conserva líneas sin resultado de revalidación', () => {
    expect(applyRevalidation([line()], []).map((item) => item.id)).toEqual(['p1'])
  })
})
