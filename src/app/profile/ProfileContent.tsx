"use client"

import React, { useState, useEffect } from "react"
import { UserProfile, getFromStorage, setToStorage, generateMockData } from "@/lib/utils"
import { motion } from "framer-motion"
import { User, Edit, Flame, Star, Calendar } from "lucide-react"
import EditProfileSheet from "@/components/profile/EditProfileSheet"
import Image from "next/image"

export default function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    streak: 0,
    flashcardsMastered: 0,
    activeSessions: 0
  })
  
  useEffect(() => {
    // Generate mock data if none exists
    generateMockData()
    
    const userProfile = getFromStorage<UserProfile>('profile', {
      name: "Dev User",
      streak: 5,
      flashcardsMastered: 42,
      activeSessions: 2
    })
    
    setProfile(userProfile)
  }, [])
  
  return (
    <div className="space-y-8">
      {/* Profile card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-accent">
              {profile.avatar ? (
                <Image 
                  src={profile.avatar} 
                  alt={profile.name} 
                  width={96} 
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary bg-opacity-10">
                  <User size={36} className="text-primary" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground">
              <Edit size={14} />
            </button>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">Tech enthusiast & developer</p>
            <div className="flex gap-6 mt-3">
              <div className="flex items-center gap-1.5">
                <Flame size={16} className="text-accent-purple" />
                <span className="text-sm">{profile.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-accent-blue" />
                <span className="text-sm">{profile.flashcardsMastered} cards mastered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-accent-green" />
                <span className="text-sm">{profile.activeSessions} active sessions</span>
              </div>
            </div>
          </div>
          
          <div className="ml-auto">
            <EditProfileSheet />
          </div>
        </div>
      </div>
      
      {/* Stats and preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-lg font-bold mb-4">Learning Stats</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Streak</span>
                <span className="font-medium">{profile.streak} days</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div 
                  className="bg-accent-purple h-2 rounded-full" 
                  style={{ width: `${Math.min(profile.streak * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Flashcards Mastered</span>
                <span className="font-medium">{profile.flashcardsMastered} / 100</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div 
                  className="bg-accent-blue h-2 rounded-full" 
                  style={{ width: `${Math.min(profile.flashcardsMastered, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sessions Completed</span>
                <span className="font-medium">12</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div 
                  className="bg-accent-green h-2 rounded-full" 
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
          
          <button className="btn btn-ghost mt-6 w-full">View Detailed Stats</button>
        </div>
        
        <div className="card p-5">
          <h3 className="text-lg font-bold mb-4">Study Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Default Study Session Length</label>
              <select className="search-bar">
                <option>25 minutes (Pomodoro)</option>
                <option>15 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Background Sound</label>
              <select className="search-bar">
                <option>Lo-Fi Beats</option>
                <option>White Noise</option>
                <option>Nature Sounds</option>
                <option>None</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Daily Reminders</label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </div>
          </div>
          
          <button className="btn btn-primary mt-6 w-full">Save Preferences</button>
        </div>
      </div>
      
      {/* Session history */}
      <div className="card p-5">
        <h3 className="text-lg font-bold mb-4">Recent Sessions</h3>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="font-medium">React Hooks Deep Dive</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(Date.now() - (index * 86400000)).toLocaleDateString()} • 25 minutes • 5 resources
                </p>
              </div>
              <button className="text-primary text-sm">Resume</button>
            </div>
          ))}
        </div>
        
        <button className="btn btn-ghost mt-4 w-full">View All Sessions</button>
      </div>
    </div>
  )
}
