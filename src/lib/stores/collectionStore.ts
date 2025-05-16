import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Collection = Database['public']['Tables']['collections']['Row'];
type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
type CollectionUpdate = Database['public']['Tables']['collections']['Update'];

interface CollectionState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  selectedCollection: Collection | null;
  
  // Actions
  fetchCollections: () => Promise<void>;
  fetchCollectionById: (id: string) => Promise<void>;
  createCollection: (collection: CollectionInsert) => Promise<void>;
  updateCollection: (id: string, collection: CollectionUpdate) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addResourceToCollection: (collectionId: string, resourceId: string) => Promise<void>;
  removeResourceFromCollection: (collectionId: string, resourceId: string) => Promise<void>;
  clearError: () => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  loading: false,
  error: null,
  selectedCollection: null,

  fetchCollections: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ collections: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCollectionById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          resources:resource_collections(
            resource:resources(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedCollection: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCollection: async (collection: CollectionInsert) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert(collection)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        collections: [data, ...state.collections],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateCollection: async (id: string, collection: CollectionUpdate) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('collections')
        .update(collection)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? data : c)),
        selectedCollection: data,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCollection: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        selectedCollection: null,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addResourceToCollection: async (collectionId: string, resourceId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resource_collections')
        .insert({
          collection_id: collectionId,
          resource_id: resourceId
        });

      if (error) throw error;
      await get().fetchCollectionById(collectionId);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeResourceFromCollection: async (collectionId: string, resourceId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resource_collections')
        .delete()
        .match({
          collection_id: collectionId,
          resource_id: resourceId
        });

      if (error) throw error;
      await get().fetchCollectionById(collectionId);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null })
})); 