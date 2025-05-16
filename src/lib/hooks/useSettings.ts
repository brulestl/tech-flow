import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  showPreview: boolean;
  autoSave: boolean;
  defaultView: 'resources' | 'collections' | 'tags';
  defaultLayout: 'grid' | 'list';
  defaultTheme: 'light' | 'dark' | 'system';
  defaultSidebarWidth: number;
  defaultMainContentWidth: number;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  showPreview: true,
  autoSave: true,
  defaultView: 'resources',
  defaultLayout: 'grid',
  defaultTheme: 'system',
  defaultSidebarWidth: 280,
  defaultMainContentWidth: 800
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'settings-storage'
    }
  )
);

export function useSettings() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const togglePreview = () => {
    updateSettings({ showPreview: !settings.showPreview });
  };

  const toggleAutoSave = () => {
    updateSettings({ autoSave: !settings.autoSave });
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    togglePreview,
    toggleAutoSave
  };
} 