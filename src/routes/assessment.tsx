import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { deriveSegment, derivePain, SEGMENT_CONTENT } from "@/lib/segments";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Free Business Assessment — 60 Seconds" },
      { name: "description", content: "Three quick questions. We'll show you where your business is leaking money — and what's next." },
      { property: "og:title", content: "Free Business Assessment" },
      { property: "og:description", content: "Personalized year-1 savings estimate based on your stage." },
    ],
  }),
  component: AssessmentPage,
});

const questions = [
  {
    q: "Where are you in your business journey?",
    options: [
      "Just registered my LLC",
      "Operating less than 1 year",
      "1–3 years in business",
      "3+ years and growing",
    ],
  },
  {
    q: "What's your biggest financial worry right now?",
    options: [
      "Paying too much in taxes",
      "Not understanding my numbers",
      "Setting up payroll & contractors correctly",
      "Protecting what I've built",
    ],
  },
  {
    q: "How are you handling your finances today?",
    options: [
      "DIY — spreadsheets and hope",
      "A bookkeeper but no tax planner",
      "A CPA at year-end only",
      "Year-round CPA + advisor",
    ],
  },
];

function AssessmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const done = step >= questions.length;

  const select = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  };

  if (done) {
    const segment = deriveSegment(answers[0] ?? 1);
    const pain = derivePain(answers[1] ?? 0);
    return <Result segment={segment} pain={pain} onRetake={() => { setAnswers([null, null, null]); setStep(0); }} onContinue={() => navigate({ to: "/enroll", search: { segment, pain } })} />;
  }

  const q = questions[step];
  const selected = answers[step];

  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <p className="eyebrow mb-3">Free Business Assessment</p>
      <h1 className="text-[32px] sm:text-[44px] text-center max-w-xl mb-2">
        Tell us where you are. <em className="font-light text-[var(--gold)]">We'll show you what's next.</em>
      </h1>
      <p className="text-[var(--muted-foreground)] text-center text-[15px] mb-10">
        3 questions · 60 seconds · Personalized results
      </p>

      <div className="w-full max-w-[560px] h-1 bg-[var(--surface)] rounded-full overflow-hidden mb-8">
        <div className="h-full bg-[var(--gold)] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white border border-[var(--surface)] rounded-lg p-8 max-w-[560px] w-full mb-6">
        <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--gold)] font-semibold mb-3">
          Question {step + 1} of {questions.length}
        </p>
        <h2 className="text-[24px] mb-7 text-[var(--navy)]">{q.q}</h2>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const sel = selected === i;
            return (
              <button
                key={opt}
                onClick={() => select(i)}
                className={`flex items-center gap-4 text-left px-5 py-3.5 rounded-md border-2 transition-colors ${
                  sel
                    ? "border-[var(--navy)] bg-[var(--gold-tint)]"
                    : "border-[var(--surface)] bg-[var(--warm-white)] hover:border-[var(--gold)] hover:bg-[var(--gold-subtle)]"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                    sel ? "bg-[var(--navy)] border-[var(--navy)] text-white" : "border-[var(--muted-foreground)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[15px] text-[var(--foreground)]">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between w-full max-w-[560px]">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-[13px] text-[var(--muted-foreground)] disabled:opacity-30 hover:text-[var(--navy)]"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep((s) => s + 1)}
          disabled={selected === null}
          className="btn-navy disabled:opacity-30 disabled:cursor-not-allowed !py-3 !px-8"
        >
          {step === questions.length - 1 ? "See Results" : "Continue →"}
        </button>
      </div>
    </section>
  );
}

function Result({
  segment,
  pain,
  onRetake,
  onContinue,
}: {
  segment: keyof typeof SEGMENT_CONTENT;
  pain: string;
  onRetake: () => void;
  onContinue: () => void;
}) {
  const c = SEGMENT_CONTENT[segment];
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="inline-block bg-[var(--gold-tint)] border border-[var(--gold)] rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--alert)] mb-5">
        {c.eyebrow}
      </span>
      <h1 className="font-display italic font-thin text-[40px] sm:text-[54px] leading-[1.1] max-w-xl mb-4">
        Your year-1 savings potential
      </h1>
      <p className="text-[var(--muted-foreground)] max-w-md mb-8">
        Based on your stage and the CPA-documented strategies most relevant to you.
      </p>

      <div className="bg-[var(--navy)] rounded-lg px-10 py-7 mb-8 max-w-sm w-full">
        <p className="text-[10px] tracking-[0.14em] uppercase text-white/40 mb-1">Estimated savings</p>
        <p className="font-display font-light text-[56px] text-[var(--gold)] leading-none">{c.estimate}</p>
        <p className="text-[12px] text-white/40 mt-2">In the first 12 months.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-10 max-w-md">
        {c.focusModules.map((t) => (
          <span key={t} className="bg-[var(--surface)] rounded text-[13px] px-3.5 py-1.5 text-[var(--navy)] font-medium">
            {t}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onContinue} className="btn-primary hover:btn-primary-hover">See Your Personalized Plan →</button>
        <button onClick={onRetake} className="inline-flex items-center justify-center px-6 py-4 text-[14px] font-semibold tracking-[0.06em] uppercase text-[var(--navy)] border border-[var(--navy)]/20 rounded-md hover:bg-white">
          Retake Quiz
        </button>
      </div>
      <p className="sr-only">Top focus: {pain}</p>
    </section>
  );
}
