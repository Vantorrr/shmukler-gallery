'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { MOCK_ARTWORKS } from '@/lib/mockData'
import { use } from 'react'

export default function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const { add, items } = useCart()
  const inCart = artwork && items.find(i => i.id === artwork.id)

  useEffect(() => {
    fetch(`/api/artworks?slug=${encodeURIComponent(slug)}&limit=1`)
      .then(r => r.json())
      .then(d => {
        const found = d.items?.[0]
        if (found) { setArtwork(found); return }
        const mock = MOCK_ARTWORKS.find(a => (typeof a.slug === 'string' ? a.slug : a.slug?.current) === slug)
        if (mock) setArtwork({
          id: mock._id, title: mock.title, slug: typeof mock.slug === 'string' ? mock.slug : mock.slug?.current,
          artistName: mock.artist, artistSlug: (mock as any).artistSlug, price: mock.price, status: mock.status,
          medium: mock.medium, dimensions: mock.dimensions, imagePath: mock.mainImage?.asset?.url,
          description: Array.isArray(mock.description) ? mock.description.map((b: any) => b?.children?.map((c: any) => c?.text).join('')).join('\n') : '',
        })
      })
      .catch(() => {
        const mock = MOCK_ARTWORKS.find(a => a.slug?.current === slug)
        if (mock) setArtwork({ id: mock._id, title: mock.title, artistName: mock.artist, price: mock.price, status: mock.status, medium: mock.medium, dimensions: mock.dimensions, imagePath: mock.mainImage?.asset?.url })
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>
  if (!artwork) return <div className="min-h-[50vh] flex items-center justify-center"><h1 className="text-2xl font-light text-gray-400">Работа не найдена</h1></div>

  const handleAddToCart = () => {
    add({ id: artwork.id, title: artwork.title, artistName: artwork.artistName, price: artwork.price, imagePath: artwork.imagePath, slug: artwork.slug })
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* Image */}
        <div className="lg:col-span-7">
          <div className="relative w-full bg-gray-50" style={{ aspectRatio: '3/4' }}>
            {artwork.imagePath && (
              <Image src={artwork.imagePath} alt={artwork.title} fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 60vw" />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-8">
          <div className="space-y-3">
            {artwork.artistName && (
              <Link href={`/artists/${artwork.artistSlug || ''}`} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors block">
                {artwork.artistName}
              </Link>
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
            <p className="text-sm text-gray-600 font-light leading-relaxed">{artwork.description}</p>
          )}

          <p className="text-xs text-gray-400">Сертификат подлинности включён.</p>

          <div>
            <button onClick={() => setDeliveryOpen(o => !o)} className="text-xs underline text-gray-500 hover:text-black transition-colors">
              Доставка и условия получения
            </button>
            {deliveryOpen && (
              <div className="mt-3 text-sm text-gray-600 font-light space-y-1 bg-gray-50 p-4 rounded-lg">
                <p>Самовывоз из галереи — бесплатно</p>
                <p>Доставка по Москве — 1 500 ₽</p>
                <p>Доставка по России — от 3 000 ₽</p>
                <p>Международная доставка — по запросу</p>
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
              <p className="text-sm text-gray-500 uppercase tracking-widest">Зарезервировано</p>
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
