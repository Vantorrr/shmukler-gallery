import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// LifePay sends POST with transaction data
// status: "success" | "fail"
// description: contains our orderId (e.g. "SG-1234567890 — Шмуклер Галерея")
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('LifePay webhook:', JSON.stringify(body))

    const { status, number, amount, description, email, phone } = body

    if (status === 'success') {
      // Extract orderId from description (format: "SG-TIMESTAMP — Шмуклер Галерея...")
      const orderIdMatch = description?.match(/(SG-\d+)/)
      const orderId = orderIdMatch?.[1]

      // Update inquiry status to "done" (paid)
      // Find by email since we don't store orderId in DB
      if (email || orderId) {
        const recent = await prisma.inquiry.findFirst({
          where: {
            type: 'order',
            ...(email ? { email } : {}),
            status: 'new',
          },
          orderBy: { createdAt: 'desc' },
        })

        if (recent) {
          await prisma.inquiry.update({
            where: { id: recent.id },
            data: {
              status: 'done',
              message: `${recent.message}\n\n✅ Оплата подтверждена. LifePay №${number}, сумма: ${amount} ₽`,
            },
          })
        }
      }

      console.log(`✅ Payment success: order=${orderId}, lifepay_number=${number}, amount=${amount}`)
    } else {
      console.log(`❌ Payment failed: lifepay_number=${number}, email=${email}`)
    }

    // Must return 200 so LifePay doesn't retry
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('LifePay webhook error:', error)
    // Still return 200 to avoid retries on our parsing errors
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'LifePay webhook endpoint' })
}
