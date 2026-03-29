import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setTokens, clearTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!user;
  const isAdoptant = user?.profile?.user_type === "ADOPTANT";
  const isObservateur = user?.profile?.user_type === "OBSERVATEUR";

  async function login(username, password) {
    setLoading(true);
    try {
      const tokens = await api.login(username, password);
      setTokens(tokens.access, tokens.refresh);

      // Fetch user info via a simple GET — we store what we know
      const userData = { username, profile: { user_type: tokens.user_type || "ADOPTANT" } };
      // The token response from simplejwt doesn't include user_type by default,
      // so we store what we got from register or decode JWT
      try {
        const payload = JSON.parse(atob(tokens.access.split(".")[1]));
        userData.id = payload.user_id;
      } catch {}

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }

  async function register(data) {
    setLoading(true);
    try {
      const res = await api.register(data);
      // Auto-login after register
      const tokens = await api.login(data.username, data.password);
      setTokens(tokens.access, tokens.refresh);

      const userData = {
        id: res.user?.id,
        username: data.username,
        email: data.email,
        profile: { user_type: data.user_type || "ADOPTANT" },
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  function updateUser(updates) {
    const updated = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isAdoptant, isObservateur, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
