import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_ARTWORKS, MOCK_ARTISTS, MOCK_EXHIBITIONS, MOCK_EVENTS, MOCK_TEAM } from '@/lib/mockData'

const SEED_FAIRS = [
  {
    title: 'Cosmoscow 2025',
    slug: 'cosmoscow-2025',
    dates: '5–7 сентября 2025',
    location: 'Гостиный Двор, Москва',
    status: 'past',
    description: 'Международная ярмарка современного искусства. Галерея Шмуклер представила работы шести художников.',
    coverImage: 'https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=1200&auto=format&fit=crop',
    booth: 'Стенд B12',
    orderIndex: 1,
  },
  {
    title: 'Blazar 2026',
    slug: 'blazar-2026',
    dates: '12–14 апреля 2026',
    location: 'Центральный Манеж, Москва',
    status: 'upcoming',
    description: 'Ярмарка молодого искусства. Shmukler Gallery впервые участвует с программой резидентов.',
    coverImage: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?q=80&w=1200&auto=format&fit=crop',
    booth: 'Стенд A05',
    orderIndex: 0,
  },
  {
    title: 'Catalog Fair 2025',
    slug: 'catalog-fair-2025',
    dates: '20–22 ноября 2025',
    location: 'Новая Голландия, Санкт-Петербург',
    status: 'past',
    description: 'Ярмарка печатного и цифрового искусства.',
    coverImage: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=1200&auto=format&fit=crop',
    booth: 'Стенд C03',
    orderIndex: 2,
  },
]

function toPlainText(value: unknown) {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .map((block: any) => (block?.children || []).map((c: any) => c?.text || '').join(''))
    .join('\n')
    .trim()
}

export async function POST() {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.artwork.deleteMany()
      await tx.artist.deleteMany()
      await tx.exhibition.deleteMany()
      await tx.event.deleteMany()
      await tx.teamMember.deleteMany()
      await tx.fair.deleteMany()

      if (MOCK_ARTISTS.length) {
        await tx.artist.createMany({
          data: MOCK_ARTISTS.map((a: any) => ({
            name: a.name,
            slug: a.slug?.current || a.slug,
            bio: toPlainText(a.bio),
            portraitPath: a.portrait?.asset?.url || null,
          })),
        })
      }

      if (MOCK_ARTWORKS.length) {
        await tx.artwork.createMany({
          data: MOCK_ARTWORKS.map((a: any) => ({
            title: a.title,
            slug: a.slug?.current || a.slug,
            artistName: a.artist,
            artistSlug: a.artistSlug || null,
            series: a.series || null,
            year: a.year || null,
            medium: a.medium || null,
            materials: a.materials || null,
            dimensions: a.dimensions || null,
            description: toPlainText(a.description) || null,
            price: a.price ?? null,
            status: a.status || 'available',
            imagePath: a.mainImage?.asset?.url || null,
          })),
        })
      }

      if (MOCK_EXHIBITIONS.length) {
        await tx.exhibition.createMany({
          data: MOCK_EXHIBITIONS.map((e: any) => ({
            title: e.title,
            slug: e.slug?.current || e.slug,
            description: toPlainText(e.description) || null,
            startDate: e.startDate || null,
            endDate: e.endDate || null,
            location: e.location || null,
            coverImagePath: e.coverImage?.asset?.url || null,
            isCurrent: false,
          })),
        })
      }

      if (MOCK_EVENTS.length) {
        await tx.event.createMany({
          data: MOCK_EVENTS.map((e: any) => ({
            title: e.title,
            description: e.description || null,
            date: e.date || null,
            time: e.time || e.startTime || null,
            location: e.location || null,
            format: e.format || 'offline',
            price: e.price ?? null,
            coverImagePath: e.coverImage?.asset?.url || null,
          })),
        })
      }

      if (MOCK_TEAM.length) {
        await tx.teamMember.createMany({
          data: MOCK_TEAM.map((m: any, i: number) => ({
            name: m.name,
            role: m.role || null,
            bio: toPlainText(m.bio) || null,
            imagePath: m.image?.asset?.url || null,
            orderIndex: i,
          })),
        })
      }

      if (SEED_FAIRS.length) {
        await tx.fair.createMany({
          data: SEED_FAIRS.map((f: any) => ({
            title: f.title,
            slug: f.slug,
            dates: f.dates || null,
            location: f.location || null,
            booth: f.booth || null,
            description: f.description || null,
            coverImage: f.coverImage || null,
            status: f.status || 'upcoming',
            orderIndex: f.orderIndex ?? 0,
          })),
        })
      }
    })

    return NextResponse.json({
      ok: true,
      message: 'Текущие данные сайта перенесены в админку',
      counts: {
        artworks: MOCK_ARTWORKS.length,
        artists: MOCK_ARTISTS.length,
        exhibitions: MOCK_EXHIBITIONS.length,
        events: MOCK_EVENTS.length,
        team: MOCK_TEAM.length,
        fairs: SEED_FAIRS.length,
      },
    })
  } catch (error) {
    console.error('POST /api/admin/seed failed:', error)
    return NextResponse.json({ error: 'Не удалось импортировать данные в БД' }, { status: 500 })
  }
}
