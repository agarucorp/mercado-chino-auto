-- Vendidos: el aviso sigue publicado, pero se oculta el teléfono.
alter table public.listings
  add column if not exists sold boolean not null default false;

-- Reordenamiento de noticias (por si PostgREST todavía no ve la función).
create or replace function public.reorder_news(ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.news n
  set "position" = t.ord
  from unnest(ids) with ordinality as t(id, ord)
  where n.id = t.id;
end;
$$;

grant execute on function public.reorder_news(uuid[]) to authenticated;

-- Repuestos y talleres.
create table if not exists public.service_providers (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('estetico', 'mecanico', 'lubricentro')),
  name text not null,
  city text not null default '',
  phone text not null default '',
  description text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_providers enable row level security;

drop policy if exists service_providers_public_read on public.service_providers;
create policy service_providers_public_read on public.service_providers
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists service_providers_admin_all on public.service_providers;
create policy service_providers_admin_all on public.service_providers
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.service_providers to anon, authenticated;
grant insert, update, delete on public.service_providers to authenticated;

notify pgrst, 'reload schema';
