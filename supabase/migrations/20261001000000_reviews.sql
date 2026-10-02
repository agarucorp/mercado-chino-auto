-- ============================================================================
-- Reseñas de propietarios
-- Proyecto Supabase: jsnfdeztgefaeshvottd
--
-- Cualquiera puede publicar (no hay cuenta de usuario). Solo el admin puede
-- editar o borrar, porque el autor no puede volver a entrar a la suya.
-- ============================================================================

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  marca_id   text not null,
  modelo_id  text not null,
  brand      text not null,
  model      text not null,
  year       integer not null,
  first_name text not null,
  last_name  text not null,
  author     text not null,
  rating     integer not null,
  content    text not null,
  likes      integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reviews_year_valid    check (year between 1990 and 2100),
  constraint reviews_rating_valid  check (rating between 1 and 5),
  constraint reviews_likes_valid   check (likes >= 0),
  constraint reviews_name_present  check (length(btrim(first_name)) > 0 and length(btrim(last_name)) > 0),
  constraint reviews_content_len   check (length(btrim(content)) between 20 and 2000)
);

create index if not exists reviews_modelo_idx
  on public.reviews (marca_id, modelo_id, created_at desc);

drop trigger if exists reviews_touch_updated_at on public.reviews;
create trigger reviews_touch_updated_at
  before update on public.reviews
  for each row execute function public.touch_updated_at();

alter table public.reviews enable row level security;

drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select to anon, authenticated
  using (true);

-- Publicar sí. likes nace en 0: el visitante no puede inflar el contador.
drop policy if exists reviews_public_insert on public.reviews;
create policy reviews_public_insert on public.reviews
  for insert to anon, authenticated
  with check (likes = 0);

drop policy if exists reviews_admin_update on public.reviews;
create policy reviews_admin_update on public.reviews
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists reviews_admin_delete on public.reviews;
create policy reviews_admin_delete on public.reviews
  for delete to authenticated
  using ((select public.is_admin()));

grant select, insert on public.reviews to anon, authenticated;
grant update, delete on public.reviews to authenticated;

-- Las de ejemplo no se publican. Si este script ya se corrió, se borran.
delete from public.reviews
where id in (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555',
  '66666666-6666-4666-8666-666666666666'
);
