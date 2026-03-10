import { prisma } from '@/lib/prisma'
import { MOCK_ARTISTS } from '@/lib/mockData'
import { ScrollReveal } from '@/components/ScrollReveal'
import { SplitText } from '@/components/SplitText'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const revalidate = 60

export default async function ArtistsPage() {
  let artists: any[] = []

  try {
    artists = await prisma.artist.findMany({ orderBy: { name: 'asc' } })
  } catch { /* ignore */ }
  if (!artists?.length) {
    artists = MOCK_ARTISTS.map((a: any) => ({
      _id: a._id,
      name: a.name,
      slug: a.slug,
      portrait: a.portrait,
      bio: a.bio,
    }))
  } else {
    artists = artists.map((a: any) => ({
      _id: a.id,
      name: a.name,
      slug: { current: a.slug },
      portrait: a.portraitPath ? { asset: { url: a.portraitPath } } : null,
      bio: a.bio,
    }))
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="px-6 md:px-12 pt-20 pb-10 max-w-[1600px] mx-auto">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Галерея</p>
        </ScrollReveal>
        <div className="flex items-end justify-between">
          <SplitText
            text="Художники"
            as="h1"
            className="font-serif leading-none"
            style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' } as React.CSSProperties}
            delay={100}
            stagger={90}
          />
          <span className="hidden md:block font-serif text-black/10 text-6xl leading-none pb-2">
            {artists.length}
          </span>
        </div>
      </div>

      {/* Grid with photos */}
      <div className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {artists.map((artist: any, i: number) => (
            <ScrollReveal key={artist._id} delay={Math.min(i % 4, 3) * 70}>
              <Link href={`/artists/${artist.slug.current}`} className="group block">
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                  {artist.portrait?.asset?.url ? (
                    <Image
                      src={artist.portrait.asset.url}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-300">{artist.name[0]}</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div>
                  <h2 className="font-serif text-base leading-snug group-hover:opacity-50 transition-opacity">
                    {artist.name}
                  </h2>
                  {artist.specialization && (
                    <p className="text-[10px] uppercase tracking-widest text-black/35 mt-1">
                      {artist.specialization}
                    </p>
                  )}
                  {artist.city && (
                    <p className="text-xs font-light text-black/30 mt-0.5">{artist.city}</p>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <ScrollReveal>
        <div className="text-center py-16 px-6 border-t border-gray-100">
          <p className="text-black/30 text-sm font-light mb-6">Хотите представить работы в галерее?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-40 transition-opacity"
          >
            Связаться с нами
            <span className="w-8 h-px bg-black block" />
          </Link>
        </div>
      </ScrollReveal>

    </div>
  )
}
