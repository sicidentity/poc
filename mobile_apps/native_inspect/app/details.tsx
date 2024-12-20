import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Details() {
  const { qrData } = useLocalSearchParams<{ qrData: string }>();

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl font-bold mb-4">
        Scanned QR Code Details
      </Text>
      <Text className="text-base">
        {qrData || 'No data found'}
      </Text>
    </View>
  );
}