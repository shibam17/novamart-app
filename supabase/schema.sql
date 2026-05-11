-- NovaMart Database Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard > SQL Editor)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase Auth users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- PRODUCTS
-- ============================================
create table public.products (
  id text primary key,
  name text not null,
  brand text not null,
  price decimal(10,2) not null,
  original_price decimal(10,2),
  description text,
  features text[] default '{}',
  specifications jsonb default '{}',
  category text not null,
  subcategory text,
  image text,
  images text[] default '{}',
  sizes text[] default '{}',
  colors jsonb default '[]',
  rating decimal(2,1) default 0,
  reviews integer default 0,
  in_stock boolean default true,
  stock_count integer default 0,
  tags text[] default '{}',
  badge text,
  sku text unique,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Anyone can read products"
  on public.products for select
  to anon, authenticated
  using (true);

-- ============================================
-- ORDERS
-- ============================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  user_id uuid references auth.users,
  guest_email text,
  status text default 'confirmed' check (status in ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  items jsonb not null,
  subtotal decimal(10,2) not null,
  shipping decimal(10,2) default 0,
  tax decimal(10,2) default 0,
  total decimal(10,2) not null,
  shipping_address jsonb,
  payment_method text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Anon can create guest orders"
  on public.orders for insert
  to anon
  with check (user_id is null);

-- ============================================
-- WISHLIST
-- ============================================
create table public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.wishlists enable row level security;

create policy "Users can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "Users can add to wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- ============================================
-- CONTACT MESSAGES
-- ============================================
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact form"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
create table public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);
