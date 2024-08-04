import { View, Text, Button, Alert, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'

const Backend = () => {

    const { session, user } = useAuth()

    const user_id = user?.id

    const handleExport = async () => {
        const email = user?.email

        const response = await fetch('http://localhost:8000/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, user_id })
        })

        const responseBody = await response.text()

        Alert.alert(responseBody)
    }

    return (

        <Pressable className='mx-auto my-0.5 w-6/12 p-2.5 rounded-full space-x-1 flex flex-row items-center justify-center bg-projectOrange'

            onPress={handleExport}
        >
            <Text className='text-white font-osemibold text-center text-'>Export Logs to Email</Text>
        </Pressable>
    )
}

export default Backend