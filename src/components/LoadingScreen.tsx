'use client'

import { useState, useEffect } from 'react'

const ARTWORKS = [
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600&auto=format&fit=crop',
]

const FLOATING_POSITIONS = [
  { top: '8%',  left: '3%',  w: 180, rotate: -6,  delay: 0 },
  { top: '5%',  left: '72%', w: 140, rotate: 5,   delay: 0.15 },
  { top: '55%', left: '1%',  w: 160, rotate: 3,   delay: 0.3 },
  { top: '60%', left: '75%', w: 200, rotate: -4,  delay: 0.1 },
  { top: '25%', left: '85%', w: 130, rotate: 7,   delay: 0.25 },
  { top: '35%', left: '8%',  w: 110, rotate: -3,  delay: 0.05 },
]

export function LoadingScreen() {
  const [count, setCount]     = useState(0)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden]   = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('sg_loaded')) {
      setHidden(true)
      return
    }
    // Small delay before showing so the page doesn't flash
    setTimeout(() => setVisible(true), 50)

    const start = Date.now()
    const duration = 2200 // ms total

    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setCount(Math.round(eased * 100))
      if (progress < 1) {
        requestAnimationFrame(raf)
      } else {
        setTimeout(() => {
          setExiting(true)
          setTimeout(() => {
            setHidden(true)
            sessionStorage.setItem('sg_loaded', '1')
          }, 900)
        }, 300)
      }
    }
    requestAnimationFrame(raf)
  }, [])

  if (hidden) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        clipPath: exiting
          ? 'inset(100% 0 0 0)'
          : 'inset(0% 0 0 0)',
        transitionProperty: exiting ? 'clip-path' : 'opacity',
        transitionDuration: exiting ? '0.85s' : '0.3s',
        transitionTimingFunction: exiting ? 'cubic-bezier(0.76, 0, 0.24, 1)' : 'ease',
      }}
    >
      {/* Floating artworks */}
      {FLOATING_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="absolute overflow-hidden shadow-2xl"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.w,
            height: Math.round(pos.w * 1.3),
            transform: `rotate(${pos.rotate}deg) translateY(${exiting ? '-120px' : '0px'})`,
            opacity: exiting ? 0 : 0.25,
            transition: `transform 0.9s cubic-bezier(0.76,0,0.24,1) ${pos.delay}s, opacity 0.6s ease ${pos.delay}s`,
            animationDelay: `${pos.delay}s`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ARTWORKS[i % ARTWORKS.length]}
            alt=""
            className="w-full h-full object-cover"
            style={{
              animation: `floatDrift ${6 + i * 0.7}s ease-in-out infinite alternate`,
              animationDelay: `${pos.delay * 2}s`,
            }}
          />
        </div>
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          style={{
            opacity: exiting ? 0 : 1,
            transform: exiting ? 'translateY(-30px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase text-center mb-6">
            Москва
          </p>
          <h1
            className="font-serif italic text-white text-center leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Shmukler
          </h1>
          <p className="text-white/50 text-[11px] tracking-[1em] uppercase text-center mt-3">
            Gallery
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-8 pb-10 flex items-end justify-between"
        style={{
          opacity: exiting ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <span className="text-white/20 text-[10px] tracking-widest uppercase">
          Галерея современного искусства
        </span>
        <div className="flex items-center gap-4">
          <div className="w-24 h-px bg-white/10 overflow-hidden">
            <div
              className="h-full bg-white/60"
              style={{
                width: `${count}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <span className="text-white/40 text-xs tabular-nums w-8 text-right">
            {count}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes floatDrift {
          from { transform: scale(1) translateY(0px); }
          to   { transform: scale(1.04) translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
