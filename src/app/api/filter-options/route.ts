import { NextResponse } from 'next/server'
import fs from 'fs'

const CONFIG_PATH = process.env.NODE_ENV === 'production'
  ? '/uploads/filter-config.json'
  : `${process.cwd()}/filter-config.json`

export const DEFAULT_FILTERS = {
  techniques: ['Живопись', 'Графика', 'Смешанная техника', 'Скульптура', 'Фотография', 'Керамика', 'Фреска'],
  themes: ['Пейзаж', 'Портрет', 'Натюрморт', 'Абстракция', 'Город', 'Природа', 'Цветы', 'Чувства', 'Любовь', 'Дружба', 'Море', 'Память', 'Тело', 'Детство', 'Дом'],
  colors: ['Белый', 'Черный', 'Красный', 'Зеленый', 'Синий', 'Желтый', 'Коричневый', 'Розовый', 'Бежевый', 'Серый', 'Фиолетовый', 'Голубой'],
}

export function readConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8')
      return { ...DEFAULT_FILTERS, ...JSON.parse(raw) }
    }
  } catch {}
  return DEFAULT_FILTERS
}

export async function GET() {
  return NextResponse.json(readConfig())
}
