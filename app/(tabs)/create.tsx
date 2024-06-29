import { View, Text, TextInput, Button, Platform, FlatList, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { AntDesign } from '@expo/vector-icons';

import SymptomDetails from '@/components/SymptomDetails';
import Accordion from '@/components/Accordion';

const Create = () => {

  // Date, Time, Title

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

  // Symptoms

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
  const [symptomsLogged, setSymptomsLogged] = useState<{ id: string, symptom: string, details: any }[]>([]);


  const handleSymptomPress = (symptom: { id: string; symptom: string; }) => {
    console.log(JSON.stringify(symptomsLogged))
    if (!symptomsLogged.some(s => s.symptom === symptom.symptom)) {
      const newSymptom = { id: uuidv4(), symptom: symptom.symptom, details: {} };
      setSymptomsLogged([...symptomsLogged, newSymptom]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptomsLogged.some(s => s.symptom === customSymptom)) {
      setSymptomsLogged([...symptomsLogged, { id: uuidv4(), symptom: customSymptom, details: {} }]);
      setCustomSymptom('');
    }
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptomsLogged(symptomsLogged.filter(s => s.id !== id));
  };

  const handleSymptomDetailsChange = (details: any, id: string) => {
    setSymptomsLogged(prevState => {
      const index = prevState.findIndex(s => s.id === id);
      if (index !== -1) {
        const updatedSymptom = { ...prevState[index], details };
        const newState = [...prevState];
        newState[index] = updatedSymptom;
        return newState;
      }
      return prevState;
    });
  }

  // Medication / Treatments

  interface Medication {
    id: string;
    name: string;
  }

  const [medications, setMedications] = useState<Medication[]>([]);

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id: string, text: string) => {
    console.log(medications)
    setMedications(prevState => prevState.map(med => {
      if (med.id === id) {
        return { ...med, name: text };
      }
      return med;
    }));
  }

  // Additional Notes
  const [notes, setNotes] = useState('')

  // API Request Body
  const getBodyData = () => {
    return symptomsLogged.reduce((acc, symptom) => {
      acc[symptom.symptom] = symptom.details;
      return acc;
    }, {} as { [key: string]: any });
  };


  return (
    <SafeAreaView
      className='mx-4'
    >

      {/* <KeyboardAvoidingView
        behavior='padding'
      > */}


      <Text className='text-3xl font-extrabold'>Log Symptoms</Text>
      <ScrollView className='h-full'>



        <View className='flex flex-row justify-between items-center my-2'>
          <Text className='text-xl font-bold'>
            Log Title:
          </Text>
          <TextInput
            className='border rounded shadow p-2 ml-4 flex-1'
            placeholder={getDefaultTitle()}
            placeholderTextColor="#888"
            onChangeText={(text) => (setTitle(text || getDefaultTitle()))}
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

        <View className=''>
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
          <Button title="Add Symptom" color={'#FFA500'} onPress={addCustomSymptom} />
        </View>

        {symptomsLogged.length > 0 && (
          <>
            <Text className='text-xl font-bold'>Symptoms Logged:</Text>
            <View>
              {symptomsLogged.map((item) => (
                <View key={item.id} className='flex-row justify-center items-start'>
                  <Accordion title={`• ${item.symptom}`} onDelete={() => handleRemoveSymptom(item.id)}>
                    <SymptomDetails
                      key={item.id}
                      title={item.symptom}
                      details={item.details}
                      onDetailsChange={(details) => handleSymptomDetailsChange(details, item.id)}
                    />
                  </Accordion>
                  {/* <AntDesign name='delete' size={24} color='#FFA500'  onPress={() => handleRemoveSymptom(item.id)} /> */}

                  {/* 
                  <Text className='flex-1 mr-10'>&#8226; {item.symptom}</Text>
                  <TouchableOpacity onPress={() => handleEditSymptom(item.id)}>
                    <Text className='text-projectOrange' >Show Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveSymptom(item.id)}>
                    <Text className='text-red-500' > Remove </Text>
                  </TouchableOpacity> 
                  */}
                </View>
              ))}
            </View>
          </>
        )}


        {/* Medications / Treatments */}
        <View >
          <Text className='text-xl font-bold'>Medication/Treatments:</Text>
          {medications.map((item => (
            <View className='flex flex-row items-center m-1' key={item.id}>
              <TextInput
                multiline
                autoCorrect={false}
                className='border rounded shadow p-2 mx-4 flex-1'
                placeholder="Enter medication/treatment"
                value={medications.find(s => s.id === item.id)?.name || ''}
                onChangeText={(text) => updateMedication(item.id, text)}
              />

              <AntDesign name='delete' size={24} color='#FFA500' onPress={() => deleteMedication(item.id)} />


              {/* <Button title="Delete" onPress={() => deleteMedication(item.id)} /> */}
            </View>

          )))}

          <Button
            title='Add'
            color='#FFA500'
            onPress={() => {
              if (medications.length === 0 || (medications.length > 0 && medications[medications.length - 1].name)) {
                setMedications([...medications, { id: Date.now().toString(), name: '' }]);
              }
            }}
          />

        </View>

        <Text className='text-xl font-semibold'>Additional Notes:</Text>
        <TextInput
          multiline
          className='text-center border rounded shadow p-2 mx-4 min-w-[20px] items-center'
          placeholder={`Add additional notes about ${title}`}
          value={notes}
          onChangeText={setNotes}
        />

        {/* Review Section */}
        {symptomsLogged.length > 0 && (
          <>
            <Text className='text-xl font-semibold'>Review:</Text>
            <Text><Text className='font-bold'>Title:</Text> {title}</Text>
            <Text><Text className='font-bold'>Date:</Text> {date.toLocaleDateString()}</Text>
            <Text><Text className='font-bold'>Time:</Text> {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text className='font-bold'>Symptoms (Symptom Details):</Text>
            {symptomsLogged.map((item) => (
              <View key={item.id}>
                <Text>&#8226; {item.symptom}
                  {Object.keys(item.details).length > 0 && (
                    <Text>
                      {' '}— (
                      {Object.entries(item.details).map(([subKey, subValue], index, array) => (
                        <Text key={subKey}>
                          <Text className='font-semibold'>{subKey}</Text>: {typeof subValue === 'object' && subValue !== null
                            ? Object.entries(subValue).map(([subItemKey, subItemValue], subIndex, subArray) => (
                              <Text key={subItemKey}>{subItemValue} {subItemKey}{subIndex === subArray.length - 1 ? '' : ' '}</Text>
                            ))
                            : (Array.isArray(subValue) ? `${subValue.join(', ')}` : String(subValue))}
                          {index === array.length - 1 ? '' : ', '}
                        </Text>
                      ))}
                      )
                    </Text>
                  )}
                </Text>
              </View>
            ))}

            {medications.length > 0 && (
              <>
                <Text className='font-bold'>Medications/Treatments:</Text>
                {medications.map((item) => (
                  <View key={item.id}>
                    <Text>{medications.indexOf(item) + 1}. {item.name}</Text>
                  </View>
                ))}

              </>
            )}

            {notes && (
              <Text><Text className='font-bold'>Log Notes:</Text> {notes}</Text>
            )}
          </>
        )}

        <View className='mb-8'>
          <Button title='Submit' />
        </View>

      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView >
  )
}

export default Create
