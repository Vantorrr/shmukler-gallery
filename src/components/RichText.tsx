/**
 * Renders text with simple Markdown-like formatting:
 *   **bold**   → <strong>
 *   *italic*   → <em>
 *   __under__  → <u>
 *   blank line → new paragraph
 *   single \n  → <br>
 */

function parseInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:800">$1</strong>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

export function RichText({
  text,
  className = '',
  paragraphClass = '',
}: {
  text: string
  className?: string
  paragraphClass?: string
}) {
  if (!text) return null

  const paragraphs = text.split(/\n{2,}/)

  return (
    <div className={className}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={`leading-relaxed ${i > 0 ? 'mt-4' : ''} ${paragraphClass}`}
          dangerouslySetInnerHTML={{ __html: parseInline(para) }}
        />
      ))}
    </div>
  )
}
