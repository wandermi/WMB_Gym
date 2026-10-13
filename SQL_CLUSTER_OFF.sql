-- =====================================================================
-- TIRAR O CLUSTER DO LEGS (C) E LOWER (E) ATÉ A PROVA
-- Protocolo 7. Rode um passo de cada vez, na ordem.
-- Só o campo "method" muda (de 'cluster' para vazio). Séries, reps,
-- cargas e histórico NÃO são tocados.
-- =====================================================================

-- PASSO 1 — PRÉVIA (não altera nada). Deve listar 7 linhas:
-- Legs: Leg Press, Stiff, Hip Thrust | Lower: Stiff, Agachamento Hack,
-- Afundo Búlgaro, Panturrilha Sentado.
-- Confira que o user_id é o seu.
select w.user_id, w.letter, w.name as treino, e.name as exercicio, e.method
from exercises e
join workouts w on w.id = e.workout_id
where w.protocol_name like 'PROTOCOLO 7%'
  and w.letter in ('C', 'E')
  and e.method = 'cluster'
order by w.user_id, w.letter, e.position;


-- PASSO 2 — Guarda um backup exato e desliga o cluster.
-- O backup fica numa tabela privada (sem acesso pela API).
create table if not exists public.exercise_method_backup (
  exercise_id uuid primary key,
  method      text not null,
  saved_at    timestamptz not null default now()
);
alter table public.exercise_method_backup enable row level security;

insert into public.exercise_method_backup (exercise_id, method)
select e.id, e.method
from exercises e
join workouts w on w.id = e.workout_id
where w.protocol_name like 'PROTOCOLO 7%'
  and w.letter in ('C', 'E')
  and e.method = 'cluster'
on conflict (exercise_id) do nothing;

update exercises e
set method = null
from workouts w
where w.id = e.workout_id
  and w.protocol_name like 'PROTOCOLO 7%'
  and w.letter in ('C', 'E')
  and e.method = 'cluster'
returning e.name, e.method;
-- Esperado: 7 linhas com method vazio.


-- =====================================================================
-- PASSO 3 — SÓ DEPOIS DA PROVA (30/11 em diante): religar o cluster.
-- Restaura exatamente o que o backup guardou.
-- =====================================================================
-- update exercises e
-- set method = b.method
-- from public.exercise_method_backup b
-- where b.exercise_id = e.id
--   and e.method is null
-- returning e.name, e.method;
--
-- Depois de conferir, limpe o backup:
-- drop table public.exercise_method_backup;
