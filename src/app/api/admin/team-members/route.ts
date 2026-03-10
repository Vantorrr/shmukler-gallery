import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.teamMember.findMany({
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/team-members failed:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await prisma.teamMember.create({ data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('POST /api/admin/team-members failed:', error)
    return NextResponse.json({ error: 'Не удалось сохранить участника команды' }, { status: 500 })
  }
}
