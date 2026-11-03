-- 내 차 결정 도우미: 로그인한 사용자별 입력값(앱 상태) 1건을 저장한다.
create table if not exists public.car_decisions (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.car_decisions enable row level security;

-- 본인 행만 읽고 쓸 수 있다
create policy "car_decisions_select_own" on public.car_decisions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "car_decisions_insert_own" on public.car_decisions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "car_decisions_update_own" on public.car_decisions
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "car_decisions_delete_own" on public.car_decisions
  for delete to authenticated using ((select auth.uid()) = user_id);
