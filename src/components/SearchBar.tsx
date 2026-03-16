'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ artworks: any[]; artists: any[]; exhibitions: any[] }>({ artworks: [], artists: [], exhibitions: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!query.trim() || query.trim().length < 2) { setResults({ artworks: [], artists: [], exhibitions: [] }); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        setResults(await res.json())
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }, 350)
  }, [query])

  function close() { setOpen(false); setQuery(''); setResults({ artworks: [], artists: [], exhibitions: [] }) }

  const hasResults = results.artworks.length + results.artists.length + results.exhibitions.length > 0

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-1 text-black hover:opacity-70 transition-opacity" aria-label="Поиск">
        <Search className="w-5 h-5 stroke-[1.5]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative z-10 bg-white shadow-2xl w-full max-w-2xl mx-auto mt-20 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск по работам, художникам, выставкам..."
                className="flex-1 text-base outline-none placeholder:text-gray-300"
              />
              <button onClick={close} className="text-gray-400 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading && <p className="text-center text-gray-400 text-sm py-8">Поиск...</p>}

            {!loading && query.length >= 2 && !hasResults && (
              <p className="text-center text-gray-400 text-sm py-8">Ничего не найдено</p>
            )}

            {hasResults && (
              <div className="overflow-y-auto max-h-[60vh] divide-y divide-gray-100">
                {results.artworks.length > 0 && (
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Работы</p>
                    <div className="space-y-3">
                      {results.artworks.map(a => (
                        <Link key={a.id} href={`/artwork/${a.slug}`} onClick={close} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                          {a.imagePath && (
                            <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <Image src={a.imagePath} alt={a.title} fill className="object-cover" sizes="48px" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{a.title}</p>
                            {a.artistName && <p className="text-xs text-gray-500">{a.artistName}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.artists.length > 0 && (
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Художники</p>
                    <div className="space-y-3">
                      {results.artists.map(a => (
                        <Link key={a.id} href={`/artists/${a.slug}`} onClick={close} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                          {a.imagePath && (
                            <div className="relative w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                              <Image src={a.imagePath} alt={a.name} fill className="object-cover" sizes="48px" />
                            </div>
                          )}
                          <p className="text-sm font-medium">{a.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.exhibitions.length > 0 && (
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Выставки</p>
                    <div className="space-y-3">
                      {results.exhibitions.map(e => (
                        <Link key={e.id} href={`/exhibitions/${e.slug}`} onClick={close} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                          <p className="text-sm font-medium">{e.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
