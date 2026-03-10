import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_ARTWORKS, MOCK_ARTISTS, MOCK_EXHIBITIONS, MOCK_EVENTS } from '@/lib/mockData'

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
    })

    return NextResponse.json({
      ok: true,
      message: 'Текущие данные сайта перенесены в админку',
      counts: {
        artworks: MOCK_ARTWORKS.length,
        artists: MOCK_ARTISTS.length,
        exhibitions: MOCK_EXHIBITIONS.length,
        events: MOCK_EVENTS.length,
      },
    })
  } catch (error) {
    console.error('POST /api/admin/seed failed:', error)
    return NextResponse.json({ error: 'Не удалось импортировать данные в БД' }, { status: 500 })
  }
}
