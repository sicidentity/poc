import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../config';

export default function OfficerNameScreen() {
  const [userData, setUserData] = useState(null);
  const params = useLocalSearchParams();
  const officerId = params.officerId;

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${officerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data);
      } else {
        router.replace('/');
      }
    } catch (error) {
      router.replace('/');
    }
  };

  const handleQRVerify = () => {
    router.push({
      pathname: '/scan',
      params: { officerId }
    });
  };

  const handleIDVerify = () => {
    router.push({
      pathname: '/id_verify',
      params: { officerId }
    });
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/school-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userData.fullName}</Text>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{userData.studentNumber}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleQRVerify}
        >
          <Text style={styles.buttonText}>QR Code Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleIDVerify}
        >
          <Text style={styles.buttonText}>ID Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  infoContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20,
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
