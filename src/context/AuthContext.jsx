import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, getMe } from "../services/authService";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  pegawai_sarpras: "/",
  janitor: "/janitor",
  peminjam: "/peminjam",
};

export const ROLE_LABEL = {
  pegawai_sarpras: "Pegawai Sarpras",
  janitor: "Janitor",
  peminjam: "Peminjam",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
