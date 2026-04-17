import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/lib/types'
import Link from 'next/link'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-600">Últimas Transações</CardTitle>
        <Link href="/transactions" className="text-xs text-primary hover:underline font-500">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <p className="text-sm text-muted-foreground">Nenhuma transação no período</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                <div
                  className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
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
                      <Badge variant="secondary" className="text-xs py-0 h-4">
                        {t.categories.icon} {t.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    'text-sm font-600 flex-shrink-0',
                    t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
