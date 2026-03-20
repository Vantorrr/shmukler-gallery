'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form }),
      })
      setSent(true)
    } catch {
      alert('Ошибка при отправке. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif mb-24">Контакты</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Контактная информация */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Адрес</h2>
              <p className="text-lg font-light leading-relaxed">Большой Краснопрудный тупик, 8/12<br />Москва, Россия</p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Часы работы</h2>
              <p className="text-lg font-light leading-relaxed">
                Вт–Пт: 12:00–20:00<br />
                Сб–Вс: 12:00–19:00<br />
                Пн: выходной
              </p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Телефон</h2>
              <a href="tel:+78989591912" className="text-lg font-light hover:opacity-60 transition-opacity">
                8 989 591 91 12
              </a>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Email</h2>
              <a href="mailto:info@artishokcenter.ru" className="text-lg font-light hover:opacity-60 transition-opacity">
                info@artishokcenter.ru
              </a>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Социальные сети</h2>
              <div className="space-y-2 text-lg font-light">
                <p><a href="https://www.instagram.com/shmukler_gallery" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Instagram</a></p>
                <p><a href="https://t.me/shmuklergallery" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Telegram</a></p>
              </div>
            </div>
          </div>

          {/* Форма */}
          {sent ? (
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-serif mb-3">Спасибо за сообщение!</p>
                <p className="text-gray-500 font-light">Мы свяжемся с вами в ближайшее время.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-xs underline text-gray-400 hover:text-black">Отправить ещё одно</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <p className="text-lg font-light text-gray-600 pb-2">
                Оставьте свой запрос и мы свяжемся с вами в ближайшее время.
              </p>
              <div>
                <input type="text" name="name" placeholder="Имя" value={form.name} onChange={handleChange} required className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-300" />
              </div>
              <div>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-300" />
              </div>
              <div>
                <input type="tel" name="phone" placeholder="Телефон" value={form.phone} onChange={handleChange} className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-300" />
              </div>
              <div>
                <textarea name="message" placeholder="Сообщение" rows={5} value={form.message} onChange={handleChange} required className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-300 resize-none" />
              </div>
              <button type="submit" disabled={sending} className="bg-black text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50">
                {sending ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          )}
        </div>

        <div className="pt-16 border-t border-gray-100">
          <p className="text-sm text-gray-400 font-light">
            ИП Шмуклер Ольга Александровна<br />
            ИНН 771370805407
          </p>
        </div>
      </div>
    </div>
  )
}
