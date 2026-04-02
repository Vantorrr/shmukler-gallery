import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json()
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.artwork.update({
          where: { id },
          data: { orderIndex: index },
        })
      )
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/admin/artworks-reorder failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить порядок' }, { status: 500 })
  }
}
