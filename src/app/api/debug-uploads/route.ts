import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads')
  try {
    const files = await readdir(UPLOAD_DIR)
    return NextResponse.json({
      upload_dir: UPLOAD_DIR,
      file_count: files.length,
      files: files.slice(0, 20),
    })
  } catch (e) {
    return NextResponse.json({ upload_dir: UPLOAD_DIR, error: String(e) })
  }
}
