import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mailer'

const LIFEPAY_API_KEY = process.env.LIFEPAY_API_KEY || ''
const LIFEPAY_LOGIN = process.env.LIFEPAY_LOGIN || ''
const LIFEPAY_URL = 'https://api.life-pay.ru/v1/bill'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, items, delivery, address, comment, amount } = body

    if (!name || !email || !amount) {
      return NextResponse.json({ error: 'Недостаточно данных' }, { status: 400 })
    }

    const orderId = `SG-${Date.now()}`

    // Save order to DB
    await prisma.inquiry.create({
      data: {
        type: 'order',
        name,
        email,
        phone: phone || null,
        message: `Доставка: ${delivery}. Адрес: ${address || '—'}. Комментарий: ${comment || '—'}`,
        items: items || null,
        status: 'new',
      },
    })

    // Create LifePay bill
    const payload = {
      apikey: LIFEPAY_API_KEY,
      login: LIFEPAY_LOGIN,
      amount: String(Number(amount).toFixed(2)),
      description: `Заказ ${orderId} — Шмуклер Галерея. ${items || ''}`.slice(0, 512),
      customer_phone: phone ? phone.replace(/\D/g, '').replace(/^8/, '7') : null,
      customer_email: email,
      method: 'internetAcquiring',
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shmukler-gallery-production.up.railway.app'}/api/lifepay/webhook`,
    }

    const response = await fetch(LIFEPAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (data.code === 0 && data.data?.paymentUrl) {
      sendAdminNotification({
        type: 'order',
        name,
        email,
        phone,
        items,
        amount,
        delivery,
        address,
        comment,
        orderId,
      })
      return NextResponse.json({ ok: true, payUrl: data.data.paymentUrl, orderId })
    } else {
      console.error('LifePay error:', JSON.stringify(data))
      return NextResponse.json({ error: data.message || 'Ошибка платёжной системы' }, { status: 500 })
    }
  } catch (error) {
    console.error('POST /api/lifepay failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
