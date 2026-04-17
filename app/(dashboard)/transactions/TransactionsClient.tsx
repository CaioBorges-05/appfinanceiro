'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Download, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { PeriodFilter } from '@/components/dashboard/PeriodFilter'
import { createClient } from '@/lib/supabase/client'
import { exportToCSV } from '@/lib/utils/export'
import { formatCurrency } from '@/lib/utils/format'
import type { Category, Transaction } from '@/lib/types'

interface TransactionsClientProps {
  categories: Category[]
}

export function TransactionsClient({ categories }: TransactionsClientProps) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`

    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (typeFilter !== 'all') query = query.eq('type', typeFilter)
    if (categoryFilter !== 'all') query = query.eq('category_id', categoryFilter)

    const { data } = await query
    setTransactions(data ?? [])
    setLoading(false)
  }, [month, year, typeFilter, categoryFilter])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = transactions.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.description?.toLowerCase().includes(q) ||
      t.categories?.name.toLowerCase().includes(q)
    )
  })

  const totalIncome = filteredTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpenses = filteredTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  function handleExport() {
    if (filteredTransactions.length === 0) {
      toast.error('Nenhuma transação para exportar')
      return
    }
    exportToCSV(filteredTransactions, `transacoes-${year}-${String(month).padStart(2, '0')}`)
    toast.success('CSV exportado com sucesso!')
  }

  const hasFilters = typeFilter !== 'all' || categoryFilter !== 'all' || search

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-700 tracking-tight">Transações</h1>
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transação{filteredTransactions.length !== 1 ? 'ões' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PeriodFilter month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.icon} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all') }}
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="outline" className="gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
          Receitas: {formatCurrency(totalIncome)}
        </Badge>
        <Badge variant="outline" className="gap-1.5 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900">
          Despesas: {formatCurrency(totalExpenses)}
        </Badge>
        <Badge variant="outline" className="gap-1.5 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900">
          Saldo: {formatCurrency(totalIncome - totalExpenses)}
        </Badge>
      </div>

      {/* Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            categories={categories}
            onRefresh={fetchTransactions}
          />
        )}
      </Card>

      {showModal && (
        <TransactionModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchTransactions()
          }}
        />
      )}
    </div>
  )
}
