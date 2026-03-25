import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

function auth() {
  const c = cookies()
  return c.get('admin_token')?.value === process.env.ADMIN_SECRET
}

export async function GET() {
  if (!auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const codes = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(codes)
}

export async function POST(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
}

export async function DELETE(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await prisma.promoCode.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
