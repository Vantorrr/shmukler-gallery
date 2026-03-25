'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ShoppingBag, Trash2, MapPin } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

const DELIVERY_OPTIONS = [
  { key: 'pickup', label: 'Самовывоз — бесплатно', price: 0 },
  { key: 'courier', label: 'Доставка курьером — индивидуально', price: null },
  { key: 'cdek', label: 'Доставка СДЭК — выбрать адрес/ПВЗ', price: null },
  { key: 'other', label: 'Другой способ доставки', price: null },
]

interface CdekInfo {
  address: string
  price: number
  type: string
}

function CdekModal({ onClose, onSelect }: {
  onClose: () => void
  onSelect: (info: CdekInfo) => void
}) {
  const onSelectRef = useRef(onSelect)
  const onCloseRef = useRef(onClose)
  onSelectRef.current = onSelect
  onCloseRef.current = onClose
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // Fetch Yandex Maps key from server (works regardless of build time)
        const cfg = await fetch('/api/cdek-config').then(r => r.json())
        const apiKey: string = cfg.apiKey || ''
        if (!apiKey) {
          setErrorMsg('Ключ Яндекс Карт не настроен. Добавьте NEXT_PUBLIC_YANDEX_MAPS_KEY в Railway.')
          setStatus('error')
          return
        }

        // Load CDEK widget script if not already loaded
        await new Promise<void>((resolve, reject) => {
          if ((window as unknown as Record<string, unknown>).CDEKWidget) { resolve(); return }
          const existing = document.getElementById('cdek-widget-script')
          if (existing) { existing.addEventListener('load', () => resolve()); return }
          const s = document.createElement('script')
          s.id = 'cdek-widget-script'
          s.src = 'https://cdn.jsdelivr.net/npm/@cdek-it/widget@3'
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Не удалось загрузить скрипт СДЭК'))
          document.head.appendChild(s)
        })

        if (cancelled) return

        const W = (window as unknown as Record<string, unknown>).CDEKWidget as (new (opts: unknown) => void) | undefined
        if (!W) throw new Error('CDEKWidget не найден после загрузки скрипта')

        new W({
          from: { country_code: 'RU', city: 'Москва', postal_code: 107140, address: 'Большой Краснопрудный тупик, 8/12' },
          root: 'cdek-widget-root',
          apiKey,
          canChoose: true,
          servicePath: '/api/cdek-service',
          defaultLocation: 'Москва',
          lang: 'rus',
          currency: 'RUB',
          goods: [{ weight: 2000, length: 50, width: 50, height: 10 }],
          tariffs: {
            office: [234, 136, 138],
            door: [233, 137, 139],
          },
          onReady: () => {
            if (!cancelled) setStatus('ready')
          },
          onChoose: (mode: string, tariff: Record<string, unknown>, address: Record<string, unknown>) => {
            console.log('[CDEK onChoose]', mode, tariff, address)
            const addr = (address.address as string)
              || (address.formatted as string)
              || (address.name as string)
              || (address.city as string)
              || ''
            const price = (tariff.delivery_sum as number) || 0
            const type = mode === 'door' ? 'Курьер' : 'ПВЗ'
            onSelectRef.current({ address: addr, price, type })
            onCloseRef.current()
          },
        })
        // Fallback: show widget after 5s even if onReady doesn't fire
        setTimeout(() => { if (!cancelled) setStatus('ready') }, 5000)
      } catch (e) {
        if (!cancelled) {
          setErrorMsg(e instanceof Error ? e.message : 'Ошибка загрузки виджета СДЭК')
          setStatus('error')
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0" style={{ height: 65 }}>
        <h3 className="font-medium text-base">Выбор пункта доставки СДЭК</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 relative">
        {/* Widget container — always in DOM so the widget can render into it */}
        <div id="cdek-widget-root" style={{ width: '100%', height: 'calc(100vh - 65px)' }} />

        {/* Loading overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Загрузка карты СДЭК...</p>
          </div>
        )}

        {/* Error overlay */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center bg-white">
            <p className="text-sm text-red-500">{errorMsg}</p>
            <button onClick={onClose} className="text-sm underline text-gray-500 hover:text-black">Закрыть</button>
          </div>
        )}
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { items, count, remove, clear } = useCart()
  const [open, setOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [delivery, setDelivery] = useState('pickup')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', comment: '', consent: false })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [cdekInfo, setCdekInfo] = useState<CdekInfo | null>(null)
  const [showCdekModal, setShowCdekModal] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  // Reset cdek info when switching away from cdek
  useEffect(() => {
    if (delivery !== 'cdek') setCdekInfo(null)
  }, [delivery])

  const subtotal = items.reduce((s, i) => s + (i.price || 0), 0)
  const cdekDeliveryPrice = delivery === 'cdek' && cdekInfo ? cdekInfo.price : null
  const fixedDeliveryPrice = DELIVERY_OPTIONS.find(o => o.key === delivery)?.price ?? null
  const deliveryPrice = fixedDeliveryPrice ?? cdekDeliveryPrice ?? 0
  const deliveryIndividual = fixedDeliveryPrice === null && cdekDeliveryPrice === null
  const total = subtotal + deliveryPrice

  const handleCdekSelect = useCallback((info: CdekInfo) => {
    setCdekInfo(info)
    setShowCdekModal(false)
  }, [])

  async function callPaymentAPI(paymentMethod: 'card' | 'split') {
    if (!form.consent) { alert('Необходимо дать согласие на обработку персональных данных'); return false }
    if (delivery === 'cdek' && !cdekInfo) { alert('Пожалуйста, выберите пункт доставки СДЭК'); return false }
    setSending(true)
    try {
      const itemsSummary = items.map(i => `${i.title} (${i.price?.toLocaleString() ?? '—'} ₽)`).join('; ')
      const deliveryLabel = delivery === 'cdek' && cdekInfo
        ? `СДЭК (${cdekInfo.type}): ${cdekInfo.address}`
        : (DELIVERY_OPTIONS.find(o => o.key === delivery)?.label ?? delivery)
      const amount = subtotal + (cdekDeliveryPrice ?? 0)

      const endpoint = paymentMethod === 'split' ? '/api/yandex-pay' : '/api/lifepay'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          delivery: deliveryLabel, address: form.address || (cdekInfo?.address ?? ''),
          comment: form.comment || '', items: itemsSummary, amount,
          deliveryPrice: cdekDeliveryPrice ?? 0,
          paymentMethod,
        }),
      })
      const data = await res.json()
      if (data.ok && data.payUrl) {
        clear()
        window.location.href = data.payUrl
        return true
      }
      const errMsg = data.error || 'Ошибка платёжной системы'
      alert(`Не удалось создать платёж: ${errMsg}\n\nСвяжитесь с нами:\ninfo@artishokcenter.ru\n8 989 591 91 12`)
      return false
    } catch {
      alert('Ошибка соединения. Попробуйте ещё раз или свяжитесь с нами:\ninfo@artishokcenter.ru\n8 989 591 91 12')
      return false
    } finally {
      setSending(false)
    }
  }

  async function handleSplitPay() {
    if (!form.name || !form.email || !form.phone) {
      alert('Пожалуйста, заполните имя, email и телефон')
      return
    }
    await callPaymentAPI('split')
  }

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault()
    await callPaymentAPI('card')
  }

  return (
    <>
      {showCdekModal && (
        <CdekModal
          onClose={() => setShowCdekModal(false)}
          onSelect={handleCdekSelect}
        />
      )}

      <button
        onClick={() => setOpen(true)}
        className="relative p-1 text-black hover:opacity-70 transition-opacity"
        aria-label="Корзина"
      >
        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-stretch justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setCheckout(false) }} />
          <div className="relative z-10 w-full max-w-md bg-white shadow-2xl flex flex-col" style={{ height: '100dvh', maxHeight: '100vh' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-medium">Корзина {count > 0 && `(${count})`}</h2>
              <button onClick={() => { setOpen(false); setCheckout(false) }}><X className="w-5 h-5" /></button>
            </div>

            {sent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 min-h-0">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Заказ принят!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
                <button onClick={() => { setOpen(false); setSent(false); setCheckout(false) }} className="mt-8 text-sm underline text-gray-500 hover:text-black">Закрыть</button>
              </div>
            ) : !checkout ? (
              <>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                      <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-gray-400 text-sm">Корзина пуста</p>
                      <p className="text-gray-300 text-xs mt-1">Добавьте работы из каталога</p>
                      <Link href="/gallery" onClick={() => setOpen(false)} className="mt-6 text-xs uppercase tracking-widest border-b border-black pb-1">Перейти в каталог</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4 p-5">
                          {item.imagePath && (
                            <div className="bg-gray-50 flex-shrink-0 overflow-hidden" style={{ width: 80, height: 80 }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.imagePath}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.title}</p>
                            {item.artistName && <p className="text-xs text-gray-500 mt-0.5">{item.artistName}</p>}
                            {item.price && <p className="text-sm mt-2">{item.price.toLocaleString()} ₽</p>}
                          </div>
                          <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors self-start">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="border-t border-gray-100 p-6 space-y-4 flex-shrink-0">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Итого</span>
                      <span className="font-medium">{subtotal.toLocaleString()} ₽</span>
                    </div>
                    <button onClick={() => setCheckout(true)} className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors">
                      Оформить заказ
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleOrder} className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1 p-6 space-y-5">
                  <h3 className="text-base font-medium">Оформление заказа</h3>

                  <div className="space-y-3">
                    <input required placeholder="Имя *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                    <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                    <input required type="tel" placeholder="Телефон *" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-gray-400">Способ получения</p>
                    {DELIVERY_OPTIONS.map(opt => (
                      <label key={opt.key} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" value={opt.key} checked={delivery === opt.key} onChange={e => setDelivery(e.target.value)} className="accent-black" />
                          <span className="text-sm">{opt.label}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {opt.key === 'cdek'
                            ? (cdekInfo ? `${cdekInfo.price.toLocaleString()} ₽` : 'выбрать ПВЗ')
                            : opt.price === 0 ? 'бесплатно' : opt.price === null ? 'индивидуально' : `${opt.price.toLocaleString()} ₽`}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* CDEK selector */}
                  {delivery === 'cdek' && (
                    <div className="space-y-2">
                      {cdekInfo ? (
                        <div className="flex items-start gap-2 bg-green-50 rounded p-3">
                          <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-green-700">{cdekInfo.type} СДЭК</p>
                            <p className="text-xs text-green-600 mt-0.5 leading-snug">{cdekInfo.address}</p>
                            <p className="text-xs font-medium text-green-700 mt-1">{cdekInfo.price.toLocaleString()} ₽</p>
                          </div>
                          <button type="button" onClick={() => setShowCdekModal(true)} className="text-xs text-green-700 underline flex-shrink-0">
                            Изменить
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCdekModal(true)}
                          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2.5 text-sm hover:border-black transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          Выбрать пункт доставки СДЭК
                        </button>
                      )}
                    </div>
                  )}

                  {delivery !== 'pickup' && delivery !== 'cdek' && (
                    <input placeholder="Адрес доставки" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                  )}

                  <textarea placeholder="Комментарий" value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} rows={2} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black resize-none" />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.consent} onChange={e => setForm(p => ({ ...p, consent: e.target.checked }))} className="mt-0.5 accent-black" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      Согласен(а) на <Link href="/privacy" className="underline hover:text-black">обработку персональных данных</Link>
                    </span>
                  </label>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Работы</span>
                      <span>{subtotal.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Доставка</span>
                      <span>
                        {delivery === 'cdek' && cdekInfo
                          ? `${cdekInfo.price.toLocaleString()} ₽`
                          : deliveryIndividual ? 'индивидуально' : deliveryPrice === 0 ? 'бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Итого</span>
                      <span>{total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3 border-t border-gray-100">
                  <button type="submit" disabled={sending} className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50">
                    {sending ? 'Отправка...' : 'Оплатить'}
                  </button>
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => handleSplitPay()}
                    className="w-full border border-[#FC3F1D] text-[#FC3F1D] py-3 text-sm uppercase tracking-widest hover:bg-[#FC3F1D] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? 'Отправка...' : 'Оплатить через Яндекс Сплит'}
                  </button>
                  <p className="text-center text-xs text-gray-400">Рассрочка на 4 части без переплат</p>
                  <button type="button" onClick={() => setCheckout(false)} className="w-full text-xs text-gray-400 hover:text-black transition-colors">
                    Назад к корзине
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
