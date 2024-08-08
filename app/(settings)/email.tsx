import { View, Text, KeyboardAvoidingView, SafeAreaView, Platform, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import Logo from '@/components/Logo'
import { MaterialIcons } from '@expo/vector-icons'

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState('')
  const [newEmailFocused, setNewEmailFocused] = useState(false)
  const [newEmailValid, setNewEmailValid] = useState(false)

  useEffect(() => {
    setNewEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
  }, [newEmail])

  const resetEmail = async () => {
    if (!newEmailValid) {
      Alert.alert('Email is not valid.')
    }

    try {

      const { data, error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) {
        Alert.alert(error.message)
        return
      }
      router.back()
      console.log(data)
      Alert.alert('Email successfully updated.')
    } catch (err) {
      console.error(err)
      Alert.alert('There was an error when trying to update your email.')
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className='bg-white h-full'>

        <View className='mx-auto w-10/12 space-y-4 my-auto'>
          <Logo />

          <View>
            <Text className='text-2xl mb-1 font-psemibold'>New Email</Text>
            <TextInput
              className={`bg-gray-100 p-3 border rounded-lg ${newEmailFocused ? 'border-projectOrange' : 'border-white'}`}
              onChangeText={(text) => setNewEmail(text)}
              value={newEmail}
              placeholder="email@email.com"
              placeholderTextColor="#888"
              autoCapitalize={'none'}
              onFocus={() => setNewEmailFocused(true)}
              onBlur={() => setNewEmailFocused(false)}
            />
          </View>

          <TouchableOpacity className={`${newEmailValid ? 'bg-projectOrange' : 'bg-gray-500'} rounded-lg flex p-2 flex-row items-center justify-center`}
            disabled={!newEmailValid}
            onPress={resetEmail}
          >
            <Text className='text-white font-bold text-center text-lg'>Reset Email</Text>
          </TouchableOpacity>

        </View>

        <Pressable className='mt-auto mx-auto'
          onPress={() => {
            supabase.auth.signInAnonymously()
            router.push('/create')
          }}
        >
        </Pressable>

      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default ChangeEmail