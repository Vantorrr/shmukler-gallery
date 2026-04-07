'use client'

import { useState, useEffect } from 'react'
import { HomeArtworkCard } from '@/components/HomeArtworkCard'
import { HeroSlider } from '@/components/HeroSlider'
import Link from 'next/link'
import Image from 'next/image'
import { clearArtworkReturnScroll, getArtworkReturnScroll } from '@/lib/artwork-return-scroll'

export default function Home() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [exhibitions, setExhibitions] = useState<any[]>([])
  const [artists, setArtists] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/artworks?limit=6')
      .then(r => r.json())
      .then(d => setArtworks(d.items || []))
      .catch(() => {})

    fetch('/api/exhibitions')
      .then(r => r.json())
      .then(d => setExhibitions(Array.isArray(d) ? d.slice(0, 2) : []))
      .catch(() => {})

    fetch('/api/artists')
      .then(r => r.json())
      .then(d => setArtists(Array.isArray(d) ? d.slice(0, 6) : []))
      .catch(() => {})

    fetch('/api/collections')
      .then(r => r.json())
      .then(d => setCollections(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const saved = getArtworkReturnScroll()
    if (!saved || artworks.length === 0) return
    clearArtworkReturnScroll()
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: saved.y, behavior: 'auto' })
    })
  }, [artworks])

  return (
    <div className="min-h-screen bg-white">
      <HeroSlider />

      {/* Сейчас в галерее */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif">Каталог</h2>
          <Link href="/gallery" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity hidden md:block">
            Весь каталог
          </Link>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-3 pr-4">
            {artworks.map((artwork) => (
              <div key={artwork.id || artwork._id} className="snap-start w-[220px] flex-shrink-0">
                <HomeArtworkCard artwork={artwork} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {artworks.map((artwork) => (
            <HomeArtworkCard key={artwork.id || artwork._id} artwork={artwork} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/gallery" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
            Весь каталог
          </Link>
        </div>
      </div>

      {/* Тематические подборки */}
      {collections.length > 0 && (
        <section className="py-20 px-6 md:px-12 bg-gray-50">
          <div className="max-w-[1600px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif mb-12">Тематические подборки</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map(col => (
                <Link key={col.id} href={`/collections/${col.slug}`} className="group block relative overflow-hidden aspect-[4/3] bg-gray-100">
                  {col.coverImage && (
                    <Image
                      src={col.coverImage}
                      alt={col.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-serif mb-1">{col.title}</h3>
                    {col.description && <p className="text-sm opacity-80 line-clamp-2">{col.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Текущие выставки */}
      {exhibitions.length > 0 && (
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-serif">Выставки</h2>
              <Link href="/exhibitions" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
                Все выставки
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {exhibitions.map((ex) => (
                <Link key={ex.id || ex._id} href={`/exhibitions/${ex.slug?.current || ex.slug}`} className="group block">
                  <div className="aspect-[16/9] relative bg-gray-50 mb-5 overflow-hidden">
                    {(ex.coverImage || ex.coverImage?.asset?.url) && (
                      <Image
                        src={ex.coverImage?.asset?.url || ex.coverImage}
                        alt={ex.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    {(ex.startDate || ex.endDate) && (
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {ex.startDate && new Date(ex.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                        {ex.endDate && ` — ${new Date(ex.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                      </p>
                    )}
                    <h3 className="text-2xl font-serif group-hover:opacity-60 transition-opacity">{ex.title}</h3>
                    {ex.location && <p className="text-sm font-light text-gray-500">{ex.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Художники */}
      {artists.length > 0 && (
        <section className="bg-gray-50 py-20 px-6 md:px-12">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-serif">Художники</h2>
              <Link href="/artists" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
                Все художники
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {artists.map(artist => (
                <Link key={artist.id || artist._id} href={`/artists/${artist.slug?.current || artist.slug}`} className="group text-center">
                  <div className="aspect-square relative bg-gray-100 overflow-hidden mb-3 rounded-full">
                    {(artist.imagePath || artist.portrait?.asset?.url) && (
                      <Image
                        src={artist.imagePath || artist.portrait?.asset?.url}
                        alt={artist.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        sizes="(max-width: 768px) 50vw, 16vw"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium group-hover:opacity-60 transition-opacity">{artist.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">Хотите приобрести работу?</h2>
          <p className="text-gray-500 font-light mb-10 text-lg">Мы поможем подобрать произведение для вашего пространства и проведём персональную консультацию</p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/gallery" className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors">
              Каталог работ
            </Link>
            <Link href="/contact" className="border border-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

