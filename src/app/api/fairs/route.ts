import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.fair.findMany({ orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/fairs failed:', error)
    return NextResponse.json([])
  }
}
