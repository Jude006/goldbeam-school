import { createContext, useContext, useEffect, useState } from "react";
import {
  getMe,
  loginAdmin as loginAdminApi,
  loginStudent as loginStudentApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    const restore = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [token]);

  const loginAdmin = async (email, password) => {
    const data = await loginAdminApi(email, password);

    if (!data.success || data.user?.role !== "admin") {
      throw new Error(data.message || "Not authorized as admin.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const loginStudent = async (admissionNumber, password) => {
    const data = await loginStudentApi(admissionNumber, password);

    if (!data.success || data.user?.role !== "student") {
      throw new Error(data.message || "Login failed.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    loginAdmin,
    loginStudent,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
