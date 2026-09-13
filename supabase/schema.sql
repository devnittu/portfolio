create table if not exists public.portfolio_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

drop policy if exists "Public can read portfolio content" on public.portfolio_content;
drop policy if exists "Admin app can save portfolio content" on public.portfolio_content;
drop policy if exists "Admin app can update portfolio content" on public.portfolio_content;

create policy "Public can read portfolio content"
on public.portfolio_content for select
to anon, authenticated
using (id = 'main');

create policy "Admin app can save portfolio content"
on public.portfolio_content for insert
to anon, authenticated
with check (id = 'main');

create policy "Admin app can update portfolio content"
on public.portfolio_content for update
to anon, authenticated
using (id = 'main')
with check (id = 'main');

insert into public.portfolio_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

create policy "Public can view portfolio assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio-assets');

drop policy if exists "Admin app can upload portfolio assets" on storage.objects;

create policy "Admin app can upload portfolio assets"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'portfolio-assets');
