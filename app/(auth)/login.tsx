import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, SafeAreaView } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Apple } from '@/components/Apple'

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
    <SafeAreaView className='bg-white h-full'>

       <View className='mx-auto w-3/4 space-y-4'> 
         <TextInput
           className='bg-gray-50 p-2 border border-projectOrange rounded'
           onChangeText={(text) => setEmail(text)}
           value={email}
           placeholder="email@address.com"
           autoCapitalize={'none'}
         />
        
        
         <TextInput
           className='bg-gray-50 p-2 border border-projectOrange rounded'
           onChangeText={(text) => setPassword(text)}
           value={password}
           secureTextEntry={true}
           placeholder="Password"
           autoCapitalize={'none'}
         />
        
       </View>
      <View>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View >
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
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