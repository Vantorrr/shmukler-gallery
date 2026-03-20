import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login') || pathname.startsWith('/api/admin/logout')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = req.cookies.get('admin_token')?.value
    const secret = process.env.ADMIN_SECRET || 'shmukler-admin-secret'
    if (!token || token !== secret) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
