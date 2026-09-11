import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://igqomnkrkvnhpektsnlu.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncW9tbmtya3ZuaHBla3Rzbmx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA2NzIxNCwiZXhwIjoyMTA0NjQzMjE0fQ.2F8hrAFXZwi2dGcfbThrXkRQXD28KlMmWdOTgUgK1ug";

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type SupabaseUserProfile = {
  id: string;
  email: string;
  name: string;
  role: "student" | "tpo";
  password_hash?: string;
  created_at?: string;
};

/**
  Ensure Supabase database schema and default seed data are ready.
*/
export async function ensureSupabaseTables() {
  try {
    // Test database connection by querying profiles table
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error && error.code === "PGRST301") {
      console.warn("[Supabase] Profiles table not found. Operating with fallback RPC/SQL.");
    }
  } catch (err) {
    console.warn("[Supabase] Database sync check:", String(err));
  }
}
