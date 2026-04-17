'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { createCategory, updateCategory } from '@/app/actions/categories'
import type { Category } from '@/lib/types'

const PRESET_ICONS = ['🍽️','🚗','🏠','💊','📚','🎬','👕','💻','🛒','💰','💼','📈','🎁','✈️','🏋️','🐶','🎮','🎵','📦','⚡']
const PRESET_COLORS = [
  '#EF4444','#F97316','#F59E0B','#84CC16','#10B981',
  '#06B6D4','#3B82F6','#8B5CF6','#EC4899','#6B7280',
]

interface CategoryModalProps {
  category?: Category
  onClose: () => void
  onSuccess: () => void
}

export function CategoryModal({ category, onClose, onSuccess }: CategoryModalProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [icon, setIcon] = useState(category?.icon ?? '📦')
  const [color, setColor] = useState(category?.color ?? '#6B7280')
  const [type, setType] = useState<'income' | 'expense' | 'both'>(category?.type ?? 'expense')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    startTransition(async () => {
      const data = { name: name.trim(), icon, color, type }
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data)

      if (result?.error) {
        toast.error('Erro ao salvar', { description: result.error })
      } else {
        toast.success(category ? 'Categoria atualizada!' : 'Categoria criada!')
        onSuccess()
      }
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar categoria' : 'Nova categoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: color + '20' }}
            >
              {icon}
            </div>
            <div>
              <p className="font-600">{name || 'Nome da categoria'}</p>
              <p className="text-xs text-muted-foreground">
                {type === 'income' ? 'Receita' : type === 'expense' ? 'Despesa' : 'Ambos'}
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentação"
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-10 gap-1">
              {PRESET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition-all hover:bg-muted ${icon === i ? 'bg-primary/10 ring-1 ring-primary' : ''}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-foreground scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : category ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
