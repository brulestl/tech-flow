import { create } from 'zustand';
import { useAuth } from './useAuth';
import { useResources } from './useResources';
import { useCollections } from './useCollections';
import { useTags } from './useTags';

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: 'resources' | 'collections' | 'tags';
  setActiveView: (view: 'resources' | 'collections' | 'tags') => void;
  selectedResourceId: string | null;
  setSelectedResourceId: (id: string | null) => void;
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  selectedTagId: string | null;
  setSelectedTagId: (id: string | null) => void;
}

const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeView: 'resources',
  setActiveView: (view) => set({ activeView: view }),
  selectedResourceId: null,
  setSelectedResourceId: (id) => set({ selectedResourceId: id }),
  selectedCollectionId: null,
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),
  selectedTagId: null,
  setSelectedTagId: (id) => set({ selectedTagId: id })
}));

export function useAppState() {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    selectedResourceId,
    setSelectedResourceId,
    selectedCollectionId,
    setSelectedCollectionId,
    selectedTagId,
    setSelectedTagId
  } = useAppStore();

  const { user, isAuthenticated } = useAuth();
  const { resources, loading: resourcesLoading } = useResources();
  const { collections, loading: collectionsLoading } = useCollections();
  const { tags, loading: tagsLoading } = useTags();

  const loading = resourcesLoading || collectionsLoading || tagsLoading;

  const selectedResource = resources.find((r) => r.id === selectedResourceId) || null;
  const selectedCollection = collections.find((c) => c.id === selectedCollectionId) || null;
  const selectedTag = tags.find((t) => t.id === selectedTagId) || null;

  return {
    user,
    isAuthenticated,
    loading,
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    selectedResource,
    selectedResourceId,
    setSelectedResourceId,
    selectedCollection,
    selectedCollectionId,
    setSelectedCollectionId,
    selectedTag,
    selectedTagId,
    setSelectedTagId
  };
} 