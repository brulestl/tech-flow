import { Metadata } from 'next';
import ProfileContent from '@/components/profile/ProfileContent';

export const metadata: Metadata = {
  title: 'Profile | TechVault',
  description: 'Manage your profile and connected accounts',
};

export default function ProfilePage() {
  return <ProfileContent />;
}
