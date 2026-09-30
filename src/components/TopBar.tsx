import type { ReactNode } from 'react'
import { Icon } from './Icons'

// Shared page header: page title on the left, bell + avatar on the right.
export default function TopBar({ name, children }: { name: string; children: ReactNode }) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>{children}</div>
      <div className="flex items-center gap-3">
        <button aria-label="Notifications" title="Coming soon"
          className="grid size-9 place-items-center rounded-full border border-line bg-panel text-muted hover:text-ink">
          <Icon name="bell" className="size-4" />
        </button>
        <div aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-teal to-blue text-sm font-bold text-bg">
          {(name.trim()[0] ?? 'E').toUpperCase()}
        </div>
      </div>
    </header>
  )
}
