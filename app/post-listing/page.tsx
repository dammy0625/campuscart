// src/contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

// Define the shape of our context
type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
  checkAuth: () => Promise<boolean>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  checkAuth: async () => false
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  // Check if user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    const token = Cookies.get('jwt')
    
    if (!token) {
      setIsAuthenticated(false)
      setLoading(false)
      return false
    }
    
    // You can add token validation logic here
    // For example, check expiration or verify with backend
    
    setIsAuthenticated(true)
    setLoading(false)
    return true
  }

  // Initial auth check
  useEffect(() => {
    checkAuth()
  }, [])

  // Login function
  const login = (token: string) => {
    Cookies.set('jwt', token, {
      expires: 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    })
    setIsAuthenticated(true)
  }

  // Logout function
  const logout = () => {
    Cookies.remove('jwt')
    setIsAuthenticated(false)
    router.push('/profile')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}