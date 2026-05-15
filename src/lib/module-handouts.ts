// ============================================================================
// MODULE HANDOUTS — structured content used to render the on-screen handout
// preview AND to generate the downloadable PDF (via generate-handout-pdf.ts).
//
// Keep entries short and scannable — these become 1–2 page reference sheets.
// ============================================================================

export type HandoutSection =
  | { kind: "intro"; body: string }
  | { kind: "checklist"; title: string; items: string[] }
  | { kind: "concepts"; title: string; items: { term: string; def: string }[] }
  | { kind: "actions"; title: string; items: string[] }
  | { kind: "notes"; title: string; body: string };

export type ModuleHandout = {
  /** Module slug from curriculum.ts — links the handout to its module. */
  slug: string;
  /** Filename stem used when the PDF is downloaded. */
  filename: string;
  title: string;
  subtitle: string;
  sections: HandoutSection[];
};

export const MODULE_HANDOUTS: ModuleHandout[] = [
  {
    slug: "first-year-financial-setup",
    filename: "01-first-year-financial-setup",
    title: "Module 1 — First-Year Financial Setup",
    subtitle: "The non-negotiable setup every new business needs in its first 90 days.",
    sections: [
      {
        kind: "intro",
        body: "Most owner-operator pain in year two traces back to something skipped in year one. Use this checklist before you take your first client payment.",
      },
      {
        kind: "checklist",
        title: "Day-one checklist",
        items: [
          "Open a dedicated business checking account (separate from personal).",
          "Apply for an EIN at irs.gov (free, takes 5 minutes).",
          "Set up a payment processor — Stripe or Square for most service businesses.",
          "Pick accounting software: QuickBooks Online, Xero, or Wave (free tier).",
          "Document your starting capital (owner contribution) in your books on day one.",
        ],
      },
      {
        kind: "concepts",
        title: "Concepts to know",
        items: [
          { term: "EIN", def: "Federal tax ID for your business. Required for opening a bank account as anything other than a sole prop." },
          { term: "Commingling", def: "Mixing personal and business funds. The #1 reason single-member LLCs lose liability protection." },
          { term: "Owner contribution", def: "Cash you put into the business; recorded as equity, not income. Never taxed." },
        ],
      },
      {
        kind: "actions",
        title: "Action this week",
        items: [
          "Get your EIN today — it's free and instant.",
          "Open a business bank account in person at a community bank or online via Relay/Mercury.",
          "Move any existing business income out of your personal account and re-deposit through the business account.",
        ],
      },
    ],
  },

  {
    slug: "business-entity",
    filename: "02-business-entity",
    title: "Module 2 — Business Entity",
    subtitle: "LLC vs S-Corp vs C-Corp — pick the right structure for your situation.",
    sections: [
      {
        kind: "intro",
        body: "Entity choice drives liability, tax, and exit. Picking wrong costs you 15.3% on self-employment tax or trapped C-corp profits.",
      },
      {
        kind: "concepts",
        title: "The three structures at a glance",
        items: [
          { term: "Single-member LLC", def: "Default tax: disregarded entity (Schedule C). Best while net profit is under ~$40K." },
          { term: "LLC w/ S-Corp election", def: "Pay yourself a reasonable salary; remaining profit avoids SE tax. Best at $40K+ net." },
          { term: "C-Corp", def: "Flat 21% federal tax; double-taxation on dividends. Right for venture-backed or QSBS plays only." },
        ],
      },
      {
        kind: "checklist",
        title: "S-Corp election checklist",
        items: [
          "Run the numbers: SE tax saved must exceed payroll + 1120-S prep cost.",
          "Document reasonable compensation using BLS comp data for your role.",
          "File Form 2553 within 75 days of election effective date.",
          "Set up payroll (Gusto, Rippling, or QBO Payroll) before you take your first salary.",
        ],
      },
      {
        kind: "actions",
        title: "Action this week",
        items: [
          "Calculate your projected net profit for the year.",
          "If net profit > $40K, schedule a 30-min call to decide on S-Corp election.",
          "File Form 2553 if electing — deadline is March 15 for current-year retroactive.",
        ],
      },
    ],
  },

  {
    slug: "financial-infrastructure",
    filename: "03-financial-infrastructure",
    title: "Module 3 — Financial Infrastructure",
    subtitle: "The stack that makes month-end take 20 minutes instead of 2 days.",
    sections: [
      {
        kind: "intro",
        body: "A clean stack means clean books. A clean book means accurate tax planning, faster lending, and a higher exit multiple.",
      },
      {
        kind: "checklist",
        title: "Your core stack",
        items: [
          "Business checking — Relay (free, multi-account) or community bank.",
          "Business credit card — Amex Business Gold or Chase Ink (rewards + clean expense trail).",
          "Payment processing — Stripe (online) or Square (in-person).",
          "Accounting — QuickBooks Online (most common, easy CPA handoff).",
          "Receipt capture — Dext, Hubdoc, or QBO mobile app.",
          "Payroll (if S-Corp) — Gusto for most. Rippling if you have 5+ employees.",
        ],
      },
      {
        kind: "concepts",
        title: "Concepts to know",
        items: [
          { term: "Bank feed", def: "Direct connection between your bank and accounting software. Auto-pulls transactions daily." },
          { term: "Chart of accounts", def: "The categories your software uses to classify every transaction. Set this up once, correctly." },
          { term: "Bank reconciliation", def: "Matching your software's bank balance to your actual bank statement. Done monthly." },
        ],
      },
      {
        kind: "actions",
        title: "Action this month",
        items: [
          "Open a Relay or community-bank business checking account if you haven't.",
          "Connect bank feeds in QuickBooks. Categorize the last 30 days.",
          "Set a recurring 30-minute monthly close on your calendar.",
        ],
      },
    ],
  },

  {
    slug: "business-financials",
    filename: "04-business-financials",
    title: "Module 4 — Business Financials",
    subtitle: "Read your P&L and balance sheet like a CFO.",
    sections: [
      {
        kind: "intro",
        body: "Three numbers predict whether your business is healthy. Look at them monthly — and you'll never be surprised by a cash crunch or tax bill again.",
      },
      {
        kind: "concepts",
        title: "The three numbers",
        items: [
          { term: "Gross profit margin", def: "(Revenue – COGS) ÷ Revenue. Below 50% for services means pricing problem." },
          { term: "Net profit margin", def: "Net income ÷ Revenue. Service businesses target 15–25%." },
          { term: "Operating cash flow", def: "Net income + non-cash expenses (depreciation, etc.). Should track net income within 10%." },
        ],
      },
      {
        kind: "checklist",
        title: "Monthly financial review",
        items: [
          "Pull P&L for the month and YTD.",
          "Compare actual to prior month and prior year.",
          "Check the balance sheet — A/R aging and cash balance trend.",
          "Flag any expense line that grew >20% without a known reason.",
        ],
      },
      {
        kind: "actions",
        title: "Action this month",
        items: [
          "Run your P&L and balance sheet for last month.",
          "Calculate your gross margin and net margin.",
          "Identify your single largest expense line — is it producing revenue?",
        ],
      },
    ],
  },

  {
    slug: "pay-yourself",
    filename: "05-pay-yourself",
    title: "Module 5 — Pay Yourself",
    subtitle: "Owner draws, salary, distributions — how each is taxed.",
    sections: [
      {
        kind: "intro",
        body: "How you take money out of the business determines how it's taxed. Get this wrong and you'll pay self-employment tax on every dollar — or trigger an IRS reasonable-compensation audit.",
      },
      {
        kind: "concepts",
        title: "Compensation methods by entity",
        items: [
          { term: "Sole prop / SMLLC", def: "Owner draw. Not a deduction. All net profit hits SE tax (15.3%)." },
          { term: "S-Corp", def: "Reasonable W-2 salary + tax-free distributions. Only the salary is subject to payroll tax." },
          { term: "C-Corp", def: "W-2 salary only. Dividends are double-taxed; rarely the right answer." },
        ],
      },
      {
        kind: "checklist",
        title: "Owner-pay rhythm",
        items: [
          "Set a base monthly draw or salary that covers personal expenses.",
          "Run quarterly profit distributions (S-Corp) or quarterly tax estimates (sole prop).",
          "Keep 25–30% of net profit in a tax-reserve account.",
          "Document every payment in your books with a clear memo.",
        ],
      },
      {
        kind: "actions",
        title: "Action this week",
        items: [
          "Calculate your minimum monthly personal need; set that as your base draw/salary.",
          "Open a separate 'Tax Reserve' savings account; sweep 25% of profit each month.",
        ],
      },
    ],
  },

  {
    slug: "payroll-and-contractors",
    filename: "06-payroll-and-contractors",
    title: "Module 6 — Payroll & Contractors",
    subtitle: "W-2 vs 1099 — and the misclassification mistakes that trigger five-figure penalties.",
    sections: [
      {
        kind: "intro",
        body: "Calling someone a 1099 contractor doesn't make them one. The IRS uses a control test — and gets it wrong costs back payroll tax, penalties, and interest.",
      },
      {
        kind: "concepts",
        title: "W-2 vs 1099 control test",
        items: [
          { term: "Behavioral", def: "Do you control how and when they work? W-2 if yes." },
          { term: "Financial", def: "Do you provide tools, equipment, and reimburse expenses? W-2 if yes." },
          { term: "Relationship", def: "Ongoing, exclusive, central to your business? W-2 if yes." },
        ],
      },
      {
        kind: "checklist",
        title: "Contractor onboarding",
        items: [
          "Collect W-9 before first payment.",
          "Have a signed contractor agreement with clear scope and deliverables.",
          "Pay through a method that creates a paper trail (ACH, not Venmo personal).",
          "Issue 1099-NEC by January 31 for anyone paid $600+.",
        ],
      },
      {
        kind: "actions",
        title: "Action this week",
        items: [
          "Audit your current 1099 contractors against the control test.",
          "Confirm you have a W-9 on file for every contractor.",
          "Diary January 31 in your calendar for 1099 filings.",
        ],
      },
    ],
  },

  {
    slug: "sales-tax",
    filename: "07-sales-tax",
    title: "Module 7 — Sales Tax",
    subtitle: "Nexus, collection, remittance — what you actually owe (and don't).",
    sections: [
      {
        kind: "intro",
        body: "Sales tax used to be a brick-and-mortar problem. After South Dakota v. Wayfair, every state can require collection once you cross an economic threshold — typically $100K in sales or 200 transactions.",
      },
      {
        kind: "concepts",
        title: "Key concepts",
        items: [
          { term: "Nexus", def: "The connection between your business and a state that creates a sales-tax filing obligation." },
          { term: "Economic nexus", def: "Sales threshold (commonly $100K or 200 transactions) that triggers nexus without physical presence." },
          { term: "Taxability", def: "Whether your specific product/service is taxable. Services are non-taxable in most states; SaaS is mixed." },
        ],
      },
      {
        kind: "checklist",
        title: "Sales-tax compliance",
        items: [
          "List every state where you've made sales in the last 12 months.",
          "Check each state's economic nexus threshold.",
          "Register in any state where you've crossed nexus.",
          "Use Avalara, TaxJar, or Anrok to automate collection + remittance.",
        ],
      },
      {
        kind: "notes",
        title: "Florida-specific",
        body: "Florida has a 6% state rate plus a discretionary surtax (county-specific, 0.5–2.5%). Services are generally not taxable; tangible goods and certain digital products are.",
      },
    ],
  },

  {
    slug: "tax-deductions",
    filename: "08-tax-deductions",
    title: "Module 8 — Tax Deductions",
    subtitle: "The deductions every new owner qualifies for — with the documentation trail.",
    sections: [
      {
        kind: "intro",
        body: "Deductions don't appear in QuickBooks unless someone tells you to put them there. These are the legitimate, documented deductions most owners miss.",
      },
      {
        kind: "checklist",
        title: "Commonly missed deductions",
        items: [
          "Home office — actual method (sq ft × % of home expenses + depreciation).",
          "Vehicle — mileage log app (MileIQ, TripLog) or actual expense method.",
          "Self-employed health insurance — full premium deductible above the line.",
          "Section 179 — accelerate equipment purchases into year one.",
          "Augusta Rule §280A(g) — rent your home to your S-Corp for up to 14 days/year.",
          "Retirement plan contributions — Solo 401(k), SEP-IRA, defined-benefit.",
        ],
      },
      {
        kind: "concepts",
        title: "Documentation rules",
        items: [
          { term: "Contemporaneous record", def: "Recorded at or near the time of expense. Mileage logs and home office logs must be contemporaneous." },
          { term: "Ordinary and necessary", def: "The IRS standard for deductibility. Industry-typical and helpful to the business." },
          { term: "Substantiation", def: "Receipt, log, or third-party record. Required for any deduction over $75 (and recommended for all)." },
        ],
      },
      {
        kind: "actions",
        title: "Action this month",
        items: [
          "Install a mileage-tracking app and start logging today.",
          "Measure your home office square footage and total home square footage.",
          "Pull a list of all equipment purchases this year — candidates for §179.",
        ],
      },
    ],
  },

  {
    slug: "tax-planning",
    filename: "09-tax-planning",
    title: "Module 9 — Tax Planning",
    subtitle: "Plan your tax during the year, not after it ends.",
    sections: [
      {
        kind: "intro",
        body: "Tax preparation looks backward. Tax planning looks forward. The difference is $10K–$50K a year for owners netting $200K+.",
      },
      {
        kind: "checklist",
        title: "Quarterly tax-planning rhythm",
        items: [
          "Q1 (April): Forecast full-year income; set retirement-plan contribution target.",
          "Q2 (July): Pay Q2 estimate; check S-Corp reasonable comp against actuals.",
          "Q3 (October): Run mid-year projection; decide on equipment / §179 purchases.",
          "Q4 (December): Execute year-end moves (see Module 10).",
        ],
      },
      {
        kind: "concepts",
        title: "Key concepts",
        items: [
          { term: "Safe harbor", def: "Paying 100% of prior-year tax (110% if AGI > $150K) avoids underpayment penalty." },
          { term: "Estimated tax", def: "Quarterly payment of expected federal + state tax. Due April 15, June 15, Sept 15, Jan 15." },
          { term: "Projection model", def: "A simple spreadsheet that projects YTD × annualization factor = full-year tax. Update each quarter." },
        ],
      },
      {
        kind: "actions",
        title: "Action this quarter",
        items: [
          "Build (or update) your full-year tax projection spreadsheet.",
          "Schedule the next 4 quarterly estimate dates on your calendar.",
        ],
      },
    ],
  },

  {
    slug: "year-end-tax-planning",
    filename: "10-year-end-tax-planning",
    title: "Module 10 — Year-End Tax Planning",
    subtitle: "The last-90-day moves that drop your tax bill before December 31.",
    sections: [
      {
        kind: "intro",
        body: "Most year-end tax savings are unrecoverable by January. These are the moves to execute by Dec 31.",
      },
      {
        kind: "checklist",
        title: "Year-end checklist",
        items: [
          "Max retirement contributions (Solo 401(k) employee deferral by Dec 31).",
          "Accelerate deductible expenses — pre-pay vendors, fund §179 purchases.",
          "Defer income — invoice in early January if cash-basis.",
          "Charitable giving — donor-advised fund, appreciated stock, QCD if 70½+.",
          "HSA contribution — max the family limit ($8,550 for 2025).",
          "Document Augusta Rule rentals before year-end.",
        ],
      },
      {
        kind: "concepts",
        title: "Concepts to know",
        items: [
          { term: "Cash vs accrual", def: "Cash-basis taxpayers can shift income by controlling when invoices are sent and paid." },
          { term: "Bonus depreciation", def: "60% expensing on qualifying property in 2024 (down from 100%). Pair with §179 for full first-year write-off." },
          { term: "Donor-advised fund", def: "Bundle multiple years of giving into one year for itemized-deduction threshold." },
        ],
      },
      {
        kind: "actions",
        title: "Action by Dec 31",
        items: [
          "Calendar a 90-min year-end planning session for late October.",
          "Confirm Solo 401(k) plan is established (must exist by Dec 31 of contribution year).",
        ],
      },
    ],
  },

  {
    slug: "health-insurance-and-benefits",
    filename: "11-health-insurance-and-benefits",
    title: "Module 11 — Health Insurance & Benefits",
    subtitle: "Self-employed health insurance, HSA, HRA — benefits that double as tax planning.",
    sections: [
      {
        kind: "intro",
        body: "Health insurance is the largest non-tax expense for most owners. Run it through the business and the tax code refunds 25–37% of every premium.",
      },
      {
        kind: "concepts",
        title: "Key vehicles",
        items: [
          { term: "Self-employed health insurance deduction", def: "Above-the-line deduction for premiums. S-corp owners must have premiums paid by the S-corp and added to W-2 box 1." },
          { term: "HSA", def: "Triple tax-advantaged: deductible going in, tax-free growth, tax-free out for medical. Requires HDHP." },
          { term: "Section 105 HRA", def: "Employer-funded reimbursement of medical expenses. Powerful for spouse-employed C-corps." },
        ],
      },
      {
        kind: "checklist",
        title: "Setup checklist",
        items: [
          "Confirm your plan is HSA-eligible (HDHP) if you want HSA.",
          "Max the HSA family limit ($8,550 in 2025) before year-end.",
          "If S-Corp, have premiums paid by the company and reported in W-2 box 1.",
          "Keep itemized medical receipts in case you ever audit.",
        ],
      },
      {
        kind: "actions",
        title: "Action this month",
        items: [
          "Pull your most recent EOB and confirm HDHP status.",
          "Open an HSA at Fidelity (no fees, low-cost funds).",
        ],
      },
    ],
  },

  {
    slug: "retirement-and-wealth",
    filename: "12-retirement-and-wealth",
    title: "Module 12 — Retirement & Wealth",
    subtitle: "Solo 401(k), SEP-IRA, defined-benefit — what W-2 employees can't touch.",
    sections: [
      {
        kind: "intro",
        body: "The Solo 401(k) is the single most powerful tax shelter available to owner-operators. As an S-corp owner you can stack employee deferrals on top of employer profit-sharing — sheltering $70K+/year.",
      },
      {
        kind: "concepts",
        title: "2025 contribution limits",
        items: [
          { term: "Solo 401(k) employee deferral", def: "$23,500 base + $7,500 catch-up at 50+ = $31,000 max." },
          { term: "Solo 401(k) employer share", def: "25% of W-2 comp (S-corp) or 20% of net SE income. Combined limit $70,000 (or $77,500 with catch-up)." },
          { term: "SEP-IRA", def: "Employer-only. 25% of W-2 / 20% of SE income. Simpler than Solo 401(k); no employee deferral or Roth option." },
          { term: "Defined-benefit plan", def: "Layer on top of Solo 401(k). Can shelter $100K–$300K/yr for owners 50+ at high incomes." },
        ],
      },
      {
        kind: "checklist",
        title: "Setup checklist",
        items: [
          "Choose plan: Solo 401(k) (more flexibility) or SEP-IRA (simpler).",
          "Plan must be established by Dec 31 for current-year contributions.",
          "Set employee deferral election through payroll before year-end.",
          "Watch for Form 5500-EZ filing requirement once assets > $250K.",
        ],
      },
      {
        kind: "actions",
        title: "Action this quarter",
        items: [
          "Open a Solo 401(k) at Fidelity or Schwab (no setup or maintenance fee).",
          "Set your employee deferral through payroll to max out by Dec 31.",
        ],
      },
    ],
  },

  {
    slug: "business-credit-and-financing",
    filename: "13-business-credit-and-financing",
    title: "Module 13 — Business Credit & Financing",
    subtitle: "Build business credit independent of personal credit.",
    sections: [
      {
        kind: "intro",
        body: "Business credit lets you access working capital, equipment financing, and growth lines without giving up equity — and without your personal credit on the line.",
      },
      {
        kind: "checklist",
        title: "Build business credit step-by-step",
        items: [
          "Get a D-U-N-S number from Dun & Bradstreet (free).",
          "Open a business bank account in the legal entity name.",
          "Open trade lines that report to D&B: Uline, Grainger, Quill.",
          "Open a business credit card without PG (Amex Plum, Brex, Ramp).",
          "Pay every account on time for 6 months — the foundation of your PAYDEX score.",
        ],
      },
      {
        kind: "concepts",
        title: "Key concepts",
        items: [
          { term: "PAYDEX score", def: "D&B's 0–100 score of payment timeliness. 80+ = pays on or before due date." },
          { term: "Personal guarantee", def: "You agree to be personally liable if the business defaults. Avoid where possible." },
          { term: "Trade line", def: "A line of credit with a vendor that reports payment history to a business credit bureau." },
        ],
      },
      {
        kind: "actions",
        title: "Action this quarter",
        items: [
          "Register for a D-U-N-S number.",
          "Open one no-PG card (Brex or Ramp) and one trade account (Uline or Quill).",
        ],
      },
    ],
  },

  {
    slug: "asset-protection",
    filename: "14-asset-protection",
    title: "Module 14 — Asset Protection",
    subtitle: "Holding-co + operating-co structure, operating-agreement clauses, insurance layer.",
    sections: [
      {
        kind: "intro",
        body: "Asset protection isn't paranoia — it's the difference between a single lawsuit costing you the business and costing you a deductible. Build it before you need it; you can't reorganize once a claim is filed.",
      },
      {
        kind: "concepts",
        title: "The three-layer model",
        items: [
          { term: "Layer 1 — Insurance", def: "General liability, professional liability (E&O), and umbrella. First line of defense." },
          { term: "Layer 2 — Entity structure", def: "Holding LLC owns operating LLC. Separates valuable assets from liability-exposed operations." },
          { term: "Layer 3 — Operating agreement", def: "Charging-order protection (state-dependent), buyout terms, transfer restrictions." },
        ],
      },
      {
        kind: "checklist",
        title: "Hardening checklist",
        items: [
          "Confirm general liability + umbrella policy in place.",
          "Add E&O / professional liability if you give advice or render expertise.",
          "Review your operating agreement; replace generic LegalZoom templates with attorney-drafted.",
          "Consider Wyoming or Delaware holding LLC for stronger charging-order protection.",
        ],
      },
      {
        kind: "actions",
        title: "Action this quarter",
        items: [
          "Pull copies of every business insurance policy and confirm coverage limits.",
          "Schedule a 1-hour call with an asset-protection attorney if entity restructuring is on the table.",
        ],
      },
    ],
  },

  {
    slug: "business-exit",
    filename: "15-business-exit",
    title: "Module 15 — Business Exit",
    subtitle: "Structure today for a tax-efficient exit tomorrow.",
    sections: [
      {
        kind: "intro",
        body: "Most owners think about exit 6 months out. By then, the tax-efficient moves are already off the table. Plan 3–5 years ahead and you can shave 20–40% off the tax on a sale.",
      },
      {
        kind: "concepts",
        title: "Exit-planning vehicles",
        items: [
          { term: "QSBS §1202", def: "C-corp stock held 5+ years can exclude up to $10M of gain (or 10x basis). Requires C-corp at original issue." },
          { term: "Installment sale §453", def: "Spread gain over multiple years to stay in lower brackets. Note: §453(b)(2) limits on dealer property." },
          { term: "ESOP", def: "Employee Stock Ownership Plan. Defer 100% of gain via §1042 rollover (C-corp only)." },
          { term: "Charitable Remainder Trust", def: "Donate appreciated business interest, take income for life, remainder to charity." },
        ],
      },
      {
        kind: "checklist",
        title: "5-year exit runway",
        items: [
          "Year -5: Decide on exit type (strategic, financial, ESOP, family transfer).",
          "Year -3: Audit books and entity structure. Resolve any tax-position uncertainty.",
          "Year -2: Tighten contracts, document key processes, reduce owner dependence.",
          "Year -1: Engage M&A advisor. Get a valuation. Lock in QSBS holding period.",
          "Year 0: Close on terms you set 5 years ago.",
        ],
      },
      {
        kind: "actions",
        title: "Action this year",
        items: [
          "Decide if a C-corp QSBS structure is worth the cost of operating one for 5+ years.",
          "Get a one-page baseline valuation. Update it annually.",
        ],
      },
    ],
  },
];

export function findHandoutBySlug(slug: string): ModuleHandout | undefined {
  return MODULE_HANDOUTS.find((h) => h.slug === slug);
}
