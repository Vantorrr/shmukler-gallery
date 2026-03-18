import { NextResponse } from 'next/server'
import { readFilterConfig } from '@/lib/filterConfig'

export async function GET() {
  return NextResponse.json(readFilterConfig())
}
