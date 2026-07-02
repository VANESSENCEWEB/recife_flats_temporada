-- ============================================================
-- (OPCIONAL) Disponibilidade real dos apartamentos
--
-- Só é necessário se você quiser que o Matching Inteligente filtre/priorize
-- por disponibilidade real quando o hóspede já informa as datas da viagem.
--
-- Se você já controla disponibilidade no seu outro sistema/repositório,
-- NÃO rode este script — me diga o nome da tabela e das colunas reais
-- (apartment/slug, data de início, data de fim do bloqueio) que eu ajusto
-- `scripts/utils/supabase-client.js` para consultar direto essa tabela
-- existente, sem duplicar dados.
-- ============================================================

create table if not exists public.apartment_availability (
  id uuid primary key default gen_random_uuid(),
  apartment_slug text not null,
  blocked_from date not null,
  blocked_until date not null,
  reason text,
  created_at timestamptz not null default now()
);

comment on table public.apartment_availability is
  'Períodos bloqueados (reservados/indisponíveis) por apartamento, usados pelo Matching Inteligente para checar disponibilidade quando o hóspede informa datas.';

alter table public.apartment_availability enable row level security;

-- Leitura pública (o site precisa consultar isso com a anon key)
drop policy if exists "apartment_availability_select_public" on public.apartment_availability;
create policy "apartment_availability_select_public"
  on public.apartment_availability
  for select
  to anon
  using (true);

create index if not exists apartment_availability_slug_idx on public.apartment_availability (apartment_slug);
create index if not exists apartment_availability_dates_idx on public.apartment_availability (blocked_from, blocked_until);

-- Slugs usados no site (para popular manualmente, se quiser testar):
--   apartamento-2-quartos-boa-viagem
--   flat-golden-view-1006
--   studio-203-boa-viagem
--   apartamento-804-pina
