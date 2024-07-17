import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'

const Backend = () => {

    const { session, user } = useAuth()

    const user_id = user?.id

    const handleExport = async () => {
        const token = session?.access_token
        const email = user?.email

        const response = await fetch('http://localhost:8000/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, user_id })
        })

        console.log(JSON.stringify(response, null, 2))
    }

    return (
        <View>
            <Button title='Export CSV to Email' onPress={handleExport} />
        </View>
    )
}

export default Backend