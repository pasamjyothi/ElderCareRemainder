import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function LoadingScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elderly Care</Text>
      <ActivityIndicator size="large" color="#4A90E2" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
}); 