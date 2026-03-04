'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const mouse = useRef({ x: -200, y: -200 })
  const ring  = useRef({ x: -200, y: -200 })
  const raf   = useRef<number | undefined>(undefined)
  const hoverRef = useRef(false)

  useEffect(() => {
    // Only on pointer-fine (non-touch) devices
    if (!window.matchMedia('(pointer: fine)').matches) return
    setMounted(true)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.11)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.11)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    tick()

    // Hover detection via delegation
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [data-cursor-hover]')) {
        hoverRef.current = true
        if (ringRef.current) {
          ringRef.current.style.width  = '64px'
          ringRef.current.style.height = '64px'
        }
        if (dotRef.current) dotRef.current.style.opacity = '0.5'
      }
    }
    const onOut = (e: MouseEvent) => {
      const rel = e.relatedTarget as HTMLElement | null
      if (!rel?.closest('a, button, [data-cursor-hover]')) {
        hoverRef.current = false
        if (ringRef.current) {
          ringRef.current.style.width  = '40px'
          ringRef.current.style.height = '40px'
        }
        if (dotRef.current) dotRef.current.style.opacity = '1'
      }
    }

    // Image hover — show "СМОТРЕТЬ"
    const onImgOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'IMG' || t.closest('[data-cursor-view]')) {
        if (ringRef.current) {
          ringRef.current.dataset.label = 'СМОТРЕТЬ'
          ringRef.current.style.width  = '80px'
          ringRef.current.style.height = '80px'
        }
      }
    }
    const onImgOut = (e: MouseEvent) => {
      const rel = e.relatedTarget as HTMLElement | null
      if (!rel || (rel.tagName !== 'IMG' && !rel.closest('[data-cursor-view]'))) {
        if (ringRef.current) {
          delete ringRef.current.dataset.label
          ringRef.current.style.width  = hoverRef.current ? '64px' : '40px'
          ringRef.current.style.height = hoverRef.current ? '64px' : '40px'
        }
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)
    document.addEventListener('mouseover', onImgOver)
    document.addEventListener('mouseout',  onImgOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      document.removeEventListener('mouseover', onImgOver)
      document.removeEventListener('mouseout',  onImgOut)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-[6px] h-[6px] rounded-full bg-white mix-blend-difference"
        style={{
          willChange: 'transform',
          marginLeft: '-3px',
          marginTop: '-3px',
          transition: 'opacity 0.2s',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white mix-blend-difference flex items-center justify-center"
        style={{
          width: '40px',
          height: '40px',
          marginLeft: '-20px',
          marginTop: '-20px',
          willChange: 'transform',
          transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1)',
          fontSize: '7px',
          letterSpacing: '0.15em',
          color: 'white',
        }}
      />
    </>
  )
}
