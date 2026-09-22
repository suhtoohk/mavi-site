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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null,
  shipping_method text not null,
  shipping_amount numeric not null default 0,
  subtotal numeric not null,
  total_amount numeric not null,
  payment_method text not null check (payment_method in ('promptpay', 'card', 'ewallet')),
  payment_status text not null default 'pending',
  order_status text not null default 'pending',
  items jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Public can create pending orders" on public.orders;
create policy "Public can create pending orders"
  on public.orders for insert
  with check (payment_status = 'pending' and order_status = 'pending');
