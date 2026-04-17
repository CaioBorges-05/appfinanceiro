'use client'

import { useState } from 'react'
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { TransactionModal } from './TransactionModal'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type { Category, Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  categories: Category[]
  onRefresh: () => void
}

export function TransactionTable({ transactions, categories, onRefresh }: TransactionTableProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 text-4xl">📭</div>
        <p className="font-500">Nenhuma transação encontrada</p>
        <p className="text-sm text-muted-foreground">Ajuste os filtros ou adicione uma nova transação</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full',
                      t.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40'
                        : 'bg-red-50 dark:bg-red-950/40'
                    )}
                  >
                    {t.type === 'income' ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-500 max-w-[200px] truncate">
                  {t.description || t.categories?.name || '—'}
                </TableCell>
                <TableCell>
                  {t.categories ? (
                    <Badge variant="secondary" className="gap-1 font-400">
                      {t.categories.icon} {t.categories.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      'font-600',
                      t.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingTransaction(t)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeletingId(t.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile list */}
      <div className="divide-y divide-border sm:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-4">
            <div
              className={cn(
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
                t.type === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40'
                  : 'bg-red-50 dark:bg-red-950/40'
              )}
            >
              {t.type === 'income' ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-500 truncate">
                {t.description || t.categories?.name || '—'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                {t.categories && (
                  <span className="text-xs text-muted-foreground">{t.categories.icon} {t.categories.name}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  'text-sm font-600',
                  t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingTransaction(t)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeletingId(t.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onSuccess={() => {
            setEditingTransaction(null)
            onRefresh()
          }}
        />
      )}

      {deletingId && (
        <DeleteConfirmDialog
          transactionId={deletingId}
          onClose={() => setDeletingId(null)}
          onSuccess={() => {
            setDeletingId(null)
            onRefresh()
          }}
        />
      )}
    </>
  )
}
