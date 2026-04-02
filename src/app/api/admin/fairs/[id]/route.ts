import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function normalizeFairData(data: any) {
  const normalized = { ...data }
  if ('isArchived' in normalized) normalized.isArchived = Boolean(normalized.isArchived)
  if ('orderIndex' in normalized) normalized.orderIndex = Number(normalized.orderIndex) || 0
  return normalized
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const { id: _id, createdAt, updatedAt, ...rest } = raw
    const data = normalizeFairData(rest)
    const item = await prisma.fair.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/fairs/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить ярмарку' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.fair.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/fairs/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить ярмарку' }, { status: 500 })
  }
}
