import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

const styles = {
  primary: 'bg-plum-700 text-white hover:bg-plum-800',
  secondary: 'border border-plum-700 text-plum-700 hover:bg-plum-100',
  ghost: 'text-ink-900 hover:bg-cream-100',
} as const

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles
  children: ReactNode
}) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string
  variant?: keyof typeof styles
  className?: string
  children: ReactNode
}) {
  const external = href.startsWith('http')
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold',
        styles[variant],
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </Link>
  )
}
