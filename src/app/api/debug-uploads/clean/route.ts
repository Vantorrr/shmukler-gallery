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

  // Fix artworks with broken imagePath
  const artworks = await prisma.artwork.findMany({ select: { id: true, imagePath: true } })
  let fixedArtworks = 0
  const brokenArtworks: string[] = []
  for (const a of artworks) {
    if (a.imagePath && !existsOnDisk(a.imagePath)) {
      await prisma.artwork.update({ where: { id: a.id }, data: { imagePath: null } })
      fixedArtworks++
      brokenArtworks.push(a.id)
    }
  }

  // Fix artists with broken imagePath
  const artists = await prisma.artist.findMany({ select: { id: true, imagePath: true } })
  let fixedArtists = 0
  for (const a of artists) {
    if (a.imagePath && !existsOnDisk(a.imagePath)) {
      await prisma.artist.update({ where: { id: a.id }, data: { imagePath: null } })
      fixedArtists++
    }
  }

  return NextResponse.json({ ok: true, fixedCollections, fixedSlides, fixedArtworks, fixedArtists })
}
