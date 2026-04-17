'use client'

import { useState, useTransition } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { CategoryModal } from '@/components/categories/CategoryModal'
import { deleteCategory } from '@/app/actions/categories'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

interface CategoriesClientProps {
  initialCategories: Category[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isPending, startTransition] = useTransition()

  async function refreshCategories() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    setCategories(data ?? [])
  }

  function handleDelete() {
    if (!deletingCategory) return
    startTransition(async () => {
      const result = await deleteCategory(deletingCategory.id)
      if (result?.error) {
        toast.error('Erro ao excluir', { description: result.error })
      } else {
        toast.success('Categoria excluída')
        setDeletingCategory(null)
        refreshCategories()
      }
    })
  }

  const incomeCategories = categories.filter((c) => c.type === 'income' || c.type === 'both')
  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both')

  function CategoryCard({ cat }: { cat: Category }) {
    return (
      <div className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: (cat.color ?? '#6B7280') + '20' }}
        >
          {cat.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-500 truncate">{cat.name}</p>
          {cat.is_default && (
            <Badge variant="secondary" className="text-xs py-0 h-4 mt-0.5">Padrão</Badge>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setEditingCategory(cat)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => setDeletingCategory(cat)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 tracking-tight">Categorias</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorias no total</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {/* Income categories */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-600 text-emerald-600 dark:text-emerald-400">Receitas</h2>
          <Badge variant="secondary" className="text-xs">{incomeCategories.length}</Badge>
        </div>
        {incomeCategories.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {incomeCategories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
        ) : (
          <Card className="border-dashed border-border p-8 text-center shadow-none">
            <p className="text-sm text-muted-foreground">Nenhuma categoria de receita</p>
          </Card>
        )}
      </div>

      {/* Expense categories */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-600 text-red-600 dark:text-red-400">Despesas</h2>
          <Badge variant="secondary" className="text-xs">{expenseCategories.length}</Badge>
        </div>
        {expenseCategories.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
        ) : (
          <Card className="border-dashed border-border p-8 text-center shadow-none">
            <p className="text-sm text-muted-foreground">Nenhuma categoria de despesa</p>
          </Card>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <CategoryModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            refreshCategories()
          }}
        />
      )}

      {/* Edit modal */}
      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null)
            refreshCategories()
          }}
        />
      )}

      {/* Delete confirm */}
      {deletingCategory && (
        <Dialog open onOpenChange={() => setDeletingCategory(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Excluir categoria</DialogTitle>
              <DialogDescription>
                Excluir &quot;{deletingCategory.name}&quot;? As transações vinculadas não serão excluídas.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingCategory(null)} disabled={isPending}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
