import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

type Resource = Database['public']['Tables']['resources']['Row'];
type NewResource = Database['public']['Tables']['resources']['Insert'];

interface ResourceStore {
  resources: Resource[];
  isLoading: boolean;
  error: Error | null;
  fetchResources: () => Promise<void>;
  addResource: (resource: NewResource) => Promise<void>;
  updateResource: (id: string, data: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  searchResources: (query: string) => Promise<Resource[]>;
  getResourcesByTags: (tags: string[]) => Promise<Resource[]>;
}

export const useResources = create<ResourceStore>((set, get) => ({
  resources: [],
  isLoading: false,
  error: null,

  fetchResources: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ resources: data, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  addResource: async (resource: NewResource) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
        .from('resources')
        .insert(resource)
        .select()
        .single();
      
      if (error) throw error;
      set(state => ({ 
        resources: [data, ...state.resources],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  updateResource: async (id: string, data: Partial<Resource>) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data: updatedResource, error } = await supabase
        .from('resources')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      set(state => ({
        resources: state.resources.map(r => 
          r.id === id ? updatedResource : r
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  deleteResource: async (id: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set(state => ({
        resources: state.resources.filter(r => r.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  searchResources: async (query: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
        .rpc('search_resources', { search_query: query });
      
      if (error) throw error;
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      return [];
    }
  },

  getResourcesByTags: async (tags: string[]) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
        .from('resources')
        .select('*, resource_tags!inner(tag_id)')
        .in('resource_tags.tag_id', tags);
      
      if (error) throw error;
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      return [];
    }
  }
})); 