'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface CategoryInput {
  name: string
  icon: string
  color: string
  type: 'income' | 'expense' | 'both'
}

export async function createCategory(data: CategoryInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('categories').insert({
    ...data,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/categories')
  revalidatePath('/transactions')
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/categories')
  revalidatePath('/transactions')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/categories')
  revalidatePath('/transactions')
  return { success: true }
}
