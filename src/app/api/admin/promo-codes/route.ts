import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const codes = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(codes)
  } catch (error) {
    console.error('GET /api/admin/promo-codes failed:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (data.expiresAt === '' || data.expiresAt === null) data.expiresAt = null
    else if (data.expiresAt) data.expiresAt = new Date(data.expiresAt)

    if (data.maxUses === '' || data.maxUses === null) data.maxUses = null
    else if (data.maxUses !== undefined) data.maxUses = Number(data.maxUses)

    if (data.discount !== undefined) data.discount = Number(data.discount)
    data.code = data.code?.toUpperCase().trim()

    if (id) {
      const updated = await prisma.promoCode.update({ where: { id }, data })
      return NextResponse.json(updated)
    }
    const created = await prisma.promoCode.create({ data })
    return NextResponse.json(created)
  } catch (error) {
    console.error('POST /api/admin/promo-codes failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await prisma.promoCode.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/promo-codes failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
