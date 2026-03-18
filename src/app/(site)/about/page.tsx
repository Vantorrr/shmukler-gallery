'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const ABOUT_DEFAULTS = {
  about_mission: 'Галерея Шмуклер основана арт-историком и коучем Ольгой Шмуклер в 2022 году. Наша цель — создать пространство, где искусство становится способом познания себя и мира.',
  about_description: 'Мы убеждены, что искусство — не просто украшение. Это диалог между зрителем и произведением, путь к более глубокому самопознанию и связи с окружающим миром.',
}

export default function AboutPage() {
  const [team, setTeam] = useState<any[]>([])
  const [content, setContent] = useState(ABOUT_DEFAULTS)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setTeam(d) })
      .catch(() => {})
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => setContent({ ...ABOUT_DEFAULTS, ...d }))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">

        {/* Миссия */}
        <section className="mb-24 max-w-5xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 leading-tight">
            {content.about_mission}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
            {content.about_description}
          </p>
        </section>

        {/* Команда */}
        {team.length > 0 && (
          <section className="py-24 border-t border-gray-100">
            <h2 className="text-3xl md:text-4xl font-serif mb-16">Команда</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {team.map((member) => (
                <article key={member.id} className="group">
                  {member.imagePath && (
                    <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-50">
                      <Image
                        src={member.imagePath}
                        alt={member.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-serif mb-1">{member.name}</h3>
                  <p className="text-gray-500 font-light text-sm">{member.role}</p>
                  {member.bio && <p className="text-gray-400 text-xs mt-2 leading-relaxed">{member.bio}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Для коллекционеров */}
        <section className="py-24 border-t border-gray-100">
          <h2 className="text-3xl md:text-4xl font-serif mb-12">Для коллекционеров</h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mb-12 leading-relaxed">
            Мы помогаем формировать коллекции, предлагаем арт-консалтинг, арт-примерку и аренду произведений для фотопроектов и интерьеров.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-serif mb-3">Арт-консалтинг</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">Стратегия формирования коллекции, выбор обрамления, рекомендации по хранению.</p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-3">Арт-примерка</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">Привезём и установим работу в вашем пространстве на несколько дней перед покупкой.</p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-3">Аренда произведений</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">Краткосрочная аренда для фотосъёмок, мероприятий и интерьерных проектов.</p>
            </div>
          </div>
          <div className="mt-12">
            <Link href="/services" className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
              Все услуги
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
