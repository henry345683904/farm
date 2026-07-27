create table if not exists public.farm_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.farm_saves enable row level security;

drop policy if exists "Users can read own farm save" on public.farm_saves;
create policy "Users can read own farm save"
on public.farm_saves
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own farm save" on public.farm_saves;
create policy "Users can insert own farm save"
on public.farm_saves
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own farm save" on public.farm_saves;
create policy "Users can update own farm save"
on public.farm_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
