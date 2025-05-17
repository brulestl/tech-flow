"use client"

import React, { useEffect, useState } from "react"
import { Flame, Star, Bookmark } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

interface UserStats {
  streak: number
  flashcardsMastered: number
  activeSessions: number
}

export default function StatsBar() {
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    flashcardsMastered: 0,
    activeSessions: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClientComponentClient<Database>()
        
        // Get user's streak from study_sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('streak_days')
          .order('started_at', { ascending: false })
          .limit(1)
          .single()
        
        if (sessionsError) throw sessionsError
        
        // Get flashcards mastered count
        const { count: masteredCount, error: masteredError } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('difficulty_level', 5)
        
        if (masteredError) throw masteredError
        
        // Get active sessions count
        const { count: activeCount, error: activeError } = await supabase
          .from('study_sessions')
          .select('*', { count: 'exact', head: true })
          .is('ended_at', null)
        
        if (activeError) throw activeError
        
        setStats({
          streak: sessions?.streak_days || 0,
          flashcardsMastered: masteredCount || 0,
          activeSessions: activeCount || 0
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-between px-6 py-2 text-sm">
        <div className="flex items-center gap-6">
          <div className="stat-item flex-row gap-2">
            <Flame className="h-4 w-4 text-accent-purple" />
            <span className="font-medium">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

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
