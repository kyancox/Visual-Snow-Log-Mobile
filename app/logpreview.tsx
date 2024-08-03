import { View, Text, SafeAreaView, Button, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'
import { Image } from 'expo-image'
import { SimpleLineIcons } from '@expo/vector-icons';

import backarrow from '@/assets/icons/backarrow.svg'
import arrow from '@/assets/icons/arrow.svg'
import { useRefresh } from '@/providers/RefreshContext';
import { useAuth } from '@/providers/AuthProvider';


type Log = {
    created_at: string | null
    date: string
    id: number
    medications: { id: string, name: string }[]
    notes: string | null
    symptoms: { [key: string]: any }
    time: string
    title: string
    user_id: string | null
}

const LogDetails = () => {
    const { logData } = useLocalSearchParams();
    const [log, setLog] = useState<Log | null>(null);
    const { triggerRefresh } = useRefresh()
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { session, user } = useAuth()

    useEffect(() => {
        const fetchLogDetails = async () => {

            if (logData) {
                try {
                    const parsedLog = JSON.parse(logData as string) as Log;
                    setLog(parsedLog);
                } catch (error) {
                    console.error('Failed to parse log data:', error);
                }
            } else {
                console.error('No log data found.')
            }

        };

        fetchLogDetails();
    }, [logData]);

    if (!log) {
        return (
            <SafeAreaView className='h-full'>
                <Text className='mx-auto my-auto text-4xl'>Loading...</Text>
            </SafeAreaView>
        );
    }


    const formattedDate = format(parseISO(log.date), 'MMMM do, yyyy')
    const formattedTime = format(parseISO(log.date + 'T' + log.time), 'h:mm a')

    const handleEdit = async () => {

        Alert.alert(`Do you want to edit ${log.title}?`, '', [
            {
                text: 'Edit',
                onPress: () => router.push({ pathname: '/create', params: { log: JSON.stringify(log) } }),
                style: 'default',
            },
            { text: 'Cancel', style: 'cancel' },
        ]);

    }


    const handleSubmit = async () => {

        if (submitted) {
            console.error('Log already submitted')
            return
        }


        const { data, error } = await supabase
            .from('logs')
            .insert([
                log,
            ])
            .select()

        setSubmitted(true)
        setLoading(true)
        if (error) {
            console.error(error)
            Alert.alert(error.message)
        } else {
            console.log(`Data: ${JSON.stringify(data)}`)
            router.push('/logs')
            Alert.alert(
                'Log submitted!',
                '',
                [
                    { text: 'View Log', onPress: () => router.push(`/logs/${data[0].id}`), style: 'default', isPreferred: true },
                    { text: 'Exit', style: 'cancel' }
                ]
            )
            triggerRefresh()
        }
        setLoading(false)

    }

    return (
        <SafeAreaView className=''>
            <View className='flex flex-col items-center justify-center rounded-lg shadow p-2 bg-gray-300 mx-auto my-3'>
                <Text className='text-3xl font-obold text-center '>{log.title}</Text>
                <Text className='font-osemibold'>{formattedDate} at {formattedTime}</Text>
            </View>
            <ScrollView
                className='bg-white mx-2 rounded-lg mb-3'
            >
                <View className='my-3 mx-6'>
                    <Text className='text-2xl font-obold'>Symptoms Logged:</Text>
                    {Object.entries(log.symptoms).map(([symptom, details], index) => (
                        <View key={uuidv4()} className='my-1'>
                            <Text className='text-xl font-osemibold'
                            //  style={{
                            //   color:'#e69502'
                            //  }}
                            >{index + 1}. {symptom}</Text>
                            {Object.keys(details).length !== 0 && (
                                <>
                                    {Object.entries(details).map(([subKey, subValue], index, array) => (
                                        <Text key={subKey} className='mx-1 font-o text-base'>
                                            <Text className='font-osemibold'>- {subKey}</Text>: {typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)
                                                ? Object.entries(subValue).map(([subItemKey, subItemValue], subIndex, subArray) => (
                                                    <Text className='font-o' key={subItemKey}>{subItemValue} {subItemKey}{subIndex === subArray.length - 1 ? '' : ' and '}</Text>
                                                ))
                                                : (Array.isArray(subValue) ?
                                                    subValue.map((item, index) => {
                                                        if (index === 0 && subValue.length > 2) {
                                                            return item.charAt(0).toUpperCase() + item.slice(1) + ',';
                                                        }
                                                        if (index === 0) {
                                                            return item.charAt(0).toUpperCase() + item.slice(1);
                                                        }
                                                        if (index === subValue.length - 1 && subValue.length > 1) {
                                                            return `and ${item}`;
                                                        }
                                                        if (index < subValue.length - 1 && subValue.length > 2) {
                                                            return `${item},`
                                                        }
                                                        return item
                                                    }).join(' ')
                                                    : String(subValue))}
                                        </Text>
                                    ))}
                                </>
                            )}
                        </View>
                    ))}
                    {log.medications.length > 0 && (
                        <>
                            <Text className='text-xl font-obold'>Medications/Treatments:</Text>
                            {log.medications.map((med, index) => (
                                <Text key={med.id} className='text-base font-o'><Text className='font-osemibold'>{index + 1}.</Text> {med.name}</Text>
                            ))}
                        </>
                    )}

                    {log.notes && (
                        <>
                            <Text className='text-xl font-obold'>Notes:</Text>
                            <Text className='text-base font-o'>{log.notes}</Text>
                        </>
                    )}
                </View>

            </ScrollView>

            <View className='mt-auto mx-2 space-y-2'>
                <TouchableOpacity className='flex flex-row items-center justify-center p-4 rounded-lg bg-projectOrange space-x-1 w-full' onPress={() => router.back()}>
                    {/* <Image source={backarrow} style={{ width: 24, height: 24 }} /> */}
                    <Text className='font-osemibold text-base text-white'>Back</Text>
                    {/* <SimpleLineIcons name='pencil' size={16} color={'white'} /> */}
                </TouchableOpacity>
                {user ?
                    <TouchableOpacity className='flex flex-row items-center justify-center  p-4 rounded-lg bg-projectOrange space-x-1 w-full' onPress={handleSubmit}>
                        <Text className='font-osemibold text-base text-white'>Submit Log</Text>
                        <Image source={arrow} className='bg-' style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>
                    :
                    <>
                        <Text className='text-center font-osemibold text-base my-2 '>Log in to submit this log!</Text>
                        <TouchableOpacity className='flex flex-row items-center justify-center  p-4 rounded-lg bg-projectOrange space-x-1 w-full' onPress={() => router.push('/login')}>
                            <Text className='font-osemibold text-base text-white'>Log in</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>

            {loading && (
                <Modal
                    animationType='fade'
                    visible={loading}
                    transparent
                >
                    <View className='mx-auto my-auto bg-white border border-border rounded-lg p-4 space-y-2'>
                        <ActivityIndicator />
                        <Text className='font-o text-base '>Submitting Log...</Text>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

export default LogDetails;