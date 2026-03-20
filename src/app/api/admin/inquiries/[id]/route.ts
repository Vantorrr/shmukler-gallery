import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const { id: _id, createdAt, ...data } = raw
    const item = await prisma.inquiry.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/admin/inquiries/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить заявку' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.inquiry.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/inquiries/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить заявку' }, { status: 500 })
  }
}
