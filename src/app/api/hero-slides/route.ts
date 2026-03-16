import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/hero-slides failed:', error)
    return NextResponse.json([])
  }
}
