'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { urlForImage } from '@sanity/lib/image'

interface ArtworkCardProps {
  artwork: {
    title: string
    slug: { current: string }
    mainImage: any
    artist: string
    price?: number
    status: string
  }
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const imageUrl = artwork.mainImage?.asset?.url ||
    (artwork.mainImage ? urlForImage(artwork.mainImage).url() : null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width  / 2
    const cy = rect.height / 2
    const rotY =  ((x - cx) / cx) * 7
    const rotX = -((y - cy) / cy) * 5
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`
    card.style.transition = 'transform 0.08s ease'
  }

  const onMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)'
      cardRef.current.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)'
    }
  }

  return (
    <Link href={`/artwork/${artwork.slug.current}`} className="group block">
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
        data-cursor-view
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={artwork.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {artwork.status === 'sold' && (
            <div className="absolute top-3 right-3 bg-black text-white text-[9px] px-3 py-1 uppercase tracking-widest">
              Продано
            </div>
          )}
          {artwork.status === 'reserved' && (
            <div className="absolute top-3 right-3 bg-white text-black text-[9px] px-3 py-1 uppercase tracking-widest border border-black">
              Забронировано
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-black/40 font-light italic">{artwork.artist}</p>
          <h3 className="text-base font-serif leading-tight group-hover:opacity-50 transition-opacity duration-300">
            {artwork.title}
          </h3>
          {artwork.price && artwork.status !== 'sold' && artwork.status !== 'reserved' && (
            <p className="text-sm font-light text-black/70 mt-2">
              {artwork.price.toLocaleString('ru-RU')} ₽
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
