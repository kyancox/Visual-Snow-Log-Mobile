import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { format, parseISO } from 'date-fns'
import { AntDesign, } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

interface LogPreviewProps {
    id: string
    title: string
    date: string
    time: string
    symptoms: string[]
    handleRefresh: () => void

}

const LogPreview = ({ id, title, date, time, symptoms, handleRefresh }: LogPreviewProps) => {

    const formattedDate = format(parseISO(date), 'MM-dd-yyyy')
    const formattedTime = format(parseISO(date + 'T' + time), 'hh:mm a')

    const handleDelete = async () => {

        const { error } = await supabase
            .from('logs')
            .delete()
            .eq('id', id)

        if (error) console.error(error)
        else {
            Alert.alert('Delete successful')
            handleRefresh()
        }
    }


    return (
        <TouchableOpacity className='flex flex-row justify-between rounded shadow bg-gray-300 mx-3 my-2 p-2' onPress={() => router.push(`/logs/${id}`)}>
            <View className='flex-1 mr-2'>
                <Text className='text-xs'>{formattedDate} at {formattedTime} </Text>
                <Text className='text-xl font-bold'>{title}</Text>
                <Text><Text className='font-semibold'>Symptoms</Text>: {symptoms.join(', ')}</Text>
            </View>
            <View className='flex flex-col items-center justify-center gap-2'>
                <TouchableOpacity className='p-0.5 rounded' style={{
                    backgroundColor: "#e89c0e"
                }}>
                    <AntDesign name='edit' size={24} color={'#FFF'} />
                </TouchableOpacity>
                <TouchableOpacity className='p-0.5 rounded' style={{
                    backgroundColor: "#e89c0e"
                }}>
                    <AntDesign name='delete' size={24} color={'#FFF'} onPress={handleDelete} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}


export default LogPreview