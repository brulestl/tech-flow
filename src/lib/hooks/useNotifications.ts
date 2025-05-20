import { create } from 'zustand';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }));

    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }));
      }, notification.duration || 5000);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
  clearNotifications: () => set({ notifications: [] })
}));

export function useNotifications() {
  const { notifications, addNotification, removeNotification, clearNotifications } = useNotificationStore();

  const notify = {
    success: (message: string, duration?: number) =>
      addNotification({ type: 'success', message, duration }),
    error: (message: string, duration?: number) =>
      addNotification({ type: 'error', message, duration }),
    warning: (message: string, duration?: number) =>
      addNotification({ type: 'warning', message, duration }),
    info: (message: string, duration?: number) =>
      addNotification({ type: 'info', message, duration })
  };

  return {
    notifications,
    notify,
    removeNotification,
    clearNotifications
  };
} 