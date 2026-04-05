import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, name, email, phone, message, service, items } = body
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : ''

    if (type === 'subscribe') {
      // Subscribe doesn't require phone/message
      if (!email) return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
      const inquiry = await prisma.inquiry.create({
        data: { type: 'subscribe', name: name || '', email, status: 'new' },
      })
      await sendAdminNotification({ type: 'subscribe', name: name || '—', email })
      return NextResponse.json({ ok: true, id: inquiry.id })
    }

    if (!name || !email || !normalizedPhone) {
      return NextResponse.json({ error: 'Имя, email и телефон обязательны' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        type: type || 'contact',
        name,
        email,
        phone: normalizedPhone,
        message: message || null,
        service: service || null,
        items: items || null,
        status: 'new',
      },
    })

    await sendAdminNotification({ type: type || 'contact', name, email, phone: normalizedPhone, message, service, items })

    return NextResponse.json({ ok: true, id: inquiry.id })
  } catch (error) {
    console.error('POST /api/inquiries failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
