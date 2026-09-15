-- ============================================================================
-- AUCHAR — Reordenamiento de noticias en una sola operación
--
-- Mover una card cambia la posición de todas las que quedan en el medio.
-- Hacerlo con un UPDATE por fila son N viajes a la base y, si uno falla a
-- mitad de camino, el orden queda inconsistente. Esta función lo resuelve
-- en una sola sentencia atómica.
--
-- security invoker (el default, acá explícito): respeta RLS, así que solo
-- el admin puede reordenar. Con security definer cualquiera podría.
-- ============================================================================

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
