-- ============================================
-- TaskBoard — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Enable anonymous sign-in:
--    Go to Authentication → Settings → Auth Providers
--    Toggle ON "Allow anonymous sign-ins"

-- 2. Create tables:

-- Tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'in_review', 'done')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  due_date date,
  position integer not null default 0,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Team members table
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#3b82f6',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Labels table
create table if not exists labels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#3b82f6',
  user_id uuid not null references auth.users(id) on delete cascade
);

-- Task-Assignee join table
create table if not exists task_assignees (
  task_id uuid not null references tasks(id) on delete cascade,
  member_id uuid not null references team_members(id) on delete cascade,
  primary key (task_id, member_id)
);

-- Task-Label join table
create table if not exists task_labels (
  task_id uuid not null references tasks(id) on delete cascade,
  label_id uuid not null references labels(id) on delete cascade,
  primary key (task_id, label_id)
);

-- 3. Enable Row Level Security

alter table tasks enable row level security;
alter table team_members enable row level security;
alter table labels enable row level security;
alter table task_assignees enable row level security;
alter table task_labels enable row level security;

-- 4. RLS Policies

-- Tasks: users can only CRUD their own tasks
create policy "Users can view own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can create own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);

-- Team members: users can only CRUD their own team members
create policy "Users can view own team members" on team_members for select using (auth.uid() = user_id);
create policy "Users can create own team members" on team_members for insert with check (auth.uid() = user_id);
create policy "Users can update own team members" on team_members for update using (auth.uid() = user_id);
create policy "Users can delete own team members" on team_members for delete using (auth.uid() = user_id);

-- Labels: users can only CRUD their own labels
create policy "Users can view own labels" on labels for select using (auth.uid() = user_id);
create policy "Users can create own labels" on labels for insert with check (auth.uid() = user_id);
create policy "Users can update own labels" on labels for update using (auth.uid() = user_id);
create policy "Users can delete own labels" on labels for delete using (auth.uid() = user_id);

-- Task assignees: users can manage assignees for their own tasks
create policy "Users can view own task assignees" on task_assignees for select
  using (exists (select 1 from tasks where tasks.id = task_assignees.task_id and tasks.user_id = auth.uid()));
create policy "Users can create own task assignees" on task_assignees for insert
  with check (exists (select 1 from tasks where tasks.id = task_assignees.task_id and tasks.user_id = auth.uid()));
create policy "Users can delete own task assignees" on task_assignees for delete
  using (exists (select 1 from tasks where tasks.id = task_assignees.task_id and tasks.user_id = auth.uid()));

-- Task labels: users can manage labels for their own tasks
create policy "Users can view own task labels" on task_labels for select
  using (exists (select 1 from tasks where tasks.id = task_labels.task_id and tasks.user_id = auth.uid()));
create policy "Users can create own task labels" on task_labels for insert
  with check (exists (select 1 from tasks where tasks.id = task_labels.task_id and tasks.user_id = auth.uid()));
create policy "Users can delete own task labels" on task_labels for delete
  using (exists (select 1 from tasks where tasks.id = task_labels.task_id and tasks.user_id = auth.uid()));
