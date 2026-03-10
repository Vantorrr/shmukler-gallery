import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.exhibition.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/exhibitions failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await prisma.exhibition.create({ data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('POST /api/admin/exhibitions failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить выставку' }, { status: 500 })
  }
}
