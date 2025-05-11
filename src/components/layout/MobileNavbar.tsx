"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Home, Search, Clock, FolderOpen, User } from "lucide-react"

export default function MobileNavbar() {
  const pathname = usePathname()
  
  const links = [
    { href: "/", icon: <Home size={20} />, label: "Home" },
    { href: "/recents", icon: <Clock size={20} />, label: "Recents" },
    { href: "/search", icon: <Search size={20} />, label: "Search" },
    { href: "/collections", icon: <FolderOpen size={20} />, label: "Collections" },
    { href: "/profile", icon: <User size={20} />, label: "Profile" }
  ]

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 h-16 bg-sidebar-background border-t border-sidebar-border px-2 flex items-center justify-around z-20"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
            pathname === link.href 
              ? "text-primary" 
              : "text-sidebar-foreground"
          )}
        >
          {link.icon}
          <span className="text-xs">{link.label}</span>
        </Link>
      ))}
    </motion.div>
  )
}
