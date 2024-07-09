import { View, Text, Pressable, ScrollView, SafeAreaView} from 'react-native'
import { Link } from "expo-router";
import React, { useState, useEffect } from 'react'
import {  } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '@/providers/AuthProvider';
import LogPreview from '@/components/LogPreview';
import { useRefresh } from '@/providers/RefreshContext';

const Log = () => {
  const [logs, setLogs] = useState<any[] | null>(null)
  const {refresh, triggerRefresh} = useRefresh()

  const { session, user } = useAuth()

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

  return (
    <SafeAreaView
    className='flex-1'
    >
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
          {logs.map(item => (
            <LogPreview key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              time={item.time}
              symptoms={Object.keys(item.symptoms)}
              handleRefresh={triggerRefresh}
            />
          ))}
        </ScrollView>
      )}


    </SafeAreaView>
  )
}

export default Log