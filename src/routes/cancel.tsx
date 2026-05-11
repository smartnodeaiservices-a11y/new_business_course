import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { usePageMeta } from "@/lib/page-meta";

export default function CancelPage() {
  usePageMeta({ title: "Checkout cancelled" });

  return (
    <section className="max-w-[640px] mx-auto px-6 py-16 md:py-24 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-border mb-6"
      >
        <Info size={32} className="text-muted-foreground" strokeWidth={2} />
      </motion.div>

      <h1 className="mb-3">No worries — checkout cancelled.</h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-8">
        Your card wasn't charged. Your intake answers and recommended plan are still saved — pick up
        where you left off whenever you're ready.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/intake" className="btn-gold hover:btn-gold-hover">
          Back to my plan
          <ArrowRight size={16} />
        </Link>
        <Link to="/" className="btn-outline hover:btn-outline-hover">
          <ArrowLeft size={14} />
          Browse all courses
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-border text-left">
        <h4 className="mb-3">Had a question before paying?</h4>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          We're happy to talk through which course fits your business. Most replies within a few
          hours.
        </p>
        <Link
          to="/contact"
          className="text-[14px] font-semibold text-navy hover:text-gold inline-flex items-center gap-1.5"
        >
          Contact us
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
