import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: UserUpdate) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!authUser) throw new Error('No user found');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) throw userError;
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) throw signUpError;
      if (!authUser) throw new Error('No user found');

      const newUser: UserInsert = {
        id: authUser.id,
        email: authUser.email!,
        full_name: fullName,
        role: 'user'
      };

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (userError) throw userError;
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProfile: async (updates: UserUpdate) => {
    set({ loading: true, error: null });
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', get().user?.id)
        .select()
        .single();

      if (error) throw error;
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null })
})); 