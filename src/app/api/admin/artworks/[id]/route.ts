import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const { id: _id, createdAt, updatedAt, ...data } = raw
    const normalized = {
      ...data,
      price: data.price !== '' && data.price != null ? Number(data.price) : null,
      year: data.year !== '' && data.year != null ? Number(data.year) : null,
      orderIndex: Number(data.orderIndex) || 0,
    }
    const item = await prisma.artwork.update({ where: { id }, data: normalized })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/artworks/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить работу' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.artwork.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/artworks/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить работу' }, { status: 500 })
  }
}
