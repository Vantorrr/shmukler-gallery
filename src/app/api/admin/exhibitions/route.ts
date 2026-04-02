import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stringifyStringArray } from '@/lib/gallery-helpers'

function normalizeExhibitionData(data: any) {
  return {
    ...data,
    eventIds: Array.isArray(data.eventIds) ? stringifyStringArray(data.eventIds) : (data.eventIds || '[]'),
    isArchived: Boolean(data.isArchived),
    orderIndex: Number(data.orderIndex) || 0,
  }
}

export async function GET() {
  try {
    const items = await prisma.exhibition.findMany({ orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/exhibitions failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = normalizeExhibitionData(await req.json())
    const item = await prisma.exhibition.create({ data })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/exhibitions failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить выставку' }, { status: 500 })
  }
}
