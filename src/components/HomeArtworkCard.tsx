'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'

type Artwork = {
  id?: string
  _id?: string
  title: string
  slug: string | { current: string }
  artistName?: string
  artist?: string
  price?: number
  status?: string
  medium?: string
  imagePath?: string
  mainImage?: { asset?: { url?: string } }
}

export function HomeArtworkCard({ artwork }: { artwork: Artwork }) {
  const { add, items } = useCart()
  const slug = typeof artwork.slug === 'string' ? artwork.slug : artwork.slug?.current
  const imageUrl = artwork.imagePath || artwork.mainImage?.asset?.url
  const artist = artwork.artistName || artwork.artist
  const itemId = artwork.id || artwork._id || ''
  const inCart = items.some(i => i.id === itemId)
  const isSold = artwork.status === 'sold'
  const isReserved = artwork.status === 'reserved'

  if (!slug) return null

  function handleBuy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inCart) {
      window.dispatchEvent(new CustomEvent('open-cart'))
      return
    }
    add({
      id: itemId,
      title: artwork.title,
      price: artwork.price,
      artistName: artist,
      imagePath: imageUrl,
      slug,
    })
  }

  return (
    <div className="flex flex-col">
      <Link href={`/artwork/${slug}`} className="group block">
        <div className="relative bg-gray-50 overflow-hidden mb-3" style={{ aspectRatio: '3/4' }}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={artwork.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 280px, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {isSold && (
            <div className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1">
              Продано
            </div>
          )}
          {isReserved && (
            <div className="absolute top-3 left-3 bg-gray-700 text-white text-[10px] uppercase tracking-widest px-2 py-1">
              Зарезервировано
            </div>
          )}
        </div>
        <div className="space-y-0.5 mb-3">
          {artist && <p className="text-[11px] text-gray-400 uppercase tracking-widest">{artist}</p>}
          <h3 className="text-sm font-medium leading-snug group-hover:opacity-60 transition-opacity">{artwork.title}</h3>
          {artwork.price && !isSold && (
            <p className="text-sm text-gray-600">{artwork.price.toLocaleString('ru-RU')} ₽</p>
          )}
        </div>
      </Link>

      {!isSold && artwork.price ? (
        <button
          onClick={handleBuy}
          className={`w-full text-[11px] uppercase tracking-widest py-2.5 border transition-colors ${
            inCart
              ? 'bg-black text-white border-black hover:bg-gray-800'
              : 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
          }`}
        >
          {inCart ? 'Перейти в корзину' : 'Купить'}
        </button>
      ) : (
        <div className="h-[38px]" />
      )}
    </div>
  )
}
