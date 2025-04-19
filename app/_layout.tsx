import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(app)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="loading" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootLayoutNav />
    </AuthProvider>
  );
}
