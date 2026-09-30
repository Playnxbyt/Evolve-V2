import { useEffect, useState } from 'react'
import { XP_PER_TASK, dayKey, loadState, saveState, startOfDay, type AppState, type CatId, type Priority } from './lib/core'
import Home from './components/Home'
import Sidebar, { type Tab } from './components/Sidebar'
import TopBar from './components/TopBar'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [tab, setTab] = useState<Tab>('Home')
  useEffect(() => { saveState(state) }, [state])

  // Unchecking a task takes its XP back, so toggling can't be used to farm XP.
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
  // Soft delete keeps past completions in your history.
  const remove = (id: string) => setState(s => ({
    ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, deletedAt: startOfDay(new Date()) } : t),
  }))
  const setName = (name: string) => setState(s => ({ ...s, name }))

  return (
    <>
      <Sidebar tab={tab} onChange={setTab} />
      <main className="lg:pl-56">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-6 lg:pb-12">
          {tab === 'Home'
            ? <Home state={state} onToggle={toggle} onAdd={add} onRemove={remove} onSetName={setName} onNavigate={setTab} />
            : (
              <>
                <TopBar name={state.name}><h1 className="text-3xl font-bold tracking-tight">{tab}</h1></TopBar>
                <p className="rounded-2xl border border-line bg-panel p-8 text-muted">{tab} is coming in a later step.</p>
              </>
            )}
        </div>
      </main>
    </>
  )
}
