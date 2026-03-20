import { NextResponse } from 'next/server'
import { readFilterConfig } from '@/lib/filterConfig'

export async function GET() {
  try {
    return NextResponse.json(readFilterConfig())
  } catch (error) {
    console.error('GET /api/filter-options failed:', error)
    return NextResponse.json({ techniques: [], themes: [], colors: [] })
  }
}
