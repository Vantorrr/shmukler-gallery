'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'artworks' | 'artists' | 'exhibitions' | 'events'

/* ── helpers ── */
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .slice(0, 80)
}

function ImageUpload({ value, onChange }: { value: string; onChange: (path: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.path) onChange(data.path)
    setUploading(false)
  }

  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1.5">Фото</label>
      <div
        className="border border-dashed border-neutral-700 rounded p-4 text-center cursor-pointer hover:border-neutral-500 transition-colors"
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="preview" className="max-h-40 mx-auto object-contain" />
        ) : (
          <p className="text-neutral-600 text-sm">{uploading ? 'Загрузка...' : 'Нажмите или перетащите файл'}</p>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>
      {value && (
        <button onClick={() => onChange('')} className="text-[10px] text-red-400 hover:text-red-300 mt-1">
          Удалить фото
        </button>
      )}
    </div>
  )
}

/* ── field components ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-neutral-900 border border-neutral-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600'
const selectCls = 'w-full bg-neutral-900 border border-neutral-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 transition-colors'

/* ════════════════════════════════════════
   ARTWORK FORM
════════════════════════════════════════ */
function ArtworkForm({ initial, onSave, onCancel }: { initial?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const blank = { title: '', slug: '', artistName: '', artistSlug: '', series: '', year: '', medium: '', materials: '', dimensions: '', description: '', price: '', status: 'available', imagePath: '' }
  const [f, setF] = useState({ ...blank, ...initial })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setF((p: any) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...f,
      slug: f.slug || slugify(f.title),
      year: f.year ? Number(f.year) : null,
      price: f.price ? Number(f.price) : null,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Название *">
          <input required value={f.title} onChange={e => { set('title', e.target.value); if (!initial) set('slug', slugify(e.target.value)) }} className={inputCls} placeholder="Название работы" />
        </Field>
        <Field label="Slug (URL)">
          <input value={f.slug} onChange={e => set('slug', e.target.value)} className={inputCls} placeholder="nazvanie-raboty" />
        </Field>
        <Field label="Художник *">
          <input required value={f.artistName} onChange={e => { set('artistName', e.target.value); if (!initial) set('artistSlug', slugify(e.target.value)) }} className={inputCls} placeholder="Имя художника" />
        </Field>
        <Field label="Статус">
          <select value={f.status} onChange={e => set('status', e.target.value)} className={selectCls}>
            <option value="available">В продаже</option>
            <option value="sold">Продано</option>
            <option value="reserved">Забронировано</option>
          </select>
        </Field>
        <Field label="Серия">
          <input value={f.series} onChange={e => set('series', e.target.value)} className={inputCls} placeholder="Название серии" />
        </Field>
        <Field label="Год">
          <input type="number" value={f.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2024" />
        </Field>
        <Field label="Техника">
          <input value={f.medium} onChange={e => set('medium', e.target.value)} className={inputCls} placeholder="Холст, масло" />
        </Field>
        <Field label="Материалы">
          <input value={f.materials} onChange={e => set('materials', e.target.value)} className={inputCls} placeholder="Холст, деревянный подрамник" />
        </Field>
        <Field label="Размер">
          <input value={f.dimensions} onChange={e => set('dimensions', e.target.value)} className={inputCls} placeholder="100 × 120 см" />
        </Field>
        <Field label="Цена (₽)">
          <input type="number" value={f.price} onChange={e => set('price', e.target.value)} className={inputCls} placeholder="150000" />
        </Field>
      </div>
      <Field label="Описание">
        <textarea value={f.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder="Описание работы..." />
      </Field>
      <ImageUpload value={f.imagePath} onChange={v => set('imagePath', v)} />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-white text-sm px-4 transition-colors">Отмена</button>
      </div>
    </form>
  )
}

/* ════════════════════════════════════════
   ARTIST FORM
════════════════════════════════════════ */
function ArtistForm({ initial, onSave, onCancel }: { initial?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const blank = { name: '', slug: '', bio: '', birthYear: '', portraitPath: '' }
  const [f, setF] = useState({ ...blank, ...initial })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setF((p: any) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...f, slug: f.slug || slugify(f.name), birthYear: f.birthYear ? Number(f.birthYear) : null })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Имя *">
          <input required value={f.name} onChange={e => { set('name', e.target.value); if (!initial) set('slug', slugify(e.target.value)) }} className={inputCls} placeholder="Имя Фамилия" />
        </Field>
        <Field label="Slug (URL)">
          <input value={f.slug} onChange={e => set('slug', e.target.value)} className={inputCls} placeholder="imya-familiya" />
        </Field>
        <Field label="Год рождения">
          <input type="number" value={f.birthYear} onChange={e => set('birthYear', e.target.value)} className={inputCls} placeholder="1985" />
        </Field>
      </div>
      <Field label="Биография">
        <textarea value={f.bio} onChange={e => set('bio', e.target.value)} rows={5} className={inputCls + ' resize-none'} placeholder="Биография художника..." />
      </Field>
      <ImageUpload value={f.portraitPath} onChange={v => set('portraitPath', v)} />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-white text-sm px-4 transition-colors">Отмена</button>
      </div>
    </form>
  )
}

/* ════════════════════════════════════════
   EXHIBITION FORM
════════════════════════════════════════ */
function ExhibitionForm({ initial, onSave, onCancel }: { initial?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const blank = { title: '', slug: '', description: '', startDate: '', endDate: '', location: '', coverImagePath: '', isCurrent: false }
  const [f, setF] = useState({ ...blank, ...initial })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...f, slug: f.slug || slugify(f.title) })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Название *">
          <input required value={f.title} onChange={e => { set('title', e.target.value); if (!initial) set('slug', slugify(e.target.value)) }} className={inputCls} placeholder="Название выставки" />
        </Field>
        <Field label="Slug">
          <input value={f.slug} onChange={e => set('slug', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Дата начала">
          <input type="date" value={f.startDate} onChange={e => set('startDate', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Дата окончания">
          <input type="date" value={f.endDate} onChange={e => set('endDate', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Место">
          <input value={f.location} onChange={e => set('location', e.target.value)} className={inputCls} placeholder="Галерея, Москва" />
        </Field>
        <Field label="Статус">
          <select value={f.isCurrent ? 'current' : 'past'} onChange={e => set('isCurrent', e.target.value === 'current')} className={selectCls}>
            <option value="current">Текущая</option>
            <option value="past">Завершена</option>
          </select>
        </Field>
      </div>
      <Field label="Описание">
        <textarea value={f.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} />
      </Field>
      <ImageUpload value={f.coverImagePath} onChange={v => set('coverImagePath', v)} />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-white text-sm px-4 transition-colors">Отмена</button>
      </div>
    </form>
  )
}

/* ════════════════════════════════════════
   EVENT FORM
════════════════════════════════════════ */
function EventForm({ initial, onSave, onCancel }: { initial?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const blank = { title: '', description: '', date: '', time: '', location: '', format: 'offline', price: '', coverImagePath: '' }
  const [f, setF] = useState({ ...blank, ...initial })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setF((p: any) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...f, price: f.price ? Number(f.price) : null })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Название *">
          <input required value={f.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="Название мероприятия" />
        </Field>
        <Field label="Формат">
          <select value={f.format} onChange={e => set('format', e.target.value)} className={selectCls}>
            <option value="offline">Офлайн</option>
            <option value="online">Онлайн</option>
          </select>
        </Field>
        <Field label="Дата">
          <input type="date" value={f.date} onChange={e => set('date', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Время">
          <input value={f.time} onChange={e => set('time', e.target.value)} className={inputCls} placeholder="19:00" />
        </Field>
        <Field label="Место">
          <input value={f.location} onChange={e => set('location', e.target.value)} className={inputCls} placeholder="Адрес или онлайн" />
        </Field>
        <Field label="Цена (₽)">
          <input type="number" value={f.price} onChange={e => set('price', e.target.value)} className={inputCls} placeholder="0 = бесплатно" />
        </Field>
      </div>
      <Field label="Описание">
        <textarea value={f.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} />
      </Field>
      <ImageUpload value={f.coverImagePath} onChange={v => set('coverImagePath', v)} />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-white text-sm px-4 transition-colors">Отмена</button>
      </div>
    </form>
  )
}

/* ════════════════════════════════════════
   SECTION (generic list + add/edit)
════════════════════════════════════════ */
function Section({ endpoint, title, columns, FormComponent }: {
  endpoint: string
  title: string
  columns: { key: string; label: string; render?: (v: any) => React.ReactNode }[]
  FormComponent: any
}) {
  const [items, setItems]   = useState<any[]>([])
  const [mode, setMode]     = useState<'list' | 'add' | 'edit'>('list')
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/${endpoint}`)
      const data = await res.json().catch(() => [])
      if (Array.isArray(data)) {
        setItems(data)
      } else {
        setItems([])
        setError(data?.error || 'Ошибка загрузки данных')
      }
    } catch {
      setItems([])
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  const handleSave = async (data: any) => {
    setError('')
    const res = editing
      ? await fetch(`/api/admin/${endpoint}/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      : await fetch(`/api/admin/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}))
      setError(payload?.error || 'Не удалось сохранить изменения')
      return
    }
    setMode('list')
    setEditing(null)
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить?')) return
    setError('')
    const res = await fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}))
      setError(payload?.error || 'Не удалось удалить запись')
      return
    }
    await load()
  }

  if (mode !== 'list') {
    return (
      <div>
        <button onClick={() => { setMode('list'); setEditing(null) }} className="text-neutral-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
          ← Назад
        </button>
        <h2 className="text-lg font-serif mb-6">{editing ? `Редактировать` : `Добавить`}</h2>
        <FormComponent initial={editing} onSave={handleSave} onCancel={() => { setMode('list'); setEditing(null) }} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif">{title}</h2>
        <button onClick={() => { setEditing(null); setMode('add') }} className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition-colors">
          + Добавить
        </button>
      </div>
      {error && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500 text-sm">Загрузка...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-neutral-800 p-12 text-center">
          <p className="text-neutral-500 text-sm">Нет записей</p>
          <button onClick={() => setMode('add')} className="text-white text-sm underline mt-2">Добавить первую</button>
        </div>
      ) : (
        <div className="border border-neutral-800 divide-y divide-neutral-800">
          {/* Header */}
          <div className={`grid gap-4 px-4 py-2 text-[10px] uppercase tracking-widest text-neutral-500`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) auto` }}>
            {columns.map(c => <span key={c.key}>{c.label}</span>)}
            <span />
          </div>
          {/* Rows */}
          {items.map(item => (
            <div key={item.id} className="grid gap-4 px-4 py-3 items-center hover:bg-neutral-900 transition-colors" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) auto` }}>
              {columns.map(c => (
                <span key={c.key} className="text-sm text-neutral-300 truncate">
                  {c.render ? c.render(item[c.key]) : (item[c.key] ?? '—')}
                </span>
              ))}
              <div className="flex gap-3 justify-end shrink-0">
                <button onClick={() => { setEditing(item); setMode('edit') }} className="text-[11px] text-neutral-400 hover:text-white transition-colors">Изменить</button>
                <button onClick={() => handleDelete(item.id)} className="text-[11px] text-red-500 hover:text-red-400 transition-colors">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('artworks')
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'artworks',    label: 'Работы' },
    { key: 'artists',     label: 'Художники' },
    { key: 'exhibitions', label: 'Выставки' },
    { key: 'events',      label: 'Мероприятия' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-serif text-lg">Shmukler Gallery</span>
          <nav className="flex gap-6">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-sm transition-colors ${tab === t.key ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-neutral-500 hover:text-white text-sm transition-colors">↗ Сайт</a>
          <button onClick={logout} className="text-neutral-500 hover:text-white text-sm transition-colors">Выйти</button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 max-w-6xl w-full mx-auto">
        {tab === 'artworks' && (
          <Section
            endpoint="artworks"
            title="Работы"
            columns={[
              { key: 'title', label: 'Название' },
              { key: 'artistName', label: 'Художник' },
              { key: 'price', label: 'Цена', render: v => v ? `${Number(v).toLocaleString('ru-RU')} ₽` : '—' },
              { key: 'status', label: 'Статус', render: v => ({ available: 'В продаже', sold: 'Продано', reserved: 'Забронировано' }[v as string] || v) },
            ]}
            FormComponent={ArtworkForm}
          />
        )}
        {tab === 'artists' && (
          <Section
            endpoint="artists"
            title="Художники"
            columns={[
              { key: 'name', label: 'Имя' },
              { key: 'birthYear', label: 'Год рождения' },
              { key: 'slug', label: 'Slug' },
            ]}
            FormComponent={ArtistForm}
          />
        )}
        {tab === 'exhibitions' && (
          <Section
            endpoint="exhibitions"
            title="Выставки"
            columns={[
              { key: 'title', label: 'Название' },
              { key: 'startDate', label: 'Начало' },
              { key: 'endDate', label: 'Конец' },
              { key: 'isCurrent', label: 'Статус', render: v => v ? 'Текущая' : 'Завершена' },
            ]}
            FormComponent={ExhibitionForm}
          />
        )}
        {tab === 'events' && (
          <Section
            endpoint="events"
            title="Мероприятия"
            columns={[
              { key: 'title', label: 'Название' },
              { key: 'date', label: 'Дата' },
              { key: 'format', label: 'Формат', render: v => v === 'online' ? 'Онлайн' : 'Офлайн' },
              { key: 'price', label: 'Цена', render: v => v ? `${Number(v).toLocaleString('ru-RU')} ₽` : 'Бесплатно' },
            ]}
            FormComponent={EventForm}
          />
        )}
      </main>
    </div>
  )
}
