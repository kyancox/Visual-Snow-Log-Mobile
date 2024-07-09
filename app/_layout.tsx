import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'

import AuthProvider from '@/providers/AuthProvider'
import { RefreshProvider } from '@/providers/RefreshContext'
import { supabase } from '@/lib/supabase'

const RootLayout = () => {
  // // Header title for log page
  // const { id } = useLocalSearchParams();
  // const [title, setTitle] = useState('')

  // useEffect(() => {
  //   const fetchLogDetails = async () => {
  //     if (!id) return; 

  //     const { data, error } = await supabase
  //       .from('logs')
  //       .select('*')
  //       .eq('id', id)
  //       .single();

  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log(data)
  //       setTitle(data.id);
  //     }
  //   };

  //   fetchLogDetails();
  //   console.log(title)
  // }, []);


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