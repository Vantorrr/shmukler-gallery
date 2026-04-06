import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Yandex Pay webhook:', JSON.stringify(body))

    const event = body.event
    const orderId = body.order?.orderId || body.orderId || ''
    const status = body.order?.status || body.status || ''

    if (event === 'ORDER_STATUS_UPDATED' && status === 'SUCCESS' && orderId) {
      const inquiry = await prisma.inquiry.findFirst({
        where: {
          type: 'order',
          message: { contains: orderId },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (inquiry) {
        const updated = await prisma.inquiry.update({
          where: { id: inquiry.id },
          data: {
            status: 'done',
            message: `${inquiry.message || ''}\n\n✅ Оплата подтверждена. Yandex Pay / Split. Статус: ${status}. ID заказа: ${orderId}`.trim(),
          },
        })

        await sendAdminNotification({
          type: 'order_paid',
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          items: updated.items,
          orderId,
          paymentProvider: 'Yandex Pay / Split',
          paymentStatus: 'Оплачено',
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Yandex Pay webhook error:', e)
    return NextResponse.json({ ok: true })
  }
}
