import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stringifyStringArray } from '@/lib/gallery-helpers'

function normalizeArtworkData(data: any) {
  const normalized = { ...data }
  if ('artistsJson' in normalized) normalized.artistsJson = normalized.artistsJson || null
  if ('variantMode' in normalized) normalized.variantMode = normalized.variantMode || 'single'
  if ('relatedArtworkIds' in normalized) {
    normalized.relatedArtworkIds = Array.isArray(normalized.relatedArtworkIds)
      ? stringifyStringArray(normalized.relatedArtworkIds)
      : (normalized.relatedArtworkIds || '[]')
  }
  if ('price' in normalized) normalized.price = normalized.price !== '' && normalized.price != null ? Number(normalized.price) : null
  if ('year' in normalized) normalized.year = normalized.year !== '' && normalized.year != null ? Number(normalized.year) : null
  if ('orderIndex' in normalized) normalized.orderIndex = Number(normalized.orderIndex) || 0
  return normalized
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const { id: _id, createdAt, updatedAt, ...data } = raw
    const normalized = normalizeArtworkData(data)
    const item = await prisma.artwork.update({ where: { id }, data: normalized })
    return NextResponse.json(item)
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
