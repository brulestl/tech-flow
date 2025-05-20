"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from "@supabase/ssr"
import { log } from '@/lib/logger'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      log('Session in RequireAuth:', session)
      if (!session) {
        log('No session found, redirecting to login')
        router.push('/login')
      }
    }
    checkSession()
  }, [router, supabase])

  return <>{children}</>
} 