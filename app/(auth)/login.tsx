import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, SafeAreaView, Text, Pressable, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Apple } from '@/components/Apple'
import { router } from 'expo-router'
import * as AppleAuthentication from 'expo-apple-authentication'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'

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
  const [showPassword, setShowPassword] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

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
              onFocus={() => {
                setEmailFocused(true)
                setKeyboardVisible(true)
              }}
              onBlur={() => {
                setEmailFocused(false)
                setKeyboardVisible(false)
              }}
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
              onFocus={() => {
                setPasswordFocused(true)
                setKeyboardVisible(true)
              }}
              onBlur={() => {
                setPasswordFocused(false)
                setKeyboardVisible(false)
              }}
            />
            <Pressable className='flex flex-row items-center justify-end mt-2' onPress={() => setShowPassword(!showPassword)}>
              <Text className='text-gray-600 font-o'>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
            </Pressable>
          </View>

          <View className='space-y-2'>
            <TouchableOpacity className=' bg-projectOrange rounded-lg flex p-2 flex-row items-center justify-center'
              onPress={() => signInWithEmail()}
              disabled={loading}
            >
              <Text className='text-white font-obold text-center text-lg'>Sign in</Text>
            </TouchableOpacity>
            <Pressable className=' bg-black rounded-lg flex flex-row items-center justify-center p-2 space-x-2'
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  })
                  // Sign in via Supabase Auth.
                  if (credential.identityToken) {
                    const {
                      error,
                      data: { user },
                    } = await supabase.auth.signInWithIdToken({
                      provider: 'apple',
                      token: credential.identityToken,
                    })
                    console.log(JSON.stringify({ error, user }, null, 2))
                    if (!error) {
                      // User is signed in.
                    }
                  } else {
                    throw new Error('No identityToken.')
                  }
                } catch (e: any) {
                  if (e.code === 'ERR_REQUEST_CANCELED') {
                    // handle that the user canceled the sign-in flow
                  } else {
                    // handle other errors
                  }
                }
              }}
            >
              <AntDesign name='apple1' size={18} color={'white'} />
              <Text className='text-white font-osemibold text-center text-lg'>Continue with Apple</Text>
            </Pressable>
          </View>



          <View className='mx-auto mt-auto flex flex-row items-center justify-center '>
            <Text className='font-o '>Don't have an account?</Text>
            <Pressable
              onPress={() => router.push('/signup')}
            >
              <Text className='font-obold text-projectOrange'> Sign up</Text>
            </Pressable>
          </View>

        </View>

        {!isKeyboardVisible && (
          <Pressable className={`mt-auto mx-auto ${Platform.OS === 'android' ? 'mb-4' : ''}`}
            onPress={() => {
              supabase.auth.signInAnonymously()
              router.push('/create')
            }}
          >
            <Text className='text-projectOrange font-o'>Continue as Guest</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}