import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { id: _id, createdAt, usedCount, ...data } = body

    if (data.expiresAt === '' || data.expiresAt === null) data.expiresAt = null
    else if (data.expiresAt) data.expiresAt = new Date(data.expiresAt)

    if (data.maxUses === '' || data.maxUses === null) data.maxUses = null
    else if (data.maxUses !== undefined) data.maxUses = Number(data.maxUses)

    if (data.discount !== undefined) data.discount = Number(data.discount)
    if (data.code) data.code = data.code.toUpperCase().trim()

    const updated = await prisma.promoCode.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/admin/promo-codes/[id] failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.promoCode.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/promo-codes/[id] failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
