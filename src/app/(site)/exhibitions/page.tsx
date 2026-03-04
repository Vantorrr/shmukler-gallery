import { client } from '@sanity/lib/client'
import { EXHIBITIONS_QUERY } from '@sanity/lib/queries'
import { MOCK_EXHIBITIONS } from '@/lib/mockData'
import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@sanity/lib/image'
import { ScrollReveal } from '@/components/ScrollReveal'

export const revalidate = 60

export default async function ExhibitionsPage() {
  let exhibitions = []

  try {
    exhibitions = await client.fetch(EXHIBITIONS_QUERY)
  } catch {
    // ignore
  }
  if (!exhibitions?.length) exhibitions = MOCK_EXHIBITIONS

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="pb-12">
          <ScrollReveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Программа</p>
            <h1 className="font-serif italic leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              Выставки
            </h1>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {exhibitions.map((exhibition: any, i: number) => {
             const imageUrl = exhibition.coverImage?.asset?.url || 
               (exhibition.coverImage ? urlForImage(exhibition.coverImage).url() : null)

            return (
              <ScrollReveal key={exhibition._id} delay={i * 100}>
              <Link 
                href={`/exhibitions/${exhibition.slug.current}`}
                className="group block"
              >
                <div className="aspect-[16/9] relative bg-gray-50 mb-6 overflow-hidden">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={exhibition.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    {new Date(exhibition.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} — {new Date(exhibition.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 className="text-3xl font-serif italic group-hover:opacity-60 transition-opacity">
                    {exhibition.title}
                  </h2>
                  <p className="text-sm font-light text-gray-600">
                    {exhibition.location}
                  </p>
                </div>
              </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}
