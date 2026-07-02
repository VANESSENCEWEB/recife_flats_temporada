-- ============================================================
-- Matching Inteligente — tabela de leads
-- Rode este script no SQL Editor do Supabase (Project → SQL Editor).
-- ============================================================

create table if not exists public.matching_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  whatsapp text not null,
  desired_checkin date,
  desired_checkout date,
  preferred_apartment_slug text,
  guests integer,
  objective text,
  budget_profile text,
  match_answers jsonb,
  contacted boolean not null default false,
  source text not null default 'matching_inteligente'
);

comment on table public.matching_leads is
  'Leads capturados pelo Matching Inteligente quando o apartamento ideal não está disponível ou o hóspede quer ser avisado.';

-- Habilita Row Level Security (obrigatório antes de criar as policies)
alter table public.matching_leads enable row level security;

-- Permite que o site (usando a anon key, pública por design) INSIRA leads,
-- mas nunca leia os dados de volta com essa mesma chave — leitura só pelo
-- painel do Supabase ou por uma chave de serviço (service_role) no backend.
drop policy if exists "matching_leads_insert_public" on public.matching_leads;
create policy "matching_leads_insert_public"
  on public.matching_leads
  for insert
  to anon
  with check (true);

-- Índices para consultar leads rapidamente por apartamento e por data
create index if not exists matching_leads_slug_idx on public.matching_leads (preferred_apartment_slug);
create index if not exists matching_leads_created_idx on public.matching_leads (created_at desc);

-- ============================================================
-- (Opcional) Notificação por e-mail/webhook a cada novo lead:
-- crie um Database Webhook em Database → Webhooks apontando para
-- o evento INSERT desta tabela, disparando para o seu WhatsApp/e-mail
-- via Zapier, n8n, Make, ou uma Edge Function do Supabase.
-- ============================================================
