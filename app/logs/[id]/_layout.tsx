import { View, Text, Button, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, Slot, useRouter, useLocalSearchParams } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import * as FileSystem from 'expo-file-system';
import { format, parseISO } from 'date-fns'

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

    const sanitizeFileName = (name: string) => {
        return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    };

    const shareLog = async () => {
        if (log) {
            const formattedDate = format(parseISO(log.date), 'MMMM do, yyyy')
            const formattedTime = format(parseISO(log.date + 'T' + log.time), 'h:mm a')

            const shareContent =
                `
${log.title}
${formattedDate} at ${formattedTime}

${Object.entries(log.symptoms).map(([symptom, details], index) => {
                    const detailsContent = Object.keys(details).length !== 0 ?
                        Object.entries(details).map(([subKey, subValue]) => (
                            `  - ${subKey}: ${typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)
                                ? Object.entries(subValue).map(([subItemKey, subItemValue], subIndex, subArray) => (
                                    `${subItemValue} ${subItemKey}${subIndex === subArray.length - 1 ? '' : ' and '}`
                                )).join('')
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
                                    : String(subValue))}`
                        )).join('\n')
                        : '';
                    return `${index + 1}. ${symptom}${detailsContent ? '\n' + detailsContent : ''}`;
                }).join('\n\n')}
${log.medications.length > 0 ?
                    `\nMedications:\n${log.medications.map((med, index) => (
                        `${index + 1}. ${med.name}`
                    )).join('\n')}`
                    : ''}
${log.notes &&
                `\nNotes:\n${log.notes}`
                }
`;

            try {
                await Share.share({
                    message: shareContent,
                    title: log.title,
                });
            } catch (error) {
                if (error instanceof Error) {
                    alert('Error sharing log: ' + error.message);
                } else {
                    alert('Error sharing log: ' + String(error));
                }
            }
        }
    };


    return (
        <Stack
            screenOptions={{
                headerTitle: title ?? 'Loading',
                headerTitleStyle: {
                    fontFamily: 'Onest',
                    fontWeight: '500'
                },
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