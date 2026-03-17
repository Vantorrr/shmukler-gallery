import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Администрация — Шмуклер Галерея',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
