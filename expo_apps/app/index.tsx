import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Image, View, Button, Pressable, } from 'react-native'
import { Link } from 'expo-router'

import '../global.css'

const Welcome = () => {

  return (
    <SafeAreaView className="w-full flex justify-center items-center h-full px-4 bg-[#fff]">
      <Image
        source={require('../assets/images/image 3.png')}
        className="w-[16rem] h-[16rem]"
        resizeMode="contain"
      />
      <View className="flex flex-row w-[100%] justify-around mt-[3rem]">
        <Link 
          className="bg-[#18171D] rounded-[8px] p-3"
          href='/generate'
        >
          <Text className="text-[#f5fff9] text-center">
            Generate QR Code
          </Text>
        </Link>

        <Link 
          className="bg-[#18171D] rounded-[8px] p-3"
          href='/scan'
        >
          <Text className="text-[#f5fff9] text-center">
            Scan QR Code
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}

export default Welcome;