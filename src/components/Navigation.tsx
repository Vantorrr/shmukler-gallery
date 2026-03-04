'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'

const links = [
  { href: '/gallery',     label: 'Галерея',      num: '01' },
  { href: '/artists',     label: 'Художники',    num: '02' },
  { href: '/exhibitions', label: 'Выставки',     num: '03' },
  { href: '/events',      label: 'Мероприятия',  num: '04' },
  { href: '/services',    label: 'Услуги',        num: '05' },
  { href: '/about',       label: 'О нас',         num: '06' },
  { href: '/contact',     label: 'Контакты',     num: '07' },
]

export function Navigation() {
  const pathname    = usePathname()
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // Stagger items after panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setReady(true), 50)
      return () => clearTimeout(t)
    } else {
      setReady(false)
    }
  }, [open])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Top bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-12 py-4 md:py-5"
        style={{
          background: open ? 'transparent' : 'rgba(255,255,255,0.95)',
          backdropFilter: open ? 'none' : 'blur(12px)',
          borderBottom: open ? 'none' : '1px solid rgba(0,0,0,0.06)',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="relative z-[60] font-serif tracking-tight hover:opacity-70 transition-opacity"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            color: open ? '#fff' : '#000',
            transition: 'color 0.4s ease',
          }}
        >
          Shmukler Gallery
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    'text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-black',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-black font-medium'
                      : 'text-black/40'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Cart icon */}
          <button
            className="relative p-1 transition-opacity hover:opacity-50"
            style={{ color: open ? '#fff' : '#000', transition: 'color 0.4s ease' }}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Hamburger — mobile + tablet */}
          <button
            className="lg:hidden relative z-[60] flex flex-col justify-center gap-[5px] w-6 h-6 py-px"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span
              style={{
                display: 'block',
                height: '1.5px',
                background: open ? '#fff' : '#000',
                transformOrigin: 'center',
                transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease',
                transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                height: '1.5px',
                background: open ? '#fff' : '#000',
                transition: 'opacity 0.3s ease, background 0.4s ease',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                height: '1.5px',
                background: open ? '#fff' : '#000',
                transformOrigin: 'center',
                transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease',
                transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Full-screen mobile menu ── */}
      <div
        className="fixed inset-0 z-[55] bg-black lg:hidden flex flex-col justify-between px-6 pt-24 pb-10"
        style={{
          clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
          transition: 'clip-path 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Main links */}
        <nav>
          <ul className="space-y-1">
            {links.map((link, i) => (
              <li
                key={link.href}
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${i * 60 + 100}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 100}ms`,
                }}
              >
                <Link
                  href={link.href}
                  className="group flex items-baseline gap-4 py-3 border-b border-white/8"
                >
                  <span className="text-white/20 text-[10px] tracking-widest font-mono">
                    {link.num}
                  </span>
                  <span
                    className="font-serif italic text-white leading-none"
                    style={{
                      fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
                      opacity: pathname === link.href ? 1 : 0.6,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom info */}
        <div
          style={{
            opacity: ready ? 1 : 0,
            transition: `opacity 0.5s ease 550ms`,
          }}
          className="flex justify-between items-end"
        >
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Галерея</p>
            <p className="text-white/50 text-xs font-light">Новослободская 45Б, Москва</p>
            <a href="tel:+79895919112" className="text-white/50 text-xs font-light hover:text-white transition-colors">
              +7 989 591 91 12
            </a>
          </div>
          <div className="text-right">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 text-[10px] uppercase tracking-widest hover:text-white transition-colors block"
            >
              Instagram
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 text-[10px] uppercase tracking-widest hover:text-white transition-colors block mt-1"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
