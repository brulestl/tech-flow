import { useEffect, useCallback } from 'react';
import { useTagStore } from '@/lib/stores/tagStore';
import { useAuth } from './useAuth';
import { Database } from '@/lib/database.types';

type Tag = Database['public']['Tables']['tags']['Row'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];

export function useTags() {
  const { user } = useAuth();
  const {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    addTagToResource,
    removeTagFromResource,
    clearError
  } = useTagStore();

  // Fetch tags when user changes
  useEffect(() => {
    if (user) {
      fetchTags();
    }
  }, [user, fetchTags]);

  const handleCreateTag = useCallback(async (tag: Omit<TagInsert, 'id'>) => {
    if (!user) throw new Error('User must be authenticated');
    await createTag(tag);
  }, [user, createTag]);

  const handleAddTagToResource = useCallback(async (resourceId: string, tagId: string) => {
    if (!user) throw new Error('User must be authenticated');
    await addTagToResource(resourceId, tagId);
  }, [user, addTagToResource]);

  const handleRemoveTagFromResource = useCallback(async (resourceId: string, tagId: string) => {
    if (!user) throw new Error('User must be authenticated');
    await removeTagFromResource(resourceId, tagId);
  }, [user, removeTagFromResource]);

  return {
    tags,
    loading,
    error,
    createTag: handleCreateTag,
    addTagToResource: handleAddTagToResource,
    removeTagFromResource: handleRemoveTagFromResource,
    clearError
  };
} 