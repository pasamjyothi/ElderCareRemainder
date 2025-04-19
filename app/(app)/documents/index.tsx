import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uri: string;
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.mimeType || 'Unknown',
        size: formatFileSize(file.size || 0),
        date: new Date().toLocaleDateString(),
        uri: file.uri,
      };

      setDocuments([...documents, newDocument]);
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const viewDocument = (document: Document) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const renderItem = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => viewDocument(item)}
    >
      <View style={styles.documentInfo}>
        <Ionicons name="document-outline" size={24} color="#4A90E2" />
        <View style={styles.documentDetails}>
          <Text style={styles.documentName}>{item.name}</Text>
          <Text style={styles.documentMeta}>
            {item.type} • {item.size} • {item.date}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteDocument(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No documents added yet</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={pickDocument}
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedDocument?.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.documentPreview}>
              <Ionicons name="document-outline" size={64} color="#4A90E2" />
              <Text style={styles.documentType}>{selectedDocument?.type}</Text>
              <Text style={styles.documentSize}>{selectedDocument?.size}</Text>
            </View>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                // Implement download functionality
                console.log('Download document:', selectedDocument?.uri);
              }}
            >
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
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
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 15,
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  documentMeta: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  documentPreview: {
    alignItems: 'center',
    padding: 20,
  },
  documentType: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  documentSize: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  downloadButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 