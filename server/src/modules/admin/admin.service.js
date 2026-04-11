import { HttpError } from "../../lib/http.js";
import { getSupabaseAdmin } from "../../lib/supabase-admin.js";
import {
  normalizeAdminUserPayload,
  normalizeCategoryPayload,
  normalizeCustomersQuery,
} from "./admin.validators.js";
import { buildAuthMetadataFromProfile } from "../auth/auth.helpers.js";

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

const CATEGORY_FIELDS = `
  category_id,
  category_name,
  category_img,
  category_img_hover,
  alt_text,
  deleted_at,
  created_at,
  updated_at
`;

const matchesSearch = (value, search) => {
  if (!search) return true;
  return String(value ?? "").toLowerCase().includes(search.toLowerCase());
};

const adminMatchesSearch = (profile, search) =>
  !search ||
  [
    profile.email,
    profile.first_names,
    profile.last_names,
    `${profile.first_names ?? ""} ${profile.last_names ?? ""}`.trim(),
    profile.phone,
    profile.dui,
  ].some((value) => matchesSearch(value, search));

const customerMatchesSearch = (profile, search) =>
  !search ||
  [
    profile.email,
    profile.first_names,
    profile.last_names,
    `${profile.first_names ?? ""} ${profile.last_names ?? ""}`.trim(),
    profile.phone,
    profile.dui,
  ].some((value) => matchesSearch(value, search));

const toAdminProfileRecord = (userId, payload, current = {}) => ({
  user_id: userId,
  email: payload.email,
  first_names: payload.first_names,
  last_names: payload.last_names,
  phone: payload.phone,
  dui: payload.dui,
  address: payload.address,
  role: "admin.general",
  is_active: payload.is_active ?? current.is_active ?? true,
  deleted_at: current.deleted_at ?? null,
});

const toAdminResponse = (profile) => ({
  user_id: profile.user_id,
  email: profile.email ?? "",
  first_names: profile.first_names ?? "",
  last_names: profile.last_names ?? "",
  phone: profile.phone ?? "",
  dui: profile.dui ?? "",
  address: profile.address ?? "",
  role: profile.role ?? "admin.general",
  is_active: profile.is_active ?? true,
  created_at: profile.created_at ?? null,
  updated_at: profile.updated_at ?? null,
});

const toCategoryResponse = (row) => ({
  category_id: row.category_id,
  category_name: row.category_name ?? "",
  alt_text: row.alt_text ?? "",
  category_img: row.category_img ?? "",
  category_img_hover: row.category_img_hover ?? "",
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
});

const fetchAdminProfile = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("user_id", userId)
    .eq("role", "admin.general")
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo leer el administrador.", error);
  }

  return data;
};

export const listAdminUsers = async ({ search = "" } = {}) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("role", "admin.general")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new HttpError(500, "No se pudo listar los administradores.", error);
  }

  return (data ?? [])
    .filter((profile) => adminMatchesSearch(profile, search))
    .map(toAdminResponse);
};

export const createAdminUser = async (input) => {
  const supabase = getSupabaseAdmin();
  const payload = normalizeAdminUserPayload(input, { mode: "create" });

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
    user_metadata: buildAuthMetadataFromProfile(
      toAdminProfileRecord("pending", payload),
    ),
  });

  if (authError || !authData?.user) {
    throw new HttpError(400, authError?.message ?? "No se pudo crear el usuario admin.");
  }

  const profileRecord = toAdminProfileRecord(authData.user.id, payload);
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileRecord, { onConflict: "user_id" })
    .select(PROFILE_FIELDS)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo guardar el perfil admin.", error);
  }

  return toAdminResponse(data);
};

export const updateAdminUser = async (userId, input) => {
  const supabase = getSupabaseAdmin();
  const current = await fetchAdminProfile(userId);

  if (!current || current.deleted_at) {
    throw new HttpError(404, "Administrador no encontrado.");
  }

  const payload = normalizeAdminUserPayload(input, { mode: "update" });
  const profileRecord = toAdminProfileRecord(userId, payload, current);

  const authUpdate = {
    email: profileRecord.email,
    user_metadata: buildAuthMetadataFromProfile(profileRecord),
  };

  if (payload.password) {
    authUpdate.password = payload.password;
  }

  const { error: authError } = await supabase.auth.admin.updateUserById(
    userId,
    authUpdate,
  );

  if (authError) {
    throw new HttpError(400, authError.message ?? "No se pudo actualizar el usuario.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileRecord, { onConflict: "user_id" })
    .select(PROFILE_FIELDS)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo actualizar el perfil admin.", error);
  }

  return toAdminResponse(data);
};

export const deleteAdminUser = async ({ userId, actorUserId }) => {
  if (userId === actorUserId) {
    throw new HttpError(400, "No podés eliminar tu propio usuario admin.");
  }

  const supabase = getSupabaseAdmin();
  const current = await fetchAdminProfile(userId);

  if (!current || current.deleted_at) {
    throw new HttpError(404, "Administrador no encontrado.");
  }

  const nextProfile = {
    ...current,
    is_active: false,
    deleted_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      is_active: false,
      deleted_at: nextProfile.deleted_at,
    })
    .eq("user_id", userId);

  if (error) {
    throw new HttpError(500, "No se pudo eliminar el administrador.", error);
  }

  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: buildAuthMetadataFromProfile(nextProfile),
  });

  if (authError) {
    throw new HttpError(
      500,
      "Se eliminó el perfil, pero falló la sincronización del usuario.",
      authError,
    );
  }

  return { success: true };
};

export const listCategoriesAdmin = async ({ search = "" } = {}) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_FIELDS)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new HttpError(500, "No se pudieron listar los rubros.", error);
  }

  return (data ?? [])
    .filter((row) => matchesSearch(row.category_name, search))
    .map(toCategoryResponse);
};

export const createCategory = async (input) => {
  const supabase = getSupabaseAdmin();
  const payload = normalizeCategoryPayload(input);
  const record = {
    ...payload,
    alt_text: payload.alt_text ?? payload.category_name,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(record)
    .select(CATEGORY_FIELDS)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo crear el rubro.", error);
  }

  return toCategoryResponse(data);
};

export const updateCategory = async (categoryId, input) => {
  const supabase = getSupabaseAdmin();
  const payload = normalizeCategoryPayload(input);
  const { data, error } = await supabase
    .from("categories")
    .update({
      ...payload,
      alt_text: payload.alt_text ?? payload.category_name,
    })
    .eq("category_id", categoryId)
    .is("deleted_at", null)
    .select(CATEGORY_FIELDS)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo actualizar el rubro.", error);
  }

  if (!data) {
    throw new HttpError(404, "Rubro no encontrado.");
  }

  return toCategoryResponse(data);
};

export const deleteCategory = async (categoryId) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("category_id", categoryId)
    .is("deleted_at", null);

  if (error) {
    throw new HttpError(500, "No se pudo eliminar el rubro.", error);
  }

  return { success: true };
};

export const listCustomers = async (query = {}) => {
  const { page, pageSize, offset, search } = normalizeCustomersQuery(query);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new HttpError(500, "No se pudo listar los clientes.", error);
  }

  const customers = (data ?? [])
    .filter((profile) => profile.role !== "admin.general")
    .filter((profile) => customerMatchesSearch(profile, search));

  const total = customers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = customers.slice(offset, offset + pageSize);
  const customerIds = pageItems.map((item) => item.user_id);

  const summaries = new Map(
    customerIds.map((customerId) => [
      customerId,
      {
        ordersCount: 0,
        couponsCount: 0,
        totalSpent: 0,
        lastPurchaseAt: null,
      },
    ]),
  );

  if (customerIds.length > 0) {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        order_id,
        customer_id,
        order_paid_at,
        order_status,
        order_items (
          order_item_id,
          quantity,
          unit_price,
          coupons (
            coupon_id
          )
        )
      `)
      .in("customer_id", customerIds)
      .eq("order_status", "COMPLETED")
      .is("deleted_at", null)
      .order("order_paid_at", { ascending: false });

    if (ordersError) {
      throw new HttpError(
        500,
        "No se pudo calcular el resumen de clientes.",
        ordersError,
      );
    }

    for (const order of orders ?? []) {
      const bucket = summaries.get(order.customer_id);
      if (!bucket) continue;

      bucket.ordersCount += 1;
      bucket.lastPurchaseAt =
        bucket.lastPurchaseAt && bucket.lastPurchaseAt > order.order_paid_at
          ? bucket.lastPurchaseAt
          : order.order_paid_at;

      for (const item of order.order_items ?? []) {
        const quantity = Number(item.quantity ?? 0);
        const unitPrice = Number(item.unit_price ?? 0);
        bucket.totalSpent += quantity * unitPrice;
        bucket.couponsCount += (item.coupons ?? []).length || quantity;
      }
    }
  }

  return {
    items: pageItems.map((profile) => {
      const summary = summaries.get(profile.user_id) ?? {
        ordersCount: 0,
        couponsCount: 0,
        totalSpent: 0,
        lastPurchaseAt: null,
      };

      return {
        user_id: profile.user_id,
        email: profile.email ?? "",
        first_names: profile.first_names ?? "",
        last_names: profile.last_names ?? "",
        phone: profile.phone ?? "",
        dui: profile.dui ?? "",
        address: profile.address ?? "",
        is_active: profile.is_active ?? true,
        created_at: profile.created_at ?? null,
        orders_count: summary.ordersCount,
        coupons_count: summary.couponsCount,
        total_spent: summary.totalSpent,
        last_purchase_at: summary.lastPurchaseAt,
      };
    }),
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};
