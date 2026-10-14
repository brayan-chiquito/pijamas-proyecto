import { cn } from '@/lib/cn'

const tones = {
  new: 'bg-rose-100 text-ink-900',
  sale: 'bg-peach-400 text-ink-900',
  soldout: 'bg-red-600 text-white',
  lowstock: 'text-amber-700',
  neutral: 'bg-cream-100 text-ink-600',
} as const

export function Badge({
  tone,
  children,
}: {
  tone: keyof typeof tones
  children: string
}) {
  return (
    <span className={cn('inline-flex rounded-full px-2 py-1 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  )
}
