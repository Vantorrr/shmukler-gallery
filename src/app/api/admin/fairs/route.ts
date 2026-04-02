import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function normalizeFairData(data: any) {
  return {
    ...data,
    isArchived: Boolean(data.isArchived),
    orderIndex: Number(data.orderIndex) || 0,
  }
}

export async function GET() {
  try {
    const items = await prisma.fair.findMany({ orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/fairs failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = normalizeFairData(await req.json())
    const item = await prisma.fair.create({ data })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/fairs failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить ярмарку' }, { status: 500 })
  }
}
