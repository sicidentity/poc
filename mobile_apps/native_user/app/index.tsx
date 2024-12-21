import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../config';
import { router } from 'expo-router';

const LoginScreen = () => {
  const [userId, setUserId] = useState('');
  console.log("Called")

  const handleLogin = async () => {
    console.log(userId);
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      const data = await response.json();
      console.log(data)

      if (response.ok) {
        // Using Expo Router navigation
        router.replace('/profile');
      } else {
        Alert.alert('Error', data.error || 'Invalid user ID');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Student ID"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="none"
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
