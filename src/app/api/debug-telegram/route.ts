import { NextResponse } from 'next/server'

export async function GET() {
  const hasToken = Boolean(process.env.TELEGRAM_BOT_TOKEN)
  const hasChatId = Boolean(process.env.TELEGRAM_CHAT_ID)

  let sendOk = false
  let sendStatus: number | null = null
  let sendBody = ''

  if (hasToken && hasChatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: 'Debug telegram check from production',
        }),
      })
      sendStatus = res.status
      sendBody = await res.text()
      sendOk = res.ok
    } catch (e) {
      sendBody = String(e)
    }
  }

  return NextResponse.json({
    hasToken,
    hasChatId,
    sendOk,
    sendStatus,
    sendBody,
  })
}
