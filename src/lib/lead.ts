// Lightweight lead persistence — keeps the user's contact info across
// route transitions so they don't re-enter it after the intake.
// Stored in sessionStorage so it clears when the tab closes.

import { supabase } from "@/integrations/supabase/client";

export type Lead = {
  name: string;
  email: string;
  phone: string;
};

const STORAGE_KEY = "nbc:lead";

export function readLead(): Lead | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Lead>;
    if (!parsed.name || !parsed.email) return null;
    return {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone ?? "",
    };
  } catch {
    return null;
  }
}

export function writeLead(lead: Lead): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
  } catch {
    // Storage may be disabled — non-fatal.
  }
}

export function clearLead(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Best-effort insert into the leads table. Never throws — if Supabase
 * is unreachable or the lead already exists, we just continue.
 *
 * Also fires the GHL push (contact upsert + opportunity in the "New Lead"
 * stage) so the lead lands in the CRM the moment they share an email.
 * The Edge Function is idempotent — repeat calls for the same email
 * update the contact but don't create duplicate opportunities.
 */
export async function persistLeadToSupabase(
  lead: Lead,
  extra: { segment?: string; pain?: string; source?: string } = {},
): Promise<void> {
  try {
    // Plain insert; the leads table has a unique index on lower(email).
    // Duplicate-email errors are non-fatal — we just continue.
    const { error } = await supabase.from("leads").insert({
      email: lead.email.trim(),
      name: lead.name.trim(),
      phone: lead.phone.trim() || null,
      segment: extra.segment ?? null,
      pain: extra.pain ?? null,
      status: "new",
    });
    if (error && !/duplicate|already exists|unique/i.test(error.message)) {
      console.warn("[lead] persist skipped:", error.message);
    }
  } catch (err) {
    console.warn("[lead] persist skipped:", err);
  }

  // Mirror to GHL — fire-and-forget. The Edge Function dedupes server-side.
  try {
    await supabase.functions.invoke("push-to-ghl", {
      body: {
        email: lead.email.trim(),
        name: lead.name.trim(),
        phone: lead.phone.trim() || null,
        source: extra.source ?? "intake",
        status: "new",
        extraTags: [
          ...(extra.source ? [`source:${extra.source}`] : []),
          ...(extra.segment ? [`segment:${extra.segment}`] : []),
        ],
      },
    });
  } catch (err) {
    console.warn("[ghl] push skipped:", err);
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
