import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Reminder, Medication, Appointment } from '@/types';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';
import { scheduleDailyNotification, scheduleOneTimeNotification, cancelNotification } from '@/utils/notifications';

// Mock data for demo purposes
const MOCK_REMINDERS: Reminder[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Doctor Appointment',
    description: 'Checkup with Dr. Wilson',
    time: '14:00',
    recurring: false,
    elderlyId: '1',
    relatedItemId: 'app1',
    completed: false,
    notified: false,
  },
];

const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'med1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    schedule: [
      {
        time: '08:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
    ],
    instructions: 'Take with or without food at the same time each day',
    startDate: '2023-01-01',
    elderlyId: '1',
  },
  {
    id: 'med2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    schedule: [
      {
        time: '09:30',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      {
        time: '19:30',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
    ],
    instructions: 'Take with meals',
    startDate: '2023-01-01',
    elderlyId: '1',
  },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app1',
    title: 'Quarterly Checkup',
    date: '2023-06-15',
    time: '14:00',
    location: 'City Medical Center, Room 305',
    notes: 'Bring current medication list',
    doctorName: 'Dr. Jane Wilson',
    elderlyId: '1',
  },
];

// Web fallback for SecureStore
const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
};

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface ReminderContextType {
  reminders: Reminder[];
  medications: Medication[];
  appointments: Appointment[];
  loading: boolean;
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  markReminderComplete: (id: string) => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  getTodaysReminders: () => Reminder[];
  getUpcomingReminders: () => Reminder[];
  getMissedReminders: () => Reminder[];
  getRemindersForElderly: (elderlyId: string) => Reminder[];
}

export const ReminderContext = createContext<ReminderContextType>({
  reminders: [],
  medications: [],
  appointments: [],
  loading: true,
  addReminder: async () => {},
  updateReminder: async () => {},
  deleteReminder: async () => {},
  markReminderComplete: async () => {},
  addMedication: async () => {},
  updateMedication: async () => {},
  deleteMedication: async () => {},
  addAppointment: async () => {},
  updateAppointment: async () => {},
  deleteAppointment: async () => {},
  getTodaysReminders: () => [],
  getUpcomingReminders: () => [],
  getMissedReminders: () => [],
  getRemindersForElderly: () => [],
});

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on app startup or when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setReminders([]);
        setMedications([]);
        setAppointments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to load saved reminders from SecureStore
        const savedReminders = await SecureStore.getItemAsync(`reminders_${user.id}`);
        if (savedReminders) {
          setReminders(JSON.parse(savedReminders));
        } else {
          // If no saved reminders, use mock data filtered by user's role
          if (user.role === 'elderly') {
            setReminders(MOCK_REMINDERS.filter(r => r.elderlyId === user.id));
          } else if (user.role === 'caregiver' && user.elderly && user.elderly.length > 0) {
            const elderlyIds = user.elderly;
            setReminders(MOCK_REMINDERS.filter(r => elderlyIds.includes(r.elderlyId)));
          }
        }

        // Load medications and appointments
        setMedications(MOCK_MEDICATIONS.filter(m => m.elderlyId === user.id));
        setAppointments(MOCK_APPOINTMENTS.filter(a => a.elderlyId === user.id));
      } catch (error) {
        console.error('Failed to load reminder data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Save reminders whenever they change
  useEffect(() => {
    const saveReminders = async () => {
      if (user) {
        try {
          await SecureStore.setItemAsync(`reminders_${user.id}`, JSON.stringify(reminders));
        } catch (error) {
          console.error('Failed to save reminders:', error);
        }
      }
    };

    saveReminders();
  }, [reminders, user]);

  // Helper to generate a unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Schedule notification for a reminder
  const scheduleNotification = async (reminder: Reminder) => {
    if (Platform.OS === 'web') return; // Notifications not supported on web

    try {
      const [hours, minutes] = reminder.time.split(':').map(Number);
      
      if (reminder.recurring) {
        // For recurring reminders, use scheduleDailyNotification
        const result = await scheduleDailyNotification(
          reminder.title,
          reminder.description || 'Time for your reminder!',
          hours,
          minutes,
          { reminderId: reminder.id }
        );
        if (result.success && result.id) {
          // Store the notification ID
          setReminders(prev => 
            prev.map(r => r.id === reminder.id ? { ...r, notificationId: result.id } : r)
          );
        }
      } else {
        // For one-time reminders, calculate the target date
        const targetDate = new Date();
        targetDate.setHours(hours, minutes, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (targetDate < new Date()) {
          targetDate.setDate(targetDate.getDate() + 1);
        }
        
        const result = await scheduleOneTimeNotification(
          reminder.title,
          reminder.description || 'Time for your reminder!',
          targetDate,
          { reminderId: reminder.id }
        );
        if (result.success && result.id) {
          // Store the notification ID
          setReminders(prev => 
            prev.map(r => r.id === reminder.id ? { ...r, notificationId: result.id } : r)
          );
        }
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  // CRUD operations for reminders
  const addReminder = async (reminder: Omit<Reminder, 'id'>): Promise<void> => {
    const newReminder: Reminder = { ...reminder, id: generateId() };
    setReminders(prev => [...prev, newReminder]);
    await scheduleNotification(newReminder);
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>): Promise<void> => {
    setReminders(prev => 
      prev.map(reminder => (reminder.id === id ? { ...reminder, ...updates } : reminder))
    );
    await scheduleNotification(reminders.find(r => r.id === id) as Reminder);
  };

  const deleteReminder = async (id: string): Promise<void> => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const markReminderComplete = async (id: string): Promise<void> => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder?.notificationId) {
      // Cancel the notification if it exists
      try {
        await cancelNotification(reminder.notificationId);
      } catch (error) {
        console.error('Failed to cancel notification:', error);
      }
    }

    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: true, completedTime: new Date().toISOString(), notificationId: undefined } 
          : reminder
      )
    );
  };

  // CRUD operations for medications
  const addMedication = async (medication: Omit<Medication, 'id'>): Promise<void> => {
    const newMedication: Medication = { ...medication, id: generateId() };
    setMedications(prev => [...prev, newMedication]);
  };

  const updateMedication = async (id: string, updates: Partial<Medication>): Promise<void> => {
    setMedications(prev => 
      prev.map(medication => (medication.id === id ? { ...medication, ...updates } : medication))
    );
  };

  const deleteMedication = async (id: string): Promise<void> => {
    setMedications(prev => prev.filter(medication => medication.id !== id));
  };

  // CRUD operations for appointments
  const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<void> => {
    const newAppointment: Appointment = { ...appointment, id: generateId() };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<void> => {
    setAppointments(prev => 
      prev.map(appointment => (appointment.id === id ? { ...appointment, ...updates } : appointment))
    );
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  // Helper functions for filtering reminders
  const getTodaysReminders = (): Reminder[] => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return reminders.filter(reminder => {
      // For elderly, show their own reminders
      if (user?.role === 'elderly' && reminder.elderlyId === user.id) {
        return true;
      }
      
      // For caregivers, show reminders for their assigned elderly
      if (user?.role === 'caregiver' && user.elderly?.includes(reminder.elderlyId)) {
        return true;
      }
      
      return false;
    });
  };

  const getUpcomingReminders = (): Reminder[] => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(reminder => {
      // Exclude completed reminders
      if (reminder.completed) return false;
      
      // For appointments, check if they're in the future
      if (reminder.type === 'appointment' && reminder.relatedItemId) {
        const appointment = appointments.find(a => a.id === reminder.relatedItemId);
        return appointment && appointment.date > today;
      }
      
      // Include all recurring reminders that aren't completed
      return reminder.recurring;
    });
  };

  const getMissedReminders = (): Reminder[] => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    return reminders.filter(reminder => {
      // Skip completed reminders
      if (reminder.completed) return false;
      
      // For elderly, only show their own reminders
      if (user?.role === 'elderly' && reminder.elderlyId !== user.id) {
        return false;
      }
      
      // For caregivers, show reminders for their assigned elderly
      if (user?.role === 'caregiver' && !user.elderly?.includes(reminder.elderlyId)) {
        return false;
      }
      
      // Parse the reminder time
      const [hours, minutes] = reminder.time.split(':').map(Number);
      
      // Check if the reminder is for today and has passed
      const hasTimePassed = currentHour > hours || (currentHour === hours && currentMinutes > minutes);
      
      // For appointments, check if the date has passed
      if (reminder.type === 'appointment' && reminder.relatedItemId) {
        const appointment = appointments.find(a => a.id === reminder.relatedItemId);
        return appointment && 
              (appointment.date < today || 
               (appointment.date === today && hasTimePassed));
      }
      
      // For recurring daily reminders, check if the time has passed today
      return hasTimePassed;
    });
  };

  const getRemindersForElderly = (elderlyId: string): Reminder[] => {
    return reminders.filter(reminder => reminder.elderlyId === elderlyId);
  };

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        medications,
        appointments,
        loading,
        addReminder,
        updateReminder,
        deleteReminder,
        markReminderComplete,
        addMedication,
        updateMedication,
        deleteMedication,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getTodaysReminders,
        getUpcomingReminders,
        getMissedReminders,
        getRemindersForElderly,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};