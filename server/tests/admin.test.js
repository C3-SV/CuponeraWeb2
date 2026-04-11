import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeAdminUserPayload,
  normalizeCategoryPayload,
  normalizeCustomersQuery,
} from "../src/modules/admin/admin.validators.js";
import { getBearerToken } from "../src/lib/auth.js";
import { buildProfileSeedFromAuthUser } from "../src/modules/auth/auth.helpers.js";

test("normalizeAdminUserPayload trims data and defaults role for new admins", () => {
  const payload = normalizeAdminUserPayload({
    email: "  admin@example.com ",
    password: "secret123",
    first_names: " Ada ",
    last_names: " Lovelace ",
    phone: " 71234567 ",
    dui: " 123456789 ",
    address: "  San Salvador ",
  });

  assert.deepEqual(payload, {
    email: "admin@example.com",
    password: "secret123",
    first_names: "Ada",
    last_names: "Lovelace",
    phone: "71234567",
    dui: "123456789",
    address: "San Salvador",
    role: "admin.general",
    is_active: true,
  });
});

test("normalizeAdminUserPayload rejects invalid email and weak passwords", () => {
  assert.throws(
    () =>
      normalizeAdminUserPayload({
        email: "correo-invalido",
        password: "123",
        first_names: "Ada",
        last_names: "Lovelace",
      }),
    /correo/i,
  );
});

test("normalizeCategoryPayload keeps optional image fields nullable", () => {
  const payload = normalizeCategoryPayload({
    category_name: " Restaurantes ",
    alt_text: " Comida ",
    category_img: "",
    category_img_hover: " hover/restaurantes.svg ",
  });

  assert.deepEqual(payload, {
    category_name: "Restaurantes",
    alt_text: "Comida",
    category_img: null,
    category_img_hover: "hover/restaurantes.svg",
  });
});

test("normalizeCustomersQuery parses pagination and search", () => {
  const query = normalizeCustomersQuery({
    page: "3",
    pageSize: "25",
    search: "  juan  ",
  });

  assert.deepEqual(query, {
    page: 3,
    pageSize: 25,
    offset: 50,
    search: "juan",
  });
});

test("getBearerToken extracts bearer token from authorization header", () => {
  assert.equal(
    getBearerToken({ authorization: "Bearer abc.def.ghi" }),
    "abc.def.ghi",
  );
});

test("getBearerToken rejects malformed authorization header", () => {
  assert.equal(getBearerToken({ authorization: "Basic 123" }), null);
  assert.equal(getBearerToken({}), null);
});

test("buildProfileSeedFromAuthUser normalizes legacy user metadata", () => {
  const profile = buildProfileSeedFromAuthUser({
    id: "user-1",
    email: "cliente@example.com",
    user_metadata: {
      name: "Grace",
      lastname: "Hopper",
      phone: "71234567",
      dui: "123456789",
      address: "San Salvador",
    },
  });

  assert.deepEqual(profile, {
    user_id: "user-1",
    email: "cliente@example.com",
    first_names: "Grace",
    last_names: "Hopper",
    phone: "71234567",
    dui: "123456789",
    address: "San Salvador",
    role: "customer",
    is_active: true,
    deleted_at: null,
  });
});
