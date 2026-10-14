import { formatPrice } from '@pijamas/domain'

export function Price({
  amount,
  compareAt,
  amountMax,
  currency,
  locale,
}: {
  amount: number
  compareAt?: number | null
  amountMax?: number | null
  currency: string
  locale: string
}) {
  const current = formatPrice(amount, currency, locale)
  if (amountMax && amountMax !== amount) {
    return (
      <p className="text-sm text-ink-900">
        <span className="text-ink-600">Desde </span>
        <span className="font-semibold">{current}</span>
      </p>
    )
  }
  if (compareAt && compareAt > amount) {
    const previous = formatPrice(compareAt, currency, locale)
    return (
      <p className="text-sm">
        <del className="text-ink-600">{previous}</del>{' '}
        <ins className="font-semibold text-plum-700 no-underline">{current}</ins>
      </p>
    )
  }
  return <p className="text-sm font-semibold text-ink-900">{current}</p>
}
