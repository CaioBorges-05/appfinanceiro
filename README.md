# Finança — Gestão Financeira Pessoal

App web de finanças pessoais com dashboard, gráficos e controle completo de receitas e despesas.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + **shadcn/ui** (Base UI)
- **Supabase** — Auth + PostgreSQL + Row Level Security
- **Recharts** — gráficos de barras e pizza
- **Vercel** — deploy

## Funcionalidades

- Login/cadastro com Supabase Auth (email + senha)
- Dashboard mensal com cards de resumo (receitas, despesas, saldo)
- Gráfico de visão mensal (barras — 6 meses)
- Gráfico de despesas por categoria (pizza)
- CRUD completo de transações (criar, editar, excluir)
- Filtros por período, tipo e categoria
- Busca por descrição/categoria
- Gestão de categorias com ícone e cor personalizados
- Exportação de transações para CSV
- Interface responsiva (mobile-first)
- Modo claro e escuro

---

## Setup Local

### 1. Clone e instale as dependências

```bash
git clone <repo-url>
cd App_Financas
npm install
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No painel do projeto, vá em **SQL Editor** e execute o conteúdo de `supabase/migrations/001_initial.sql`
3. Em **Authentication → Providers**, confirme que Email está habilitado

### 3. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com as credenciais do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Você encontra esses valores em: **Supabase → Settings → API**

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Estrutura do Projeto

```
app/
  (auth)/
    login/          # Página de login
    register/       # Página de cadastro
  (dashboard)/
    dashboard/      # Dashboard principal
    transactions/   # Listagem e gestão de transações
    categories/     # Gestão de categorias
  page.tsx          # Landing page
  layout.tsx        # Layout raiz (font, theme, toaster)
  actions/          # Server Actions (auth, transações, categorias)

components/
  layout/           # Sidebar, Header
  dashboard/        # Cards, gráficos, filtro de período
  transactions/     # Tabela, modal de criação/edição, confirmação de exclusão
  categories/       # Lista e modal de categorias
  providers/        # ThemeProvider

lib/
  supabase/
    client.ts       # Cliente browser (@supabase/ssr)
    server.ts       # Cliente server (@supabase/ssr)
  types/index.ts    # Tipos TypeScript
  utils/
    format.ts       # Formatação de moeda e datas
    export.ts       # Exportação CSV

supabase/
  migrations/
    001_initial.sql # Schema completo com RLS e categorias padrão
```

## Banco de Dados

### Tabelas

| Tabela | Descrição |
|---|---|
| `profiles` | Perfil do usuário (estende auth.users) |
| `categories` | Categorias de transações (padrão + customizadas) |
| `transactions` | Transações financeiras (receitas e despesas) |

### Row Level Security

Todas as tabelas têm RLS habilitado. Cada usuário acessa apenas seus próprios dados.

### Categorias padrão

Ao cadastrar, a função `create_default_categories` é chamada automaticamente e cria 14 categorias padrão (Alimentação, Transporte, Salário, etc.).

---

## Deploy na Vercel

1. Faça push do projeto para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático a cada push no `main`

---

## Desenvolvido com

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
