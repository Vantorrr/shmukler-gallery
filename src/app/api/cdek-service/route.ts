import { NextRequest, NextResponse } from 'next/server'

const CDEK_API = 'https://api.cdek.ru/v2'

async function getToken(): Promise<string> {
  const account = process.env.CDEK_ACCOUNT
  const key = process.env.CDEK_KEY
  if (!account || !key) throw new Error('CDEK credentials not configured')

  const res = await fetch(`${CDEK_API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: account,
      client_secret: key,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('CDEK auth failed')
  return data.access_token
}

const CDEK_HEADERS = {
  'X-App-Name': 'widget_pvz',
  'X-App-Version': '3.11.1',
}

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'X-Service-Version': '3.11.1',
}

// Both GET and POST come to this handler; widget sends action in query params
async function handle(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    let body: Record<string, unknown> = {}
    if (req.method === 'POST') {
      try { body = await req.json() } catch { /* empty body */ }
    }

    // Merge query params and body
    const params: Record<string, string> = {}
    searchParams.forEach((v, k) => { if (k !== 'action') params[k] = v })

    const token = await getToken()
    const authHeader = { Authorization: `Bearer ${token}`, ...CDEK_HEADERS }

    console.log('[CDEK proxy] action:', action, 'method:', req.method)

    if (action === 'offices') {
      const qs = new URLSearchParams({ ...params, ...body as Record<string, string> })
      const upstream = await fetch(`${CDEK_API}/deliverypoints?${qs}`, { headers: authHeader })
      const text = await upstream.text()
      return new NextResponse(text, { headers: RESPONSE_HEADERS })
    }

    if (action === 'calculate' || (req.method === 'POST' && !action)) {
      console.log('[CDEK calculate] request body:', JSON.stringify(body))
      const upstream = await fetch(`${CDEK_API}/calculator/tarifflist`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const text = await upstream.text()
      console.log('[CDEK calculate] response status:', upstream.status, 'body:', text.slice(0, 500))
      return new NextResponse(text, { headers: RESPONSE_HEADERS })
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 })
  } catch (e) {
    console.error('CDEK service error:', e)
    return NextResponse.json({ message: String(e) }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
