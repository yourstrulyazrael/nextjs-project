-- Stop two active reservations for the same space from overlapping in time.
-- Enforced in the database so it holds across users, even though RLS hides
-- other people's rows from each client.
create extension if not exists btree_gist with schema extensions;

alter table public.reservations
  add column if not exists slot tsrange generated always as (
    tsrange(date + start_time, date + start_time + duration_hours * interval '1 hour')
  ) stored;

alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (space_slug with =, slot with &&)
  where (status <> 'Cancelled');
