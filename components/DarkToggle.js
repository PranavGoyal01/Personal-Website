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
    <button aria-label='Toggle theme' onClick={toggle} className='inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-[rgba(225,29,48,0.4)]'>
      <span className='text-base'>{mode === 'dark' ? '🌙' : '☀️'}</span>
      {mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
