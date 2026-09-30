// Types, storage and all the math. Ported from script.js; no DOM code lives here.
export type CatId = 'fitness' | 'mental' | 'social' | 'skills'
export type Priority = 'low' | 'medium' | 'high'

export interface Task { id: string; catId: CatId; text: string; createdAt: number; deletedAt: number | null; priority: Priority }
export interface AppState {
  tasks: Task[]
  completions: Record<string, Record<string, boolean>>
  xp: number
  badges: string[]
  moodLog: Record<string, string>
}

export const CATS: { id: CatId; label: string; emoji: string; color: string }[] = [
  { id: 'fitness', label: 'Fitness', emoji: '💪', color: '#FF9A62' },
  { id: 'mental', label: 'Mental Growth', emoji: '🧠', color: '#A99BFF' },
  { id: 'social', label: 'Social Growth', emoji: '🤝', color: '#E7C86E' },
  { id: 'skills', label: 'Skills', emoji: '🚀', color: '#64E8D3' },
]
export const LEVELS = [
  { min: 0, title: 'Seedling', icon: '🌱' }, { min: 100, title: 'Grinder', icon: '⚡' },
  { min: 250, title: 'Warrior', icon: '⚔️' }, { min: 500, title: 'Champion', icon: '🏆' },
  { min: 1000, title: 'Legend', icon: '🌟' }, { min: 2000, title: 'Transcendent', icon: '🔮' },
]
export const XP_PER_TASK = 10

// Same key and same day-key format as the old app, so existing data loads unchanged.
const KEY = 'evolveAppData'
export const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

const empty = (): AppState => ({ tasks: [], completions: {}, xp: 0, badges: [], moodLog: {} })

export function loadState(): AppState {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (!p) return empty()
    return {
      tasks: (Array.isArray(p.tasks) ? p.tasks : []).map((t: any): Task => ({
        id: String(t.id),
        catId: CATS.some(c => c.id === t.catId) ? t.catId : 'mental',
        text: String(t.text ?? ''),
        createdAt: Number(t.createdAt) || startOfDay(new Date()),
        deletedAt: t.deletedAt ? Number(t.deletedAt) : null,
        priority: ['low', 'medium', 'high'].includes(t.priority) ? t.priority : 'medium',
      })),
      completions: p.completions && typeof p.completions === 'object' ? p.completions : {},
      xp: Number(p.xp) || 0,
      badges: Array.isArray(p.badges) ? p.badges : [],
      moodLog: p.moodLog && typeof p.moodLog === 'object' ? p.moodLog : {},
    }
  } catch { return empty() }
}
export function saveState(s: AppState) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage full or blocked */ } }

export function tasksOn(s: AppState, d: Date) {
  const t = startOfDay(d)
  return s.tasks.filter(x => x.createdAt <= t && (!x.deletedAt || x.deletedAt > t))
}
export function dayPct(s: AppState, d: Date) {
  const ts = tasksOn(s, d), c = s.completions[dayKey(d)] ?? {}
  return ts.length ? Math.round(ts.filter(t => c[t.id]).length / ts.length * 100) : 0
}
export function streak(s: AppState, now = new Date()) {
  const full = (x: Date) => { const ts = tasksOn(s, x), c = s.completions[dayKey(x)] ?? {}; return ts.length > 0 && ts.every(t => c[t.id]) }
  const d = new Date(now); let n = 0
  if (!full(d)) d.setDate(d.getDate() - 1) // an unfinished today must not reset the streak
  while (n < 366 && full(d)) { n++; d.setDate(d.getDate() - 1) }
  return n
}
export function levelInfo(xp: number) {
  let i = 0
  LEVELS.forEach((l, j) => { if (xp >= l.min) i = j })
  const last = i === LEVELS.length - 1
  const pct = last ? 100 : Math.round((xp - LEVELS[i].min) / (LEVELS[i + 1].min - LEVELS[i].min) * 100)
  return { level: i + 1, ...LEVELS[i], pct, toNext: last ? 0 : LEVELS[i + 1].min - xp }
}
