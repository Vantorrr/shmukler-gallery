import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const artist = await prisma.artist.update({ where: { id }, data })
  return NextResponse.json(artist)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.artist.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
