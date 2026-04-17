import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TransactionsClient } from './TransactionsClient'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return <TransactionsClient categories={categories ?? []} />
}
