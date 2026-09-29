-- ============================================================================
-- AUCHAR — Destacados de home elegidos a mano por el admin
--
-- "Vehículo de la semana": un solo aviso marcado is_weekly_pick = true.
-- "Los más vistos": hasta 3 avisos con home_pick_order 1/2/3 (el orden de
-- aparición en la home). Ambos son opcionales — si no hay nada marcado, el
-- front cae al comportamiento anterior (el primero destacado o el más nuevo).
--
-- additive y con default: correr esto no rompe ni pisa nada de lo que ya hay.
-- ============================================================================

alter table public.listings
  add column if not exists is_weekly_pick boolean not null default false;

alter table public.listings
  add column if not exists home_pick_order smallint;

do $$ begin
  alter table public.listings
    add constraint listings_home_pick_order_valid
      check (home_pick_order is null or home_pick_order between 1 and 3);
exception when duplicate_object then null;
end $$;
