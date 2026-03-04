'use client'

import { useState, useMemo } from 'react'
import { ArtworkCard } from '@/components/ArtworkCard'
import { ScrollReveal } from '@/components/ScrollReveal'
import { MOCK_ARTWORKS } from '@/lib/mockData'

type StatusFilter = 'all' | 'available' | 'sold'
type MediumFilter = 'all' | 'painting' | 'mixed-media' | 'sculpture' | 'photography'

function getMediumCategory(medium: string | undefined): string | null {
  if (!medium) return null
  const m = medium.toLowerCase()
  if (m.includes('скульптур') || m.includes('сталь') || m.includes('steel') || m.includes('found')) return 'sculpture'
  if (m.includes('фотограф') || m.includes('photo'))  return 'photography'
  if (m.includes('смешан') || m.includes('текстиль') || m.includes('вышивк') || m.includes('mixed') || m.includes('textile')) return 'mixed-media'
  if (m.includes('масло') || m.includes('акрил') || m.includes('акварел') || m.includes('холст') || m.includes('лён') || m.includes('дерево') || m.includes('oil') || m.includes('acrylic') || m.includes('watercolor') || m.includes('canvas') || m.includes('linen') || m.includes('panel')) return 'painting'
  return null
}

export default function GalleryPage() {
  const artworks = MOCK_ARTWORKS
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [mediumFilter, setMediumFilter] = useState<MediumFilter>('all')

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'available' && artwork.status !== 'sold') ||
        (statusFilter === 'sold' && artwork.status === 'sold')

      const category = getMediumCategory((artwork as any).medium)
      const mediumMatch = mediumFilter === 'all' || category === mediumFilter

      return statusMatch && mediumMatch
    })
  }, [artworks, statusFilter, mediumFilter])

  const statusButtons: { key: StatusFilter; label: string }[] = [
    { key: 'all',       label: 'Все' },
    { key: 'available', label: 'В наличии' },
    { key: 'sold',      label: 'Продано' },
  ]
  const mediumButtons: { key: MediumFilter; label: string }[] = [
    { key: 'all',         label: 'Все' },
    { key: 'painting',    label: 'Живопись' },
    { key: 'mixed-media', label: 'Смешанная техника' },
    { key: 'sculpture',   label: 'Скульптура' },
    { key: 'photography', label: 'Фотография' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <ScrollReveal>
        <div className="px-6 md:px-12 pt-20 pb-10 max-w-[1600px] mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Все работы</p>
          <div className="flex items-end justify-between">
            <h1
              className="font-serif italic leading-none"
              style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}
            >
              Галерея
            </h1>
            <span className="hidden md:block font-serif italic text-black/10 text-6xl leading-none pb-2">
              {filteredArtworks.length}
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter bar */}
      <ScrollReveal delay={100}>
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-black/8 py-5">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/30">Статус</span>
              {statusButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setStatusFilter(btn.key)}
                  className={`text-[11px] uppercase tracking-widest transition-all duration-200 ${
                    statusFilter === btn.key
                      ? 'text-black border-b border-black pb-px'
                      : 'text-black/35 hover:text-black'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-black/15 hidden md:block" />
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/30">Техника</span>
              {mediumButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setMediumFilter(btn.key)}
                  className={`text-[11px] uppercase tracking-widest transition-all duration-200 ${
                    mediumFilter === btn.key
                      ? 'text-black border-b border-black pb-px'
                      : 'text-black/35 hover:text-black'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Artwork grid — varied layout */}
      <div className="px-6 md:px-12 pt-14 pb-24 max-w-[1600px] mx-auto">
        {filteredArtworks.length === 0 ? (
          <p className="text-center text-black/30 font-light italic py-32 text-lg">
            Нет работ, соответствующих выбранным фильтрам.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredArtworks.map((artwork, i) => {
              // Every 7th item (starting from 6) spans 2 columns
              const isFeature = i % 7 === 6
              return (
                <ScrollReveal
                  key={artwork._id}
                  delay={Math.min((i % 4) * 80, 240)}
                  className={isFeature ? 'col-span-2' : ''}
                >
                  <ArtworkCard artwork={artwork} />
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
