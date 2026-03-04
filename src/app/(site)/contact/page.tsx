'use client'

import { useState } from 'react'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic can be added here
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Heading */}
        <div className="pb-10 mb-16">
          <ScrollReveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Связь</p>
            <h1 className="font-serif italic leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              Контакты
            </h1>
          </ScrollReveal>
        </div>

        {/* Two-column layout */}
        <ScrollReveal delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Left: Address & Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Адрес
              </h2>
              <p className="text-lg font-light">
                Новослободская 45Б
                <br />
                Москва
              </p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Часы работы
              </h2>
              <p className="text-lg font-light">
                Вт–Пт: 12:00–20:00
                <br />
                Сб–Вс: 12:00–19:00
                <br />
                Пн: выходной
              </p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Телефон
              </h2>
              <a
                href="tel:+79895919112"
                className="text-lg font-light hover:opacity-60 transition-opacity"
              >
                +7 989 59 19 112
              </a>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Email
              </h2>
              <a
                href="mailto:info@artishokcenter.ru"
                className="text-lg font-light hover:opacity-60 transition-opacity"
              >
                info@artishokcenter.ru
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="sr-only">
                Имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Имя"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Сообщение
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Сообщение"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-400 resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-8 py-4 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              Отправить
            </button>
          </form>
        </div>
        </ScrollReveal>

        {/* Legal info */}
        <div className="pt-16 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-light">
            ИП Шмуклер Ольга Александровна
            <br />
            ИНН 771370805407
          </p>
        </div>
      </div>
    </div>
  )
}
