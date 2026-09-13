import { createClient } from "@supabase/supabase-js";

const configuredUrl = String(import.meta.env.VITE_SUPABASE_URL || "").trim();
const url = configuredUrl
	.replace(/\/+$/, "")
	.replace(/\/rest\/v1$/i, "");
const key =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
	import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const supabaseConfigured = Boolean(supabase);
