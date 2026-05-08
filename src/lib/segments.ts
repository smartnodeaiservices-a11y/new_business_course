// Segment derivation from assessment answers.
// Q0 = stage, Q1 = pain, Q2 = current finance setup.

export type Segment = "pre-llc" | "new-owner" | "growing" | "scaling";
export type Pain = "taxes" | "numbers" | "payroll" | "protection";

export const SEGMENT_CONTENT: Record<
  Segment,
  {
    eyebrow: string;
    headline: string;
    headlineEm: string;
    subhead: string;
    estimate: string;
    bullets: string[];
    focusModules: string[];
  }
> = {
  "pre-llc": {
    eyebrow: "For Founders Just Getting Started",
    headline: "Set up your business",
    headlineEm: "the right way — from day one.",
    subhead:
      "Skip the $5,000 mistakes most new owners make. Get the entity, EIN, and tax setup that protects you and saves thousands before you even open the doors.",
    estimate: "$8,000–$15,000",
    bullets: [
      "Choose the right entity (LLC, S-Corp, or C-Corp) for your situation",
      "EIN, operating agreement, and bank setup — done correctly the first time",
      "Bookkeeping foundation that scales with you",
      "Tax elections that lock in savings from year one",
    ],
    focusModules: ["Entity Structure", "EIN & Setup", "Bookkeeping 101", "Tax Elections"],
  },
  "new-owner": {
    eyebrow: "For Owners in Year One",
    headline: "Stop overpaying.",
    headlineEm: "Start keeping what you earn.",
    subhead:
      "You're past the launch — but the IRS is still taking too much. Fix payroll, deductions, and tax planning before April catches you off guard.",
    estimate: "$12,000–$22,000",
    bullets: [
      "S-Corp election + reasonable salary calculation (huge first-year win)",
      "Pay yourself the right way — owner's draw vs. payroll",
      "Quarterly estimates so you never owe a surprise",
      "Every deduction the IRS lets you take — documented",
    ],
    focusModules: ["S-Corp Election", "Pay Yourself", "Quarterly Taxes", "Deductions"],
  },
  growing: {
    eyebrow: "For Growing Businesses",
    headline: "Your numbers are growing.",
    headlineEm: "Your tax bill shouldn't.",
    subhead:
      "Revenue is up. Margins feel tight. The Playbook shows you exactly where profit is leaking — and how to plug it before year-end.",
    estimate: "$20,000–$35,000",
    bullets: [
      "Advanced entity strategies (S-Corp, holding co., real estate LLC)",
      "Retirement plans that double as massive tax shields",
      "Hire contractors vs. employees — the right call, every time",
      "Cash-flow systems CPAs charge $5K to install",
    ],
    focusModules: ["Entity Strategy", "Retirement Plans", "Contractors & Payroll", "Cash Flow"],
  },
  scaling: {
    eyebrow: "For Established Owners",
    headline: "Protect what you've built.",
    headlineEm: "Compound it.",
    subhead:
      "At your stage, every percentage point matters. Asset protection, multi-entity planning, and exit strategy — the moves that turn a business into wealth.",
    estimate: "$30,000–$80,000+",
    bullets: [
      "Multi-entity & holding company structures",
      "Asset protection — separate the operating risk from your wealth",
      "Advanced retirement: Solo 401(k), defined benefit, cash balance",
      "Exit & succession planning that minimizes tax on the sale",
    ],
    focusModules: ["Asset Protection", "Holding Co.", "Advanced Retirement", "Exit Planning"],
  },
};

export const PAIN_LABEL: Record<Pain, string> = {
  taxes: "Lower your tax bill",
  numbers: "Understand your numbers",
  payroll: "Payroll & contractors",
  protection: "Protect what you've built",
};

export function deriveSegment(stageIdx: number): Segment {
  // Q0 options: 0=Just registered, 1=<1yr, 2=1–3yr, 3=3+yr
  return (["pre-llc", "new-owner", "growing", "scaling"] as const)[stageIdx] ?? "new-owner";
}

export function derivePain(painIdx: number): Pain {
  return (["taxes", "numbers", "payroll", "protection"] as const)[painIdx] ?? "taxes";
}
