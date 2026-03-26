import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.artwork.findMany({ orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/artworks failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base
  let i = 2
  while (await prisma.artwork.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`
  }
  return slug
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const { id: _id, createdAt, updatedAt, ...data } = raw
    const normalized = {
      ...data,
      slug: await uniqueSlug(data.slug || ''),
      price: data.price !== '' && data.price != null ? Number(data.price) : null,
      year: data.year !== '' && data.year != null ? Number(data.year) : null,
      orderIndex: Number(data.orderIndex) || 0,
    }
    const item = await prisma.artwork.create({ data: normalized })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/artworks failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить работу' }, { status: 500 })
  }
}
