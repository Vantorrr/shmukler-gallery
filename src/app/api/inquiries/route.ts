import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, name, email, phone, message, service, items } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Имя и email обязательны' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        type: type || 'contact',
        name,
        email,
        phone: phone || null,
        message: message || null,
        service: service || null,
        items: items || null,
        status: 'new',
      },
    })

    return NextResponse.json({ ok: true, id: inquiry.id })
  } catch (error) {
    console.error('POST /api/inquiries failed:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
