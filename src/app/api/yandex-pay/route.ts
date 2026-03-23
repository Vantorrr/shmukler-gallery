import { NextRequest, NextResponse } from 'next/server'

const MERCHANT_ID = process.env.YANDEX_PAY_MERCHANT_ID || ''
const API_KEY = process.env.YANDEX_PAY_API_KEY || ''
const IS_TEST = process.env.YANDEX_PAY_TEST === 'true'
const BASE_URL = IS_TEST
  ? 'https://sandbox.pay.yandex.ru/api/merchant/v1/orders'
  : 'https://pay.yandex.ru/api/merchant/v1/orders'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shmuklergallery.com'

export async function POST(req: NextRequest) {
  try {
    if (!MERCHANT_ID || !API_KEY) {
      return NextResponse.json({ error: 'Яндекс Пэй не настроен' }, { status: 500 })
    }

    const body = await req.json()
    const { name, email, phone, items, amount, delivery, address, comment, paymentMethod } = body

    const orderId = `shmukler-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    // Parse items into cart
    const cartItems = (items as string)
      .split(';')
      .map((s: string, i: number) => {
        const match = s.trim().match(/^(.+)\((.+) ₽\)$/)
        return {
          productId: `item-${i}`,
          title: match?.[1]?.trim() || s.trim(),
          quantity: { count: '1' },
          total: match?.[2]?.replace(/\s/g, '') || String(amount),
        }
      })

    const orderData = {
      orderId,
      merchantId: MERCHANT_ID,
      currencyCode: 'RUB',
      cart: {
        items: cartItems,
        total: { amount: String(Number(amount).toFixed(2)) },
      },
      availablePaymentMethods: paymentMethod === 'split' ? ['SPLIT'] : ['CARD', 'SPLIT'],
      redirectUrls: {
        onSuccess: `${SITE_URL}/payment/success`,
        onError: `${SITE_URL}/payment/fail`,
      },
      ttl: 1800,
      orderDetails: {
        customerContact: { email, phone, fullName: name },
        deliveryInfo: {
          deliveryType: 'COURIER',
          address: { addressLine: address || delivery || '' },
          comment: comment || '',
        },
      },
    }

    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key ${API_KEY}`,
        'X-Request-Id': orderId,
      },
      body: JSON.stringify(orderData),
    })

    const data = await res.json()
    console.log('Yandex Pay response:', JSON.stringify(data))

    if (data.data?.paymentUrl) {
      return NextResponse.json({ ok: true, payUrl: data.data.paymentUrl, orderId })
    }

    return NextResponse.json({
      ok: false,
      error: data.message || data.status || 'Ошибка создания заказа',
    }, { status: 400 })
  } catch (e) {
    console.error('Yandex Pay error:', e)
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
