import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  colorClass,
  bgClass,
}: {
  title: string
  value: number
  icon: React.ElementType
  colorClass: string
  bgClass: string
}) {
  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className={cn('text-2xl font-700 tracking-tight', colorClass)}>
              {formatCurrency(value)}
            </p>
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', bgClass)}>
            <Icon className={cn('h-5 w-5', colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SummaryCards({ totalIncome, totalExpenses, balance }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryCard
        title="Receitas"
        value={totalIncome}
        icon={TrendingUp}
        colorClass="text-emerald-600 dark:text-emerald-400"
        bgClass="bg-emerald-50 dark:bg-emerald-950/40"
      />
      <SummaryCard
        title="Despesas"
        value={totalExpenses}
        icon={TrendingDown}
        colorClass="text-red-600 dark:text-red-400"
        bgClass="bg-red-50 dark:bg-red-950/40"
      />
      <SummaryCard
        title="Saldo"
        value={balance}
        icon={Wallet}
        colorClass={balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
        bgClass={balance >= 0 ? 'bg-blue-50 dark:bg-blue-950/40' : 'bg-red-50 dark:bg-red-950/40'}
      />
    </div>
  )
}
