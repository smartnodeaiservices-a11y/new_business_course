import { useState, type ReactNode, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirectToStripeCheckout, isStripeConfigured } from "@/lib/stripe";
import { readLead, writeLead, persistLeadToSupabase, isValidEmail, type Lead } from "@/lib/lead";
import { formatPrice } from "@/integrations/supabase/courses";

type BuyableCourse = {
  slug: string;
  title: string;
  subtitle?: string;
  price_cents: number;
  stripe_price_id?: string | null;
};

type Props = {
  course: BuyableCourse;
  className?: string;
  children: ReactNode;
  /** Source label for lead tracking (e.g. "course-detail", "courses-list"). */
  source?: string;
};

/**
 * Renders a button that opens a minimal email-capture modal and then
 * redirects to Stripe Checkout for this specific course. The price comes
 * from the course's DB row — no pre-defined Stripe products needed.
 */
export function BuyCourseButton({ course, className, children, source = "buy-button" }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const saved = typeof window !== "undefined" ? readLead() : null;
  const [name, setName] = useState(saved?.name ?? "");
  const [email, setEmail] = useState(saved?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isStripeConfigured()) {
      // Take them to the enroll page, which shows a clear config error.
      navigate(`/enroll?course=${encodeURIComponent(course.slug)}`);
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const lead: Lead = { name: trimmedName, email: trimmedEmail, phone: "" };
    setSubmitting(true);
    try {
      writeLead(lead);
      // Best-effort lead capture — never blocks checkout.
      await persistLeadToSupabase(lead, { source: `${source}:${course.slug}` });

      await redirectToStripeCheckout({
        lineItems: [
          {
            name: course.title,
            description: course.subtitle,
            amountCents: course.price_cents,
            priceId: course.stripe_price_id ?? undefined,
          },
        ],
        customerEmail: trimmedEmail,
        successPath: "/success",
        cancelPath: "/cancel",
        metadata: { course_slug: course.slug, source },
      });
      // redirectToStripeCheckout navigates the browser away; we won't reach here.
    } catch (err) {
      console.error("[buy]", err);
      setError(
        err instanceof Error ? err.message : "Couldn't start checkout. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      <Dialog open={open} onOpenChange={(v) => !submitting && setOpen(v)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Buy {course.title}</DialogTitle>
            <DialogDescription>
              {formatPrice(course.price_cents)} · One-time payment · 30-day money-back guarantee
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="buy-name">Full name</Label>
              <Input
                id="buy-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                disabled={submitting}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buy-email">Email</Label>
              <Input
                id="buy-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                autoComplete="email"
                disabled={submitting}
                required
              />
              <p className="text-[12px] text-muted-foreground">
                We'll send your receipt and course access here.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 text-[13px] text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2"
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold hover:btn-gold-hover w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting to secure checkout…
                </>
              ) : (
                <>Continue to payment · {formatPrice(course.price_cents)}</>
              )}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Powered by Stripe · Your card details never touch our servers.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
