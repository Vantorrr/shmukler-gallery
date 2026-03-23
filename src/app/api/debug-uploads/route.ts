import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads')

  let filesOnDisk: string[] = []
  let diskError = ''
  try {
    filesOnDisk = await readdir(UPLOAD_DIR)
  } catch (e) {
    diskError = String(e)
  }

  const collections = await prisma.collection.findMany({
    select: { title: true, coverImage: true }
  })

  const result = collections.map(c => {
    const filename = c.coverImage?.replace('/api/image/', '') ?? null
    const exists = filename ? filesOnDisk.includes(filename) : false
    return { title: c.title, coverImage: c.coverImage, existsOnDisk: exists }
  })

  return NextResponse.json({
    upload_dir: UPLOAD_DIR,
    files_on_disk: filesOnDisk.filter(f => f !== 'lost+found'),
    disk_error: diskError || undefined,
    collections: result,
  })
}
