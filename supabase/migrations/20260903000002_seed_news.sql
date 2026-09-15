-- ============================================================================
-- AUCHAR — Migración de las noticias estáticas a la base
--
-- Origen: src/data/news.ts (10 artículos). A partir de acá la base es la
-- fuente de verdad; el archivo estático queda solo como respaldo histórico.
--
-- Seguro de correr más de una vez: el WHERE NOT EXISTS del final hace que
-- solo siembre si la tabla está vacía. Nunca pisa ni borra lo que cargue
-- el admin.
-- ============================================================================

insert into public.news
  (title, excerpt, image_url, category, source_name, marca_id, modelo_id, featured, position, published_at, published)
select v.*
from (values
    ('BYD lanza el nuevo Seal U DM-i en Argentina: precios y versiones disponibles', 'La marca china presenta su SUV híbrido enchufable con una autonomía combinada de hasta 1.200 km y tecnología de última generación.', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop', 'Lanzamiento', 'Autoblog', 'byd'::text, 'byd-seal-u-dm-i'::text, true, 0, '2026-01-22T12:00:00Z'::timestamptz, true),
    ('Chery Tiggo 8 Pro Max: llega la versión tope de gama al mercado argentino', 'Con motor turbo de 197 CV y caja automática de 7 velocidades, el nuevo Tiggo 8 Pro Max promete redefinir el segmento.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Novedad', 'Motor1', 'chery'::text, 'chery-tiggo-8-pro'::text, false, 1, '2026-01-21T12:00:00Z'::timestamptz, true),
    ('GWM confirma la llegada del ORA 03 eléctrico para el segundo semestre', 'El compacto eléctrico de Great Wall Motors llegará con 400 km de autonomía y un precio competitivo.', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop', 'Eléctricos', 'Parabrisas', 'gwm'::text, 'gwm-ora-03'::text, false, 2, '2026-01-20T12:00:00Z'::timestamptz, true),
    ('Geely anuncia nueva planta de ensamblaje en Córdoba', 'La inversión de 300 millones de dólares generará más de 2.000 puestos de trabajo directos.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop', 'Industria', 'La Nación', 'geely'::text, null::text, false, 3, '2026-01-19T12:00:00Z'::timestamptz, true),
    ('JAC presenta el nuevo pickup T8 con motor diésel de 150 CV', 'La pickup china busca competir directamente con las marcas establecidas del segmento.', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', 'Pickups', '16 Válvulas', 'jac'::text, 'jac-t8'::text, false, 4, '2026-01-18T12:00:00Z'::timestamptz, true),
    ('Nuevas regulaciones de importación favorecen a vehículos eléctricos chinos', 'El gobierno anunció beneficios arancelarios para vehículos de bajas emisiones importados.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', 'Política', 'Infobae', null::text, null::text, false, 5, '2026-01-17T12:00:00Z'::timestamptz, true),
    ('Comparativa: los 5 SUV chinos más vendidos del mes', 'Analizamos las características, precios y equipamiento de los modelos más populares.', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Comparativas', 'Autocity', null::text, null::text, false, 6, '2026-01-16T12:00:00Z'::timestamptz, true),
    ('BYD supera las 10.000 unidades vendidas en Argentina durante 2025', 'La marca eléctrica china consolida su liderazgo en el segmento de bajas emisiones con fuerte demanda en CABA y GBA.', 'https://images.unsplash.com/photo-1619767886555-ef3f88941f8b?w=800&h=600&fit=crop', 'Mercado', 'Autoblog', 'byd'::text, null::text, false, 7, '2025-12-12T12:00:00Z'::timestamptz, true),
    ('Chery amplía su red de concesionarios en el interior del país', 'Cinco nuevos puntos de venta en Rosario, Mendoza y Tucumán refuerzan la presencia de la marca en 2025.', 'https://images.unsplash.com/photo-1519641471654-76cebc7f6450?w=800&h=600&fit=crop', 'Industria', 'Motor1', 'chery'::text, null::text, false, 8, '2025-11-28T12:00:00Z'::timestamptz, true),
    ('El mercado de pick-ups chinas creció un 35% interanual en Argentina', 'JAC y GWM lideran las ventas del segmento utilitario con modelos diésel y configuraciones 4x4.', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', 'Mercado', 'La Nación', null::text, null::text, false, 9, '2025-10-15T12:00:00Z'::timestamptz, true)
) as v(title, excerpt, image_url, category, source_name, marca_id, modelo_id, featured, position, published_at, published)
where not exists (select 1 from public.news);


-- Verificación: 10 filas, ordenadas por `position`.
select position, featured, category, left(title, 45) as titulo
from public.news
order by position;
