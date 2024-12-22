import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { API_URL } from '../config';

export default function IDVerifyScreen() {
  const [studentId, setStudentId] = useState('');
  const [userData, setUserData] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const handleVerify = async () => {
    if (!studentId.trim()) {
      Alert.alert('Error', 'Please enter ID');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${studentId}`);
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
      } else {
        Alert.alert('Error', data.error || 'Invalid ID');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../assets/images/school-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* ID Input Container */}
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter ID"
            value={studentId}
            onChangeText={setStudentId}
            autoCapitalize="none"
          />
        </View>

        {/* Verify Button Container */}
        <View style={styles.verifyContainer}>
          <View style={styles.verifyLine} />
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handleVerify}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
          <View style={styles.verifyLine} />
        </View>

        {/* Display Results */}
        {userData && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Full Name: {userData.fullName}</Text>
            <Text style={styles.resultText}>ID: {userData.studentNumber}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#666',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    padding: 20,
    gap: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 18,
    padding: 15,
  },
  verifyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  verifyLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  verifyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 10,
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#000',
  },
  resultContainer: {
    marginTop: 20,
    gap: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#000',
  },
});
