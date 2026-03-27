'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<{ text: string; linkUrl?: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => { if (data?.text) setAnnouncement(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const offset = announcement && !dismissed ? '38px' : '0px'
    document.documentElement.style.setProperty('--announcement-offset', offset)
    return () => document.documentElement.style.setProperty('--announcement-offset', '0px')
  }, [announcement, dismissed])

  if (!announcement || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black text-white text-xs py-2.5 px-12 text-center">
      {announcement.linkUrl ? (
        <Link href={announcement.linkUrl} className="hover:underline">
          {announcement.text}
        </Link>
      ) : (
        <span>{announcement.text}</span>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Закрыть"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
