"use client"

import React from "react"
import { useTheme } from "@/components/theme-provider"
import { Search, Bell, UserCircle } from "lucide-react"
import SearchBar from "@/components/ui/SearchBar"
import { Suspense } from "react"

export default function Header() {
  const { theme, setTheme } = useTheme()
  
  return (
    <header className="border-b border-border py-3 px-4 md:px-6 flex items-center justify-between">
      {/* Mobile title - shown only on mobile */}
      <h1 className="text-xl font-bold md:hidden">TechVault</h1>
      
      {/* Search bar - shown on all devices */}
      <div className="hidden md:flex flex-1 max-w-xl">
        <Suspense fallback={<div className="search-bar">Loading search...</div>}>
          <SearchBar />
        </Suspense>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-accent">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 hover:bg-accent p-1 px-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <UserCircle size={20} className="text-primary" />
            </div>
            <span className="hidden md:inline text-sm font-medium">Dev User</span>
          </button>
        </div>
      </div>
    </header>
  )
}
