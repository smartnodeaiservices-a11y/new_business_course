import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Star,
  ChevronDown,
  ChevronRight,
  Save,
  Settings,
  Info,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  listCoursesWithModules,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  CATEGORY_LABEL,
  LEVEL_LABEL,
  formatPrice,
  type CourseWithModules,
  type CourseCategory,
  type CourseLevel,
} from "@/integrations/supabase/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import {
  createOption,
  createQuestion,
  deleteOption,
  deleteQuestion,
  listQuestionsWithOptions,
  updateOption,
  updateQuestion,
  type Option,
  type QuestionKind,
  type QuestionWithOptions,
} from "@/integrations/supabase/assessment";
import { usePageMeta } from "@/lib/page-meta";

export default function AdminPage() {
  usePageMeta({
    title: "Admin · New Business Course",
    description: "Manage courses, modules, and intake questions.",
  });

  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-12">
      <Toaster richColors position="top-right" />

      <header className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>
        <p className="eyebrow mb-2">Admin Dashboard</p>
        <h1 className="mb-2">Manage courses & intake.</h1>
        <p className="text-[15px] text-muted-foreground max-w-2xl">
          Edit your course catalog, manage curriculum modules, and tune the business intake
          questions. Changes go live immediately.
        </p>
      </header>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="bg-surface! p-1! rounded-xl! mb-8 h-auto!">
          <TabsTrigger
            value="courses"
            className="px-6! py-2.5! text-[14px]! font-semibold! data-[state=active]:bg-white! data-[state=active]:shadow-sm! rounded-lg!"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger
            value="intake"
            className="px-6! py-2.5! text-[14px]! font-semibold! data-[state=active]:bg-white! data-[state=active]:shadow-sm! rounded-lg!"
          >
            Intake Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
        <TabsContent value="intake">
          <IntakeTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}

// ===== Courses Tab =====

function CoursesTab() {
  const qc = useQueryClient();
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: listCoursesWithModules,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-courses"] });
    qc.invalidateQueries({ queryKey: ["courses"] });
  };

  const addCourse = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course added");
      invalidate();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  const courseList = courses ?? [];
  const totalCount = courseList.length;
  const featuredCount = courseList.filter((c) => c.featured).length;
  const missingPriceIds = courseList.filter(
    (c) => c.category !== "bundle" && !c.stripe_price_id,
  ).length;

  return (
    <>
      {isError && (
        <div className="card-base p-5 mb-6 bg-gold-subtle border-gold-tint flex items-start gap-3">
          <Info size={18} className="text-gold shrink-0 mt-0.5" />
          <div className="text-[13.5px] text-navy">
            <p className="font-semibold mb-0.5">Database not yet connected to the catalog table.</p>
            <p className="text-muted-foreground leading-relaxed">
              Apply{" "}
              <code className="text-[12px] bg-white px-1.5 py-0.5 rounded">
                20260511180000_courses_catalog.sql
              </code>{" "}
              to start managing courses here. Until then your site shows example courses from the
              fallback list.
            </p>
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden mb-8">
        <StatCard label="Total courses" value={String(totalCount)} />
        <StatCard label="Featured" value={String(featuredCount)} />
        <StatCard
          label="Missing Stripe Price ID"
          value={String(missingPriceIds)}
          warn={missingPriceIds > 0}
        />
        <StatCard
          label="Stripe ready"
          value={totalCount === 0 ? "—" : missingPriceIds === 0 ? "Yes" : "Partial"}
        />
      </div>

      <AddCourseForm
        nextPosition={courseList.length}
        onSubmit={(input) => addCourse.mutate(input)}
        pending={addCourse.isPending}
      />

      {isLoading && <p className="mt-8 text-[14px] text-muted-foreground">Loading courses…</p>}

      {!isLoading && courseList.length === 0 && !isError && (
        <div className="mt-8 card-base p-8 text-center">
          <h3 className="mb-2">No courses yet.</h3>
          <p className="text-[14px] text-muted-foreground">
            Add your first course using the form above.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {courseList.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i, duration: 0.3 }}
          >
            <CourseRow course={c} onAnyChange={invalidate} />
          </motion.div>
        ))}
      </div>
    </>
  );
}

function StatCard({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="bg-white px-5 py-5">
      <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={`text-[22px] font-bold tabular-nums leading-none ${warn ? "text-alert" : "text-navy"}`}
      >
        {value}
      </p>
    </div>
  );
}

const CATEGORY_VALUES: CourseCategory[] = [
  "foundations",
  "tax",
  "operations",
  "protection",
  "exit",
  "bundle",
];
const LEVEL_VALUES: CourseLevel[] = ["beginner", "intermediate", "advanced", "all"];

function AddCourseForm({
  nextPosition,
  onSubmit,
  pending,
}: {
  nextPosition: number;
  onSubmit: (input: Parameters<typeof createCourse>[0]) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<CourseCategory>("foundations");
  const [level, setLevel] = useState<CourseLevel>("beginner");
  const [priceDollars, setPriceDollars] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !title.trim() || !priceDollars.trim()) return;
    onSubmit({
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle.trim() || title.trim(),
      category,
      level,
      price_cents: Math.round(Number(priceDollars) * 100),
      position: nextPosition,
    });
    setSlug("");
    setTitle("");
    setSubtitle("");
    setCategory("foundations");
    setLevel("beginner");
    setPriceDollars("");
    setOpen(false);
  };

  return (
    <div className="card-base p-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-subtle border border-gold-tint flex items-center justify-center">
            <Plus size={18} className="text-gold" />
          </div>
          <div>
            <h3>Add a new course</h3>
            <p className="text-[13px] text-muted-foreground">
              Set the basics here — add curriculum modules after creating.
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-4">
          <Field label="Title">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Foundations Playbook"
              className="input-base focus:input-base-focus"
            />
          </Field>
          <Field label="URL slug">
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())}
              placeholder="foundations-playbook"
              className="input-base focus:input-base-focus"
            />
          </Field>
          <Field label="Subtitle" className="sm:col-span-2">
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Set up your business the right way from day one."
              className="input-base focus:input-base-focus"
            />
          </Field>
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CourseCategory)}
              className="input-base focus:input-base-focus"
            >
              {CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as CourseLevel)}
              className="input-base focus:input-base-focus"
            >
              {LEVEL_VALUES.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_LABEL[l]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (USD)">
            <input
              required
              type="number"
              min="0"
              step="1"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              placeholder="149"
              className="input-base focus:input-base-focus tabular-nums"
            />
          </Field>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline hover:btn-outline-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-gold hover:btn-gold-hover disabled:opacity-50"
            >
              {pending ? "Creating…" : "Create course"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function CourseRow({
  course,
  onAnyChange,
}: {
  course: CourseWithModules;
  onAnyChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  // Inline editable fields
  const [title, setTitle] = useState(course.title);
  const [subtitle, setSubtitle] = useState(course.subtitle);
  const [slug, setSlug] = useState(course.slug);
  const [category, setCategory] = useState<CourseCategory>(course.category);
  const [level, setLevel] = useState<CourseLevel>(course.level);
  const [priceDollars, setPriceDollars] = useState((course.price_cents / 100).toString());
  const [originalPriceDollars, setOriginalPriceDollars] = useState(
    course.original_price_cents ? (course.original_price_cents / 100).toString() : "",
  );
  const [durationHours, setDurationHours] = useState(course.duration_hours.toString());
  const [moduleCount, setModuleCount] = useState(course.module_count.toString());
  const [position, setPosition] = useState(course.position.toString());
  const [featured, setFeatured] = useState(course.featured);
  const [description, setDescription] = useState(course.description ?? "");
  const [outcomes, setOutcomes] = useState((course.outcomes ?? []).join("\n"));
  const [whoFor, setWhoFor] = useState((course.who_for ?? []).join("\n"));
  const [recommendedFor, setRecommendedFor] = useState((course.recommended_for ?? []).join(", "));
  const [stripePriceId, setStripePriceId] = useState(course.stripe_price_id ?? "");

  const save = useMutation({
    mutationFn: () =>
      updateCourse(course.id, {
        title,
        subtitle,
        slug,
        category,
        level,
        price_cents: Math.round(Number(priceDollars) * 100),
        original_price_cents:
          originalPriceDollars.trim() === ""
            ? null
            : Math.round(Number(originalPriceDollars) * 100),
        duration_hours: Number(durationHours),
        module_count: Number(moduleCount),
        position: Number(position),
        featured,
        description: description.trim() || null,
        outcomes: outcomes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        who_for: whoFor
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        recommended_for: recommendedFor
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        stripe_price_id: stripePriceId.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Course updated");
      setEditing(false);
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  const remove = useMutation({
    mutationFn: () => deleteCourse(course.id),
    onSuccess: () => {
      toast.success("Course deleted");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  const toggleFeatured = useMutation({
    mutationFn: () => updateCourse(course.id, { featured: course.featured! }),
    onSuccess: () => onAnyChange(),
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <div className="card-base overflow-hidden">
      {/* Summary row */}
      <div className="px-5 py-4 grid grid-cols-[auto_120px_1fr_auto_auto_auto] gap-4 items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse modules" : "Expand modules"}
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-gold-subtle hover:border-gold transition-colors"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Visible thumbnail per course */}
        <div className="hidden sm:block">
          <CourseThumbnail category={course.category} title={course.title} size="sm" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gold bg-gold-subtle border border-gold-tint px-2 py-0.5 rounded">
              {CATEGORY_LABEL[course.category]}
            </span>
            <span className="text-[11px] text-muted-foreground">/{course.slug}</span>
            {!course.stripe_price_id && course.category !== "bundle" && (
              <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-alert bg-[#FFF7ED] border border-alert/30 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <Info size={10} /> No Stripe ID
              </span>
            )}
          </div>
          <h3 className="truncate">{course.title}</h3>
          <p className="text-[13px] text-muted-foreground truncate">{course.subtitle}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <span>{LEVEL_LABEL[course.level]}</span>
            <span>·</span>
            <span>{course.duration_hours}h</span>
            <span>·</span>
            <span>
              {course.modules.length} {course.modules.length === 1 ? "module" : "modules"}
            </span>
          </div>
        </div>

        <button
          onClick={() => toggleFeatured.mutate()}
          title={course.featured ? "Featured" : "Not featured"}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            course.featured
              ? "bg-gold-subtle border border-gold text-gold"
              : "border border-border text-muted-foreground hover:text-gold"
          }`}
        >
          <Star size={16} fill={course.featured ? "currentColor" : "none"} />
        </button>

        <div className="text-right">
          <p className="text-[20px] font-bold text-navy tabular-nums leading-none">
            {formatPrice(course.price_cents)}
          </p>
          {course.original_price_cents && (
            <p className="text-[11px] text-muted-foreground line-through tabular-nums mt-0.5">
              {formatPrice(course.original_price_cents)}
            </p>
          )}
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="btn-outline hover:btn-outline-hover min-h-0! py-2! px-3! text-[12px]!"
        >
          <Settings size={13} />
          {editing ? "Close" : "Edit"}
        </button>
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="border-t border-border bg-warm-white px-6 py-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-base focus:input-base-focus"
              />
            </Field>
            <Field label="Slug">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="input-base focus:input-base-focus"
              />
            </Field>
            <Field label="Subtitle" className="sm:col-span-2">
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="input-base focus:input-base-focus"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CourseCategory)}
                className="input-base focus:input-base-focus"
              >
                {CATEGORY_VALUES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Level">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="input-base focus:input-base-focus"
              >
                {LEVEL_VALUES.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_LABEL[l]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (USD)">
              <input
                type="number"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                className="input-base focus:input-base-focus tabular-nums"
              />
            </Field>
            <Field label="Original price (optional)">
              <input
                type="number"
                value={originalPriceDollars}
                onChange={(e) => setOriginalPriceDollars(e.target.value)}
                className="input-base focus:input-base-focus tabular-nums"
                placeholder="(none)"
              />
            </Field>
            <Field label="Duration (hours)">
              <input
                type="number"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="input-base focus:input-base-focus tabular-nums"
              />
            </Field>
            <Field label="Module count">
              <input
                type="number"
                value={moduleCount}
                onChange={(e) => setModuleCount(e.target.value)}
                className="input-base focus:input-base-focus tabular-nums"
              />
            </Field>
            <Field label="Position (sort order)">
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="input-base focus:input-base-focus tabular-nums"
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="input-base focus:input-base-focus resize-y"
                placeholder="Long-form description shown on the course detail page."
              />
            </Field>
            <Field label="Outcomes (one per line)" className="sm:col-span-2">
              <textarea
                value={outcomes}
                onChange={(e) => setOutcomes(e.target.value)}
                rows={4}
                className="input-base focus:input-base-focus resize-y"
              />
            </Field>
            <Field label="Who this is for (one per line)" className="sm:col-span-2">
              <textarea
                value={whoFor}
                onChange={(e) => setWhoFor(e.target.value)}
                rows={3}
                className="input-base focus:input-base-focus resize-y"
              />
            </Field>
            <Field label="Recommended for stages (comma-separated)" className="sm:col-span-2">
              <input
                value={recommendedFor}
                onChange={(e) => setRecommendedFor(e.target.value)}
                placeholder="pre-llc, new-owner, growing, scaling"
                className="input-base focus:input-base-focus"
              />
            </Field>

            <Field label="Stripe Price ID" className="sm:col-span-2">
              <input
                value={stripePriceId}
                onChange={(e) => setStripePriceId(e.target.value)}
                placeholder="price_xxxxxxxxxxxxxx"
                className="input-base focus:input-base-focus"
              />
              <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed">
                Create a <strong>one-time Product + Price</strong> in your{" "}
                <a
                  href="https://dashboard.stripe.com/products"
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy underline inline-flex items-center gap-1"
                >
                  Stripe Dashboard
                  <ExternalLink size={11} />
                </a>{" "}
                set to{" "}
                <code className="text-[11px] bg-surface px-1.5 py-0.5 rounded">
                  {formatPrice(Math.round(Number(priceDollars || "0") * 100))}
                </code>
                , then paste the Price ID here. Until this is set, checkout falls back to a
                confirmation screen.
              </p>
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => {
                if (!confirm(`Delete "${course.title}" and all its modules?`)) return;
                remove.mutate();
              }}
              disabled={remove.isPending}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-destructive hover:underline disabled:opacity-50"
            >
              <Trash2 size={13} />
              Delete course
            </button>
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="btn-gold hover:btn-gold-hover disabled:opacity-50"
            >
              <Save size={14} />
              {save.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* Modules panel */}
      {expanded && (
        <div className="border-t border-border bg-white px-6 py-5">
          <ModulesPanel course={course} onAnyChange={onAnyChange} />
        </div>
      )}
    </div>
  );
}

function ModulesPanel({
  course,
  onAnyChange,
}: {
  course: CourseWithModules;
  onAnyChange: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMin, setDurationMin] = useState("");

  const add = useMutation({
    mutationFn: () =>
      createModule({
        course_id: course.id,
        position: course.modules.length,
        title: title.trim(),
        description: description.trim() || null,
        duration_min: durationMin.trim() ? Number(durationMin) : null,
      }),
    onSuccess: () => {
      toast.success("Module added");
      setTitle("");
      setDescription("");
      setDurationMin("");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4>Curriculum modules</h4>
        <span className="text-[12px] text-muted-foreground">
          {course.modules.length} {course.modules.length === 1 ? "module" : "modules"}
        </span>
      </div>

      <div className="space-y-2 mb-5">
        {course.modules.map((m) => (
          <ModuleRow key={m.id} module={m} onAnyChange={onAnyChange} />
        ))}
        {course.modules.length === 0 && (
          <p className="text-[13px] text-muted-foreground italic">
            No modules yet — add the first one below.
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          add.mutate();
        }}
        className="card-base p-4 bg-warm-white grid sm:grid-cols-[1fr_2fr_100px_auto] gap-3 items-end"
      >
        <Field label="Title" small>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Module title"
            className="input-base focus:input-base-focus"
          />
        </Field>
        <Field label="Description" small>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="input-base focus:input-base-focus"
          />
        </Field>
        <Field label="Minutes" small>
          <input
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            placeholder="0"
            className="input-base focus:input-base-focus tabular-nums"
          />
        </Field>
        <button
          type="submit"
          disabled={!title.trim() || add.isPending}
          className="btn-primary hover:btn-primary-hover disabled:opacity-50 min-h-0! py-2.5! text-[13px]!"
        >
          <Plus size={14} />
          Add
        </button>
      </form>
    </div>
  );
}

function ModuleRow({
  module: m,
  onAnyChange,
}: {
  module: NonNullable<CourseWithModules["modules"]>[number];
  onAnyChange: () => void;
}) {
  const [title, setTitle] = useState(m.title);
  const [description, setDescription] = useState(m.description ?? "");
  const [durationMin, setDurationMin] = useState(m.duration_min?.toString() ?? "");
  const [position, setPosition] = useState(m.position.toString());

  const dirty =
    title !== m.title ||
    description !== (m.description ?? "") ||
    durationMin !== (m.duration_min?.toString() ?? "") ||
    position !== m.position.toString();

  const save = useMutation({
    mutationFn: () =>
      updateModule(m.id, {
        title,
        description: description.trim() || null,
        duration_min: durationMin.trim() ? Number(durationMin) : null,
        position: Number(position),
      }),
    onSuccess: () => {
      toast.success("Module updated");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  const remove = useMutation({
    mutationFn: () => deleteModule(m.id),
    onSuccess: () => {
      toast.success("Module deleted");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <div className="card-base p-3 grid sm:grid-cols-[50px_1.5fr_2fr_80px_auto] gap-3 items-center">
      <input
        type="number"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="input-base focus:input-base-focus py-2! text-[13px]! tabular-nums"
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-base focus:input-base-focus py-2! text-[13px]!"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="input-base focus:input-base-focus py-2! text-[13px]!"
      />
      <input
        type="number"
        value={durationMin}
        onChange={(e) => setDurationMin(e.target.value)}
        placeholder="min"
        className="input-base focus:input-base-focus py-2! text-[13px]! tabular-nums"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => save.mutate()}
          disabled={!dirty || save.isPending}
          className="text-[12px] font-semibold text-navy hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {save.isPending ? "…" : "Save"}
        </button>
        <button
          onClick={() => {
            if (!confirm(`Delete module "${m.title}"?`)) return;
            remove.mutate();
          }}
          disabled={remove.isPending}
          className="text-destructive hover:text-alert disabled:opacity-30"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ===== Intake Tab (existing assessment Q/A management) =====

const KIND_OPTIONS: { value: QuestionKind; label: string; help: string }[] = [
  {
    value: "stage",
    label: "Stage",
    help: "Maps to segment (pre-llc, new-owner, growing, scaling)",
  },
  { value: "pain", label: "Pain", help: "Maps to top pain (taxes, numbers, payroll, protection)" },
  { value: "context", label: "Context", help: "Extra context — not used for routing" },
];

const KIND_BADGE: Record<QuestionKind, string> = {
  stage: "bg-gold-subtle text-navy border-gold-tint",
  pain: "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]",
  context: "bg-surface text-muted-foreground border-surface",
};

function IntakeTab() {
  const qc = useQueryClient();
  const {
    data: questions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: listQuestionsWithOptions,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-questions"] });
    qc.invalidateQueries({ queryKey: ["assessment-questions"] });
  };

  const addQuestion = useMutation({
    mutationFn: (input: { prompt: string; kind: QuestionKind; position: number }) =>
      createQuestion(input),
    onSuccess: () => {
      toast.success("Question added");
      invalidate();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <>
      <AddQuestionForm
        nextPosition={questions ? questions.length : 0}
        onAdd={(input) => addQuestion.mutate(input)}
        pending={addQuestion.isPending}
      />

      {isLoading && <p className="mt-8 text-[14px] text-muted-foreground">Loading questions…</p>}

      {isError && (
        <div className="mt-8 card-base p-6 border-alert/40 bg-[#FFF7ED]">
          <p className="text-[14px] font-semibold text-alert">Could not load questions</p>
          <p className="text-[12px] text-muted-foreground mt-1">{(error as Error)?.message}</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {questions?.map((q) => (
          <QuestionCard key={q.id} question={q} onAnyChange={invalidate} />
        ))}
      </div>
    </>
  );
}

function AddQuestionForm({
  nextPosition,
  onAdd,
  pending,
}: {
  nextPosition: number;
  onAdd: (input: { prompt: string; kind: QuestionKind; position: number }) => void;
  pending: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const [kind, setKind] = useState<QuestionKind>("context");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onAdd({ prompt: prompt.trim(), kind, position: nextPosition });
    setPrompt("");
    setKind("context");
  };

  return (
    <form onSubmit={submit} className="card-base p-6">
      <h3 className="mb-1">Add an intake question</h3>
      <p className="text-[13px] text-muted-foreground mb-5">
        Questions appear in order on the assessment.
      </p>
      <div className="grid sm:grid-cols-[1fr_220px_140px] gap-3 items-end">
        <Field label="Prompt" small>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. How many employees do you have?"
            className="input-base focus:input-base-focus"
          />
        </Field>
        <Field label="Kind" small>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as QuestionKind)}
            className="input-base focus:input-base-focus"
          >
            {KIND_OPTIONS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="submit"
          disabled={pending || !prompt.trim()}
          className="btn-gold hover:btn-gold-hover disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">
        {KIND_OPTIONS.find((k) => k.value === kind)?.help}
      </p>
    </form>
  );
}

function QuestionCard({
  question,
  onAnyChange,
}: {
  question: QuestionWithOptions;
  onAnyChange: () => void;
}) {
  const [prompt, setPrompt] = useState(question.prompt);
  const [kind, setKind] = useState<QuestionKind>(question.kind);
  const [position, setPosition] = useState(question.position);
  const dirty =
    prompt !== question.prompt || kind !== question.kind || position !== question.position;

  const save = useMutation({
    mutationFn: () => updateQuestion(question.id, { prompt, kind, position }),
    onSuccess: () => {
      toast.success("Question updated");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  const remove = useMutation({
    mutationFn: () => deleteQuestion(question.id),
    onSuccess: () => {
      toast.success("Question deleted");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <article className="card-base overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-warm-white">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`text-[10px] uppercase tracking-[0.12em] font-bold px-2 py-1 rounded border ${KIND_BADGE[question.kind]}`}
          >
            {question.kind}
          </span>
          <span className="text-[12px] text-muted-foreground">
            Position {question.position} · {question.options.length} option
            {question.options.length === 1 ? "" : "s"}
          </span>
          <button
            onClick={() => {
              if (!confirm(`Delete "${question.prompt}" and all its options?`)) return;
              remove.mutate();
            }}
            disabled={remove.isPending}
            className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-destructive hover:underline disabled:opacity-50"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>

        <div className="grid sm:grid-cols-[1fr_180px_120px_120px] gap-3 items-end">
          <Field label="Prompt" small>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-base focus:input-base-focus"
            />
          </Field>
          <Field label="Kind" small>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as QuestionKind)}
              className="input-base focus:input-base-focus"
            >
              {KIND_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Position" small>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="input-base focus:input-base-focus tabular-nums"
            />
          </Field>
          <button
            onClick={() => save.mutate()}
            disabled={!dirty || save.isPending}
            className="btn-gold hover:btn-gold-hover disabled:opacity-40"
          >
            {save.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <OptionsList
        questionId={question.id}
        options={question.options}
        questionKind={question.kind}
        onAnyChange={onAnyChange}
      />
    </article>
  );
}

function OptionsList({
  questionId,
  options,
  questionKind,
  onAnyChange,
}: {
  questionId: string;
  options: Option[];
  questionKind: QuestionKind;
  onAnyChange: () => void;
}) {
  return (
    <div className="px-6 py-4">
      <h5 className="mb-3">Answer options</h5>
      <div className="space-y-2 mb-3">
        {options.map((opt) => (
          <OptionRow
            key={opt.id}
            option={opt}
            questionKind={questionKind}
            onAnyChange={onAnyChange}
          />
        ))}
      </div>
      <AddOptionRow
        questionId={questionId}
        nextPosition={options.length}
        questionKind={questionKind}
        onAdded={onAnyChange}
      />
    </div>
  );
}

function OptionRow({
  option,
  questionKind,
  onAnyChange,
}: {
  option: Option;
  questionKind: QuestionKind;
  onAnyChange: () => void;
}) {
  const [label, setLabel] = useState(option.label);
  const [value, setValue] = useState(option.value ?? "");
  const [position, setPosition] = useState(option.position);
  const dirty =
    label !== option.label || (value || null) !== option.value || position !== option.position;

  const save = useMutation({
    mutationFn: () =>
      updateOption(option.id, {
        label,
        value: value.trim() === "" ? null : value.trim(),
        position,
      }),
    onSuccess: () => {
      toast.success("Option updated");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  const remove = useMutation({
    mutationFn: () => deleteOption(option.id),
    onSuccess: () => {
      toast.success("Option deleted");
      onAnyChange();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <div className="grid grid-cols-[55px_1.5fr_1fr_auto] gap-2 items-center">
      <input
        type="number"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="input-base focus:input-base-focus py-2! text-[13px]! tabular-nums"
      />
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="input-base focus:input-base-focus py-2! text-[13px]!"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={questionKind === "context" ? "(none)" : `e.g. ${exampleValue(questionKind)}`}
        className="input-base focus:input-base-focus py-2! text-[13px]!"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => save.mutate()}
          disabled={!dirty || save.isPending}
          className="text-[12px] font-semibold text-navy hover:text-gold disabled:opacity-30"
        >
          {save.isPending ? "…" : "Save"}
        </button>
        <button
          onClick={() => {
            if (!confirm(`Delete option "${option.label}"?`)) return;
            remove.mutate();
          }}
          disabled={remove.isPending}
          className="text-destructive hover:text-alert disabled:opacity-30"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function AddOptionRow({
  questionId,
  nextPosition,
  questionKind,
  onAdded,
}: {
  questionId: string;
  nextPosition: number;
  questionKind: QuestionKind;
  onAdded: () => void;
}) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  const add = useMutation({
    mutationFn: () =>
      createOption({
        question_id: questionId,
        position: nextPosition,
        label: label.trim(),
        value: value.trim() === "" ? null : value.trim(),
      }),
    onSuccess: () => {
      toast.success("Option added");
      setLabel("");
      setValue("");
      onAdded();
    },
    onError: (e: Error) => toast.error(`Failed: ${e.message}`),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!label.trim()) return;
        add.mutate();
      }}
      className="grid grid-cols-[55px_1.5fr_1fr_auto] gap-2 items-center pt-3 mt-3 border-t border-dashed border-border"
    >
      <span className="text-[11px] text-muted-foreground text-center tabular-nums">
        {nextPosition}
      </span>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="New answer label"
        className="input-base focus:input-base-focus py-2! text-[13px]!"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={questionKind === "context" ? "(none)" : `e.g. ${exampleValue(questionKind)}`}
        className="input-base focus:input-base-focus py-2! text-[13px]!"
      />
      <button
        type="submit"
        disabled={!label.trim() || add.isPending}
        className="btn-primary hover:btn-primary-hover disabled:opacity-30 min-h-0! py-2! px-3! text-[12px]!"
      >
        <Plus size={12} />
        Add
      </button>
    </form>
  );
}

// ===== Shared helpers =====

function Field({
  label,
  children,
  small,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  small?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span
        className={`block font-semibold text-navy mb-1.5 ${
          small ? "text-[11px] tracking-[0.08em] uppercase text-muted-foreground" : "text-[13px]"
        }`}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function exampleValue(kind: QuestionKind): string {
  if (kind === "stage") return "new-owner";
  if (kind === "pain") return "taxes";
  return "";
}
