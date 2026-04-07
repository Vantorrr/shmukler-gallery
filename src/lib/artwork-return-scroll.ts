const STORAGE_KEY = 'artwork-return-scroll'

type SavedScroll = {
  path: string
  y: number
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function saveArtworkReturnScroll() {
  if (typeof window === 'undefined') return
  const payload: SavedScroll = {
    path: getCurrentPath(),
    y: window.scrollY,
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function getArtworkReturnScroll() {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as SavedScroll
    if (parsed.path !== getCurrentPath()) return null
    return parsed
  } catch {
    return null
  }
}

export function clearArtworkReturnScroll() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}
