import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

type Layout = 'grid' | 'list';

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  mainContentWidth: number;
  setMainContentWidth: (width: number) => void;
}

const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layout: 'grid',
      setLayout: (layout) => {
        set({ layout });
        // Store in sessionStorage for persistence during the session
        sessionStorage.setItem('layout', layout);
      },
      sidebarWidth: 280,
      setSidebarWidth: (width) => {
        set({ sidebarWidth: width });
        sessionStorage.setItem('sidebarWidth', width.toString());
      },
      mainContentWidth: 800,
      setMainContentWidth: (width) => {
        set({ mainContentWidth: width });
        sessionStorage.setItem('mainContentWidth', width.toString());
      }
    }),
    {
      name: 'layout-storage'
    }
  )
);

export function useLayout() {
  const {
    layout,
    setLayout,
    sidebarWidth,
    setSidebarWidth,
    mainContentWidth,
    setMainContentWidth
  } = useLayoutStore();

  // Initialize from sessionStorage on mount
  React.useEffect(() => {
    const savedLayout = sessionStorage.getItem('layout') as 'grid' | 'list'
    const savedSidebarWidth = sessionStorage.getItem('sidebarWidth')
    const savedMainContentWidth = sessionStorage.getItem('mainContentWidth')

    if (savedLayout) setLayout(savedLayout)
    if (savedSidebarWidth) setSidebarWidth(parseInt(savedSidebarWidth))
    if (savedMainContentWidth) setMainContentWidth(parseInt(savedMainContentWidth))
  }, [])

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  return {
    layout,
    setLayout,
    toggleLayout,
    sidebarWidth,
    setSidebarWidth,
    mainContentWidth,
    setMainContentWidth
  };
} 