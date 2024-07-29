import { View, Text } from 'react-native'
import { Stack, SplashScreen } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-native-toast-notifications'
import { useFonts } from "expo-font";

import AuthProvider from '@/providers/AuthProvider'
import { RefreshProvider } from '@/providers/RefreshContext'
import { supabase } from '@/lib/supabase'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'PlusJakartaSans-ExtraLight': require('../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
    'PlusJakartaSans-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  })

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }


  return (
    <AuthProvider>
      <RefreshProvider>
        <ToastProvider
          offset={100}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(settings)" options={{ headerShown: false }} />
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