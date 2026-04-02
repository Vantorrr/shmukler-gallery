'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { use } from 'react'
import { RichText } from '@/components/RichText'
import { parseArtists, parseStringArray } from '@/lib/gallery-helpers'

export default function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [relatedWorks, setRelatedWorks] = useState<any[]>([])
  const { add, items } = useCart()
  const inCart = artwork && items.find(i => i.id === artwork.id)

  useEffect(() => {
    const decodedSlug = (() => { try { return decodeURIComponent(slug) } catch { return slug } })()
    fetch(`/api/artworks?slug=${encodeURIComponent(decodedSlug)}&limit=1`)
      .then(r => r.json())
      .then(d => {
        const found = d.items?.[0]
        if (found) {
          setActiveImage(0)
          setArtwork(found)
          const relatedIds = parseStringArray(found.relatedArtworkIds)
          if (relatedIds.length > 0) {
            fetch(`/api/artworks?ids=${encodeURIComponent(relatedIds.join(','))}&limit=100`)
              .then(r => r.json())
              .then(related => setRelatedWorks(Array.isArray(related.items) ? related.items : []))
              .catch(() => {})
          } else {
            setRelatedWorks([])
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>
  if (!artwork) return <div className="min-h-[50vh] flex items-center justify-center"><h1 className="text-2xl font-light text-gray-400">Работа не найдена</h1></div>

  const handleAddToCart = () => {
    const artistLabel = parseArtists(artwork.artistsJson, { name: artwork.artistName, slug: artwork.artistSlug }).map(artist => artist.name).join(', ')
    add({ id: artwork.id, title: artwork.title, artistName: artistLabel, price: artwork.price, imagePath: artwork.imagePath, slug: artwork.slug })
  }

  const artistLinks = parseArtists(artwork.artistsJson, { name: artwork.artistName, slug: artwork.artistSlug })
  const variantMode = artwork.variantMode || 'single'
  const bundleOptions = variantMode === 'bundle' ? [artwork, ...relatedWorks] : relatedWorks

  let allImages: string[] = []
  if (artwork.imagePath) allImages.push(artwork.imagePath)
  if (artwork.images) {
    try {
      const parsed = JSON.parse(artwork.images)
      if (Array.isArray(parsed)) {
        parsed.filter((u: string) => u && !allImages.includes(u)).forEach((u: string) => allImages.push(u))
      }
    } catch {
      // comma-separated format
      artwork.images.split(',').map((s: string) => s.trim()).filter((u: string) => u && !allImages.includes(u)).forEach((u: string) => allImages.push(u))
    }
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        <div className="lg:col-span-7">
          <div className="relative w-full bg-gray-50" style={{ aspectRatio: '3/4' }}>
            {allImages[activeImage] && (
              <Image src={allImages[activeImage]} alt={artwork.title} fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 60vw" />
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-20 bg-gray-50 border-2 transition-colors ${i === activeImage ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                >
                  <Image src={src} alt={`${artwork.title} — фото ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-8">
          <div className="space-y-3">
            {artistLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {artistLinks.map((artist, index) => (
                  artist.slug ? (
                    <Link key={`${artist.slug}-${index}`} href={`/artists/${artist.slug}`} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors block">
                      {artist.name}
                    </Link>
                  ) : (
                    <span key={`${artist.name}-${index}`} className="text-xs uppercase tracking-widest text-gray-500 block">
                      {artist.name}
                    </span>
                  )
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-serif leading-tight">{artwork.title}</h1>
            {artwork.series && (
              <Link href={`/gallery?series=${encodeURIComponent(artwork.series)}`} className="text-sm text-gray-500 hover:text-black transition-colors underline">
                Серия: {artwork.series}
              </Link>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600 font-light">
            {artwork.dimensions && <p>{artwork.dimensions}</p>}
            {artwork.medium && <p>{artwork.medium}</p>}
            {artwork.materials && <p>{artwork.materials}</p>}
            {artwork.year && <p>{artwork.year}</p>}
          </div>

          {artwork.description && (
            <div className="text-sm text-gray-600 font-light leading-relaxed">
              <RichText text={artwork.description} />
            </div>
          )}

          {variantMode === 'switch' && relatedWorks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-gray-400">Работы на выбор</h2>
              <div className="grid grid-cols-2 gap-3">
                {[artwork, ...relatedWorks].map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/artwork/${item.slug}`}
                    className={`border p-3 transition-colors ${item.id === artwork.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'}`}
                  >
                    <div className="relative aspect-square bg-gray-50 mb-2">
                      {item.imagePath && <Image src={item.imagePath} alt={item.title} fill className="object-contain" sizes="160px" />}
                    </div>
                    <p className="text-sm leading-snug">{item.title}</p>
                    {item.price ? <p className="text-xs text-gray-500 mt-1">{Number(item.price).toLocaleString('ru-RU')} ₽</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {variantMode === 'bundle' && bundleOptions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-gray-400">Варианты покупки</h2>
              <div className="space-y-2">
                {bundleOptions.map((item: any, index: number) => {
                  const isCurrent = item.id === artwork.id
                  const label = index === 0 ? 'Целиком' : `Часть ${index}`
                  return (
                    <Link
                      key={item.id}
                      href={`/artwork/${item.slug}`}
                      className={`flex items-center gap-3 border p-3 transition-colors ${isCurrent ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'}`}
                    >
                      <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0">
                        {item.imagePath && <Image src={item.imagePath} alt={item.title} fill className="object-contain" sizes="64px" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-widest text-gray-400">{label}</p>
                        <p className="text-sm truncate">{item.title}</p>
                        {item.price ? <p className="text-xs text-gray-500 mt-1">{Number(item.price).toLocaleString('ru-RU')} ₽</p> : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400">Сертификат подлинности включён.</p>

          <div>
            <button onClick={() => setDeliveryOpen(o => !o)} className="text-xs underline text-gray-500 hover:text-black transition-colors">
              Доставка и условия получения
            </button>
            {deliveryOpen && (
              <div className="mt-3 text-sm text-gray-600 font-light space-y-1 bg-gray-50 p-4 rounded-lg">
                <p>Самовывоз — бесплатно</p>
                <p>Доставка курьером — 1 500 ₽</p>
                <p>Доставка СДЭК — выбрать адрес/ПВЗ</p>
                <p>Другой способ доставки — по договорённости</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-8 space-y-4">
            {artwork.price && artwork.status !== 'sold' && (
              <p className="text-2xl font-light">{artwork.price.toLocaleString('ru-RU')} ₽</p>
            )}
            {artwork.status === 'sold' ? (
              <p className="text-sm text-gray-500 uppercase tracking-widest">Продано</p>
            ) : artwork.status === 'reserved' ? (
              <p className="text-sm text-gray-500 uppercase tracking-widest">Забронировано</p>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!!inCart}
                className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-default"
              >
                {inCart ? 'В корзине' : 'В корзину'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
