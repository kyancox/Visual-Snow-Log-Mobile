import { View, Text, SafeAreaView, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

type Log = {
  created_at: string | null
  date: string
  id: number
  medications: {id: string, name: string}[]
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

  return (
    <SafeAreaView>
      {/* include header? leftheader: backarrow, header title: title, rightheader: share  */}
      <View>
        <Text className='text-3xl font-extrabold'>{log.title}</Text>
        <Text>Date: {log.date}</Text>
        <Text>Time: {log.time}</Text>
        <Text>Symptoms:</Text>
        {Object.entries(log.symptoms).map(([symptom, details]) => (
          <View key={symptom}>
            <Text>{symptom}</Text>
            <Text>Details: {JSON.stringify(details)}</Text>
          </View>
        ))}
        <Text>Medications:</Text>
        {log.medications.map((med) => (
          <Text key={med.id}>{med.name}</Text>
        ))}
        <Text>Notes: {log.notes}</Text>
      </View>
      <Button title="Back to Logs" onPress={() => router.push('/logs')} />
    </SafeAreaView>
  );
};

export default LogDetails;