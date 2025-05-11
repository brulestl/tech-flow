"use client"

import React, { useEffect, useState } from "react"
import { Flame, Star, Bookmark } from "lucide-react"
import { getFromStorage, UserProfile, generateMockData } from "@/lib/utils"

export default function StatsBar() {
  const [stats, setStats] = useState<UserProfile>({
    name: "",
    streak: 0,
    flashcardsMastered: 0,
    activeSessions: 0
  })

  useEffect(() => {
    // Generate mock data if none exists
    generateMockData()
    
    const profile = getFromStorage<UserProfile>('profile', {
      name: "Dev User",
      streak: 5,
      flashcardsMastered: 42,
      activeSessions: 2
    })
    
    setStats(profile)
  }, [])

  return (
    <div className="flex items-center justify-between px-6 py-2 text-sm">
      <div className="flex items-center gap-6">
        <div className="stat-item flex-row gap-2">
          <Flame className="h-4 w-4 text-accent-purple" />
          <span className="font-medium">{stats.streak} day streak</span>
        </div>
        
        <div className="stat-item flex-row gap-2">
          <Star className="h-4 w-4 text-accent-blue" />
          <span className="font-medium">{stats.flashcardsMastered} cards mastered</span>
        </div>
        
        <div className="stat-item flex-row gap-2">
          <Bookmark className="h-4 w-4 text-accent-green" />
          <span className="font-medium">{stats.activeSessions} active sessions</span>
        </div>
      </div>
      
      <div>
        <button className="text-primary hover:underline">
          Start session
        </button>
      </div>
    </div>
  )
}
