"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { 
  Home, 
  Search, 
  Clock, 
  FolderOpen, 
  User, 
  Sun, 
  Moon, 
  Settings, 
  Bookmark,
  Code,
  Menu,
  X
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = React.useState(false)
  
  const links = [
    { href: "/", icon: <Home size={20} />, label: "Home" },
    { href: "/recents", icon: <Clock size={20} />, label: "Recents" },
    { href: "/search", icon: <Search size={20} />, label: "Search" },
    { href: "/collections", icon: <FolderOpen size={20} />, label: "Collections" },
    { href: "/profile", icon: <User size={20} />, label: "Profile" }
  ]

  const secondaryLinks = [
    { href: "/bookmarks", icon: <Bookmark size={20} />, label: "Saved" },
    { href: "/code", icon: <Code size={20} />, label: "Code Snippets" },
    { href: "/settings", icon: <Settings size={20} />, label: "Settings" }
  ]

  return (
    <motion.div 
      className={cn(
        "h-screen bg-sidebar-background border-r border-sidebar-border py-4 flex flex-col z-20",
        collapsed ? "w-16" : "w-64"
      )}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 flex items-center justify-between mb-8">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">TV</span>
            </div>
            <span className="font-bold text-xl text-sidebar-primary">TechVault</span>
          </motion.div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="flex-1">
        <div className="space-y-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "sidebar-link",
                pathname === link.href && "active",
                collapsed && "justify-center"
              )}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>
        
        <div className="mt-8 pt-4 border-t border-sidebar-border px-4">
          <p className={cn(
            "text-xs font-medium text-sidebar-foreground mb-2 text-opacity-60",
            collapsed && "text-center"
          )}>
            {!collapsed && "RESOURCES"}
          </p>
          <div className="space-y-1 px-2">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "sidebar-link",
                  pathname === link.href && "active",
                  collapsed && "justify-center"
                )}
              >
                {link.icon}
                {!collapsed && <span>{link.label}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="mt-auto px-4 pt-4 border-t border-sidebar-border">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>
    </motion.div>
  )
}
