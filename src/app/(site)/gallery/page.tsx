'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'
import { MOCK_ARTWORKS } from '@/lib/mockData'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'newest'

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<any[]>(MOCK_ARTWORKS)

  useEffect(() => {
    fetch('/api/artworks')
      .then(r => r.json())
      .then(data => { if (data?.length) setArtworks(data) })
      .catch(() => {})
  }, [])

  const [artistFilter, setArtistFilter] = useState<string>('all')
  const [mediumFilter, setMediumFilter] = useState<string>('all')
  const [sortKey,      setSortKey]      = useState<SortKey>('default')
  const [priceMin,     setPriceMin]     = useState('')
  const [priceMax,     setPriceMax]     = useState('')
  const [filtersOpen,  setFiltersOpen]  = useState(false)

  // Unique artists from artworks
  const artistOptions = useMemo(() => {
    const names = [...new Set(artworks.map(a => { const x = a as any; return x.artistName || x.artist }).filter(Boolean))]
    return names.sort()
  }, [artworks])

  // Unique mediums simplified
  const mediumOptions = [
    { key: 'all',         label: 'Все' },
    { key: 'Живопись',    label: 'Живопись' },
    { key: 'Графика',     label: 'Графика' },
    { key: 'Скульптура',  label: 'Скульптура' },
    { key: 'Фотография',  label: 'Фотография' },
    { key: 'Смешанная техника', label: 'Смешанная' },
  ]

  const filtered = useMemo(() => {
    let res = artworks.filter(a => {
      const art = a as any
      if (artistFilter !== 'all' && (art.artistName || art.artist) !== artistFilter) return false
      if (mediumFilter !== 'all') {
        const m = (art.medium || '').toLowerCase()
        if (mediumFilter === 'Живопись'          && !(m.includes('масло') || m.includes('акрил') || m.includes('акварел') || m.includes('холст') || m.includes('лён') || m.includes('дерево'))) return false
        if (mediumFilter === 'Графика'           && !(m.includes('граф') || m.includes('карандаш') || m.includes('уголь') || m.includes('линогр'))) return false
        if (mediumFilter === 'Скульптура'        && !(m.includes('скульптур') || m.includes('сталь') || m.includes('бронз') || m.includes('камень'))) return false
        if (mediumFilter === 'Фотография'        && !m.includes('фотограф')) return false
        if (mediumFilter === 'Смешанная техника' && !(m.includes('смешан') || m.includes('текстиль') || m.includes('стекло') || m.includes('found'))) return false
      }
      const price = (art.price || 0)
      if (priceMin && price < Number(priceMin)) return false
      if (priceMax && price > Number(priceMax)) return false
      return true
    })

    if (sortKey === 'price-asc')  res = [...res].sort((a, b) => ((a as any).price || 0) - ((b as any).price || 0))
    if (sortKey === 'price-desc') res = [...res].sort((a, b) => ((b as any).price || 0) - ((a as any).price || 0))

    return res
  }, [artworks, artistFilter, mediumFilter, sortKey, priceMin, priceMax])

  const activeFilters = [
    artistFilter !== 'all',
    mediumFilter !== 'all',
    sortKey !== 'default',
    !!priceMin || !!priceMax,
  ].filter(Boolean).length

  const resetFilters = () => {
    setArtistFilter('all')
    setMediumFilter('all')
    setSortKey('default')
    setPriceMin('')
    setPriceMax('')
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <ScrollReveal>
        <div className="px-6 md:px-12 pt-20 pb-8 max-w-[1600px] mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Все работы</p>
          <div className="flex items-end justify-between">
            <h1 className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              Каталог
            </h1>
            <span className="hidden md:block font-serif text-black/10 text-6xl leading-none pb-2">
              {filtered.length}
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter bar */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto border-y border-black/8">
        <div className="flex items-center justify-between py-4 gap-4">

          {/* Left: filter toggles */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Artist dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/30">Художник</span>
              <select
                value={artistFilter}
                onChange={e => setArtistFilter(e.target.value)}
                className="text-[11px] uppercase tracking-wide bg-transparent border-0 focus:outline-none cursor-pointer text-black/70 hover:text-black"
              >
                <option value="all">Все</option>
                {artistOptions.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="w-px h-4 bg-black/10 hidden md:block" />

            {/* Medium buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/30">Техника</span>
              {mediumOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setMediumFilter(opt.key)}
                  className={`text-[11px] uppercase tracking-wide transition-all duration-200 ${
                    mediumFilter === opt.key
                      ? 'text-black border-b border-black pb-px'
                      : 'text-black/35 hover:text-black'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: sort + price + reset */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Price range */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/30">Цена</span>
              <input
                type="number"
                placeholder="от"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                className="w-16 text-[11px] border-b border-black/20 bg-transparent py-0.5 focus:outline-none focus:border-black text-black/60 placeholder:text-black/25"
              />
              <span className="text-black/20 text-xs">—</span>
              <input
                type="number"
                placeholder="до"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                className="w-16 text-[11px] border-b border-black/20 bg-transparent py-0.5 focus:outline-none focus:border-black text-black/60 placeholder:text-black/25"
              />
              <span className="text-[9px] text-black/30">₽</span>
            </div>

            <div className="w-px h-4 bg-black/10 hidden md:block" />

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/30 hidden md:block">Сортировка</span>
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                className="text-[11px] uppercase tracking-wide bg-transparent border-0 focus:outline-none cursor-pointer text-black/70 hover:text-black"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="newest">Новинки</option>
              </select>
            </div>

            {activeFilters > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors border-b border-black/20 pb-px"
              >
                Сбросить ({activeFilters})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Artwork grid — natural proportions */}
      <div className="px-6 md:px-12 pt-10 pb-24 max-w-[1600px] mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-black/30 font-light py-32 text-lg">
            Нет работ, соответствующих фильтрам.
          </p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0">
            {filtered.map((artwork) => {
              const art = artwork as any
              // Support both DB format (imagePath, artistName) and mock format (mainImage.asset.url, artist)
              const imageUrl = art.imagePath || art.mainImage?.asset?.url
              const artistLabel = art.artistName || art.artist
              const slugStr = art.slug?.current ?? art.slug
              return (
                <div key={art.id || art._id} className="break-inside-avoid mb-4 group">
                  <Link href={`/artwork/${slugStr}`} className="block">
                    <div className="overflow-hidden bg-gray-50 relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={artwork.title}
                          width={600}
                          height={800}
                          style={{ width: '100%', height: 'auto' }}
                          className="transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="aspect-[3/4] bg-gray-100" />
                      )}
                      {art.status === 'sold' && (
                        <div className="absolute top-3 right-3 bg-black text-white text-[9px] px-2.5 py-1 uppercase tracking-widest">
                          Продано
                        </div>
                      )}
                      {art.status === 'reserved' && (
                        <div className="absolute top-3 right-3 bg-white text-black text-[9px] px-2.5 py-1 uppercase tracking-widest border border-black">
                          Забронировано
                        </div>
                      )}
                    </div>
                    <div className="pt-3 pb-1">
                      <p className="text-[10px] text-black/40 font-light">{artistLabel}</p>
                      <h3 className="text-sm font-serif leading-snug mt-0.5 group-hover:opacity-50 transition-opacity">{artwork.title}</h3>
                      {art.price && art.status !== 'sold' && art.status !== 'reserved' && (
                        <p className="text-xs font-light text-black/60 mt-1">{Number(art.price).toLocaleString('ru-RU')} ₽</p>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
