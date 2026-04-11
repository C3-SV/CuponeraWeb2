import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://rcxwnnrvsnrvgoaqnoue.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  "sb_publishable_IKd9XIom4PXG5njZSDe3vw_U-jxMzKV";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
