import { MOCK_EVENTS } from '@/lib/mockData'
import { client } from '@sanity/lib/client'
import { EVENTS_QUERY } from '@sanity/lib/queries'
import { ScrollReveal } from '@/components/ScrollReveal'

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
    const data = await client.fetch(EVENTS_QUERY)
    if (data?.length) events = data
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
            <h1 className="font-serif italic leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
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
            <div className="space-y-0 border-t border-gray-100">
              {onlineCourses.map((event) => (
                <article
                  key={event._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 py-12 border-b border-gray-100"
                >
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-600 font-light">
                      {formatDate(event.date)}
                    </p>
                    {(event.time ?? event.startTime) && (
                      <p className="text-sm text-gray-500 mt-1">{event.time ?? event.startTime}</p>
                    )}
                    <p className="text-xs uppercase tracking-wider text-gray-400 mt-2">
                      {event.format === 'online' ? 'Онлайн' : 'Офлайн'}
                    </p>
                    {event.price !== undefined && (
                      <p className="text-sm font-medium mt-2">
                        {formatPrice(event.price)}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-2xl md:text-3xl font-serif mb-4">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 font-light leading-relaxed mb-2">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                  </div>
                </article>
              ))}
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
            <div className="space-y-0 border-t border-gray-100">
              {upcomingEvents.map((event) => (
                <article
                  key={event._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 py-12 border-b border-gray-100"
                >
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-600 font-light">
                      {formatDate(event.date)}
                    </p>
                    {(event.time ?? event.startTime) && (
                      <p className="text-sm text-gray-500 mt-1">{event.time ?? event.startTime}</p>
                    )}
                    <p className="text-xs uppercase tracking-wider text-gray-400 mt-2">
                      {event.format === 'online' ? 'Онлайн' : 'Офлайн'}
                    </p>
                    {event.price !== undefined && (
                      <p className="text-sm font-medium mt-2">
                        {formatPrice(event.price)}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-2xl md:text-3xl font-serif mb-4">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 font-light leading-relaxed mb-2">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                  </div>
                </article>
              ))}
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
