create extension if not exists pgcrypto;

create table if not exists public.shop_vouchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  label text not null,
  value numeric not null check (value >= 0),
  currency text not null default 'NZD',
  source_key text not null default 'happy_sheep_farm',
  source_label text not null default '开心羊圈',
  campaign text not null default 'GO GO SHOP',
  status text not null default 'pending_redeem' check (status in ('pending_redeem', 'pending_use', 'used')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  redeemed_at timestamptz,
  used_at timestamptz
);

create index if not exists shop_vouchers_user_source_status_idx
on public.shop_vouchers (user_id, source_key, status, created_at desc);

alter table public.shop_vouchers enable row level security;

drop policy if exists "Users can read own shop vouchers" on public.shop_vouchers;
create policy "Users can read own shop vouchers"
on public.shop_vouchers
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own shop vouchers" on public.shop_vouchers;
create policy "Users can insert own shop vouchers"
on public.shop_vouchers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own shop vouchers" on public.shop_vouchers;
create policy "Users can update own shop vouchers"
on public.shop_vouchers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_shop_voucher_timestamps()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();

  if new.status = 'pending_use' and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    new.redeemed_at := coalesce(new.redeemed_at, now());
  end if;

  if new.status = 'used' and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    new.used_at := coalesce(new.used_at, now());
  end if;

  return new;
end;
$$;

drop trigger if exists shop_vouchers_timestamp_trigger on public.shop_vouchers;
create trigger shop_vouchers_timestamp_trigger
before insert or update on public.shop_vouchers
for each row
execute function public.set_shop_voucher_timestamps();

notify pgrst, 'reload schema';
