'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { RichText } from '@/components/RichText'

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return ''
  if (price === 0) return 'Бесплатно'
  return `${price.toLocaleString('ru-RU')} ₽`
}

function EventCard({ event, autoExpand = false }: { event: any; autoExpand?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isOffline = event.format === 'offline'
  const imageUrl = event.coverImage?.asset?.url || event.coverImage
  const anchorId = event.slug || event.id
  const detailHref = `/events#${anchorId}`

  async function copyLink() {
    const url = `${window.location.origin}${detailHref}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (autoExpand) setExpanded(true)
  }, [autoExpand])

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  function startPressCopy(target: EventTarget | null) {
    const element = target instanceof HTMLElement ? target : null
    if (element?.closest('a, button, input, textarea, select, label')) return
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => {
      void copyLink()
    }, 650)
  }

  function stopPressCopy() {
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current)
      copyTimerRef.current = null
    }
  }

  return (
    <article
      id={anchorId}
      className="border-b border-gray-100 py-10 scroll-mt-40"
      onMouseDown={e => startPressCopy(e.target)}
      onMouseUp={stopPressCopy}
      onMouseLeave={stopPressCopy}
      onTouchStart={e => startPressCopy(e.target)}
      onTouchEnd={stopPressCopy}
      onTouchCancel={stopPressCopy}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
        {imageUrl && (
          <div className="md:col-span-2 lg:col-span-2">
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Image src={imageUrl} alt={event.title} fill className="object-cover" sizes="120px" />
            </div>
          </div>
        )}

        <div className={imageUrl ? 'md:col-span-10 lg:col-span-10' : 'md:col-span-12'}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <a href={detailHref} className="flex-1 block hover:opacity-70 transition-opacity">
              {event.date && (
                <p className="text-2xl md:text-3xl font-serif mb-1 text-black">
                  {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </p>
              )}
              {event.time && (
                <p className="text-lg font-medium text-gray-700 mb-3">{event.time}{event.endTime ? ` — ${event.endTime}` : ''}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${isOffline ? 'border-black text-black' : 'border-blue-400 text-blue-600'}`}>
                  {isOffline ? 'Офлайн' : 'Онлайн'}
                </span>
                {event.type && <span className="text-[10px] uppercase tracking-widest text-gray-400">{event.type}</span>}
                {event.price !== null && event.price !== undefined && (
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">{formatPrice(event.price)}</span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-serif mb-2">{event.title}</h2>
              {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
            </a>

            <div className="flex-shrink-0 flex items-center gap-2">
              {isOffline ? (
                <a
                  href={event.ticketUrl || event.registrationUrl || detailHref}
                  target={event.ticketUrl || event.registrationUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors whitespace-nowrap"
                >
                  {event.ticketUrl ? 'Купить билет' : 'Зарегистрироваться'}
                </a>
              ) : (
                <a
                  href={event.accessUrl || detailHref}
                  target={event.accessUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-block border border-black px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                >
                  Получить доступ
                </a>
              )}
            </div>
          </div>

          {event.description && (
            <div className="mt-4">
              <button
                onClick={() => setExpanded(o => !o)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Подробнее
              </button>
              {expanded && (
                <RichText text={event.description} className="mt-3 text-sm text-gray-600 font-light" />
              )}
            </div>
          )}

          {copied && (
            <p className="mt-4 text-[11px] uppercase tracking-widest text-gray-400">
              Ссылка скопирована
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeHash, setActiveHash] = useState('')

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setEvents(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function syncHash() {
      setActiveHash(window.location.hash.replace(/^#/, ''))
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    if (!activeHash || events.length === 0) return
    const timer = window.setTimeout(() => {
      const element = document.getElementById(activeHash)
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)

    return () => window.clearTimeout(timer)
  }, [activeHash, events])

  const offline = events.filter(e => e.format === 'offline')
  const online = events.filter(e => e.format !== 'offline')

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif mb-20">Мероприятия</h1>

        {loading ? (
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse border-b border-gray-100 pb-10">
                <div className="h-8 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {offline.length > 0 && (
              <section className="mb-16">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2 pb-4 border-b border-gray-100">Офлайн</h2>
                {offline.map(event => <EventCard key={event.id} event={event} autoExpand={activeHash === (event.slug || event.id)} />)}
              </section>
            )}

            {online.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2 pb-4 border-b border-gray-100">Онлайн</h2>
                {online.map(event => <EventCard key={event.id} event={event} autoExpand={activeHash === (event.slug || event.id)} />)}
              </section>
            )}

            {events.length === 0 && (
              <p className="text-center text-gray-400 py-24">Мероприятия не найдены</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
