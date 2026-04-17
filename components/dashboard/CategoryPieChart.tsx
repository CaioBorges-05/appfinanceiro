'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/format'
import type { CategoryExpense } from '@/lib/types'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = (props: {
  cx?: number; cy?: number; midAngle?: number
  innerRadius?: number; outerRadius?: number; percent?: number
}) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomTooltip = ({ active, payload }: {
  active?: boolean
  payload?: { name: string; value: number; payload: CategoryExpense }[]
}) => {
  if (active && payload && payload.length) {
    const d = payload[0]
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-lg text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span>{d.payload.icon}</span>
          <span className="font-600">{d.name}</span>
        </div>
        <p className="text-muted-foreground">{formatCurrency(d.value)}</p>
      </div>
    )
  }
  return null
}

interface CategoryPieChartProps {
  data: CategoryExpense[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-600">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Nenhuma despesa no período</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-600">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => (
                <span style={{ color: 'var(--muted-foreground)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
