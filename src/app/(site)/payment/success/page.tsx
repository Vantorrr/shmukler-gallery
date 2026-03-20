import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif mb-4">Заказ принят!</h1>
        <p className="text-gray-500 font-light leading-relaxed mb-8">
          Оплата прошла успешно. Мы свяжемся с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
        </p>
        <p className="text-sm text-gray-400 mb-8">info@artishokcenter.ru · 8 989 591 91 12</p>
        <Link href="/gallery" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors">
          Вернуться в каталог
        </Link>
      </div>
    </div>
  )
}
