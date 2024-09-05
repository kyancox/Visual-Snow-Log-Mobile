import { View, Text, Pressable, ScrollView, SafeAreaView, TextInput, Button, ActivityIndicator, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import { Link, router } from "expo-router";
import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '@/providers/AuthProvider';
import LogPreview from '@/components/LogPreview';
import { useRefresh } from '@/providers/RefreshContext';
import useDebounce from '@/hooks/useDebounce';
import { useToast } from "react-native-toast-notifications";
import { MaterialIcons } from '@expo/vector-icons';

import blurredlogs from '@/assets/images/blurredlogs.png'
import Backend from '@/components/backend';

const Log = () => {
  const [logs, setLogs] = useState<any[] | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 150);
  const [sortOrder, setSortOrder] = useState(true) // True = Latest, False = Oldest
  const { refresh, triggerRefresh } = useRefresh()
  const toast = useToast()
  const isFirstRender = useRef(true);
  const { session, user } = useAuth()

  useEffect(() => {
    const readUserLogs = async () => {
      let { data, error } = await supabase
        .from('logs')
        .select('*')

      if (error) console.error(error)
      else {
        setLogs(data)
      }
    }

    readUserLogs()
  }, [refresh])

  useEffect(() => {
    triggerRefresh()
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const order = sortOrder ? 'Latest' : 'Oldest'
    toast.show(`Sort by: ${order}`, {
    })

  }, [sortOrder])

  const filteredLogs = logs?.filter(log =>
    log.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  if (!user || user?.is_anonymous) {
    return (
      <>
        { Platform.OS === 'ios' ? (
            <SafeAreaView className='flex-1'>
              <ImageBackground source={require('@/assets/images/blurredlogs.png')} resizeMode='contain'
                className='h-full items-center justify-center bg-background'
              >
                <View className='p-6 shadow-lg bg-white rounded-lg items-center justify-center space-y-2.5 '>
                  <Text className='font-o text-2xl'>Log in to view your logs!</Text>
                  <TouchableOpacity onPress={() => router.push('/login')}
                    className='shadow-lg rounded-lg '
                    style={{
                      backgroundColor: '#FFA500',
                      padding: 15,
                      elevation: 3,
                    }}>
                    <Text className='font-obold text-center text-xl text-white'>Log in</Text>
                  </TouchableOpacity>

                </View>
              </ImageBackground>
            </SafeAreaView>
          ) : (

            <SafeAreaView className='h-full items-center justify-center bg-background' >
              <View className='p-6 shadow-lg bg-white rounded-lg items-center justify-center space-y-2.5 '>
                <Text className='font-o text-2xl'>Log in to view your logs!</Text>
                <TouchableOpacity onPress={() => router.push('/login')}
                  className='shadow-lg rounded-lg '
                  style={{
                    backgroundColor: '#FFA500',
                    padding: 15,
                    elevation: 3,
                  }}>
                  <Text className='font-obold text-center text-xl text-white'>Log in</Text>
                </TouchableOpacity>

              </View>
            </SafeAreaView>
          )
        }
      </>
    );
  }

  if (!logs) {
    return (
      <SafeAreaView className='h-full flex flex-col items-center justify-center bg-background'>
        <ActivityIndicator size={48} color={'black'} />
        <Text className='font-o text-2xl'>Loading your logs...</Text>
      </SafeAreaView>
    );
  }

  const changeSortOrder = () => setSortOrder(prev => !prev)

  return (
    <SafeAreaView
      className='flex-1 bg-background'
    >

      {logs?.length === 0 && (
        <View
          className='h-full flex flex-col items-center justify-center px-2'
        >
          <Text className='text-2xl font-oextrabold text-center mb-4'>You currently have no VSS logs.</Text>

          <Link href={'/create'} className='' asChild>
            <Pressable
              className='shadow-lg rounded-lg'
              style={{
                backgroundColor: '#FFA500',
                padding: 20,
                elevation: 3,
              }}
            >
              <Text className='text-white text-2xl font-obold'>Make your first log.</Text>
            </Pressable>
          </Link>

        </View>
      )}

      {logs && (
        <>
          <Backend />
          <View className='flex flex-row mx-3'>
            <TextInput
              className='p-2 border-b border-gray-300 flex-1 font-o'
              placeholder='Search logs...'
              placeholderTextColor='#888'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View className='ml-3 mr-1 my-auto'>
              {sortOrder ?
                <MaterialIcons name='keyboard-arrow-down' onPress={changeSortOrder} size={36} color='#FFA500' />
                :
                <MaterialIcons name='keyboard-arrow-up' onPress={changeSortOrder} size={36} color='#FFA500' />
              }
            </View>
          </View>

          <ScrollView className='pt-1' >
            {sortOrder ?
              filteredLogs?.slice(0).reverse().map(item => (
                <LogPreview key={item.id}
                  id={item.id}
                  title={item.title}
                  date={item.date}
                  time={item.time}
                  symptoms={Object.keys(item.symptoms)}
                  handleRefresh={triggerRefresh}
                />
              ))
              :
              filteredLogs?.map(item => (
                <LogPreview key={item.id}
                  id={item.id}
                  title={item.title}
                  date={item.date}
                  time={item.time}
                  symptoms={Object.keys(item.symptoms)}
                  handleRefresh={triggerRefresh}
                />
              ))

            }
          </ScrollView>
        </>
      )}


    </SafeAreaView>
  )
}

export default Log