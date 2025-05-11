'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function EditProfileSheet() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would save the profile
    console.log('Saving profile:', { name, bio, avatar });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
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
          <div className="space-y-2">
            <label htmlFor="avatar" className="text-sm font-medium block">
              Profile Picture
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="search-bar w-full"
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
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium block">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="search-bar w-full min-h-[150px] resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
