"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import Cookies from "js-cookie";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
  login: async () => false,
  logout: () => {},
  checkAuth: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const checkAuth = useCallback(async (): Promise<boolean> => {
    setLoading(true); // Ensure loading starts
    
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
      });
  
      if (!response.ok) throw new Error("Session expired");
  
      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  }, []);
  

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      Cookies.set("jwt", data.token, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/profile"); // Redirect to login (or any desired page)
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
