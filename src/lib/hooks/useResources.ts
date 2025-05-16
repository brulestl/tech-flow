import { useEffect, useCallback } from 'react';
import { useResourceStore } from '@/lib/stores/resourceStore';
import { useAuth } from './useAuth';
import { Database } from '@/lib/database.types';

type Resource = Database['public']['Tables']['resources']['Row'];
type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
type ResourceUpdate = Database['public']['Tables']['resources']['Update'];

export function useResources() {
  const { user } = useAuth();
  const {
    resources,
    loading,
    error,
    searchQuery,
    searchResults,
    selectedResource,
    setSearchQuery,
    searchResources,
    fetchResources,
    fetchResourceById,
    createResource,
    updateResource,
    deleteResource,
    clearError
  } = useResourceStore();

  // Fetch resources when user changes
  useEffect(() => {
    if (user) {
      fetchResources();
    }
  }, [user, fetchResources]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchResources();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchResources]);

  const handleCreateResource = useCallback(async (resource: Omit<ResourceInsert, 'user_id'>) => {
    if (!user) throw new Error('User must be authenticated');
    await createResource({ ...resource, user_id: user.id });
  }, [user, createResource]);

  const handleUpdateResource = useCallback(async (id: string, updates: ResourceUpdate) => {
    if (!user) throw new Error('User must be authenticated');
    await updateResource(id, updates);
  }, [user, updateResource]);

  const handleDeleteResource = useCallback(async (id: string) => {
    if (!user) throw new Error('User must be authenticated');
    await deleteResource(id);
  }, [user, deleteResource]);

  return {
    resources,
    loading,
    error,
    searchQuery,
    searchResults,
    selectedResource,
    setSearchQuery,
    createResource: handleCreateResource,
    updateResource: handleUpdateResource,
    deleteResource: handleDeleteResource,
    fetchResourceById,
    clearError
  };
} 