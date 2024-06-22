import { View, Text, TextInput, Button, Platform, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library

import SymptomDetails from '@/components/SymptomDetails';



const Create = () => {

  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(-2);
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate
  }

  const getDefaultTitle = () => {
    return `Symptom Log ${getCurrentDate()}`
  }

  const [title, setTitle] = useState(getDefaultTitle)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())

  const dateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const timeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  const defaultSymptoms = [
    { id: '1', symptom: 'Visual static' },
    { id: '2', symptom: 'Afterimages (Palinopsia)' },
    { id: '3', symptom: 'Light sensitivity (Photophobia)' },
    { id: '4', symptom: 'Migraines' },
    { id: '5', symptom: 'Headaches' },
    { id: '6', symptom: 'Floaters' },
    { id: '7', symptom: 'Ringing in ears (Tinnitus)' },
    { id: '8', symptom: 'Night blindness (Nyctalopia)' },
  ];

  const [customSymptom, setCustomSymptom] = useState('');
  const [symptomsLogged, setSymptomsLogged] = useState<{ id: string, symptom: string }[]>([]);

  const addSymptom = () => {
    if (customSymptom.trim() && !symptomsLogged.some(s => s.symptom === customSymptom)) {
      setSymptomsLogged([...symptomsLogged, { id: uuidv4(), symptom: customSymptom }]);
      setCustomSymptom('');
    }
  };

  const handleSymptomPress = (symptom: { id: string; symptom: string; }) => {
    if (!symptomsLogged.some(s => s.symptom === symptom.symptom)) {
      setSymptomsLogged([...symptomsLogged, { id: uuidv4(), symptom: symptom.symptom }]);
    }
  }

  const handleRemoveSymptom = (id: string) => {
    setSymptomsLogged(symptomsLogged.filter(s => s.id !== id));
  };

  return (
    <SafeAreaView
      className='mx-4'
    >

      <Text className='text-3xl font-extrabold'>Log Symptoms</Text>
      <ScrollView className=''>



        <View className='flex flex-row justify-between items-center my-2'>
          <Text className='text-xl font-bold'>
            Log Title:
          </Text>
          <TextInput
            className='border rounded shadow p-2 ml-4 flex-1'
            placeholder={getDefaultTitle()}
            placeholderTextColor="#888"
            onChangeText={setTitle}
          />
        </View>

        <View className='flex flex-row justify-between items-center my-1'>
          <Text className='text-xl font-bold '>
            Date:
          </Text>
          <DateTimePicker
            className=''
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={dateChange}
          />
        </View>
        {/* <Text className='mt-1'>Selected Date: {date.toLocaleDateString()}</Text> */}

        <View className='flex flex-row justify-between items-center my-1'>
          <Text className='text-xl font-bold '>
            Time:
          </Text>

          <DateTimePicker
            className=''
            testID="timePicker"
            value={time}
            mode="time"
            display="default"
            onChange={timeChange}

          />
        </View>
        {/* <Text className='mt-1'>Selected Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> */}

        <Text className='text-2xl font-bold '>Symptoms: <Text className='text-red-500'>*</Text></Text>
        <FlatList
          horizontal={true}
          data={defaultSymptoms}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSymptomPress(item)}>
              <View className='p-4 bg-gray-200 m-2'>
                <Text>{item.symptom}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}

        />
        <TextInput
          className='border rounded shadow p-2 mx-4 flex-1'
          placeholder="Add custom symptom"
          value={customSymptom}
          onChangeText={setCustomSymptom}
        />
        <Button title="Add Symptom" onPress={addSymptom} />

        {symptomsLogged.length > 0 && (
          <>
            <Text className='text-xl font-bold'>Symptoms Logged:</Text>
            <View>
              {symptomsLogged.map((item) => (
                <View key={item.id} className='flex-row justify-between items-center'>
                  <Text>&#8226; {item.symptom}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSymptom(item.id)}>
                    <Text className='text-red-500' > Remove </Text>
                  </TouchableOpacity >
                </View>
              ))}
            </View>
          </>
        )}

        <SymptomDetails/>
        
      </ScrollView>
    </SafeAreaView >
  )
}

export default Create
