import { supabase } from "./client";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type Course = Tables<"courses">;
export type CourseModule = Tables<"course_modules">;
export type CourseCategory = Course["category"];
export type CourseLevel = Course["level"];

export type CourseWithModules = Course & { modules: CourseModule[] };

export const CATEGORY_LABEL: Record<CourseCategory, string> = {
  foundations: "Foundations",
  tax: "Tax Strategy",
  operations: "Operations",
  protection: "Asset Protection",
  exit: "Exit Planning",
  bundle: "Complete Bundle",
};

export const LEVEL_LABEL: Record<CourseLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all: "All Levels",
};

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export async function listCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listCoursesWithModules(): Promise<CourseWithModules[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*, modules:course_modules(*)")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    ...c,
    modules: (c.modules ?? []).slice().sort((a, b) => a.position - b.position),
  }));
}

export async function getCourseBySlug(slug: string): Promise<CourseWithModules | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*, modules:course_modules(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    modules: (data.modules ?? []).slice().sort((a, b) => a.position - b.position),
  };
}

export async function createCourse(input: TablesInsert<"courses">): Promise<Course> {
  const { data, error } = await supabase.from("courses").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, patch: TablesUpdate<"courses">): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

export async function createModule(input: TablesInsert<"course_modules">): Promise<CourseModule> {
  const { data, error } = await supabase.from("course_modules").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateModule(
  id: string,
  patch: TablesUpdate<"course_modules">,
): Promise<CourseModule> {
  const { data, error } = await supabase
    .from("course_modules")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteModule(id: string): Promise<void> {
  const { error } = await supabase.from("course_modules").delete().eq("id", id);
  if (error) throw error;
}

// === Recommendation engine ===
//
// Takes a business intake profile and recommends 1-3 courses + total price.
// Logic: filter courses where recommended_for intersects with the stage,
// rank by category-priority alignment, then apply bundle discount logic.

export type IntakeProfile = {
  stage: "pre-llc" | "new-owner" | "growing" | "scaling";
  priority: "tax" | "foundations" | "operations" | "protection" | "exit";
  // Extra context (no routing impact, used for messaging only)
  entity?: string;
  revenueBand?: string;
};

export type Recommendation = {
  courses: Course[];
  bundleCourse?: Course;
  showBundle: boolean;
  subtotalCents: number;
  bundleSavingsCents: number;
  reasoning: string;
};

const STAGE_PRIORITY_TO_CATEGORIES: Record<IntakeProfile["priority"], CourseCategory[]> = {
  foundations: ["foundations", "tax"],
  tax: ["tax", "foundations"],
  operations: ["operations", "foundations"],
  protection: ["protection", "operations"],
  exit: ["exit", "protection"],
};

export function recommendCourses(profile: IntakeProfile, allCourses: Course[]): Recommendation {
  const stage = profile.stage;
  const priorityCats = STAGE_PRIORITY_TO_CATEGORIES[profile.priority];

  const bundle = allCourses.find((c) => c.category === "bundle");
  const indv = allCourses.filter((c) => c.category !== "bundle");

  // Score each individual course: +3 if stage matches recommended_for, +2 for primary cat, +1 for secondary cat.
  type Scored = { course: Course; score: number };
  const scored: Scored[] = indv.map((course) => {
    let score = 0;
    if (course.recommended_for.includes(stage)) score += 3;
    if (course.category === priorityCats[0]) score += 2;
    if (course.category === priorityCats[1]) score += 1;
    return { course, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.course.position - b.course.position;
  });

  const picks = scored
    .filter((s) => s.score > 0)
    .slice(0, 3)
    .map((s) => s.course);
  // Fallback: if nothing scored, pick top 2 foundation courses.
  const finalPicks = picks.length > 0 ? picks : indv.slice(0, 2);

  const subtotal = finalPicks.reduce((sum, c) => sum + c.price_cents, 0);
  const bundlePrice = bundle?.price_cents ?? 0;
  const bundleSavings = Math.max(0, subtotal - bundlePrice);
  // Show bundle if either subtotal exceeds bundle price, or we recommend 3+ courses.
  const showBundle = !!bundle && (subtotal >= bundlePrice || finalPicks.length >= 3);

  const reasoning = buildReasoning(profile, finalPicks);

  return {
    courses: finalPicks,
    bundleCourse: bundle,
    showBundle,
    subtotalCents: subtotal,
    bundleSavingsCents: bundleSavings,
    reasoning,
  };
}

function buildReasoning(profile: IntakeProfile, picks: Course[]): string {
  const stageLabel = {
    "pre-llc": "pre-formation",
    "new-owner": "year-one owner",
    growing: "growing business",
    scaling: "scaling operator",
  }[profile.stage];
  const priorityLabel = {
    foundations: "getting the foundation right",
    tax: "lowering taxes",
    operations: "operations and payroll",
    protection: "protecting what you've built",
    exit: "planning an exit",
  }[profile.priority];
  if (picks.length === 0) {
    return `As a ${stageLabel}, the foundation matters most before anything else.`;
  }
  const titles = picks.map((p) => p.title);
  const titleList =
    titles.length === 1
      ? titles[0]
      : titles.length === 2
        ? `${titles[0]} and ${titles[1]}`
        : `${titles.slice(0, -1).join(", ")}, and ${titles[titles.length - 1]}`;
  return `As a ${stageLabel} focused on ${priorityLabel}, we recommend starting with ${titleList}.`;
}
