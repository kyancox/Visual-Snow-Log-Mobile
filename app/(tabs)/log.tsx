import { View, Text, Pressable, } from 'react-native'
import { Link } from "expo-router";
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

const Log = () => {
  const [logs, setLogs] = useState(false)

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <SafeAreaView
      className='flex-1'
    >
      {!logs && (
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
    </SafeAreaView>
  )
}

export default Log