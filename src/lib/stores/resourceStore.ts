import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Resource = Database['public']['Tables']['resources']['Row'];
type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
type ResourceUpdate = Database['public']['Tables']['resources']['Update'];

interface ResourceState {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: Resource[];
  selectedResource: Resource | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  searchResources: () => Promise<void>;
  fetchResources: () => Promise<void>;
  fetchResourceById: (id: string) => Promise<void>;
  createResource: (resource: ResourceInsert) => Promise<void>;
  updateResource: (id: string, resource: ResourceUpdate) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  retrySummary: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: [],
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
  selectedResource: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchResources: async () => {
    const { searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .rpc('search_resources', { search_query: searchQuery });

      if (error) throw error;
      set({ searchResults: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchResources: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ resources: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchResourceById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedResource: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createResource: async (resource: ResourceInsert) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert({
          ...resource,
          summary_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        resources: [data, ...state.resources],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateResource: async (id: string, resource: ResourceUpdate) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(resource)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        resources: state.resources.map((r) => (r.id === id ? data : r)),
        selectedResource: data,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteResource: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        resources: state.resources.filter((r) => r.id !== id),
        selectedResource: null,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  retrySummary: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('resources')
        .update({ summary_status: 'pending' })
        .eq('id', id);

      if (error) throw error;
      await get().fetchResourceById(id);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null })
})); 