'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface TransactionInput {
  type: 'income' | 'expense'
  amount: number
  description: string
  category_id: string | null
  date: string
}

export async function createTransaction(data: TransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('transactions').insert({
    ...data,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  return { success: true }
}

export async function updateTransaction(id: string, data: TransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  return { success: true }
}
