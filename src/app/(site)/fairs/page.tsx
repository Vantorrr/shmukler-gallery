'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@/components/RichText'

export default function FairsPage() {
  const [fairs, setFairs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/fairs')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setFairs(d) })
      .catch(() => {})
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
  const href = fair.slug ? `/fairs/${fair.slug}` : null

  const inner = (
    <article className="border border-gray-100 overflow-hidden group hover:border-gray-300 transition-colors cursor-pointer">
      <div className="relative aspect-[16/9] bg-gray-50 overflow-hidden">
        {fair.coverImage ? (
          <Image src={fair.coverImage} alt={fair.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </div>
      <div className="p-8">
        {fair.dates && <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{fair.dates}</p>}
        <h3 className="text-2xl font-serif mb-2 group-hover:opacity-70 transition-opacity">{fair.title}</h3>
        {fair.location && <p className="text-sm text-gray-500 mb-1">{fair.location}</p>}
        {fair.booth && <p className="text-xs text-gray-400">{fair.booth}</p>}
        {fair.description && <RichText text={fair.description} className="mt-4 text-sm text-gray-600 font-light line-clamp-3" />}
      </div>
    </article>
  )

  return href ? <Link href={href}>{inner}</Link> : inner
}
