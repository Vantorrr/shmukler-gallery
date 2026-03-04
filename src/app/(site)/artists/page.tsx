import { client } from '@sanity/lib/client'
import { ARTISTS_QUERY } from '@sanity/lib/queries'
import { MOCK_ARTISTS } from '@/lib/mockData'
import { ScrollReveal } from '@/components/ScrollReveal'
import { SplitText } from '@/components/SplitText'
import { ArtistRow } from '@/components/ArtistRow'
import Link from 'next/link'
import React from 'react'

export const revalidate = 60

export default async function ArtistsPage() {
  let artists = []

  try {
    artists = await client.fetch(ARTISTS_QUERY)
  } catch {
    // ignore
  }
  if (!artists?.length) artists = MOCK_ARTISTS

  return (
    <div className="min-h-screen bg-white">

      {/* Editorial header */}
      <div className="px-6 md:px-12 pt-20 pb-12 max-w-[1600px] mx-auto">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-4">Галерея</p>
        </ScrollReveal>
        <div className="flex items-end justify-between">
          <SplitText
            text="Художники"
            as="h1"
            className="font-serif italic leading-none"
            style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' } as React.CSSProperties}
            delay={100}
            stagger={90}
          />
          <span className="hidden md:block font-serif italic text-black/20 text-6xl leading-none pb-2">
            {artists.length}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/10 mx-6 md:mx-12" />

      {/* Artist list — editorial rows */}
      <div className="max-w-[1600px] mx-auto">
        {artists.map((artist: any, i: number) => (
          <ScrollReveal key={artist._id} delay={i < 4 ? i * 60 : 0}>
            <ArtistRow artist={artist} index={i} />
          </ScrollReveal>
        ))}
      </div>

      {/* Bottom CTA */}
      <ScrollReveal>
        <div className="text-center py-24 px-6">
          <p className="text-black/30 text-sm font-light mb-6">
            Хотите представить работы в галерее?
          </p>
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
