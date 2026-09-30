import { useRef, useState, type FormEvent } from 'react'
import {
  CATS, PRIORITY_RANK, dayKey, dayPct, insight, levelInfo, streak, tasksOn, weekDots,
  type AppState, type CatId, type Priority,
} from '../lib/core'
import { Icon } from './Icons'
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

const card = 'rounded-2xl border border-line bg-panel'
const field = 'rounded-lg border border-line bg-bg px-3 py-2'

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
  const circ = 2 * Math.PI * 90

  const [text, setText] = useState('')
  const [catId, setCatId] = useState<CatId>('mental')
  const [priority, setPriority] = useState<Priority>('medium')
  const inputRef = useRef<HTMLInputElement>(null)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(catId, text.trim(), priority)
    setText('')
  }
  const askName = () => {
    const n = window.prompt('What should I call you?', state.name)
    if (n && n.trim()) onSetName(n.trim().slice(0, 40))
  }
  const focusForm = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    inputRef.current?.focus()
  }

  return (
    <div>
      <TopBar name={state.name}>
        <p className="text-xs text-muted">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Good {hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}{state.name ? `, ${state.name}` : ''}.
        </h1>
        <button onClick={askName} className="mt-1 text-xs text-muted hover:text-teal">
          {state.name ? 'Change name' : 'Add your name'}
        </button>
      </TopBar>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-5">
          <section className={`${card} relative grid items-center gap-6 overflow-hidden p-6 sm:grid-cols-[220px_1fr]`}>
            <svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 h-2/3 w-3/4 text-teal opacity-[0.07]">
              <path fill="currentColor" d="M0 120 L70 52 L110 82 L170 18 L240 92 L290 56 L400 120 Z" />
            </svg>

            <div className="relative mx-auto h-[220px] w-[220px]">
              <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" role="img" aria-label={`${pct}% complete`}>
                <defs>
                  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#64e8d3" /><stop offset="1" stopColor="#57b9f5" />
                  </linearGradient>
                </defs>
                <circle cx="110" cy="110" r="90" fill="none" stroke="#1a2a32" strokeWidth="12" />
                {pct > 0 && (
                  <circle cx="110" cy="110" r="90" fill="none" stroke="url(#ring)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${pct / 100 * circ} ${circ}`}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(100,232,211,0.45))', transition: 'stroke-dasharray 0.5s' }} />
                )}
              </svg>
              <div className="absolute inset-0 grid place-content-center text-center">
                <div className="text-5xl font-bold">{pct}<span className="text-2xl text-muted">%</span></div>
                <div className="mt-1 text-xs text-muted">Today’s Progress</div>
              </div>
            </div>

            <div className="relative">
              <p className="text-2xl font-bold">{doneCount} <span className="text-base font-normal text-muted">of {tasks.length} tasks done</span></p>
              <p className="mt-2 text-muted">
                {!tasks.length ? 'Add a task to create today’s list.' : pct === 100 ? 'Everything is done for today.' : `${tasks.length - doneCount} left. Start with the next one.`}
              </p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span>{lvl.icon} Level {lvl.level} · {lvl.title}</span>
                <span className="text-xs text-muted">{state.xp} XP</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" title={`${state.xp} XP`}>
                <div className="h-full bg-gradient-to-r from-teal to-blue transition-[width] duration-500" style={{ width: `${lvl.pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted">{lvl.toNext ? `${lvl.toNext} XP to next level` : 'Max level reached'}</p>
            </div>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="mb-3 flex items-center font-semibold">
              Today’s Tasks <span className="ml-auto text-xs font-normal text-muted">{doneCount}/{tasks.length}</span>
            </h2>
            {tasks.length === 0 && <p className="py-3 text-sm text-muted">No tasks yet. Add your first one below.</p>}
            <ul className="space-y-1.5">
              {tasks.map(t => {
                const cat = CATS.find(c => c.id === t.catId)!, isDone = !!done[t.id]
                return (
                  <li key={t.id} className="group flex items-center gap-3 rounded-xl border border-line bg-bg/40 px-3 py-2.5">
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg text-base" style={{ background: `${cat.color}22` }}>{cat.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate font-medium ${isDone ? 'text-muted line-through' : ''}`}>{t.text}</p>
                      <p className="text-xs" style={{ color: cat.color }}>
                        {cat.label}{t.priority === 'high' && <span className="text-muted"> · High priority</span>}
                      </p>
                    </div>
                    <button onClick={() => { if (confirm('Delete this task from today onward? Past completions stay in your history.')) onRemove(t.id) }}
                      aria-label={`Delete ${t.text}`} className="px-2 text-muted opacity-0 hover:text-red-400 focus:opacity-100 group-hover:opacity-100">×</button>
                    <button role="checkbox" aria-checked={isDone} aria-label={t.text} onClick={() => onToggle(t.id)}
                      className={`grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${isDone ? 'border-teal bg-teal text-bg' : 'border-muted/50 text-transparent hover:border-teal'}`}>
                      <Icon name="check" className="size-4" />
                    </button>
                  </li>
                )
              })}
            </ul>

            <form onSubmit={submit} className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <input ref={inputRef} value={text} onChange={e => setText(e.target.value)} maxLength={120} placeholder="Add a task, e.g. Read 10 pages"
                aria-label="Task" className={`${field} min-w-0 flex-1 basis-48`} />
              <select value={catId} onChange={e => setCatId(e.target.value as CatId)} aria-label="Category" className={field}>
                {CATS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)} aria-label="Priority" className={field}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
              <button className="rounded-lg bg-teal px-4 py-2 font-medium text-bg">Add task</button>
            </form>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <section className={`${card} p-5`}>
            <div className="flex items-center gap-3">
              <Icon name="flame" className="size-8 text-orange-400" />
              <div>
                <p className="text-3xl font-bold leading-none">{days}</p>
                <p className="mt-1 text-xs text-muted">Day Streak</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] text-muted">
              {week.map((d, i) => {
                const full = d.hasTasks && d.pct === 100
                const look = full ? 'border-teal bg-teal' : d.pct > 0 ? 'border-teal/60 bg-teal/30' : d.hasTasks && !d.future ? 'border-line bg-line' : 'border-line'
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span>{d.label}</span>
                    <span title={d.future ? '' : `${d.pct}%`}
                      className={`size-3 rounded-full border ${look} ${d.isToday ? 'ring-2 ring-teal/60 ring-offset-2 ring-offset-panel' : ''}`} />
                  </div>
                )
              })}
            </div>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="text-sm font-semibold">Daily Focus</h2>
            {focus ? (
              <div className="mt-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{focus.text}</p>
                  <p className="text-xs text-muted">{remaining.length > 1 ? `+ ${remaining.length - 1} more tasks` : 'Last one for today'}</p>
                </div>
                <button onClick={() => onToggle(focus.id)} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-teal hover:bg-white/5">Mark done</button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">{tasks.length ? 'Nothing left. Nice work.' : 'Add a task to set your focus.'}</p>
            )}
          </section>

          <section className={`${card} p-5`}>
            <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
            <div className="space-y-2">
              {([
                { label: 'Add Task', icon: 'plus', run: focusForm },
                { label: 'View Calendar', icon: 'calendar', run: () => onNavigate('Calendar') },
                { label: 'View Analytics', icon: 'analytics', run: () => onNavigate('Analytics') },
              ] as const).map(a => (
                <button key={a.label} onClick={a.run}
                  className="flex w-full items-center gap-3 rounded-lg border border-line bg-bg/40 px-3 py-2.5 text-sm hover:bg-white/5">
                  <Icon name={a.icon} className="size-4 text-muted" />{a.label}
                  <Icon name="chevron" className="ml-auto size-4 text-muted" />
                </button>
              ))}
            </div>
          </section>

          <section className={`${card} flex gap-3 p-5`}>
            <Icon name="bulb" className="mt-0.5 size-5 shrink-0 text-yellow-300" />
            <div>
              <h2 className="text-sm font-semibold">Today’s Insight</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{insight(state, now)}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
