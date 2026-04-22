'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <div className="h-9 w-24 rounded-full bg-muted animate-pulse" />
  )

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-500 text-foreground shadow-sm transition-all hover:bg-muted"
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span>Claro</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-slate-600" />
          <span>Escuro</span>
        </>
      )}
    </button>
  )
}
