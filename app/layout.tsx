

import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from 'next-themes'
import Header from "./components/Header"
import Footer from "./components/Footer"
import MobileNav from "./components/MobileNav"
import type React from "react"
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";



const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Campus-Cart",
  description: "making exchange of items among univerity students seamless",
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
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <Toaster position="top-right" richColors />
          <div className="flex-1">
            <main className="container mx-auto pb-24 px-4 py-8">{children}</main>
          </div>
          <MobileNav />
          <Footer />
        </div>
        </ThemeProvider>
      </body>
    </html>
    </AuthProvider>
    
  )
}

