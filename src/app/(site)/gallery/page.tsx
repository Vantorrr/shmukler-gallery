'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArtworkCard } from '@/components/ArtworkCard'
import { MOCK_ARTWORKS } from '@/lib/mockData'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const TECHNIQUES = ['Все', 'Живопись', 'Акварель', 'Графика', 'Смешанная техника', 'Скульптура', 'Фотография', 'Керамика', 'Фреска']
const SORT_OPTIONS = [
  { value: 'orderIndex', label: 'По умолчанию' },
  { value: 'newest', label: 'Новинки' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
]

function GalleryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const observerRef = useRef<HTMLDivElement>(null)
  const useMock = useRef(false)

  const technique = searchParams.get('technique') || ''
  const theme = searchParams.get('theme') || ''
  const color = searchParams.get('color') || ''
  const series = searchParams.get('series') || ''
  const sortBy = searchParams.get('sortBy') || 'orderIndex'

  const buildUrl = useCallback((pg: number) => {
    const params = new URLSearchParams()
    params.set('page', String(pg))
    params.set('limit', '20')
    if (technique) params.set('technique', technique)
    if (theme) params.set('theme', theme)
    if (color) params.set('color', color)
    if (series) params.set('series', series)
    if (sortBy) params.set('sortBy', sortBy)
    return `/api/artworks?${params}`
  }, [technique, theme, color, series, sortBy])

  const load = useCallback(async (pg: number, reset = false) => {
    if (pg === 1) setLoading(true); else setLoadingMore(true)
    try {
      const res = await fetch(buildUrl(pg))
      const data = await res.json()
      if (data.items && data.items.length > 0) {
        useMock.current = false
        setArtworks(prev => reset ? data.items : [...prev, ...data.items])
        setTotal(data.total)
        setHasMore(pg < data.pages)
      } else if (pg === 1) {
        useMock.current = true
        const filtered = MOCK_ARTWORKS.map(mapArtwork).filter(a => {
          if (technique && technique !== 'Все' && !a.medium?.toLowerCase().includes(technique.toLowerCase())) return false
          if (series && a.series !== series) return false
          return true
        })
        setArtworks(filtered)
        setTotal(filtered.length)
        setHasMore(false)
      }
    } catch {
      if (pg === 1) { useMock.current = true; setArtworks(MOCK_ARTWORKS.map(mapArtwork)); setHasMore(false) }
    } finally {
      setLoading(false); setLoadingMore(false)
    }
  }, [buildUrl, technique, series])

  useEffect(() => {
    setPage(1)
    setArtworks([])
    load(1, true)
  }, [technique, theme, color, series, sortBy, load])

  useEffect(() => {
    if (!observerRef.current || !hasMore || loadingMore) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const next = page + 1
        setPage(next)
        load(next)
      }
    }, { rootMargin: '200px' })
    obs.observe(observerRef.current)
    return () => obs.disconnect()
  }, [hasMore, loadingMore, page, load])

  function setFilter(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    if (value && value !== 'Все') p.set(key, value); else p.delete(key)
    router.push(`/gallery?${p}`)
  }

  const activeFilters = [
    technique && technique !== 'Все' ? { key: 'technique', label: technique } : null,
    theme ? { key: 'theme', label: `Тема: ${theme}` } : null,
    color ? { key: 'color', label: `Цвет: ${color}` } : null,
    series ? { key: 'series', label: `Серия: ${series}` } : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h1 className="font-serif text-4xl md:text-6xl">Каталог</h1>
          {!loading && <p className="text-sm text-gray-400">{total} работ</p>}
        </div>

        {/* Filters */}
        <div className="border-b border-gray-100 pb-6 mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-400 w-20">Техника</span>
            <div className="flex flex-wrap gap-2">
              {TECHNIQUES.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter('technique', t === 'Все' ? '' : t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    (technique === t) || (t === 'Все' && !technique)
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-400 w-24 flex-shrink-0">Тематика</span>
              <input
                type="text"
                value={theme}
                onChange={e => setFilter('theme', e.target.value)}
                placeholder="Введите тему..."
                className="border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black flex-1 max-w-xs"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-400 w-24 flex-shrink-0">Цвет</span>
              <input
                type="text"
                value={color}
                onChange={e => setFilter('color', e.target.value)}
                placeholder="Введите цвет..."
                className="border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black flex-1 max-w-xs"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-400 w-24 flex-shrink-0">Сортировка</span>
              <select
                value={sortBy}
                onChange={e => setFilter('sortBy', e.target.value)}
                className="text-sm border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent flex-1 max-w-xs"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(f => f && (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key, '')}
                  className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800"
                >
                  {f.label} ×
                </button>
              ))}
              <button onClick={() => router.push('/gallery')} className="text-xs text-gray-400 hover:text-black underline">
                Сбросить всё
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-[3/4] mb-4" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <p className="text-center text-gray-400 py-24 text-lg">Работы не найдены</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {artworks.map((artwork) => (
                <div key={artwork.id || artwork._id}>
                  <ArtworkCard artwork={artwork} />
                  {artwork.series && (
                    <button
                      onClick={() => setFilter('series', artwork.series)}
                      className="mt-2 text-xs text-gray-400 hover:text-black transition-colors underline"
                    >
                      Серия: {artwork.series}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div ref={observerRef} className="py-12 text-center">
                {loadingMore && <p className="text-gray-400 text-sm">Загрузка...</p>}
              </div>
            )}

            {!hasMore && artworks.length > 0 && (
              <p className="text-center text-gray-300 text-sm mt-16">Все работы загружены</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function mapArtwork(a: any) {
  return {
    id: a.id || a._id,
    title: a.title,
    slug: typeof a.slug === 'string' ? a.slug : a.slug?.current,
    artistName: a.artist || a.artistName,
    artistSlug: a.artistSlug,
    price: a.price,
    status: a.status,
    medium: a.medium,
    series: a.series,
    imagePath: a.mainImage?.asset?.url || a.imagePath,
  }
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>}>
      <GalleryContent />
    </Suspense>
  )
}
