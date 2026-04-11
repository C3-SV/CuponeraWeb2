import { HttpError } from "../../lib/http.js";
import { getSupabaseAdmin } from "../../lib/supabase-admin.js";
import {
  buildAuthMetadataFromProfile,
  buildProfileSeedFromAuthUser,
} from "./auth.helpers.js";

const PROFILE_FIELDS = `
  user_id,
  email,
  first_names,
  last_names,
  phone,
  dui,
  address,
  role,
  is_active,
  deleted_at,
  created_at,
  updated_at
`;

const toProfileResponse = (profile) => ({
  user_id: profile.user_id,
  email: profile.email ?? null,
  first_names: profile.first_names ?? "",
  last_names: profile.last_names ?? "",
  phone: profile.phone ?? "",
  dui: profile.dui ?? "",
  address: profile.address ?? "",
  role: profile.role ?? "customer",
  is_active: profile.is_active ?? true,
  deleted_at: profile.deleted_at ?? null,
  created_at: profile.created_at ?? null,
  updated_at: profile.updated_at ?? null,
});

const fetchProfileByUserId = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo leer el perfil del usuario.", error);
  }

  return data;
};

export const ensureProfileForUser = async (user) => {
  const supabase = getSupabaseAdmin();
  const current = await fetchProfileByUserId(user.id);
  const seed = buildProfileSeedFromAuthUser(user);

  if (!current) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(seed, { onConflict: "user_id" })
      .select(PROFILE_FIELDS)
      .maybeSingle();

    if (error) {
      throw new HttpError(500, "No se pudo crear el perfil del usuario.", error);
    }

    return toProfileResponse(data);
  }

  const merged = {
    ...current,
    email: current.email ?? seed.email,
    first_names: current.first_names ?? seed.first_names,
    last_names: current.last_names ?? seed.last_names,
    phone: current.phone ?? seed.phone,
    dui: current.dui ?? seed.dui,
    address: current.address ?? seed.address,
    role: current.role ?? seed.role,
    is_active: current.is_active ?? seed.is_active,
    deleted_at: current.deleted_at ?? seed.deleted_at,
  };

  const needsSync =
    merged.email !== current.email ||
    merged.first_names !== current.first_names ||
    merged.last_names !== current.last_names ||
    merged.phone !== current.phone ||
    merged.dui !== current.dui ||
    merged.address !== current.address ||
    merged.role !== current.role ||
    merged.is_active !== current.is_active;

  if (!needsSync) {
    return toProfileResponse(current);
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(merged, { onConflict: "user_id" })
    .select(PROFILE_FIELDS)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo sincronizar el perfil del usuario.", error);
  }

  return toProfileResponse(data);
};

export const authenticateRequest = async (accessToken) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data?.user) {
    throw new HttpError(401, "La sesión no es válida.");
  }

  const profile = await ensureProfileForUser(data.user);
  if (profile.deleted_at || profile.is_active === false) {
    throw new HttpError(403, "Tu cuenta está desactivada.");
  }

  return {
    user: data.user,
    profile,
  };
};

export const getCurrentUserPayload = async (accessToken) => {
  const auth = await authenticateRequest(accessToken);

  return {
    user: {
      id: auth.user.id,
      email: auth.user.email ?? null,
    },
    profile: auth.profile,
  };
};

export const updateCurrentUserProfile = async ({
  userId,
  email,
  profileInput,
}) => {
  const supabase = getSupabaseAdmin();
  const current = await fetchProfileByUserId(userId);
  const nextProfile = {
    user_id: userId,
    email: current?.email ?? email ?? null,
    first_names: String(profileInput.first_names ?? "").trim(),
    last_names: String(profileInput.last_names ?? "").trim(),
    phone: String(profileInput.phone ?? "").trim() || null,
    dui: String(profileInput.dui ?? "").trim() || null,
    address: String(profileInput.address ?? "").trim() || null,
    role: current?.role ?? "customer",
    is_active: current?.is_active ?? true,
    deleted_at: current?.deleted_at ?? null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(nextProfile, { onConflict: "user_id" })
    .select(PROFILE_FIELDS)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo actualizar el perfil.", error);
  }

  const metadata = buildAuthMetadataFromProfile(data);
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });

  if (authError) {
    throw new HttpError(
      500,
      "No se pudo sincronizar el usuario autenticado.",
      authError,
    );
  }

  return toProfileResponse(data);
};
