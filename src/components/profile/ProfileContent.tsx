"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile, getFromStorage, setToStorage } from '@/lib/utils';
import { Edit2, Trophy, BookOpen, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const AccountConnections = dynamic(() => import('@/components/AccountConnections'), {
  ssr: false
});

interface ProfileContentProps {
  onEdit?: () => void;
  onUpdate?: (profile: UserProfile) => void;
  isLoading?: boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  onEdit,
  onUpdate,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  
  const profile = editedProfile || getFromStorage<UserProfile>('profile') || {
    name: 'Anonymous User',
    streak: 0,
    flashcardsMastered: 0,
    activeSessions: 0,
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
    onEdit?.();
  };

  const handleSave = () => {
    if (editedProfile) {
      setToStorage('profile', editedProfile);
      onUpdate?.(editedProfile);
    }
    setIsEditing(false);
    setEditedProfile(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="grid gap-8">
        {/* Profile Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Resources Saved</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Collections</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Study Sessions</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <AccountConnections />
      </div>
    </div>
  );
};

export default ProfileContent; 