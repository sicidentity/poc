import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../config';
import { router, useLocalSearchParams } from 'expo-router';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const userId = 'dbbb8ed1-a2b1-40a2-b0e8-847a350651a3'; // Using the test user ID

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      const data = await response.json();

      console.log(data)

      if (response.ok) {
        setUserData(data);
      } else {
        Alert.alert('Error Failed to fetch user data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  const handleGenerateQR = () => {
    router.push('/qrcode');
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome back</Text>
      
      <Image
        source={require('../assets/images/Frame 28.png')}
        style={styles.profileImage}
      />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Student name</Text>
          <Text style={styles.value}>{userData.fullName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{userData.age || '24'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Institute</Text>
          <Text style={styles.value}>{userData.institute || 'Lagos State University'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.value}>{userData.studentNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>NIN Status</Text>
          <View style={styles.verifiedContainer}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>View Number</Text>
          <Text style={styles.value}>************</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateQR}>
        <Text style={styles.generateButtonText}>Generate QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.viewNumberButton}>
        <Text style={styles.viewNumberText}>View verification number</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  verifiedContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  viewNumberButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  viewNumberText: {
    color: '#000',
    fontSize: 14,
  },
});

export default ProfileScreen;
