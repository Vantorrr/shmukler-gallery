'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { RichText } from '@/components/RichText'

const DEFAULT_SERVICES = [
  {
    id: 1,
    title: 'Подбор искусства',
    shortDesc: 'Индивидуальный подбор произведений по вашему запросу',
    description: 'Мы поможем вам найти идеальное произведение искусства, учитывая ваши вкусы, интерьер и бюджет. Наши специалисты проводят персональные консультации и подбирают работы из коллекции галереи и от партнёрских художников.',
  },
  {
    id: 2,
    title: 'Арт-консалтинг',
    shortDesc: 'Помощь с формированием коллекции, стилем, хранением и оформлением',
    description: 'Комплексное сопровождение коллекционеров и дизайнеров: стратегия формирования коллекции, выбор техники обрамления, рекомендации по хранению и уходу за произведениями. Работаем с частными коллекционерами, корпоративными клиентами и дизайн-бюро.',
  },
  {
    id: 3,
    title: 'Арт-примерка',
    shortDesc: 'Просмотр работы в вашем пространстве перед покупкой',
    description: 'Привезём и установим выбранную работу в вашем доме или офисе на несколько дней, чтобы вы могли оценить, как она будет смотреться в реальном окружении. Стоимость услуги — 10 000 ₽ (засчитывается при покупке).',
  },
  {
    id: 4,
    title: 'Аренда произведений',
    shortDesc: 'Аренда работ для фотосъёмок, проектов и интерьерного дизайна',
    description: 'Произведения из коллекции галереи доступны для краткосрочной аренды под фотосессии, кино- и видеопроизводство, а также оформление выставочных и корпоративных пространств. При наличии галерейного кредита — бесплатно.',
  },
  {
    id: 5,
    title: 'Корпоративное искусство',
    shortDesc: 'Арт-оформление офисов, гостиниц и общественных пространств',
    description: 'Создаём концепцию арт-оформления коммерческих и общественных пространств: от подбора работ до монтажа и обслуживания. Постоянная ротация произведений по подписке.',
  },
]

type Service = { id: number; title: string; shortDesc: string; description: string }

function ServiceCard({ service, onApply }: { service: Service; onApply: (s: Service) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="border border-gray-100 p-8 md:p-10">
      <h2 className="text-2xl md:text-3xl font-serif mb-3">{service.title}</h2>
      <p className="text-gray-500 font-light mb-5">{service.shortDesc}</p>

      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-5">
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        Подробнее
      </button>

      {open && (
        <div className="text-sm text-gray-600 font-light leading-relaxed mb-6">
          <RichText text={service.description} />
        </div>
      )}

      <button
        onClick={() => onApply(service)}
        className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity"
      >
        Оставить заявку
      </button>
    </article>
  )
}

function ApplicationModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', consent: false })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [showContacts, setShowContacts] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.consent) { alert('Необходимо дать согласие на обработку данных'); return }
    setSending(true)
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'service', service: service.title, ...form }),
      })
      setSent(true)
      setShowContacts(true)
    } catch {
      alert('Ошибка при отправке. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>

        <h3 className="text-2xl font-serif mb-1">{service.title}</h3>
        <p className="text-sm text-gray-500 mb-6">Оставьте ваш запрос, и мы свяжемся с вами для уточнения деталей</p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Имя *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
            <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
            <input type="tel" placeholder="Телефон" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
            <textarea placeholder="Опишите ваш запрос" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black resize-none" />
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={e => setForm(p => ({ ...p, consent: e.target.checked }))} className="mt-0.5 accent-black" />
              <span className="text-xs text-gray-400 leading-relaxed">Согласен(а) на обработку персональных данных</span>
            </label>
            <button type="submit" disabled={sending} className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50">
              {sending ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-6">Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
            {showContacts && (
              <div className="text-sm text-gray-600 space-y-2 text-left bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-xs uppercase tracking-widest text-gray-400 mb-3">Контакты</p>
                <p><a href="mailto:info@artishokcenter.ru" className="hover:text-black">info@artishokcenter.ru</a></p>
                <p><a href="tel:+78989591912" className="hover:text-black">8 989 591 91 12</a></p>
                <p className="text-gray-400 text-xs">Большой Краснопрудный тупик, 8/12, Москва</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [subtitle, setSubtitle] = useState('Для коллекционеров и дизайнеров')
  const [applyService, setApplyService] = useState<Service | null>(null)

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => {
        if (d?.services_subtitle) setSubtitle(d.services_subtitle)
        const loaded: Service[] = []
        for (let n = 1; n <= 10; n++) {
          const title = d?.[`service_${n}_title`]
          if (!title) continue
          loaded.push({
            id: n,
            title,
            shortDesc: d?.[`service_${n}_short`] || '',
            description: d?.[`service_${n}_desc`] || '',
          })
        }
        if (loaded.length > 0) setServices(loaded)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-serif mb-4">Услуги</h1>
          <p className="text-xl text-gray-500 font-light">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} onApply={setApplyService} />
          ))}
        </div>

        <div className="mt-20 text-center border-t border-gray-100 pt-16">
          <p className="text-lg text-gray-500 font-light mb-2">Оставьте ваш запрос, и мы свяжемся с вами для уточнения деталей</p>
          <p className="text-sm text-gray-400 mb-8">или напишите напрямую: <a href="mailto:info@artishokcenter.ru" className="underline hover:text-black">info@artishokcenter.ru</a></p>
        </div>
      </div>

      {applyService && <ApplicationModal service={applyService} onClose={() => setApplyService(null)} />}
    </div>
  )
}
