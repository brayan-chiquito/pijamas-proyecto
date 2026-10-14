import {
  buildProductInquiryMessage,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  DEFAULT_GREETING,
  isValidWhatsAppPhone,
  normalizeWhatsAppPhone,
  renderTemplate,
  type WhatsAppOrderInput,
} from './whatsapp'

describe('normalizeWhatsAppPhone', () => {
  it('elimina símbolos y deja solo dígitos con indicativo', () => {
    expect(normalizeWhatsAppPhone('+57 300 111-2233')).toBe('573001112233')
    expect(normalizeWhatsAppPhone('(57) 300.111.2233')).toBe('573001112233')
    expect(normalizeWhatsAppPhone('00573001112233')).toBe('573001112233')
  })

  it('rechaza números inválidos', () => {
    expect(() => normalizeWhatsAppPhone('300-ABC-1122')).toThrow(/dígitos/)
    expect(() => normalizeWhatsAppPhone('03001112233')).toThrow(/cero/)
    expect(() => normalizeWhatsAppPhone('1234567')).toThrow(/8 y 15/)
    expect(() => normalizeWhatsAppPhone('1234567890123456')).toThrow(/8 y 15/)
  })

  it('isValidWhatsAppPhone no lanza', () => {
    expect(isValidWhatsAppPhone('+57 300 111 2233')).toBe(true)
    expect(isValidWhatsAppPhone('hola')).toBe(false)
  })
})

describe('buildWhatsAppUrl', () => {
  it('codifica saltos de línea y caracteres especiales', () => {
    const url = buildWhatsAppUrl('573001112233', 'Hola & adiós\n#1 + promo')
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe('https://wa.me/573001112233')
    expect(parsed.searchParams.get('text')).toBe('Hola & adiós\n#1 + promo')
    expect(url).toContain('%0A')
    expect(url).toContain('%26')
  })

  it('omite el parámetro text si el mensaje está vacío', () => {
    expect(buildWhatsAppUrl('573001112233', '   ')).toBe('https://wa.me/573001112233')
  })
})

describe('buildWhatsAppMessage', () => {
  const order: WhatsAppOrderInput = {
    storeName: 'Casa Pijama',
    greeting: DEFAULT_GREETING,
    currency: 'COP',
    locale: 'es-CO',
    total: 119800,
    customer: { name: 'Ana', city: 'Medellín', note: 'Entregar en la tarde' },
    lines: [
      {
        title: 'Pijama largo',
        variantLabel: 'Talla M · Rosa',
        quantity: 2,
        unitPrice: 59900,
        lineTotal: 119800,
        url: 'https://tienda.test/productos/pijama-largo',
      },
    ],
  }

  it('incluye saludo, línea, total y datos del cliente sin afirmar confirmación', () => {
    const message = buildWhatsAppMessage(order)
    expect(message).toContain('Hola Casa Pijama, soy Ana')
    expect(message).toContain('1. Pijama largo (Talla M · Rosa)')
    expect(message).toContain('2 ×')
    expect(message).toContain('Total estimado:')
    expect(message).toContain('Ciudad/zona: Medellín')
    expect(message).toContain('Nota: Entregar en la tarde')
    expect(message).toContain('https://tienda.test/productos/pijama-largo')
    expect(message.toLowerCase()).not.toContain('pedido confirmado')
  })

  it('omite ciudad y nota cuando no existen y usa el saludo por defecto', () => {
    const message = buildWhatsAppMessage({
      ...order,
      greeting: '  ',
      customer: { name: 'Ana', city: '  ', note: null },
    })
    expect(message).toContain('Hola Casa Pijama, soy Ana')
    expect(message).not.toContain('Ciudad/zona')
    expect(message).not.toContain('Nota:')
  })

  it('rechaza pedido vacío o sin nombre', () => {
    expect(() => buildWhatsAppMessage({ ...order, lines: [] })).toThrow(/sin productos/)
    expect(() => buildWhatsAppMessage({ ...order, customer: { name: '  ' } })).toThrow(/nombre/)
  })

  it('conserva caracteres especiales para que la URL los codifique', () => {
    const message = buildWhatsAppMessage({
      ...order,
      customer: { name: 'Ana & Luis', note: 'Talla #1 + regalo' },
    })
    expect(message).toContain('Ana & Luis')
    expect(message).toContain('#1 + regalo')
    const url = buildWhatsAppUrl('573001112233', message)
    expect(new URL(url).searchParams.get('text')).toBe(message)
  })
})

describe('plantillas y consulta de producto', () => {
  it('renderTemplate sustituye variables conocidas', () => {
    expect(renderTemplate('Hola {{ nombre }}', { nombre: 'Ana' })).toBe('Hola Ana')
    expect(renderTemplate('{{desconocido}}', {})).toBe('{{desconocido}}')
  })

  it('buildProductInquiryMessage incluye variante y url cuando existen', () => {
    expect(
      buildProductInquiryMessage({
        storeName: 'Casa Pijama',
        productTitle: 'Pijama largo',
        variantLabel: 'M',
        url: 'https://tienda.test/productos/pijama-largo',
      }),
    ).toBe(
      'Hola Casa Pijama, quiero información sobre: Pijama largo (M)\nhttps://tienda.test/productos/pijama-largo',
    )
  })
})
