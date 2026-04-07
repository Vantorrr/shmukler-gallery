'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { RichText } from '@/components/RichText'
import { HomeArtworkCard } from '@/components/HomeArtworkCard'
import { clearArtworkReturnScroll, getArtworkReturnScroll } from '@/lib/artwork-return-scroll'

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [collection, setCollection] = useState<any>(null)
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then(async (d) => {
        const found = Array.isArray(d) ? d.find((c: any) => c.slug === slug) : null
        if (found) {
          setCollection(found)
          let ids: string[] = []
          try { ids = JSON.parse(found.artworkIds || '[]') } catch { ids = [] }
          if (ids.length > 0) {
            const aw = await fetch(`/api/artworks?ids=${ids.join(',')}&limit=${ids.length}`).then(r => r.json())
            setArtworks(aw.items || [])
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const saved = getArtworkReturnScroll()
    if (!saved || loading) return
    clearArtworkReturnScroll()
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: saved.y, behavior: 'auto' })
    })
  }, [loading])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>
  if (!collection) return <div className="min-h-[50vh] flex items-center justify-center"><h1 className="text-2xl font-light text-gray-400">Подборка не найдена</h1></div>

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{collection.title}</h1>
          {collection.description && (
            <RichText text={collection.description} className="text-gray-600 font-light text-lg" />
          )}
        </div>

        {artworks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14">
            {artworks.map(artwork => (
              <HomeArtworkCard key={artwork.id} artwork={artwork} natural />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">В подборке пока нет работ</p>
        )}
      </div>
    </div>
  )
}
