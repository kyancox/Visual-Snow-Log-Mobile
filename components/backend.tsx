import { View, Text, Button, Alert, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'

const Backend = () => {

    const { session, user } = useAuth()

    const user_id = user?.id

    const handleExport = async () => {
        const email = user?.email

        try {
            const response = await fetch('http://18.217.6.114:80/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, user_id })
            })
            const responseBody = await response.text()
    
            Alert.alert(responseBody)
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <TouchableOpacity className='mx-auto my-0.5 w-6/12 p-2.5 rounded-full space-x-1 flex flex-row items-center justify-center bg-projectOrange'

            onPress={handleExport}
        >
            <Text className='text-white font-osemibold text-center text-'>Export Logs to Email</Text>
        </TouchableOpacity>
    )
}

export default Backend