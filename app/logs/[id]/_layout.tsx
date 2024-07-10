import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, Slot, useRouter, useLocalSearchParams } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

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

const LogsLayout = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [log, setLog] = useState<Log | null>(null)
    const [title, setTitle] = useState('')

    useEffect(() => {
        const fetchLogDetails = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('logs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(error);
            } else {
                setLog(data)
                setTitle(data.title);
            }
        };

        fetchLogDetails();
    }, []);

    const shareLog = async () => {
        if (log) {
            const shareContent = `
            Title: ${log.title}
            Date: ${log.date}
            Time: ${log.time}
            Symptoms: ${JSON.stringify(log.symptoms, null, 2)}
            Medications: ${log.medications.map(med => med.name).join(', ')}
            Notes: ${log.notes}
          `;

            const fileUri = FileSystem.cacheDirectory + 'log.txt';
            await FileSystem.writeAsStringAsync(fileUri, shareContent);

            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri);
            } else {
                alert('Sharing is not available on this device');
            }
        }
    };


    return (
        <Stack
            screenOptions={{
                headerTitle: title ?? 'Loading',
                headerShown: true,
                headerLeft: () => (
                    <MaterialIcons
                        name='arrow-back-ios-new'
                        size={24}
                        onPress={() => router.back()}
                        color='#FFA500'
                    />
                ),
                headerRight: () => (
                    <MaterialIcons
                        name='ios-share'
                        size={24}
                        onPress={shareLog}
                        color='#FFA500'
                    />
                ),
            }}
        >
            {/* <Stack.Screen name='index' options={{ headerShown: true }} /> */}
        </Stack>
        // <Slot/>
    )
}

export default LogsLayout