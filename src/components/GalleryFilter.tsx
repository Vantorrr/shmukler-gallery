'use client'

import { useState, useMemo } from 'react'
import { ArtworkCard } from '@/components/ArtworkCard'

export type StatusFilter = 'all' | 'available' | 'sold'
export type MediumFilter = 'all' | 'painting' | 'mixed-media' | 'sculpture' | 'photography'

function getMediumCategory(medium: string | undefined): MediumFilter | null {
  if (!medium) return null
  const m = medium.toLowerCase()
  if (m.includes('sculpture') || m.includes('steel') || m.includes('found objects')) return 'sculpture'
  if (m.includes('photography')) return 'photography'
  if (m.includes('mixed media') || m.includes('textile') || m.includes('embroidery')) return 'mixed-media'
  if (m.includes('oil') || m.includes('acrylic') || m.includes('watercolor') || m.includes('canvas') || m.includes('linen') || m.includes('panel')) return 'painting'
  return null
}

export interface Artwork {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any
  artist: string
  price?: number
  status: string
  medium?: string
}

interface GalleryFilterProps {
  artworks: Artwork[]
}

export function GalleryFilter({ artworks }: GalleryFilterProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [mediumFilter, setMediumFilter] = useState<MediumFilter>('all')

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'available' && artwork.status !== 'sold') ||
        (statusFilter === 'sold' && artwork.status === 'sold')

      const category = getMediumCategory(artwork.medium)
      const mediumMatch =
        mediumFilter === 'all' ||
        (mediumFilter === 'painting' && category === 'painting') ||
        (mediumFilter === 'mixed-media' && category === 'mixed-media') ||
        (mediumFilter === 'sculpture' && category === 'sculpture') ||
        (mediumFilter === 'photography' && category === 'photography')

      return statusMatch && mediumMatch
    })
  }, [artworks, statusFilter, mediumFilter])

  return (
    <div className="space-y-16">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-4 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-gray-400">Status</span>
          {(['all', 'available', 'sold'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs uppercase tracking-widest transition-colors hover:text-black ${
                statusFilter === status ? 'text-black font-medium' : 'text-gray-500'
              }`}
            >
              {status === 'all' ? 'All' : status === 'available' ? 'Available' : 'Sold'}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-gray-400">Medium</span>
          {(['all', 'painting', 'mixed-media', 'sculpture', 'photography'] as const).map((medium) => (
            <button
              key={medium}
              onClick={() => setMediumFilter(medium)}
              className={`text-xs uppercase tracking-widest transition-colors hover:text-black ${
                mediumFilter === medium ? 'text-black font-medium' : 'text-gray-500'
              }`}
            >
              {medium === 'all'
                ? 'All'
                : medium === 'mixed-media'
                  ? 'Mixed Media'
                  : medium.charAt(0).toUpperCase() + medium.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Artwork grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard key={artwork._id} artwork={artwork} />
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <p className="text-xs uppercase tracking-widest text-gray-400 py-16">
          No artworks match the selected filters.
        </p>
      )}
    </div>
  )
}
