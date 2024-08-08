import React from 'react'
import { Stack, Slot, router } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{
      headerTitle: 'Account',
      headerTitleStyle: {
        fontFamily: 'Onest',
        fontWeight: '600'
      },
      headerShown: true,
      headerLeft: () => (
        <MaterialIcons
          name='arrow-back-ios-new'
          size={24}
          onPress={() => router.back()}
          color='#FFA500'
        />
      ),
    }}
    >
      <Stack.Screen name='account' />
      <Stack.Screen name='email' options={{
        headerTitle: 'Change Email'
      }}/>
      <Stack.Screen name='password' options={{
        headerTitle: 'Change Password'
      }} />
    </Stack >
  )
}

export default SettingsLayout