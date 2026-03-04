'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const wrapRef  = useRef<HTMLDivElement>(null)
  const isFirst  = useRef(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    if (isFirst.current) {
      // First paint — fade in from 0
      isFirst.current = false
      el.style.opacity = '0'
      el.style.transform = 'translateY(18px)'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)'
          el.style.opacity   = '1'
          el.style.transform = 'translateY(0)'
        })
      })
      return
    }

    // Route change — quick flash out → back in
    el.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
    el.style.opacity   = '0'
    el.style.transform = 'translateY(12px)'

    const timer = setTimeout(() => {
      el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)'
      el.style.opacity   = '1'
      el.style.transform = 'translateY(0)'
    }, 220)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div ref={wrapRef} style={{ willChange: 'opacity, transform' }}>
      {children}
    </div>
  )
}
