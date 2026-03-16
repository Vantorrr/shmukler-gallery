import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    const item = await prisma.announcement.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/announcements/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить анонс' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.announcement.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/announcements/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить анонс' }, { status: 500 })
  }
}
