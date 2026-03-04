'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function TransitionOverlay() {
  const pathname   = usePathname()
  const router     = useRouter()
  const panelRef   = useRef<HTMLDivElement>(null)
  const isFirst    = useRef(true)
  const isBusy     = useRef(false)
  const nextHref   = useRef<string | null>(null)

  // ── On pathname change: reveal (slide panel away upward) ──
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    if (isFirst.current) {
      isFirst.current = false
      // First load: panel starts covering screen → slide away
      panel.style.transition = 'none'
      panel.style.transform  = 'translateY(0%)'
      requestAnimationFrame(() => requestAnimationFrame(() => {
        panel.style.transition = 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)'
        panel.style.transform  = 'translateY(-101%)'
      }))
      return
    }

    // Subsequent path changes: reveal new page
    setTimeout(() => {
      panel.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)'
      panel.style.transform  = 'translateY(-101%)'
      setTimeout(() => { isBusy.current = false }, 750)
    }, 80)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── Intercept ALL internal link clicks ──
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isBusy.current || isFirst.current) return

      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href === pathname
      ) return

      e.preventDefault()
      if (href === nextHref.current) return

      nextHref.current = href
      isBusy.current   = true

      const panel = panelRef.current
      if (!panel) { router.push(href); return }

      // Panel enters from below → covers screen
      panel.style.transition = 'none'
      panel.style.transform  = 'translateY(101%)'

      requestAnimationFrame(() => requestAnimationFrame(() => {
        panel.style.transition = 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)'
        panel.style.transform  = 'translateY(0%)'

        setTimeout(() => {
          router.push(href)
          nextHref.current = null
        }, 660)
      }))
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname, router])

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9990] pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ background: '#000', transform: 'translateY(0%)' }}
    >
      {/* Subtle label in center of the curtain */}
      <div className="text-center select-none">
        <p
          className="font-serif italic text-white/20 leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
        >
          Shmukler
        </p>
        <p className="text-white/10 text-[9px] tracking-[1.2em] uppercase mt-2">
          Gallery
        </p>
      </div>

      {/* Animated thin line at the edge of the panel */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-white/10"
        style={{ transform: 'scaleX(1)', transformOrigin: 'left' }}
      />
    </div>
  )
}
