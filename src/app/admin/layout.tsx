import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Администрация — Shmukler Gallery',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  )
}
