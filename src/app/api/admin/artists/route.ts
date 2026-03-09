import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const artists = await prisma.artist.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(artists)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const artist = await prisma.artist.create({ data })
  return NextResponse.json(artist)
}
