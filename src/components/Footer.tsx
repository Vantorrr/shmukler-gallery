'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const CONTACT_DEFAULTS = {
  contact_address: 'Большой Краснопрудный тупик, 8/12\nМосква, Россия',
  contact_phone: '8 989 591 91 12',
  contact_email: 'info@artishokcenter.ru',
  contact_instagram: 'https://www.youtube.com/@shmuklergallery',
  contact_telegram: 'https://t.me/shmuklergallery',
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [info, setInfo] = useState(CONTACT_DEFAULTS)

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => setInfo(prev => ({ ...prev, ...d })))
      .catch(() => {})
  }, [])

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { alert('Необходимо дать согласие на рассылку'); return }
    setSending(true)
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscribe', name, email }),
      })
      setSent(true)
    } catch {
      alert('Ошибка. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  return (
    <footer className="w-full bg-white pt-20 pb-10 px-6 md:px-12 border-t border-gray-100 mt-auto">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

        <div className="md:col-span-4 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Подписка на рассылку</h4>
          {sent ? (
            <p className="text-sm text-gray-500">Спасибо за подписку!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 max-w-sm">
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
              />
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-black flex-shrink-0" />
                <span className="text-xs text-gray-400 leading-relaxed">
                  Согласен(а) на{' '}
                  <Link href="/privacy-newsletter" className="underline hover:text-black">обработку персональных данных подписчиков на рассылки</Link>
                </span>
              </label>
              <button type="submit" className="text-xs uppercase tracking-[0.2em] text-left hover:opacity-50 transition-opacity self-start border-b border-black pb-1">
                Подписаться
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-2 md:col-start-5 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Меню</h4>
          <ul className="space-y-3 text-sm font-light text-gray-600">
            <li><Link href="/gallery" className="hover:text-black transition-colors">Каталог</Link></li>
            <li><Link href="/artists" className="hover:text-black transition-colors">Художники</Link></li>
            <li><Link href="/exhibitions" className="hover:text-black transition-colors">Выставки</Link></li>
            <li><Link href="/events" className="hover:text-black transition-colors">Мероприятия</Link></li>
            <li><Link href="/fairs" className="hover:text-black transition-colors">Ярмарки</Link></li>
            <li><Link href="/services" className="hover:text-black transition-colors">Услуги</Link></li>
            <li><Link href="/about" className="hover:text-black transition-colors">О нас</Link></li>
            <li><Link href="/contact" className="hover:text-black transition-colors">Контакты</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Галерея</h4>
          <div className="space-y-4 text-sm font-light leading-relaxed text-gray-600">
            {info.contact_address && (
              <p className="whitespace-pre-line">{info.contact_address}</p>
            )}
            <p>
              {info.contact_email && (
                <><a href={`mailto:${info.contact_email}`} className="hover:text-black transition-colors">{info.contact_email}</a><br /></>
              )}
              {info.contact_phone && (
                <a href={`tel:+7${info.contact_phone.replace(/\D/g, '').replace(/^[87]/, '')}`} className="hover:text-black transition-colors">{info.contact_phone}</a>
              )}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Соцсети</h4>
          <ul className="space-y-3 text-sm font-light text-gray-600">
            {info.contact_instagram && (
              <li><a href={info.contact_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">YouTube</a></li>
            )}
            {info.contact_telegram && (
              <li><a href={info.contact_telegram} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Telegram</a></li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] uppercase tracking-widest text-gray-400 gap-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Шмуклер Галерея" width={100} height={40} className="h-8 w-auto object-contain opacity-60" />
            <p>&copy; {new Date().getFullYear()}</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/offer" className="hover:text-black transition-colors">Публичная оферта</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Политика конфиденциальности</Link>
            <Link href="/consent" className="hover:text-black transition-colors">Согласие на обработку ПДн</Link>
            <Link href="/privacy-newsletter" className="hover:text-black transition-colors">Согласие подписчиков</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
