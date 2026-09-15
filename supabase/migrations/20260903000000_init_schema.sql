-- ============================================================================
-- AUCHAR — Schema inicial
-- Proyecto Supabase: jsnfdeztgefaeshvottd
--
-- Cubre: noticias editables por el admin, solicitudes de publicación de
-- vehículos con flujo de aprobación, y sus imágenes en Storage.
--
-- El script es idempotente: se puede volver a correr sin romper nada.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. TIPOS
-- ----------------------------------------------------------------------------

do $$ begin
  create type public.listing_status as enum ('pendiente', 'aprobada', 'rechazada', 'archivada');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.plan_id as enum ('basico', 'destacado', 'premium');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.seller_type as enum ('particular', 'concesionario');
exception when duplicate_object then null;
end $$;


-- ----------------------------------------------------------------------------
-- 2. ADMINS
--
-- Un solo admin, pero como tabla y no como email hardcodeado: agregar o rotar
-- el admin es un INSERT, no un deploy.
-- ----------------------------------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- security definer: la policy necesita leer `admins` sin quedar atrapada en la
-- RLS de la propia tabla. search_path vacío evita el secuestro por schema.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;


-- ----------------------------------------------------------------------------
-- 3. NOTICIAS
-- ----------------------------------------------------------------------------

create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  excerpt      text not null default '',
  body         text,

  image_url    text,
  image_alt    text,

  category     text not null default 'Novedad',

  -- Atribución: cuando la noticia se importa de un link externo guardamos de
  -- dónde salió. El epígrafe de la card se arma con estos dos campos.
  source_name  text,
  source_url   text,

  marca_id     text,
  modelo_id    text,

  published    boolean not null default false,
  featured     boolean not null default false,

  -- Orden manual del drag & drop. Menor = primero.
  position     integer not null default 0,

  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint news_title_not_blank check (length(btrim(title)) > 0),
  constraint news_source_url_valid check (source_url is null or source_url ~ '^https?://')
);

-- Índice parcial: la home solo lee publicadas, ordenadas por position.
create index if not exists news_public_order_idx
  on public.news (position, published_at desc)
  where published;

create index if not exists news_marca_idx
  on public.news (marca_id)
  where marca_id is not null;


-- ----------------------------------------------------------------------------
-- 4. SOLICITUDES DE PUBLICACIÓN
-- ----------------------------------------------------------------------------

create table if not exists public.listings (
  id           uuid primary key default gen_random_uuid(),
  status       public.listing_status not null default 'pendiente',
  plan         public.plan_id not null default 'basico',

  -- Vehículo
  marca_id     text not null,
  modelo_id    text not null,
  version      text,
  year         integer not null,
  km           integer not null,
  price        numeric(12, 2) not null,
  currency     text not null default 'ARS',
  fuel         text not null,
  transmission text not null,
  location     text not null,
  province     text not null,

  -- Aviso
  title        text not null,
  description  text not null,

  -- Vendedor
  seller_name  text not null,
  seller_email text not null,
  seller_phone text not null,
  seller_type  public.seller_type not null default 'particular',

  -- Revisión
  admin_notes  text,
  reviewed_by  uuid references auth.users (id) on delete set null,
  reviewed_at  timestamptz,

  submitted_at timestamptz not null default now(),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- El rango de año es fijo a propósito: un CHECK tiene que ser inmutable,
  -- no puede depender de now().
  constraint listings_year_valid     check (year between 1990 and 2100),
  constraint listings_km_valid       check (km >= 0),
  constraint listings_price_valid    check (price > 0),
  constraint listings_currency_valid check (currency in ('ARS', 'USD')),
  constraint listings_email_valid    check (seller_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists listings_public_idx
  on public.listings (published_at desc)
  where status = 'aprobada';

-- La bandeja del admin: lo pendiente primero, lo más viejo arriba.
create index if not exists listings_status_idx
  on public.listings (status, submitted_at desc);

create index if not exists listings_marca_idx  on public.listings (marca_id);
create index if not exists listings_modelo_idx on public.listings (modelo_id);

-- FK sin índice = full scan en cada JOIN y en el ON DELETE.
create index if not exists listings_reviewed_by_idx
  on public.listings (reviewed_by)
  where reviewed_by is not null;


-- ----------------------------------------------------------------------------
-- 5. IMÁGENES DE LOS AVISOS
-- ----------------------------------------------------------------------------

create table if not exists public.listing_images (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  alt          text,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists listing_images_listing_idx
  on public.listing_images (listing_id, position);


-- ----------------------------------------------------------------------------
-- 6. updated_at automático
-- ----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists news_touch_updated_at on public.news;
create trigger news_touch_updated_at
  before update on public.news
  for each row execute function public.touch_updated_at();

drop trigger if exists listings_touch_updated_at on public.listings;
create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_updated_at();


-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
--
-- Sin esto cualquiera con la anon key (que es pública, va en el front) puede
-- leer y escribir todo. Es la pieza que sostiene la seguridad del sitio.
-- ----------------------------------------------------------------------------

alter table public.admins         enable row level security;
alter table public.news           enable row level security;
alter table public.listings       enable row level security;
alter table public.listing_images enable row level security;

-- --- admins ---------------------------------------------------------------
-- Nadie escribe por API. El admin se da de alta con el INSERT manual del final.
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select to authenticated
  using ((select public.is_admin()));

-- --- news -----------------------------------------------------------------
drop policy if exists news_public_read on public.news;
create policy news_public_read on public.news
  for select to anon, authenticated
  using (published);

drop policy if exists news_admin_all on public.news;
create policy news_admin_all on public.news
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- --- listings -------------------------------------------------------------
drop policy if exists listings_public_read on public.listings;
create policy listings_public_read on public.listings
  for select to anon, authenticated
  using (status = 'aprobada');

-- Cualquiera puede mandar una solicitud, pero nace 'pendiente' sí o sí:
-- el WITH CHECK impide que alguien se autoapruebe el aviso.
drop policy if exists listings_public_submit on public.listings;
create policy listings_public_submit on public.listings
  for insert to anon, authenticated
  with check (status = 'pendiente');

drop policy if exists listings_admin_all on public.listings;
create policy listings_admin_all on public.listings
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- --- listing_images -------------------------------------------------------
drop policy if exists listing_images_public_read on public.listing_images;
create policy listing_images_public_read on public.listing_images
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'aprobada'
    )
  );

drop policy if exists listing_images_submit on public.listing_images;
create policy listing_images_submit on public.listing_images
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'pendiente'
    )
  );

drop policy if exists listing_images_admin_all on public.listing_images;
create policy listing_images_admin_all on public.listing_images
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));


-- ----------------------------------------------------------------------------
-- 8. GRANTS
--
-- RLS filtra filas, pero primero hace falta permiso sobre la tabla.
-- ----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.news to anon, authenticated;
grant insert, update, delete on public.news to authenticated;

grant select, insert on public.listings to anon, authenticated;
grant update, delete on public.listings to authenticated;

grant select, insert on public.listing_images to anon, authenticated;
grant update, delete on public.listing_images to authenticated;

grant select on public.admins to authenticated;


-- ----------------------------------------------------------------------------
-- 9. STORAGE
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "news images public read" on storage.objects;
create policy "news images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'news-images');

drop policy if exists "news images admin write" on storage.objects;
create policy "news images admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'news-images' and (select public.is_admin()))
  with check (bucket_id = 'news-images' and (select public.is_admin()));

drop policy if exists "listing images public read" on storage.objects;
create policy "listing images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'listing-images');

-- El vendedor sube las fotos antes de que exista la aprobación, así que el
-- INSERT tiene que estar abierto. Ver la nota de spam en el resumen.
drop policy if exists "listing images submit" on storage.objects;
create policy "listing images submit" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'listing-images');

drop policy if exists "listing images admin manage" on storage.objects;
create policy "listing images admin manage" on storage.objects
  for all to authenticated
  using (bucket_id = 'listing-images' and (select public.is_admin()))
  with check (bucket_id = 'listing-images' and (select public.is_admin()));
