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
import { createTransaction, updateTransaction } from '@/app/actions/transactions'
import type { Category, Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TransactionModalProps {
  categories: Category[]
  transaction?: Transaction
  onClose: () => void
  onSuccess: () => void
}

export function TransactionModal({ categories, transaction, onClose, onSuccess }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [categoryId, setCategoryId] = useState(transaction?.category_id ?? '')
  const [date, setDate] = useState(
    transaction?.date ?? new Date().toISOString().split('T')[0]
  )
  const [isPending, startTransition] = useTransition()

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Valor inválido')
      return
    }

    const data = {
      type,
      amount: parsedAmount,
      description,
      category_id: categoryId || null,
      date,
    }

    startTransition(async () => {
      const result = transaction
        ? await updateTransaction(transaction.id, data)
        : await createTransaction(data)

      if (result?.error) {
        toast.error('Erro ao salvar', { description: result.error })
      } else {
        toast.success(transaction ? 'Transação atualizada!' : 'Transação criada!')
        onSuccess()
      }
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Editar transação' : 'Nova transação'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategoryId('') }}
              className={cn(
                'rounded-md py-2 text-sm font-500 transition-all',
                type === 'expense'
                  ? 'bg-card shadow-sm text-red-600 dark:text-red-400'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategoryId('') }}
              className={cn(
                'rounded-md py-2 text-sm font-500 transition-all',
                type === 'income'
                  ? 'bg-card shadow-sm text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Receita
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              inputMode="decimal"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
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
              ) : transaction ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
