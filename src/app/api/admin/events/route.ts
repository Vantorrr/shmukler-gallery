import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/events failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await prisma.event.create({ data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('POST /api/admin/events failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить мероприятие' }, { status: 500 })
  }
}
