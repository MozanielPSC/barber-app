import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationsStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove após duração especificada
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
