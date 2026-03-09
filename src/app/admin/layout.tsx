import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ — Shmukler Gallery',
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {children}
    </div>
  )
}
