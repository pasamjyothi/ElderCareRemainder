import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'elderly' | 'caregiver';
  birthdate: string;
  emergencyContact: string;
  medicalInfo: {
    allergies: string[];
    conditions: string[];
    bloodType: string;
    doctorInfo: {
      name: string;
      phone: string;
    };
  };
  elderly?: string[]; // For caregivers, list of elderly they care for
  caregivers?: string[]; // For elderly, list of their caregivers
}

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sangbed',
    email: 'Sangbed@example.com',
    phone: '+1234567890',
    role: 'elderly',
    birthdate: '1950-05-15',
    emergencyContact: '+1987654321',
    medicalInfo: {
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Hypertension', 'Diabetes Type 2'],
      bloodType: 'O+',
      doctorInfo: {
        name: 'Dr. Jane Wilson',
        phone: '+1122334455',
      },
    },
    caregivers: ['2'],
  },
  {
    id: '2',
    name: 'Satadru',
    email: 'satadru@example.com',
    phone: '+9876543210',
    role: 'caregiver',
    birthdate: '1980-05-15',
    emergencyContact: '+1987654321',
    medicalInfo: {
      allergies: [],
      conditions: [],
      bloodType: 'O+',
      doctorInfo: {
        name: 'Dr. Jane Wilson',
        phone: '+1122334455',
      },
    },
    elderly: ['1'],
  },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'elderly' | 'caregiver', phone?: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  register: async () => false,
  updateUser: async () => {},
});

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
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would check for stored credentials
    // For demo, using mock data
    const mockUser: User = {
      id: '1',
      name: 'Soumya',
      email: 'Sangbed@example.com',
      phone: '+1234567890',
      role: 'caregiver',
      birthdate: '1980-05-15',
      emergencyContact: '+1987654321',
      medicalInfo: {
        allergies: [],
        conditions: [],
        bloodType: 'O+',
        doctorInfo: {
          name: 'Dr. Jane Wilson',
          phone: '+1122334455',
        },
      },
      elderly: ['2'], // Mock elderly user ID
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'elderly' | 'caregiver',
    phone?: string
  ): Promise<boolean> => {
    try {
      const newUser: User = {
        id: `${Date.now()}`,
        name,
        email,
        phone: phone || '',
        role,
        birthdate: '',
        emergencyContact: '',
        medicalInfo: {
          allergies: [],
          conditions: [],
          bloodType: '',
          doctorInfo: {
            name: '',
            phone: '',
          },
        },
      };
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;