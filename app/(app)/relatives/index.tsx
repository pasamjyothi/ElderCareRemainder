import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Relative {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  address: string;
  image: string | null;
}

export default function RelativesScreen() {
  const [relatives, setRelatives] = useState<Relative[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRelative, setSelectedRelative] = useState<Relative | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRelative, setNewRelative] = useState<Omit<Relative, 'id'>>({
    name: '',
    relationship: '',
    phone: '',
    address: '',
    image: null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewRelative({ ...newRelative, image: result.assets[0].uri });
    }
  };

  const handleAddRelative = () => {
    if (!newRelative.name || !newRelative.relationship || !newRelative.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const relative: Relative = {
      id: Date.now().toString(),
      ...newRelative,
    };

    setRelatives([...relatives, relative]);
    setModalVisible(false);
    setNewRelative({
      name: '',
      relationship: '',
      phone: '',
      address: '',
      image: null,
    });
  };

  const handleUpdateRelative = () => {
    if (!selectedRelative) return;

    if (!newRelative.name || !newRelative.relationship || !newRelative.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setRelatives(
      relatives.map((relative) =>
        relative.id === selectedRelative.id
          ? { ...relative, ...newRelative }
          : relative
      )
    );
    setModalVisible(false);
    setSelectedRelative(null);
    setIsEditing(false);
    setNewRelative({
      name: '',
      relationship: '',
      phone: '',
      address: '',
      image: null,
    });
  };

  const handleDeleteRelative = (id: string) => {
    Alert.alert(
      'Delete Relative',
      'Are you sure you want to delete this relative?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setRelatives(relatives.filter((relative) => relative.id !== id));
          },
        },
      ]
    );
  };

  const handleEditRelative = (relative: Relative) => {
    setSelectedRelative(relative);
    setNewRelative({
      name: relative.name,
      relationship: relative.relationship,
      phone: relative.phone,
      address: relative.address,
      image: relative.image,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const renderRelativeItem = ({ item }: { item: Relative }) => (
    <View style={styles.relativeItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.relativeImage} />
      ) : (
        <View style={styles.relativeImagePlaceholder}>
          <Ionicons name="person" size={24} color="#666" />
        </View>
      )}
      <View style={styles.relativeInfo}>
        <Text style={styles.relativeName}>{item.name}</Text>
        <Text style={styles.relativeRelationship}>{item.relationship}</Text>
        <Text style={styles.relativePhone}>{item.phone}</Text>
        {item.address ? (
          <Text style={styles.relativeAddress}>{item.address}</Text>
        ) : null}
      </View>
      <View style={styles.relativeActions}>
        <TouchableOpacity
          onPress={() => handleEditRelative(item)}
          style={styles.actionButton}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteRelative(item.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={relatives}
        renderItem={renderRelativeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No relatives added yet</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setNewRelative({
            name: '',
            relationship: '',
            phone: '',
            address: '',
            image: null,
          });
          setModalVisible(true);
          setIsEditing(false);
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Relative' : 'Add Relative'}
            </Text>

            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImage}
            >
              {newRelative.image ? (
                <Image
                  source={{ uri: newRelative.image }}
                  style={styles.selectedImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color="#666" />
                  <Text style={styles.imagePlaceholderText}>
                    Tap to add photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newRelative.name}
              onChangeText={(text) =>
                setNewRelative({ ...newRelative, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Relationship"
              value={newRelative.relationship}
              onChangeText={(text) =>
                setNewRelative({ ...newRelative, relationship: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newRelative.phone}
              onChangeText={(text) =>
                setNewRelative({ ...newRelative, phone: text })
              }
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Address (Optional)"
              value={newRelative.address}
              onChangeText={(text) =>
                setNewRelative({ ...newRelative, address: text })
              }
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedRelative(null);
                  setIsEditing(false);
                  setNewRelative({
                    name: '',
                    relationship: '',
                    phone: '',
                    address: '',
                    image: null,
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={isEditing ? handleUpdateRelative : handleAddRelative}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update' : 'Save'}
                </Text>
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
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  relativeItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  relativeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  relativeImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relativeInfo: {
    flex: 1,
  },
  relativeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  relativeRelationship: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  relativePhone: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  relativeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  relativeActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 