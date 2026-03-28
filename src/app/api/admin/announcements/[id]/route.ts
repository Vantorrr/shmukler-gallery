import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function normalizeAnnouncementData(raw: any) {
  const data = { ...raw }
  if (data.expiresAt === '' || data.expiresAt == null) data.expiresAt = null
  else data.expiresAt = new Date(data.expiresAt)
  if (data.linkUrl === '') data.linkUrl = null
  return data
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const { id: _id, createdAt, ...rest } = raw
    const data = normalizeAnnouncementData(rest)
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
