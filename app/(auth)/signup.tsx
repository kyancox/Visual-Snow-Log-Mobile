import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, SafeAreaView, Text, Pressable, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Apple } from '@/components/Apple'
import { router } from 'expo-router'

import Logo from '@/components/Logo'
import { MaterialIcons } from '@expo/vector-icons'

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
    const [showPassword, setShowPassword] = useState(false)

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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className='bg-white h-full'>
                <View className='flex flex-row items-center justify-start p-3'>
                    <MaterialIcons
                        name='arrow-back-ios-new'
                        size={24}
                        onPress={() => router.back()}
                        color='#FFA500'
                    />
                </View>
                <View className='mx-auto w-10/12 space-y-5 my-auto'>
                    <Logo />
                    <View className='flex flex-col'>
                        <Text className='text-2xl mb-1 font-osemibold'>Email</Text>
                        <TextInput
                            className={`bg-gray-100 font-o p-3 border rounded-lg ${emailFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="email@address.com"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                        />
                    </View>


                    <View>
                        <Text className='text-2xl mb-1 font-osemibold'>Password</Text>
                        <TextInput
                            className={`bg-gray-100 font-o p-3 border rounded-lg ${passwordFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            secureTextEntry={!showPassword}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                        />
                    </View>

                    <View>
                        <Text className='text-2xl mb-1 font-osemibold'>Re-enter Password</Text>
                        <TextInput
                            className={`bg-gray-100 font-o p-3 border rounded-lg ${secondPasswordFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setSecondPassword(text)}
                            value={secondPassword}
                            secureTextEntry={!showPassword}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setSecondPasswordFocused(true)}
                            onBlur={() => setSecondPasswordFocused(false)}
                        />
                        <Pressable className='flex flex-row items-center justify-end mt-2' onPress={() => setShowPassword(!showPassword)}>
                            <Text className='text-gray-600 font-o'>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
                        </Pressable>
                    </View>

                    {password !== secondPassword &&
                        <Text className='text-red-500 font-o text-center'>
                            Please make sure both passwords are the same.
                        </Text>
                    }


                    <TouchableOpacity className=' bg-projectOrange rounded-lg flex p-2 flex-row items-center justify-center'
                        onPress={() => signUpWithEmail()}
                        disabled={loading}
                    >
                        <Text className='text-white font-obold text-center text-lg'>Sign up</Text>
                    </TouchableOpacity>

                    <View className='mx-auto mt-auto flex flex-row items-center justify-center '>
                        <Text className='font-o'>Already have an account?</Text>
                        <Pressable
                            onPress={() => router.push('/login')}
                        >
                            <Text className='font-obold text-projectOrange'> Sign in</Text>
                        </Pressable>
                    </View>

                </View>

                <Pressable className='mt-auto mx-auto'
                    onPress={() => {
                        supabase.auth.signInAnonymously()
                        router.push('/create')
                    }}
                >
                    <Text className='text-projectOrange font-o'>Continue as Guest</Text>
                </Pressable>

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}