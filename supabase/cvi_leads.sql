create extension if not exists pgcrypto;

create table if not exists public.cvi_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  nome_tutor text not null,
  whatsapp text not null,
  email_opcional text,
  cidade_origem text,
  pais_destino text,
  pais_destino_outro text,
  destino_final text,
  data_viagem text,
  qtd_gatos integer not null default 0,
  qtd_cachorros integer not null default 0,
  total_pets integer not null default 0,
  pet_summary text,
  mais_de_um_pet boolean not null default false,
  tipo_pet text,
  page_url text,
  user_agent text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  raw_payload jsonb
);

alter table public.cvi_leads enable row level security;
