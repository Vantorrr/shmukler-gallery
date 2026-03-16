'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_EXHIBITIONS } from '@/lib/mockData'

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/exhibitions')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length > 0) setExhibitions(d)
        else setExhibitions(MOCK_EXHIBITIONS.map(e => ({ id: e._id, title: e.title, slug: e.slug?.current, startDate: e.startDate, endDate: e.endDate, location: e.location, coverImage: e.coverImage?.asset?.url })))
      })
      .catch(() => setExhibitions(MOCK_EXHIBITIONS.map(e => ({ id: e._id, title: e.title, slug: e.slug?.current, startDate: e.startDate, endDate: e.endDate, location: e.location, coverImage: e.coverImage?.asset?.url }))))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif mb-16">Выставки</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[16/9] bg-gray-100 mb-5" /><div className="h-4 bg-gray-100 rounded w-3/4" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {exhibitions.map(exhibition => {
              const slug = exhibition.slug?.current || exhibition.slug
              const imageUrl = exhibition.coverImage?.asset?.url || exhibition.coverImage

              return (
                <Link key={exhibition.id || exhibition._id} href={`/exhibitions/${slug}`} className="group block">
                  <div className="aspect-[16/9] relative bg-gray-50 mb-6 overflow-hidden">
                    {imageUrl && (
                      <Image src={imageUrl} alt={exhibition.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                    )}
                  </div>
                  <div className="space-y-2">
                    {(exhibition.startDate || exhibition.endDate) && (
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {exhibition.startDate && new Date(exhibition.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        {exhibition.endDate && ` — ${new Date(exhibition.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </p>
                    )}
                    <h2 className="text-3xl font-serif group-hover:opacity-60 transition-opacity">{exhibition.title}</h2>
                    {exhibition.location && <p className="text-sm font-light text-gray-500">{exhibition.location}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
