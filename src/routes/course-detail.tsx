import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  PlayCircle,
  Users,
  Shield,
  Download,
  Infinity as InfinityIcon,
} from "lucide-react";
import {
  getCourseBySlug,
  formatPrice,
  CATEGORY_LABEL,
  LEVEL_LABEL,
} from "@/integrations/supabase/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { VideoEmbed } from "@/components/VideoEmbed";
import { BuyCourseButton } from "@/components/BuyCourseButton";
import { usePageMeta } from "@/lib/page-meta";

const INCLUDES = [
  { icon: PlayCircle, label: "Self-paced video lessons" },
  { icon: Download, label: "Downloadable CPA handouts" },
  { icon: InfinityIcon, label: "Lifetime access + updates" },
  { icon: Shield, label: "30-day money-back guarantee" },
];

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug ?? ""),
    enabled: !!slug,
  });

  usePageMeta({
    title: course ? `${course.title} — New Business Course` : "Course",
    description: course?.subtitle,
  });

  if (isLoading) {
    return (
      <section className="max-w-[1100px] mx-auto px-6 py-20">
        <p className="text-[14px] text-muted-foreground">Loading course…</p>
      </section>
    );
  }

  if (isError || !course) {
    return (
      <section className="max-w-[760px] mx-auto px-6 py-20 text-center">
        <h1 className="mb-4">Course not found</h1>
        <p className="text-[15px] text-muted-foreground mb-6">
          We couldn't find a course at <code>/{slug}</code>. It may have been moved or renamed.
        </p>
        <Link to="/" className="btn-outline hover:btn-outline-hover">
          <ArrowLeft size={14} />
          Back to all courses
        </Link>
      </section>
    );
  }

  const totalMinutes = course.modules.reduce((s, m) => s + (m.duration_min ?? 0), 0);

  return (
    <article>
      {/* Hero */}
      <section className="bg-linear-to-b from-white to-warm-white border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-navy mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            All courses
          </Link>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold bg-gold-subtle border border-gold-tint px-2.5 py-1 rounded">
                  {CATEGORY_LABEL[course.category]}
                </span>
                <span className="chip-muted">{LEVEL_LABEL[course.level]}</span>
                <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1">
                  <Clock size={12} />
                  {course.duration_hours}h
                </span>
                <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1">
                  <Users size={12} />
                  {course.module_count} {course.module_count === 1 ? "module" : "modules"}
                </span>
              </div>

              <h1 className="mb-4">{course.title}</h1>
              <p className="text-[19px] text-muted-foreground leading-relaxed mb-8 max-w-xl">
                {course.subtitle}
              </p>

              {course.description && (
                <p className="text-[16px] text-foreground leading-relaxed mb-8 max-w-xl">
                  {course.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <BuyCourseButton
                  course={course}
                  source="course-detail-hero"
                  className="btn-gold hover:btn-gold-hover"
                >
                  Enroll now · {formatPrice(course.price_cents)}
                  <ArrowRight size={16} />
                </BuyCourseButton>
                <Link to="/intake" className="btn-outline hover:btn-outline-hover">
                  Not sure? Take the intake
                </Link>
              </div>
              <p className="text-[12px] text-muted-foreground">
                30-day money-back guarantee · Lifetime access · Stripe & PayPal accepted
              </p>
            </div>

            {/* Right rail — sticky purchase card */}
            <aside className="lg:sticky lg:top-24">
              <div className="card-base p-3 overflow-hidden">
                <CourseThumbnail
                  category={course.category}
                  title={course.title}
                  level={LEVEL_LABEL[course.level]}
                  size="lg"
                />
                <div className="px-4 pt-5 pb-3">
                  <div className="flex items-baseline gap-3 mb-1">
                    {course.original_price_cents && (
                      <span className="text-[15px] text-muted-foreground line-through tabular-nums">
                        {formatPrice(course.original_price_cents)}
                      </span>
                    )}
                    <span className="text-[32px] font-bold text-navy tabular-nums leading-none">
                      {formatPrice(course.price_cents)}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground mb-5">
                    One-time payment · No subscription
                  </p>
                  <BuyCourseButton
                    course={course}
                    source="course-detail-sidebar"
                    className="btn-gold hover:btn-gold-hover w-full mb-4"
                  >
                    Enroll now
                    <ArrowRight size={16} />
                  </BuyCourseButton>
                  <ul className="space-y-2.5 pt-4 border-t border-border">
                    {INCLUDES.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li
                          key={item.label}
                          className="flex items-center gap-3 text-[13.5px] text-foreground"
                        >
                          <Icon size={16} className="text-gold shrink-0" />
                          {item.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Preview video */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-10 pt-16">
        <div className="max-w-2xl mb-8">
          <p className="eyebrow mb-3">Course Preview</p>
          <h2 className="mb-3">Watch a quick walkthrough.</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            See how the course is structured and what you'll learn before you enroll.
          </p>
        </div>
        <VideoEmbed
          fileId="1Qq-80kexYciCPY3kiTOTaogqKGuxWB69"
          title={`${course.title} — Preview`}
        />
      </section>

      {/* Outcomes */}
      {course.outcomes && course.outcomes.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
            <div>
              <p className="eyebrow mb-3">What You'll Learn</p>
              <h2 className="mb-3">Outcomes you can apply this week.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Each outcome maps to a specific module and ships with a step-by-step action item you
                can implement immediately.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {course.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 text-[15px] text-foreground leading-relaxed"
                >
                  <div className="w-6 h-6 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={13} className="text-gold" strokeWidth={3} />
                  </div>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Curriculum */}
      <section className="bg-warm-white border-y border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-3">Curriculum</p>
            <h2 className="mb-3">
              {course.modules.length} {course.modules.length === 1 ? "module" : "modules"}
              {totalMinutes > 0 && ` · ~${Math.round(totalMinutes / 60)}h`}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Each module is a self-contained playbook: video lessons, downloadable handouts, and
              action items.
            </p>
          </div>

          {course.modules.length > 0 ? (
            <div className="space-y-3">
              {course.modules.map((m, i) => (
                <div
                  key={m.id}
                  className="card-base px-6 py-5 grid grid-cols-[auto_1fr_auto] gap-5 items-center"
                >
                  <span className="text-[26px] font-bold text-gold tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="mb-1">{m.title}</h4>
                    {m.description && (
                      <p className="text-[14px] text-muted-foreground leading-relaxed">
                        {m.description}
                      </p>
                    )}
                  </div>
                  {m.duration_min && (
                    <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1 whitespace-nowrap">
                      <Clock size={12} />
                      {m.duration_min} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-muted-foreground italic">Curriculum coming soon.</p>
          )}
        </div>
      </section>

      {/* Who this is for */}
      {course.who_for && course.who_for.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="eyebrow mb-3">Who This Is For</p>
              <h2 className="mb-3">Built for owners at this stage.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Not sure if it's right for you? Take the intake — we'll recommend the exact courses
                for your business.
              </p>
              <Link to="/intake" className="btn-outline hover:btn-outline-hover">
                Take the intake
                <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="space-y-3">
              {course.who_for.map((w) => (
                <li
                  key={w}
                  className="card-base px-5 py-4 flex items-start gap-3 text-[14.5px] text-foreground"
                >
                  <Users size={18} className="text-gold shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-navy text-white">
        <div className="max-w-[900px] mx-auto px-6 py-20 text-center">
          <p className="eyebrow mb-3 text-gold!">Ready to start?</p>
          <h2 className="text-white mb-5">Get started with {course.title}.</h2>
          <p className="text-white/70 text-[15px] max-w-xl mx-auto mb-8 leading-relaxed">
            Lifetime access. CPA handouts. 30-day money-back guarantee — uncover at least $2,000 in
            savings or get your money back.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BuyCourseButton
              course={course}
              source="course-detail-footer"
              className="btn-gold hover:btn-gold-hover"
            >
              Enroll now · {formatPrice(course.price_cents)}
              <ArrowRight size={16} />
            </BuyCourseButton>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] border border-white/20 text-white text-[14px] font-semibold hover:bg-white/5 transition-colors"
            >
              See all courses
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
