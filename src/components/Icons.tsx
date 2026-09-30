// Tiny inline icon set so we don't need a new dependency (keeps package-lock.json untouched).
const PATHS = {
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  habits: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6',
  analytics: 'M5 20V11 M12 20V4 M19 20v-6',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  evolution: 'M12 21V11 M12 11c0-4 3-6 7-6 0 4-3 6-7 6z M12 15c0-3-2-5-6-5 0 3 2 5 6 5z',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 21h4',
  flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z',
  plus: 'M12 5v14 M5 12h14',
  bulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  check: 'M5 12l5 5 9-10',
  chevron: 'M9 6l6 6-6 6',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
