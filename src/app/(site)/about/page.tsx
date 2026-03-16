import Image from 'next/image'
import { MOCK_TEAM } from '@/lib/mockData'

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Mission Statement */}
        <section className="mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 max-w-4xl">
            Shmukler Gallery was founded by art historian and coach Olga Shmukler in 2022. Our goal is to create a space where various forms of art become a way of understanding oneself and the world around us.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl leading-relaxed">
            We believe art is not merely decoration—it is a dialogue between the viewer and the work, a path to deeper self-awareness and connection with the world.
          </p>
        </section>

        {/* Team Section */}
        <section className="py-24">
          <h2 className="text-3xl md:text-4xl font-serif mb-16">Team</h2>
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

        {/* For Collectors Section */}
        <section className="py-24 border-t border-gray-100">
          <h2 className="text-3xl md:text-4xl font-serif mb-12">For Collectors</h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mb-12 leading-relaxed">
            We offer art consulting to help you build a meaningful collection, art fitting to try works in your space before purchase, and art rental for photoshoots and interior projects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-serif mb-3">Art Consulting</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Strategic guidance on collection development, style coherence, framing, and storage solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-3">Art Fitting</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Experience artworks in your space before committing. Fitting fee waived upon purchase.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-3">Art Rental</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Rent works for photoshoots, events, or interior design projects. Gallery credit available.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
