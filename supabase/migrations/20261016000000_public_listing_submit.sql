-- Un visitante puede crear un aviso pendiente, pero no puede leerlo.
-- La política de las fotos pregunta si ese aviso existe y, por RLS, no lo ve.
-- Esta función solo responde sí o no, sin devolver datos del vendedor.

create or replace function public.listing_is_pending(listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.listings
    where id = listing_id
      and status = 'pendiente'
  );
$$;

revoke all on function public.listing_is_pending(uuid) from public;
grant execute on function public.listing_is_pending(uuid) to anon, authenticated;

drop policy if exists listing_images_submit on public.listing_images;
create policy listing_images_submit on public.listing_images
  for insert to anon, authenticated
  with check (public.listing_is_pending(listing_id));

notify pgrst, 'reload schema';
