import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const loggedInUser = await api.login(credentials);
    setUser(loggedInUser);
  };

  const register = async (payload) => {
    const newUser = await api.register(payload);
    setUser(newUser);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  // Re-read the user (and role) from the server — the server is the source
  // of truth.
  const refreshUser = useCallback(async () => {
    try {
      setUser(await api.getMe());
    } catch (error) {
      // Keep the current session on transient failures; a disabled account
      // is rejected by the server on its next request anyway.
      console.error("Failed to refresh user:", error);
    }
  }, []);

  // UI convenience only. Every admin action is re-checked by the backend.
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
