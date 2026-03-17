import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_ARTWORKS, MOCK_ARTISTS, MOCK_EXHIBITIONS, MOCK_EVENTS, MOCK_TEAM } from '@/lib/mockData'

function toText(desc: any): string {
  if (!desc) return ''
  if (typeof desc === 'string') return desc
  if (Array.isArray(desc)) {
    return desc.map((block: any) => block?.children?.map((c: any) => c?.text ?? '').join('') ?? '').join('\n')
  }
  return ''
}

const SEED_FAIRS = [
  { title: 'Cosmoscow 2024', slug: 'cosmoscow-2024', dates: '13–15 сентября 2024', location: 'Москва, Гостиный двор', booth: 'Стенд B12', status: 'past', orderIndex: 0 },
  { title: 'Art Moscow 2024', slug: 'art-moscow-2024', dates: '24–28 апреля 2024', location: 'Москва, ЦВЗ «Манеж»', booth: 'Стенд 24', status: 'past', orderIndex: 1 },
]

const SEED_SLIDES = [
  {
    title: 'Shmukler Gallery',
    subtitle: 'Современное искусство в Москве',
    imagePath: 'https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=2000&auto=format&fit=crop',
    linkUrl: '/gallery',
    orderIndex: 0,
    isActive: true,
  },
  {
    title: 'Текущие выставки',
    subtitle: 'Откройте мир современного искусства',
    imagePath: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?q=80&w=2000&auto=format&fit=crop',
    linkUrl: '/exhibitions',
    orderIndex: 1,
    isActive: true,
  },
  {
    title: 'Художники галереи',
    subtitle: 'Резиденты и партнёры Shmukler Gallery',
    imagePath: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=2000&auto=format&fit=crop',
    linkUrl: '/artists',
    orderIndex: 2,
    isActive: true,
  },
]

export async function POST() {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.artwork.deleteMany()
      await tx.artist.deleteMany()
      await tx.exhibition.deleteMany()
      await tx.event.deleteMany()
      await tx.teamMember.deleteMany()
      await tx.fair.deleteMany()
      await tx.heroSlide.deleteMany()

      if (MOCK_ARTISTS.length) {
        await tx.artist.createMany({
          data: MOCK_ARTISTS.map((a: any, i: number) => ({
            name: a.name,
            slug: a.slug?.current || a.name.toLowerCase().replace(/\s+/g, '-'),
            bio: a.bio || null,
            imagePath: a.portrait?.asset?.url || null,
            orderIndex: i,
          })),
        })
      }

      if (MOCK_ARTWORKS.length) {
        await tx.artwork.createMany({
          data: MOCK_ARTWORKS.map((a: any, i: number) => ({
            title: a.title,
            slug: a.slug?.current || a.title.toLowerCase().replace(/\s+/g, '-'),
            artistName: a.artist || a.artistName || null,
            artistSlug: a.artistSlug || null,
            price: a.price || null,
            status: a.status || 'available',
            medium: a.medium || null,
            dimensions: a.dimensions || null,
            description: toText(a.description),
            imagePath: a.mainImage?.asset?.url || a.imagePath || null,
            orderIndex: i,
          })),
        })
      }

      if (MOCK_EXHIBITIONS.length) {
        await tx.exhibition.createMany({
          data: MOCK_EXHIBITIONS.map((e: any, i: number) => ({
            title: e.title,
            slug: e.slug?.current || e.title.toLowerCase().replace(/\s+/g, '-'),
            startDate: e.startDate || null,
            endDate: e.endDate || null,
            location: e.location || null,
            description: toText(e.description),
            coverImage: e.coverImage?.asset?.url || null,
            orderIndex: i,
          })),
        })
      }

      if (MOCK_EVENTS.length) {
        await tx.event.createMany({
          data: MOCK_EVENTS.map((e: any, i: number) => ({
            title: e.title,
            slug: e.slug?.current || e.title.toLowerCase().replace(/\s+/g, '-'),
            date: e.date || null,
            time: e.time || e.startTime || null,
            endTime: e.endTime || null,
            format: e.format || 'offline',
            type: e.type || null,
            price: e.price ?? null,
            location: e.location || null,
            description: toText(e.description),
            coverImage: e.coverImage?.asset?.url || null,
            orderIndex: i,
          })),
        })
      }

      if (MOCK_TEAM.length) {
        await tx.teamMember.createMany({
          data: MOCK_TEAM.map((t: any, i: number) => ({
            name: t.name,
            role: t.role || null,
            bio: t.bio || null,
            imagePath: t.image?.asset?.url || null,
            orderIndex: i,
          })),
        })
      }

      if (SEED_FAIRS.length) {
        await tx.fair.createMany({ data: SEED_FAIRS })
      }

      await tx.heroSlide.createMany({ data: SEED_SLIDES })
    })

    return NextResponse.json({ ok: true, message: 'Данные успешно импортированы' })
  } catch (error) {
    console.error('POST /api/admin/seed failed:', error)
    return NextResponse.json({ error: 'Не удалось импортировать данные' }, { status: 500 })
  }
}
