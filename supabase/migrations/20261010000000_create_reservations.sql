-- Room reservations made from the ReserveIt homepage.
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  space_slug text not null,
  space_name text not null,
  date date not null,
  start_time time not null,
  duration_hours integer not null check (duration_hours between 1 and 12),
  guests integer not null check (guests > 0),
  contact_name text not null,
  contact_phone text not null,
  purpose text,
  total_price numeric(10, 2) not null,
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_user_date_idx on public.reservations (user_id, date);

alter table public.reservations enable row level security;

-- Users can only see, create, and update (cancel) their own reservations.
create policy "Users can view their own reservations"
  on public.reservations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own reservations"
  on public.reservations for insert
  to authenticated
  with check ((select auth.uid()) = user_id and status = 'Pending');

create policy "Users can cancel their own reservations"
  on public.reservations for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and status = 'Cancelled');
