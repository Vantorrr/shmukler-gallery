'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
// logo-white.png used in hero overlay
import { clsx } from 'clsx'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    imagePath: null,
    title: '',
    subtitle: 'Современное искусство в Москве',
    linkUrl: '/gallery',
  },
]

export function HeroSlider() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

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

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const list = slides.length ? slides : FALLBACK_SLIDES

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-gray-900">

      {list.map((slide, index) => (
        <div
          key={slide.id}
          className={clsx(
            'absolute inset-0 transition-opacity duration-1200 ease-in-out',
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

          {/* Centered logo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <Image
              src="/logo-white.png"
              alt="Шмуклер Галерея"
              width={320}
              height={128}
              className="h-20 md:h-28 lg:h-32 w-auto object-contain mb-6"
              priority
            />
            {slide.subtitle && (
              <p className="text-white/80 text-base md:text-lg font-light tracking-widest text-center px-6">
                {slide.subtitle}
              </p>
            )}
          </div>

          {(slide.title || slide.linkUrl) && (
            <div className="absolute bottom-16 left-6 md:left-16 text-white max-w-2xl z-20">
              {slide.title && (
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4 leading-tight">
                  {slide.title}
                </h2>
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
