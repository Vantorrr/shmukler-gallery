'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { clsx } from 'clsx'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    imagePath: null,
    title: 'Шмуклер Галерея',
    subtitle: 'Современное искусство в Москве',
    linkUrl: '/gallery',
  },
]

export function HeroSlider() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/hero-slides')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data)
        } else {
          setSlides(FALLBACK_SLIDES)
        }
      })
      .catch(() => setSlides(FALLBACK_SLIDES))
  }, [])

  const list = slides.length ? slides : FALLBACK_SLIDES

  useEffect(() => {
    if (list.length < 2) return
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % list.length), 6000)
    return () => clearInterval(timer)
  }, [list.length])

  const prev = useCallback(() => setCurrent(c => (c - 1 + list.length) % list.length), [list.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % list.length), [list.length])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div
      className="relative h-[90vh] w-full overflow-hidden bg-gray-900 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {list.map((slide, index) => (
        <div
          key={slide.id}
          className={clsx(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            index === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          {slide.imagePath && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slide.imagePath}
              alt={slide.title || ''}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          {/* Centered logo — always visible, no subtitle here */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <Image
              src="/logo-white.png"
              alt="Шмуклер Галерея"
              width={320}
              height={128}
              className="h-20 md:h-28 lg:h-32 w-auto object-contain"
              priority
            />
          </div>

          {/* Slide info — bottom left */}
          {(slide.title || slide.subtitle || slide.linkUrl) && (
            <div className="absolute bottom-16 left-6 md:left-16 text-white max-w-2xl z-20">
              {slide.title && (
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-3 leading-tight">
                  {slide.title}
                </h2>
              )}
              {slide.subtitle && (
                <p className="text-white/75 text-sm md:text-base font-light tracking-wide mb-4">
                  {slide.subtitle}
                </p>
              )}
              {slide.linkUrl && (
                <Link
                  href={slide.linkUrl}
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-70 transition-opacity border-b border-white/60 pb-1"
                >
                  Смотреть <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      ))}

      {list.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/15 hover:bg-white/35 rounded-full items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={next}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/15 hover:bg-white/35 rounded-full items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Следующий слайд"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {list.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {list.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={clsx(
                'w-2 h-2 rounded-full transition-colors focus:outline-none',
                idx === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
              )}
              aria-label={`Слайд ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
