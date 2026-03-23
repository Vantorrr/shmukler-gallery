import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const artistSlug = searchParams.get('artist') || undefined
    const slugFilter = searchParams.get('slug') || undefined
    const exhibitionId = searchParams.get('exhibitionId') || undefined
    const fairId = searchParams.get('fairId') || undefined
    const ids = searchParams.get('ids') || undefined
    const technique = searchParams.get('technique') || undefined
    const theme = searchParams.get('theme') || undefined
    const color = searchParams.get('color') || undefined
    const series = searchParams.get('series') || undefined
    const sortBy = searchParams.get('sortBy') || 'orderIndex'

    const where: any = ids ? {} : { isArchived: false }
    if (artistSlug) where.artistSlug = artistSlug
    if (slugFilter) where.slug = slugFilter
    if (exhibitionId) where.exhibitionId = exhibitionId
    if (fairId) where.fairId = fairId
    if (ids) where.id = { in: ids.split(',') }
    if (technique) where.medium = { contains: technique, mode: 'insensitive' }
    if (theme) where.theme = { contains: theme, mode: 'insensitive' }
    if (color) where.colorTags = { contains: color, mode: 'insensitive' }
    if (series) where.series = series

    const orderBy = sortBy === 'price_asc' ? { price: 'asc' as const }
      : sortBy === 'price_desc' ? { price: 'desc' as const }
      : sortBy === 'newest' ? { createdAt: 'desc' as const }
      : { orderIndex: 'asc' as const }

    const [items, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.artwork.count({ where }),
    ])

    return NextResponse.json({ items, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('GET /api/artworks failed:', error)
    return NextResponse.json({ items: [], total: 0, page: 1, limit: 20, pages: 0 })
  }
}
