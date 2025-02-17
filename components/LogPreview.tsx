import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { format, parseISO } from 'date-fns'
import { Feather, SimpleLineIcons, Ionicons } from '@expo/vector-icons'
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

    const formattedDate = format(parseISO(date), 'MMMM do, yyyy')
    const formattedTime = format(parseISO(date + 'T' + time), 'h:mm a')

    const handleDelete = async () => {

        Alert.alert(`Are you sure you want to delete ${title}?`, 'This action cannot be undone.', [
            {
                text: 'Delete',
                onPress: async () => {
                    const { error } = await supabase
                        .from('logs')
                        .delete()
                        .eq('id', id)

                    if (error) {
                        Alert.alert(error.message)
                        console.error(error)
                    }
                    else handleRefresh()
                },
                style: 'destructive',
            },
            { text: 'Cancel', style: 'cancel' },
        ]);


    }

    const handleEdit = async () => {


        Alert.alert(`Do you want to edit ${title}?`, '', [
            {
                text: 'Edit',
                onPress: async () => {
                    let { data: log, error } = await supabase
                        .from('logs')
                        .select('*')
                        .eq('id', id)
                        .single()

                    if (error) {
                        Alert.alert(error.message)
                        console.error(error)
                    } else {
                        router.push({ pathname: '/create', params: { log: JSON.stringify(log) } })
                    }
                },
                style: 'default',
            },
            { text: 'Cancel', style: 'cancel' },
        ]);

    }


    return (
        <TouchableOpacity className='flex flex-row justify-between rounded shadow bg-gray-300/60 mx-3 my-2 p-2' onPress={() => router.push(`/logs/${id}`)}>
            <View className='flex-1 mr-2'>
                <Text className='text-xs font-o'>{formattedDate} at {formattedTime} </Text>
                <Text className='text-xl font-obold'>{title}</Text>
                <Text className='font-o'><Text className='font-osemibold'>Symptoms</Text>: {symptoms.join(', ')}</Text>
            </View>
            <View className='flex flex-col items-center justify-center gap-2'>
                <TouchableOpacity className='p-1 rounded' style={{
                    backgroundColor: "#e89c0e"
                }}>
                    <SimpleLineIcons name='pencil' size={20} color={'#FFF'} onPress={handleEdit} />
                </TouchableOpacity>
                <TouchableOpacity className='p-0.5 rounded' style={{
                    backgroundColor: "#e89c0e"
                }}>
                    <Ionicons name='trash-outline' size={24} color={'#FFF'} onPress={handleDelete} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}


export default LogPreview