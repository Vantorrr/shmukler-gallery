import Link from 'next/link'

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif mb-4">Оплата не прошла</h1>
        <p className="text-gray-500 font-light leading-relaxed mb-8">
          К сожалению, платёж не был завершён. Попробуйте ещё раз или свяжитесь с нами напрямую.
        </p>
        <p className="text-sm text-gray-400 mb-8">info@artishokcenter.ru · 8 989 591 91 12</p>
        <div className="flex gap-4 justify-center">
          <Link href="/gallery" className="inline-block border border-black text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            В каталог
          </Link>
          <Link href="/contact" className="inline-block bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors">
            Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  )
}
