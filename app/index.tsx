import { View, Text, Button, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Logo from '@/components/Logo'

const Onboarding = () => {
    const router = useRouter();

    return (
        <SafeAreaView className='bg-white h-full'>
            <Button title='To /pages' onPress={() => router.push('/pages')} />
            <View className='w-5/6 mx-auto gap-y-3 mt-12'
            >
                <Logo />
                <Text className='text-5xl mb-4'>Start tracking your <Text className='text-projectOrange'>Visual Snow Syndrome</Text>.</Text>
                <Pressable className=' bg-projectOrange rounded-full mx-8'>
                    <Text className='text-white font-bold p-3 text-center text-lg'>Create an account</Text>
                </Pressable>
                <Pressable className=' bg-white border-2 border-projectOrange rounded-full mx-8'
                onPress={() => router.push('/login')}
                >
                    <Text className='text-projectOrange font-bold p-3 text-center text-lg'>Sign in</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Onboarding