'use client'

import { useState, useEffect } from 'react'
import { HomeArtworkCard } from '@/components/HomeArtworkCard'
import Image from 'next/image'
import { RichText } from '@/components/RichText'
import { use } from 'react'

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [artist, setArtist] = useState<any>(null)
  const [artworks, setArtworksState] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/artists?slug=${encodeURIComponent(slug)}`).then(r => r.json()),
      fetch(`/api/artworks?artist=${encodeURIComponent(slug)}&limit=200`).then(r => r.json()),
    ]).then(([found, artworksData]) => {
      if (found && found.id) {
        setArtist(found)
        setArtworksState(artworksData.items || [])
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>
  if (!artist) return <div className="min-h-[50vh] flex items-center justify-center"><h1 className="text-2xl font-light text-gray-400">Художник не найден</h1></div>

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
          <div className="lg:col-span-4">
            {artist.imagePath && (
              <div className="relative aspect-[3/4] w-full max-w-sm bg-gray-50 overflow-hidden">
                <Image src={artist.imagePath} alt={artist.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            <h1 className="text-4xl md:text-6xl font-serif">{artist.name}</h1>

            {/* BIO */}
            {artist.bio && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Биография</h2>
                <RichText text={artist.bio} className="text-gray-600 font-light" />
              </section>
            )}

            {/* Образование */}
            {artist.education && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Образование</h2>
                <RichText text={artist.education} className="text-gray-600 font-light" />
              </section>
            )}

            {/* AS — Artist Statement */}
            {artist.artistStatement && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Artist Statement</h2>
                <blockquote className="border-l-2 border-gray-200 pl-6">
                  <RichText text={artist.artistStatement} className="text-gray-600 font-light" />
                </blockquote>
              </section>
            )}

            {/* Избранные выставки */}
            {artist.selectedExhibitions && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Избранные выставки</h2>
                <RichText text={artist.selectedExhibitions} className="text-gray-600 font-light" />
              </section>
            )}
          </div>
        </div>

        {/* Произведения */}
        {artworks.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-10 border-t border-gray-100 pt-10">Произведения</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14">
              {artworks.map(artwork => (
                <HomeArtworkCard key={artwork.id || artwork._id} artwork={artwork} natural />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
