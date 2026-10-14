'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'

export function Sheet({
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
      <DialogPrimitive.Trigger className="inline-flex min-h-11 items-center rounded-md bg-plum-700 px-5 text-sm font-semibold text-white">
        {trigger}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-ink-900/40" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 w-[min(100%,20rem)] bg-cream-50 p-6 shadow-overlay">
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
