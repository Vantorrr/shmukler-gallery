import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { PurchaseButton } from '@/components/PurchaseButton'
import { DeliveryModal } from '@/components/DeliveryModal'
import { MOCK_ARTWORKS } from '@/lib/mockData'
import Link from 'next/link'

export const revalidate = 60

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let artwork: any = null

  try {
    artwork = await prisma.artwork.findUnique({ where: { slug } })
  } catch { /* ignore */ }

  // Fallback to mock data
  if (!artwork) {
    const mock = MOCK_ARTWORKS.find(a => a.slug.current === slug)
    if (mock) {
      const m = mock as any
      artwork = {
        id: m._id,
        title: m.title,
        slug: m.slug.current,
        artistName: m.artist,
        artistSlug: m.artistSlug,
        series: m.series,
        year: m.year,
        medium: m.medium,
        materials: m.materials,
        dimensions: m.dimensions,
        description: Array.isArray(m.description) ? m.description.map((b: any) => b.children?.map((c: any) => c.text).join('')).join('\n') : m.description,
        price: m.price,
        status: m.status,
        imagePath: m.mainImage?.asset?.url,
      }
    }
  }

  if (!artwork) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-light text-gray-400">Произведение не найдено</h1>
      </div>
    )
  }

  const imageUrl = artwork.imagePath
  const art = artwork as any

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

        {/* Image */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden bg-gray-50">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={artwork.title}
                width={1200}
                height={1500}
                style={{ width: '100%', height: 'auto' }}
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
              />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-8">

          {/* Artist + Title */}
          <div>
            <Link
              href={`/artists/${art.artistSlug || ''}`}
              className="text-lg md:text-xl font-serif hover:opacity-50 transition-opacity block mb-2 text-black/70"
            >
              {art.artistName || art.artist}
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif leading-snug">{artwork.title}</h1>
          </div>

          {/* Specs table */}
          <div className="space-y-2 text-sm font-light border-t border-gray-100 pt-6">
            {art.series     && <div className="flex gap-3"><span className="text-black/40 w-28 shrink-0">Серия</span><span>{art.series}</span></div>}
            {art.year       && <div className="flex gap-3"><span className="text-black/40 w-28 shrink-0">Год</span><span>{art.year}</span></div>}
            {art.medium     && <div className="flex gap-3"><span className="text-black/40 w-28 shrink-0">Техника</span><span>{art.medium}</span></div>}
            {art.materials  && <div className="flex gap-3"><span className="text-black/40 w-28 shrink-0">Материалы</span><span>{art.materials}</span></div>}
            {art.dimensions && <div className="flex gap-3"><span className="text-black/40 w-28 shrink-0">Размер</span><span>{art.dimensions}</span></div>}
          </div>

          {/* Description */}
          {artwork.description && (
            <div className="prose prose-sm font-light text-gray-600 max-w-none border-t border-gray-100 pt-6">
              {typeof artwork.description === 'string'
                ? <p>{artwork.description}</p>
                : null}
            </div>
          )}

          {/* Purchase block */}
          <div className="border-t border-gray-100 pt-6 space-y-5">
            {art.status === 'available' ? (
              <>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-serif">{art.price?.toLocaleString('ru-RU')} ₽</span>
                </div>

                <PurchaseButton artwork={{ title: art.title, price: art.price ? Number(art.price) : undefined, slug: { current: art.slug?.current ?? art.slug ?? slug } }} />

                <div className="bg-gray-50 px-4 py-3 text-xs text-black/50 space-y-1.5">
                  <p>Сертификат подлинности включён.</p>
                  <p>
                    Безопасная оплата через LifePay.{' '}
                    <DeliveryModal />
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gray-100 p-4 text-center text-gray-500 uppercase tracking-widest text-xs">
                {art.status === 'sold' ? 'Продано' : 'Забронировано'}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
