import Link from 'next/link'
import Image from 'next/image'

type Artwork = {
  id?: string
  _id?: string
  title: string
  slug: string | { current: string }
  artistName?: string
  artist?: string
  price?: number
  status?: string
  medium?: string
  imagePath?: string
  mainImage?: { asset?: { url?: string } }
}

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const slug = typeof artwork.slug === 'string' ? artwork.slug : artwork.slug?.current
  const imageUrl = artwork.imagePath || artwork.mainImage?.asset?.url
  const artist = artwork.artistName || artwork.artist

  return (
    <Link href={`/artwork/${slug}`} className="group block">
      <div className="relative bg-gray-50 overflow-hidden mb-4" style={{ aspectRatio: '3/4' }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {artwork.status === 'sold' && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1">
            Продано
          </div>
        )}
        {artwork.status === 'reserved' && (
          <div className="absolute top-3 left-3 bg-gray-800 text-white text-[10px] uppercase tracking-widest px-2 py-1">
            Зарезервировано
          </div>
        )}
      </div>
      <div className="space-y-1">
        {artist && <p className="text-xs text-gray-500 uppercase tracking-widest">{artist}</p>}
        <h3 className="text-base font-serif group-hover:opacity-60 transition-opacity">{artwork.title}</h3>
        {artwork.price && artwork.status !== 'sold' && (
          <p className="text-sm font-light text-gray-600">{artwork.price.toLocaleString('ru-RU')} ₽</p>
        )}
      </div>
    </Link>
  )
}
