import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from '../config';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const params = useLocalSearchParams();
  const officerId = params.officerId;

  const handleVerification = async (data: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`${API_URL}/qr/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedPayload: data,
          officerId
        }),
      });

      const result = await response.json();
      console.log('testing handleverificatiion', result)

      if (response.ok) {
        router.push({
          pathname: "/user_details",
          params: result
        });
      } else {
        alert(result.message || 'Verification failed');
        setScanned(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to verify QR code');
      setScanned(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (isVerifying) return;
    setScanned(true);
    handleVerification(data);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!hasPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button onPress={setHasPermission} title="grant permission" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.camera}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>
              {isVerifying ? 'Verifying...' : 'Align QR code within the frame'}
            </Text>
            {isVerifying && (
              <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            )}
            {scanned && !isVerifying && (
              <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
            )}
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  scanText: {
    fontSize: 14,
    color: 'white',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default ScanScreen;
