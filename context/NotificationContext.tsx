import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from '@/utils/notifications';

interface NotificationContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => Promise<void>;
  requestPermissions: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notificationsEnabled: false,
  toggleNotifications: async () => {},
  requestPermissions: async () => {},
});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Load notification settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const enabled = await SecureStore.getItemAsync('notificationsEnabled');
        setNotificationsEnabled(enabled === 'true');
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (enabled: boolean) => {
    try {
      await SecureStore.setItemAsync('notificationsEnabled', enabled.toString());
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      // If enabling notifications, request permissions first
      const { granted } = await requestNotificationPermissions();
      if (!granted) {
        return; // Don't enable if permissions not granted
      }
    }

    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await saveSettings(newValue);

    if (!newValue) {
      // If disabling notifications, cancel all scheduled notifications
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (error) {
        console.error('Error canceling notifications:', error);
      }
    }
  };

  const requestPermissions = async () => {
    const { granted } = await requestNotificationPermissions();
    if (granted) {
      setNotificationsEnabled(true);
      await saveSettings(true);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications,
        requestPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 