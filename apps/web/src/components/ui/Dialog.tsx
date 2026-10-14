'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'

export function Dialog({
  trigger,
  title,
  children,
}: {
  trigger: string
  title: string
  children: ReactNode
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger className="inline-flex min-h-11 items-center rounded-md border border-plum-700 px-5 text-sm font-semibold text-plum-700">
        {trigger}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-ink-900/40 motion-safe:transition-opacity" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 w-[min(100%-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-cream-50 p-6 shadow-overlay">
          <DialogPrimitive.Title className="font-display text-2xl">{title}</DialogPrimitive.Title>
          <div className="mt-3 text-ink-600">{children}</div>
          <DialogPrimitive.Close className="mt-6 inline-flex min-h-11 items-center font-semibold text-plum-700">
            Cerrar
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
