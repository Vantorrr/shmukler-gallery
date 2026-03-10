import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    const artist = await prisma.artist.update({ where: { id }, data })
    return NextResponse.json(artist)
  } catch (error) {
    console.error('PUT /api/admin/artists/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить художника' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.artist.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/artists/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить художника' }, { status: 500 })
  }
}
