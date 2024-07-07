import { Text, View, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import Auth from '@/components/Auth'


export default function App() {
    return (
        <SafeAreaView className="flex-1 gap-6 items-center justify-center bg-white">

            <Link href="/login" className='text-6xl text-secondary font-extrabold'>Login</Link>
            <Link href="/chatbot" className='text-6xl text-secondary font-extrabold'>Chatbot</Link>
            <Link href="/community" className='text-6xl text-secondary font-extrabold'>Community</Link>
            <Link href="/create" className='text-6xl text-secondary font-extrabold'>Create</Link>
            <Link href="/log" className='text-6xl text-secondary font-extrabold'>Log</Link>
            <Link href="/resources" className='text-6xl text-secondary font-extrabold'>Resources</Link>

        </SafeAreaView>
    )
}
