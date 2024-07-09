import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

import AuthProvider from '@/providers/AuthProvider'
import { RefreshProvider } from '@/providers/RefreshContext'

const RootLayout = () => {
  return (
    <AuthProvider>
      <RefreshProvider>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="logs/[id]" options={{ headerShown: false }} /> */}
        </Stack>
      </RefreshProvider>
    </AuthProvider>
  )
}

export default RootLayout