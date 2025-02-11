"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, Bell, UserCircle, Home } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? "border-b" : ""}`}
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/campus.jpg-gQaTGPwBaoeEuj0o1hqMsjaGMTdyFv.jpeg"
              alt="Campus Cart"
              width={200}
              height={50}
              className="h-10 w-auto md:h-12"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full max-w-[200px] md:max-w-[300px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-8 pr-4 h-9" />
          </div>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/post-listing" className="hidden md:inline-flex">
            <Button className="bg-white text-black hover:bg-black hover:text-white transition-colors whitespace-nowrap">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Listing
            </Button>
          </Link>
          <Link href="/profile">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <UserCircle className="h-5 w-5" />
          </Button>
          </Link>
        </div>
      </div>
      <nav className="md:hidden flex justify-between border-t border-border/40 bg-background py-2 px-2">
        <Link href="/" className="flex-1 mx-[2px]">
          <Button
            variant={pathname === "/" ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center justify-center h-auto py-1 w-full bg-white text-black hover:bg-black hover:text-white transition-colors ${pathname === "/" ? "bg-black text-white" : ""}`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
        </Link>
        <Link href="/post-listing" className="flex-1 mx-[2px]">
          <Button
            variant={pathname === "/post-listing" ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center justify-center h-auto py-1 w-full bg-white text-black hover:bg-black hover:text-white transition-colors ${pathname === "/post-listing" ? "bg-black text-white" : ""}`}
          >
            <PlusCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">Post</span>
          </Button>
        </Link>
        <Link href="/profile" className="flex-1 mx-[2px]">
          <Button
            variant={pathname === "/profile" ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center justify-center h-auto py-1 w-full bg-white text-black hover:bg-black hover:text-white transition-colors ${pathname === "/profile" ? "bg-black text-white" : ""}`}
          >
            <UserCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </Link>
      </nav>
    </header>
  )
}

