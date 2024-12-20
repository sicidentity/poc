import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Image, View, Button, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

import '../global.css'

const Generate = () => {

  return (
    <SafeAreaView className="w-full flex justify-center items-center h-full px-4 bg-[#fff]">
      <Text  className="mb-[1rem] text-[#000]">Time Sensitive</Text>
      <Image
        source={require('../assets/images/QR Code.png')}
        className="w-[22rem] h-[22rem]"
        resizeMode="contain"
      />

      <Text className="text-[#00BE4C] text-[4.5rem] text-center font-bold">
        4 : 23
      </Text>

      <TouchableOpacity className="bg-[#18171D] rounded-[8px] p-3 mt-[2rem]">
        <Text className="text-[#f5fff9] text-center">
          Generate QR Code
        </Text>
      </TouchableOpacity>

      <Link href="/scan" className="mt-[1rem] text-[#9d9d9d]">View verification number </Link>
    </SafeAreaView>
  )
}

export default Generate;