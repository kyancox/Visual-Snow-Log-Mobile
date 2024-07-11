import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-native-toast-notifications'

import AuthProvider from '@/providers/AuthProvider'
import { RefreshProvider } from '@/providers/RefreshContext'
import { supabase } from '@/lib/supabase'

const RootLayout = () => {
  return (
    <AuthProvider>
      <RefreshProvider>
        <ToastProvider
          offset={100}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="logs/[id]" options={{
              headerShown: false,
              headerBackTitleVisible: false,

            }} />
          </Stack>
        </ToastProvider>
      </RefreshProvider>
    </AuthProvider>
  )
}

export default RootLayout