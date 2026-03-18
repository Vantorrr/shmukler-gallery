import { NextResponse } from 'next/server'
import fs from 'fs'

const CONFIG_PATH = process.env.NODE_ENV === 'production'
  ? '/uploads/page-content.json'
  : `${process.cwd()}/page-content.json`

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json(JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')))
    }
  } catch {}
  return NextResponse.json({})
}
