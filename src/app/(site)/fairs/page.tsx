import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ScrollReveal'
import { prisma } from '@/lib/prisma'

const MOCK_FAIRS = [
  {
    _id: 'fair-1',
    title: 'Cosmoscow 2025',
    slug: { current: 'cosmoscow-2025' },
    dates: '5–7 сентября 2025',
    location: 'Гостиный Двор, Москва',
    status: 'past',
    description: 'Международная ярмарка современного искусства. Галерея Шмуклер представила работы шести художников.',
    coverImage: 'https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=1200&auto=format&fit=crop',
    booth: 'Стенд B12',
  },
  {
    _id: 'fair-2',
    title: 'Blazar 2026',
    slug: { current: 'blazar-2026' },
    dates: '12–14 апреля 2026',
    location: 'Центральный Манеж, Москва',
    status: 'upcoming',
    description: 'Ярмарка молодого искусства. Shmukler Gallery впервые участвует с программой резидентов.',
    coverImage: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?q=80&w=1200&auto=format&fit=crop',
    booth: 'Стенд A05',
  },
  {
    _id: 'fair-3',
    title: 'Catalog Fair 2025',
    slug: { current: 'catalog-fair-2025' },
    dates: '20–22 ноября 2025',
    location: 'Новая Голландия, Санкт-Петербург',
    status: 'past',
    description: 'Ярмарка печатного и цифрового искусства.',
    coverImage: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=1200&auto=format&fit=crop',
    booth: 'Стенд C03',
  },
]

export default async function FairsPage() {
  let fairs: any[] = []
  try {
    const dbFairs = await prisma.fair.findMany({
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    })
    fairs = dbFairs.map((f: any) => ({
      _id: f.id,
      title: f.title,
      slug: { current: f.slug },
      dates: f.dates,
      location: f.location,
      status: f.status,
      description: f.description,
      coverImage: f.coverImage,
      booth: f.booth,
    }))
  } catch {
    // ignore
  }
  if (!fairs?.length) fairs = MOCK_FAIRS

  const upcoming = fairs.filter(f => f.status === 'upcoming')
  const past     = fairs.filter(f => f.status === 'past')

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">

        <div className="pb-12">
          <ScrollReveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Участие</p>
            <h1 className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              Ярмарки
            </h1>
          </ScrollReveal>
        </div>

        {upcoming.length > 0 && (
          <section className="mb-20">
            <ScrollReveal>
              <h2 className="text-xs uppercase tracking-[0.4em] text-black/40 mb-10">Предстоящие</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcoming.map((fair, i) => (
                <ScrollReveal key={fair._id} delay={i * 80}>
                  <article className="group">
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 mb-5">
                      <Image src={fair.coverImage} alt={fair.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 left-4 bg-black text-white text-[9px] px-3 py-1.5 uppercase tracking-widest">
                        Скоро
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-black/40">{fair.dates} · {fair.location}</p>
                      <h3 className="text-2xl font-serif">{fair.title}</h3>
                      <p className="text-sm font-light text-black/50">{fair.booth}</p>
                      <p className="text-sm font-light text-black/60 leading-relaxed pt-1">{fair.description}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <ScrollReveal>
              <h2 className="text-xs uppercase tracking-[0.4em] text-black/40 mb-10 border-t border-black/8 pt-12">Архив</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {past.map((fair, i) => (
                <ScrollReveal key={fair._id} delay={i * 60}>
                  <article className="group">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                      <Image src={fair.coverImage} alt={fair.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-black/30 mb-1">{fair.dates}</p>
                    <h3 className="text-lg font-serif mb-1">{fair.title}</h3>
                    <p className="text-xs text-black/40">{fair.location} · {fair.booth}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        <ScrollReveal>
          <div className="mt-24 pt-12 border-t border-black/8 text-center">
            <p className="text-sm text-black/40 font-light mb-6">Хотите видеть нас на конкретной ярмарке?</p>
            <Link href="/contact" className="inline-flex items-center gap-3 text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-40 transition-opacity">
              Написать нам
              <span className="w-8 h-px bg-black block" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  )
}
