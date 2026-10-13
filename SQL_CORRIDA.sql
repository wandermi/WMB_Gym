-- =====================================================================
-- CORRIDA — tabela de registros (run_logs)
-- Rode UMA vez no Supabase → SQL Editor. Seguro rodar de novo.
-- O plano de treinos fica no app (run.js); aqui só vão os seus registros.
-- =====================================================================

create table if not exists public.run_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  run_date     date not null,                 -- dia em que correu
  plan_date    date,                          -- dia da sessão do plano que isto cumpre (null = corrida livre)
  distance_km  numeric(5,2) not null check (distance_km > 0 and distance_km <= 60),
  duration_sec numeric(8,1) not null check (duration_sec >= 60),
  rpe          int check (rpe between 1 and 10),
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists run_logs_user_date_idx on public.run_logs (user_id, run_date desc);

alter table public.run_logs enable row level security;

drop policy if exists "run_logs_select_own" on public.run_logs;
drop policy if exists "run_logs_insert_own" on public.run_logs;
drop policy if exists "run_logs_update_own" on public.run_logs;
drop policy if exists "run_logs_delete_own" on public.run_logs;

create policy "run_logs_select_own" on public.run_logs for select using (auth.uid() = user_id);
create policy "run_logs_insert_own" on public.run_logs for insert with check (auth.uid() = user_id);
create policy "run_logs_update_own" on public.run_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "run_logs_delete_own" on public.run_logs for delete using (auth.uid() = user_id);

-- Conferência: deve listar as 9 colunas
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'run_logs'
order by ordinal_position;
