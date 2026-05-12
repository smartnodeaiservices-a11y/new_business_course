import { supabase } from "@/integrations/supabase/client";

// Frontend only needs the publishable key to know whether Stripe is wired up.
// The secret key lives ONLY in Supabase Edge Function secrets — never in this repo.
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

export type CheckoutLineItem = {
  /** Ad-hoc line item built from the DB. */
  name: string;
  amountCents: number;
  description?: string;
  currency?: string;
  quantity?: number;
  /** Optional pre-defined Stripe price (overrides amount/name when present). */
  priceId?: string;
};

export type CheckoutOptions = {
  lineItems: CheckoutLineItem[];
  customerEmail?: string;
  successPath?: string; // e.g. "/success"
  cancelPath?: string; // e.g. "/cancel"
  metadata?: Record<string, string>;
};

export class StripeNotConfiguredError extends Error {
  constructor() {
    super(
      "Stripe isn't configured yet. Add VITE_STRIPE_PUBLISHABLE_KEY to .env and deploy the create-checkout-session Edge Function.",
    );
    this.name = "StripeNotConfiguredError";
  }
}

/**
 * Calls the `create-checkout-session` Edge Function and redirects the browser
 * to the returned Stripe Checkout URL. The Edge Function holds the secret key
 * and builds line items from the database prices.
 */
export async function redirectToStripeCheckout(options: CheckoutOptions): Promise<void> {
  if (!PUBLISHABLE_KEY) throw new StripeNotConfiguredError();

  const successUrl = `${window.location.origin}${options.successPath ?? "/success"}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${window.location.origin}${options.cancelPath ?? "/cancel"}`;

  const { data, error } = await supabase.functions.invoke<{ url?: string; error?: string }>(
    "create-checkout-session",
    {
      body: {
        lineItems: options.lineItems.map((li) => ({
          priceId: li.priceId,
          name: li.name,
          amountCents: li.amountCents,
          description: li.description,
          currency: li.currency ?? "usd",
          quantity: li.quantity ?? 1,
        })),
        customerEmail: options.customerEmail,
        successUrl,
        cancelUrl,
        metadata: options.metadata,
      },
    },
  );

  if (error) throw new Error(error.message ?? "Failed to create Stripe Checkout session.");
  if (!data?.url) throw new Error(data?.error ?? "Stripe Checkout session returned no URL.");

  window.location.assign(data.url);
}

export function isStripeConfigured(): boolean {
  return !!PUBLISHABLE_KEY;
}
