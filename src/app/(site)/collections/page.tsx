'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setCollections(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif mb-16">Подборки</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <p className="text-center text-gray-400 py-24 text-lg">Подборок пока нет</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {collections.map(c => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden mb-4">
                  {c.coverImage && (
                    <Image
                      src={c.coverImage}
                      alt={c.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <h2 className="text-xl font-serif group-hover:opacity-60 transition-opacity">{c.title}</h2>
                {c.description && (
                  <p className="text-sm text-gray-500 font-light mt-2 line-clamp-2">{c.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
