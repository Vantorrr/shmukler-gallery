'use client'

import { useState } from 'react'

export function DeliveryModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="underline underline-offset-2 hover:opacity-60 transition-opacity"
      >
        Доставка по России.
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 flex items-end md:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md p-8 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="font-serif text-xl">Доставка</h2>
              <button onClick={() => setOpen(false)} className="text-black/30 hover:text-black text-lg leading-none">✕</button>
            </div>

            <div className="space-y-4 text-sm font-light text-black/70">
              <div className="border-b border-gray-100 pb-4">
                <p className="font-medium text-black mb-1">Курьером по Москве</p>
                <p>1–2 рабочих дня · от 500 ₽</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="font-medium text-black mb-1">СДЭК / Boxberry</p>
                <p>3–7 дней · от 800 ₽ (зависит от региона и габаритов)</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="font-medium text-black mb-1">Самовывоз из галереи</p>
                <p>Новослободская 45Б, Москва · Бесплатно</p>
              </div>
              <div>
                <p className="font-medium text-black mb-1">Крупные форматы и скульптура</p>
                <p>Специализированная доставка. Стоимость рассчитывается индивидуально.</p>
              </div>
            </div>

            <p className="text-xs text-black/40">
              Точная стоимость доставки будет указана при оформлении заказа.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
