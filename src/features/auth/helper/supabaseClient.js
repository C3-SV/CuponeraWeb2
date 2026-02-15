import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rcxwnnrvsnrvgoaqnoue.supabase.co"
const supabaseKey = "sb_publishable_IKd9XIom4PXG5njZSDe3vw_U-jxMzKV"

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;