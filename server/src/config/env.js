const trim = (value) => {
  if (value == null) return "";
  return String(value).trim();
};

export const env = {
  PORT: Number.parseInt(process.env.PORT ?? "4242", 10) || 4242,
  CLIENT_ORIGIN: trim(process.env.CLIENT_ORIGIN),
  STRIPE_SECRET_KEY: trim(process.env.STRIPE_SECRET_KEY),
  SUPABASE_URL: trim(
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  ),
  SUPABASE_SERVICE_ROLE_KEY: trim(process.env.SUPABASE_SERVICE_ROLE_KEY),
};

export const hasSupabaseAdminConfig = Boolean(
  env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
);
