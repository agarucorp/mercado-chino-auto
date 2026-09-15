-- Las notas quitadas del radar (published = false) siguen visibles en la
-- ficha del modelo si tienen modelo_id. El radar público solo lista published.

drop policy if exists news_public_read on public.news;
create policy news_public_read on public.news
  for select to anon, authenticated
  using (published or modelo_id is not null);
