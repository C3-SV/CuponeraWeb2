import { apiRequest } from "../../lib/apiClient";

const withSearch = (path, search = "") => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  return params.size > 0 ? `${path}?${params.toString()}` : path;
};

export const listAdminUsers = async (accessToken, { search = "" } = {}) =>
  apiRequest(withSearch("/admin/users", search), { accessToken });

export const createAdminUser = async (accessToken, payload) =>
  apiRequest("/admin/users", {
    method: "POST",
    accessToken,
    body: payload,
  });

export const updateAdminUser = async (accessToken, userId, payload) =>
  apiRequest(`/admin/users/${userId}`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });

export const deleteAdminUser = async (accessToken, userId) =>
  apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
    accessToken,
  });

export const listCategoriesAdmin = async (accessToken, { search = "" } = {}) =>
  apiRequest(withSearch("/admin/categories", search), { accessToken });

export const createCategory = async (accessToken, payload) =>
  apiRequest("/admin/categories", {
    method: "POST",
    accessToken,
    body: payload,
  });

export const updateCategory = async (accessToken, categoryId, payload) =>
  apiRequest(`/admin/categories/${categoryId}`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });

export const deleteCategory = async (accessToken, categoryId) =>
  apiRequest(`/admin/categories/${categoryId}`, {
    method: "DELETE",
    accessToken,
  });

export const listCustomers = async (
  accessToken,
  { page = 1, pageSize = 20, search = "" } = {},
) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search) params.set("search", search);

  return apiRequest(`/admin/customers?${params.toString()}`, { accessToken });
};
