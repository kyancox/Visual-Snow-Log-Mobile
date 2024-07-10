import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'

import AuthProvider from '@/providers/AuthProvider'
import { RefreshProvider } from '@/providers/RefreshContext'
import { supabase } from '@/lib/supabase'

const RootLayout = () => {
  return (
    <AuthProvider>
      <RefreshProvider>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="logs/[id]" options={{ 
              headerShown: false,
              headerBackTitleVisible: false,

              }} />
        </Stack>
      </RefreshProvider>
    </AuthProvider>
  )
}

export default RootLayout