import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './AuthContext';

// Types for connection requests
interface ConnectionRequest {
  id: string;
  fromEmail: string;
  toEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  fromName: string;
  fromRole: 'elderly' | 'caregiver';
}

// Web fallback for SecureStore
const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
};

interface ConnectionContextType {
  connectionRequests: ConnectionRequest[];
  sendConnectionRequest: (toEmail: string) => Promise<void>;
  acceptConnectionRequest: (requestId: string) => Promise<void>;
  rejectConnectionRequest: (requestId: string) => Promise<void>;
  getPendingRequests: () => ConnectionRequest[];
  getConnectedUsers: () => { email: string; name: string; role: 'elderly' | 'caregiver' }[];
  loading: boolean;
}

export const ConnectionContext = createContext<ConnectionContextType>({
  connectionRequests: [],
  sendConnectionRequest: async () => {},
  acceptConnectionRequest: async () => {},
  rejectConnectionRequest: async () => {},
  getPendingRequests: () => [],
  getConnectedUsers: () => [],
  loading: true,
});

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Load connection requests from storage
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setConnectionRequests([]);
        setLoading(false);
        return;
      }

      try {
        const storedData = await secureStorage.getItem('connectionRequests');
        if (storedData) {
          setConnectionRequests(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading connection requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Save connection requests to storage
  const saveRequests = async (requests: ConnectionRequest[]) => {
    try {
      await secureStorage.setItem('connectionRequests', JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving connection requests:', error);
    }
  };

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Send a connection request
  const sendConnectionRequest = async (toEmail: string) => {
    if (!user) throw new Error('User not authenticated');

    const newRequest: ConnectionRequest = {
      id: generateId(),
      fromEmail: user.email,
      toEmail: toEmail.toLowerCase(),
      status: 'pending',
      timestamp: new Date().toISOString(),
      fromName: user.name,
      fromRole: user.role,
    };

    const updatedRequests = [...connectionRequests, newRequest];
    setConnectionRequests(updatedRequests);
    await saveRequests(updatedRequests);
  };

  // Accept a connection request
  const acceptConnectionRequest = async (requestId: string) => {
    const updatedRequests = connectionRequests.map(request =>
      request.id === requestId
        ? { ...request, status: 'accepted' as const }
        : request
    );
    setConnectionRequests(updatedRequests);
    await saveRequests(updatedRequests);
  };

  // Reject a connection request
  const rejectConnectionRequest = async (requestId: string) => {
    const updatedRequests = connectionRequests.map(request =>
      request.id === requestId
        ? { ...request, status: 'rejected' as const }
        : request
    );
    setConnectionRequests(updatedRequests);
    await saveRequests(updatedRequests);
  };

  // Get pending requests for the current user
  const getPendingRequests = () => {
    if (!user) return [];
    return connectionRequests.filter(
      request =>
        request.status === 'pending' &&
        (request.toEmail === user.email || request.fromEmail === user.email)
    );
  };

  // Get connected users for the current user
  const getConnectedUsers = () => {
    if (!user) return [];
    
    return connectionRequests
      .filter(request => 
        request.status === 'accepted' &&
        (request.toEmail === user.email || request.fromEmail === user.email)
      )
      .map(request => {
        if (request.fromEmail === user.email) {
          return {
            email: request.toEmail,
            name: request.fromName,
            role: (request.fromRole === 'elderly' ? 'caregiver' : 'elderly') as 'elderly' | 'caregiver',
          };
        } else {
          return {
            email: request.fromEmail,
            name: request.fromName,
            role: request.fromRole as 'elderly' | 'caregiver',
          };
        }
      });
  };

  return (
    <ConnectionContext.Provider
      value={{
        connectionRequests,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        getPendingRequests,
        getConnectedUsers,
        loading,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}; 