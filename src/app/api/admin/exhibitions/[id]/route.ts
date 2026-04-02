import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stringifyStringArray } from '@/lib/gallery-helpers'

function normalizeExhibitionData(data: any) {
  const normalized = { ...data }
  if ('eventIds' in normalized) normalized.eventIds = Array.isArray(normalized.eventIds) ? stringifyStringArray(normalized.eventIds) : (normalized.eventIds || '[]')
  if ('isArchived' in normalized) normalized.isArchived = Boolean(normalized.isArchived)
  if ('orderIndex' in normalized) normalized.orderIndex = Number(normalized.orderIndex) || 0
  return normalized
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const { id: _id, createdAt, updatedAt, ...rest } = raw
    const data = normalizeExhibitionData(rest)
    const item = await prisma.exhibition.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/exhibitions/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить выставку' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.exhibition.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/exhibitions/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить выставку' }, { status: 500 })
  }
}
