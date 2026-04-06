'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { use } from 'react'
import { RichText } from '@/components/RichText'
import { parseArtists, parseStringArray } from '@/lib/gallery-helpers'

function buildVariantGroup(currentArtwork: any, groupItems: any[]) {
  const currentRelatedIds = parseStringArray(currentArtwork.relatedArtworkIds)
  const currentIds = new Set([currentArtwork.id, ...currentRelatedIds])
  const parentArtwork = groupItems.find(item => {
    const relatedIds = parseStringArray(item.relatedArtworkIds)
    return relatedIds.length > 0 && (item.id === currentArtwork.id || relatedIds.includes(currentArtwork.id))
  }) || (currentRelatedIds.length > 0 ? currentArtwork : null)

  const mode = parentArtwork?.variantMode || currentArtwork.variantMode || 'single'
  const itemMap = new Map(groupItems.map(item => [item.id, item]))
  const ordered = parentArtwork
    ? [parentArtwork, ...parseStringArray(parentArtwork.relatedArtworkIds).map(id => itemMap.get(id)).filter(Boolean)]
    : groupItems.filter(item => currentIds.has(item.id) || parseStringArray(item.relatedArtworkIds).some(id => currentIds.has(id)))

  const deduped = Array.from(new Map(ordered.map(item => [item.id, item])).values())
  if (!deduped.some(item => item.id === currentArtwork.id)) deduped.unshift(currentArtwork)

  return { mode, items: deduped }
}

export default function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [variantItems, setVariantItems] = useState<any[]>([])
  const [variantMode, setVariantMode] = useState<'single' | 'switch' | 'bundle'>('single')
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
          fetch(`/api/artworks?relatedTo=${encodeURIComponent(found.id)}&limit=100`)
            .then(r => r.json())
            .then(group => {
              const groupedItems = Array.isArray(group.items) ? group.items : []
              const variantGroup = buildVariantGroup(found, groupedItems.length > 0 ? groupedItems : [found])
              setVariantItems(variantGroup.items)
              setVariantMode(variantGroup.mode)
            })
            .catch(() => {
              setVariantItems([found])
              setVariantMode(found.variantMode || 'single')
            })
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
  const selectableVariants = variantItems.length > 0 ? variantItems : [artwork]
  const hasVariantOptions = selectableVariants.length > 1

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

          {variantMode === 'switch' && hasVariantOptions && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-gray-400">Работы на выбор</h2>
              <div className="grid grid-cols-2 gap-3">
                {selectableVariants.map((item: any) => {
                  const isCurrent = item.id === artwork.id
                  const isSold = item.status === 'sold'
                  const isReserved = item.status === 'reserved'
                  return (
                  <Link
                    key={item.id}
                    href={`/artwork/${item.slug}`}
                    className={`border p-3 transition-colors ${
                      isCurrent
                        ? 'border-black bg-gray-50'
                        : isSold
                          ? 'border-gray-200 bg-gray-100 text-gray-400 hover:border-gray-300'
                          : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <div className={`relative aspect-square mb-2 ${isSold ? 'bg-gray-100' : 'bg-gray-50'}`}>
                      {item.imagePath && <Image src={item.imagePath} alt={item.title} fill className={`object-contain ${isSold ? 'opacity-60 grayscale' : ''}`} sizes="160px" />}
                      {isSold && (
                        <span className="absolute left-2 top-2 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
                          Продано
                        </span>
                      )}
                      {isReserved && !isSold && (
                        <span className="absolute left-2 top-2 bg-gray-700/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
                          Резерв
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-snug">{item.title}</p>
                    {item.price && !isSold ? <p className="text-xs text-gray-500 mt-1">{Number(item.price).toLocaleString('ru-RU')} ₽</p> : null}
                    {isSold ? <p className="mt-1 text-[11px] uppercase tracking-widest text-gray-400">Продано</p> : null}
                  </Link>
                  )
                })}
              </div>
            </div>
          )}

          {variantMode === 'bundle' && hasVariantOptions && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-gray-400">Варианты покупки</h2>
              <div className="space-y-2">
                {selectableVariants.map((item: any, index: number) => {
                  const isCurrent = item.id === artwork.id
                  const isSold = item.status === 'sold'
                  const isReserved = item.status === 'reserved'
                  const label = index === 0 ? 'Целиком' : `Часть ${index}`
                  return (
                    <Link
                      key={item.id}
                      href={`/artwork/${item.slug}`}
                      className={`flex items-center gap-3 border p-3 transition-colors ${
                        isCurrent
                          ? 'border-black bg-gray-50'
                          : isSold
                            ? 'border-gray-200 bg-gray-100 text-gray-400 hover:border-gray-300'
                            : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      <div className={`relative w-16 h-16 flex-shrink-0 ${isSold ? 'bg-gray-100' : 'bg-gray-50'}`}>
                        {item.imagePath && <Image src={item.imagePath} alt={item.title} fill className={`object-contain ${isSold ? 'opacity-60 grayscale' : ''}`} sizes="64px" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-widest text-gray-400">{label}</p>
                        <p className="text-sm truncate">{item.title}</p>
                        {item.price && !isSold ? <p className="text-xs text-gray-500 mt-1">{Number(item.price).toLocaleString('ru-RU')} ₽</p> : null}
                        {isSold ? <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1">Продано</p> : null}
                        {isReserved && !isSold ? <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1">Забронировано</p> : null}
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
