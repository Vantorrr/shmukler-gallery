'use client'

import { useEffect, useRef, CSSProperties } from 'react'

interface Props {
  text: string
  className?: string
  style?: CSSProperties
  /** ms delay before first word animates in */
  delay?: number
  /** ms stagger between each word */
  stagger?: number
  /** Tailwind / inline tag */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
}

export function SplitText({
  text,
  className = '',
  style,
  delay = 0,
  stagger = 65,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Split into word spans, each word wrapped in overflow:hidden container
    const words = text.split(' ')
    el.innerHTML = words
      .map(
        (word, i) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.28em;line-height:1.15;pointer-events:none">` +
          `<span class="split-word" style="display:inline-block;transform:translateY(110%);transition:transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms;pointer-events:none">` +
          word +
          `</span></span>`
      )
      .join('')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.split-word').forEach((s) => {
            ;(s as HTMLElement).style.transform = 'translateY(0)'
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, delay, stagger])

  // Render with invisible text initially so layout doesn't shift
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={style}>
      {text}
    </Tag>
  )
}
