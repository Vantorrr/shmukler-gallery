import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'

const CONFIG_PATH = process.env.NODE_ENV === 'production'
  ? '/uploads/page-content.json'
  : `${process.cwd()}/page-content.json`

async function checkAdmin() {
  const store = await cookies()
  const secret = process.env.ADMIN_SECRET || 'shmukler-admin-secret'
  return store.get('admin_token')?.value === secret
}

function read() {
  try {
    if (fs.existsSync(CONFIG_PATH)) return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  } catch {}
  return {}
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({}, { status: 401 })
  return NextResponse.json(read())
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const dir = CONFIG_PATH.substring(0, CONFIG_PATH.lastIndexOf('/'))
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2), 'utf8')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
