// ============================================================================
// NEW BUSINESS COURSE — CURRICULUM
// ============================================================================
// Single source of truth for the 15-module course + intro overview.
//
// HOW TO UPDATE VIDEOS EACH YEAR (e.g. 2026 -> 2027):
//   1. Upload the new video to Google Drive and copy the share link.
//   2. The share URL looks like:
//        https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
//      Copy the <FILE_ID> portion.
//   3. Update the `video` field below for the relevant module.
//   4. Update `videoUpdatedYear` so the UI can show "Updated for 2027".
//
// The same `video` field accepts:
//   - A bare Google Drive file ID (preferred, e.g. "1Qq-80kexYciCPY3kiTOTaogqKGuxWB69")
//   - A full Google Drive URL (we'll parse the ID out)
//   - A full YouTube / Vimeo / GHL embed URL (rendered as-is in iframe)
//
// HOW TO UPDATE A HANDOUT:
//   - Update the `handoutUrl` (Google Drive share link or PDF URL).
//   - Update the `resources` array — each entry is either a direct affiliate
//     link (`type: "link"`) or a gated intro webform (`type: "webform"`).
// ============================================================================

export type CourseResource =
  /** Direct affiliate / partner link — opens in a new tab. */
  | {
      type: "link";
      label: string;
      url: string;
      partner?: string;
      note?: string;
    }
  /** Email-intro webform — submitter is introduced to the affiliate via email.
   *  The affiliate is CC'd on the email so they can pick up the conversation. */
  | {
      type: "webform";
      label: string;
      partner: string;
      affiliateEmail: string;
      note?: string;
    };

export type CourseModule = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  /** Google Drive file ID OR full embed URL. See header comment for format. */
  video: string;
  /** Where the downloadable handout PDF lives (Google Drive share link is fine). */
  handoutUrl?: string;
  /** Affiliate links + webforms that ship with the handout. */
  resources: CourseResource[];
};

export type CourseIntro = {
  title: string;
  summary: string;
  video: string;
};

// ============================================================================
// COURSE METADATA
// ============================================================================
export const COURSE_META = {
  brand: "New Business Course",
  productTitle: "The New Business Blueprint",
  price: "$149",
  priceCents: 14900,
  videoUpdatedYear: 2026,
  guarantee: "30-day money-back guarantee",
  moduleCount: 15,
} as const;

// ============================================================================
// INTRO / OVERVIEW VIDEO (separate from the 15 modules)
// ============================================================================
export const COURSE_INTRO: CourseIntro = {
  title: "Course Overview",
  summary:
    "A short walkthrough of how the course is structured, what to expect from each module, and the order most owners follow. Watch this first.",
  // TODO: replace with the real intro video file ID once uploaded.
  video: "REPLACE_WITH_INTRO_VIDEO_ID",
};

// ============================================================================
// THE 15 MODULES (sequential order recommended, not required)
// ============================================================================
export const COURSE_MODULES: CourseModule[] = [
  {
    slug: "first-year-financial-setup",
    number: 1,
    title: "First-Year Financial Setup",
    summary:
      "The non-negotiable financial setup every new business needs in its first 90 days: business bank, books, payment processing, and the paperwork the IRS expects.",
    video: "REPLACE_WITH_MODULE_01_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_01_HANDOUT_URL",
    resources: [
      // Examples — replace with real affiliate links / webforms as they're confirmed.
      // {
      //   type: "link",
      //   label: "Open a Relay business bank account",
      //   partner: "Relay",
      //   url: "https://relayfi.com/?ref=newbusinesscourse",
      // },
      // {
      //   type: "webform",
      //   label: "Get an intro to our preferred bookkeeper",
      //   partner: "Aspire Bookkeeping",
      //   affiliateEmail: "partners@aspire-bookkeeping.example",
      // },
    ],
  },
  {
    slug: "business-entity",
    number: 2,
    title: "Business Entity",
    summary:
      "LLC vs S-Corp vs C-Corp — how to pick the right entity for your situation, when to elect S-Corp, and the filings that go with each.",
    video: "REPLACE_WITH_MODULE_02_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_02_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "financial-infrastructure",
    number: 3,
    title: "Financial Infrastructure",
    summary:
      "Bank accounts, credit cards, payment processors, and accounting software — the stack that makes month-end take 20 minutes instead of 2 days.",
    video: "REPLACE_WITH_MODULE_03_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_03_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "business-financials",
    number: 4,
    title: "Business Financials",
    summary:
      "Read your P&L and balance sheet like a CFO. The three numbers that actually predict whether your business is healthy.",
    video: "REPLACE_WITH_MODULE_04_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_04_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "pay-yourself",
    number: 5,
    title: "Pay Yourself",
    summary:
      "Owner draws, salary, distributions — how each is taxed and the cash-flow rhythm that keeps you (and the IRS) happy.",
    video: "REPLACE_WITH_MODULE_05_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_05_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "payroll-and-contractors",
    number: 6,
    title: "Payroll & Contractors",
    summary:
      "When to W-2 vs 1099, payroll setup, and the misclassification mistakes that trigger five-figure penalties.",
    video: "REPLACE_WITH_MODULE_06_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_06_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "sales-tax",
    number: 7,
    title: "Sales Tax",
    summary:
      "Nexus, collection, remittance — what you actually owe (and don't), state by state, with the Florida-specific guidance.",
    video: "REPLACE_WITH_MODULE_07_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_07_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "tax-deductions",
    number: 8,
    title: "Tax Deductions",
    summary:
      "The deductions every new owner qualifies for — and the documentation trail you need to keep them on audit.",
    video: "REPLACE_WITH_MODULE_08_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_08_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "tax-planning",
    number: 9,
    title: "Tax Planning",
    summary:
      "Quarterly tax-planning rhythm. Plan your tax during the year, not after it ends.",
    video: "REPLACE_WITH_MODULE_09_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_09_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "year-end-tax-planning",
    number: 10,
    title: "Year-End Tax Planning",
    summary:
      "The last-90-day moves — equipment purchases, retirement contributions, charitable giving — that drop your tax bill before December 31.",
    video: "REPLACE_WITH_MODULE_10_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_10_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "health-insurance-and-benefits",
    number: 11,
    title: "Health Insurance & Benefits",
    summary:
      "Self-employed health insurance deduction, HSA, HRA, and the benefits structures that double as tax planning.",
    video: "REPLACE_WITH_MODULE_11_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_11_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "retirement-and-wealth",
    number: 12,
    title: "Retirement & Wealth",
    summary:
      "Solo 401(k), SEP-IRA, defined-benefit plans — the retirement vehicles W-2 employees can't touch and how much you can actually defer.",
    video: "REPLACE_WITH_MODULE_12_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_12_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "business-credit-and-financing",
    number: 13,
    title: "Business Credit & Financing",
    summary:
      "Build business credit independent of your personal credit, then use it for working capital, equipment, and growth without giving up equity.",
    video: "REPLACE_WITH_MODULE_13_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_13_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "asset-protection",
    number: 14,
    title: "Asset Protection",
    summary:
      "Holding-co + operating-co structure, the operating agreement clauses that matter in litigation, and the insurance layer that fills the gap.",
    video: "REPLACE_WITH_MODULE_14_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_14_HANDOUT_URL",
    resources: [],
  },
  {
    slug: "business-exit",
    number: 15,
    title: "Business Exit",
    summary:
      "Structure today for a tax-efficient exit tomorrow — QSBS §1202, installment sales, succession, and the 5-year runway most owners need.",
    video: "REPLACE_WITH_MODULE_15_VIDEO_ID",
    handoutUrl: "REPLACE_WITH_MODULE_15_HANDOUT_URL",
    resources: [],
  },
];

// ============================================================================
// CPA CONSULTATION — the only paid add-on
// ============================================================================
export const CPA_CONSULTATION = {
  title: "1-on-1 CPA Consultation",
  subtitle: "60 minutes with a licensed CPA — your business, your questions.",
  priceCents: 20000,
  priceLabel: "$200",
  unit: "per hour",
  description:
    "Course not enough? Book a one-hour session with a licensed CPA from our team to apply the modules directly to your business. We'll review your numbers, your entity, and your tax plan — and leave you with a one-page action list.",
  bullets: [
    "60-minute video call — same day scheduling when available",
    "Licensed CPA, not a sales call",
    "Review your entity, books, and tax position",
    "Leave with a written action list",
  ],
  /** Stripe one-off price — set in Supabase Edge Function or pass amount-based. */
  stripePriceId: undefined as string | undefined,
} as const;

// ============================================================================
// HELPERS
// ============================================================================
export function findModuleBySlug(slug: string): CourseModule | undefined {
  return COURSE_MODULES.find((m) => m.slug === slug);
}

export function moduleNeighbors(slug: string): {
  prev?: CourseModule;
  next?: CourseModule;
} {
  const idx = COURSE_MODULES.findIndex((m) => m.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? COURSE_MODULES[idx - 1] : undefined,
    next: idx < COURSE_MODULES.length - 1 ? COURSE_MODULES[idx + 1] : undefined,
  };
}

/**
 * Parses a video field into the right iframe `src`. Accepts:
 *   - bare Google Drive file ID  -> drive preview embed
 *   - drive.google.com URL       -> drive preview embed
 *   - youtube.com / youtu.be URL -> youtube embed
 *   - vimeo.com URL              -> vimeo embed
 *   - any other URL              -> returned as-is (GHL, Wistia, etc.)
 */
export function videoSrc(video: string): string {
  if (!video || video.startsWith("REPLACE_WITH_")) return "";
  // Already a full URL
  if (/^https?:\/\//i.test(video)) {
    // Google Drive
    const drive = video.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
    // YouTube
    const yt =
      video.match(/youtu\.be\/([^?&]+)/) ||
      video.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    // Vimeo
    const vimeo = video.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return video;
  }
  // Assume bare Google Drive file ID
  return `https://drive.google.com/file/d/${video}/preview`;
}
