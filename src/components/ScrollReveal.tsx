'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  x?: number
  scale?: boolean
  className?: string
  once?: boolean
}

export function ScrollReveal({
  children,
  delay = 0,
  y = 40,
  x = 0,
  scale = false,
  className = '',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const revealed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const initial = `translateY(${y}px) translateX(${x}px)${scale ? ' scale(0.95)' : ''}`
    el.style.opacity = '0'
    el.style.transform = initial
    el.style.transition = `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0) translateX(0) scale(1)'
          revealed.current = true
          if (once) observer.disconnect()
        } else if (!once && revealed.current) {
          el.style.opacity = '0'
          el.style.transform = initial
          revealed.current = false
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, y, x, scale, once])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
