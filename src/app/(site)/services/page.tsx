import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

const SERVICES = [
  {
    title: 'Подбор произведений',
    description: 'Индивидуальный подбор произведений искусства по вашему запросу',
    icon: null,
  },
  {
    title: 'Арт-консультирование',
    description: 'Помощь со стилями, стратегией коллекции, оформлением, хранением',
    icon: null,
  },
  {
    title: 'Примерка произведений',
    description: 'Примерка произведений в вашем пространстве перед покупкой (10 000 ₽, бесплатно при покупке)',
    icon: null,
  },
  {
    title: 'Аренда произведений',
    description: 'Аренда произведений для фотосессий, проектов интерьера (бесплатно при заказе в галерее)',
    icon: null,
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Hero */}
        <div className="pb-10 mb-16">
          <ScrollReveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Каталог</p>
            <h1 className="font-serif italic leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              Услуги
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light mt-4">Для коллекционеров и дизайнеров</p>
          </ScrollReveal>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-32">
          {SERVICES.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 80}>
            <article
              className="border border-gray-100 p-12 flex flex-col"
            >
              <div className="w-16 h-16 bg-gray-50 mb-8" aria-hidden />
              <h2 className="text-2xl md:text-3xl font-serif mb-6">{service.title}</h2>
              <p className="text-gray-600 font-light mb-10 flex-grow leading-relaxed">
                {service.description}
              </p>
              <Link
                href="/contact"
                className="inline-block text-xs uppercase tracking-widest border-b border-black pb-1 w-fit hover:opacity-50 transition-opacity"
              >
                Оставить заявку
              </Link>
            </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-12 border-t border-gray-100">
          <p className="text-lg md:text-xl text-gray-600 font-light mb-6">
            Свяжитесь с нами, чтобы обсудить ваши потребности
          </p>
          <Link
            href="/contact"
            className="inline-block text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity"
          >
            Связаться
          </Link>
        </div>
      </div>
    </div>
  )
}
