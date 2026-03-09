'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { clsx } from 'clsx'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=2400&auto=format&fit=crop',
    title: 'Эфирные\nпейзажи',
    subtitle: 'Новые работы Александра Болквадзе',
    link: '/exhibitions/ethereal-landscapes',
    align: 'left',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?q=80&w=2400&auto=format&fit=crop',
    title: 'Современные\nперспективы',
    subtitle: 'Групповая выставка резидентов',
    link: '/exhibitions/modern-perspectives',
    align: 'right',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=2400&auto=format&fit=crop',
    title: 'Мир\nматериалов',
    subtitle: 'Скульптура и смешанная техника',
    link: '/exhibitions/material-worlds',
    align: 'left',
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState(-1)
  const [transitioning, setTransitioning] = useState(false)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])
  const parallaxY = useRef(0)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [current])

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      parallaxY.current = window.scrollY * 0.35
      imgRefs.current.forEach((el) => {
        if (el) el.style.transform = `translateY(${parallaxY.current}px) scale(1.15)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (idx: number) => {
    if (idx === current || transitioning) return
    setTransitioning(true)
    setPrev(current)
    setCurrent(idx)
    setTimeout(() => {
      setPrev(-1)
      setTransitioning(false)
    }, 900)
  }

  const slide = SLIDES[current]

  return (
    <div className="relative h-[92vh] w-full overflow-hidden bg-black select-none">
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : i === prev ? 0 : 0,
            transition: i === current
              ? 'opacity 1s cubic-bezier(0.16,1,0.3,1)'
              : i === prev
              ? 'opacity 0.8s ease'
              : 'none',
            zIndex: i === current ? 2 : i === prev ? 1 : 0,
          }}
        >
          <div
            ref={(el) => { imgRefs.current[i] = el }}
            className="absolute inset-0 will-change-transform"
            style={{ transform: 'translateY(0) scale(1.15)' }}
          >
            <NextImage
              src={s.image}
              alt={s.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ transformOrigin: 'center center' }}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Slide text */}
      <div
        className={clsx(
          'absolute bottom-0 z-10 pb-16 px-6 md:px-14 w-full',
          slide.align === 'right' ? 'text-right' : 'text-left'
        )}
      >
        <div
          key={current}
          style={{
            animation: 'heroTextIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
            opacity: 0,
          }}
        >
          <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase mb-4">
            Shmukler Gallery — Выставка
          </p>
          <h2
            className="font-serif text-white leading-[0.9] mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)' }}
          >
            {slide.title}
          </h2>
          <p className="text-white/70 text-base md:text-lg font-light mb-8 tracking-wide">
            {slide.subtitle}
          </p>
          <Link
            href={slide.link}
            className="inline-flex items-center gap-3 text-white text-[11px] uppercase tracking-[0.35em] group"
          >
            <span className="border-b border-white/40 pb-px group-hover:border-white transition-colors">
              Смотреть выставку
            </span>
            <span
              className="h-px bg-white/40 group-hover:bg-white transition-all"
              style={{ width: '2.5rem', transition: 'width 0.4s ease, background 0.3s' }}
            />
          </Link>
        </div>
      </div>

      {/* Slide counter + dots */}
      <div className="absolute bottom-16 right-6 md:right-14 z-10 flex flex-col items-end gap-4">
        <div className="text-white/30 text-xs font-serif tabular-nums">
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="block"
              style={{
                width: idx === current ? '2rem' : '0.375rem',
                height: '2px',
                background: idx === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.3s',
                borderRadius: '1px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          className="w-px bg-white/20"
          style={{ height: '3rem', animation: 'scrollHint 2s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes heroTextIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollHint {
          0%, 100% { opacity: 0.2; transform: scaleY(1); }
          50% { opacity: 0.6; transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  )
}
