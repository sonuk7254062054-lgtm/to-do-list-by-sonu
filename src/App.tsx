import { useEffect, useState, type FormEvent } from 'react'
import {
  CalendarDays,
  Check,
  CheckCheck,
  Circle,
  Clock3,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

// Priority ka ek fixed set hai: low, medium, high
// Isse sirf valid priority values ko allow karte hain.
type Priority = 'low' | 'medium' | 'high'

// Task object ka structure define karta hai:
// id -> unique task identifier
// title -> task ka naam
// completed -> task complete hua ya nahi
// priority -> task ki importance
// dueDate -> deadline date
// createdAt -> kab task bana

type Task = {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: string
  createdAt: number
}

// Different views for task list: all, today, upcoming, completed
// UI me filter ke liye use hota hai.
type View = 'all' | 'today' | 'upcoming' | 'completed'

// localStorage key: browser me tasks save karne ke liye
const STORAGE_KEY = 'daylist.tasks.v1'

// Valid priority options
const PRIORITIES: Priority[] = ['low', 'medium', 'high']

// Local storage me jo task save hai, usko safe validate karne ke liye.
// Agar saved data valid task object nahi hai, toh ignore kar do.
function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false

  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.priority === 'string' &&
    PRIORITIES.includes(task.priority as Priority) &&
    typeof task.dueDate === 'string' &&
    typeof task.createdAt === 'number'
  )
}

// Browser se previous tasks load karta hai.
// Agar localStorage me kuch save ho, toh use hota hai; warna empty array.
function loadTasks(): Task[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter(isTask) : []
  } catch {
    return []
  }
}

// Date ko 'YYYY-MM-DD' format me convert karta hai.
// Isse today/upcoming/completed logic easily compare ho sakti hai.
function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// '2026-09-29' jaise string ko readable format 'Sep 29' me convert karta hai.
function formatDate(value: string): string {
  if (!value) return 'No due date'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
    new Date(year, month - 1, day),
  )
}

const views: { id: View; label: string; icon: typeof ListTodo }[] = [
  { id: 'all', label: 'All tasks', icon: ListTodo },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'upcoming', label: 'Upcoming', icon: Clock3 },
  { id: 'completed', label: 'Completed', icon: CheckCheck },
]

export default function App() {
  // App ka state: tasks list, current selected view, search query, form inputs
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [view, setView] = useState<View>('all')
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  // Jab tasks state change ho, tab browser localStorage me automatically save ho jaye.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // Current date ko YYYY-MM-DD format me convert karta hai.
  const today = dateKey(new Date())

  // Task summary values: remaining, completed, progress percentage
  const remaining = tasks.filter((task) => !task.completed).length
  const completed = tasks.length - remaining
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)

  // User selected view ke hisaab se tasks ko filter karta hai.
  // Query ke basis par title me match karne wale tasks dikhata hai.
  const visibleTasks = tasks
    .filter((task) => {
      if (view === 'today') return !task.completed && task.dueDate === today
      if (view === 'upcoming') return !task.completed && task.dueDate > today
      if (view === 'completed') return task.completed
      return true
    })
    .filter((task) => task.title.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((first, second) => second.createdAt - first.createdAt)

  // New task form submit hone par ek naya task banaata hai.
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    }
    setTasks((current) => [newTask, ...current])
    setTitle('')
    setPriority('medium')
    setDueDate('')
  }

  // Task ko complete/incomplete toggle karta hai.
  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  // Task ko delete karta hai.
  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <div className="app-shell">
      {/* Sidebar: left side navigation and progress summary */}
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Daylist home">
          <span className="brand-mark"><Check size={18} strokeWidth={3} /></span>
          <span>daylist<span className="brand-period">.</span></span>
        </a>

        <div className="nav-caption">YOUR SPACE</div>
        <nav className="view-nav" aria-label="Task views">
          {views.map(({ id, label, icon: Icon }) => {
            const count = id === 'all'
              ? remaining
              : id === 'today'
                ? tasks.filter((task) => !task.completed && task.dueDate === today).length
                : id === 'upcoming'
                  ? tasks.filter((task) => !task.completed && task.dueDate > today).length
                  : completed

            return (
              <button
                className={`nav-link ${view === id ? 'is-active' : ''}`}
                key={id}
                onClick={() => setView(id)}
                type="button"
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
                <span className="nav-count">{count}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-progress-heading">
            <span>Weekly rhythm</span>
            <Sparkles size={15} />
          </div>
          <div className="mini-progress-track" aria-label={`${progress}% of tasks completed`}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>{completed} of {tasks.length} tasks done</p>
          <div className="sidebar-note"><span className="note-dot" /> Small steps count.</div>
        </div>
      </aside>

      {/* Main content area: top heading, stats, form, and task list */}
      <main className="main-content" id="top">
        <header className="topbar">
          <div className="date-label"><CalendarDays size={15} />
            {new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}
          </div>
          <div className="local-badge"><span /> Saved on this device</div>
        </header>

        {/* Welcome section: main heading and count of pending tasks */}
        <section className="welcome-row" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">A CLEARER KIND OF BUSY</p>
            <h1 id="page-title">Make room for<br /><em>what matters.</em></h1>
            <p className="welcome-copy">One thoughtful step at a time. You’ve got this.</p>
          </div>
          <div className="day-stamp" aria-label={`${remaining} tasks remaining`}>
            <span className="day-stamp-number">{String(remaining).padStart(2, '0')}</span>
            <span className="day-stamp-label">LEFT TO<br />TICK OFF</span>
          </div>
        </section>

        {/* Progress bar: total completion percentage */}
        <section className="progress-section" aria-label="Task completion progress">
          <div className="progress-copy">
            <span>Today’s momentum</span>
            <span><strong>{progress}%</strong> complete</span>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        </section>

        {/* Task list and add form section */}
        <section className="task-area" aria-labelledby="list-heading">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR LIST</span>
              <h2 id="list-heading">{views.find((item) => item.id === view)?.label}</h2>
            </div>
            <label className="search-box">
              <Search size={16} />
              <input
                aria-label="Search tasks"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a task"
                type="search"
                value={query}
              />
              {query && <button aria-label="Clear search" className="clear-search" onClick={() => setQuery('')} type="button"><X size={14} /></button>}
            </label>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <div className="add-input-wrap">
              <Plus className="add-plus" size={19} />
              <input
                aria-label="Task title"
                autoComplete="off"
                maxLength={120}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Add a task, make it concrete..."
                value={title}
              />
            </div>
            <div className="form-options">
              <label className="select-wrap" aria-label="Task priority">
                <Circle size={12} className={`priority-dot priority-${priority}`} />
                <select onChange={(event) => setPriority(event.target.value as Priority)} value={priority}>
                  {PRIORITIES.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)} priority</option>)}
                </select>
              </label>
              <label className="date-input-wrap" aria-label="Due date">
                <CalendarDays size={15} />
                <input aria-label="Due date" onChange={(event) => setDueDate(event.target.value)} type="date" value={dueDate} />
              </label>
              <button className="add-button" disabled={!title.trim()} type="submit"><Plus size={16} /> Add task</button>
            </div>
          </form>

          <div className="list-meta">
            <span>{visibleTasks.length} {visibleTasks.length === 1 ? 'TASK' : 'TASKS'}</span>
            <span className="sort-label">NEWEST FIRST</span>
          </div>

          {visibleTasks.length > 0 ? (
            <ul className="task-list">
              {visibleTasks.map((task) => {
                const overdue = !task.completed && task.dueDate && task.dueDate < today
                return (
                  <li className={`task-row ${task.completed ? 'is-complete' : ''}`} key={task.id}>
                    <button
                      aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Complete ${task.title}`}
                      className="check-button"
                      onClick={() => toggleTask(task.id)}
                      type="button"
                    >
                      {task.completed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="task-main">
                      <span className="task-title">{task.title}</span>
                      <div className="task-detail">
                        <span className={`priority-label priority-text-${task.priority}`}><span />{task.priority}</span>
                        <span className={`due-label ${overdue ? 'is-overdue' : ''}`}><CalendarDays size={12} />{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <button aria-label={`Delete ${task.title}`} className="delete-button" onClick={() => deleteTask(task.id)} type="button">
                      <Trash2 size={16} />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-icon"><CheckCheck size={22} /></span>
              <h3>{query ? 'No matching tasks' : view === 'completed' ? 'Nothing checked off yet' : 'A little breathing room'}</h3>
              <p>{query ? 'Try another search, or clear it to see your list.' : view === 'today' ? 'No tasks due today. Keep that space for yourself.' : view === 'upcoming' ? 'No upcoming tasks. Future you says thanks.' : 'Add your first task above and get it out of your head.'}</p>
            </div>
          )}

          <footer className="list-footer"><span className="footer-sparkle">✳</span> Progress, not pressure.</footer>
        </section>
      </main>
    </div>
  )
}
