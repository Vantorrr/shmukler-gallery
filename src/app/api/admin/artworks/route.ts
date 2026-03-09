import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const artworks = await prisma.artwork.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(artworks)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const artwork = await prisma.artwork.create({ data })
  return NextResponse.json(artwork)
}
