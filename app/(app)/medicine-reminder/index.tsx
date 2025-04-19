import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  days: string[];
}

export default function MedicineReminder() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({
    name: '',
    dosage: '',
    time: '',
    days: [],
  });

  const addMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.time) {
      setMedicines([
        ...medicines,
        {
          id: Date.now().toString(),
          name: newMedicine.name,
          dosage: newMedicine.dosage,
          time: newMedicine.time,
          days: newMedicine.days || [],
        },
      ]);
      setModalVisible(false);
      setNewMedicine({ name: '', dosage: '', time: '', days: [] });
    }
  };

  const renderItem = ({ item }: { item: Medicine }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineDetails}>
          {item.dosage} - {item.time}
        </Text>
        <Text style={styles.medicineDays}>{item.days.join(', ')}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={medicines}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No medicines added yet</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={50} color="#4A90E2" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medicine</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Medicine Name"
              value={newMedicine.name}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Dosage"
              value={newMedicine.dosage}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, dosage: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 8:00 AM)"
              value={newMedicine.time}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, time: text })}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.addMedicineButton]}
                onPress={addMedicine}
              >
                <Text style={styles.buttonText}>Add</Text>
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
    padding: 20,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicineDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  medicineDays: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  addMedicineButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 