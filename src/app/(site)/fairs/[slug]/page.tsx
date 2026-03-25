'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { use } from 'react'
import { clsx } from 'clsx'
import { RichText } from '@/components/RichText'
import { HomeArtworkCard } from '@/components/HomeArtworkCard'

export default function FairPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [fair, setFair] = useState<any>(null)
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    fetch('/api/fairs')
      .then(r => r.json())
      .then(async (d) => {
        const found = Array.isArray(d) ? d.find((f: any) => f.slug === slug) : null
        if (found) {
          setFair(found)
          const aw = await fetch(`/api/artworks?fairId=${found.id}&limit=100`).then(r => r.json())
          setArtworks(aw.items || [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>
  if (!fair) return <div className="min-h-[50vh] flex items-center justify-center"><h1 className="text-2xl font-light text-gray-400">Ярмарка не найдена</h1></div>

  const galleryImages: string[] = (() => {
    if (!fair.galleryImages) return fair.coverImage ? [fair.coverImage] : []
    try {
      const parsed = JSON.parse(fair.galleryImages)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean)
    } catch { /* ignore */ }
    const split = fair.galleryImages.split(',').map((s: string) => s.trim()).filter(Boolean)
    if (split.length > 0) return split
    return fair.coverImage ? [fair.coverImage] : []
  })()

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">

      {galleryImages.length > 0 && (
        <div className="relative h-[60vh] overflow-hidden bg-gray-900 mb-16">
          {galleryImages.map((img, i) => (
            <div key={i} className={clsx('absolute inset-0 transition-opacity duration-1000', i === slideIdx ? 'opacity-100' : 'opacity-0')}>
              <Image src={img} alt={fair.title} fill className="object-cover" sizes="100vw" priority={i === 0} />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ))}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {galleryImages.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} className={clsx('w-2 h-2 rounded-full transition-colors', i === slideIdx ? 'bg-white' : 'bg-white/40 hover:bg-white/70')} />
            ))}
          </div>
          {galleryImages.length > 1 && (
            <div className="absolute bottom-8 right-8 text-white z-10 flex gap-3">
              <button onClick={() => setSlideIdx(i => (i - 1 + galleryImages.length) % galleryImages.length)} className="w-10 h-10 border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors text-sm">←</button>
              <button onClick={() => setSlideIdx(i => (i + 1) % galleryImages.length)} className="w-10 h-10 border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors text-sm">→</button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-3xl mx-auto text-center">
          {fair.dates && (
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">{fair.dates}</p>
          )}
          <h1 className="text-4xl md:text-6xl font-serif mb-4">{fair.title}</h1>
          {fair.location && <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">{fair.location}</p>}
          {fair.booth && <p className="text-xs text-gray-400 uppercase tracking-widest">{fair.booth}</p>}
        </div>

        {fair.description && (
          <div className="max-w-2xl mx-auto mb-20">
            <RichText text={fair.description} className="text-gray-600 font-light" />
          </div>
        )}

        {artworks.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-10 border-t border-gray-100 pt-10">Работы на ярмарке</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14">
              {artworks.map(artwork => (
                <HomeArtworkCard key={artwork.id} artwork={artwork} natural />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
