import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import { CONFIG_PATH, DEFAULT_FILTERS, readFilterConfig } from '@/lib/filterConfig'

async function checkAdmin() {
  const store = await cookies()
  const secret = process.env.ADMIN_SECRET || 'shmukler-admin-secret'
  return store.get('admin_token')?.value === secret
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(readFilterConfig())
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const config = {
      techniques: Array.isArray(body.techniques) ? body.techniques : DEFAULT_FILTERS.techniques,
      themes: Array.isArray(body.themes) ? body.themes : DEFAULT_FILTERS.themes,
      colors: Array.isArray(body.colors) ? body.colors : DEFAULT_FILTERS.colors,
    }
    const dir = CONFIG_PATH.substring(0, CONFIG_PATH.lastIndexOf('/'))
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
