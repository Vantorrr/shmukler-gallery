import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { code, amount } = await req.json()
  if (!code) return NextResponse.json({ error: 'Код не указан' }, { status: 400 })

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase().trim() },
  })

  if (!promo) return NextResponse.json({ error: 'Промокод не найден' }, { status: 404 })
  if (!promo.isActive) return NextResponse.json({ error: 'Промокод неактивен' }, { status: 400 })
  if (promo.expiresAt && new Date() > promo.expiresAt)
    return NextResponse.json({ error: 'Срок действия промокода истёк' }, { status: 400 })
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses)
    return NextResponse.json({ error: 'Промокод уже использован максимальное количество раз' }, { status: 400 })

  let discountAmount = 0
  if (promo.type === 'percent') {
    discountAmount = Math.round((amount * promo.discount) / 100)
  } else {
    discountAmount = promo.discount
  }

  return NextResponse.json({
    ok: true,
    code: promo.code,
    type: promo.type,
    discount: promo.discount,
    discountAmount,
    description: promo.description,
  })
}
