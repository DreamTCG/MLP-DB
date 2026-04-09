-- DreamTCG — Supabase migration 001
-- Run in: Supabase Dashboard → SQL Editor

create table decks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  name       text not null,
  cards_json jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row-Level Security: users can only access their own decks
alter table decks enable row level security;

create policy "Users manage own decks"
  on decks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enforce max 10 decks per user (fires before INSERT only)
create or replace function check_deck_limit()
returns trigger as $$
begin
  if (select count(*) from decks where user_id = new.user_id) >= 10 then
    raise exception 'ไม่สามารถบันทึกเด็คได้เกิน 10 เด็ค';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_deck_limit
  before insert on decks
  for each row execute function check_deck_limit();

-- Auto-update updated_at on any row update
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger decks_updated_at
  before update on decks
  for each row execute function update_updated_at();
