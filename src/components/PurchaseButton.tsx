'use client'

import { useState } from 'react'
import { CheckoutModal } from './CheckoutModal'

interface Props {
  artwork: {
    title: string
    price?: number
    slug: { current: string }
  }
}

export function PurchaseButton({ artwork }: Props) {
  const [inCart,   setInCart]   = useState(false)
  const [checkout, setCheckout] = useState(false)

  const handleAdd = () => {
    setInCart(true)
  }

  return (
    <>
      {!inCart ? (
        <button
          onClick={handleAdd}
          className="w-full bg-black text-white py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-black/80 transition-colors"
        >
          В корзину
        </button>
      ) : (
        <div className="space-y-2">
          <div className="w-full border border-black py-3.5 text-[11px] uppercase tracking-[0.2em] text-center text-black/50">
            ✓ Добавлено в корзину
          </div>
          <button
            onClick={() => setCheckout(true)}
            className="w-full bg-black text-white py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-black/80 transition-colors"
          >
            Оформить заказ
          </button>
        </div>
      )}

      {checkout && (
        <CheckoutModal artwork={artwork} onClose={() => setCheckout(false)} />
      )}
    </>
  )
}
