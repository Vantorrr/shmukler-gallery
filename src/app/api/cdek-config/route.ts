import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey =
    process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY ||
    process.env.YANDEX_MAPS_KEY ||
    ''
  return NextResponse.json({ apiKey })
}
