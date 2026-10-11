-- Run this file in Supabase Dashboard > SQL Editor.
create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  eaten_at date not null default current_date, meal text not null default 'Snack', name text not null,
  calories integer not null default 0, protein numeric not null default 0, carbs numeric not null default 0,
  fat numeric not null default 0, fibre numeric not null default 0, sugar numeric not null default 0,
  sodium numeric not null default 0, saturated_fat numeric not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date, steps integer not null default 0, run_km numeric not null default 0,
  active_minutes integer not null default 0, calories_burned integer not null default 0, note text,
  created_at timestamptz not null default now()
);
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null default current_date, exercise text not null, muscle_group text not null default 'Full body',
  sets integer not null default 0, reps integer not null default 0, weight_kg numeric not null default 0,
  rest_seconds integer not null default 60, duration_minutes integer not null default 0, calories_burned integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.wellness_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date, water_ml integer not null default 0, sleep_hours numeric not null default 0,
  bedtime text, wake_time text, energy integer not null default 3, soreness integer not null default 2,
  weight_kg numeric, habits jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
  unique(user_id, log_date)
);
create table if not exists public.user_goals (
  user_id uuid primary key references auth.users(id) on delete cascade, calorie_target integer not null default 2200,
  protein_target integer not null default 130, fibre_target integer not null default 30, water_target integer not null default 2500,
  steps_target integer not null default 8000, updated_at timestamptz not null default now()
);

alter table public.food_logs enable row level security;
alter table public.activity_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.wellness_logs enable row level security;
alter table public.user_goals enable row level security;
create policy "own food logs" on public.food_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own activity logs" on public.activity_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own workouts" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own wellness logs" on public.wellness_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own goals" on public.user_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
