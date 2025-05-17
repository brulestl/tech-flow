"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile, getFromStorage, setToStorage } from '@/lib/utils';
import { Edit2, Trophy, BookOpen, Clock } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.name}
              className="w-16 h-16 rounded-full"
            />
            {isEditing ? (
              <Input
                value={editedProfile?.name || ''}
                onChange={(e) =>
                  setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : null)
                }
                className="w-48"
              />
            ) : (
              <h2 className="text-2xl font-bold">{profile.name}</h2>
            )}
          </div>
          {isEditing ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{profile.streak} day streak</p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{profile.flashcardsMastered} mastered</p>
                <p className="text-xs text-muted-foreground">Flashcards</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{profile.activeSessions} active</p>
                <p className="text-xs text-muted-foreground">Study Sessions</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {profile.streak >= 5 && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  5 Day Streak
                </div>
              )}
              {profile.flashcardsMastered >= 40 && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Flashcard Master
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileContent; 