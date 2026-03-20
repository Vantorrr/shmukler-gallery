'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/artists')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setArtists(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif mb-16">Художники</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 mb-5" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {artists.map(artist => {
              const slug = artist.slug?.current || artist.slug
              const imageUrl = artist.imagePath

              return (
                <Link key={artist.id || artist._id} href={`/artists/${slug}`} className="group block">
                  <div className="aspect-[3/4] relative bg-gray-50 mb-6 overflow-hidden">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={artist.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <h2 className="text-2xl font-serif group-hover:opacity-60 transition-opacity">{artist.name}</h2>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
