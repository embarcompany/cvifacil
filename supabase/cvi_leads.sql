create extension if not exists pgcrypto;

do $$
begin
  create type public.cvi_lead_status as enum (
    'novo',
    'contatado',
    'em_atendimento',
    'aguardando_cliente',
    'convertido',
    'perdido'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.cvi_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  nome_tutor text not null,
  whatsapp text not null,
  whatsapp_e164 text,
  whatsapp_country text,
  whatsapp_country_code text,
  whatsapp_international text,
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
  gbraid text,
  wbraid text,
  dclid text,
  msclkid text,
  ttclid text,
  twclid text,
  rdt_cid text,
  igshid text,
  ctwa_clid text,
  irclickid text,
  epik text,
  wamid text,
  tintim_fbid text,
  src text,
  sck text,
  utm_date text,
  status public.cvi_lead_status not null default 'novo',
  mensagem_enviada boolean not null default false,
  evo_message_id text,
  evo_instance text,
  first_contact_at timestamptz,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  assigned_to text,
  observacoes text,
  raw_payload jsonb
);

alter table public.cvi_leads enable row level security;

alter table public.cvi_leads
  add column if not exists submitted_at timestamptz,
  add column if not exists whatsapp_e164 text,
  add column if not exists whatsapp_country text,
  add column if not exists whatsapp_country_code text,
  add column if not exists whatsapp_international text,
  add column if not exists email_opcional text,
  add column if not exists pais_destino_outro text,
  add column if not exists destino_final text,
  add column if not exists qtd_gatos integer not null default 0,
  add column if not exists qtd_cachorros integer not null default 0,
  add column if not exists total_pets integer not null default 0,
  add column if not exists pet_summary text,
  add column if not exists mais_de_um_pet boolean not null default false,
  add column if not exists tipo_pet text,
  add column if not exists page_url text,
  add column if not exists user_agent text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists gclid text,
  add column if not exists fbclid text,
  add column if not exists gbraid text,
  add column if not exists wbraid text,
  add column if not exists dclid text,
  add column if not exists msclkid text,
  add column if not exists ttclid text,
  add column if not exists twclid text,
  add column if not exists rdt_cid text,
  add column if not exists igshid text,
  add column if not exists ctwa_clid text,
  add column if not exists irclickid text,
  add column if not exists epik text,
  add column if not exists wamid text,
  add column if not exists tintim_fbid text,
  add column if not exists src text,
  add column if not exists sck text,
  add column if not exists utm_date text,
  add column if not exists status public.cvi_lead_status not null default 'novo',
  add column if not exists mensagem_enviada boolean not null default false,
  add column if not exists evo_message_id text,
  add column if not exists evo_instance text,
  add column if not exists first_contact_at timestamptz,
  add column if not exists last_contact_at timestamptz,
  add column if not exists next_follow_up_at timestamptz,
  add column if not exists assigned_to text,
  add column if not exists observacoes text,
  add column if not exists raw_payload jsonb;

create index if not exists cvi_leads_created_at_idx on public.cvi_leads (created_at desc);
create index if not exists cvi_leads_status_idx on public.cvi_leads (status);
create index if not exists cvi_leads_evo_pending_idx
  on public.cvi_leads (created_at)
  where status = 'novo' and mensagem_enviada = false;
create index if not exists cvi_leads_whatsapp_idx on public.cvi_leads (whatsapp);
create index if not exists cvi_leads_whatsapp_e164_idx on public.cvi_leads (whatsapp_e164);
create index if not exists cvi_leads_utm_campaign_idx on public.cvi_leads (utm_campaign);
create index if not exists cvi_leads_fbclid_idx on public.cvi_leads (fbclid);
create index if not exists cvi_leads_gbraid_idx on public.cvi_leads (gbraid);
create index if not exists cvi_leads_wbraid_idx on public.cvi_leads (wbraid);
create index if not exists cvi_leads_dclid_idx on public.cvi_leads (dclid);
create index if not exists cvi_leads_msclkid_idx on public.cvi_leads (msclkid);
create index if not exists cvi_leads_ttclid_idx on public.cvi_leads (ttclid);
create index if not exists cvi_leads_ctwa_clid_idx on public.cvi_leads (ctwa_clid);

drop view if exists public.cvi_leads_operacao;

create or replace view public.cvi_leads_operacao
with (security_invoker = true)
as
select
  id,
  created_at,
  submitted_at,
  status,
  mensagem_enviada,
  nome_tutor,
  whatsapp,
  whatsapp_e164,
  whatsapp_country,
  whatsapp_country_code,
  whatsapp_international,
  email_opcional,
  raw_payload,
  cidade_origem,
  destino_final,
  data_viagem,
  pet_summary,
  total_pets,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  gclid,
  fbclid,
  gbraid,
  wbraid,
  dclid,
  msclkid,
  ttclid,
  twclid,
  rdt_cid,
  igshid,
  ctwa_clid,
  irclickid,
  epik,
  wamid,
  tintim_fbid,
  src,
  sck,
  utm_date,
  evo_message_id,
  evo_instance,
  first_contact_at,
  last_contact_at,
  next_follow_up_at,
  assigned_to,
  observacoes
from public.cvi_leads
order by created_at desc;

drop view if exists public.cvi_leads_evo_pendentes;

create or replace view public.cvi_leads_evo_pendentes
with (security_invoker = true)
as
select
  id,
  created_at,
  nome_tutor,
  whatsapp,
  whatsapp_e164,
  whatsapp_country,
  whatsapp_country_code,
  whatsapp_international,
  email_opcional,
  raw_payload,
  cidade_origem,
  destino_final,
  data_viagem,
  pet_summary,
  total_pets,
  utm_source,
  utm_medium,
  utm_campaign,
  gclid,
  fbclid,
  gbraid,
  wbraid,
  dclid,
  msclkid,
  ttclid,
  twclid,
  rdt_cid,
  igshid,
  ctwa_clid,
  irclickid,
  epik,
  wamid,
  tintim_fbid,
  src,
  sck,
  utm_date
from public.cvi_leads
where status = 'novo'
  and mensagem_enviada = false
order by created_at asc;
