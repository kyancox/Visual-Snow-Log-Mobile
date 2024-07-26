import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, SafeAreaView, Text, Pressable, TouchableOpacity } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Apple } from '@/components/Apple'
import { router } from 'expo-router'

import Logo from '@/components/Logo'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [secondPassword, setSecondPassword] = useState('')
    const [secondPasswordFocused, setSecondPasswordFocused] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        if (!email) {
            Alert.alert('Please enter an email!')
            return
        }
        if (!password) {
            Alert.alert('Please enter a password!')
            return
        }

        if (password !== secondPassword) {
            Alert.alert('Passwords do not match!')
            return
        }

        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        else if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <SafeAreaView className='bg-white h-full'>


            <View className='mx-auto w-10/12 space-y-5 my-auto'>
                <Logo />
                <View className='flex flex-col'>
                    <Text className='text-2xl mb-1 font-psemibold'>Email</Text>
                    <TextInput
                        className={`bg-gray-100 p-3 border rounded-lg ${emailFocused ? 'border-projectOrange' : 'border-white'}`}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                    />
                </View>


                <View>
                    <Text className='text-2xl mb-1 font-psemibold'>Password</Text>
                    <TextInput
                        className={`bg-gray-100 p-3 border rounded-lg ${passwordFocused ? 'border-projectOrange' : 'border-white'}`}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={'none'}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                    />
                </View>

                <View>
                    <Text className='text-2xl mb-1 font-psemibold'>Re-enter Password</Text>
                    <TextInput
                        className={`bg-gray-100 p-3 border rounded-lg ${secondPasswordFocused ? 'border-projectOrange' : 'border-white'}`}
                        onChangeText={(text) => setSecondPassword(text)}
                        value={secondPassword}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={'none'}
                        onFocus={() => setSecondPasswordFocused(true)}
                        onBlur={() => setSecondPasswordFocused(false)}
                    />
                </View>

                {password !== secondPassword &&
                    <Text className='text-red-500 text-center'>
                        Please make sure both passwords are the same.
                    </Text>
                }


                <TouchableOpacity className=' bg-projectOrange rounded-lg flex p-2 flex-row items-center justify-center'
                    onPress={() => signUpWithEmail()}
                    disabled={loading}
                >
                    <Text className='text-white font-bold text-center text-lg'>Sign up</Text>
                </TouchableOpacity>

                <View className='mx-auto mt-auto flex flex-row items-center justify-center '>
                    <Text className=''>Already have an account?</Text>
                    <Pressable
                        onPress={() => router.push('/login')}
                    >
                        <Text className='font-bold text-projectOrange'> Sign in</Text>
                    </Pressable>
                </View>

            </View>

            <Pressable className='mt-auto mx-auto'
                onPress={() => {
                    supabase.auth.signInAnonymously()
                    router.push('/create')
                }}
            >
                <Text className='text-projectOrange'>Continue as Guest</Text>
            </Pressable>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
})