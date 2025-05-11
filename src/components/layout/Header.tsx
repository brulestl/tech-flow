"use client"

import React, { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Search, Bell, UserCircle, LogOut, ChevronDown } from "lucide-react"
import SearchBar from "@/components/ui/SearchBar"
import { Suspense } from "react"
import { createBrowserClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useSession } from "@supabase/auth-helpers-react"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const session = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }
  
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
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 hover:bg-accent p-1 px-2 rounded-lg"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <UserCircle size={20} className="text-primary" />
            </div>
            <span className="hidden md:inline text-sm font-medium">
              {session?.user?.email?.split('@')[0] || 'User'}
            </span>
            <ChevronDown className="hidden md:block" size={16} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50">
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
