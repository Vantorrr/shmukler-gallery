import { client } from '@sanity/lib/client'
import { ARTWORKS_QUERY } from '@sanity/lib/queries'
import { ArtworkCard } from '@/components/ArtworkCard'
import { HeroSlider } from '@/components/HeroSlider'
import { Marquee } from '@/components/Marquee'
import { SplitText } from '@/components/SplitText'
import { ScrollReveal } from '@/components/ScrollReveal'
import { MOCK_ARTWORKS, MOCK_EXHIBITIONS, MOCK_ARTISTS } from '@/lib/mockData'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export const revalidate = 60

const ARTIST_NAMES = [
  'Александр Болквадзе', 'Анастасия Лесюк', 'Елена Шипилова',
  'Лиза Шнейдер', 'Наталья Чобанян', 'Мария Стадник',
  'Сергей Козликин', 'Вера Латышева', 'Иван Майт',
  'Юлия Биктимирова', 'Дарья Пурпурная', 'Алишер Кушаков',
]

export default async function Home() {
  let artworks = []

  try {
    artworks = await client.fetch(ARTWORKS_QUERY)
  } catch {
    // ignore
  }
  if (!artworks?.length) artworks = MOCK_ARTWORKS

  const exhibitions = MOCK_EXHIBITIONS.slice(0, 2)
  const [art1, art2, art3, art4, art5, art6] = artworks

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── MARQUEE STRIP ── */}
      <div className="border-y border-black/10 py-4 bg-white overflow-hidden">
        <Marquee
          items={ARTIST_NAMES}
          speed={35}
          className="text-[11px] tracking-[0.25em] uppercase text-black/40"
          separator="·"
        />
      </div>

      {/* ── FEATURED WORKS — editorial asymmetric grid ── */}
      <section className="px-6 md:px-12 pt-24 pb-8 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <ScrollReveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-3">
                Избранные работы
              </p>
            </ScrollReveal>
            <SplitText
              text="Сейчас в галерее"
              as="h2"
              className="font-serif italic leading-none"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' } as React.CSSProperties}
              delay={100}
              stagger={80}
            />
          </div>
          <Link
            href="/gallery"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-widest uppercase hover:opacity-40 transition-opacity"
          >
            <span>Смотреть всё</span>
            <span className="w-8 h-px bg-black block" />
          </Link>
        </div>

        {/* Row 1: big left + two stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Large featured */}
          {art1 && (
            <Link href={`/artwork/${art1.slug.current}`} className="group md:col-span-2 block">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {art1.mainImage?.asset?.url && (
                  <Image
                    src={art1.mainImage.asset.url}
                    alt={art1.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {art1.status === 'sold' && (
                  <div className="absolute top-4 left-4 bg-black text-white text-[9px] px-3 py-1 uppercase tracking-widest">
                    Продано
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <p className="text-[11px] text-black/40 italic mb-1">{art1.artist}</p>
                  <h3 className="text-xl font-serif group-hover:opacity-50 transition-opacity">{art1.title}</h3>
                </div>
                {art1.price && art1.status !== 'sold' && (
                  <p className="text-sm text-right shrink-0 ml-4">{art1.price.toLocaleString('ru-RU')} ₽</p>
                )}
              </div>
            </Link>
          )}

          {/* Two smaller stacked */}
          <div className="grid grid-rows-2 gap-4">
            {[art2, art3].filter(Boolean).map((artwork: any) => (
              <Link key={artwork._id} href={`/artwork/${artwork.slug.current}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {artwork.mainImage?.asset?.url && (
                    <Image
                      src={artwork.mainImage.asset.url}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  {artwork.status === 'sold' && (
                    <div className="absolute top-3 left-3 bg-black text-white text-[9px] px-2 py-1 uppercase tracking-widest">
                      Продано
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-[10px] text-black/40 italic mb-0.5">{artwork.artist}</p>
                  <h3 className="text-sm font-serif group-hover:opacity-50 transition-opacity">{artwork.title}</h3>
                  {artwork.price && artwork.status !== 'sold' && (
                    <p className="text-xs text-black/60 mt-1">{artwork.price.toLocaleString('ru-RU')} ₽</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2: three equal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[art4, art5, art6].filter(Boolean).map((artwork: any) => (
            <Link key={artwork._id} href={`/artwork/${artwork.slug.current}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                {artwork.mainImage?.asset?.url && (
                  <Image
                    src={artwork.mainImage.asset.url}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {artwork.status === 'sold' && (
                  <div className="absolute top-3 right-3 bg-black text-white text-[9px] px-2 py-1 uppercase tracking-widest">
                    Продано
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-[10px] text-black/40 italic mb-1">{artwork.artist}</p>
                <h3 className="text-base font-serif group-hover:opacity-50 transition-opacity">{artwork.title}</h3>
                {artwork.price && artwork.status !== 'sold' && (
                  <p className="text-sm text-black/60 mt-1">{artwork.price.toLocaleString('ru-RU')} ₽</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <Link
            href="/gallery"
            className="text-[11px] tracking-widest uppercase border-b border-black pb-1 hover:opacity-40 transition-opacity"
          >
            Смотреть всё →
          </Link>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="border-y border-black/8 my-16 py-12 px-6 md:px-12 bg-[#f8f8f6]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '22+', label: 'Художника' },
            { num: '4',   label: 'Выставки в 2026' },
            { num: '6',   label: 'Лет в искусстве' },
            { num: '∞',   label: 'Любовь к искусству' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif italic text-5xl md:text-6xl text-black/80 leading-none mb-2">
                {stat.num}
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-black/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXHIBITIONS — editorial layout ── */}
      <section className="px-6 md:px-12 py-16 max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-12">
          <div>
            <ScrollReveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-3">Программа</p>
            </ScrollReveal>
            <SplitText
              text="Выставки"
              as="h2"
              className="font-serif italic leading-none"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' } as React.CSSProperties}
              delay={50}
            />
          </div>
          <Link
            href="/exhibitions"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-widest uppercase hover:opacity-40 transition-opacity"
          >
            <span>Все выставки</span>
            <span className="w-8 h-px bg-black block" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
          {exhibitions.map((exhibition: any, i: number) => (
            <Link
              key={exhibition._id}
              href={`/exhibitions/${exhibition.slug.current}`}
              className="group block bg-white p-8 hover:bg-[#f8f8f6] transition-colors"
            >
              <div className="flex gap-6 items-start">
                <div
                  className="shrink-0 font-serif italic text-7xl leading-none text-black/10 select-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="aspect-[16/9] bg-gray-100 mb-5 overflow-hidden relative">
                    {exhibition.coverImage?.asset?.url && (
                      <Image
                        src={exhibition.coverImage.asset.url}
                        alt={exhibition.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-black/30 mb-2">
                    {new Date(exhibition.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    {' — '}
                    {new Date(exhibition.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="font-serif text-2xl mb-1 group-hover:opacity-60 transition-opacity">
                    {exhibition.title}
                  </h3>
                  <p className="text-xs text-black/40">{exhibition.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FULL-WIDTH CTA ── */}
      <section className="relative overflow-hidden bg-black text-white py-32 px-6 md:px-12 my-8">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1531913764164-f85c3e01b2aa?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase mb-6">Услуги галереи</p>
            <SplitText
              text="Искусство для вашего пространства"
              as="h2"
              className="font-serif italic text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' } as React.CSSProperties}
              delay={100}
              stagger={70}
            />
          </div>
          <div className="md:text-right">
            <p className="text-white/50 text-sm font-light max-w-xs md:ml-auto mb-8 leading-relaxed">
              Подбор произведений, арт-консультирование, примерка и аренда — помогаем коллекционерам и дизайнерам.
            </p>
            <Link
              href="/services"
              className="inline-block border border-white/40 text-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Узнать подробнее
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARTISTS STRIP ── */}
      <section className="px-6 md:px-12 py-20 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <ScrollReveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-3">Наши авторы</p>
            </ScrollReveal>
            <SplitText
              text="Художники"
              as="h2"
              className="font-serif italic leading-none"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' } as React.CSSProperties}
              delay={50}
            />
          </div>
          <Link
            href="/artists"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-widest uppercase hover:opacity-40 transition-opacity"
          >
            <span>Все художники</span>
            <span className="w-8 h-px bg-black block" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-0 md:px-0 md:grid md:grid-cols-6">
          {MOCK_ARTISTS.slice(0, 6).map((artist) => (
            <Link
              key={artist._id}
              href={`/artists/${artist.slug.current}`}
              className="group shrink-0 w-36 md:w-auto block"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={artist.portrait.asset.url}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 144px, 16vw"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-[11px] leading-tight group-hover:opacity-50 transition-opacity">
                {artist.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
