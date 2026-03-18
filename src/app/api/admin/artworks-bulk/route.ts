import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const store = await cookies()
  return store.get('admin_token')?.value === process.env.ADMIN_PASSWORD
}

// POST /api/admin/artworks-bulk
// body: { type: 'exhibition'|'fair', parentId: string, artworkIds: string[] }
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { type, parentId, artworkIds } = await req.json()
    if (!type || !parentId || !Array.isArray(artworkIds)) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    const field = type === 'fair' ? 'fairId' : 'exhibitionId'

    // Clear previous links for this parent
    await prisma.artwork.updateMany({ where: { [field]: parentId }, data: { [field]: null } })

    // Set new links
    if (artworkIds.length > 0) {
      await prisma.artwork.updateMany({ where: { id: { in: artworkIds } }, data: { [field]: parentId } })
    }

    return NextResponse.json({ ok: true, linked: artworkIds.length })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
