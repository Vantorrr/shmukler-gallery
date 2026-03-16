'use client'

import { useState, useEffect } from 'react'
import { ArtworkCard } from '@/components/ArtworkCard'
import Image from 'next/image'
import { MOCK_EXHIBITIONS, MOCK_ARTWORKS } from '@/lib/mockData'
import { use } from 'react'
import { clsx } from 'clsx'

export default function ExhibitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [exhibition, setExhibition] = useState<any>(null)
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    fetch('/api/exhibitions')
      .then(r => r.json())
      .then(d => {
        const found = Array.isArray(d) ? d.find((e: any) => e.slug === slug || e.slug?.current === slug) : null
        if (found) {
          setExhibition(found)
          return fetch(`/api/artworks?limit=50`).then(r => r.json()).then(aw => {
            setArtworks(aw.items?.filter((a: any) => a.exhibitionId === found.id) || [])
          })
        } else {
          const mock = MOCK_EXHIBITIONS.find(e => e.slug?.current === slug)
          if (mock) {
            setExhibition({ id: mock._id, title: mock.title, slug: mock.slug?.current, startDate: mock.startDate, endDate: mock.endDate, location: mock.location, description: Array.isArray(mock.description) ? mock.description.map((b: any) => b?.children?.map((c: any) => c?.text).join('')).join('\n') : '', coverImage: mock.coverImage?.asset?.url })
            setArtworks(MOCK_ARTWORKS.slice(0, 4).map(a => ({ id: a._id, title: a.title, slug: a.slug?.current, artistName: a.artist, price: a.price, status: a.status, imagePath: a.mainImage?.asset?.url })))
          }
        }
      })
      .catch(() => {
        const mock = MOCK_EXHIBITIONS.find(e => e.slug?.current === slug)
        if (mock) setExhibition({ id: mock._id, title: mock.title, slug: mock.slug?.current, coverImage: mock.coverImage?.asset?.url })
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>
  if (!exhibition) return <div className="min-h-[50vh] flex items-center justify-center"><h1 className="text-2xl font-light text-gray-400">Выставка не найдена</h1></div>

  const galleryImages: string[] = (() => {
    try {
      if (exhibition.galleryImages) return JSON.parse(exhibition.galleryImages)
    } catch { /* ignore */ }
    if (exhibition.coverImage) return [exhibition.coverImage]
    return []
  })()

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">

      {/* Photo carousel header */}
      {galleryImages.length > 0 && (
        <div className="relative h-[60vh] overflow-hidden bg-gray-900 mb-16">
          {galleryImages.map((img, i) => (
            <div key={i} className={clsx('absolute inset-0 transition-opacity duration-1000', i === slideIdx ? 'opacity-100' : 'opacity-0')}>
              <Image src={img} alt={exhibition.title} fill className="object-cover" sizes="100vw" priority={i === 0} />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {galleryImages.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} className={clsx('w-2 h-2 rounded-full transition-colors', i === slideIdx ? 'bg-white' : 'bg-white/40 hover:bg-white/70')} />
            ))}
          </div>

          <div className="absolute bottom-8 right-8 text-white z-10 flex gap-3">
            {galleryImages.length > 1 && (
              <>
                <button onClick={() => setSlideIdx(i => (i - 1 + galleryImages.length) % galleryImages.length)} className="w-10 h-10 border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors text-sm">←</button>
                <button onClick={() => setSlideIdx(i => (i + 1) % galleryImages.length)} className="w-10 h-10 border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors text-sm">→</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-3xl mx-auto text-center">
          {(exhibition.startDate || exhibition.endDate) && (
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
              {exhibition.startDate && new Date(exhibition.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              {exhibition.endDate && ` — ${new Date(exhibition.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-serif mb-4">{exhibition.title}</h1>
          {exhibition.location && <p className="text-sm text-gray-500 uppercase tracking-widest">{exhibition.location}</p>}
        </div>

        {exhibition.description && (
          <div className="max-w-2xl mx-auto mb-20">
            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line">{exhibition.description}</p>
          </div>
        )}

        {artworks.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-10 border-t border-gray-100 pt-10">Работы на выставке</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
              {artworks.map(artwork => (
                <ArtworkCard key={artwork.id || artwork._id} artwork={artwork} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
