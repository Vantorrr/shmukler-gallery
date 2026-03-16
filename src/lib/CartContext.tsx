'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type CartItem = {
  id: string
  title: string
  artistName?: string
  price?: number
  imagePath?: string
  slug: string
}

type CartCtx = {
  items: CartItem[]
  count: number
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartCtx>({
  items: [], count: 0,
  add: () => {}, remove: () => {}, clear: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) setItems(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const save = useCallback((next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }, [])

  const add = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev
      const next = [...prev, item]
      localStorage.setItem('cart', JSON.stringify(next))
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      localStorage.setItem('cart', JSON.stringify(next))
      return next
    })
  }, [save])

  const clear = useCallback(() => save([]), [save])

  return (
    <CartContext.Provider value={{ items, count: items.length, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
