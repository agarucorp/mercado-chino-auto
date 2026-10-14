-- El admin elige qué notas entran al carrusel de últimos lanzamientos.
-- Las que ya eran categoría Lanzamiento quedan marcadas para no vaciar el inicio.
alter table public.news
  add column if not exists home_launch boolean not null default false;

update public.news
set home_launch = true
where category = 'Lanzamiento';

notify pgrst, 'reload schema';
