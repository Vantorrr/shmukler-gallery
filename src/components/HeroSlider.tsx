'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    imagePath: 'https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=2000&auto=format&fit=crop',
    title: 'Shmukler Gallery',
    subtitle: 'Современное искусство в Москве',
    linkUrl: '/gallery',
  },
  {
    id: 'f2',
    imagePath: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?q=80&w=2000&auto=format&fit=crop',
    title: 'Текущие выставки',
    subtitle: 'Откройте мир современного искусства',
    linkUrl: '/exhibitions',
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imagePath}
            alt={slide.title || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute bottom-16 left-6 md:left-16 text-white max-w-2xl z-20">
            {slide.title && (
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 leading-tight">
                {slide.title}
              </h2>
            )}
            {slide.subtitle && (
              <p className="text-lg md:text-xl font-light mb-8 opacity-90">{slide.subtitle}</p>
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
