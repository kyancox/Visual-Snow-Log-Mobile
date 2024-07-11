import { View, Text, Pressable, ScrollView, SafeAreaView, TextInput, Button } from 'react-native'
import { Link } from "expo-router";
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '@/providers/AuthProvider';
import LogPreview from '@/components/LogPreview';
import { useRefresh } from '@/providers/RefreshContext';
import useDebounce from '@/hooks/useDebounce';

import { MaterialIcons } from '@expo/vector-icons';

const Log = () => {
  const [logs, setLogs] = useState<any[] | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 150);
  const [sortOrder, setSortOrder] = useState(true) // True = Latest, False = Oldest
  const { refresh, triggerRefresh } = useRefresh()

  useEffect(() => {
    const readUserLogs = async () => {
      let { data, error } = await supabase
        .from('logs')
        .select('*')

      if (error) console.error(error)
      else {
        console.log(JSON.stringify(data, null, 2))
        setLogs(data)
      }
    }

    readUserLogs()
  }, [refresh])

  useEffect(() => {
    triggerRefresh()
  }, [])

  const filteredLogs = logs?.filter(log =>
    log.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  if (!logs) {
    return (
      <SafeAreaView className='h-full'>
        <Text className='mx-auto my-auto text-3xl'>Loading your logs...</Text>
      </SafeAreaView>
    );
  }

  const changeSortOrder = () => setSortOrder(prev => !prev)

  return (
    <SafeAreaView
      className='flex-1'
    >
      <View className='flex flex-row mx-3'>
        <TextInput
          className='p-2 border-b border-gray-300 flex-1'
          placeholder='Search logs...'
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

      {logs?.length === 0 && (
        <View
          className='h-full flex flex-col items-center justify-center px-2'
        >
          <Text className='text-2xl font-extrabold text-center mb-4'>You currently have no VSS logs.</Text>

          <Link href={'/create'} className='' asChild>
            <Pressable
              style={{
                backgroundColor: '#FFA500',
                padding: 20,
                borderRadius: 5,
                elevation: 3,
              }}
            >
              <Text className='text-white text-2xl font-bold'>Make your first log.</Text>
            </Pressable>
          </Link>

        </View>
      )}

      {logs && (
        <ScrollView className='' >
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
      )}


    </SafeAreaView>
  )
}

export default Log