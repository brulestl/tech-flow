import { useEffect, useCallback } from 'react';
import { useCollectionStore } from '@/lib/stores/collectionStore';
import { useAuth } from './useAuth';
import { Database } from '@/lib/database.types';

type Collection = Database['public']['Tables']['collections']['Row'];
type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
type CollectionUpdate = Database['public']['Tables']['collections']['Update'];

export function useCollections() {
  const { user } = useAuth();
  const {
    collections,
    loading,
    error,
    selectedCollection,
    fetchCollections,
    fetchCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addResourceToCollection,
    removeResourceFromCollection,
    clearError
  } = useCollectionStore();

  // Fetch collections when user changes
  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user, fetchCollections]);

  const handleCreateCollection = useCallback(async (collection: Omit<CollectionInsert, 'user_id'>) => {
    if (!user) throw new Error('User must be authenticated');
    await createCollection({ ...collection, user_id: user.id });
  }, [user, createCollection]);

  const handleUpdateCollection = useCallback(async (id: string, updates: CollectionUpdate) => {
    if (!user) throw new Error('User must be authenticated');
    await updateCollection(id, updates);
  }, [user, updateCollection]);

  const handleDeleteCollection = useCallback(async (id: string) => {
    if (!user) throw new Error('User must be authenticated');
    await deleteCollection(id);
  }, [user, deleteCollection]);

  const handleAddResourceToCollection = useCallback(async (collectionId: string, resourceId: string) => {
    if (!user) throw new Error('User must be authenticated');
    await addResourceToCollection(collectionId, resourceId);
  }, [user, addResourceToCollection]);

  const handleRemoveResourceFromCollection = useCallback(async (collectionId: string, resourceId: string) => {
    if (!user) throw new Error('User must be authenticated');
    await removeResourceFromCollection(collectionId, resourceId);
  }, [user, removeResourceFromCollection]);

  return {
    collections,
    loading,
    error,
    selectedCollection,
    fetchCollectionById,
    createCollection: handleCreateCollection,
    updateCollection: handleUpdateCollection,
    deleteCollection: handleDeleteCollection,
    addResourceToCollection: handleAddResourceToCollection,
    removeResourceFromCollection: handleRemoveResourceFromCollection,
    clearError
  };
} 