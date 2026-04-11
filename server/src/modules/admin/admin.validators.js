const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const trimOrNull = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
};

const trimRequired = (value, fieldName) => {
  const normalized = trimOrNull(value);
  if (!normalized) {
    throw new Error(`El campo ${fieldName} es obligatorio.`);
  }
  return normalized;
};

export const normalizeAdminUserPayload = (input = {}, options = {}) => {
  const isCreate = options.mode !== "update";

  const email = trimRequired(input.email, "correo").toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("El correo no es válido.");
  }

  const password = trimOrNull(input.password);
  if (isCreate && (!password || password.length < 6)) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }
  if (!isCreate && password && password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  const payload = {
    email,
    first_names: trimRequired(input.first_names, "nombres"),
    last_names: trimRequired(input.last_names, "apellidos"),
    phone: trimOrNull(input.phone),
    dui: trimOrNull(input.dui),
    address: trimOrNull(input.address),
    role: trimOrNull(input.role) ?? "admin.general",
    is_active: input.is_active ?? true,
  };

  if (password) {
    payload.password = password;
  }

  return payload;
};

export const normalizeCategoryPayload = (input = {}) => ({
  category_name: trimRequired(input.category_name, "nombre del rubro"),
  alt_text: trimOrNull(input.alt_text),
  category_img: trimOrNull(input.category_img),
  category_img_hover: trimOrNull(input.category_img_hover),
});

export const normalizeCustomersQuery = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(query.pageSize ?? "20", 10) || 20),
  );

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    search: trimOrNull(query.search),
  };
};
