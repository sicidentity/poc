import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { API_URL } from '../config';

const Welcome = () => {
  const [officerId, setOfficerId] = useState('');
  console.log("Called")

  const handleLogin = async () => {
    if (!officerId.trim()) {
      Alert.alert('Error', 'Please enter Officer ID');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${officerId}`);
      const data = await response.json();
      console.log(data)

      if (response.ok) {
        router.replace({
          pathname: '/officer_name',
          params: { officerId }
        });
      } else {
        Alert.alert('Error', data.error || 'Invalid Officer ID');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/school-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Officer Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Officer ID"
        value={officerId}
        onChangeText={setOfficerId}
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
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

export default Welcome;
