export type ArtworkArtistLink = {
  name: string
  slug?: string
}

export function parseStringArray(value?: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.map(String).map(s => s.trim()).filter(Boolean)
  } catch {
    return value.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

export function stringifyStringArray(values: string[]): string {
  return JSON.stringify(values.map(v => v.trim()).filter(Boolean))
}

export function parseArtists(value?: string | null, fallback?: { name?: string | null; slug?: string | null }): ArtworkArtistLink[] {
  const links: ArtworkArtistLink[] = []

  if (value) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          const name = String(item?.name || '').trim()
          const slug = String(item?.slug || '').trim()
          if (name) links.push({ name, slug: slug || undefined })
        })
      }
    } catch {
      // ignore malformed legacy values
    }
  }

  if (links.length === 0 && fallback?.name) {
    links.push({ name: fallback.name, slug: fallback.slug || undefined })
  }

  return links
}

export function stringifyArtists(artists: ArtworkArtistLink[]): string | null {
  const normalized = artists
    .map(artist => ({
      name: String(artist.name || '').trim(),
      slug: String(artist.slug || '').trim(),
    }))
    .filter(artist => artist.name)

  return normalized.length > 0 ? JSON.stringify(normalized) : null
}

export function artworkHasArtistSlug(artwork: { artistSlug?: string | null; artistsJson?: string | null }, artistSlug: string) {
  if (!artistSlug) return true
  if (artwork.artistSlug === artistSlug) return true
  return parseArtists(artwork.artistsJson).some(artist => artist.slug === artistSlug)
}
