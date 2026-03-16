import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    const item = await prisma.collection.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/collections/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить подборку' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.collection.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/collections/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить подборку' }, { status: 500 })
  }
}
