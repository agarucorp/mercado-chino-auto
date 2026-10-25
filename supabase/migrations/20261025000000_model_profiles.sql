-- El admin edita, agrega y oculta modelos del catálogo sin tocar el código.
-- La ficha estática sigue siendo la base: una fila pisa nombre, estado, texto, ficha y fotos.

create table if not exists public.model_profiles (
  modelo_id text primary key,
  marca_id text not null,
  nombre text not null,
  estado text not null default 'Vigente' check (estado in ('Vigente', 'Discontinuado')),
  summary text not null default '',
  ficha jsonb,
  images jsonb,
  removed boolean not null default false,
  custom boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.model_profiles enable row level security;

drop policy if exists model_profiles_public_read on public.model_profiles;
create policy model_profiles_public_read on public.model_profiles
  for select to anon, authenticated
  using (not removed or (select public.is_admin()));

drop policy if exists model_profiles_admin_write on public.model_profiles;
create policy model_profiles_admin_write on public.model_profiles
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.model_profiles to anon, authenticated;
grant insert, update, delete on public.model_profiles to authenticated;

insert into storage.buckets (id, name, public)
values ('model-images', 'model-images', true)
on conflict (id) do nothing;

drop policy if exists "model images public read" on storage.objects;
create policy "model images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'model-images');

drop policy if exists "model images admin write" on storage.objects;
create policy "model images admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'model-images' and (select public.is_admin()))
  with check (bucket_id = 'model-images' and (select public.is_admin()));

notify pgrst, 'reload schema';
