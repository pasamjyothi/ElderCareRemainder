import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useConnections } from '@/context/ConnectionContext';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Check, X, Mail } from 'lucide-react-native';

export default function ConnectionsScreen() {
  const { user } = useAuth();
  const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getPendingRequests,
    getConnectedUsers,
    loading,
  } = useConnections();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingRequests = getPendingRequests();
  const connectedUsers = getConnectedUsers();

  const handleSendRequest = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendConnectionRequest(email.trim());
      setEmail('');
      Alert.alert('Success', 'Connection request sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send connection request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptConnectionRequest(requestId);
      Alert.alert('Success', 'Connection request accepted');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectConnectionRequest(requestId);
      Alert.alert('Success', 'Connection request rejected');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject connection request');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Add Connection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Connection</Text>
        <View style={styles.addConnectionContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={`Enter ${user?.role === 'elderly' ? 'caregiver' : 'elderly user'}'s email`}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <UserPlus size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send Request</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Requests</Text>
          {pendingRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{request.fromName}</Text>
                <Text style={styles.requestEmail}>{request.fromEmail}</Text>
                <Text style={styles.requestRole}>
                  {request.fromRole === 'elderly' ? 'Elderly User' : 'Caregiver'}
                </Text>
              </View>
              {request.toEmail === user?.email && (
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAcceptRequest(request.id)}
                  >
                    <Check size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectRequest(request.id)}
                  >
                    <X size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Connected Users Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Users</Text>
        {connectedUsers.length > 0 ? (
          connectedUsers.map((connectedUser, index) => (
            <View key={index} style={styles.connectedUserCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{connectedUser.name}</Text>
                <Text style={styles.userEmail}>{connectedUser.email}</Text>
                <Text style={styles.userRole}>
                  {connectedUser.role === 'elderly' ? 'Elderly User' : 'Caregiver'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                  // In a real app, this would open a messaging interface
                  Alert.alert('Message', `Send message to ${connectedUser.name}`);
                }}
              >
                <Mail size={20} color="#3498db" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No connected users yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
  },
  addConnectionContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  requestEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  requestRole: {
    fontSize: 14,
    color: '#3498db',
    fontFamily: 'Inter-Medium',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  connectedUserCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#3498db',
    fontFamily: 'Inter-Medium',
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
}); 