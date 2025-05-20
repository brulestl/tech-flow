"use client"

import React, { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Search, Bell, UserCircle, LogOut, ChevronDown } from "lucide-react"
import SearchBar from "@/components/ui/SearchBar"
import { Suspense } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { useSession } from "@supabase/auth-helpers-react"
import { Spinner } from "@/components/ui/Spinner"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const sessHook = useSession()
  const session = sessHook?.data
  const status = sessHook?.status
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  if (status === "loading") {
    return <Spinner />
  }
  
  if (!session) {
    return <div>Please log in</div>
  }

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <SearchBar />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-ghost btn-sm"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            
            <button className="btn btn-ghost btn-sm">
              <Bell size={20} />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-ghost btn-sm flex items-center gap-2"
              >
                <UserCircle size={20} />
                <span>{session?.user?.email}</span>
                <ChevronDown size={16} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                    >
                      <LogOut size={16} className="mr-2 inline" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
