'use client'

import { useState, useEffect } from 'react'
import { RichText } from '@/components/RichText'

const DEFAULT_CONTENT = `Согласие на получение рассылки

Подписываясь на рассылку Шмуклер Галереи, вы даёте согласие на получение информационных писем о:
— Новых выставках и мероприятиях
— Новых поступлениях произведений искусства
— Специальных предложениях

Вы можете отписаться от рассылки в любой момент, направив запрос на info@artishokcenter.ru.

Оператор: ИП Шмуклер Ольга Александровна (ИНН 771370805407)

Дата публикации: 2025 г.`

export default function PrivacyNewsletterPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => { if (d?.privacyNewsletter) setContent(d.privacyNewsletter) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12">Согласие на рассылку</h1>
        <div className="prose prose-gray max-w-none font-light leading-relaxed">
          <RichText text={content} />
        </div>
      </div>
    </div>
  )
}
