import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

const OfficerNameScreen = () => {
  const [officerName, setOfficerName] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!officerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    router.push({
      pathname: '/scan',
      params: { officerName: officerName }
    });
  };

  return (
    <SafeAreaView className="w-full flex h-full bg-white">
      <View className="px-4 py-2">
        <Pressable onPress={handleBack}>
          <Text className="text-gray-600">Back</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center px-6 pt-8">
        <Image
          source={require('../assets/images/school-logo.png')}
          className="w-32 h-32 mb-8"
          resizeMode="contain"
        />

        <Text className="text-xl font-semibold mb-6">Officer Details</Text>
        
        <TextInput
          className="w-full h-12 border border-gray-300 rounded-full px-6 mb-6"
          placeholder="Enter your name"
          value={officerName}
          onChangeText={setOfficerName}
          autoCapitalize="words"
        />

        <Pressable 
          className="w-full bg-black rounded-full py-3 px-6 items-center"
          onPress={handleContinue}
        >
          <Text className="text-white font-medium">Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OfficerNameScreen;
