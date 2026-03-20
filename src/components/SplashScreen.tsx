'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lifting, setLifting] = useState(false)
  const [gone, setGone] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const shown = sessionStorage.getItem('splash_shown')
    if (shown) return
    sessionStorage.setItem('splash_shown', '1')
    setVisible(true)

    // Animate progress 0 → 100 over ~1.6s
    const start = performance.now()
    const duration = 1600
    function tick(now: number) {
      const elapsed = now - start
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(p)
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Pause briefly then lift
        setTimeout(() => setLifting(true), 200)
        setTimeout(() => setGone(true), 1050) // after 850ms transition
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  if (!visible || gone) return null

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        transform: lifting ? 'translateY(-100%)' : 'translateY(0)',
        transition: lifting ? 'transform 850ms cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }}
    >
      {/* Black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
        style={{
          opacity: lifting ? 0 : 1,
          transition: lifting ? 'opacity 300ms ease' : 'none',
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: progress > 10 ? 1 : 0,
            transform: progress > 10 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          <Image
            src="/logo-white.png"
            alt="Шмуклер Галерея"
            width={240}
            height={80}
            className="object-contain"
            priority
            onError={(e) => {
              // Fallback to dark logo if white version doesn't exist
              const img = e.currentTarget as HTMLImageElement
              img.src = '/logo.png'
              img.style.filter = 'invert(1)'
            }}
          />
        </div>

        {/* Counter */}
        <div
          className="font-serif text-white/40 text-sm tracking-[0.3em] tabular-nums"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transition: 'opacity 500ms ease',
          }}
        >
          {String(progress).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div className="w-32 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white/60"
            style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
          />
        </div>
      </div>
    </div>
  )
}
