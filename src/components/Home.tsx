import { useEffect, useState, type FormEvent } from 'react'
import {
  CATS, PRIORITY_RANK, dayKey, dayPct, insight, levelInfo, streak, tasksOn, weekDots,
  type AppState, type CatId, type Priority,
} from '../lib/core'
import { Icon, type IconName } from './Icons'
import MountainScene from './MountainScene'
import TopBar from './TopBar'
import type { Tab } from './Sidebar'

interface Props {
  state: AppState
  onToggle: (id: string) => void
  onAdd: (catId: CatId, text: string, priority: Priority) => void
  onRemove: (id: string) => void
  onSetName: (name: string) => void
  onNavigate: (tab: Tab) => void
}

const CAT_ICON: Record<CatId, IconName> = { fitness: 'dumbbell', mental: 'sparkle', social: 'people', skills: 'bolt' }
const field = 'w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm'
const RING_R = 122

export default function Home({ state, onToggle, onAdd, onRemove, onSetName, onNavigate }: Props) {
  const now = new Date()
  const tasks = tasksOn(state, now)
  const done = state.completions[dayKey(now)] ?? {}
  const doneCount = tasks.filter(t => done[t.id]).length
  const pct = dayPct(state, now)
  const lvl = levelInfo(state.xp)
  const days = streak(state)
  const week = weekDots(state, now)
  const remaining = tasks.filter(t => !done[t.id]).sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
  const focus = remaining[0]
  const hour = now.getHours()
  const circ = 2 * Math.PI * RING_R
  const dateLabel = `${now.toLocaleDateString('en-US', { weekday: 'short' })}, ${now.getDate()} ${now.toLocaleDateString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')
  const [catId, setCatId] = useState<CatId>('mental')
  const [priority, setPriority] = useState<Priority>('medium')

  useEffect(() => {
    if (!adding) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAdding(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [adding])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(catId, text.trim(), priority)
    setText('')
    setAdding(false)
  }
  const askName = () => {
    const n = window.prompt('What should I call you?', state.name)
    if (n && n.trim()) onSetName(n.trim().slice(0, 40))
  }

  const quick: { label: string; icon: IconName; run: () => void }[] = [
    { label: 'Add Habit', icon: 'plus', run: () => setAdding(true) },
    { label: 'View Calendar', icon: 'calendar', run: () => onNavigate('Calendar') },
    { label: 'Set Goal', icon: 'goal', run: () => onNavigate('Evolution') },
    { label: 'View Analytics', icon: 'analytics', run: () => onNavigate('Analytics') },
  ]

  return (
    <div>
      <TopBar name={state.name} meta={dateLabel}>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
          Good {hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}{state.name ? `, ${state.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Discipline today builds the freedom you want tomorrow.
          <button onClick={askName} className="ml-2 text-xs text-muted/60 hover:text-teal hover:underline">
            {state.name ? 'Change name' : 'Add your name'}
          </button>
        </p>
      </TopBar>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="space-y-5">
          <section className="card relative overflow-hidden">
            <MountainScene className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16] [mask-image:linear-gradient(to_bottom,transparent,black_75%)]" />
            <div className="relative grid place-items-center px-6 pb-5 pt-9">
              <div className="relative size-[260px]">
                <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-teal/10 blur-2xl" />
                <div className="absolute inset-4 overflow-hidden rounded-full ring-1 ring-white/10">
                  <MountainScene className="h-full w-full" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(3,9,14,0.6),rgba(3,9,14,0.05)_80%)]" />
                </div>
                <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full -rotate-90" role="img" aria-label={`${pct}% complete`}>
                  <defs>
                    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#64e8d3" /><stop offset="1" stopColor="#57b9f5" />
                    </linearGradient>
                  </defs>
                  <circle cx="130" cy="130" r={RING_R} fill="none" stroke="#12303a" strokeOpacity="0.8" strokeWidth="8" />
                  {pct > 0 && (
                    <circle cx="130" cy="130" r={RING_R} fill="none" stroke="url(#ring)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${pct / 100 * circ} ${circ}`}
                      style={{ filter: 'drop-shadow(0 0 7px rgba(100,232,211,0.55))', transition: 'stroke-dasharray 0.5s' }} />
                  )}
                </svg>
                <div className="absolute inset-0 grid place-content-center text-center">
                  <div className="text-6xl font-medium tracking-tight drop-shadow-lg">{pct}<span className="text-3xl text-ink/80">%</span></div>
                  <div className="mt-1 text-xs text-ink/70">Today’s Progress</div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/5 px-6 py-4">
              <p className="text-sm text-muted">
                <span className="text-lg font-semibold text-ink">{doneCount}</span> of {tasks.length} habits done
              </p>
              <div className="flex min-w-[220px] flex-1 items-center gap-3 sm:max-w-sm sm:ml-auto">
                <span className="whitespace-nowrap text-xs">{lvl.icon} Lv {lvl.level} · {lvl.title}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10" title={lvl.toNext ? `${lvl.toNext} XP to next level` : 'Max level'}>
                  <div className="h-full rounded-full bg-gradient-to-r from-teal to-blue transition-[width] duration-500" style={{ width: `${lvl.pct}%` }} />
                </div>
                <span className="whitespace-nowrap text-xs text-muted">{state.xp} XP</span>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-3 flex items-center">
              <h2 className="font-semibold">Today’s Habits</h2>
              <span className="ml-auto text-xs text-muted">{doneCount}/{tasks.length}</span>
            </div>
            {tasks.length === 0 && <p className="py-2 text-sm text-muted">No habits yet. Add your first one to start your day.</p>}
            <ul className="space-y-2">
              {tasks.map(t => {
                const cat = CATS.find(c => c.id === t.catId)!, isDone = !!done[t.id]
                return (
                  <li key={t.id} className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
                    <span className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors ${isDone ? 'bg-mint/15 text-mint' : 'bg-white/[0.06] text-ink/80'}`}>
                      <Icon name={CAT_ICON[t.catId]} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.text}</p>
                      <p className="truncate text-xs text-muted">{cat.label}{t.priority === 'high' ? ' · High priority' : ''}</p>
                    </div>
                    <button onClick={() => { if (confirm('Delete this habit from today onward? Past completions stay in your history.')) onRemove(t.id) }}
                      aria-label={`Delete ${t.text}`} className="px-2 text-muted opacity-0 hover:text-red-400 focus:opacity-100 group-hover:opacity-100">×</button>
                    <button role="checkbox" aria-checked={isDone} aria-label={t.text} onClick={() => onToggle(t.id)}
                      className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all ${isDone ? 'border-mint bg-mint text-bg shadow-[0_0_12px_rgba(61,220,151,0.45)]' : 'border-white/25 text-transparent hover:border-mint'}`}>
                      <Icon name="check" className="size-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
            <button onClick={() => setAdding(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-2.5 text-sm text-muted hover:border-teal/40 hover:text-teal">
              <Icon name="plus" className="size-4" />Add habit
            </button>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <section className="card p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-orange-400/10 text-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.25)]">
                <Icon name="flame" className="size-6" />
              </span>
              <div>
                <p className="text-4xl font-semibold leading-none">{days}</p>
                <p className="mt-1 text-xs text-muted">Day Streak</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-1 text-center">
              {week.map((d, i) => {
                const full = d.hasTasks && d.pct === 100
                const look = full ? 'bg-mint text-bg shadow-[0_0_12px_rgba(61,220,151,0.5)]'
                  : d.pct > 0 ? 'border border-mint/60 bg-mint/15'
                  : d.hasTasks && !d.future ? 'bg-white/[0.07]'
                  : 'border border-white/10'
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-[11px] text-muted">{d.label}</span>
                    <span title={d.future ? '' : `${d.pct}%`}
                      className={`grid size-6 place-items-center rounded-full ${look} ${d.isToday ? 'ring-2 ring-teal/50 ring-offset-2 ring-offset-panel' : ''}`}>
                      {full && <Icon name="check" className="size-3.5" />}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-sm font-semibold">Daily Focus</h2>
            {focus ? (
              <div className="mt-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{focus.text}</p>
                  <p className="mt-0.5 text-xs text-muted">{remaining.length > 1 ? `+ ${remaining.length - 1} more habits` : 'Last one for today'}</p>
                </div>
                <button onClick={() => onToggle(focus.id)} aria-label={`Mark ${focus.text} done`} title="Mark done"
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-muted hover:border-mint hover:text-mint">
                  <Icon name="check" className="size-4" />
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">{tasks.length ? 'Nothing left. Nice work.' : 'Add a habit to set your focus.'}</p>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
            <div className="space-y-2">
              {quick.map(a => (
                <button key={a.label} onClick={a.run}
                  className="flex w-full items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.08]">
                  <Icon name={a.icon} className="size-4 text-muted" />{a.label}
                </button>
              ))}
            </div>
          </section>

          <section className="card flex gap-3 p-5">
            <Icon name="bulb" className="mt-0.5 size-5 shrink-0 text-yellow-300" />
            <div>
              <h2 className="text-sm font-semibold">Today’s Insight</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{insight(state, now)}</p>
            </div>
          </section>
        </div>
      </div>

      {adding && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={e => { if (e.target === e.currentTarget) setAdding(false) }}>
          <form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Add a habit" className="card w-full max-w-md space-y-4 p-6">
            <h2 className="text-lg font-semibold">Add a habit</h2>
            <input autoFocus value={text} onChange={e => setText(e.target.value)} maxLength={120}
              placeholder="e.g. Read 10 pages" aria-label="Habit" className={field} />
            <div className="grid grid-cols-2 gap-3">
              <select value={catId} onChange={e => setCatId(e.target.value as CatId)} aria-label="Category" className={field}>
                {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)} aria-label="Priority" className={field}>
                <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAdding(false)} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-ink">Cancel</button>
              <button className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-bg">Add habit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
