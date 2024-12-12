-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Topics/Categories table
create table if not exists "public"."topics" (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  parent_id uuid references public.topics(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name)
);

-- Questions table
create table if not exists "public"."questions" (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references public.topics(id) not null,
  question_text text not null,
  options jsonb not null, -- Array of options
  correct_answer text not null,
  difficulty_level smallint not null check (difficulty_level between 1 and 5),
  explanation text,
  tags text[],
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Question Statistics table
create table if not exists "public"."question_stats" (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.questions(id) on delete cascade not null,
  total_attempts integer default 0,
  correct_attempts integer default 0,
  average_time_seconds numeric(10,2) default 0,
  difficulty_rating numeric(3,2), -- Calculated difficulty based on performance
  discrimination_index numeric(3,2), -- How well the question differentiates between high and low performers
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(question_id) -- Add unique constraint for question_id
);

-- Student Attempts table
create table if not exists "public"."student_attempts" (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  selected_answer text not null,
  is_correct boolean not null,
  time_taken_seconds integer,
  attempt_number integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Performance table
create table if not exists "public"."student_performance" (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references public.topics(id) not null,
  total_questions integer default 0,
  correct_answers integer default 0,
  average_time_seconds numeric(10,2) default 0,
  proficiency_level numeric(3,2), -- Calculated proficiency score
  last_attempt_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, topic_id)
);

-- Learning Progress table
create table if not exists "public"."learning_progress" (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references public.topics(id) not null,
  date date not null,
  questions_attempted integer default 0,
  questions_correct integer default 0,
  average_time_seconds numeric(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, topic_id, date)
);

-- Question Response Distribution
create table if not exists "public"."response_distribution" (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.questions(id) on delete cascade not null,
  answer_option text not null,
  response_count integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(question_id, answer_option)
);

-- Create indexes for performance
create index if not exists questions_topic_id_idx on public.questions(topic_id);
create index if not exists student_attempts_user_id_idx on public.student_attempts(user_id);
create index if not exists student_attempts_question_id_idx on public.student_attempts(question_id);
create index if not exists student_performance_user_id_idx on public.student_performance(user_id);
create index if not exists student_performance_topic_id_idx on public.student_performance(topic_id);
create index if not exists learning_progress_user_topic_idx on public.learning_progress(user_id, topic_id);
create index if not exists questions_difficulty_idx on public.questions(difficulty_level);
create index if not exists questions_tags_idx on public.questions using gin(tags);

-- Create functions for analytics
create or replace function calculate_question_stats()
returns trigger as $$
declare
  v_topic_id uuid;
begin
  -- Get topic_id from the question
  select topic_id into v_topic_id
  from public.questions
  where id = NEW.question_id;

  -- Update question statistics
  insert into public.question_stats (question_id, total_attempts, correct_attempts, average_time_seconds)
  values (NEW.question_id, 1, case when NEW.is_correct then 1 else 0 end, NEW.time_taken_seconds)
  on conflict (question_id) do update set
    total_attempts = question_stats.total_attempts + 1,
    correct_attempts = question_stats.correct_attempts + case when NEW.is_correct then 1 else 0 end,
    average_time_seconds = (question_stats.average_time_seconds * question_stats.total_attempts + NEW.time_taken_seconds) / (question_stats.total_attempts + 1),
    updated_at = now();
    
  -- Update response distribution
  insert into public.response_distribution (question_id, answer_option, response_count)
  values (NEW.question_id, NEW.selected_answer, 1)
  on conflict (question_id, answer_option) do update set
    response_count = response_distribution.response_count + 1,
    updated_at = now();

  -- Update student performance
  insert into public.student_performance (
    user_id, topic_id, total_questions, correct_answers, 
    average_time_seconds, last_attempt_at
  )
  values (
    NEW.user_id, v_topic_id, 1,
    case when NEW.is_correct then 1 else 0 end,
    NEW.time_taken_seconds,
    NEW.created_at
  )
  on conflict (user_id, topic_id) do update set
    total_questions = student_performance.total_questions + 1,
    correct_answers = student_performance.correct_answers + case when NEW.is_correct then 1 else 0 end,
    average_time_seconds = (student_performance.average_time_seconds * student_performance.total_questions + NEW.time_taken_seconds) / (student_performance.total_questions + 1),
    proficiency_level = (student_performance.correct_answers + case when NEW.is_correct then 1 else 0 end)::numeric / (student_performance.total_questions + 1),
    last_attempt_at = NEW.created_at,
    updated_at = now();

  -- Update learning progress
  insert into public.learning_progress (
    user_id, topic_id, date,
    questions_attempted, questions_correct,
    average_time_seconds
  )
  values (
    NEW.user_id, v_topic_id, date_trunc('day', NEW.created_at),
    1, case when NEW.is_correct then 1 else 0 end,
    NEW.time_taken_seconds
  )
  on conflict (user_id, topic_id, date) do update set
    questions_attempted = learning_progress.questions_attempted + 1,
    questions_correct = learning_progress.questions_correct + case when NEW.is_correct then 1 else 0 end,
    average_time_seconds = (learning_progress.average_time_seconds * learning_progress.questions_attempted + NEW.time_taken_seconds) / (learning_progress.questions_attempted + 1);

  return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger for updating statistics
create trigger update_question_stats
  after insert on public.student_attempts
  for each row execute function calculate_question_stats();

-- Enable RLS
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.question_stats enable row level security;
alter table public.student_attempts enable row level security;
alter table public.student_performance enable row level security;
alter table public.learning_progress enable row level security;
alter table public.response_distribution enable row level security;

-- Create policies
create policy "Topics are viewable by everyone"
  on public.topics for select
  using (true);

create policy "Questions are viewable by everyone"
  on public.questions for select
  using (true);

create policy "Question stats are viewable by everyone"
  on public.question_stats for select
  using (true);

create policy "Students can view their own attempts"
  on public.student_attempts for select
  using (auth.uid() = user_id);

create policy "Students can insert their own attempts"
  on public.student_attempts for insert
  with check (auth.uid() = user_id);

create policy "Students can view their own performance"
  on public.student_performance for select
  using (auth.uid() = user_id);

create policy "Students can view their own progress"
  on public.learning_progress for select
  using (auth.uid() = user_id);

create policy "Response distribution is viewable by everyone"
  on public.response_distribution for select
  using (true);