'use client'

import type { Transaction } from '../types'
import { formatCurrency, formatDate } from './format'

export function exportToCSV(transactions: Transaction[], filename = 'transacoes'): void {
  const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor']

  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.description || '',
    t.categories?.name || '',
    formatCurrency(t.amount),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
