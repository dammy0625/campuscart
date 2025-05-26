"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { AuthProvider } from "./contexts/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
    </AuthProvider>
  )
}

