import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      setLayout: (layout) => set({ layout }),
      sidebarWidth: 280,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      mainContentWidth: 800,
      setMainContentWidth: (width) => set({ mainContentWidth: width })
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