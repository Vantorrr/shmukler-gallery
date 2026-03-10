import { prisma } from '@/lib/prisma'
import { MOCK_ARTISTS, MOCK_ARTWORKS } from '@/lib/mockData'
import { ArtworkCard } from '@/components/ArtworkCard'
import Image from 'next/image'

export const revalidate = 60

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let artist: any = null

  try {
    const [dbArtist, dbArtworks] = await Promise.all([
      prisma.artist.findUnique({ where: { slug } }),
      prisma.artwork.findMany({ where: { artistSlug: slug }, orderBy: { createdAt: 'desc' } }),
    ])
    if (dbArtist) {
      artist = {
        _id: dbArtist.id,
        name: dbArtist.name,
        slug: { current: dbArtist.slug },
        bio: dbArtist.bio,
        portrait: dbArtist.portraitPath ? { asset: { url: dbArtist.portraitPath } } : null,
        artworks: dbArtworks.map((a: any) => ({
          _id: a.id,
          title: a.title,
          slug: { current: a.slug },
          mainImage: a.imagePath ? { asset: { url: a.imagePath } } : null,
          artist: a.artistName,
          artistSlug: a.artistSlug,
          price: a.price,
          status: a.status,
          medium: a.medium,
          dimensions: a.dimensions,
        })),
      }
    }
  } catch (error) {
    console.error('Failed to fetch artist, using mock data:', error)
  }

  if (!artist) {
    const mockArtist = MOCK_ARTISTS.find(a => a.slug.current === slug)
    if (mockArtist) {
      artist = {
        ...mockArtist,
        artworks: MOCK_ARTWORKS.filter(w => w.artistSlug === slug)
      }
    }
  }

  if (!artist) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-light text-gray-400">Художник не найден</h1>
      </div>
    )
  }

  const imageUrl = artist.portrait?.asset?.url || null

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* Artist Info - Sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif leading-tight">
            {artist.name}
          </h1>
          
          {imageUrl && (
            <div className="relative aspect-[3/4] w-full max-w-sm bg-gray-50 overflow-hidden">
              <Image
                src={imageUrl}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-sm font-light text-gray-600 max-w-none">
            {artist.bio && <p>{artist.bio}</p>}
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="lg:col-span-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-2">
            Избранные работы
          </h2>
          
          {artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {artist.artworks.map((artwork: any) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-light italic">В данный момент работы отсутствуют.</p>
          )}
        </div>
      </div>
    </div>
  )
}
