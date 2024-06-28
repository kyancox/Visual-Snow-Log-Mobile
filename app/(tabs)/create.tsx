import { View, Text, TextInput, Button, Platform, FlatList, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import SymptomDetails from '@/components/SymptomDetails';

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
  // const [symptomDetails, setSymptomDetails] = useState<{ [key: string]: any }>(() => {
  //   const initialSymptomDetails: { [key: string]: any } = {};
  //   symptomsLogged.forEach((symptom) => {
  //     initialSymptomDetails[symptom.symptom] = {};
  //   });
  //   return initialSymptomDetails;
  // });
  const [editingSymptomId, setEditingSymptomId] = useState<string | null>(null);

  const handleSymptomPress = (symptom: { id: string; symptom: string; }) => {
    if (!symptomsLogged.some(s => s.symptom === symptom.symptom)) {
      const newSymptom = { id: uuidv4(), symptom: symptom.symptom, details: {} };
      setSymptomsLogged([...symptomsLogged, newSymptom]);
      // setSymptomDetails(prevState => ({
      //   ...prevState,
      //   // Maybe add symptom name here for ease of use
      //   [newSymptom.id]: {}
      // }));
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptomsLogged.some(s => s.symptom === customSymptom)) {
      setSymptomsLogged([...symptomsLogged, { id: uuidv4(), symptom: customSymptom, details: {} }]);
      // setSymptom
      setCustomSymptom('');
    }
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptomsLogged(symptomsLogged.filter(s => s.id !== id));
    // setSymptomDetails(prevState => {
    //   const newState = { ...prevState };
    //   delete newState[id];
    //   return newState;
    // });
    if (editingSymptomId === id) {
      setEditingSymptomId(null);
    }
  };

  const handleEditSymptom = (id: string) => {
    // console.log(symptomsLogged)
    setEditingSymptomId(id);
  };

  const hideDetails = () => {
    setEditingSymptomId(null)
  }

  const [editingTitle, setEditingTitle] = useState('');
  useEffect(() => {
    const selectedSymptom = symptomsLogged.find(s => s.id === editingSymptomId);
    if (selectedSymptom) {
      setEditingTitle(selectedSymptom.symptom);
    }
  }, [editingSymptomId, symptomsLogged])

  // Additional Notes
  const [notes, setNotes] = useState('')

  const handleSymptomDetailsChange = (details: any) => {
    setSymptomsLogged(prevState => {
      const index = prevState.findIndex(s => s.id === editingSymptomId);
      if (index !== -1) {
        const updatedSymptom = { ...prevState[index], details };
        const newState = [...prevState];
        newState[index] = updatedSymptom;
        return newState;
      }
      return prevState;
    });
    // console.log(editingTitle)
    // console.log(symptomsLogged)
  }

  const getResponseData = () => {
    return symptomsLogged.reduce((acc, symptom) => {
      acc[symptom.symptom] = symptom.details;
      return acc;
    }, {} as { [key: string]: any });
  };


  const [response, setResponse] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    const object = symptomsLogged.reduce((acc, symptom) => {
      acc[symptom.symptom] = symptom.details;
      return acc;
    }, {} as { [key: string]: any });
    setResponse(object)
    console.log(object)
    // console.log(response[editingTitle])
  }, [symptomsLogged])

  // Now: we have symptomsLogged which is [{id, symptom}...]

  // We can: store all details in symptomsLogged, and then refactor 
  // - make symptomsLogged a {id: {symptom, details... }}
  // - make symptomsLogged [{id, symptom, details}... ]

  // Or: make a brand new state, meaning we have two states to manage: symptomsLogged and symptomDetails, and refactor that state. 

  // End goal is to have an object where {[key: symptom] : {object: details} }
  // details of each symptom, empty or only needed key-values 

  return (
    <SafeAreaView
      className='mx-4'
    >

      {/* <KeyboardAvoidingView
        behavior='padding'
      > */}


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
                <View key={item.id} className='flex-row justify-between items-center'>
                  <Text className='flex-1 mr-10'>&#8226; {item.symptom}</Text>
                  <TouchableOpacity onPress={() => handleEditSymptom(item.id)}>
                    <Text className='text-projectOrange' >Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveSymptom(item.id)}>
                    <Text className='text-red-500' > Remove </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}


        {editingSymptomId && (
          <SymptomDetails
            key={editingSymptomId}
            title={editingTitle}
            details={symptomsLogged.find(s => s.id === editingSymptomId)?.details || {}}
            onDetailsChange={(details) => handleSymptomDetailsChange(details)}
            hideDetails={hideDetails} />
        )}

        <View className='flex-row justify-center items-center'>
          <Text className='text-xl font-bold'>WIPMedication/Treatments:</Text>
          <TextInput
            className='border rounded shadow p-2 mx-4 flex-1'
            placeholder=""
          // value={customSymptom}
          // onChangeText={setCustomSymptom}
          />
        </View >
        {/* OpenFDA */}

        <Text className='text-xl font-semibold'>Additional Notes:</Text>
        <TextInput
          multiline
          className='text-center border rounded shadow p-2 mx-4 min-w-[20px] items-center'
          placeholder={`Add additional notes about ${title}`}
          value={notes}
          onChangeText={setNotes}
        />

        {symptomsLogged.length > 0 && (
          <>
            <Text className='text-xl font-semibold'>Review:</Text>
            {symptomsLogged.map( (item) =>  (
                        // {Object.keys(response).map((key) => (
              <View key={item.id}>
                {/* add title date, etc, other info  */}
                <Text>&#8226; {item.symptom}</Text>
                {Object.keys(item.details).length > 0 && (
                  <Text>
                    (
                    {Object.entries(item.details).map(([subKey, subValue], index, array) => (
                      <Text key={subKey}>
                        {subKey}: {Array.isArray(subValue) ? subValue.join(', ') : String(subValue)}{index === array.length - 1 ? '' : ', '}
                      </Text>
                    ))}
                    )
                  </Text>
                )}
              </View>
            ))}
          </>
        )}



        <View className='mb-3'>
          <Button title='Submit' />
        </View>

      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView >
  )
}

export default Create
