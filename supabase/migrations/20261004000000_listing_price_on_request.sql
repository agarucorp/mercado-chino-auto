-- Precio opcional para avisos de agencia: "A consultar".
-- Un aviso con precio publicado sigue exigiendo price > 0.

alter table public.listings
  add column if not exists price_on_request boolean not null default false;

alter table public.listings
  drop constraint if exists listings_price_valid;

alter table public.listings
  alter column price drop not null;

alter table public.listings
  add constraint listings_price_valid check (
    (price_on_request and price is null)
    or (not price_on_request and price > 0)
  );
