import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Reads the publishable key from Vite env. Set VITE_STRIPE_PUBLISHABLE_KEY in .env.
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> | null {
  if (!PUBLISHABLE_KEY) return null;
  if (!stripePromise) stripePromise = loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
}

export type CheckoutLineItem = {
  priceId: string;
  quantity?: number;
};

export type CheckoutOptions = {
  lineItems: CheckoutLineItem[];
  customerEmail?: string;
  successPath?: string; // e.g. "/success"
  cancelPath?: string; // e.g. "/cancel"
};

export class StripeNotConfiguredError extends Error {
  constructor() {
    super(
      "Stripe isn't configured yet. Add VITE_STRIPE_PUBLISHABLE_KEY to .env and a Stripe Price ID to each course in /admin.",
    );
    this.name = "StripeNotConfiguredError";
  }
}

export class StripeNoPriceIdsError extends Error {
  constructor(missingTitles: string[]) {
    super(
      `These courses don't have a Stripe Price ID set yet: ${missingTitles.join(", ")}. Add one in /admin → Courses → Edit.`,
    );
    this.name = "StripeNoPriceIdsError";
  }
}

/**
 * Redirects the user to Stripe Checkout. Uses Stripe's "client-only" mode
 * (no backend required) — we pass Price IDs that admin pre-created in the
 * Stripe Dashboard.
 *
 * If Stripe isn't configured yet, this throws so the caller can fall back
 * gracefully (e.g. show a friendly "we'll be in touch" screen).
 */
export async function redirectToStripeCheckout(options: CheckoutOptions): Promise<void> {
  const stripe = await getStripe();
  if (!stripe) throw new StripeNotConfiguredError();

  const successUrl = `${window.location.origin}${options.successPath ?? "/success"}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${window.location.origin}${options.cancelPath ?? "/cancel"}`;

  // `redirectToCheckout` is in maintenance mode (still supported at runtime, removed
  // from @stripe/stripe-js v9 types). For a future-proof setup, create checkout sessions
  // via a Supabase Edge Function and redirect to `session.url`.
  type LegacyRedirect = (opts: {
    lineItems: { price: string; quantity: number }[];
    mode: "payment";
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
  }) => Promise<{ error?: { message?: string } }>;

  const redirect = (stripe as unknown as { redirectToCheckout: LegacyRedirect }).redirectToCheckout;
  const { error } = await redirect({
    lineItems: options.lineItems.map((li) => ({ price: li.priceId, quantity: li.quantity ?? 1 })),
    mode: "payment",
    successUrl,
    cancelUrl,
    customerEmail: options.customerEmail,
  });

  if (error) throw new Error(error.message ?? "Stripe checkout failed.");
}

export function isStripeConfigured(): boolean {
  return !!PUBLISHABLE_KEY;
}
