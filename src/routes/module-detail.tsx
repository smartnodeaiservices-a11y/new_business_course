import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { AffiliateIntroForm } from "@/components/AffiliateIntroForm";
import {
  COURSE_META,
  COURSE_MODULES,
  findModuleBySlug,
  moduleNeighbors,
} from "@/lib/curriculum";
import { usePageMeta } from "@/lib/page-meta";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export default function ModuleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const m = slug ? findModuleBySlug(slug) : undefined;

  usePageMeta({
    title: m
      ? `Module ${m.number}: ${m.title} — ${COURSE_META.productTitle}`
      : `Module not found — ${COURSE_META.productTitle}`,
    description: m?.summary,
  });

  if (!m) {
    return (
      <section className="max-w-[800px] mx-auto px-6 py-24 text-center">
        <h1 className="mb-3">Module not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find that module. Head back to the curriculum to pick one.
        </p>
        <Link to="/curriculum" className="btn-gold hover:btn-gold-hover">
          See all 15 modules
        </Link>
      </section>
    );
  }

  const { prev, next } = moduleNeighbors(m.slug);
  const hasHandout = m.handoutUrl && !m.handoutUrl.startsWith("REPLACE_WITH_");
  const hasResources = m.resources.length > 0;

  return (
    <>
      {/* Hero / video */}
      <section className="bg-warm-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-12">
          <motion.div {...fadeUp} className="mb-6">
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-navy"
            >
              <ArrowLeft size={14} />
              All 15 modules
            </Link>
          </motion.div>

          <motion.div {...fadeUp} className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <div>
              <p className="eyebrow mb-3 text-gold!">
                Module {String(m.number).padStart(2, "0")} of {COURSE_MODULES.length}
              </p>
              <h1 className="mb-4 text-[clamp(1.75rem,3vw+0.5rem,2.6rem)]! leading-[1.1]!">
                {m.title}
              </h1>
              <p className="text-[16px] text-muted-foreground leading-relaxed">
                {m.summary}
              </p>
            </div>
            <div>
              <VideoEmbed video={m.video} title={`Module ${m.number} — ${m.title}`} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Handout + resources */}
      <section className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-14 md:py-16">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10">
            <motion.div {...fadeUp}>
              <p className="eyebrow mb-3">The handout</p>
              <h2 className="text-[24px]! mb-3">
                Module {m.number} handout
              </h2>
              <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-5">
                The companion handout for this module — checklists, templates, and links
                to the tools and partners we use. Keep it open while you work through the
                video.
              </p>
              {hasHandout ? (
                <a
                  href={m.handoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold hover:btn-gold-hover"
                >
                  <Download size={16} />
                  Open handout
                </a>
              ) : (
                <div className="card-base p-4 bg-gold-subtle text-[13.5px] text-muted-foreground inline-flex items-center gap-2">
                  <FileText size={14} className="text-gold" />
                  Handout uploads with the next batch — check back shortly.
                </div>
              )}
            </motion.div>

            <motion.div {...fadeUp} className="space-y-4">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <p className="eyebrow text-gold!">Tools & partners</p>
                {hasResources && (
                  <span className="text-[11.5px] text-muted-foreground">
                    {m.resources.length}{" "}
                    {m.resources.length === 1 ? "resource" : "resources"}
                  </span>
                )}
              </div>

              {!hasResources && (
                <div className="card-base p-6 bg-white text-[13.5px] text-muted-foreground">
                  Partner links and intros for this module go live once handouts are
                  finalized. Use the contact form if you need a referral in the meantime.
                </div>
              )}

              {m.resources.map((r, i) => {
                if (r.type === "link") {
                  return (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-base p-5 bg-white block hover:border-gold hover:shadow-[0_8px_24px_rgba(11,26,58,0.06)] transition group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <h4 className="m-0! group-hover:text-gold transition-colors">
                              {r.label}
                            </h4>
                            <ExternalLink
                              size={15}
                              className="text-muted-foreground group-hover:text-gold transition-colors shrink-0"
                            />
                          </div>
                          {r.partner && (
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground m-0! mb-1">
                              {r.partner}
                            </p>
                          )}
                          {r.note && (
                            <p className="text-[13.5px] text-muted-foreground leading-relaxed m-0!">
                              {r.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                }
                return (
                  <AffiliateIntroForm
                    key={i}
                    partner={r.partner}
                    affiliateEmail={r.affiliateEmail}
                    source={`module-${m.slug}`}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prev / next */}
      <section className="bg-warm-white border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
          <div className="grid sm:grid-cols-2 gap-3">
            {prev ? (
              <Link
                to={`/modules/${prev.slug}`}
                className="card-base p-5 bg-white hover:border-gold group"
              >
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1 inline-flex items-center gap-1">
                  <ArrowLeft size={11} /> Previous module
                </p>
                <h4 className="m-0! group-hover:text-gold transition-colors">
                  {String(prev.number).padStart(2, "0")} · {prev.title}
                </h4>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={`/modules/${next.slug}`}
                className="card-base p-5 bg-white hover:border-gold group text-right"
              >
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1 inline-flex items-center gap-1">
                  Next module <ArrowRight size={11} />
                </p>
                <h4 className="m-0! group-hover:text-gold transition-colors">
                  {String(next.number).padStart(2, "0")} · {next.title}
                </h4>
              </Link>
            ) : (
              <Link
                to="/cpa-consultation"
                className="card-base p-5 bg-white hover:border-gold group text-right"
              >
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1 inline-flex items-center gap-1">
                  You finished · Next step <ArrowRight size={11} />
                </p>
                <h4 className="m-0! group-hover:text-gold transition-colors">
                  Book a 1:1 CPA consultation
                </h4>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
