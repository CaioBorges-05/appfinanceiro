'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMonthName } from '@/lib/utils/format'

interface PeriodFilterProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

export function PeriodFilter({ month, year, onChange }: PeriodFilterProps) {
  function prev() {
    if (month === 1) {
      onChange(12, year - 1)
    } else {
      onChange(month - 1, year)
    }
  }

  function next() {
    const now = new Date()
    const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()
    if (isCurrentMonth) return

    if (month === 12) {
      onChange(1, year + 1)
    } else {
      onChange(month + 1, year)
    }
  }

  const now = new Date()
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-1 py-1">
      <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[140px] text-center text-sm font-600 px-2">
        {getMonthName(month - 1)} {year}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        disabled={isCurrentMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
