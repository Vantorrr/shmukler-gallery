import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.teamMember.findMany({ orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }] })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/team failed:', error)
    return NextResponse.json([])
  }
}
