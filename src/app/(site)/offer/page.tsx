'use client'

import { useState, useEffect } from 'react'
import { RichText } from '@/components/RichText'

const DEFAULT_CONTENT = `Публичная оферта

ИП Шмуклер Ольга Александровна (ИНН 771370805407), именуемая в дальнейшем «Продавец», публикует настоящую публичную оферту о продаже произведений искусства через сайт shmuklergallery.com.

**1. Предмет оферты**
Продавец предлагает покупателю приобрести произведения искусства, представленные на сайте.

**2. Оформление заказа**
Заказ считается оформленным с момента заполнения формы заказа на сайте и получения подтверждения от Продавца.

**3. Оплата**
Оплата производится безналичным способом через платёжную систему, указанную на сайте.

**4. Доставка**
Условия и стоимость доставки рассчитываются индивидуально и согласовываются с покупателем.

**5. Возврат**
Возврат произведений искусства осуществляется в соответствии с законодательством РФ.

**6. Контакты**
Email: info@artishokcenter.ru
Телефон: 8 989 591 91 12
Адрес: Москва, Большой Краснопрудный тупик, 8/12

Дата публикации: 2025 г.`

export default function OfferPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then(d => { if (d?.offer) setContent(d.offer) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12">Публичная оферта</h1>
        <div className="prose prose-gray max-w-none font-light leading-relaxed">
          <RichText text={content} />
        </div>
      </div>
    </div>
  )
}
