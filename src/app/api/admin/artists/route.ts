import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.artist.findMany({ orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/artists failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await prisma.artist.create({ data })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/artists failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить художника' }, { status: 500 })
  }
}
