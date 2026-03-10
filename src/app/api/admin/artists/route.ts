import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(artists)
  } catch (error) {
    console.error('GET /api/admin/artists failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const artist = await prisma.artist.create({ data })
    return NextResponse.json(artist)
  } catch (error) {
    console.error('POST /api/admin/artists failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить художника' }, { status: 500 })
  }
}
