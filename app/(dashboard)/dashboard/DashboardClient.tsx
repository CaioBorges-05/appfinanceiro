'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { MonthlyChart } from '@/components/dashboard/MonthlyChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { PeriodFilter } from '@/components/dashboard/PeriodFilter'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { createClient } from '@/lib/supabase/client'
import { getMonthAbbr } from '@/lib/utils/format'
import type { Category, Transaction, MonthlyData, CategoryExpense } from '@/lib/types'

interface DashboardClientProps {
  categories: Category[]
}

const CATEGORY_COLORS = [
  '#EF4444', '#F97316', '#8B5CF6', '#EC4899', '#3B82F6',
  '#06B6D4', '#84CC16', '#6366F1', '#F59E0B', '#10B981',
]

export function DashboardClient({ categories }: DashboardClientProps) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch current period transactions
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`

    const { data: currentTransactions } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    setTransactions(currentTransactions ?? [])

    // Build category expenses
    const expensesByCategory: Record<string, { name: string; value: number; color: string; icon: string }> = {}
    ;(currentTransactions ?? [])
      .filter((t) => t.type === 'expense')
      .forEach((t, i) => {
        const catName = t.categories?.name ?? 'Outros'
        const catColor = t.categories?.color ?? CATEGORY_COLORS[i % CATEGORY_COLORS.length]
        const catIcon = t.categories?.icon ?? '📦'
        if (expensesByCategory[catName]) {
          expensesByCategory[catName].value += Number(t.amount)
        } else {
          expensesByCategory[catName] = { name: catName, value: Number(t.amount), color: catColor, icon: catIcon }
        }
      })
    setCategoryData(Object.values(expensesByCategory).sort((a, b) => b.value - a.value))

    // Fetch last 6 months for bar chart
    const months: MonthlyData[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1)
      const m = d.getMonth() + 1
      const y = d.getFullYear()
      const s = `${y}-${String(m).padStart(2, '0')}-01`
      const e = `${y}-${String(m).padStart(2, '0')}-${new Date(y, m, 0).getDate()}`

      const { data } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .gte('date', s)
        .lte('date', e)

      const income = (data ?? []).filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
      const expenses = (data ?? []).filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

      months.push({ month: getMonthAbbr(d.getMonth()), income, expenses })
    }
    setMonthlyData(months)
    setLoading(false)
  }, [month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance = totalIncome - totalExpenses

  function handlePeriodChange(m: number, y: number) {
    setMonth(m)
    setYear(y)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-700 tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <PeriodFilter month={month} year={year} onChange={handlePeriodChange} />
          <Button onClick={() => setShowModal(true)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MonthlyChart data={monthlyData} />
        <CategoryPieChart data={categoryData} />
      </div>

      {/* Recent transactions */}
      <RecentTransactions transactions={transactions.slice(0, 8)} />

      {showModal && (
        <TransactionModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchData()
          }}
        />
      )}
    </div>
  )
}
