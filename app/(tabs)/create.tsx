import { View, Text, TextInput, Button, Platform, FlatList, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Pressable, Modal } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image';

import SymptomDetails from '@/components/SymptomDetails';
import Accordion from '@/components/Accordion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRefresh } from '@/providers/RefreshContext';

const Create = () => {

  const { session, user } = useAuth()
  const { triggerRefresh } = useRefresh()

  const { log: logParam } = useLocalSearchParams();
  const log = logParam && typeof logParam === 'string' ? JSON.parse(logParam) : null;

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
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);

    const symptoms = symptomsLogged.reduce((acc, symptom) => {
      acc[symptom.symptom] = symptom.details;
      return acc;
    }, {} as { [key: string]: any });

    return {
      user_id: user?.id,
      title,
      date: formattedDate,
      time: formattedTime,
      symptoms,
      medications,
      notes
    }
  };

  const [submitted, setSubmitted] = useState(false)

  // Modal

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const nameToImagePath: { [key: string]: any } = {
    'Visual static': require('../../assets/images/visualstatic.jpg'),
    'Afterimages (Palinopsia)': require('../../assets/images/afterimages.jpg'),
    'Light sensitivity (Photophobia)': require('../../assets/images/lightsensitivity.jpg'),
    'Migraines': require('../../assets/images/migraines.jpg'),
    'Headaches': require('../../assets/images/headaches.jpg'),
    'Floaters': require('../../assets/images/floaters.jpg'),
    'Ringing in ears (Tinnitus)': require('../../assets/images/ringinginears.jpg'),
    'Night blindness (Nyctalopia)': require('../../assets/images/nightblindness.jpg')
  };

  const handleInfoPress = (symptom: { id: string, symptom: string }) => {
    setSelectedSymptom(symptom.symptom);
    setModalVisible(true);
  };

  const modalDetails = {
    "Visual static": {
      details: "Visual static appears as tiny flickering dots or 'snow' across your entire visual field, similar to the static seen on an untuned television. Logging the frequency and intensity of your visual static can help track changes over time and identify potential triggers.",
      tips: ["Reduce screen time", "Use tinted glasses", "Practice relaxation"]
    },
    "Afterimages (Palinopsia)": {
      details: "Afterimages occur when you continue to see an image even after you have looked away. Keeping a log of these occurrences can assist in understanding their patterns and how they might relate to other symptoms.",
      tips: ["Avoid bright lights", "Use ambient lighting", "Eye exercises"]
    },
    "Light sensitivity (Photophobia)": {
      details: "Light sensitivity can make bright lights or certain lighting conditions uncomfortable or even painful. Recording your photophobia episodes can help determine which environments or times of day are most problematic for you.",
      tips: ["Wear sunglasses", "Adjust screen brightness", "Use hats/visors"]
    },
    "Migraines": {
      details: "Migraines are intense, throbbing headaches often accompanied by nausea, vomiting, and sensitivity to light and sound. Tracking your migraine episodes, including triggers and severity, can help you manage and potentially reduce their occurrence.",
      tips: ["Regular sleep", "Avoid triggers", "Use medication"]
    },
    "Headaches": {
      details: "Headaches can vary in type and intensity, often presenting as a dull ache or sharp pain in different areas of the head. Logging headache details such as duration, location, and potential triggers can provide valuable insights into your overall health.",
      tips: ["Good posture", "Physical activity", "Cold/warm compress"]
    },
    "Floaters": {
      details: "Floaters are small shapes that drift across your vision, often appearing as spots, threads, or cobwebs. Noting the frequency and changes in your floaters can help monitor their impact on your visual experience.",
      tips: ["Stay hydrated", "Eye exercises", "Consult specialist"]
    },
    "Ringing in ears (Tinnitus)": {
      details: "Tinnitus is the perception of ringing, buzzing, or other noises in your ears that are not caused by external sounds. Documenting your tinnitus episodes can assist in understanding their connection with other symptoms and identifying any patterns.",
      tips: ["White noise", "Avoid loud noises", "Stress management"]
    },
    "Night blindness (Nyctalopia)": {
      details: "Night blindness involves difficulty seeing in low light or darkness, making activities like driving at night challenging. Keeping track of your experiences with night blindness can help in identifying situations that exacerbate this symptom and aid in finding effective coping strategies.",
      tips: ["Vitamin A intake", "Use proper lighting", "Night vision aids"]
    }
  };



  const clearState = () => {
    setTitle(getDefaultTitle());
    setDate(new Date());
    setTime(new Date());
    setCustomSymptom('')
    setSymptomsLogged([]);
    setMedications([]);
    setNotes('');
    setSubmitted(false);
  }

  const handleSubmit = async () => {

    if (symptomsLogged.length === 0) {
      Alert.alert('Please add some symptoms', 'test')
      return
    }

    if (submitted) {
      console.error('Log already submitted')
      return
    }

    const logData = getBodyData()

    const { data, error } = await supabase
      .from('logs')
      .insert([
        logData,
      ])
      .select()

    setSubmitted(true)
    if (error) {
      console.error(error)
      Alert.alert(error.message)
    } else {
      console.log(`Data: ${JSON.stringify(data)}`)
      Alert.alert(
        'Log submitted!',
        '',
        [
          { text: 'View Log', onPress: () => router.push(`/logs/${data[0].id}`), style: 'default', isPreferred: true },
          { text: 'Exit', style: 'cancel' }
        ]
      )
      clearState()
      triggerRefresh()
    }

  }

  const handleEdit = async () => {

    if (symptomsLogged.length === 0) {
      Alert.alert('Please add some symptoms', 'test')
      return
    }

    if (submitted) {
      console.error('Log already submitted')
      return
    }

    const logData = getBodyData()

    const { data, error } = await supabase
      .from('logs')
      .update([logData])
      .eq('id', log.id)
      .select()

    setSubmitted(true)
    if (error) {
      console.error(error)
      Alert.alert(error.message)
    } else {
      console.log(`Data: ${JSON.stringify(data)}`)
      Alert.alert(
        'Changes saved!',
        '',
        [
          { text: 'View Log', onPress: () => router.push(`/logs/${data[0].id}`), style: 'default', isPreferred: true },
          { text: 'Exit', style: 'cancel' }
        ]
      )
      clearState()
      router.push('/create')
      triggerRefresh()
    }
  }

  useEffect(() => {
    if (log) {
      setTitle(log.title)
      setDate(new Date(log.date))
      setTime(new Date(`${log.date}T${log.time}`))
      setSymptomsLogged(Object.entries(log.symptoms).map(([symptom, details]) => ({ id: uuidv4(), symptom, details })))
      setMedications(log.medications)
      setNotes(log.notes || '')
    } else {
      clearState()
    }
  }, [logParam])

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      < SafeAreaView
        className='mx-4'
      >
        {log?.title ?
          <>
            <Text className='text-2xl font-bold text-center'>Editing: {log.title}</Text>
            <Button title='Cancel Edit' color={'red'} onPress={() => router.push(`/create`)} />
          </>
          :
          <Text className='text-3xl font-extrabold'>Log Symptoms</Text>
        }
        <ScrollView className='h-full'>



          <View className='flex flex-row justify-between items-center my-2'>
            <Text className='text-xl font-bold'>
              Log Title:
            </Text>
            {log?.title ?
              <TextInput
                className='border rounded shadow p-2 ml-4 flex-1'
                placeholder={title}
                placeholderTextColor="#888"
                onChangeText={(text) => (setTitle(text || getDefaultTitle()))}
              />
              :
              <TextInput
                className='border rounded shadow p-2 ml-4 flex-1'
                placeholder={getDefaultTitle()}
                placeholderTextColor="#888"
                onChangeText={(text) => (setTitle(text || getDefaultTitle()))}
              />
            }
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
                  <View className='p-4 bg-gray-200 m-2 rounded-md flex flex-row items-center justify-center space-x-2'>
                    <Text>{item.symptom}</Text>
                    <Pressable onPress={() => handleInfoPress(item)}>
                      <Feather name='info' size={20} color={'grey'} />
                    </Pressable>
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

            {customSymptom.length > 0 && (
              <Button title="Add Symptom" color={'#FFA500'} onPress={addCustomSymptom} />
            )}


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
                            <Text className='font-semibold'>{subKey}</Text>: {typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)
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

          {symptomsLogged.length !== 0 && (

            <View className='mb-8'>
              {log ?
                <Button title='Save Changes' onPress={handleEdit} />
                :
                <Button title='Submit' onPress={handleSubmit} />
              }
            </View>

          )}

        </ScrollView>

        {selectedSymptom && (
          <Modal
            animationType="fade"
            visible={modalVisible}
            transparent
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View className='my-auto justify-center items-center'>
              <View className='w-11/12 bg-white rounded-2xl p-4 shadow-lg'>

                <View className='flex flex-row items-center justify-between w-full mb-1 '>
                  <Text className='text-lg font-bold'>{selectedSymptom}</Text>
                  <AntDesign name='close' size={20} color={'grey'} onPress={() => setModalVisible(!modalVisible)} />
                </View>

                {nameToImagePath[selectedSymptom] ? (
                  <Image
                    source={nameToImagePath[selectedSymptom] as any}
                    className='w-full'
                    style={{
                      height: 200,
                    }}
                    contentFit="contain"
                    transition={1000}
                  />
                ) : (
                  <Text>No image available</Text>
                )}

                <Text className='text-xl font-semibold my-1'>Details</Text>
                <Text className=''>{modalDetails[selectedSymptom as keyof typeof modalDetails].details}</Text>

                <Text className='text-xl font-semibold my-1'>Tips for Relief</Text>
                {modalDetails[selectedSymptom as keyof typeof modalDetails].tips.map(tip => (
                  <Text key={uuidv4()}>&#8226; {tip}</Text>
                ))}
                <Button
                  title="Close"
                  color={'#FFA500'}
                  onPress={() => setModalVisible(!modalVisible)}
                />

              </View>
            </View>
          </Modal>
        )}

      </SafeAreaView >
    </KeyboardAvoidingView>
  )
}

export default Create