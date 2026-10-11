-- ÇAVUŞZADE ANTWERPEN — ANINDA GÜNCELLEME
-- Supabase > SQL Editor > New query > yapıştır > Run   (tekrar çalıştırmak güvenli)
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sold_out') then
    alter publication supabase_realtime add table public.sold_out;
  end if;
end $$;
