import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const productionStorageRequired = () => Boolean(process.env.VERCEL) || process.env.BINDY_REQUIRE_DATABASE === "true";
export const hasDatabase = () => Boolean(getSupabaseAdmin());
export async function readDocument<T>(key: string): Promise<{ value: T; revision: number } | null> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Durable database is not configured.");
  const { data, error } = await client.schema("public").from("bindy_documents").select("value,revision").eq("key", key).maybeSingle();
  if (error) throw new Error("Store database is unavailable. Check the deployment database migration.");
  return data as { value: T; revision: number } | null;
}
export async function writeDocument(key: string, value: unknown, expected: number): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Durable database is not configured.");
  const { data, error } = await client.schema("public").rpc("bindy_compare_and_swap", { document_key: key, document_value: value, expected_revision: expected });
  if (error) throw new Error("The database could not save this change. Nothing was confirmed.");
  return data === true;
}
