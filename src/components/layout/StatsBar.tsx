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
        
        // Get flashcards mastered count
        const { count: masteredCount, error: masteredError } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('difficulty_level', 5)
        
        if (masteredError) throw masteredError
        
        // Try to get study session stats, but don't fail if the table doesn't exist
        let streak = 0
        let activeSessions = 0
        
        try {
          const { data: sessions, error: sessionsError } = await supabase
            .from('study_sessions')
            .select('streak_days')
            .order('started_at', { ascending: false })
            .limit(1)
            .single()
          
          if (!sessionsError) {
            streak = sessions?.streak_days || 0
          }
          
          const { count: activeCount, error: activeError } = await supabase
            .from('study_sessions')
            .select('*', { count: 'exact', head: true })
            .is('ended_at', null)
          
          if (!activeError) {
            activeSessions = activeCount || 0
          }
        } catch (err) {
          // Ignore errors related to missing study_sessions table
          console.log('Study sessions not available yet')
        }
        
        setStats({
          streak,
          flashcardsMastered: masteredCount || 0,
          activeSessions
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
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border animate-pulse">
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-500" />
        <span className="font-medium">{stats.streak} day streak</span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <span className="font-medium">{stats.flashcardsMastered} mastered</span>
      </div>
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-blue-500" />
        <span className="font-medium">{stats.activeSessions} active sessions</span>
      </div>
    </div>
  )
}
