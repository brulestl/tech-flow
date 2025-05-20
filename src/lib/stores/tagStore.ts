import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Tag = Database['public']['Tables']['tags']['Row'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTags: () => Promise<void>;
  createTag: (tag: TagInsert) => Promise<void>;
  addTagToResource: (resourceId: string, tagId: string) => Promise<void>;
  removeTagFromResource: (resourceId: string, tagId: string) => Promise<void>;
  clearError: () => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ tags: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTag: async (tag: TagInsert) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        tags: [...state.tags, data].sort((a, b) => a.name.localeCompare(b.name)),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTagToResource: async (resourceId: string, tagId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resource_tags')
        .insert({
          resource_id: resourceId,
          tag_id: tagId
        });

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeTagFromResource: async (resourceId: string, tagId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resource_tags')
        .delete()
        .match({
          resource_id: resourceId,
          tag_id: tagId
        });

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null })
})); 