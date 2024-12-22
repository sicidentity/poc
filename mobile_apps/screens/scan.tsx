import React, { useState, useEffect } from 'react';
import { Text, View, Alert, TextInput, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useSearchParams, router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from '../config';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success' | 'error' | null
  const { officerName } = useSearchParams();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
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
          officerName 
        }),
      });

      const result = await response.json();

      if (response.ok) {
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
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Requesting camera permission</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-2">
        <Pressable onPress={handleBack}>
          <Text className="text-gray-600">Back</Text>
        </Pressable>
      </View>

      <View className="flex-1">
        <View className="items-center py-6">
          <Image
            source={require('../assets/images/school-logo.png')}
            className="w-16 h-16"
            resizeMode="contain"
          />
        </View>

        {verificationStatus === 'success' && (
          <View className="items-center px-6">
            <Image
              source={require('../assets/images/success-check.png')}
              className="w-20 h-20 mb-4"
              resizeMode="contain"
            />
            <Text className="text-green-500 text-lg font-medium mb-2">Verified</Text>
            <Pressable 
              className="bg-black rounded-full py-3 px-6 w-full items-center mt-4"
              onPress={() => {
                setScanned(false);
                setVerificationStatus(null);
              }}
            >
              <Text className="text-white font-medium">Scan Another</Text>
            </Pressable>
          </View>
        )}

        {verificationStatus === 'error' && (
          <View className="items-center px-6">
            <Image
              source={require('../assets/images/error-x.png')}
              className="w-20 h-20 mb-4"
              resizeMode="contain"
            />
            <Text className="text-red-500 text-lg font-medium mb-2">Invalid QR Code</Text>
            <Pressable 
              className="bg-black rounded-full py-3 px-6 w-full items-center mt-4"
              onPress={() => {
                setScanned(false);
                setVerificationStatus(null);
              }}
            >
              <Text className="text-white font-medium">Try Again</Text>
            </Pressable>
          </View>
        )}

        {verificationStatus === null && (
          <Camera
            className="flex-1"
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          >
            <View className="flex-1 bg-transparent">
              <View className="flex-1 items-center justify-center">
                <View className="w-64 h-64 border-2 border-white rounded-lg" />
                <Text className="text-white mt-4">Scan QR Code</Text>
              </View>
            </View>
          </Camera>
        )}
      </View>
    </SafeAreaView>
  );
}
