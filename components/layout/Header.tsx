'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/app/actions/auth'

interface HeaderProps {
  userEmail?: string
  userName?: string
  onMenuClick: () => void
}

export function Header({ userEmail, userName, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-500 sm:block">
              {userName || userEmail}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
            <DropdownMenuItem className="p-0 text-destructive">
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="w-full text-left px-1.5 py-1 text-sm text-destructive"
                >
                  Sair da conta
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
