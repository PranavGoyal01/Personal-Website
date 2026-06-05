import { useEffect, useState } from 'react'

export default function DarkToggle() {
  const [mode, setMode] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    apply(initial)
    setMode(initial)
  }, [])

  function apply(val) {
    const el = document.documentElement
    if (val === 'dark') el.classList.add('dark')
    else el.classList.remove('dark')
    localStorage.setItem('theme', val)
  }

  function toggle() {
    const next = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    apply(next)
  }

  return (
    <button aria-label="Toggle theme" onClick={toggle} className="px-3 py-2 rounded-md border">
      {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
