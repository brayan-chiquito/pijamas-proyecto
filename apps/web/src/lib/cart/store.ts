'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  addCartLine,
  computeCartTotals,
  removeCartLine,
  updateCartLineQuantity,
  type CartLine,
} from '@pijamas/domain'

interface CartState {
  lines: CartLine[]
  hydrated: boolean
  add: (line: CartLine) => void
  update: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
  replace: (lines: CartLine[]) => void
  setHydrated: (value: boolean) => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      add: (line) => set((state) => ({ lines: addCartLine(state.lines, line) })),
      update: (id, quantity) =>
        set((state) => ({ lines: updateCartLineQuantity(state.lines, id, quantity) })),
      remove: (id) => set((state) => ({ lines: removeCartLine(state.lines, id) })),
      clear: () => set({ lines: [] }),
      replace: (lines) => set({ lines }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'pijamas-cart-v1',
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export function useCartTotals() {
  const lines = useCart((state) => state.lines)
  return computeCartTotals(lines)
}

export function useCartItemCount() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribe = useCart.subscribe(onStoreChange)
      const unsubscribeHydration = useCart.persist.onFinishHydration(onStoreChange)
      return () => {
        unsubscribe()
        unsubscribeHydration()
      }
    },
    () => (useCart.persist.hasHydrated() ? computeCartTotals(useCart.getState().lines).itemCount : 0),
    () => 0,
  )
}
