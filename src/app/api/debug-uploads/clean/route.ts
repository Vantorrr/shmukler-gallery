import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

// Clears coverImage/imagePath DB references that no longer exist on disk
export async function POST() {
  const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads')
  let filesOnDisk: string[] = []
  try { filesOnDisk = await readdir(UPLOAD_DIR) } catch {}

  function existsOnDisk(path: string | null) {
    if (!path) return true
    const filename = path.replace('/api/image/', '')
    return filesOnDisk.includes(filename)
  }

  // Fix collections
  const collections = await prisma.collection.findMany({ select: { id: true, coverImage: true } })
  let fixedCollections = 0
  for (const c of collections) {
    if (!existsOnDisk(c.coverImage)) {
      await prisma.collection.update({ where: { id: c.id }, data: { coverImage: null } })
      fixedCollections++
    }
  }

  // Fix hero slides
  const slides = await prisma.heroSlide.findMany({ select: { id: true, imagePath: true } })
  let fixedSlides = 0
  for (const s of slides) {
    if (!existsOnDisk(s.imagePath)) {
      await prisma.heroSlide.update({ where: { id: s.id }, data: { imagePath: '' } })
      fixedSlides++
    }
  }

  return NextResponse.json({ ok: true, fixedCollections, fixedSlides })
}
