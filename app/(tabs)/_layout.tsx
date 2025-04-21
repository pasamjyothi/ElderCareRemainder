import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Chrome as Home, Calendar, Bell, Activity, User, Users, AlertTriangle } from 'lucide-react-native';

export default function TabLayout() {
  const { user, loading } = useAuth();
  
  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)');
    }
  }, [user, loading]);

  // Return null while loading or if no user
  if (loading || !user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          height: 100,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'CareNest',
        }}
      />
      
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          headerTitle: 'Reminders',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          headerTitle: 'Alerts',
          tabBarIcon: ({ color }) => <AlertTriangle size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: 'Appointments',
        }}
      />
      
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
          headerTitle: 'Health',
        }}
      />

      <Tabs.Screen
        name="connections"
        options={{
          title: 'Connections',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerTitle: user?.role === 'caregiver' ? 'My Elderly Users' : 'My Caregivers',
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}