import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.heroSlide.findMany({ orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/hero-slides failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await prisma.heroSlide.create({ data })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/hero-slides failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить слайд' }, { status: 500 })
  }
}
