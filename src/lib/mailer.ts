import nodemailer from 'nodemailer'

const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'info@shmuklergallery.ru'
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
})

const TYPE_LABELS: Record<string, string> = {
  contact: 'Контактная форма',
  order: 'Новый заказ',
  service: 'Заявка на услугу',
  subscribe: 'Подписка на рассылку',
}

type NotificationData = {
  type: string
  name: string
  email: string
  phone?: string | null
  message?: string | null
  service?: string | null
  items?: string | null
  amount?: string | null
  delivery?: string | null
  address?: string | null
  comment?: string | null
  orderId?: string | null
  deliveryPrice?: number | null
}

function buildRows(data: NotificationData): [string, string][] {
  const rows: [string, string][] = []

  if (data.orderId) rows.push(['Заказ №', data.orderId])
  rows.push(['Имя', data.name || '—'])
  rows.push(['Email', data.email || '—'])
  if (data.phone) rows.push(['Телефон', data.phone])
  if (data.service) rows.push(['Услуга', data.service])
  if (data.items) rows.push(['Состав', data.items])
  if (data.delivery) {
    const deliveryStr = data.delivery + (data.address ? ' — ' + data.address : '') + (data.deliveryPrice ? ` (${data.deliveryPrice} ₽)` : '')
    rows.push(['Доставка', deliveryStr])
  }
  if (data.comment) rows.push(['Комментарий', data.comment])
  if (data.message) rows.push(['Сообщение', data.message])
  if (data.amount) rows.push(['Сумма', `${data.amount} ₽`])

  return rows
}

function escapeTelegram(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildHtml(title: string, rows: [string, string][], extraHtml = '') {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#0a0a0a;padding:20px 24px">
        <span style="color:#fff;font-size:16px;font-weight:600;letter-spacing:2px">ШМУКЛЕР ГАЛЕРЕЯ</span>
      </div>
      <div style="padding:24px;border:1px solid #e5e5e5;border-top:none">
        <h2 style="margin:0 0 20px;font-size:18px;color:#0a0a0a">${title}</h2>
        <table style="width:100%;border-collapse:collapse">
          ${rows.map(([k, v]) => `
            <tr>
              <td style="padding:8px 12px 8px 0;color:#666;font-size:14px;white-space:nowrap;vertical-align:top">${k}</td>
              <td style="padding:8px 0;font-size:14px;color:#0a0a0a">${v}</td>
            </tr>
          `).join('')}
        </table>
        ${extraHtml}
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e5e5">
          <a href="https://shmuklergallery.com/admin" style="background:#0a0a0a;color:#fff;padding:10px 20px;text-decoration:none;font-size:13px;letter-spacing:1px">ОТКРЫТЬ АДМИН-ПАНЕЛЬ</a>
        </div>
      </div>
      <p style="color:#999;font-size:12px;padding:12px 0">Галерея Шмуклер · shmuklergallery.com</p>
    </div>
  `
}

export async function sendNotificationEmail(data: NotificationData) {
  if (!SMTP_PASS) {
    console.warn('SMTP_PASS not set, skipping email notification')
    return
  }

  const label = TYPE_LABELS[data.type] || data.type
  const rows = buildRows(data)

  const subject = data.amount
    ? `Новый заказ ${data.amount} ₽ — Галерея Шмуклер`
    : `${label} — Галерея Шмуклер`

  const html = buildHtml(label + (data.orderId ? ` — ${data.orderId}` : ''), rows)

  try {
    await transporter.sendMail({
      from: `Галерея Шмуклер <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      html,
    })
    console.log('Notification email sent:', subject)
  } catch (e) {
    console.error('Email notification failed:', e)
  }
}

export async function sendTelegramNotification(data: NotificationData) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram is not configured, skipping telegram notification')
    return
  }

  const label = TYPE_LABELS[data.type] || data.type
  const rows = buildRows(data)
  const lines = [
    `<b>${escapeTelegram(label)}</b>`,
    '',
    ...rows.map(([k, v]) => `<b>${escapeTelegram(k)}:</b> ${escapeTelegram(v)}`),
  ]

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
  } catch (e) {
    console.error('Telegram notification failed:', e)
  }
}

export async function sendAdminNotification(data: NotificationData) {
  await Promise.allSettled([
    sendNotificationEmail(data),
    sendTelegramNotification(data),
  ])
}
