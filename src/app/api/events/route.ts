import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.event.findMany({
      orderBy: [{ orderIndex: 'asc' }, { date: 'asc' }],
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/events failed:', error)
    return NextResponse.json([])
  }
}
