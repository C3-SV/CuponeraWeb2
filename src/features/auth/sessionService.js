import { apiRequest } from "../../lib/apiClient";

export const fetchCurrentSessionProfile = async (accessToken) =>
  apiRequest("/auth/me", { accessToken });

export const updateCurrentSessionProfile = async (accessToken, payload) =>
  apiRequest("/auth/me", {
    method: "PATCH",
    accessToken,
    body: payload,
  });
