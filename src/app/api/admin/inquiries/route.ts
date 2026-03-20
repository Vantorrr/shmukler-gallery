import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/inquiries failed:', error)
    return NextResponse.json([])
  }
}
