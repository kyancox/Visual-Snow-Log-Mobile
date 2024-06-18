import { Text, View } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function App() {
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <Text className='text-3xl'>hello</Text>
            <Link href="/community">Go to Community</Link>
        </SafeAreaView>
    )
}
