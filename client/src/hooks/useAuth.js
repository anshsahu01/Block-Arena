import { useEffect, useState } from "react";
import { authAPI } from "../utils/api.js";

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user on token change
  useEffect(() => {
    const hydrateUser = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const data = await authAPI.getProfile(token);
        setUser(data.user);
      } catch {
        localStorage.removeItem("accessToken");
        setToken("");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateUser();
  }, [token]);

  const register = async (payload) => {
    const data = await authAPI.register(payload);
    localStorage.setItem("accessToken", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (payload) => {
    const data = await authAPI.login(payload);
    localStorage.setItem("accessToken", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const updatePreferences = async (preferences) => {
    const data = await authAPI.updatePreferences(token, preferences);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken("");
    setUser(null);
  };

  return {
    token,
    user,
    isLoading,
    isLoggedIn: Boolean(token && user),
    hasColorPreference: Boolean(user?.color),
    register,
    login,
    updatePreferences,
    logout,
  };
};
