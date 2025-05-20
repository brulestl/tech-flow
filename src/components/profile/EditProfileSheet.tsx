'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  streak: number;
  flashcardsMastered: number;
  activeSessions: number;
}

interface EditProfileSheetProps {
  profile: UserProfile;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
}

export default function EditProfileSheet({ profile, onProfileUpdate }: EditProfileSheetProps) {
  const [name, setName] = useState(profile.name || '');
  const [avatar, setAvatar] = useState<string>(profile.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.name || '');
    setAvatar(profile.avatar || '');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const updates: Partial<UserProfile> = { name, avatar };
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);
      if (error) throw error;
      onProfileUpdate(updates);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Settings size={16} className="mr-2" />
          Edit Profile
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="mb-2 p-2 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
          )}
          <div className="space-y-2">
            <label htmlFor="avatar" className="text-sm font-medium block">
              Avatar URL
            </label>
            <input
              id="avatar"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="search-bar w-full"
              placeholder="https://..."
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium block">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="search-bar w-full"
              placeholder="Your name"
              disabled={isSaving}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
