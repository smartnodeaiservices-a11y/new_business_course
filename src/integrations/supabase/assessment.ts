import { supabase } from "./client";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type Question = Tables<"assessment_questions">;
export type Option = Tables<"assessment_options">;
export type QuestionKind = Question["kind"];

export type QuestionWithOptions = Question & {
  options: Option[];
};

export async function listQuestionsWithOptions(): Promise<QuestionWithOptions[]> {
  const { data, error } = await supabase
    .from("assessment_questions")
    .select("*, options:assessment_options(*)")
    .order("position", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((q) => ({
    ...q,
    options: (q.options ?? []).slice().sort((a, b) => a.position - b.position),
  }));
}

export async function createQuestion(
  input: Omit<TablesInsert<"assessment_questions">, "id">,
): Promise<Question> {
  const { data, error } = await supabase
    .from("assessment_questions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateQuestion(
  id: string,
  patch: TablesUpdate<"assessment_questions">,
): Promise<Question> {
  const { data, error } = await supabase
    .from("assessment_questions")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from("assessment_questions").delete().eq("id", id);
  if (error) throw error;
}

export async function createOption(
  input: Omit<TablesInsert<"assessment_options">, "id">,
): Promise<Option> {
  const { data, error } = await supabase.from("assessment_options").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateOption(
  id: string,
  patch: TablesUpdate<"assessment_options">,
): Promise<Option> {
  const { data, error } = await supabase
    .from("assessment_options")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOption(id: string): Promise<void> {
  const { error } = await supabase.from("assessment_options").delete().eq("id", id);
  if (error) throw error;
}
