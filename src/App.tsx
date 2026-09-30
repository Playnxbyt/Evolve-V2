import { useEffect, useState } from 'react'
import { XP_PER_TASK, dayKey, loadState, saveState, startOfDay, type AppState, type CatId, type Priority } from './lib/core'
import Today from './components/Today'

const TABS = ['Today', 'Calendar', 'Analytics'] as const

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Today')
  useEffect(() => { saveState(state) }, [state])

  // Unchecking a task now takes its XP back, so toggling can't be used to farm XP.
  const toggle = (id: string) => setState(s => {
    const key = dayKey(new Date()), was = !!s.completions[key]?.[id]
    return {
      ...s,
      xp: Math.max(0, s.xp + (was ? -XP_PER_TASK : XP_PER_TASK)),
      completions: { ...s.completions, [key]: { ...s.completions[key], [id]: !was } },
    }
  })
  const add = (catId: CatId, text: string, priority: Priority) => setState(s => ({
    ...s,
    tasks: [...s.tasks, { id: crypto.randomUUID(), catId, text, priority, createdAt: startOfDay(new Date()), deletedAt: null }],
  }))
  // Soft delete keeps past completions in your history, like before.
  const remove = (id: string) => setState(s => ({
    ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, deletedAt: startOfDay(new Date()) } : t),
  }))

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-5 pb-16 pt-6">
      <header className="mb-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.3em]">EVOLVE</span>
        <nav className="flex gap-1" aria-label="Primary">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} aria-current={tab === t}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-panel text-teal' : 'text-muted hover:text-ink'}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>
      {tab === 'Today'
        ? <Today state={state} onToggle={toggle} onAdd={add} onRemove={remove} />
        : <p className="rounded-2xl border border-line bg-panel p-8 text-muted">{tab} is the next view to be ported.</p>}
    </div>
  )
}
