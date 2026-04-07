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
  order_paid: 'Оплата подтверждена',
  service: 'Заявка на услугу',
  subscribe: 'Подписка на рассылку',
}

type NotificationItem = {
  id?: string
  title?: string
  artistName?: string
  price?: number
  slug?: string
  imagePath?: string
}

const SITE_URL = 'https://shmuklergallery.com'

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
  paymentProvider?: string | null
  paymentStatus?: string | null
}

export type NotificationAttemptResult = {
  ok: boolean
  skipped?: boolean
  channel: 'email' | 'telegram'
  detail?: string
  raw?: unknown
}

function buildRows(data: NotificationData): [string, string][] {
  const rows: [string, string][] = []
  const orderItems = parseNotificationItems(data.items)

  if (data.orderId) rows.push(['Заказ №', data.orderId])
  if (data.paymentProvider) rows.push(['Платёж', data.paymentProvider])
  if (data.paymentStatus) rows.push(['Статус оплаты', data.paymentStatus])
  rows.push(['Имя', data.name || '—'])
  rows.push(['Email', data.email || '—'])
  if (data.phone) rows.push(['Телефон', data.phone])
  if (data.service) rows.push(['Услуга', data.service])
  if (orderItems.length > 0) rows.push(['Состав', formatNotificationItems(orderItems)])
  else if (data.items) rows.push(['Состав', data.items])
  if (data.delivery) {
    const deliveryStr = data.delivery + (data.address ? ' — ' + data.address : '') + (data.deliveryPrice ? ` (${data.deliveryPrice} ₽)` : '')
    rows.push(['Доставка', deliveryStr])
  }
  if (data.comment) rows.push(['Комментарий', data.comment])
  if (data.message) rows.push(['Сообщение', data.message])
  if (data.amount) rows.push(['Сумма', `${data.amount} ₽`])

  return rows
}

function parseNotificationItems(value?: string | null): NotificationItem[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item: any) => ({
        id: item?.id ? String(item.id) : undefined,
        title: item?.title ? String(item.title) : undefined,
        artistName: item?.artistName ? String(item.artistName) : undefined,
        price: typeof item?.price === 'number' ? item.price : item?.price ? Number(item.price) : undefined,
        slug: item?.slug ? String(item.slug) : undefined,
        imagePath: item?.imagePath ? String(item.imagePath) : undefined,
      }))
      .filter((item: NotificationItem) => item.title)
  } catch {
    return []
  }
}

function formatNotificationItems(items: NotificationItem[]) {
  return items.map(item => {
    const title = item.artistName ? `${item.artistName} — ${item.title}` : item.title
    const artworkUrl = item.slug ? `${SITE_URL}/artwork/${item.slug}` : null
    const meta = [
      item.id ? `id: ${item.id}` : null,
      typeof item.price === 'number' ? `${item.price.toLocaleString('ru-RU')} ₽` : null,
      artworkUrl ? `ссылка: ${artworkUrl}` : null,
    ].filter(Boolean).join(', ')
    return meta ? `${title} (${meta})` : title || '—'
  }).join('\n')
}

function buildItemsHtml(items: NotificationItem[]) {
  if (items.length === 0) return ''
  const withImages = items.filter(item => item.imagePath)
  if (withImages.length === 0) return ''
  return `
    <div style="margin-top:20px">
      <p style="margin:0 0 12px;font-size:13px;color:#666">Изображения работ</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        ${withImages.map(item => `
          <div style="width:120px">
            ${item.slug
              ? `<a href="${SITE_URL}/artwork/${item.slug}" style="text-decoration:none;color:inherit">
            <img src="${item.imagePath}" alt="${item.title || 'Работа'}" style="width:120px;height:120px;object-fit:cover;background:#f5f5f5;display:block" />
            </a>`
              : `<img src="${item.imagePath}" alt="${item.title || 'Работа'}" style="width:120px;height:120px;object-fit:cover;background:#f5f5f5;display:block" />`}
            <p style="margin:6px 0 0;font-size:12px;color:#666;line-height:1.4">${item.title || ''}</p>
            ${item.slug ? `<p style="margin:4px 0 0;font-size:11px;line-height:1.4"><a href="${SITE_URL}/artwork/${item.slug}" style="color:#0a0a0a">Открыть на сайте</a></p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function escapeTelegram(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function toPlainTelegramText(rows: [string, string][], title: string) {
  return [
    title,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
  ].join('\n')
}

type TelegramResponsePayload = {
  ok?: boolean
  error_code?: number
  description?: string
  result?: unknown
  parameters?: {
    migrate_to_chat_id?: number | string
  }
}

async function postTelegramApi(method: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const result = await response.json().catch(() => null) as TelegramResponsePayload | null
  return { response, result }
}

async function sendTelegramImages(chatId: string, items: NotificationItem[]) {
  const media = items
    .filter(item => item.imagePath)
    .slice(0, 10)
    .map((item, index) => ({
      type: 'photo',
      media: item.imagePath!,
      caption: index === 0 ? 'Изображения работ' : undefined,
    }))

  if (media.length === 0) return
  if (media.length === 1) {
    await postTelegramApi('sendPhoto', {
      chat_id: chatId,
      photo: media[0].media,
      caption: media[0].caption,
    })
    return
  }
  await postTelegramApi('sendMediaGroup', {
    chat_id: chatId,
    media,
  })
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

export async function sendNotificationEmail(data: NotificationData): Promise<NotificationAttemptResult> {
  if (!SMTP_PASS) {
    console.warn('SMTP_PASS not set, skipping email notification')
    return { ok: false, skipped: true, channel: 'email', detail: 'SMTP_PASS not set' }
  }

  const label = TYPE_LABELS[data.type] || data.type
  const rows = buildRows(data)
  const orderItems = parseNotificationItems(data.items)

  const subject = data.amount
    ? `Новый заказ ${data.amount} ₽ — Галерея Шмуклер`
    : `${label} — Галерея Шмуклер`

  const html = buildHtml(label + (data.orderId ? ` — ${data.orderId}` : ''), rows, buildItemsHtml(orderItems))

  try {
    await transporter.sendMail({
      from: `Галерея Шмуклер <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      html,
    })
    console.log('Notification email sent:', subject)
    return { ok: true, channel: 'email', detail: subject }
  } catch (e) {
    console.error('Email notification failed:', e)
    return {
      ok: false,
      channel: 'email',
      detail: e instanceof Error ? e.message : String(e),
      raw: e,
    }
  }
}

export async function sendTelegramNotification(data: NotificationData): Promise<NotificationAttemptResult> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram is not configured, skipping telegram notification')
    return { ok: false, skipped: true, channel: 'telegram', detail: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing' }
  }

  const label = TYPE_LABELS[data.type] || data.type
  const rows = buildRows(data)
  const orderItems = parseNotificationItems(data.items)
  const lines = [
    `<b>${escapeTelegram(label)}</b>`,
    '',
    ...rows.map(([k, v]) => `<b>${escapeTelegram(k)}:</b> ${escapeTelegram(v)}`),
  ]

  try {
    let chatId = TELEGRAM_CHAT_ID
    let { response, result } = await postTelegramApi('sendMessage', {
      chat_id: chatId,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })

    if (response.ok && result?.ok) {
      if ((data.type === 'order' || data.type === 'order_paid') && orderItems.length > 0) {
        await sendTelegramImages(chatId, orderItems).catch(error => {
          console.error('Telegram images failed:', error)
        })
      }
      console.log('Telegram notification sent:', label)
      return { ok: true, channel: 'telegram', detail: 'html', raw: result }
    }

    console.error('Telegram HTML notification failed:', result || response.status)

    const migratedChatId = result?.parameters?.migrate_to_chat_id
    if (migratedChatId) {
      chatId = String(migratedChatId)
      console.warn(`Telegram chat migrated. Retry with chat_id=${chatId} and update TELEGRAM_CHAT_ID in Railway.`)
      ;({ response, result } = await postTelegramApi('sendMessage', {
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }))

      if (response.ok && result?.ok) {
        if ((data.type === 'order' || data.type === 'order_paid') && orderItems.length > 0) {
          await sendTelegramImages(chatId, orderItems).catch(error => {
            console.error('Telegram images failed after migration retry:', error)
          })
        }
        console.log('Telegram notification sent after chat migration retry:', label)
        return { ok: true, channel: 'telegram', detail: `html with migrated chat_id ${chatId}`, raw: result }
      }

      console.error('Telegram migration retry failed:', result || response.status)
    }

    const { response: fallbackResponse, result: fallbackResult } = await postTelegramApi('sendMessage', {
      chat_id: chatId,
      text: toPlainTelegramText(rows, label),
      disable_web_page_preview: true,
    })
    if (!fallbackResponse.ok || !fallbackResult?.ok) {
      throw new Error(`Telegram fallback failed: ${JSON.stringify(fallbackResult || { status: fallbackResponse.status })}`)
    }

    if ((data.type === 'order' || data.type === 'order_paid') && orderItems.length > 0) {
      await sendTelegramImages(chatId, orderItems).catch(error => {
        console.error('Telegram images failed after fallback:', error)
      })
    }
    console.log('Telegram notification sent via fallback:', label)
    return { ok: true, channel: 'telegram', detail: 'plain-text fallback', raw: fallbackResult }
  } catch (e) {
    console.error('Telegram notification failed:', e)
    return {
      ok: false,
      channel: 'telegram',
      detail: e instanceof Error ? e.message : String(e),
      raw: e,
    }
  }
}

export async function sendAdminNotification(data: NotificationData) {
  const [email, telegram] = await Promise.all([
    sendNotificationEmail(data),
    sendTelegramNotification(data),
  ])
  return { email, telegram }
}
