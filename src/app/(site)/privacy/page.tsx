'use client'

import { useState, useEffect } from 'react'
import { RichText } from '@/components/RichText'

const DEFAULT_CONTENT = `Политика конфиденциальности

ИП Шмуклер Ольга Александровна (ИНН 771370805407) обрабатывает персональные данные пользователей сайта shmuklergallery.com в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».

**Какие данные мы собираем:**
— Имя
— Адрес электронной почты
— Номер телефона
— Адрес доставки (при оформлении заказа)

**Цели обработки:**
— Обработка заказов и заявок
— Связь с клиентами
— Информационная рассылка (при наличии согласия)

**Хранение и защита:**
Персональные данные хранятся на защищённых серверах и не передаются третьим лицам, за исключением случаев, предусмотренных законодательством РФ.

**Права пользователя:**
Вы вправе запросить удаление или изменение ваших персональных данных, направив запрос на info@artishokcenter.ru.

Дата публикации: 2025 г.`

export default function PrivacyPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => { if (d?.privacy) setContent(d.privacy) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12">Политика конфиденциальности</h1>
        <div className="prose prose-gray max-w-none font-light leading-relaxed">
          <RichText text={content} />
        </div>
      </div>
    </div>
  )
}
