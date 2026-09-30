import { Icon, type IconName } from './Icons'

export const NAV: { id: string; icon: IconName }[] = [
  { id: 'Home', icon: 'home' },
  { id: 'Habits', icon: 'habits' },
  { id: 'Analytics', icon: 'analytics' },
  { id: 'Calendar', icon: 'calendar' },
  { id: 'Evolution', icon: 'evolution' },
  { id: 'Profile', icon: 'profile' },
]
export type Tab = 'Home' | 'Habits' | 'Analytics' | 'Calendar' | 'Evolution' | 'Profile'

interface Props { tab: Tab; onChange: (t: Tab) => void }

export default function Sidebar({ tab, onChange }: Props) {
  return (
    <>
      {/* Desktop: left rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-line bg-bg/80 px-4 py-6 backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-teal to-blue text-xs font-bold text-bg">E</span>
          <span className="text-sm font-bold tracking-[0.3em]">EVOLVE</span>
        </div>
        <nav aria-label="Primary" className="space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => onChange(n.id as Tab)} aria-current={tab === n.id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${tab === n.id ? 'bg-panel text-teal' : 'text-muted hover:text-ink'}`}>
              <Icon name={n.icon} className="size-[18px]" />{n.id}
            </button>
          ))}
        </nav>
        <p className="mt-auto px-2 text-xs leading-relaxed text-muted">Small steps every day create extraordinary results.</p>
      </aside>

      {/* Mobile: bottom bar */}
      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-6 border-t border-line bg-panel lg:hidden">
        {NAV.map(n => (
          <button key={n.id} onClick={() => onChange(n.id as Tab)} aria-current={tab === n.id ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 py-2.5 text-[10px] ${tab === n.id ? 'text-teal' : 'text-muted'}`}>
            <Icon name={n.icon} className="size-5" />{n.id}
          </button>
        ))}
      </nav>
    </>
  )
}
