const trimOrNull = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
};

export const buildProfileSeedFromAuthUser = (user) => {
  const metadata = user?.user_metadata ?? {};

  return {
    user_id: user.id,
    email: trimOrNull(user.email),
    first_names: trimOrNull(metadata.first_names ?? metadata.name),
    last_names: trimOrNull(metadata.last_names ?? metadata.lastname),
    phone: trimOrNull(metadata.phone),
    dui: trimOrNull(metadata.dui),
    address: trimOrNull(metadata.address),
    role: trimOrNull(metadata.role) ?? "customer",
    is_active: metadata.is_active ?? true,
    deleted_at: null,
  };
};

export const buildAuthMetadataFromProfile = (profile) => ({
  name: profile.first_names ?? null,
  first_names: profile.first_names ?? null,
  lastname: profile.last_names ?? null,
  last_names: profile.last_names ?? null,
  phone: profile.phone ?? null,
  dui: profile.dui ?? null,
  address: profile.address ?? null,
  role: profile.role ?? "customer",
  is_active: profile.is_active ?? true,
});
