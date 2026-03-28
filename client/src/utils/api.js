import { API_BASE_URL } from "./constants.js";

/**
 * Make API requests with automatic JSON parsing and error handling
 */
export const apiRequest = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

/**
 * Auth API calls
 */
export const authAPI = {
  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: payload,
    }),

  getProfile: (token) =>
    apiRequest("/auth/me", { token }),

  updatePreferences: (token, preferences) =>
    apiRequest("/users/me/preferences", {
      method: "PATCH",
      token,
      body: preferences,
    }),
};
