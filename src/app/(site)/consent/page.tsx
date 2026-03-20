'use client'

import { useState, useEffect } from 'react'
import { RichText } from '@/components/RichText'

const DEFAULT_CONTENT = `Согласие на обработку персональных данных

Настоящим я даю согласие ИП Шмуклер Ольга Александровна (ИНН 771370805407) на обработку моих персональных данных, включая:
— Фамилию, имя
— Адрес электронной почты
— Номер телефона
— Адрес доставки

**Цели обработки:**
— Исполнение договора купли-продажи
— Обратная связь по заявкам
— Информирование о мероприятиях и новинках (при отдельном согласии)

Согласие может быть отозвано путём направления письменного заявления на info@artishokcenter.ru.

Дата публикации: 2025 г.`

export default function ConsentPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => { if (d?.consent) setContent(d.consent) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12">Согласие на обработку данных</h1>
        <div className="prose prose-gray max-w-none font-light leading-relaxed">
          <RichText text={content} />
        </div>
      </div>
    </div>
  )
}
