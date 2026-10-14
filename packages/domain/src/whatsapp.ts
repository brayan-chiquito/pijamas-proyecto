import { formatPrice } from './money'

const WHATSAPP_BASE_URL = 'https://wa.me/'
const MIN_PHONE_DIGITS = 8
const MAX_PHONE_DIGITS = 15

/**
 * Normaliza un número al formato que exige WhatsApp click-to-chat: solo dígitos con indicativo
 * de país, sin `+`, espacios, guiones ni paréntesis (Centro de ayuda de WhatsApp).
 * Lanza error con mensaje en español si el resultado no es válido.
 */
export function normalizeWhatsAppPhone(input: string): string {
  const digits = input.replace(/[\s()+\-.]/g, '')
  if (!/^\d+$/.test(digits)) {
    throw new Error(
      'El número de WhatsApp solo puede contener dígitos, espacios, guiones, paréntesis o el signo +',
    )
  }
  if (digits.startsWith('00')) {
    // Prefijo internacional "00" → se elimina (WhatsApp no admite ceros iniciales)
    return normalizeWhatsAppPhone(digits.slice(2))
  }
  if (digits.startsWith('0')) {
    throw new Error(
      'El número de WhatsApp debe incluir el indicativo de país y no puede empezar por cero',
    )
  }
  if (digits.length < MIN_PHONE_DIGITS || digits.length > MAX_PHONE_DIGITS) {
    throw new Error(
      `El número de WhatsApp debe tener entre ${MIN_PHONE_DIGITS} y ${MAX_PHONE_DIGITS} dígitos incluyendo el indicativo de país`,
    )
  }
  return digits
}

export function isValidWhatsAppPhone(input: string): boolean {
  try {
    normalizeWhatsAppPhone(input)
    return true
  } catch {
    return false
  }
}

/** Construye `https://wa.me/<número>?text=<mensaje codificado>`. */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsAppPhone(phone)
  const url = new URL(`${WHATSAPP_BASE_URL}${normalized}`)
  if (message.trim().length > 0) {
    url.searchParams.set('text', message)
  }
  return url.toString()
}

/** Sustituye `{{nombre}}` y `{{tienda}}` en una plantilla de saludo. */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => vars[key] ?? match).trim()
}

export interface WhatsAppOrderLine {
  title: string
  variantLabel: string | null
  quantity: number
  /** Unidad menor. */
  unitPrice: number
  /** Unidad menor. */
  lineTotal: number
  /** URL absoluta del producto, opcional. */
  url?: string | null
}

export interface WhatsAppCustomer {
  name: string
  city?: string | null
  note?: string | null
}

export interface WhatsAppOrderInput {
  storeName: string
  /** Plantilla con `{{nombre}}` y `{{tienda}}`; si está vacía se usa una por defecto. */
  greeting?: string | null
  lines: ReadonlyArray<WhatsAppOrderLine>
  /** Unidad menor. */
  total: number
  currency: string
  locale: string
  customer: WhatsAppCustomer
}

export const DEFAULT_GREETING = 'Hola {{tienda}}, soy {{nombre}} y quiero hacer este pedido:'

/**
 * Mensaje legible del pedido. Texto plano con saltos de línea; la codificación de URL la hace
 * `buildWhatsAppUrl`. No afirma que el pedido esté confirmado.
 */
export function buildWhatsAppMessage(input: WhatsAppOrderInput): string {
  if (input.lines.length === 0) {
    throw new Error('No se puede generar un pedido sin productos')
  }
  const customerName = input.customer.name.trim()
  if (customerName.length === 0) {
    throw new Error('El nombre del cliente es obligatorio para generar el pedido')
  }

  const money = (minorUnits: number) => formatPrice(minorUnits, input.currency, input.locale)
  const greeting = renderTemplate(input.greeting?.trim() || DEFAULT_GREETING, {
    nombre: customerName,
    tienda: input.storeName,
  })

  const parts: string[] = [greeting, '']

  input.lines.forEach((line, index) => {
    const variant = line.variantLabel ? ` (${line.variantLabel})` : ''
    parts.push(`${index + 1}. ${line.title}${variant}`)
    parts.push(`   ${line.quantity} × ${money(line.unitPrice)} = ${money(line.lineTotal)}`)
    if (line.url) parts.push(`   ${line.url}`)
  })

  parts.push('')
  parts.push(`Total estimado: ${money(input.total)}`)
  parts.push('')
  parts.push(`Nombre: ${customerName}`)
  const city = input.customer.city?.trim()
  if (city) parts.push(`Ciudad/zona: ${city}`)
  const note = input.customer.note?.trim()
  if (note) parts.push(`Nota: ${note}`)
  parts.push('')
  parts.push('Quedo atento/a a la confirmación de disponibilidad y del total. ¡Gracias!')

  return parts.join('\n')
}

export interface ProductInquiryInput {
  storeName: string
  productTitle: string
  variantLabel?: string | null
  url?: string | null
}

/** Mensaje corto para el botón "Consultar por WhatsApp" de la ficha de producto. */
export function buildProductInquiryMessage(input: ProductInquiryInput): string {
  const variant = input.variantLabel ? ` (${input.variantLabel})` : ''
  const lines = [
    `Hola ${input.storeName}, quiero información sobre: ${input.productTitle}${variant}`,
  ]
  if (input.url) lines.push(input.url)
  return lines.join('\n')
}
