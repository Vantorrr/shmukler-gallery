'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'

interface Props {
  artist: {
    _id: string
    name: string
    slug: { current: string }
    portrait?: { asset?: { url: string } }
    bio?: string
  }
  index: number
}

export function ArtistRow({ artist, index }: Props) {
  const imgRef  = useRef<HTMLDivElement>(null)
  const rowRef  = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)
  const [imgPos, setImgPos]   = useState({ x: 0, y: 0 })

  const imageUrl = artist.portrait?.asset?.url

  const onMouseMove = (e: React.MouseEvent) => {
    const row  = rowRef.current
    const img  = imgRef.current
    if (!row || !img) return

    const rect  = row.getBoundingClientRect()
    // Clamp image so it stays within the row
    const x = Math.min(Math.max(e.clientX - rect.left - 100, 20), rect.width - 220)
    const y = Math.min(Math.max(e.clientY - rect.top  - 140, -60), 60)
    setImgPos({ x, y })
  }

  const isEven = index % 2 === 0

  return (
    <Link
      ref={rowRef}
      href={`/artists/${artist.slug.current}`}
      className="relative flex items-center justify-between px-6 md:px-12 py-8 border-b border-black/8 group overflow-hidden block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
    >
      {/* Hover background fill */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'bottom',
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Left: number + name */}
      <div className="relative z-10 flex items-center gap-6 md:gap-10 min-w-0">
        <span
          className="font-serif italic shrink-0 select-none"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
            transition: 'color 0.4s ease',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2
          className="font-serif italic truncate"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
            color: hovered ? '#fff' : '#000',
            transition: 'color 0.4s ease',
            lineHeight: 1.1,
          }}
        >
          {artist.name}
        </h2>
      </div>

      {/* Right: bio excerpt */}
      {artist.bio && (
        <p
          className="hidden lg:block relative z-10 text-xs font-light max-w-xs text-right shrink-0 ml-8"
          style={{
            color: hovered ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)',
            transition: 'color 0.4s ease',
          }}
        >
          {artist.bio.slice(0, 80)}…
        </p>
      )}

      {/* Floating portrait on hover */}
      {imageUrl && (
        <div
          ref={imgRef}
          className="absolute pointer-events-none z-20 overflow-hidden"
          style={{
            width: 200,
            height: 260,
            left: imgPos.x,
            top: `calc(50% - 130px + ${imgPos.y}px)`,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1) rotate(-2deg)' : 'scale(0.85) rotate(-4deg)',
            transition: 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <Image
            src={imageUrl}
            alt={artist.name}
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
      )}

      {/* Arrow */}
      <div
        className="relative z-10 shrink-0 ml-4"
        style={{
          color: hovered ? '#fff' : 'rgba(0,0,0,0.2)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'color 0.4s ease, transform 0.4s ease',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
