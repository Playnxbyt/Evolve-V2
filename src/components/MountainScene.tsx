import { useId } from 'react'

const STARS: [number, number, number][] = [
  [30, 30, 1], [70, 60, 0.8], [120, 25, 1.2], [170, 50, 0.8], [250, 30, 1], [300, 65, 0.8],
  [350, 28, 1.2], [380, 70, 0.8], [210, 18, 0.7], [90, 100, 0.7], [330, 105, 0.7],
]

// Night mountain scene drawn in SVG. Swap this for a real photo later if you like.
export default function MountainScene({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const ref = (n: string) => `url(#${n}-${uid})`
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040b11" /><stop offset="0.55" stopColor="#0a2430" /><stop offset="1" stopColor="#14444b" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.8" r="0.55">
          <stop offset="0" stopColor="#64e8d3" stopOpacity="0.4" /><stop offset="1" stopColor="#64e8d3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`lit-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8dbcc6" /><stop offset="1" stopColor="#163442" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={ref('sky')} />
      <rect width="400" height="300" fill={ref('glow')} />
      {STARS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#e6fbff" opacity="0.8" />)}
      <path d="M0 215 L45 180 L85 200 L135 160 L185 205 L235 175 L290 210 L345 172 L400 210 L400 300 L0 300Z" fill="#143742" opacity="0.9" />
      <path d="M30 300 L140 175 L175 130 L200 72 L228 122 L250 108 L290 170 L380 300Z" fill="#091821" />
      <path d="M200 72 L228 122 L250 108 L290 170 L380 300 L290 300 L262 210 L232 170 L212 115Z" fill={ref('lit')} opacity="0.85" />
      <path d="M200 72 L183 106 L194 101 L201 116 L210 100 L221 111 L228 122Z" fill="#dcefef" opacity="0.7" />
      <path d="M200 72 L175 130 L140 175" fill="none" stroke="#8dbcc6" strokeOpacity="0.25" strokeWidth="1.2" />
      <path d="M0 262 C70 238 140 258 220 246 C300 234 350 252 400 240 L400 300 L0 300Z" fill="#050e14" />
    </svg>
  )
}
