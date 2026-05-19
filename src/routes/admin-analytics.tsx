import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RefreshCw,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  changeAdminPassword,
  fetchAdminAnalytics,
  type AnalyticsLead,
  type AnalyticsReferral,
  type AnalyticsConversion,
  type AnalyticsTotals,
} from "@/integrations/supabase/analytics";
import { usePageMeta } from "@/lib/page-meta";

// Storage key for the active admin password (kept after a successful login).
const TOKEN_KEY = "nbc_admin_token";
// Initial default password — also set in the SQL migration. Use this on first
// login, then rotate via the "Change password" button in the dashboard.
const DEFAULT_PASSWORD = "New2026";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card-base p-5 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center">
          <Icon size={16} className="text-gold" />
        </div>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-[26px] font-bold text-navy tabular-nums leading-none mb-1">
        {value}
      </p>
      {sub && (
        <p className="text-[12px] text-muted-foreground leading-tight">{sub}</p>
      )}
    </div>
  );
}

// Password input with a show/hide eye toggle. Reused across the gate and
// the change-password modal so behavior + styling stay consistent.
function PasswordField({
  value,
  onChange,
  autoFocus,
  placeholder,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  id?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-lg pl-4 pr-11 py-2.5 text-[14px] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-navy transition-colors"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function PasswordGate({ onSubmit }: { onSubmit: (t: string) => void }) {
  // Never pre-fill or display the default password — surface only a generic
  // hint. The default lives in the SQL migration and can be rotated from
  // inside once the user is in.
  const [password, setPassword] = useState("");
  void DEFAULT_PASSWORD; // referenced for documentation; not displayed.
  return (
    <div className="max-w-md mx-auto">
      <div className="card-base p-7 bg-white text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mb-4">
          <KeyRound size={20} className="text-gold" />
        </div>
        <h2 className="text-[22px]! mb-2">Admin login</h2>
        <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-5">
          Enter the analytics password to continue.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = password.trim();
            if (v) {
              localStorage.setItem(TOKEN_KEY, v);
              onSubmit(v);
            }
          }}
          className="space-y-3 text-left"
        >
          <PasswordField
            value={password}
            onChange={setPassword}
            autoFocus
            placeholder="Password"
          />
          <button
            type="submit"
            className="btn-gold hover:btn-gold-hover w-full"
          >
            Open dashboard
            <ArrowUpRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({
  currentPassword,
  onClose,
  onSuccess,
}: {
  currentPassword: string;
  onClose: () => void;
  onSuccess: (newPassword: string) => void;
}) {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-md p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-warm-white flex items-center justify-center text-muted-foreground"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mb-4">
          <Lock size={18} className="text-gold" />
        </div>
        <h2 className="text-[20px]! mb-1">Change admin password</h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Pick something only you know. Minimum 4 characters.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (next !== confirm) {
              toast.error("Passwords don't match.");
              return;
            }
            if (next.trim().length < 4) {
              toast.error("Password must be at least 4 characters.");
              return;
            }
            try {
              setBusy(true);
              await changeAdminPassword(currentPassword, next.trim());
              toast.success("Password updated.");
              onSuccess(next.trim());
              onClose();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Update failed.");
            } finally {
              setBusy(false);
            }
          }}
          className="space-y-3"
        >
          <div>
            <label
              htmlFor="new-password"
              className="block text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-1.5"
            >
              New password
            </label>
            <PasswordField
              id="new-password"
              value={next}
              onChange={setNext}
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-1.5"
            >
              Confirm new password
            </label>
            <PasswordField
              id="confirm-password"
              value={confirm}
              onChange={setConfirm}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="btn-gold hover:btn-gold-hover w-full disabled:opacity-60"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-[0.06em] bg-emerald-50 border border-emerald-200 text-emerald-700">
      <CheckCircle2 size={11} />
      Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-[0.06em] bg-amber-50 border border-amber-200 text-amber-700">
      <Clock size={11} />
      Unpaid
    </span>
  );
}

function LeadsTable({
  leads,
  conversions,
}: {
  leads: AnalyticsLead[];
  conversions: AnalyticsConversion[];
}) {
  // Build referrer-by-email map so each lead can show who referred them.
  // We match referee_email (when present) against the lead's email.
  const referredBy = new Map<string, { code: string; product: string | null }>();
  for (const c of conversions) {
    if (c.referee_email) {
      referredBy.set(c.referee_email.toLowerCase(), {
        code: c.referral_code,
        product: c.product,
      });
    }
  }

  if (leads.length === 0) {
    return (
      <div className="card-base p-8 bg-white text-center text-[14px] text-muted-foreground">
        No leads yet. Form submissions will appear here.
      </div>
    );
  }

  return (
    <div className="card-base bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px]">
          <thead className="bg-warm-white text-[11.5px] uppercase tracking-[0.06em] text-muted-foreground font-bold">
            <tr>
              <th className="text-left px-4 py-3">Lead</th>
              <th className="text-left px-4 py-3">Segment</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Course / product</th>
              <th className="text-left px-4 py-3">Referred by</th>
              <th className="text-right px-4 py-3">Est. value</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const ref = l.email ? referredBy.get(l.email.toLowerCase()) : undefined;
              return (
                <tr
                  key={l.id}
                  className="border-t border-border hover:bg-warm-white/50 transition-colors"
                >
                  <td className="px-4 py-3 align-top">
                    <p className="font-semibold text-navy text-[13.5px]">
                      {l.name || "—"}
                    </p>
                    <p className="text-[12px] text-muted-foreground">{l.email}</p>
                    {l.phone && (
                      <p className="text-[11.5px] text-muted-foreground">{l.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-[12.5px] text-muted-foreground">
                    {l.segment || "—"}
                    {l.pain && (
                      <p className="text-[11.5px] text-muted-foreground/80 mt-0.5">
                        Pain: {l.pain}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge paid={Boolean(l.paid_at)} />
                    {l.paid_at && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {formatDate(l.paid_at)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-[12.5px] text-foreground">
                    {ref?.product || (l.paid_at ? "foundations-playbook" : "—")}
                  </td>
                  <td className="px-4 py-3 align-top text-[12.5px]">
                    {ref ? (
                      <code className="bg-gold-subtle border border-gold-tint text-navy px-1.5 py-0.5 rounded text-[11.5px] font-semibold">
                        {ref.code}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">Direct</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-right tabular-nums">
                    {l.estimate ? formatCurrency(l.estimate * 100) : "—"}
                  </td>
                  <td className="px-4 py-3 align-top text-[12.5px] text-muted-foreground whitespace-nowrap">
                    {formatDate(l.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReferralsTable({
  referrals,
  conversions,
}: {
  referrals: AnalyticsReferral[];
  conversions: AnalyticsConversion[];
}) {
  if (referrals.length === 0) {
    return (
      <div className="card-base p-8 bg-white text-center text-[14px] text-muted-foreground">
        No referrals yet. Codes show up here as soon as someone claims one at
        /refer.
      </div>
    );
  }

  // Group conversions under each referral code so we can show the referees.
  const byCode = new Map<string, AnalyticsConversion[]>();
  for (const c of conversions) {
    const arr = byCode.get(c.referral_code) ?? [];
    arr.push(c);
    byCode.set(c.referral_code, arr);
  }

  return (
    <div className="space-y-4">
      {referrals.map((r) => {
        const list = byCode.get(r.code) ?? [];
        return (
          <div key={r.code} className="card-base bg-white overflow-hidden">
            <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-4 bg-warm-white border-b border-border">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Referrer
                </p>
                <p className="font-semibold text-navy text-[15px]">
                  {r.owner_name || r.owner_email}
                </p>
                <p className="text-[12.5px] text-muted-foreground">
                  {r.owner_email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Code
                </p>
                <code className="bg-gold-subtle border border-gold-tint text-navy px-2 py-0.5 rounded text-[13px] font-bold">
                  {r.code}
                </code>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Conversions
                </p>
                <p className="text-[20px] font-bold text-navy tabular-nums leading-none">
                  {r.count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Earned
                </p>
                <p className="text-[20px] font-bold text-gold tabular-nums leading-none">
                  {formatCurrency(r.total_earned_cents)}
                </p>
              </div>
            </div>

            {list.length > 0 ? (
              <table className="w-full text-[13px]">
                <thead className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground font-bold">
                  <tr>
                    <th className="text-left px-5 py-2.5">Referee</th>
                    <th className="text-left px-5 py-2.5">Product</th>
                    <th className="text-right px-5 py-2.5">Amount</th>
                    <th className="text-left px-5 py-2.5">Status</th>
                    <th className="text-left px-5 py-2.5 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-5 py-2.5">
                        <p className="font-semibold text-navy">
                          {c.referee_name || "—"}
                        </p>
                        <p className="text-[11.5px] text-muted-foreground">
                          {c.referee_email || "—"}
                        </p>
                      </td>
                      <td className="px-5 py-2.5 text-muted-foreground">
                        {c.product || "—"}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums">
                        {c.amount_cents != null
                          ? formatCurrency(c.amount_cents)
                          : "—"}
                      </td>
                      <td className="px-5 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-[0.06em] ${
                            c.status === "paid" || c.status === "confirmed"
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                              : c.status === "refunded"
                                ? "bg-rose-50 border border-rose-200 text-rose-700"
                                : "bg-amber-50 border border-amber-200 text-amber-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-muted-foreground whitespace-nowrap">
                        {formatDate(c.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-5 py-6 text-[13px] text-muted-foreground text-center">
                No conversions on this code yet.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  usePageMeta({
    title: "Analytics · Admin · New Business Course",
    description: "Leads, paid status, referrers, and conversions.",
  });

  const [token, setToken] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-analytics", token],
    queryFn: () => fetchAdminAnalytics(token as string),
    enabled: Boolean(token),
    retry: false,
    staleTime: 30_000,
  });

  // If the token was rejected, wipe it so the gate reappears.
  useEffect(() => {
    if (isError && error instanceof Error && error.message === "UNAUTHORIZED") {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }
  }, [isError, error]);

  return (
    <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-12">
      <header className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Admin · Analytics</p>
            <h1 className="mb-2">Leads, payments, and referrers.</h1>
            <p className="text-[14.5px] text-muted-foreground max-w-2xl">
              Every form submission, every paid checkout, and every referral —
              pulled in one round-trip from Supabase. Data refreshes on demand.
            </p>
          </div>
          {token && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="btn-outline hover:btn-outline-hover min-h-0! py-2! px-3.5! text-[13px]!"
              >
                <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="btn-outline hover:btn-outline-hover min-h-0! py-2! px-3.5! text-[13px]!"
              >
                <Lock size={13} />
                Change password
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(TOKEN_KEY);
                  setToken(null);
                }}
                className="text-[12.5px] text-muted-foreground hover:text-navy transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <Toaster richColors position="top-right" />

      {!token && <PasswordGate onSubmit={(t) => setToken(t)} />}

      {token && showChangePassword && (
        <ChangePasswordModal
          currentPassword={token}
          onClose={() => setShowChangePassword(false)}
          onSuccess={(next) => {
            localStorage.setItem(TOKEN_KEY, next);
            setToken(next);
          }}
        />
      )}

      {token && isLoading && (
        <div className="card-base p-12 bg-white text-center text-[14px] text-muted-foreground">
          Loading analytics…
        </div>
      )}

      {token && isError && error instanceof Error && error.message !== "UNAUTHORIZED" && (
        <div className="card-base p-6 bg-rose-50 border-rose-200 text-rose-800 text-[14px]">
          <p className="font-semibold mb-1">Couldn't load analytics</p>
          <p className="text-[13px]">{error.message}</p>
        </div>
      )}

      {token && data && <Dashboard {...data} />}
    </section>
  );
}

function Dashboard({
  totals,
  leads,
  referrals,
  conversions,
}: {
  totals: AnalyticsTotals;
  leads: AnalyticsLead[];
  referrals: AnalyticsReferral[];
  conversions: AnalyticsConversion[];
}) {
  return (
    <div className="space-y-10">
      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total leads"
          value={totals.total_leads.toLocaleString()}
          sub={`${totals.leads_last_7d} new this week`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Paid"
          value={totals.paid_leads.toLocaleString()}
          sub={
            totals.total_leads > 0
              ? `${Math.round((totals.paid_leads / totals.total_leads) * 100)}% conversion`
              : "0% conversion"
          }
        />
        <StatCard
          icon={Wallet}
          label="Self-reported value"
          value={formatCurrency(totals.estimated_value_cents)}
          sub="From paid leads' intake estimate"
        />
        <StatCard
          icon={ArrowUpRight}
          label="Referrers"
          value={totals.referrers.toLocaleString()}
          sub={`${totals.referral_conversions} conversions · ${formatCurrency(totals.referral_revenue_cents)} from referrals`}
        />
      </div>

      {/* Leads */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px]!">Leads</h2>
          <p className="text-[12.5px] text-muted-foreground">
            {leads.length} most recent
          </p>
        </div>
        <LeadsTable leads={leads} conversions={conversions} />
      </div>

      {/* Referrers */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px]!">Referrers & conversions</h2>
          <p className="text-[12.5px] text-muted-foreground">
            Ordered by total conversions
          </p>
        </div>
        <ReferralsTable referrals={referrals} conversions={conversions} />
      </div>
    </div>
  );
}
