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
      orderIndex: Number(data.orderIndex) || 0,
    }
    const item = await prisma.event.update({ where: { id }, data: normalized })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/events/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить мероприятие' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/events/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить мероприятие' }, { status: 500 })
  }
}
