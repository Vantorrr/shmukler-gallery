import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || undefined
  try {
    const where: any = { isArchived: false }
    if (slug) where.slug = slug

    const items = await prisma.artist.findMany({
      where,
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(slug ? (items[0] ?? null) : items)
  } catch (error) {
    console.error('GET /api/artists failed:', error)
    return NextResponse.json(slug ? null : [])
  }
}
