-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create tables first
create table if not exists "public"."profiles" (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists "public"."quizzes" (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  type text not null check (type in ('text', 'video', 'true-false')),
  source_content text,
  video_id text,
  video_title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists "public"."questions" (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  options jsonb,
  correct_answer text not null,
  explanation text,
  order_number integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists "public"."quiz_attempts" (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer not null default 0,
  max_score integer not null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists "public"."quiz_responses" (
  id uuid default uuid_generate_v4() primary key,
  attempt_id uuid references public.quiz_attempts(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  user_answer text not null,
  is_correct boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists quizzes_user_id_idx on public.quizzes(user_id);
create index if not exists quizzes_type_idx on public.quizzes(type);
create index if not exists questions_quiz_id_idx on public.questions(quiz_id);
create index if not exists quiz_attempts_user_id_idx on public.quiz_attempts(user_id);
create index if not exists quiz_attempts_quiz_id_idx on public.quiz_attempts(quiz_id);
create index if not exists quiz_responses_attempt_id_idx on public.quiz_responses(attempt_id);

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing triggers if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists update_profiles_updated_at on public.profiles;
drop trigger if exists update_quizzes_updated_at on public.quizzes;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_quizzes_updated_at
  before update on public.quizzes
  for each row execute function public.update_updated_at_column();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_responses enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Quizzes are viewable by everyone"
  on public.quizzes for select
  using (true);

create policy "Users can create their own quizzes"
  on public.quizzes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quizzes"
  on public.quizzes for update
  using (auth.uid() = user_id);

create policy "Users can delete own quizzes"
  on public.quizzes for delete
  using (auth.uid() = user_id);

create policy "Questions are viewable by everyone"
  on public.questions for select
  using (true);

create policy "Users can insert questions to own quizzes"
  on public.questions for insert
  with check (auth.uid() in (select user_id from public.quizzes where id = quiz_id));

create policy "Users can update questions in own quizzes"
  on public.questions for update
  using (auth.uid() in (select user_id from public.quizzes where id = quiz_id));

create policy "Users can view their own attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can create their own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own attempts"
  on public.quiz_attempts for update
  using (auth.uid() = user_id);

create policy "Users can view their own responses"
  on public.quiz_responses for select
  using (auth.uid() in (select user_id from public.quiz_attempts where id = attempt_id));

create policy "Users can create their own responses"
  on public.quiz_responses for insert
  with check (auth.uid() in (select user_id from public.quiz_attempts where id = attempt_id));