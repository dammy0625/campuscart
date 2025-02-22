import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"
import type React from "react"
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Student Marketplace",
  description: "Buy and sell items easily among students",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <Toaster position="top-right" richColors />
          <div className="flex-1">
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
    </AuthProvider>
  )
}

