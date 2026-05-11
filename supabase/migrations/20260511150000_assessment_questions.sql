-- Assessment questions + options.
-- Q kind: 'stage' (maps to segment), 'pain' (maps to pain), 'context' (no mapping).
-- Option.value carries the mapped enum value for stage/pain; null for context options.

create table public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  position integer not null,
  prompt text not null,
  kind text not null check (kind in ('stage', 'pain', 'context')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessment_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.assessment_questions(id) on delete cascade,
  position integer not null,
  label text not null,
  value text,
  created_at timestamptz not null default now()
);

create index assessment_options_question_idx on public.assessment_options(question_id);
create index assessment_questions_position_idx on public.assessment_questions(position);

alter table public.assessment_questions enable row level security;
alter table public.assessment_options enable row level security;

-- Public read so the landing assessment can render without auth.
create policy "Public read assessment questions"
  on public.assessment_questions for select using (true);
create policy "Public read assessment options"
  on public.assessment_options for select using (true);

-- TEMP: open write policies so the demo /admin dashboard works without auth.
-- Replace with an admin role check once auth is wired up.
create policy "Open write assessment questions"
  on public.assessment_questions for all using (true) with check (true);
create policy "Open write assessment options"
  on public.assessment_options for all using (true) with check (true);

-- Seed the three current questions and their options.
insert into public.assessment_questions (position, prompt, kind) values
  (0, 'Where are you in your business journey?', 'stage'),
  (1, 'What''s your biggest financial worry right now?', 'pain'),
  (2, 'How are you handling your finances today?', 'context');

insert into public.assessment_options (question_id, position, label, value)
select q.id, x.position, x.label, x.value
from public.assessment_questions q
join (values
  (0, 0, 'Just registered my LLC', 'pre-llc'),
  (0, 1, 'Operating less than 1 year', 'new-owner'),
  (0, 2, '1–3 years in business', 'growing'),
  (0, 3, '3+ years and growing', 'scaling'),
  (1, 0, 'Paying too much in taxes', 'taxes'),
  (1, 1, 'Not understanding my numbers', 'numbers'),
  (1, 2, 'Setting up payroll & contractors correctly', 'payroll'),
  (1, 3, 'Protecting what I''ve built', 'protection'),
  (2, 0, 'DIY — spreadsheets and hope', null::text),
  (2, 1, 'A bookkeeper but no tax planner', null::text),
  (2, 2, 'A CPA at year-end only', null::text),
  (2, 3, 'Year-round CPA + advisor', null::text)
) as x(q_position, position, label, value) on q.position = x.q_position;
