import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''
    if (!q || q.length < 2) return NextResponse.json({ artworks: [], artists: [], exhibitions: [] })

    const [artworks, artists, exhibitions] = await Promise.all([
      prisma.artwork.findMany({
        where: {
          isArchived: false,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { artistName: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        orderBy: { orderIndex: 'asc' },
      }),
      prisma.artist.findMany({
        where: {
          isArchived: false,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { bio: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.exhibition.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ])

    return NextResponse.json({ artworks, artists, exhibitions })
  } catch (error) {
    console.error('GET /api/search failed:', error)
    return NextResponse.json({ artworks: [], artists: [], exhibitions: [] })
  }
}
