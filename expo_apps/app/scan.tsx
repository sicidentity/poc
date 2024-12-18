import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Image, View, Button, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

import '../global.css'

const Scan = () => {

  return (
    <SafeAreaView className="w-full flex justify-center items-center h-full px-4 bg-[#fff]">
      <Image
        source={require('../assets/images/image 3.png')}
        className="w-[8rem] h-[8rem] mt-[-6rem] mb-[3rem]"
        resizeMode="contain"
      />

      <Image
        source={require('../assets/images/scanner.png')}
        className="w-[22rem] h-[22rem]"
        resizeMode="contain"
      />

      <TouchableOpacity className="bg-[#18171D] rounded-[8px] p-3 mt-[2rem]">
        <Text className="text-[#f5fff9] text-center">
          Scan QR Code
        </Text>
      </TouchableOpacity>

      <Link href="/details" className="mt-[1rem] text-[#9d9d9d]">View verification number </Link>
    </SafeAreaView>
  )
}

export default Scan;