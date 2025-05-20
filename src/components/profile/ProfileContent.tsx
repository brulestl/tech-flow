"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/lib/utils';
import { Edit2, Trophy, BookOpen, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

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
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Anonymous User',
    streak: 0,
    flashcardsMastered: 0,
    activeSessions: 0,
  });
  
  const user = useUser();
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // First try to get the profile from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (profileData) {
          setProfile({
            name: profileData.full_name || user.user_metadata?.full_name || 'Anonymous User',
            streak: profileData.streak || 0,
            flashcardsMastered: profileData.flashcards_mastered || 0,
            activeSessions: profileData.active_sessions || 0,
          });
        } else {
          // If no profile exists, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || 'Anonymous User',
              email: user.email,
              streak: 0,
              flashcards_mastered: 0,
              active_sessions: 0,
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            return;
          }

          setProfile({
            name: user.user_metadata?.full_name || 'Anonymous User',
            streak: 0,
            flashcardsMastered: 0,
            activeSessions: 0,
          });
        }
      } catch (error) {
        console.error('Error in profile management:', error);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
    onEdit?.();
  };

  const handleSave = async () => {
    if (editedProfile && user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.name,
          streak: editedProfile.streak,
          flashcards_mastered: editedProfile.flashcardsMastered,
          active_sessions: editedProfile.activeSessions,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      setProfile(editedProfile);
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