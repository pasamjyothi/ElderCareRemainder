import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Medicine Reminder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Appointment Reminder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Documents</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Nearby Hospitals</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Notes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Relatives</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  gridItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    margin: '2.5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gridText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
  },
}); 