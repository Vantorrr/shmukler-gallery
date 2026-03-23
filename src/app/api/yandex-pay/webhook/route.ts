import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Yandex Pay webhook:', JSON.stringify(body))

    const event = body.event
    const orderId = body.order?.orderId || body.orderId || ''
    const status = body.order?.status || body.status || ''

    if (event === 'ORDER_STATUS_UPDATED' && status === 'SUCCESS' && orderId) {
      await prisma.inquiry.updateMany({
        where: { message: { contains: orderId } },
        data: {
          status: 'done',
          message: `Оплачено через Яндекс Пэй. Статус: ${status}. ID заказа: ${orderId}`,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Yandex Pay webhook error:', e)
    return NextResponse.json({ ok: true })
  }
}
