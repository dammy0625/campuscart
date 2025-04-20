"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, PlusCircle, UserCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-between border border-border/40 backdrop-blur-md bg-white/30 dark:bg-black/30 py-2 px-2 shadow-lg rounded-2xl">
      <Link href="/" className="flex-1 mx-[2px]">
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant={pathname === "/" ? "default" : "ghost"}
          size="sm"
          className={`flex flex-col items-center justify-center h-auto py-1 w-full ${pathname === "/" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white transition-colors"}`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
          {pathname === "/" && <span className="w-1.5 h-1.5 mt-1 rounded-full bg-white" />}

        </Button>
        </motion.div>
      </Link>
      <Link href="/post-listing" className="flex-1 mx-[2px]">
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant={pathname === "/post-listing" ? "default" : "ghost"}
          size="sm"
          className={`flex flex-col items-center justify-center h-auto py-1 w-full ${pathname === "/post-listing" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white transition-colors"}`}
        >
          <PlusCircle className="h-5 w-5 mb-1" />
          <span className="text-xs">Post</span>
          {pathname === "/" && <span className="w-1.5 h-1.5 mt-1 rounded-full bg-white" />}

        </Button>
        </motion.div>
      </Link>
      <Link href="/dashboard" className="flex-1 mx-[2px]">
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant={pathname === "/dashboard" ? "default" : "ghost"}
          size="sm"
          className={`flex flex-col items-center justify-center h-auto py-1 w-full ${pathname === "/dashboard" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white transition-colors"}`}
        >
          <UserCircle className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
          {pathname === "/" && <span className="w-1.5 h-1.5 mt-1 rounded-full bg-white" />}
        </Button>
        </motion.div>
      </Link>
    </nav>
  )
}
