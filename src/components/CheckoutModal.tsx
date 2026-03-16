'use client'

import { useState } from 'react'
import { X, CreditCard, Loader2 } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  artwork: {
    title: string
    price: number
  }
}

export function CheckoutModal({ isOpen, onClose, artwork }: CheckoutModalProps) {
  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePayment = (method: 'lifepay' | 'dolyame') => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert(`Payment successful via ${method}! Thank you for your purchase.`)
      onClose()
      setStep('info')
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-medium uppercase tracking-wide">Checkout</h2>
          <p className="text-sm text-gray-500 mt-1">
            {artwork.title} — ${artwork.price.toLocaleString()}
          </p>
        </div>

        <div className="p-6">
          {step === 'info' ? (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase text-gray-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-gray-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase text-gray-500 mb-1">
                  Shipping Address
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm font-medium hover:bg-gray-800 transition-colors mt-4"
              >
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Select a payment method:</p>
              
              <button
                onClick={() => handlePayment('lifepay')}
                disabled={isLoading}
                className="w-full flex items-center justify-between border border-gray-200 rounded p-4 hover:border-black transition-colors group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                  <span className="font-medium">Credit Card (LifePay)</span>
                </div>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </button>

              <button
                onClick={() => handlePayment('dolyame')}
                disabled={isLoading}
                className="w-full flex items-center justify-between border border-gray-200 rounded p-4 hover:border-black transition-colors group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full" /> {/* Dolyame logo placeholder */}
                  <div className="text-left">
                    <span className="block font-medium">Pay in 4 (Dolyame)</span>
                    <span className="text-xs text-gray-500">4 payments of ${(artwork.price / 4).toLocaleString()}</span>
                  </div>
                </div>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </button>

              <button
                onClick={() => setStep('info')}
                className="text-xs text-gray-500 hover:text-black underline mt-4 block text-center w-full"
              >
                Back to shipping info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
