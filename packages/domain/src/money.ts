/**
 * Dinero representado como entero en la unidad menor práctica de cada moneda (ADR-008).
 * Para COP, CLP o PYG la unidad menor práctica es la unidad principal (0 decimales);
 * para USD, EUR, MXN, etc. son los centavos (2 decimales).
 */

export type CurrencyCode = string

const ZERO_DECIMAL_CURRENCIES: ReadonlySet<string> = new Set([
  'COP',
  'CLP',
  'PYG',
  'JPY',
  'KRW',
  'VND',
  'ISK',
  'HUF',
  'UGX',
  'XAF',
  'XOF',
])

const THREE_DECIMAL_CURRENCIES: ReadonlySet<string> = new Set(['BHD', 'JOD', 'KWD', 'OMR', 'TND'])

/** Número de decimales con los que se opera y se muestra la moneda. */
export function getFractionDigits(currency: CurrencyCode): number {
  const code = currency.toUpperCase()
  if (ZERO_DECIMAL_CURRENCIES.has(code)) return 0
  if (THREE_DECIMAL_CURRENCIES.has(code)) return 3
  return 2
}

function assertMinorUnits(value: number, label = 'importe'): void {
  if (!Number.isInteger(value)) {
    throw new TypeError(`El ${label} debe ser un entero en unidad menor; se recibió ${value}`)
  }
  if (value < 0) {
    throw new RangeError(`El ${label} no puede ser negativo; se recibió ${value}`)
  }
}

/** Convierte unidad menor → unidades principales (número decimal). Solo para presentación. */
export function toMajorUnits(minorUnits: number, currency: CurrencyCode): number {
  assertMinorUnits(minorUnits)
  return minorUnits / 10 ** getFractionDigits(currency)
}

/** Convierte un número en unidades principales (p. ej. 39.99) a unidad menor (3999). */
export function fromMajorUnits(amount: number, currency: CurrencyCode): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(`Importe inválido: ${amount}`)
  }
  return Math.round(amount * 10 ** getFractionDigits(currency))
}

/**
 * Representación decimal con punto para datos estructurados (schema.org exige punto decimal).
 * Ej.: 3999 USD → "39.99"; 59900 COP → "59900".
 */
export function toDecimalString(minorUnits: number, currency: CurrencyCode): string {
  assertMinorUnits(minorUnits)
  const digits = getFractionDigits(currency)
  if (digits === 0) return String(minorUnits)
  const whole = Math.floor(minorUnits / 10 ** digits)
  const fraction = String(minorUnits % 10 ** digits).padStart(digits, '0')
  return `${whole}.${fraction}`
}

/** Formatea para mostrar al usuario según moneda y locale, p. ej. "$ 59.900". */
export function formatPrice(minorUnits: number, currency: CurrencyCode, locale: string): string {
  assertMinorUnits(minorUnits)
  const digits = getFractionDigits(currency)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(toMajorUnits(minorUnits, currency))
}

/** Porcentaje de descuento redondeado (0–100) o null si no hay descuento real. */
export function discountPercent(price: number, salePrice: number): number | null {
  assertMinorUnits(price, 'precio')
  assertMinorUnits(salePrice, 'precio promocional')
  if (price === 0 || salePrice >= price) return null
  return Math.round(((price - salePrice) / price) * 100)
}
