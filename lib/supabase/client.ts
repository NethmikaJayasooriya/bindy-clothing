import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://esreovoswlwccsfjyjph.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || "bindy";

export const supabase = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: supabaseSchema as any },
    })
  : null;
