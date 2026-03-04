import Image from 'next/image'
import { MOCK_TEAM } from '@/lib/mockData'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Mission Statement */}
        <section className="mb-24">
          <ScrollReveal>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 max-w-4xl">
            Shmukler Gallery was founded by art historian and coach Olga Shmukler in 2022. Наша цель — создать пространство, где различные формы искусства становятся способом познания себя и окружающего мира.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl leading-relaxed">
            Мы верим, что искусство — это не просто декор, а диалог между зрителем и произведением, путь к более глубокому самопознанию и связи с миром.
          </p>
          </ScrollReveal>
        </section>

        {/* Team Section */}
        <ScrollReveal delay={200}>
        <section className="py-24">
          <h2 className="text-3xl md:text-4xl font-serif mb-16">Команда</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {MOCK_TEAM.map((member) => (
              <article key={member._id} className="group">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                  <Image
                    src={member.image.asset.url}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="text-xl font-serif mb-1">{member.name}</h3>
                <p className="text-gray-600 font-light text-sm">{member.role}</p>
              </article>
            ))}
          </div>
        </section>
        </ScrollReveal>

        {/* For Collectors Section */}
        <ScrollReveal delay={100}>
        <section className="py-24 border-t border-gray-100">
          <h2 className="text-3xl md:text-4xl font-serif mb-12">Для коллекционеров</h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mb-12 leading-relaxed">
            Мы предлагаем арт-консультирование для формирования осмысленной коллекции, примерку произведений в вашем пространстве перед покупкой и аренду для фотосессий и интерьерных проектов.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-serif mb-3">Арт-консультирование</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Стратегические рекомендации по развитию коллекции, стилистической целостности, оформлению и хранению.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-3">Примерка</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Примерьте произведения в своём пространстве перед покупкой. Стоимость примерки засчитывается при покупке.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-3">Аренда</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Аренда произведений для фотосессий, мероприятий и интерьерных проектов. Возможна оплата за счёт заказа в галерее.
              </p>
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
