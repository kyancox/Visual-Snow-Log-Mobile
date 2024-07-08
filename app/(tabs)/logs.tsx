import { View, Text, Pressable, } from 'react-native'
import { Link } from "expo-router";
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '@/providers/AuthProvider';
import LogPreview from '@/components/LogPreview';

const Log = () => {
  const [logs, setLogs] = useState<any[] | null>(null)
  const [refresh, setRefresh] = useState(false)

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

  const handleRefresh = () => {
    setRefresh(prev => !prev)
  }

  useEffect(() => {
    handleRefresh()
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

        </View>)}

      {logs && (
        logs.map(item => (
          // <View key={item.created_at}>
          //   <Text>Item {index}</Text>
          //   <Text>{item.title}</Text>
          //   <Text>{item.date}</Text>
          //   <Text>{item.time}</Text>
          //   <Text>{item.notes}</Text>
          // </View>
          <LogPreview key={item.id}
            id={item.id}
            title={item.title}
            date={item.date}
            time={item.time}
            symptoms={Object.keys(item.symptoms)}
            handleRefresh={handleRefresh}
             />
        ))
      )}
    </SafeAreaView>
  )
}

export default Log