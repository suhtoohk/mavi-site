create table if not exists public.site_content (
  id bigint primary key check (id = 1),
  catalog jsonb not null,
  hero_image_url text,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Public can save site content" on public.site_content;
create policy "Public can save site content"
  on public.site_content for insert
  with check (id = 1);

create policy "Public can update site content"
  on public.site_content for update
  using (id = 1)
  with check (id = 1);

insert into public.site_content (id, catalog, hero_image_url)
values (1, '[]'::jsonb, null)
on conflict (id) do nothing;
