-- ============================================================================
-- AUCHAR — Alta del admin
--
-- IMPORTANTE: correr DESPUÉS de crear el usuario en el dashboard
-- (Authentication → Users → Add user), si no no encuentra nada y no da error:
-- simplemente no inserta ninguna fila.
--
-- Reemplazá el email de abajo por el real antes de ejecutar.
-- ============================================================================

insert into public.admins (user_id, email)
select id, email
from auth.users
where email = 'REEMPLAZAR@dominio.com'
on conflict (user_id) do nothing;


-- Verificación: tiene que devolver exactamente una fila con el email correcto.
-- Si vuelve vacío, el usuario no existe todavía o el email no coincide.
select a.email, a.created_at, u.last_sign_in_at
from public.admins a
join auth.users u on u.id = a.user_id;
