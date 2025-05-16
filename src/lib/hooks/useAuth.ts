import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, loading, error, signIn, signUp, signOut, updateProfile, clearError } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user data
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user:', error);
              return;
            }
            useAuthStore.setState({ user: data });
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        useAuthStore.setState({ user: data });
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.setState({ user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearError,
    isAuthenticated: !!user
  };
} 