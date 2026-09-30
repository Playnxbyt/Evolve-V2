import { Icon, type IconName } from './Icons'
import MountainScene from './MountainScene'

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
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col overflow-hidden border-r border-white/[0.06] bg-[#050a0f] px-4 py-7 lg:flex">
        <div className="mb-9 flex items-center gap-3 px-2">
          <svg viewBox="0 0 24 24" className="size-6 text-teal" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2.5l8 9.5-8 9.5-8-9.5z" /><path d="M12 7.5l4 4.5-4 4.5-4-4.5z" />
          </svg>
          <span className="text-[13px] font-semibold tracking-[0.4em]">EVOLVE</span>
        </div>
        <nav aria-label="Primary" className="relative z-10 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => onChange(n.id as Tab)} aria-current={tab === n.id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${tab === n.id ? 'bg-white/[0.07] text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'text-muted hover:bg-white/[0.03] hover:text-ink'}`}>
              <Icon name={n.icon} className={`size-[18px] ${tab === n.id ? 'text-teal' : ''}`} />{n.id}
            </button>
          ))}
        </nav>
        <MountainScene className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full [mask-image:linear-gradient(to_top,black_45%,transparent)]" />
        <p className="relative z-10 mt-auto px-2 text-xs leading-relaxed text-ink/70">
          Small steps<br />every day create<br />extraordinary results.
        </p>
      </aside>

      {/* Mobile: bottom bar */}
      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-6 border-t border-white/[0.06] bg-[#050a0f]/95 backdrop-blur lg:hidden">
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
