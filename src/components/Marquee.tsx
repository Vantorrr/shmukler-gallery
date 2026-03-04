'use client'

interface MarqueeProps {
  items: string[]
  speed?: number
  className?: string
  separator?: string
}

export function Marquee({ items, speed = 40, className = '', separator = '·' }: MarqueeProps) {
  const doubled = [...items, ...items]

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-block"
        style={{
          animation: `marqueeScroll ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-block">
            <span>{item}</span>
            <span className="mx-6 opacity-30">{separator}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
