'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/gallery',     label: 'Каталог' },
  { href: '/artists',     label: 'Художники' },
  { href: '/exhibitions', label: 'Выставки' },
  { href: '/fairs',       label: 'Ярмарки' },
  { href: '/events',      label: 'Мероприятия' },
  { href: '/services',    label: 'Услуги' },
  { href: '/about',       label: 'О нас' },
  { href: '/contact',     label: 'Контакты' },
]

const LEGAL_LINKS = [
  { href: '/legal/offer',   label: 'Публичная оферта' },
  { href: '/legal/privacy', label: 'Политика конфиденциальности и обработки персональных данных' },
  { href: '/legal/consent', label: 'Согласие на обработку персональных данных' },
  { href: '/legal/consent-newsletter', label: 'Согласие на обработку персональных данных подписчиков на рассылки' },
]

export function Footer() {
  const [form, setForm] = useState({ name: '', surname: '', phone: '', email: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <footer className="w-full bg-white pt-20 pb-10 px-6 md:px-12 border-t border-gray-100 mt-auto">
      <div className="max-w-[1600px] mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

          {/* Newsletter extended */}
          <div className="md:col-span-5 space-y-6">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">Рассылка</h4>
            {sent ? (
              <p className="text-sm font-light text-black/50">Спасибо! Вы подписались на рассылку.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Имя"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={form.surname}
                    onChange={e => setForm(p => ({ ...p, surname: e.target.value }))}
                    className="border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                />
                <button
                  type="submit"
                  className="text-xs uppercase tracking-[0.2em] text-left hover:opacity-50 transition-opacity mt-1"
                >
                  Подписаться →
                </button>
              </form>
            )}
          </div>

          {/* Gallery Info */}
          <div className="md:col-span-3 md:col-start-7 space-y-6">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">Галерея</h4>
            <div className="space-y-4 text-sm font-light leading-relaxed text-black/60">
              <p>Новослободская 45Б<br />Москва</p>
              <p>
                <a href="mailto:info@shmuklergallery.com" className="hover:text-black transition-colors">info@shmuklergallery.com</a><br />
                <a href="tel:+79895919112" className="hover:text-black transition-colors">+7 989 591 91 12</a>
              </p>
              <p className="text-xs text-black/35">
                Вт–Пт: 12:00–20:00<br />
                Сб–Вс: 12:00–19:00<br />
                Пн: выходной
              </p>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">Меню</h4>
            <ul className="space-y-2.5 text-sm font-light text-black/60">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-black transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">Соцсети</h4>
            <ul className="space-y-2.5 text-sm font-light text-black/60">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram</a></li>
              <li><a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Telegram</a></li>
              <li><a href="https://artsy.net" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Artsy</a></li>
            </ul>
          </div>
        </div>

        {/* Legal links */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-widest text-black/30">
              © {new Date().getFullYear()} Shmukler Gallery · ИП Шмуклер Ольга Александровна · ИНН 771370805407
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="text-[10px] text-black/30 hover:text-black transition-colors leading-relaxed">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
