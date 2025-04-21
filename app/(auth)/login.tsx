import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth, User } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, user } = useAuth();

  // Redirect to tabs if user is already logged in
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset previous errors
    setError(null);
    
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      
      // Find user in mock data
      const user = MOCK_USERS.find(u => u.email === email);
      if (!user) {
        setError('Invalid email or password');
        return;
      }

      // In a real app, verify password here
      login(user);
      setEmail('');
      setPassword('');
      router.replace('/(tabs)');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'elderly' | 'caregiver') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find demo user based on role
      const demoUser = MOCK_USERS.find(u => u.role === role);
      if (!demoUser) {
        setError('Demo login failed. Please try again.');
        return;
      }

      login(demoUser);
      router.replace('/(tabs)');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Validate if email exists
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Simulate password reset process
    Alert.alert(
      'Reset Password',
      `We've sent a password reset link to ${email}. Please check your inbox.`
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            accessible={true}
            accessibilityLabel="Email input field"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            accessible={true}
            accessibilityLabel="Password input field"
          />
        </View>

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
          accessible={true}
          accessibilityLabel="Forgot password link"
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, (!email || !password) && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
          accessible={true}
          accessibilityLabel="Login button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.demoContainer}>
          <Text style={styles.demoHeader}>Demo Logins:</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity 
              style={[styles.demoButton, styles.elderlyButton]}
              onPress={() => handleDemoLogin('elderly')}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel="Elderly user demo login"
            >
              <Text style={styles.demoButtonText}>Elderly User</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.demoButton, styles.caregiverButton]}
              onPress={() => handleDemoLogin('caregiver')}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel="Caregiver demo login"
            >
              <Text style={styles.demoButtonText}>Caregiver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginLeft: 20,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#c62828',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Regular',
    color: '#3498db',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3498db',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#92c5eb',
  },
  loginButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 18,
  },
  demoContainer: {
    marginTop: 40,
  },
  demoHeader: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  elderlyButton: {
    backgroundColor: '#27ae60',
  },
  caregiverButton: {
    backgroundColor: '#e67e22',
  },
  demoButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: 16,
  },
});