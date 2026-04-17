export type TransactionType = 'income' | 'expense'
export type CategoryType = 'income' | 'expense' | 'both'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string | null
  color: string | null
  type: CategoryType
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string | null
  category_id: string | null
  date: string
  created_at: string
  updated_at: string
  categories?: Category | null
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
}

export interface CategoryExpense {
  name: string
  value: number
  color: string
  icon: string
}

export interface PeriodFilter {
  month: number
  year: number
}
