'use client'

import { Accordion as AccordionPrimitive } from 'radix-ui'

export function Accordion({
  items,
}: {
  items: { id: string; title: string; text: string }[]
}) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="space-y-3">
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.id} value={item.id} className="rounded-md bg-white shadow-card">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="flex min-h-11 w-full items-center px-4 text-left font-semibold">
              {item.title}
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="px-4 pb-4 text-ink-600">{item.text}</AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
