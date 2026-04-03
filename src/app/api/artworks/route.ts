import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseStringArray } from '@/lib/gallery-helpers'

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
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined

    // When fetching by slug (detail page), don't restrict by isArchived
    const where: any = (ids || slugFilter) ? {} : { isArchived: false }
    const shouldHideVariantChildren = !ids && !slugFilter

    if (artistSlug) {
      where.OR = [
        { artistSlug },
        { artistsJson: { contains: `"slug":"${artistSlug}"` } },
        { artistsJson: { contains: `"slug":"${artistSlug.toLowerCase()}"` } },
      ]
    }
    if (slugFilter) where.slug = { equals: slugFilter, mode: 'insensitive' }
    if (exhibitionId) where.exhibitionId = exhibitionId
    if (fairId) where.fairId = fairId
    if (ids) where.id = { in: ids.split(',') }
    if (technique) where.medium = { contains: technique, mode: 'insensitive' }
    if (theme) where.theme = { contains: theme, mode: 'insensitive' }
    if (color) where.colorTags = { contains: color, mode: 'insensitive' }
    if (series) where.series = series
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    const orderBy = sortBy === 'price_asc' ? { price: 'asc' as const }
      : sortBy === 'price_desc' ? { price: 'desc' as const }
      : sortBy === 'newest' ? { createdAt: 'desc' as const }
      : { orderIndex: 'asc' as const }

    if (shouldHideVariantChildren) {
      const variantParents = await prisma.artwork.findMany({
        where: {
          isArchived: false,
          variantMode: { in: ['switch', 'bundle'] },
        },
        select: { relatedArtworkIds: true },
      })

      const hiddenIds = Array.from(
        new Set(
          variantParents.flatMap(item => parseStringArray(item.relatedArtworkIds))
        )
      )

      if (hiddenIds.length > 0) {
        where.NOT = [...(Array.isArray(where.NOT) ? where.NOT : where.NOT ? [where.NOT] : []), { id: { in: hiddenIds } }]
      }
    }

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
