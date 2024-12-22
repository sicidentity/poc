import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Image, View, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useCameraPermissions } from "expo-camera";

const Welcome = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView className="w-full flex h-full bg-white">
      <View className="px-4 py-2">
        <Pressable onPress={() => {}}>
          <Text className="text-gray-600">Back</Text>
        </Pressable>
      </View>
      
      <View className="flex-1 items-center justify-start px-6 pt-8">
        <Image
          source={require('../../assets/images/school-logo.png')}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
        />
        
        <Text className="text-xl font-semibold mb-2">Welcome</Text>
        <Text className="text-base text-gray-600 mb-8">Benjamin Okoh</Text>
        <Text className="text-base text-gray-600 mb-2">#5567</Text>

        <Link 
          className="w-full"
          href='/officer_name'
          asChild
        >
          <Pressable 
            disabled={!isPermissionGranted}
            className="bg-black rounded-full py-3 px-6 items-center mt-4"
          >
            <Text className="text-white font-medium">
              Scan QR Code
            </Text>
          </Pressable>
        </Link>
      </View>

      {!isPermissionGranted && (
        <Pressable 
          onPress={requestPermission}
          className="mb-8 items-center"
        >
          <Text className="text-gray-500">Request Camera Permission</Text>
        </Pressable>
      )}
    </SafeAreaView>
  )
}

export default Welcome;
