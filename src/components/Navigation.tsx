'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { CartDrawer } from './CartDrawer'
import Image from 'next/image'

const links = [
  { href: '/gallery', label: 'Каталог' },
  { href: '/artists', label: 'Художники' },
  { href: '/exhibitions', label: 'Выставки' },
  { href: '/events', label: 'Мероприятия' },
  { href: '/fairs', label: 'Ярмарки' },
  { href: '/services', label: 'Услуги' },
  { href: '/about', label: 'О нас' },
  { href: '/contact', label: 'Контакты' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
          <Image src="/logo.png" alt="Шмуклер Галерея" width={240} height={96} className="h-[90px] w-auto object-contain" priority />
        </Link>

        <div className="flex items-center gap-5 md:gap-8">
          <ul className="hidden xl:flex items-center gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    'text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-black whitespace-nowrap',
                    pathname === link.href || pathname.startsWith(link.href + '/') ? 'text-black font-medium' : 'text-gray-500'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <SearchBar />
          <CartDrawer />

          <button
            className="xl:hidden p-1 text-black"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-36 px-6 overflow-y-auto">
          <ul className="space-y-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'text-2xl font-serif transition-colors block',
                    pathname === link.href ? 'text-black' : 'text-gray-400 hover:text-black'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
