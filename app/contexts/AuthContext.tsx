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

// Helper function to make authenticated requests with fallback
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  // First try with credentials (cookies)
  let response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // If unauthorized and we have a sessionStorage token, try with Authorization header
  if (response.status === 401 && typeof window !== 'undefined' && sessionStorage.getItem('mobile_jwt')) {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem('mobile_jwt')}`,
        ...options.headers,
      },
    });
  }

  return response;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

   // Handle mobile token from URL (for Safari mobile)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mobileToken = urlParams.get('mobile_token');
      
      if (mobileToken) {
        // Store token in sessionStorage for mobile Safari
        sessionStorage.setItem('mobile_jwt', mobileToken);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Force auth check after storing token
        checkAuth();
      }
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    setLoading(true); // Ensure loading starts
    
    try {
      const response = await makeAuthenticatedRequest(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
      });
  
      if (!response.ok) throw new Error("Session expired");
  
      const data = await response.json();
      setUser(data.user || data );
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error: unknown
     ) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  }, [API_URL]);
  

  useEffect(() => {
    checkAuth();
   }, [checkAuth]);

   const login = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      

      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error: unknown) {
      if(error instanceof Error){
        setError(error.message);
      }else{
        setError("An unknown error occured")
      }
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

       // Clear mobile token if it exists
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mobile_jwt');
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
