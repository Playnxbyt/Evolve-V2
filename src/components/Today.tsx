import { useState } from 'react'
import { CATS, dayKey, dayPct, levelInfo, streak, tasksOn, type AppState, type CatId, type Priority } from '../lib/core'

interface Props {
  state: AppState
  onToggle: (id: string) => void
  onAdd: (catId: CatId, text: string, priority: Priority) => void
  onRemove: (id: string) => void
}

export default function Today({ state, onToggle, onAdd, onRemove }: Props) {
  const now = new Date()
  const tasks = tasksOn(state, now)
  const done = state.completions[dayKey(now)] ?? {}
  const doneCount = tasks.filter(t => done[t.id]).length
  const pct = dayPct(state, now)
  const lvl = levelInfo(state.xp)
  const circ = 2 * Math.PI * 90
  const hour = now.getHours()

  const [text, setText] = useState('')
  const [catId, setCatId] = useState<CatId>('mental')
  const [priority, setPriority] = useState<Priority>('medium')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(catId, text.trim(), priority)
    setText('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Good {hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}.</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="rounded-xl border border-line bg-panel px-4 py-2">{streak(state)} day streak</span>
          <span className="rounded-xl border border-line bg-panel px-4 py-2">{lvl.icon} Lv {lvl.level} {lvl.title}</span>
        </div>
      </div>

      <section className="grid items-center gap-6 rounded-2xl border border-line bg-panel p-6 sm:grid-cols-[200px_1fr]">
        <div className="relative mx-auto h-[200px] w-[200px]">
          <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" role="img" aria-label={`${pct}% complete`}>
            <circle cx="110" cy="110" r="90" fill="none" stroke="#1a2a32" strokeWidth="12" />
            <circle cx="110" cy="110" r="90" fill="none" stroke="var(--color-teal)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${pct / 100 * circ} ${circ}`} className="transition-[stroke-dasharray] duration-500" />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-4xl font-bold">{pct}%</div>
        </div>
        <div>
          <p className="text-2xl font-bold">{doneCount} <span className="text-base font-normal text-muted">of {tasks.length} tasks done</span></p>
          <p className="mt-2 text-muted">
            {!tasks.length ? 'Add a task to create today’s list.' : pct === 100 ? 'Everything is done for today.' : `${tasks.length - doneCount} left. Start with the next one.`}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-line" title={`${state.xp} XP`}>
            <div className="h-full bg-blue transition-[width] duration-500" style={{ width: `${lvl.pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">{state.xp} XP{lvl.toNext ? ` · ${lvl.toNext} to next level` : ' · max level'}</p>
        </div>
      </section>

      <form onSubmit={submit} className="flex flex-wrap gap-2 rounded-2xl border border-line bg-panel p-4">
        <input value={text} onChange={e => setText(e.target.value)} maxLength={120} placeholder="Add a task, e.g. Read 10 pages"
          aria-label="Task" className="min-w-0 flex-1 basis-56 rounded-lg border border-line bg-bg px-3 py-2" />
        <select value={catId} onChange={e => setCatId(e.target.value as CatId)} aria-label="Category" className="rounded-lg border border-line bg-bg px-3 py-2">
          {CATS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value as Priority)} aria-label="Priority" className="rounded-lg border border-line bg-bg px-3 py-2">
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <button className="rounded-lg bg-teal px-4 py-2 font-medium text-bg">Add task</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {CATS.map(cat => {
          const ts = tasks.filter(t => t.catId === cat.id)
          return (
            <section key={cat.id} className="rounded-2xl border border-line bg-panel p-4">
              <h2 className="mb-3 flex items-center gap-2 font-semibold" style={{ color: cat.color }}>
                <span aria-hidden>{cat.emoji}</span>{cat.label}
                <span className="ml-auto text-xs text-muted">{ts.filter(t => done[t.id]).length}/{ts.length}</span>
              </h2>
              {ts.length === 0 && <p className="text-sm text-muted">No tasks yet.</p>}
              <ul className="space-y-1">
                {ts.map(t => (
                  <li key={t.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5">
                    <input type="checkbox" checked={!!done[t.id]} onChange={() => onToggle(t.id)} aria-label={t.text}
                      className="size-5 cursor-pointer" style={{ accentColor: cat.color }} />
                    <span className={`flex-1 ${done[t.id] ? 'text-muted line-through' : ''}`}>{t.text}</span>
                    <button onClick={() => { if (confirm('Delete this task from today onward? Past completions stay in your history.')) onRemove(t.id) }}
                      aria-label={`Delete ${t.text}`} className="px-2 text-muted opacity-0 hover:text-red-400 focus:opacity-100 group-hover:opacity-100">×</button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
