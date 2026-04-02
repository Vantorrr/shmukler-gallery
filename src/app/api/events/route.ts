import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const ids = new URL(req.url).searchParams.get('ids')
    const items = await prisma.event.findMany({
      where: ids ? { id: { in: ids.split(',').filter(Boolean) } } : undefined,
      orderBy: [{ orderIndex: 'asc' }, { date: 'asc' }],
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/events failed:', error)
    return NextResponse.json([])
  }
}
