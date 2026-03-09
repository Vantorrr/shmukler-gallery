import { client } from '@sanity/lib/client'
import { EXHIBITION_BY_SLUG_QUERY } from '@sanity/lib/queries'
import { MOCK_EXHIBITIONS, MOCK_ARTWORKS } from '@/lib/mockData'
import { PortableText } from '@portabletext/react'
import { ArtworkCard } from '@/components/ArtworkCard'
import Image from 'next/image'
import { urlForImage } from '@sanity/lib/image'

export const revalidate = 60

export default async function ExhibitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let exhibition = null

  try {
    exhibition = await client.fetch(EXHIBITION_BY_SLUG_QUERY, { slug })
  } catch (error) {
    console.error('Failed to fetch exhibition, using mock data:', error)
    const mockExhibition = MOCK_EXHIBITIONS.find(e => e.slug.current === slug)
    if (mockExhibition) {
      exhibition = {
        ...mockExhibition,
        artworks: MOCK_ARTWORKS // Just showing all artworks for mock
      }
    }
  }

  if (!exhibition) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-light text-gray-400">Выставка не найдена</h1>
      </div>
    )
  }

  const imageUrl = exhibition.coverImage?.asset?.url || 
    (exhibition.coverImage ? urlForImage(exhibition.coverImage).url() : null)

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-24 text-center max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            {new Date(exhibition.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} — {new Date(exhibition.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            {exhibition.title}
          </h1>
          <p className="text-sm font-light text-gray-600 uppercase tracking-widest">
            {exhibition.location}
          </p>
        </div>

        {/* Cover Image */}
        {imageUrl && (
          <div className="relative aspect-[21/9] w-full bg-gray-50 mb-24 overflow-hidden">
            <Image
              src={imageUrl}
              alt={exhibition.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Description */}
        <div className="max-w-2xl mx-auto prose prose-lg font-light text-gray-600 mb-24 text-center">
          {typeof exhibition.description === 'string' ? (
            <p>{exhibition.description}</p>
          ) : (
            exhibition.description && <PortableText value={exhibition.description} />
          )}
        </div>

        {/* Artworks */}
        {exhibition.artworks && exhibition.artworks.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-12 text-center">
              Работы на выставке
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibition.artworks.map((artwork: any) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
