import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const ALLOWED = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!ALLOWED.includes(ext)) {
      return NextResponse.json(
        { error: `Формат .${ext} не поддерживается. Используйте JPG, PNG или WebP. На iPhone: откройте фото → «Поделиться» → «Сохранить как JPEG».` },
        { status: 400 }
      )
    }
    await mkdir(UPLOAD_DIR, { recursive: true })
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext === 'jpeg' ? 'jpg' : ext}`
    const filepath = join(UPLOAD_DIR, filename)
    await writeFile(filepath, buffer)
    return NextResponse.json({ filename, path: `/api/image/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
