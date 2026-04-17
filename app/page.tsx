import Link from 'next/link'
import {
  TrendingUp, PieChart, BarChart3, Shield, Smartphone, Download,
  ArrowRight, CheckCircle2, Wallet
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Visual',
    description: 'Visualize receitas, despesas e saldo em gráficos claros e interativos.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: TrendingUp,
    title: 'Controle Total',
    description: 'Registre cada transação com categoria, descrição e data. Tudo organizado.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: PieChart,
    title: 'Por Categoria',
    description: 'Entenda onde seu dinheiro vai com gráficos de despesas por categoria.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: Shield,
    title: 'Seus Dados Seguros',
    description: 'Autenticação segura e isolamento total de dados por usuário.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Interface 100% responsiva. Use no celular, tablet ou computador.',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
  },
  {
    icon: Download,
    title: 'Exportar CSV',
    description: 'Exporte suas transações para Excel ou Google Sheets com um clique.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
  },
]

const benefits = [
  'Cadastro gratuito e imediato',
  'Categorias pré-definidas em português',
  'Filtros por período e categoria',
  'Gráfico mensal e por categoria',
  'Exportação para CSV',
  'Interface em português brasileiro',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-700 tracking-tight">Finança</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Controle financeiro simples e eficiente
          </div>

          <h1 className="mb-6 text-4xl font-800 tracking-tight text-foreground sm:text-6xl">
            Suas finanças,{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              organizadas de verdade
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Registre receitas e despesas, acompanhe seu saldo e visualize para onde seu dinheiro vai.
            Simples, rápido e seguro.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/10">
            <div className="flex h-8 items-center gap-1.5 border-b border-border bg-muted/50 px-4">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">financas.app/dashboard</span>
            </div>
            <div className="bg-card p-6">
              {/* Mock dashboard */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Abril 2026</p>
                  <h3 className="text-lg font-600">Visão Geral</h3>
                </div>
                <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Receitas', value: 'R$ 5.200', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                  { label: 'Despesas', value: 'R$ 3.180', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
                  { label: 'Saldo', value: 'R$ 2.020', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                ].map((card) => (
                  <div key={card.label} className={`rounded-xl p-4 ${card.bg}`}>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className={`text-lg font-700 ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl bg-muted/40 p-4">
                  <p className="mb-3 text-xs font-500 text-muted-foreground">Visão Mensal</p>
                  <div className="flex items-end gap-2 h-24">
                    {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                        <div className="w-full rounded-sm bg-primary/20" style={{ height: `${(100-h)*0.6}px` }} />
                        <div className="w-full rounded-sm bg-primary" style={{ height: `${h*0.6}px` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-40 rounded-xl bg-muted/40 p-4">
                  <p className="mb-3 text-xs font-500 text-muted-foreground">Por Categoria</p>
                  <div className="flex flex-col gap-2">
                    {['Alimentação', 'Moradia', 'Transporte'].map((cat, i) => (
                      <div key={cat} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${['bg-red-400','bg-orange-400','bg-blue-400'][i]}`} />
                        <span className="text-xs text-muted-foreground">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-700 tracking-tight sm:text-4xl">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground">
              Ferramentas simples e poderosas para controlar seu dinheiro.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="mb-2 font-600">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Benefits */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-8 sm:p-12 text-white">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="mb-3 text-3xl font-700 tracking-tight">
                  Comece agora, é grátis
                </h2>
                <p className="mb-8 text-blue-100">
                  Crie sua conta em segundos e comece a registrar suas transações hoje mesmo.
                </p>
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-2 bg-white text-primary hover:bg-blue-50">
                    Criar conta grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col justify-center gap-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-200" />
                    <span className="text-blue-100 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-600">Finança</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Finança. Gestão financeira pessoal.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Cadastrar</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
