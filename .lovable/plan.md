## Goal

Wire the quiz → personalized landing → GHL → Smartlead → Stripe → post-payment campaign-switch flow end-to-end.

## Architecture

```
/assessment  ──answers──▶  /enroll?segment=xxx  (dynamic headline/offer)
                                  │
                                  ▼  submit name+email+phone
                          POST /api/public/lead
                                  │
                  ┌───────────────┼───────────────────┐
                  ▼               ▼                   ▼
            Save in DB      GHL webhook         Smartlead API
            (leads)       (contact+opp+tag)    add → Nurture campaign
                                  │
                                  ▼
                       Returns Stripe Checkout URL
                                  │
                                  ▼
                          Stripe Checkout ($149)
                                  │
                                  ▼
                checkout.session.completed webhook
                          /api/public/stripe-webhook
                                  │
                  ┌───────────────┼───────────────────┐
                  ▼               ▼                   ▼
          mark lead paid   GHL webhook again   Smartlead API
                           {event:"purchased"}  pause Nurture +
                           (workflow stops      add to Customer
                            nurture, starts     campaign
                            onboarding)
```

## Steps

### 1. Backend setup (Lovable Cloud)
- Enable Cloud.
- Create `leads` table: `id, email, name, phone, segment, ghl_contact_id, stripe_session_id, status (new|enrolled|paid|failed), created_at, paid_at`. RLS: insert via service role only; no public read.
- Add secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SMARTLEAD_API_KEY`, `SMARTLEAD_NURTURE_CAMPAIGN_ID`, `SMARTLEAD_CUSTOMER_CAMPAIGN_ID`. (GHL webhook URL hardcoded as constant — it's a public webhook trigger.)

### 2. Frontend changes
- `assessment.tsx`: derive a `segment` from answers (e.g. `pre-llc`, `new-owner`, `growing`, `scaling`) and a top "pain" tag. On "See Results" click, navigate to `/enroll?segment=...&pain=...&est=20000` instead of the inline result screen — OR keep result page but link CTA to that URL.
- `enroll.tsx`: read search params; render a personalized headline + sub-pitch + savings number based on segment (4 variants). Form posts to `/api/public/lead`, then redirects browser to the returned Stripe Checkout URL.

### 3. Server routes (`src/routes/api/public/`)
- **`lead.ts`** (POST):
  1. Validate body with Zod (name, email, phone, segment, pain, estimate).
  2. Insert into `leads` (status=`new`).
  3. POST to GHL webhook with `{name,email,phone,segment,pain,estimate,event:"lead_captured"}`.
  4. Smartlead: `POST /api/v1/campaigns/{NURTURE_ID}/leads?api_key=...` to add the lead.
  5. Create Stripe Checkout Session ($149 one-time, `client_reference_id = lead.id`, success_url=`/enroll/success`, cancel_url=`/enroll`).
  6. Update lead with `stripe_session_id`, status=`enrolled`. Return `{checkoutUrl}`.
- **`stripe-webhook.ts`** (POST): verify signature with `STRIPE_WEBHOOK_SECRET`. On `checkout.session.completed`:
  1. Look up lead by `client_reference_id`. Set status=`paid`, `paid_at=now()`.
  2. POST GHL webhook again with `{email,event:"purchased"}` — the user's GHL workflow should branch on this to stop the nurture sequence and start the customer onboarding sequence.
  3. Smartlead: pause/stop the lead in Nurture campaign (`POST /api/v1/leads/{lead_id}/pause-lead`), then add to Customer campaign. (Lookup lead by email first via `GET /api/v1/leads/?email=...`.)
- **Success page** `/enroll/success`: simple confirmation; reuse the existing success state.

### 4. GHL workflow (user-side, documented in chat)
Tell the user their GHL workflow needs two branches keyed off the inbound webhook payload's `event` field:
- `event == "lead_captured"` → create/update contact, create opportunity, start nurture email sequence.
- `event == "purchased"` → stop nurture sequence, move opportunity to "Won", start customer onboarding sequence.

### 5. Smartlead campaign IDs
Ask the user for the two campaign IDs (Nurture pre-purchase, Customer post-purchase) when they paste the API key — the secrets form will collect both as separate secrets.

## Technical notes

- GHL webhook URL: hardcoded constant (`GHL_WEBHOOK_URL`) — it's a public Inbound Webhook trigger, no auth needed.
- Stripe SDK: install `stripe` npm package; use in server routes only via `process.env.STRIPE_SECRET_KEY`.
- Smartlead API base: `https://server.smartlead.ai/api/v1`. Auth via `?api_key=...` query param.
- Webhook URL for Stripe (give user to paste into Stripe dashboard): `https://project--<project-id>.lovable.app/api/public/stripe-webhook`.
- Idempotency: dedupe leads by email (upsert) so a re-submitted form doesn't create duplicate GHL contacts.
- Failure isolation: if GHL or Smartlead call fails, still proceed to Stripe Checkout and log the error — the lead row + Stripe webhook are the source of truth; we can retry external pushes.

## Out of scope (for this pass)

- A real "different course landing page per segment" (the user picked dynamic /enroll content). If they later want truly separate pages, we'd add `/enroll/$segment` routes.
- Smartlead campaign analytics dashboard inside the app.
- Admin view of leads (can be added next).
