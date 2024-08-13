import { View, Text, Platform } from 'react-native'
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
    'Onest-Black': require('../assets/fonts/Onest-Black.ttf'),
    'Onest-Bold': require('../assets/fonts/Onest-Bold.ttf'),
    'Onest-ExtraBold': require('../assets/fonts/Onest-ExtraBold.ttf'),
    'Onest-ExtraLight': require('../assets/fonts/Onest-ExtraLight.ttf'),
    'Onest-Light': require('../assets/fonts/Onest-Light.ttf'),
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
    'Onest-Regular': require('../assets/fonts/Onest-Regular.ttf'),
    'Onest-SemiBold': require('../assets/fonts/Onest-SemiBold.ttf'),
    'Onest-Thin': require('../assets/fonts/Onest-Thin.ttf'),
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
          <View className={`flex-1 ${Platform.OS === 'android' ? 'pt-6 bg-background' : ''}`}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="logpreview" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(more)" options={{ headerShown: false }} />
              <Stack.Screen name="(settings)" options={{
                headerShown: false,
                presentation: 'modal'
              }} />
              <Stack.Screen name="logs/[id]" options={{
                headerShown: false,
                headerBackTitleVisible: false,
            
              }} />
            </Stack>
          </View>
        </ToastProvider>
      </RefreshProvider>
    </AuthProvider>
  )
}

export default RootLayout