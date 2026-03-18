'use client'

import { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronUp, ChevronDown, Pencil, Trash2, Plus, X, Check,
  Upload, LogOut, RefreshCw, Archive, ArchiveRestore
} from 'lucide-react'

type Tab = 'artworks' | 'artists' | 'exhibitions' | 'events' | 'team' | 'fairs' | 'slides' | 'announcements' | 'collections' | 'filters'

const TABS: { key: Tab; label: string }[] = [
  { key: 'artworks', label: 'Работы' },
  { key: 'artists', label: 'Художники' },
  { key: 'exhibitions', label: 'Выставки' },
  { key: 'events', label: 'Мероприятия' },
  { key: 'team', label: 'Команда' },
  { key: 'fairs', label: 'Ярмарки' },
  { key: 'slides', label: 'Слайдер' },
  { key: 'announcements', label: 'Анонсы' },
  { key: 'collections', label: 'Подборки' },
  { key: 'filters', label: 'Фильтры' },
]

function ImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) onChange(data.path)
    } catch { /* ignore */ }
    finally { setUploading(false) }
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="URL или путь к изображению"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
      />
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex items-center gap-1 text-xs border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50"
        >
          <Upload className="w-3 h-3" />
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-10 w-10 object-cover rounded border" />
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
}

function Textarea({ rows = 3, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} {...props} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select {...props} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
      {children}
    </select>
  )
}

// ─── Forms ───────────────────────────────────────────────────────────────────

function ArtworkForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const defaults = { title: '', slug: '', artistName: '', artistSlug: '', price: '', status: 'available', medium: '', technique: '', materials: '', dimensions: '', year: '', series: '', description: '', imagePath: '', theme: '', colorTags: '', exhibitionId: '', orderIndex: 0, isArchived: false }
  const [d, setD] = useState({ ...defaults, ...initial, price: initial?.price ?? '', year: initial?.year ?? '', orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!d.title) return
    const slug = d.slug || d.title.toLowerCase().replace(/[^a-z0-9а-яёA-ZА-ЯЁ\s]/g, '').replace(/\s+/g, '-')
    onSave({ ...d, slug, price: d.price ? parseInt(d.price) : null, year: d.year ? parseInt(d.year) : null, orderIndex: parseInt(String(d.orderIndex)) || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Название *"><Input required value={d.title} onChange={set('title')} /></Field>
        <Field label="Slug"><Input value={d.slug} onChange={set('slug')} placeholder="auto" /></Field>
        <Field label="Художник (имя)"><Input value={d.artistName} onChange={set('artistName')} /></Field>
        <Field label="Slug художника"><Input value={d.artistSlug} onChange={set('artistSlug')} /></Field>
        <Field label="Цена (₽)"><Input type="number" value={d.price} onChange={set('price')} /></Field>
        <Field label="Статус">
          <Select value={d.status} onChange={set('status')}>
            <option value="available">В наличии</option>
            <option value="sold">Продано</option>
            <option value="reserved">Зарезервировано</option>
          </Select>
        </Field>
        <Field label="Техника (Живопись…)"><Input value={d.medium} onChange={set('medium')} placeholder="Живопись" /></Field>
        <Field label="Материалы"><Input value={d.materials} onChange={set('materials')} /></Field>
        <Field label="Размеры"><Input value={d.dimensions} onChange={set('dimensions')} placeholder="100×80 см" /></Field>
        <Field label="Год"><Input type="number" value={d.year} onChange={set('year')} /></Field>
        <Field label="Серия"><Input value={d.series} onChange={set('series')} /></Field>
        <Field label="Тематика"><Input value={d.theme} onChange={set('theme')} /></Field>
        <Field label="Цвета (через запятую)"><Input value={d.colorTags} onChange={set('colorTags')} placeholder="красный, синий" /></Field>
        <Field label="ID выставки"><Input value={d.exhibitionId || ''} onChange={set('exhibitionId')} /></Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
        <Field label="Архив">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d.isArchived} onChange={e => setD((p: any) => ({ ...p, isArchived: e.target.checked }))} />
            Скрыть (в архив)
          </label>
        </Field>
      </div>
      <Field label="Описание"><Textarea value={d.description} onChange={set('description')} /></Field>
      <Field label="Изображение"><ImageUpload value={d.imagePath || ''} onChange={v => setD((p: any) => ({ ...p, imagePath: v }))} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function ArtistForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const artistDefaults = { name: '', slug: '', bio: '', artistStatement: '', selectedExhibitions: '', imagePath: '', orderIndex: 0, isArchived: false }
  const [d, setD] = useState({ ...artistDefaults, ...initial, orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!d.name) return
    const slug = d.slug || d.name.toLowerCase().replace(/\s+/g, '-')
    onSave({ ...d, slug, orderIndex: parseInt(String(d.orderIndex)) || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Имя *"><Input required value={d.name} onChange={set('name')} /></Field>
        <Field label="Slug"><Input value={d.slug} onChange={set('slug')} placeholder="auto" /></Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
        <Field label="Архив">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d.isArchived} onChange={e => setD((p: any) => ({ ...p, isArchived: e.target.checked }))} />
            Скрыть (в архив)
          </label>
        </Field>
      </div>
      <Field label="Биография (BIO)"><Textarea value={d.bio} onChange={set('bio')} rows={4} /></Field>
      <Field label="Artist Statement (AS)"><Textarea value={d.artistStatement || ''} onChange={set('artistStatement')} rows={3} /></Field>
      <Field label="Избранные выставки (текст)"><Textarea value={d.selectedExhibitions || ''} onChange={set('selectedExhibitions')} rows={3} /></Field>
      <Field label="Фото"><ImageUpload value={d.imagePath || ''} onChange={v => setD((p: any) => ({ ...p, imagePath: v }))} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function ExhibitionForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const exhibitionDefaults = { title: '', slug: '', startDate: '', endDate: '', location: '', description: '', coverImage: '', galleryImages: '', status: 'current', orderIndex: 0 }
  const [d, setD] = useState({ ...exhibitionDefaults, ...initial, orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!d.title) return
    const slug = d.slug || d.title.toLowerCase().replace(/\s+/g, '-')
    onSave({ ...d, slug, orderIndex: parseInt(String(d.orderIndex)) || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Название *"><Input required value={d.title} onChange={set('title')} /></Field>
        <Field label="Slug"><Input value={d.slug} onChange={set('slug')} placeholder="auto" /></Field>
        <Field label="Дата начала"><Input type="date" value={d.startDate} onChange={set('startDate')} /></Field>
        <Field label="Дата окончания"><Input type="date" value={d.endDate} onChange={set('endDate')} /></Field>
        <Field label="Место"><Input value={d.location} onChange={set('location')} /></Field>
        <Field label="Статус">
          <Select value={d.status} onChange={set('status')}>
            <option value="current">Текущая</option>
            <option value="upcoming">Предстоящая</option>
            <option value="past">Прошедшая</option>
          </Select>
        </Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
      </div>
      <Field label="Описание"><Textarea value={d.description} onChange={set('description')} /></Field>
      <Field label="Обложка"><ImageUpload value={d.coverImage || ''} onChange={v => setD((p: any) => ({ ...p, coverImage: v }))} /></Field>
      <Field label="Фото галереи (URL через запятую)"><Textarea value={d.galleryImages || ''} onChange={set('galleryImages')} rows={2} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function EventForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const eventDefaults = { title: '', slug: '', date: '', time: '', endTime: '', format: 'offline', type: '', price: '', location: '', description: '', coverImage: '', ticketUrl: '', registrationUrl: '', accessUrl: '', orderIndex: 0 }
  const [d, setD] = useState({ ...eventDefaults, ...initial, price: initial?.price ?? '', orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!d.title) return
    const slug = d.slug || d.title.toLowerCase().replace(/\s+/g, '-')
    onSave({ ...d, slug, price: d.price !== '' ? parseInt(d.price) : null, orderIndex: parseInt(String(d.orderIndex)) || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Название *"><Input required value={d.title} onChange={set('title')} /></Field>
        <Field label="Slug"><Input value={d.slug} onChange={set('slug')} placeholder="auto" /></Field>
        <Field label="Дата"><Input type="date" value={d.date} onChange={set('date')} /></Field>
        <Field label="Время начала"><Input type="time" value={d.time} onChange={set('time')} /></Field>
        <Field label="Время окончания"><Input type="time" value={d.endTime} onChange={set('endTime')} /></Field>
        <Field label="Формат">
          <Select value={d.format} onChange={set('format')}>
            <option value="offline">Офлайн</option>
            <option value="online">Онлайн</option>
          </Select>
        </Field>
        <Field label="Тип">
          <Select value={d.type} onChange={set('type')}>
            <option value="">— Тип —</option>
            <option value="masterclass">Мастер-класс</option>
            <option value="lecture">Лекция</option>
            <option value="performance">Перформанс</option>
            <option value="exhibition">Открытие выставки</option>
            <option value="other">Другое</option>
          </Select>
        </Field>
        <Field label="Цена (₽, 0 = бесплатно)"><Input type="number" value={d.price} onChange={set('price')} /></Field>
        <Field label="Место"><Input value={d.location} onChange={set('location')} /></Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
      </div>
      <Field label="Описание"><Textarea value={d.description} onChange={set('description')} /></Field>
      <Field label="Ссылка на билеты (офлайн)"><Input type="url" value={d.ticketUrl || ''} onChange={set('ticketUrl')} /></Field>
      <Field label="Ссылка на регистрацию (офлайн)"><Input type="url" value={d.registrationUrl || ''} onChange={set('registrationUrl')} /></Field>
      <Field label="Ссылка на доступ (онлайн)"><Input type="url" value={d.accessUrl || ''} onChange={set('accessUrl')} /></Field>
      <Field label="Изображение"><ImageUpload value={d.coverImage || ''} onChange={v => setD((p: any) => ({ ...p, coverImage: v }))} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function TeamForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const teamDefaults = { name: '', role: '', bio: '', imagePath: '', orderIndex: 0 }
  const [d, setD] = useState({ ...teamDefaults, ...initial, orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); if (!d.name) return; onSave({ ...d, orderIndex: parseInt(String(d.orderIndex)) || 0 }) }} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Имя *"><Input required value={d.name} onChange={set('name')} /></Field>
        <Field label="Роль"><Input value={d.role} onChange={set('role')} /></Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
      </div>
      <Field label="Биография"><Textarea value={d.bio} onChange={set('bio')} /></Field>
      <Field label="Фото"><ImageUpload value={d.imagePath || ''} onChange={v => setD((p: any) => ({ ...p, imagePath: v }))} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function FairForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const fairDefaults = { title: '', slug: '', dates: '', location: '', booth: '', description: '', coverImage: '', status: 'upcoming', orderIndex: 0 }
  const [d, setD] = useState({ ...fairDefaults, ...initial, orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); if (!d.title) return; const slug = d.slug || d.title.toLowerCase().replace(/\s+/g, '-'); onSave({ ...d, slug, orderIndex: parseInt(String(d.orderIndex)) || 0 }) }} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Название *"><Input required value={d.title} onChange={set('title')} /></Field>
        <Field label="Slug"><Input value={d.slug} onChange={set('slug')} placeholder="auto" /></Field>
        <Field label="Даты"><Input value={d.dates} onChange={set('dates')} /></Field>
        <Field label="Место"><Input value={d.location} onChange={set('location')} /></Field>
        <Field label="Стенд"><Input value={d.booth} onChange={set('booth')} /></Field>
        <Field label="Статус">
          <Select value={d.status} onChange={set('status')}>
            <option value="upcoming">Предстоящая</option>
            <option value="current">Текущая</option>
            <option value="past">Прошедшая</option>
          </Select>
        </Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
      </div>
      <Field label="Описание"><Textarea value={d.description} onChange={set('description')} /></Field>
      <Field label="Обложка"><ImageUpload value={d.coverImage || ''} onChange={v => setD((p: any) => ({ ...p, coverImage: v }))} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function SlideForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const slideDefaults = { title: '', subtitle: '', imagePath: '', linkUrl: '', orderIndex: 0, isActive: true }
  const [d, setD] = useState({ ...slideDefaults, ...initial, orderIndex: initial?.orderIndex ?? 0 })
  const [err, setErr] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  return (
    <form onSubmit={e => {
      e.preventDefault()
      if (!d.imagePath) { setErr('Необходимо добавить изображение'); return }
      setErr('')
      onSave({ ...d, orderIndex: parseInt(String(d.orderIndex)) || 0 })
    }} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Заголовок"><Input value={d.title} onChange={set('title')} /></Field>
        <Field label="Подзаголовок"><Input value={d.subtitle} onChange={set('subtitle')} /></Field>
        <Field label="Ссылка"><Input type="url" value={d.linkUrl} onChange={set('linkUrl')} /></Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
        <Field label="Активен">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d.isActive} onChange={e => setD((p: any) => ({ ...p, isActive: e.target.checked }))} />
            Показывать
          </label>
        </Field>
      </div>
      <Field label="Изображение *"><ImageUpload value={d.imagePath || ''} onChange={v => setD((p: any) => ({ ...p, imagePath: v }))} /></Field>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function AnnouncementForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const initExpiresAt = initial?.expiresAt ? (() => { try { return new Date(initial.expiresAt).toISOString().slice(0, 16) } catch { return '' } })() : ''
  const { expiresAt: _ea, ...restInitial } = initial || {}
  const [d, setD] = useState({ text: '', linkUrl: '', isActive: true, ...restInitial, expiresAt: initExpiresAt })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); if (!d.text) return; onSave({ ...d, expiresAt: d.expiresAt || null }) }} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <Field label="Текст анонса *"><Input required value={d.text} onChange={set('text')} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ссылка"><Input type="url" value={d.linkUrl} onChange={set('linkUrl')} /></Field>
        <Field label="Действует до"><Input type="datetime-local" value={d.expiresAt} onChange={set('expiresAt')} /></Field>
        <Field label="Активен">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d.isActive} onChange={e => setD((p: any) => ({ ...p, isActive: e.target.checked }))} />
            Показывать на сайте
          </label>
        </Field>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

function CollectionForm({ initial, onSave, onCancel }: { initial: any; onSave: (d: any) => void; onCancel: () => void }) {
  const collectionDefaults = { title: '', slug: '', description: '', coverImage: '', artworkIds: '[]', orderIndex: 0, isActive: true }
  const [d, setD] = useState({ ...collectionDefaults, ...initial, orderIndex: initial?.orderIndex ?? 0 })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD((prev: any) => ({ ...prev, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); if (!d.title) return; const slug = d.slug || d.title.toLowerCase().replace(/\s+/g, '-'); onSave({ ...d, slug, orderIndex: parseInt(String(d.orderIndex)) || 0 }) }} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Название *"><Input required value={d.title} onChange={set('title')} /></Field>
        <Field label="Slug"><Input value={d.slug} onChange={set('slug')} placeholder="auto" /></Field>
        <Field label="Порядок показа"><Input type="number" value={d.orderIndex} onChange={set('orderIndex')} /></Field>
        <Field label="Активна">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d.isActive} onChange={e => setD((p: any) => ({ ...p, isActive: e.target.checked }))} />
            Показывать
          </label>
        </Field>
      </div>
      <Field label="Описание"><Textarea value={d.description || ''} onChange={set('description')} /></Field>
      <Field label="ID работ (JSON-массив)"><Textarea value={d.artworkIds} onChange={set('artworkIds')} rows={2} /></Field>
      <Field label="Обложка"><ImageUpload value={d.coverImage || ''} onChange={v => setD((p: any) => ({ ...p, coverImage: v }))} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex items-center gap-1 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"><Check className="w-4 h-4" /> Сохранить</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50"><X className="w-4 h-4" /> Отмена</button>
      </div>
    </form>
  )
}

// ─── Column-sortable table Section ───────────────────────────────────────────

const TAB_API: Record<Tab, string> = {
  artworks: 'artworks', artists: 'artists', exhibitions: 'exhibitions',
  events: 'events', team: 'team-members', fairs: 'fairs',
  slides: 'hero-slides', announcements: 'announcements', collections: 'collections',
}

const TAB_COLS: Record<Tab, string[]> = {
  artworks: ['title', 'artistName', 'medium', 'price', 'status', 'orderIndex'],
  artists: ['name', 'orderIndex', 'isArchived'],
  exhibitions: ['title', 'startDate', 'status', 'orderIndex'],
  events: ['title', 'date', 'format', 'price', 'orderIndex'],
  team: ['name', 'role', 'orderIndex'],
  fairs: ['title', 'dates', 'status', 'orderIndex'],
  slides: ['title', 'orderIndex', 'isActive'],
  announcements: ['text', 'isActive', 'expiresAt'],
  collections: ['title', 'orderIndex', 'isActive'],
}

const COL_LABELS: Record<string, string> = {
  title: 'Название', artistName: 'Художник', medium: 'Техника', price: 'Цена',
  status: 'Статус', orderIndex: '№', name: 'Имя', role: 'Роль',
  startDate: 'Начало', format: 'Формат', date: 'Дата', dates: 'Даты',
  isArchived: 'Архив', isActive: 'Активен', expiresAt: 'До', text: 'Текст',
}

const FORMS: Record<Tab, any> = {
  artworks: ArtworkForm, artists: ArtistForm, exhibitions: ExhibitionForm,
  events: EventForm, team: TeamForm, fairs: FairForm,
  slides: SlideForm, announcements: AnnouncementForm, collections: CollectionForm,
}

function Section({ tab }: { tab: Tab }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [sortCol, setSortCol] = useState(TAB_COLS[tab][0])
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const api = `/api/admin/${TAB_API[tab]}`
  const cols = TAB_COLS[tab]
  const Form = FORMS[tab]

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(api)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setItems(await res.json())
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки')
    } finally { setLoading(false) }
  }, [api])

  useEffect(() => { load() }, [load])

  const sorted = [...items].sort((a, b) => {
    const av = a[sortCol] ?? '', bv = b[sortCol] ?? ''
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  function toggleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  async function handleSave(data: any) {
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `${api}/${editId}` : api
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        alert(e.error || `Ошибка ${res.status}`)
        return
      }
      setShowForm(false)
      setEditId(null)
      await load()
      setSavedMsg('Сохранено ✓')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (err) {
      alert('Ошибка сети: ' + String(err))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить запись? Это действие нельзя отменить.')) return
    try {
      const res = await fetch(`${api}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        alert(e.error || `Ошибка удаления: ${res.status}`)
        return
      }
      await load()
    } catch {
      alert('Ошибка сети при удалении')
    }
  }

  async function toggleArchive(item: any) {
    const field = 'isArchived' in item ? 'isArchived' : 'isActive' in item ? 'isActive' : null
    if (!field) return
    try {
      const newVal = field === 'isArchived' ? !item.isArchived : !item.isActive
      await fetch(`${api}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newVal }),
      })
      await load()
    } catch {
      alert('Ошибка при изменении статуса')
    }
  }

  function cellVal(item: any, col: string) {
    const v = item[col]
    if (v === null || v === undefined) return '—'
    if (typeof v === 'boolean') return v ? '✓' : '✗'
    if (col === 'price') return v ? `${Number(v).toLocaleString()} ₽` : 'бесплатно'
    if (col === 'expiresAt' && v) return new Date(v).toLocaleDateString('ru')
    return String(v).slice(0, 60)
  }

  const editItem = items.find(i => i.id === editId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setEditId(null); setShowForm(v => !v) }}
          className={`flex items-center gap-1 px-3 py-2 text-sm rounded transition-colors ${showForm && !editId ? 'bg-gray-200 text-black' : 'bg-black text-white hover:bg-gray-800'}`}
        >
          {showForm && !editId ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm && !editId ? 'Отмена' : 'Добавить'}
        </button>
        <button onClick={load} className="flex items-center gap-1 border border-gray-300 px-3 py-2 text-sm rounded hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Обновить
        </button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        {savedMsg && <span className="text-green-600 text-sm font-medium">{savedMsg}</span>}
      </div>

      {showForm && !editId && (
        <Form initial={null} onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <p className="text-gray-400 text-sm py-8 text-center">Загрузка...</p>
      ) : sorted.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">Нет данных. Добавьте первую запись или используйте «Импорт».</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {cols.map(col => (
                  <th key={col} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100" onClick={() => toggleSort(col)}>
                    <span className="flex items-center gap-1">
                      {COL_LABELS[col] || col}
                      {sortCol === col ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 w-32">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(item => (
                <Fragment key={item.id}>
                  <tr className={`border-b border-gray-100 hover:bg-gray-50 ${item.isArchived ? 'opacity-50' : ''}`}>
                    {cols.map(col => (
                      <td key={col} className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{cellVal(item, col)}</td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditId(item.id); setShowForm(true) }} className="text-gray-500 hover:text-black"><Pencil className="w-4 h-4" /></button>
                        {('isArchived' in item || 'isActive' in item) && (
                          <button
                            onClick={() => toggleArchive(item)}
                            className="text-gray-500 hover:text-black"
                            title={
                              'isArchived' in item
                                ? (item.isArchived ? 'Восстановить из архива' : 'В архив')
                                : (item.isActive ? 'Деактивировать' : 'Активировать')
                            }
                          >
                            {('isArchived' in item ? item.isArchived : !item.isActive)
                              ? <ArchiveRestore className="w-4 h-4" />
                              : <Archive className="w-4 h-4" />}
                          </button>
                        )}
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                  {editId === item.id && showForm && (
                    <tr>
                      <td colSpan={cols.length + 1} className="p-2">
                        <Form initial={editItem} onSave={handleSave} onCancel={() => { setShowForm(false); setEditId(null) }} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('artworks')
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  async function seedFromSite() {
    if (!confirm('Это удалит все текущие данные в БД и импортирует данные с сайта. Продолжить?')) return
    setSeeding(true); setSeedMsg('')
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      setSeedMsg(data.message || data.error || 'Готово')
    } catch { setSeedMsg('Ошибка') }
    finally { setSeeding(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-medium">Shmukler Gallery — Администрация</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={seedFromSite} disabled={seeding} className="text-xs border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 disabled:opacity-50">
            {seeding ? 'Импорт...' : 'Импорт с сайта'}
          </button>
          {seedMsg && <span className="text-xs text-green-600">{seedMsg}</span>}
          <button onClick={logout} className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white border border-gray-200 rounded-lg p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === t.key ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'filters' ? <FiltersSection /> : <Section key={tab} tab={tab} />}
      </div>
    </div>
  )
}

// ─── Filters Section ──────────────────────────────────────────────────────────

function FiltersSection() {
  const [config, setConfig] = useState<{ techniques: string[]; themes: string[]; colors: string[] } | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/filter-config').then(r => r.json()).then(setConfig).catch(() => {})
  }, [])

  async function save() {
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/filter-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      setMsg(data.ok ? 'Сохранено ✓' : (data.error || 'Ошибка'))
      setTimeout(() => setMsg(''), 3000)
    } catch { setMsg('Ошибка') }
    finally { setSaving(false) }
  }

  function updateList(key: 'techniques' | 'themes' | 'colors', raw: string) {
    const arr = raw.split('\n').map(s => s.trim()).filter(Boolean)
    setConfig(prev => prev ? { ...prev, [key]: arr } : prev)
  }

  if (!config) return <div className="py-12 text-center text-gray-400 text-sm">Загрузка...</div>

  const fields: { key: 'techniques' | 'themes' | 'colors'; label: string; hint: string }[] = [
    { key: 'techniques', label: 'Техника', hint: 'Каждое значение — с новой строки' },
    { key: 'themes', label: 'Тематика', hint: 'Каждое значение — с новой строки' },
    { key: 'colors', label: 'Цвет', hint: 'Каждое значение — с новой строки' },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Значения фильтров</h2>
          <p className="text-sm text-gray-500 mt-1">Изменяйте списки — они отразятся в фильтрах каталога</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-green-600">{msg}</span>}
          <button onClick={save} disabled={saving} className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            <p className="text-xs text-gray-400 mb-2">{f.hint}</p>
            <textarea
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:border-black"
              rows={12}
              value={config[f.key].join('\n')}
              onChange={e => updateList(f.key, e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">{config[f.key].length} значений</p>
          </div>
        ))}
      </div>
    </div>
  )
}
