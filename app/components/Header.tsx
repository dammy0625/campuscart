"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, Bell, UserCircle, Home } from "lucide-react"
import Image from "next/image"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch(`${API_URL}/search?query=${searchQuery}`)
        const results = await response.json()
        console.log(results) // Replace with desired action (e.g., update UI or navigate)
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? "border-b" : ""}`}
        >
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.jpg"
                            alt="Campus Cart"
                            width={400}
                            height={50}
                            className="h-10 w-auto md:h-12"
                        />
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <form onSubmit={handleSearch} className="relative w-full max-w-[200px] md:max-w-[300px]">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search listings..."
                            className="pl-8 pr-4 h-9"
                        />
                    </form>
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
            
        </header>
    )
}
