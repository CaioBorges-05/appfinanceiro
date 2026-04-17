-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- CATEGORIES TABLE
-- =============================================
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text default '📦',
  color text default '#6B7280',
  type text check (type in ('income', 'expense', 'both')) default 'expense',
  is_default boolean default false,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

create policy "Users can view own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount decimal(12,2) not null check (amount > 0),
  description text,
  category_id uuid references public.categories(id) on delete set null,
  date date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_transaction_updated
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();

-- =============================================
-- DEFAULT CATEGORIES FUNCTION
-- =============================================
-- Call this function after a user registers to seed their default categories
create or replace function public.create_default_categories(p_user_id uuid)
returns void as $$
begin
  insert into public.categories (user_id, name, icon, color, type, is_default) values
    -- Despesas
    (p_user_id, 'Alimentação',    '🍽️',  '#EF4444', 'expense', true),
    (p_user_id, 'Transporte',     '🚗',  '#F97316', 'expense', true),
    (p_user_id, 'Moradia',        '🏠',  '#8B5CF6', 'expense', true),
    (p_user_id, 'Saúde',          '💊',  '#EC4899', 'expense', true),
    (p_user_id, 'Educação',       '📚',  '#3B82F6', 'expense', true),
    (p_user_id, 'Lazer',          '🎬',  '#06B6D4', 'expense', true),
    (p_user_id, 'Vestuário',      '👕',  '#84CC16', 'expense', true),
    (p_user_id, 'Tecnologia',     '💻',  '#6366F1', 'expense', true),
    (p_user_id, 'Supermercado',   '🛒',  '#F59E0B', 'expense', true),
    (p_user_id, 'Outros',         '📦',  '#6B7280', 'both',    true),
    -- Receitas
    (p_user_id, 'Salário',        '💰',  '#10B981', 'income',  true),
    (p_user_id, 'Freelance',      '💼',  '#059669', 'income',  true),
    (p_user_id, 'Investimentos',  '📈',  '#0EA5E9', 'income',  true),
    (p_user_id, 'Presente',       '🎁',  '#A78BFA', 'income',  true);
end;
$$ language plpgsql security definer;
