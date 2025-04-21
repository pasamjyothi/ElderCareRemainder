import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { useReminders } from '@/context/ReminderContext';
import { Reminder } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Check, Bell, AlarmClock, Droplet, Calendar, Info, Trash2 } from 'lucide-react-native';
import ScrollableTabBar from '../../components/ScrollableTabBar';
import ReminderForm from '../../components/ReminderForm';

export default function RemindersScreen() {
  const { reminders, markReminderComplete, deleteReminder } = useReminders();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const filteredReminders = useMemo(() => {
    switch (filter) {
      case 'today':
        return reminders.filter(reminder => {
          const today = new Date().toISOString().split('T')[0];
          return reminder.time.startsWith(today);
        });
      case 'upcoming':
        return reminders.filter(reminder => !reminder.completed);
      case 'completed':
        return reminders.filter(reminder => reminder.completed);
      default:
        return reminders;
    }
  }, [reminders, filter]);

  // Get icon based on reminder type
  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Bell size={24} color="#3498db" />;
      case 'appointment':
        return <Calendar size={24} color="#e67e22" />;
      case 'hydration':
        return <Droplet size={24} color="#27ae60" />;
      default:
        return <Info size={24} color="#9b59b6" />;
    }
  };

  // Handle marking a reminder as complete
  const handleCompleteReminder = async (id: string) => {
    await markReminderComplete(id);
  };

  // Render an individual reminder item
  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderIconContainer}>
        {getReminderIcon(item.type)}
      </View>
      
      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.reminderDescription}>{item.description}</Text>
        )}
        <View style={styles.reminderMeta}>
          <AlarmClock size={14} color="#666" />
          <Text style={styles.reminderTime}>{item.time}</Text>
          {item.recurring && (
            <Text style={styles.reminderRecurring}>
              • {item.frequency === 'daily' ? 'Daily' : item.frequency}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.reminderActions}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteReminder(item.id)}
        >
          <Trash2 size={20} color="#ff4444" />
        </TouchableOpacity>
        {user?.role === 'elderly' && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              item.completed && styles.completedButton,
            ]}
            onPress={() => handleCompleteReminder(item.id)}
            disabled={item.completed}
          >
            <Check size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <ScrollableTabBar 
          tabs={[
            { key: 'all', label: 'All' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
          ]}
          activeKey={filter}
          onChange={(key) => setFilter(key as typeof filter)}
        />
      </View>

      {/* Reminders list */}
      <FlatList
        data={filteredReminders}
        renderItem={renderReminderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reminders found</Text>
          </View>
        )}
      />

      {/* Add button for caregivers */}
      {user?.role === 'caregiver' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsFormVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>
      )}

      <ReminderForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  filterContainer: {
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Add padding for the add button
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  reminderDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 5,
  },
  reminderRecurring: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    alignSelf: 'center',
  },
  completedButton: {
    backgroundColor: '#27ae60',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 16,
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
});