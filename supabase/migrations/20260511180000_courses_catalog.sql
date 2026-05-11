-- Course catalog + curriculum, with seed data for the e-learning platform.
-- price_cents is the integer cent value (e.g. 14900 = $149.00).

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text not null,
  description text,
  category text not null check (category in ('foundations','tax','operations','protection','exit','bundle')),
  level text not null check (level in ('beginner','intermediate','advanced','all')),
  duration_hours numeric not null default 0,
  module_count integer not null default 0,
  price_cents integer not null,
  original_price_cents integer,
  featured boolean not null default false,
  position integer not null default 0,
  image_url text,
  outcomes jsonb not null default '[]'::jsonb,
  who_for jsonb not null default '[]'::jsonb,
  recommended_for jsonb not null default '[]'::jsonb, -- e.g. ['pre-llc', 'new-owner']
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null,
  title text not null,
  description text,
  duration_min integer,
  created_at timestamptz not null default now()
);

create index courses_position_idx on public.courses(position);
create index courses_category_idx on public.courses(category);
create index course_modules_course_idx on public.course_modules(course_id);

alter table public.courses enable row level security;
alter table public.course_modules enable row level security;

create policy "Public read courses" on public.courses for select using (true);
create policy "Public read course_modules" on public.course_modules for select using (true);

-- TEMP: open write — tighten with admin auth later.
create policy "Open write courses" on public.courses for all using (true) with check (true);
create policy "Open write course_modules" on public.course_modules for all using (true) with check (true);

-- Seed: 6 individual courses + 1 bundle
insert into public.courses (slug, title, subtitle, category, level, duration_hours, module_count, price_cents, original_price_cents, featured, position, outcomes, who_for, recommended_for) values
  ('foundations-playbook',
   'The Foundations Playbook',
   'Set up your business the right way from day one.',
   'foundations', 'beginner', 4.5, 4, 14900, null, true, 1,
   '["Pick the right entity for your situation","Set up an EIN, operating agreement, and books that scale","Avoid the $5K+ setup mistakes most new owners make","Lock in tax elections that save thousands year-one"]',
   '["Pre-LLC founders","Owners in their first 6 months","Anyone restructuring an existing business"]',
   '["pre-llc","new-owner"]'),

  ('scorp-strategy',
   'The S-Corp Strategy',
   'Cut self-employment tax without crossing the IRS.',
   'tax', 'intermediate', 3.0, 3, 24900, null, true, 2,
   '["Decide if an S-Corp election fits your numbers","Calculate a defensible reasonable salary","Set up the right payroll cadence","Document everything to survive an audit"]',
   '["Solo owners netting $40K+","LLCs ready to elect S-Corp status","Owners paying too much self-employment tax"]',
   '["new-owner","growing"]'),

  ('year-round-tax-planning',
   'Year-Round Tax Planning',
   'Plan during the year — not after it ends.',
   'tax', 'intermediate', 5.5, 5, 34900, null, true, 3,
   '["Build a quarterly tax-planning rhythm","Capture every legal deduction with documentation","Time income and expenses to your advantage","Stop being surprised by April"]',
   '["Owners with revenue $100K+","Anyone tired of year-end tax bills","Business owners with seasonal income"]',
   '["new-owner","growing","scaling"]'),

  ('bookkeeping-foundation',
   'Bookkeeping Foundation',
   'Numbers you can actually use to make decisions.',
   'foundations', 'beginner', 3.5, 4, 9900, null, false, 4,
   '["Separate business and personal cleanly","Set up a chart of accounts that scales","Read your P&L and balance sheet with confidence","Know when to hire a bookkeeper vs DIY"]',
   '["DIY owners on spreadsheets","Owners with messy books","Anyone planning to scale past $250K revenue"]',
   '["pre-llc","new-owner","growing"]'),

  ('payroll-contractors',
   'Payroll & Contractors Mastery',
   'Hire the right way. Avoid five-figure penalties.',
   'operations', 'intermediate', 4.0, 4, 19900, null, false, 5,
   '["Classify W-2 vs 1099 correctly","Set up compliant payroll without breaking the bank","Handle multi-state employees and contractors","Avoid the IRS audit triggers that catch growing businesses"]',
   '["Owners hiring their first employee","Anyone using contractors","Businesses with multi-state workers"]',
   '["growing","scaling"]'),

  ('asset-protection-blueprint',
   'Asset Protection Blueprint',
   'Separate operating risk from your personal wealth.',
   'protection', 'advanced', 4.5, 4, 29900, null, false, 6,
   '["Structure holding companies and operating LLCs","Protect personal assets from business liability","Use Florida-specific asset-protection tools","Set up the foundation for a tax-efficient exit"]',
   '["Owners with $250K+ in personal/business assets","Anyone in higher-risk industries","Owners with real estate or rental income"]',
   '["growing","scaling"]'),

  ('exit-planning',
   'Business Exit Planning',
   'Structure today for a tax-efficient sale tomorrow.',
   'exit', 'advanced', 5.0, 5, 39900, null, false, 7,
   '["Use QSBS §1202 to exclude up to $10M in gains","Plan succession or sale years ahead","Structure earn-outs and rollovers","Build value the way buyers actually pay for it"]',
   '["Owners thinking 3-10 years to exit","Businesses with $1M+ enterprise value","Anyone planning succession to family"]',
   '["scaling"]'),

  ('complete-playbook',
   'The Complete Playbook',
   'All 7 courses · Every stage covered · Lifetime access.',
   'bundle', 'all', 30.0, 29, 89900, 159500, true, 0,
   '["Every module from every course","Lifetime updates as tax law changes","Priority email support","All future courses included"]',
   '["Owners committed to the full system","Anyone planning 3+ year growth","CFOs, advisors, and operators"]',
   '["pre-llc","new-owner","growing","scaling"]');

-- Curriculum modules
-- foundations-playbook
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'First-Year Setup', 'Capture startup costs, choose effective date, avoid common filing mistakes.', 55),
  (1, 'Business Entity Selection', 'LLC vs S-Corp vs C-Corp — the decision framework that actually matters.', 70),
  (2, 'Financial Infrastructure', 'Banking, bookkeeping, and the chart of accounts that scales.', 65),
  (3, 'Tax Elections', 'Form 2553, calendar vs fiscal year, the cash vs accrual decision.', 50)
) as x(position, title, description, duration_min) where slug = 'foundations-playbook';

-- scorp-strategy
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'S-Corp Decision Math', 'When the election actually pays — and when it doesn''t.', 60),
  (1, 'Reasonable Salary Calculation', 'Document a salary that holds up under audit.', 65),
  (2, 'Distributions & Tax Mechanics', 'How to take money out without breaking the rules.', 55)
) as x(position, title, description, duration_min) where slug = 'scorp-strategy';

-- year-round-tax-planning
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'Quarterly Tax-Planning Rhythm', 'A repeatable 60-minute quarterly review.', 60),
  (1, 'Tax Deductions Most Owners Miss', 'Vehicle, home office, meals, retirement, education.', 70),
  (2, 'Year-End Acceleration & Deferral', 'Time income and expenses to your advantage.', 55),
  (3, 'Health Insurance Strategy', 'Self-employed health, HRAs, HSA stacking.', 50),
  (4, 'IRS Letters & Audit Defense', 'What to do when something arrives in the mail.', 45)
) as x(position, title, description, duration_min) where slug = 'year-round-tax-planning';

-- bookkeeping-foundation
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'Separation & Setup', 'Bank accounts, credit cards, and the line in the sand.', 55),
  (1, 'Chart of Accounts That Scales', 'Build it once for the next 5 years.', 60),
  (2, 'Reading Your P&L', 'What the numbers actually mean.', 50),
  (3, 'Hire vs DIY Decision', 'When and how to bring in help.', 35)
) as x(position, title, description, duration_min) where slug = 'bookkeeping-foundation';

-- payroll-contractors
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'W-2 vs 1099 Classification', 'The IRS test, the right call, the documentation.', 60),
  (1, 'Payroll Setup', 'Gusto, ADP, or DIY — the comparison.', 55),
  (2, 'Multi-State & Remote Workers', 'Nexus, withholding, state-by-state minefields.', 65),
  (3, 'Audit Triggers & How to Avoid Them', 'Patterns the IRS looks for.', 60)
) as x(position, title, description, duration_min) where slug = 'payroll-contractors';

-- asset-protection-blueprint
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'Personal vs Business Risk', 'Drawing the line that holds up in court.', 60),
  (1, 'Holding Company Structures', 'Operating LLC + holding LLC, the right way.', 70),
  (2, 'Florida-Specific Tools', 'Homestead, tenancy by entireties, exempt assets.', 55),
  (3, 'Insurance as a Last Line', 'Where it fits and what it doesn''t cover.', 50)
) as x(position, title, description, duration_min) where slug = 'asset-protection-blueprint';

-- exit-planning
insert into public.course_modules (course_id, position, title, description, duration_min)
select id, x.position, x.title, x.description, x.duration_min from public.courses, lateral (values
  (0, 'Exit Math', 'Multiples, earn-outs, rollovers, capital gains.', 70),
  (1, 'QSBS §1202 Strategy', 'Up to $10M excluded if structured 5+ years out.', 75),
  (2, 'Building Buyer-Ready Value', 'The metrics buyers underwrite.', 60),
  (3, 'Succession to Family', 'Gifting, trusts, valuation discounts.', 55),
  (4, 'Negotiating the LOI', 'The terms that move the needle.', 40)
) as x(position, title, description, duration_min) where slug = 'exit-planning';
