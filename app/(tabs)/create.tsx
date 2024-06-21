import { View, Text, TextInput, Button, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';


const Create = () => {
  // TextInput

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

  return (
    <SafeAreaView
      className='mx-4'
    >

      <Text className='text-2xl font-extrabold'>Log Symptoms</Text>

      <View className='flex flex-row justify-between items-center'>
        <Text className='text-xl font-bold underline'>
          Log Title:
        </Text>
        <TextInput
          className='border rounded shadow p-2 mx-4 flex-1'
          placeholder={getDefaultTitle()}
          placeholderTextColor="#888" 
          onChangeText={setTitle}
        />

      </View>

      <View className='flex flex-row justify-between items-center'>
        <Text className='text-xl font-bold underline'>
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

      <Text className='mt-1'>Selected Date: {date.toLocaleDateString()}</Text>

      <View className='flex flex-row justify-between items-center'>
        <Text className='text-xl font-bold underline'>
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

      <Text className='mt-1'>Selected Time: {time.toLocaleTimeString()}</Text>

    </SafeAreaView>
  )
}

export default Create