// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loginAsAdmin: () => void;
  loginAsUser: () => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const adminUser: User = {
  id: "u1",
  name: "מנהל",
  email: "admin@barak-insurance.local",
  role: "admin",
};

const regularUser: User = {
  id: "u2",
  name: "עובד",
  email: "user@barak-insurance.local",
  role: "user",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(adminUser);

  const loginAsAdmin = () => setUser(adminUser);
  const loginAsUser = () => setUser(regularUser);
  const logout = () => setUser(null);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loginAsAdmin, loginAsUser, logout, isAdmin }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
