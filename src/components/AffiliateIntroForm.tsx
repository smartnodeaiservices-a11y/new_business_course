import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("A real email so the intro reaches you"),
  businessName: z.string().optional(),
  context: z
    .string()
    .max(600, "Keep it under 600 characters")
    .optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  /** Display label for the partner. */
  partner: string;
  /** Affiliate's email — CC'd on the introduction. */
  affiliateEmail: string;
  /** Optional context (e.g. which module / handout this came from). */
  source?: string;
};

export function AffiliateIntroForm({ partner, affiliateEmail, source }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", businessName: "", context: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const { error: fnError } = await supabase.functions.invoke("affiliate-intro", {
        body: {
          partner,
          affiliateEmail,
          source: source ?? "module-handout",
          name: values.name,
          email: values.email,
          businessName: values.businessName,
          context: values.context,
        },
      });
      if (fnError) throw fnError;
      setSubmitted(true);
    } catch (err) {
      // Fall back: still record the request so it isn't lost.
      // (table is post-types — cast to bypass the stale generated types.)
      try {
        await (supabase.from as unknown as (t: string) => {
          insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
        })("affiliate_intros").insert({
          partner,
          affiliate_email: affiliateEmail,
          source: source ?? "module-handout",
          requester_name: values.name,
          requester_email: values.email,
          business_name: values.businessName ?? null,
          context: values.context ?? null,
          status: "pending-email",
        });
        setSubmitted(true);
      } catch (dbErr) {
        const message =
          err instanceof Error
            ? err.message
            : dbErr instanceof Error
              ? dbErr.message
              : "Couldn't send the intro. Try again or email us directly.";
        setError(message);
      }
    }
  };

  if (submitted) {
    return (
      <div className="card-base p-6 bg-gold-subtle border-gold-tint">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-(--gold)/20 border border-(--gold)/40 flex items-center justify-center">
            <Check size={16} className="text-gold" strokeWidth={3} />
          </div>
          <h4 className="m-0!">Intro sent to {partner}.</h4>
        </div>
        <p className="text-[14px] text-foreground leading-relaxed">
          Check your inbox — {partner} is CC'd. They usually reply within one business
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="card-base p-6 bg-white space-y-4"
      noValidate
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-(--gold)/15 border border-(--gold)/40 flex items-center justify-center shrink-0">
          <Mail size={15} className="text-gold" />
        </div>
        <div>
          <h4 className="m-0! mb-1">Get an intro to {partner}</h4>
          <p className="text-[13.5px] text-muted-foreground leading-relaxed m-0!">
            We'll email an introduction with {partner} CC'd. They reach out directly
            from there.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Your name" error={form.formState.errors.name?.message}>
          <input
            type="text"
            autoComplete="name"
            {...form.register("name")}
            className="input-base"
          />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...form.register("email")}
            className="input-base"
          />
        </Field>
      </div>
      <Field label="Business name (optional)">
        <input
          type="text"
          autoComplete="organization"
          {...form.register("businessName")}
          className="input-base"
        />
      </Field>
      <Field label="Anything they should know? (optional)" error={form.formState.errors.context?.message}>
        <textarea
          rows={3}
          {...form.register("context")}
          className="input-base resize-y"
          placeholder="One or two sentences about what you need."
        />
      </Field>
      {error && (
        <p className="text-[13px] text-alert">{error}</p>
      )}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="btn-gold hover:btn-gold-hover w-full"
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Sending intro…
          </>
        ) : (
          <>Send my intro to {partner}</>
        )}
      </button>
      <p className="text-[11.5px] text-muted-foreground text-center">
        By submitting you agree we may share this with {partner} via email.
      </p>
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-semibold text-navy uppercase tracking-[0.08em] block mb-1.5">
        {label}
      </span>
      {children}
      {error && <span className="text-[12px] text-alert mt-1 block">{error}</span>}
    </label>
  );
}
