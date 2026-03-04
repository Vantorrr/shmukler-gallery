import { client } from '@sanity/lib/client'
import { ARTWORK_BY_SLUG_QUERY } from '@sanity/lib/queries'
import { urlForImage } from '@sanity/lib/image'
import Image from 'next/image'
import { PurchaseButton } from '@/components/PurchaseButton'
import { PortableText } from '@portabletext/react'
import { MOCK_ARTWORKS } from '@/lib/mockData'
import Link from 'next/link'

export const revalidate = 60

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let artwork = null

  try {
    artwork = await client.fetch(ARTWORK_BY_SLUG_QUERY, { slug })
  } catch (error) {
    console.error('Failed to fetch artwork from Sanity, using mock data:', error)
    artwork = MOCK_ARTWORKS.find(a => a.slug.current === slug)
  }

  if (!artwork) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-light text-gray-400">Произведение не найдено</h1>
      </div>
    )
  }

  const imageUrl = artwork.mainImage?.asset?.url || 
    (artwork.mainImage ? urlForImage(artwork.mainImage).url() : null)

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* Image Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-[3/4] w-full bg-gray-50 cursor-zoom-in">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            )}
          </div>
          
          {artwork.gallery && artwork.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {artwork.gallery.map((image: any, index: number) => {
                const galleryImageUrl = image?.asset?.url || (image ? urlForImage(image).url() : null)
                if (!galleryImageUrl) return null
                
                return (
                  <div key={index} className="relative aspect-square bg-gray-50 cursor-pointer hover:opacity-80 transition-opacity">
                    <Image
                      src={galleryImageUrl}
                      alt={`${artwork.title} detail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit flex flex-col justify-center space-y-10">
          <div>
            <Link 
              href={`/artists/${artwork.artistSlug}`}
              className="text-xl md:text-2xl font-serif italic hover:opacity-60 transition-opacity block mb-2"
            >
              {artwork.artist}
            </Link>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">{artwork.title}</h1>
            
            <div className="space-y-2 text-sm font-light text-gray-600 border-t border-gray-100 pt-6">
              {artwork.medium && <p><span className="font-medium text-black mr-2">Техника:</span> {artwork.medium}</p>}
              {artwork.dimensions && <p><span className="font-medium text-black mr-2">Размер:</span> {artwork.dimensions}</p>}
              {artwork.year && <p><span className="font-medium text-black mr-2">Год:</span> {artwork.year}</p>}
            </div>
          </div>

          {artwork.description && (
            <div className="prose prose-sm font-light text-gray-600 max-w-none">
              <PortableText value={artwork.description} />
            </div>
          )}

          <div className="pt-8 border-t border-gray-100 space-y-6">
            {artwork.status === 'available' ? (
              <>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-light">{artwork.price?.toLocaleString('ru-RU')} ₽</span>
                  <span className="text-xs uppercase tracking-widest text-gray-400">Доставка включена</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <PurchaseButton artwork={artwork} />
                  <button className="w-full border border-black py-4 uppercase tracking-widest text-xs font-medium hover:bg-black hover:text-white transition-colors">
                    Узнать подробнее
                  </button>
                </div>
                
                <div className="bg-gray-50 p-4 text-xs text-gray-500 flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />
                  <p>Оплата 4 частями без процентов по {(artwork.price / 4).toLocaleString('ru-RU')} ₽ с Долями</p>
                </div>
              </>
            ) : (
              <div className="bg-gray-100 p-4 text-center text-gray-500 uppercase tracking-widest text-xs">
                {artwork.status === 'sold' ? 'Продано' : 'Забронировано'}
              </div>
            )}
            
            <div className="text-xs text-gray-400 font-light space-y-2 pt-4">
              <p>Подлинность гарантирована. Сертификат подлинности включён.</p>
              <p>Безопасная оплата через LifePay. Доставка по всему миру.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
