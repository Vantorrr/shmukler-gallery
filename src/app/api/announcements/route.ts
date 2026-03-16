import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const item = await prisma.announcement.findFirst({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('GET /api/announcements failed:', error)
    return NextResponse.json(null)
  }
}
