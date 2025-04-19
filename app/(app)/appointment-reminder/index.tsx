import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  location: string;
  date: Date;
  notes: string;
}

export default function AppointmentReminder() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    title: '',
    doctor: '',
    location: '',
    date: new Date(),
    notes: '',
  });

  useEffect(() => {
    // Initialize with some sample data
    setAppointments([
      {
        id: '1',
        title: 'Annual Checkup',
        doctor: 'Dr. Smith',
        location: 'City Hospital',
        date: new Date(),
        notes: 'Bring insurance card',
      },
    ]);
  }, []);

  const addAppointment = () => {
    if (newAppointment.title && newAppointment.doctor && newAppointment.location && newAppointment.date) {
      const updatedAppointments = [
        ...appointments,
        {
          id: Date.now().toString(),
          title: newAppointment.title,
          doctor: newAppointment.doctor,
          location: newAppointment.location,
          date: newAppointment.date,
          notes: newAppointment.notes || '',
        },
      ];
      setAppointments(updatedAppointments);
      setModalVisible(false);
      setNewAppointment({
        title: '',
        doctor: '',
        location: '',
        date: new Date(),
        notes: '',
      });
    }
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentTitle}>{item.title}</Text>
        <Text style={styles.appointmentDoctor}>{item.doctor}</Text>
        <Text style={styles.appointmentLocation}>{item.location}</Text>
        <Text style={styles.appointmentDate}>
          {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {item.notes && <Text style={styles.appointmentNotes}>Notes: {item.notes}</Text>}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteAppointment(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointment Reminder</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
          <Text style={styles.addButtonText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Appointment</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newAppointment.title}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, title: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Doctor"
              value={newAppointment.doctor}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, doctor: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={newAppointment.location}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, location: text })}
            />
            
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {newAppointment.date?.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={newAppointment.date || new Date()}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewAppointment({ ...newAppointment, date: selectedDate });
                  }
                }}
              />
            )}
            
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Notes"
              value={newAppointment.notes}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, notes: text })}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addAppointment}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#4A90E2',
    marginLeft: 5,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  appointmentDoctor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 5,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 