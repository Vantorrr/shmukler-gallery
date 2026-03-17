'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const MOCK_FAIRS = [
  { id: '1', title: 'Cosmoscow 2024', dates: '13–15 сентября 2024', location: 'Москва, Гостиный двор', booth: 'Стенд B12', status: 'past', coverImage: 'https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=800' },
  { id: '2', title: 'Art Moscow 2024', dates: '24–28 апреля 2024', location: 'Москва, ЦВЗ «Манеж»', booth: 'Стенд 24', status: 'past', coverImage: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?q=80&w=800' },
]

export default function FairsPage() {
  const [fairs, setFairs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/fairs')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setFairs(d); else setFairs(MOCK_FAIRS) })
      .catch(() => setFairs(MOCK_FAIRS))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = fairs.filter(f => f.status !== 'past')
  const past = fairs.filter(f => f.status === 'past')

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif mb-16">Ярмарки</h1>

        {upcoming.length > 0 && (
          <section className="mb-20">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-8">Предстоящие</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcoming.map(fair => <FairCard key={fair.id} fair={fair} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-8">Прошедшие</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.map(fair => <FairCard key={fair.id} fair={fair} />)}
            </div>
          </section>
        )}

        {!loading && fairs.length === 0 && (
          <p className="text-center text-gray-400 py-24">Ярмарки не найдены</p>
        )}
      </div>
    </div>
  )
}

function FairCard({ fair }: { fair: any }) {
  return (
    <article className="border border-gray-100 overflow-hidden">
      {fair.coverImage && (
        <div className="relative aspect-[16/9] bg-gray-50">
          <Image src={fair.coverImage} alt={fair.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      )}
      <div className="p-8">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{fair.dates}</p>
        <h3 className="text-2xl font-serif mb-2">{fair.title}</h3>
        {fair.location && <p className="text-sm text-gray-500 mb-1">{fair.location}</p>}
        {fair.booth && <p className="text-xs text-gray-400">{fair.booth}</p>}
        {fair.description && <p className="mt-4 text-sm text-gray-600 font-light leading-relaxed">{fair.description}</p>}
      </div>
    </article>
  )
}
