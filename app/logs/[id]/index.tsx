import { View, Text, SafeAreaView, Button, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'

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
  const { id } = useLocalSearchParams();
  const [log, setLog] = useState<Log | null>(null);
  const router = useRouter();

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
        setLog(data);
      }
    };

    fetchLogDetails();
  }, [id]);

  if (!log) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

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

  const formattedDate = format(parseISO(log.date), 'MMMM do, yyyy')
  const formattedTime = format(parseISO(log.date + 'T' + log.time), 'h:mm a')


  return (
    <SafeAreaView className=' h-full'>
      <View className='flex flex-col items-center justify-center rounded shadow p-2 bg-gray-300 border border-gray-400 mx-auto my-3'>
        <Text className='text-3xl font-extrabold '>{log.title}</Text>
        <Text className='font-semibold'>{formattedDate} at {formattedTime}</Text>
      </View>
      <ScrollView
        className='bg-white mx-2 py-1 rounded-2xl'
      >
        <View className='mx-auto'>
          <Text className='text-2xl font-bold'>Symptoms Logged:</Text>

          {Object.entries(log.symptoms).map(([symptom, details]) => (
            <View key={uuidv4()} className='rounded shadow p-2 bg-gray-200 border border-gray-300 my-2'>
              <Text className='text-xl font-bold text-center'
              //  style={{
              //   color:'#e69502'
              //  }}
              >{symptom}</Text>
              {Object.keys(details).length !== 0 && (
                <>
                  {Object.entries(details).map(([subKey, subValue], index, array) => (
                    <Text key={subKey} className='mx-1 text-base'>
                      <Text className='font-semibold'>{subKey}</Text>: {typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)
                        ? Object.entries(subValue).map(([subItemKey, subItemValue], subIndex, subArray) => (
                          <Text key={subItemKey}>{subItemValue} {subItemKey}{subIndex === subArray.length - 1 ? '' : ' and '}</Text>
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
              <Text className='text-2xl font-bold'>Medications:</Text>
              {log.medications.map((med, index) => (
                <Text key={med.id} className='text-lg'>{index + 1}. {med.name}</Text>
              ))}
            </>
          )}

          {log.notes && (
            <>
              <Text className='text-2xl font-bold'>Notes:</Text>
              <Text className='text-lg'>{log.notes}</Text>
            </>
          )}
        </View>
        <Text className='mb-1'></Text>
      </ScrollView>
      <Button title="Back to Logs" color='#FFA500' onPress={() => router.push('/logs')} />
    </SafeAreaView>
  );
};

export default LogDetails;