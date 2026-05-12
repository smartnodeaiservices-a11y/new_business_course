import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowRight,
  Clock,
  Users,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  listCourses,
  formatPrice,
  CATEGORY_LABEL,
  LEVEL_LABEL,
  type Course,
  type CourseCategory,
  type CourseLevel,
} from "@/integrations/supabase/courses";
import { FALLBACK_COURSES } from "@/lib/fallback-courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { BuyCourseButton } from "@/components/BuyCourseButton";
import { usePageMeta } from "@/lib/page-meta";

type SortMode = "featured" | "price-asc" | "price-desc" | "duration-asc";

const CATEGORY_FILTERS: { value: CourseCategory | "all"; label: string }[] = [
  { value: "all", label: "All courses" },
  { value: "bundle", label: "Bundles" },
  { value: "foundations", label: "Foundations" },
  { value: "tax", label: "Tax Strategy" },
  { value: "operations", label: "Operations" },
  { value: "protection", label: "Asset Protection" },
  { value: "exit", label: "Exit Planning" },
];

const LEVEL_FILTERS: { value: CourseLevel | "all"; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
  { value: "duration-asc", label: "Shortest first" },
];

export default function CoursesPage() {
  usePageMeta({
    title: "All Courses — New Business Course",
    description:
      "Browse the full catalog of CPA-built courses on tax strategy, entity setup, payroll, asset protection, and exit planning.",
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: listCourses,
    staleTime: 5 * 60 * 1000,
  });

  const list = courses && courses.length > 0 ? courses : FALLBACK_COURSES;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CourseCategory | "all">("all");
  const [level, setLevel] = useState<CourseLevel | "all">("all");
  const [sort, setSort] = useState<SortMode>("featured");

  const filtered = useMemo(() => {
    let out = list.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q),
      );
    }
    if (category !== "all") {
      out = out.filter((c) => c.category === category);
    }
    if (level !== "all") {
      out = out.filter((c) => c.level === level || c.level === "all");
    }
    switch (sort) {
      case "price-asc":
        out.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price-desc":
        out.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "duration-asc":
        out.sort((a, b) => a.duration_hours - b.duration_hours);
        break;
      case "featured":
      default:
        out.sort((a, b) => {
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return a.position - b.position;
        });
    }
    return out;
  }, [list, query, category, level, sort]);

  const bundle = filtered.find((c) => c.category === "bundle");
  const otherCourses = filtered.filter((c) => c.category !== "bundle");
  const hasActiveFilters = query !== "" || category !== "all" || level !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setLevel("all");
    setSort("featured");
  }

  return (
    <>
      {/* Page header */}
      <section className="bg-linear-to-b from-white to-warm-white border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="eyebrow mb-3">All Courses</p>
            <h1 className="mb-4">Every course we offer, in one place.</h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed">
              {list.length} self-paced courses built by a 20+ year practicing CPA. Filter by
              category or level to find the right course for your business — or grab the all-access
              bundle.
            </p>
          </motion.div>

          {/* Search + Sort row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-8 flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses…"
                className="input-base focus:input-base-focus pl-10 pr-4 py-3! text-[15px]!"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-surface flex items-center justify-center text-muted-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 bg-white border border-border rounded-[10px] px-3 py-2 min-w-[200px]">
              <SlidersHorizontal size={14} className="text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="flex-1 bg-transparent border-0 outline-none text-[14px] font-medium text-navy cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Category filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {CATEGORY_FILTERS.map((f) => {
              const active = category === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setCategory(f.value)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all border ${
                    active
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-muted-foreground border-border hover:border-navy hover:text-navy"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </motion.div>

          {/* Level filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-3 flex flex-wrap gap-2 items-center"
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mr-1">
              Level:
            </span>
            {LEVEL_FILTERS.map((f) => {
              const active = level === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setLevel(f.value)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all border ${
                    active
                      ? "bg-gold text-navy border-gold"
                      : "bg-transparent text-muted-foreground border-border hover:border-gold hover:text-navy"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 text-[12px] font-semibold text-muted-foreground hover:text-navy inline-flex items-center gap-1 transition-colors"
              >
                <X size={12} />
                Clear filters
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[13px] text-muted-foreground">
            Showing <strong className="text-navy">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "course" : "courses"}
            {hasActiveFilters && " matching your filters"}
          </p>
          <Link to="/intake" className="btn-ghost hover:btn-ghost-hover">
            Not sure? Get a plan
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured bundle row (if matched) */}
        {bundle && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <BundleHighlight course={bundle} />
          </motion.div>
        )}

        {/* Courses grid */}
        {otherCourses.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {otherCourses.map((c) => (
              <motion.div
                key={c.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
                  },
                }}
                whileHover={{ y: -4 }}
                transition={{ y: { duration: 0.25 } }}
              >
                <CourseCard course={c} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          !bundle && (
            <div className="card-base p-12 text-center max-w-md mx-auto">
              <BookOpen size={32} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">No courses match your filters.</h3>
              <p className="text-[14px] text-muted-foreground mb-5">
                Try clearing some filters or searching with different keywords.
              </p>
              <button onClick={clearFilters} className="btn-outline hover:btn-outline-hover">
                Clear all filters
              </button>
            </div>
          )
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-warm-white border-t border-border">
        <div className="max-w-[900px] mx-auto px-6 py-16 text-center">
          <p className="eyebrow mb-3">Not sure which one?</p>
          <h2 className="mb-4">Take the 60-second intake.</h2>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto mb-7 leading-relaxed">
            Tell us about your business and we'll recommend the right courses — personalized to your
            stage, structure, and top priority.
          </p>
          <Link to="/intake" className="btn-gold hover:btn-gold-hover">
            Find my plan
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="card-base hover:card-hover p-2.5 block group h-full"
    >
      <CourseThumbnail
        category={course.category}
        title={course.title}
        level={LEVEL_LABEL[course.level]}
        size="md"
      />
      <div className="px-3 py-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gold">
            {CATEGORY_LABEL[course.category]}
          </span>
          <span className="text-border">·</span>
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <Clock size={11} />
            {course.duration_hours}h
          </span>
          <span className="text-border">·</span>
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <Users size={11} />
            {course.module_count} modules
          </span>
        </div>
        <h3 className="mb-1.5 group-hover:text-gold transition-colors">{course.title}</h3>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 min-h-[42px]">
          {course.subtitle}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
          <div className="flex items-baseline gap-2">
            {course.original_price_cents && (
              <span className="text-[13px] text-muted-foreground line-through tabular-nums">
                {formatPrice(course.original_price_cents)}
              </span>
            )}
            <span className="text-[20px] font-bold text-navy tabular-nums leading-none">
              {formatPrice(course.price_cents)}
            </span>
          </div>
          <BuyCourseButton
            course={course}
            source="courses-list-card"
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-gold text-navy hover:bg-gold/90 inline-flex items-center gap-1 transition-colors"
          >
            Buy
            <ArrowRight size={12} />
          </BuyCourseButton>
        </div>
      </div>
    </Link>
  );
}

function BundleHighlight({ course }: { course: Course }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy text-white p-6 md:p-8 border-2 border-gold">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold opacity-[0.08] blur-3xl translate-x-1/3 -translate-y-1/3" />
      </div>
      <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-navy bg-gold px-3 py-1 rounded-full mb-4">
            <Sparkles size={12} />
            Best Value · All-Access Bundle
          </span>
          <h2 className="text-white! mb-3">{course.title}</h2>
          <p className="text-white/75 text-[15.5px] leading-relaxed mb-5 max-w-xl">
            {course.subtitle} Pay once, get every course we offer plus every future update.
          </p>
          <div className="flex flex-wrap items-baseline gap-3 mb-6">
            {course.original_price_cents && (
              <span className="text-[18px] text-white/40 line-through tabular-nums">
                {formatPrice(course.original_price_cents)}
              </span>
            )}
            <span className="text-[36px] font-bold text-gold tabular-nums leading-none">
              {formatPrice(course.price_cents)}
            </span>
            {course.original_price_cents && (
              <span className="text-[12px] font-semibold uppercase tracking-widest text-(--gold)/80 bg-(--gold)/10 border border-(--gold)/30 px-2.5 py-1 rounded">
                Save {formatPrice(course.original_price_cents - course.price_cents)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BuyCourseButton
              course={course}
              source="courses-list-bundle"
              className="btn-gold hover:btn-gold-hover"
            >
              Buy bundle now
              <ArrowRight size={14} />
            </BuyCourseButton>
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold hover:text-white transition-colors"
            >
              View details
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <CourseThumbnail
            category={course.category}
            title={course.title}
            level="All access"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
