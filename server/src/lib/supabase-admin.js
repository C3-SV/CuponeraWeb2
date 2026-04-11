import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseAdminConfig } from "../config/env.js";
import { HttpError } from "./http.js";

let supabaseAdmin = null;

export const getSupabaseAdmin = () => {
  if (!hasSupabaseAdminConfig) {
    throw new HttpError(
      503,
      "Falta configurar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el servidor.",
    );
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return supabaseAdmin;
};
