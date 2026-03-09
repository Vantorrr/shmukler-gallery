'use client'

import { useState } from 'react'

interface Props {
  artwork: {
    title: string
    price?: number
  }
  onClose: () => void
}

export function CheckoutModal({ artwork, onClose }: Props) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', comment: '', consent: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.consent) {
      alert('Пожалуйста, дайте согласие на обработку персональных данных')
      return
    }
    setSubmitted(true)
  }

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-xl">Оформление заказа</h2>
              <p className="text-sm text-black/40 font-light mt-1">{artwork.title}</p>
            </div>
            <button onClick={onClose} className="text-black/30 hover:text-black text-lg leading-none ml-4">✕</button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-2xl">✓</p>
              <p className="font-serif text-xl">Заявка отправлена</p>
              <p className="text-sm text-black/50 font-light">Мы свяжемся с вами в ближайшее время для подтверждения.</p>
              <button
                onClick={onClose}
                className="mt-4 text-[11px] uppercase tracking-widest border-b border-black pb-px hover:opacity-50 transition-opacity"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {artwork.price && (
                <div className="bg-gray-50 p-4 flex justify-between items-center text-sm">
                  <span className="font-light text-black/60">{artwork.title}</span>
                  <span className="font-serif text-lg">{artwork.price.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/40 block mb-1.5">Имя *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/25"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/40 block mb-1.5">Телефон *</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/25"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/40 block mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/25"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/40 block mb-1.5">Адрес доставки</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder="Город, улица, дом, квартира"
                    className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/25"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/40 block mb-1.5">Комментарий</label>
                  <textarea
                    rows={2}
                    value={form.comment}
                    onChange={e => set('comment', e.target.value)}
                    placeholder="Пожелания по упаковке, доставке или другое"
                    className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/25 resize-none"
                  />
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={e => set('consent', e.target.checked)}
                  className="mt-0.5 shrink-0 accent-black"
                />
                <span className="text-xs font-light text-black/50 leading-relaxed">
                  Я даю согласие на обработку персональных данных в соответствии с{' '}
                  <a href="/legal/privacy" className="underline hover:text-black" target="_blank">
                    Политикой конфиденциальности
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-black/80 transition-colors mt-2"
              >
                Отправить заявку
              </button>

              <p className="text-xs text-black/30 text-center font-light">
                Мы свяжемся с вами для подтверждения и оплаты через LifePay
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
