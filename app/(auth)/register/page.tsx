'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (formData.get('password') !== formData.get('confirm_password')) {
      toast.error('As senhas não coincidem')
      return
    }

    startTransition(async () => {
      const result = await register(formData)
      if (result?.error) {
        toast.error('Erro ao cadastrar', { description: result.error })
      }
    })
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-700 tracking-tight">Crie sua conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Comece a controlar suas finanças hoje
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Seu nome"
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirmar senha</Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repita a senha"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta grátis'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/login" className="font-500 text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
