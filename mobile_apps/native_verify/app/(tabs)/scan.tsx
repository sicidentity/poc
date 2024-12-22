import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from '../../config';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success' | 'error' | null
  const [userData, setUserData] = useState(null);
  const cameraRef = useRef(null);
  const params = useLocalSearchParams();
  const officerId = params.officerId;

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    
    try {
      setScanned(true);
      // Verify QR code with backend
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

      if (response.ok) {
        setUserData(result);
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Requesting camera permission</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/school-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {verificationStatus === 'success' && (
          <View style={styles.resultContainer}>
            <AntDesign name="checkcircle" size={80} color="#22c55e" />
            <Text style={styles.successText}>Verified</Text>
            {userData && (
              <View style={styles.userInfo}>
                <Text style={styles.userInfoText}>Full Name: {userData.fullName}</Text>
                <Text style={styles.userInfoText}>ID: {userData.studentNumber}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.button}
              onPress={() => {
                setScanned(false);
                setVerificationStatus(null);
                setUserData(null);
              }}
            >
              <Text style={styles.buttonText}>Scan Another</Text>
            </TouchableOpacity>
          </View>
        )}

        {verificationStatus === 'error' && (
          <View style={styles.resultContainer}>
            <AntDesign name="closecircle" size={80} color="#ef4444" />
            <Text style={styles.errorText}>Invalid QR Code</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => {
                setScanned(false);
                setVerificationStatus(null);
              }}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {verificationStatus === null && (
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={CameraType.back}
              onBarCodeScanned={handleBarCodeScanned}
            >
              <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                  <View style={styles.scanBorder} />
                  <Text style={styles.scanText}>Scan QR Code</Text>
                </View>
              </View>
            </Camera>
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
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 64,
    height: 64,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  resultContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successText: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  userInfo: {
    marginTop: 16,
    marginBottom: 24,
    width: '100%',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    alignItems: 'center',
  },
  scanBorder: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
});
