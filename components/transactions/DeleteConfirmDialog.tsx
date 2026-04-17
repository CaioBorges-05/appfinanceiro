'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteTransaction } from '@/app/actions/transactions'

interface DeleteConfirmDialogProps {
  transactionId: string
  onClose: () => void
  onSuccess: () => void
}

export function DeleteConfirmDialog({ transactionId, onClose, onSuccess }: DeleteConfirmDialogProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTransaction(transactionId)
      if (result?.error) {
        toast.error('Erro ao excluir', { description: result.error })
      } else {
        toast.success('Transação excluída')
        onSuccess()
      }
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
          <DialogDescription>
            Tem certeza? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
