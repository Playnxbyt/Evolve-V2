import type { ReactNode } from 'react'
import { Icon } from './Icons'

// Shared page header: title on the left; optional meta (date), bell and avatar on the right.
export default function TopBar({ name, meta, children }: { name: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <header className="mb-7 flex items-start justify-between gap-4">
      <div>{children}</div>
      <div className="flex items-center gap-3">
        {meta && <span className="hidden text-xs text-muted sm:block">{meta}</span>}
        <button aria-label="Notifications" title="Coming soon" className="grid size-9 place-items-center rounded-full text-muted hover:text-ink">
          <Icon name="bell" className="size-[18px]" />
        </button>
        <div aria-hidden="true" className="size-9 rounded-full bg-gradient-to-br from-teal/80 to-blue/80 p-[1.5px]">
          <div className="grid size-full place-items-center rounded-full bg-panel text-sm font-semibold">
            {(name.trim()[0] ?? 'E').toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
