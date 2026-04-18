'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)

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
      } else if (result?.success && result.email) {
        setConfirmedEmail(result.email)
      }
    })
  }

  // Tela de confirmação de e-mail
  if (confirmedEmail) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-700 tracking-tight">Confirme seu e-mail</h1>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          Enviamos um link de confirmação para{' '}
          <span className="font-600 text-foreground">{confirmedEmail}</span>.
          <br />
          Clique no link para ativar sua conta.
        </p>

        {/* Aviso de spam */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left dark:border-amber-900/50 dark:bg-amber-950/30">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-600 mb-0.5">Não encontrou o e-mail?</p>
            <p className="leading-relaxed">
              Verifique sua <span className="font-600">caixa de spam</span> ou lixo
              eletrônico — às vezes o e-mail de confirmação cai por lá.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="mb-6 space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-left">
          {[
            'Abra o e-mail de "Finança"',
            'Clique em "Confirmar cadastro"',
            'Volte aqui e faça login',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
              <span>{step}</span>
            </div>
          ))}
        </div>

        <Link href="/login">
          <Button className="w-full">Ir para o login</Button>
        </Link>

        <p className="mt-4 text-xs text-muted-foreground">
          E-mail errado?{' '}
          <button
            onClick={() => setConfirmedEmail(null)}
            className="text-primary hover:underline font-500"
          >
            Voltar e corrigir
          </button>
        </p>
      </div>
    )
  }

  // Formulário de cadastro
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
