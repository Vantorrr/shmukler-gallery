'use client'

import { useState } from 'react'
import { CheckoutModal } from '@/components/CheckoutModal'

interface PurchaseButtonProps {
  artwork: {
    _id: string
    title: string
    price: number
    mainImage: any
  }
}

export function PurchaseButton({ artwork }: PurchaseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-black text-white py-4 px-8 uppercase tracking-widest text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Add to Cart
      </button>

      {isModalOpen && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          artwork={artwork}
        />
      )}
    </>
  )
}
