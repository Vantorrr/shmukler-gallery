'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { HomeArtworkCard } from '@/components/HomeArtworkCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const DEFAULT_TECHNIQUES = ['Живопись', 'Графика', 'Скульптура', 'Фотография', 'Керамика', 'Фреска', 'Смешанная техника']
const DEFAULT_THEMES = ['Пейзаж', 'Портрет', 'Натюрморт', 'Абстракция', 'Город', 'Природа', 'Цветы', 'Чувства', 'Любовь', 'Дружба', 'Море', 'Память', 'Тело', 'Детство', 'Дом']
const DEFAULT_COLORS = ['Белый', 'Черный', 'Красный', 'Зеленый', 'Синий', 'Желтый', 'Коричневый', 'Розовый', 'Бежевый', 'Серый', 'Фиолетовый', 'Голубой']
const SORT_OPTIONS = [
  { value: 'orderIndex', label: 'По умолчанию' },
  { value: 'newest', label: 'Новинки' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
]

function ChipRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <span className="text-xs uppercase tracking-widest text-gray-400">{label}</span>
      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          <button
            onClick={() => onChange('')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${!value ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
          >
            Все
          </button>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(value === opt ? '' : opt)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${value === opt ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function GalleryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [artworks, setArtworks] = useState<any[]>([])
  const [filterOptions, setFilterOptions] = useState({ techniques: DEFAULT_TECHNIQUES, themes: DEFAULT_THEMES, colors: DEFAULT_COLORS })
  const [artists, setArtists] = useState<{ slug: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/filter-options').then(r => r.json()).then(d => setFilterOptions(d)).catch(() => {})
    fetch('/api/artists').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setArtists(d.map((a: any) => ({ slug: a.slug, name: a.name })))
    }).catch(() => {})
  }, [])

  const technique = searchParams.get('technique') || ''
  const theme = searchParams.get('theme') || ''
  const color = searchParams.get('color') || ''
  const series = searchParams.get('series') || ''
  const artist = searchParams.get('artist') || ''
  const sortBy = searchParams.get('sortBy') || 'orderIndex'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [priceMin, setPriceMin] = useState(minPrice)
  const [priceMax, setPriceMax] = useState(maxPrice)

  const buildUrl = useCallback((pg: number) => {
    const params = new URLSearchParams()
    params.set('page', String(pg))
    params.set('limit', '20')
    if (technique) params.set('technique', technique)
    if (theme) params.set('theme', theme)
    if (color) params.set('color', color)
    if (series) params.set('series', series)
    if (artist) params.set('artist', artist)
    if (sortBy) params.set('sortBy', sortBy)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    return `/api/artworks?${params}`
  }, [technique, theme, color, series, artist, sortBy, minPrice, maxPrice])

  const load = useCallback(async (pg: number, reset = false) => {
    if (pg === 1) setLoading(true); else setLoadingMore(true)
    try {
      const res = await fetch(buildUrl(pg))
      const data = await res.json()
      const items = data.items || []
      setArtworks(prev => reset ? items : [...prev, ...items])
      setTotal(data.total || 0)
      setHasMore(pg < (data.pages || 0))
    } catch {
      if (pg === 1) { setArtworks([]); setHasMore(false) }
    } finally {
      setLoading(false); setLoadingMore(false)
    }
  }, [buildUrl])

  useEffect(() => {
    setPage(1)
    setArtworks([])
    load(1, true)
  }, [technique, theme, color, series, artist, sortBy, minPrice, maxPrice, load])

  useEffect(() => {
    if (!observerRef.current || !hasMore || loadingMore || loading) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const next = page + 1
        setPage(next)
        load(next)
      }
    }, { rootMargin: '200px' })
    obs.observe(observerRef.current)
    return () => obs.disconnect()
  }, [hasMore, loadingMore, loading, page, load])

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
    artist ? { key: 'artist', label: `Художник: ${artists.find(a => a.slug === artist)?.name || artist}` } : null,
    minPrice ? { key: 'minPrice', label: `От ${Number(minPrice).toLocaleString('ru-RU')} ₽` } : null,
    maxPrice ? { key: 'maxPrice', label: `До ${Number(maxPrice).toLocaleString('ru-RU')} ₽` } : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h1 className="font-serif text-4xl md:text-6xl">Каталог</h1>
          {!loading && <p className="text-sm text-gray-400">{total} работ</p>}
        </div>

        {/* Filters */}
        <div className="border-b border-gray-100 pb-6 mb-10 space-y-5">
          <ChipRow
            label="Техника"
            options={filterOptions.techniques}
            value={technique}
            onChange={v => setFilter('technique', v)}
          />
          <ChipRow
            label="Тематика"
            options={filterOptions.themes}
            value={theme}
            onChange={v => setFilter('theme', v)}
          />
          <ChipRow
            label="Цвет"
            options={filterOptions.colors}
            value={color}
            onChange={v => setFilter('color', v)}
          />
          {artists.length > 0 && (
            <ChipRow
              label="Художник"
              options={artists.map(a => a.name)}
              value={artists.find(a => a.slug === artist)?.name || ''}
              onChange={name => {
                const found = artists.find(a => a.name === name)
                setFilter('artist', found ? found.slug : '')
              }}
            />
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-widest text-gray-400 flex-shrink-0">Цена, ₽</span>
            <input
              type="number"
              placeholder="От"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-24 text-sm border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent placeholder:text-gray-300"
            />
            <span className="text-gray-300 text-sm">—</span>
            <input
              type="number"
              placeholder="До"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-24 text-sm border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent placeholder:text-gray-300"
            />
            <button
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString())
                if (priceMin) p.set('minPrice', priceMin); else p.delete('minPrice')
                if (priceMax) p.set('maxPrice', priceMax); else p.delete('maxPrice')
                router.push(`/gallery?${p}`)
              }}
              className="text-xs uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
            >
              Применить
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-400 flex-shrink-0">Сортировка</span>
            <select
              value={sortBy}
              onChange={e => setFilter('sortBy', e.target.value)}
              className="text-sm border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
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
          <div className="columns-2 lg:columns-3 xl:columns-4 gap-x-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse break-inside-avoid mb-10">
                <div className="bg-gray-100 w-full mb-4" style={{ height: i % 2 === 0 ? 320 : 260 }} />
                <div className="h-3 bg-gray-100 rounded mb-2 w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <p className="text-center text-gray-400 py-24 text-lg">Работы не найдены</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14">
              {artworks.map((artwork) => (
                <div key={artwork.id || artwork._id}>
                  <HomeArtworkCard artwork={artwork} natural />
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

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>}>
      <GalleryContent />
    </Suspense>
  )
}
