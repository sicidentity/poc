import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from 'react-native'
import { Link } from 'expo-router'
import '../global.css'

const Welcome = () => {
  return (
    <SafeAreaView className="w-full flex justify-center items-center h-full px-4 bg-[#fff]">
      <Text className="text-[9rem] text-[#FF8383]">Welcome to the app!</Text>
      <Link href='/explore'>explore</Link>
    </SafeAreaView>
  )
}

export default Welcome;