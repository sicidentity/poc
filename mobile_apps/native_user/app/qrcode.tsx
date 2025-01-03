import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../config';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';

const QRCodeScreen = () => {
  const params = useLocalSearchParams();
  const userId = params.userId || 'a12f1abc-a2e4-49b6-a7a7-3972c6799c41';
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateQRCode();
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          generateQRCode();
          return 300;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/qr/generate/${userId}`);
      const data = await response.json();

      if (response.ok && data.qrImage) {
        setQrCode(data.qrImage);
      } else {
        Alert.alert('Error', data.error || 'Failed to generate QR code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    router.replace('/profile');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Time Sensitive</Text>

      {qrCode ? (
        <Image
          source={{ uri: qrCode }}
          style={styles.qrCode}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.qrPlaceholder}>
          <Text>Loading QR Code...</Text>
        </View>
      )}

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      <TouchableOpacity 
        style={[styles.generateButton, loading && styles.disabledButton]}
        onPress={generateQRCode}
        disabled={loading}
      >
        <Text style={styles.generateButtonText}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </Text>
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
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 40,
    marginBottom: 20,
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 30,
  },
  qrCode: {
    width: 250,
    height: 250,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  qrPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 32,
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: 30,
  },
  generateButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  viewNumberButton: {
    padding: 16,
    marginTop: 10,
  },
  viewNumberText: {
    color: '#000',
    fontSize: 14,
  },
});

export default QRCodeScreen;
