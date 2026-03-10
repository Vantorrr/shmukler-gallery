import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    const artwork = await prisma.artwork.update({ where: { id }, data })
    return NextResponse.json(artwork)
  } catch (error) {
    console.error('PUT /api/admin/artworks/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось обновить работу' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.artwork.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/artworks/[id] failed:', error)
    return NextResponse.json({ error: 'Не удалось удалить работу' }, { status: 500 })
  }
}
