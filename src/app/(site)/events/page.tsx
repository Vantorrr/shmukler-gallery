import { MOCK_EVENTS } from '@/lib/mockData'
import { prisma } from '@/lib/prisma'
import { ScrollReveal } from '@/components/ScrollReveal'
import Image from 'next/image'

export const revalidate = 60

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPrice(price: number) {
  if (price === 0) return 'Бесплатно'
  return `${price.toLocaleString('ru-RU')} ₽`
}

export default async function EventsPage() {
  let events: Array<{
    _id: string
    title: string
    date: string
    time?: string
    startTime?: string
    format?: string
    price?: number
    description?: string
    location?: string
    category?: string
    type?: string
  }> = []

  try {
    const data = await prisma.event.findMany({ orderBy: { date: 'asc' } })
    if (data?.length) {
      events = data.map((e: any) => ({
        _id: e.id,
        title: e.title,
        date: e.date || '',
        time: e.time || '',
        startTime: e.time || '',
        format: e.format || 'offline',
        price: e.price ?? 0,
        description: e.description || '',
        location: e.location || '',
        category: e.format === 'online' ? 'course' : 'event',
        coverImage: e.coverImagePath ? { asset: { url: e.coverImagePath } } : undefined,
      })) as any
    }
  } catch {
    // ignore
  }
  if (!events?.length) events = MOCK_EVENTS

  const getCategory = (e: (typeof events)[0]) =>
    e.category ?? (e.type === 'masterclass' || e.type === 'lecture' ? 'course' : 'event')

  const onlineCourses = events.filter((e) => getCategory(e) === 'course')
  const upcomingEvents = events.filter((e) => getCategory(e) === 'event')

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="pb-12">
          <ScrollReveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Афиша</p>
            <h1 className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              Мероприятия
            </h1>
          </ScrollReveal>
        </div>

        {/* Online Courses */}
        {onlineCourses.length > 0 && (
          <ScrollReveal>
          <section className="mb-24">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-12">
              Онлайн-курсы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {onlineCourses.map((event) => {
                const ev = event as any
                const imgUrl = ev.coverImage?.asset?.url
                return (
                  <article key={event._id} className="group">
                    {imgUrl && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                        <Image src={imgUrl} alt={event.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 bg-white text-black text-[9px] px-2.5 py-1 uppercase tracking-widest">
                          {event.format === 'online' ? 'Онлайн' : 'Офлайн'}
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] uppercase tracking-widest text-black/30 mb-1">{formatDate(event.date)}{(event.time ?? event.startTime) ? ` · ${event.time ?? event.startTime}` : ''}</p>
                    <h3 className="font-serif text-lg leading-snug mb-2">{event.title}</h3>
                    {event.description && <p className="text-sm font-light text-black/50 leading-relaxed mb-2">{event.description}</p>}
                    <div className="flex items-center justify-between">
                      {event.location && <p className="text-xs text-black/30">{event.location}</p>}
                      {event.price !== undefined && <p className="text-sm font-serif">{formatPrice(event.price)}</p>}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
          </ScrollReveal>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <ScrollReveal>
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-12">
              Ближайшие события
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => {
                const ev = event as any
                const imgUrl = ev.coverImage?.asset?.url
                return (
                  <article key={event._id} className="group">
                    {imgUrl && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                        <Image src={imgUrl} alt={event.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 bg-white text-black text-[9px] px-2.5 py-1 uppercase tracking-widest">
                          {event.format === 'online' ? 'Онлайн' : 'Офлайн'}
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] uppercase tracking-widest text-black/30 mb-1">{formatDate(event.date)}{(event.time ?? event.startTime) ? ` · ${event.time ?? event.startTime}` : ''}</p>
                    <h3 className="font-serif text-lg leading-snug mb-2">{event.title}</h3>
                    {event.description && <p className="text-sm font-light text-black/50 leading-relaxed mb-2">{event.description}</p>}
                    <div className="flex items-center justify-between">
                      {event.location && <p className="text-xs text-black/30">{event.location}</p>}
                      {event.price !== undefined && <p className="text-sm font-serif">{formatPrice(event.price)}</p>}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
          </ScrollReveal>
        )}

        {events.length === 0 && (
          <p className="text-gray-500 font-light">В настоящее время мероприятий нет.</p>
        )}
      </div>
    </div>
  )
}
