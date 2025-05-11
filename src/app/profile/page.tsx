'use client';

import React from "react"
import ProfileContent from "./ProfileContent"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>
      
      <ProfileContent />
    </div>
  )
}
