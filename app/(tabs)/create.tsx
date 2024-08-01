import { View, Text, TextInput, Button, Platform, FlatList, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Pressable, Modal, SafeAreaView, Appearance } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
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
import SymptomSelectable from '@/components/SymptomSelectable';
import plus from '@/assets/icons/plus.svg'
import orangeplus from '@/assets/icons/orangeplus.svg'
import xtrans from '@/assets/icons/xtrans.svg'
import arrow from '@/assets/icons/arrow.svg'

const Create = () => {

  const { session, user } = useAuth()
  const { refresh, triggerRefresh } = useRefresh()
  const colorScheme = Appearance.getColorScheme();

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
      setCustomSymptomPressed(false)
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

  const [medication, setMedication] = useState('')
  // const [medications, setMedications] = useState<Medication[]>([{id: '1', name: 'med1'}, {id: '2', name: 'med2'},{id: '3', name: 'med1'}, {id: '4', name: 'med2'}, {id: 'sadasdas', name: 'med1'}, {id: 'asggdfd', name: 'med2'},{id: 'qwer', name: 'med1'}, {id: 'zxzxvzvx', name: 'med2'}, ]);
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

  const clearMedication = () => {
    setMedication('')
    setMedicationPressed(false)
  }

  const addMedication = () => {
    if (medications.length === 0 || (medications.length > 0 && medications[medications.length - 1].name)) {
      setMedications([...medications, { id: Date.now().toString(), name: medication }]);
      clearMedication()
    }
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
      router.push('/create')
      router.push('/logs')
      Alert.alert(
        'Changes saved!',
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

  // TextInput Focused States
  const [titleFocused, setTitleFocused] = useState(false)
  const [customSymptomFocused, setCustomSymptomFocused] = useState(false)
  const [medicationsFocused, setMedicationsFocused] = useState(false)
  const [notesFocused, setNotesFocused] = useState(false)

  const [datePickerVisible, setDatePickerVisibility] = useState(false);
  const [timePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const [customSymptomPressed, setCustomSymptomPressed] = useState(false)

  const [medicationPressed, setMedicationPressed] = useState(false)

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#eff3f9'
      }}
    >
      <SafeAreaView className='mx-4 flex-1' >

        {log?.title ?
          <>
            <Text className='text-xl font-obold text-center'><Text className=''>Editing:</Text> {log.title}</Text>
            <TouchableOpacity className='mx-auto bg-red-500 py-1 px-3 rounded-full my-1' onPress={() => router.push('/create')}>
              <Text className='font-o text-base text-white'>Cancel Edit</Text>
            </TouchableOpacity>
          </>
          :
          <Text className='text-center text-xl font-obold mb-2'>Log Symptoms</Text>
        }
        <ScrollView className='h-full'>

          {/* Log Title */}
          <View className='my-1 space-y-1'>
            <Text className='text-lg font-osemibold'>
              Log Title
            </Text>
            {log?.title ?
              <TextInput
                className={`border rounded-lg p-3 font-o border-border bg-white`}
                placeholder={title}
                placeholderTextColor="#888"
                onChangeText={(text) => (setTitle(text || getDefaultTitle()))}
              />
              :
              <TextInput
                className={`border rounded-lg p-3 font-o border-border bg-white`}
                placeholder={getDefaultTitle()}
                placeholderTextColor="#888"
                onChangeText={(text) => (setTitle(text || getDefaultTitle()))}
              />
            }
          </View>

          {/* Date & Time */}
          <View className='flex flex-row justify- items-center my-1 space-x-4'>
            <View className='flex flex-col items-start justify-center space-y-1 flex-1' >
              <Text className='text-lg font-osemibold'>Date</Text>
              <TouchableOpacity className='border border-border bg-white p-3 rounded-lg w-full  ' onPress={showDatePicker} >
                <Text className='font-o text-placeholder'>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>

              {datePickerVisible && (
                <Modal
                  animationType="slide"
                  visible={datePickerVisible}
                  transparent
                  onRequestClose={() => {
                    hideDatePicker();
                  }}
                >
                  <View className={`border border-border rounded-lg shadow-lg my-auto w-11/12 mx-auto p-2 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                    <DateTimePicker
                      accentColor='#FFA500'
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      display="inline"
                      onChange={dateChange}
                    />
                    <Button title='Close' color='#FFA500' onPress={hideDatePicker} />
                  </View>
                </Modal>
              )}
            </View>
            {/* <Text className='mt-1'>Selected Date: {date.toLocaleDateString()}</Text> */}

            <View className='flex flex-col items-start justify-center space-y-1 flex-1' >
              <Text className='font-osemibold text-lg'>Time</Text>
              <TouchableOpacity className='border border-border bg-white p-3 rounded-lg  w-full' onPress={showTimePicker}>
                <Text className='font-o text-placeholder'>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>

              {timePickerVisible && (
                <Modal
                  animationType="slide"
                  visible={timePickerVisible}
                  transparent
                  onRequestClose={() => {
                    hideTimePicker();
                  }}
                >
                  <View className={`border border-border rounded-lg shadow-lg my-auto w-11/12 mx-auto p-2 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                    <DateTimePicker
                      className=''
                      testID="timePicker"
                      value={time}
                      mode="time"
                      display="spinner"
                      onChange={timeChange}
                    />
                    <Button title='Close' color='#FFA500' onPress={hideTimePicker} />
                  </View>
                </Modal>
              )}
            </View>
            {/* <Text className='mt-1'>Selected Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> */}
          </View>

          {/* Symptoms */}
          <View className='mt-1 mb-2'>
            <Text className='font-osemibold text-lg '>Symptoms <Text className='text-red-500'>*</Text></Text>
            {/* <FlatList
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
            /> */}

            <View className='flex-row flex-wrap justify-center mt-2'>
              {defaultSymptoms.map((item) => (
                <SymptomSelectable key={item.id} title={item.symptom} onPress={() => handleSymptomPress(item)} onInfoPress={() => handleInfoPress(item)} />
              ))}
              {!customSymptomPressed && (
                <TouchableOpacity className='flex flex-row items-center mx-auto border border-projectOrange py-2 px-3 border-dashed rounded-full self-start bg-projectOrange/10 space-x-1' onPress={() => setCustomSymptomPressed(true)}>
                  <Image source={orangeplus} className='bg-' style={{ width: 20, height: 20 }} />
                  <Text className='text-projectOrange font-o'>Add Custom Symptom</Text>
                </TouchableOpacity>)}
            </View>

            {customSymptomPressed && (
              <View className='flex flex-row mx-1 space-x-2'>
                <TextInput
                  multiline
                  className='border rounded-lg  p-2 flex-1 font-o bg-white border-border'
                  placeholder="Add custom symptom"
                  placeholderTextColor='#888'
                  value={customSymptom}
                  onChangeText={setCustomSymptom}
                />
                <TouchableOpacity className='bg-projectOrange flex items-center justify-center rounded-lg p-1' onPress={addCustomSymptom}>
                  <Image source={plus} style={{ height: 24, width: 24 }} />
                </TouchableOpacity>

              </View>
            )}

            {/* < TextInput
              className='border rounded shadow p-2 mx-4 flex-1'
              placeholder="Add custom symptom"
              value={customSymptom}
              onChangeText={setCustomSymptom}
            />

            {customSymptom.length > 0 && (
              <Button title="Add Symptom" color={'#FFA500'} onPress={addCustomSymptom} />
            )} */}

          </View>

          {symptomsLogged.length > 0 && (
            <View className='bg-white border p-2 rounded-lg my-2'
              style={{
                borderColor: '#EBECEC'
              }}
            >
              <Text className='text-lg font-osemibold px-2'>Logged Symptoms</Text>
              <View>
                {symptomsLogged.slice().reverse().map((item) => (
                  <View key={item.id} className='flex-row justify-center items-start'>
                    <Accordion title={item.symptom} onDelete={() => handleRemoveSymptom(item.id)}>
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
            </View>
          )}


          {/* Medications / Treatments */}
          <Text className='font-osemibold text-lg'>Medication/Treatments:</Text>
          {medications.length > 0 && (
            medications.map((item, index) => (
              <View key={item.id} className='flex flex-row items-center justify-center m-1'>
                <Text className='font-o text-base flex-1'><Text className='font-osemibold'>{index + 1}.</Text> {item.name}</Text>
                <TouchableOpacity className='flex items-center justify-center rounded-lg p-1' style={{ backgroundColor: '#F6E1E1' }} onPress={() => deleteMedication(item.id)}>
                  <Image source={xtrans} style={{ height: 24, width: 24 }} />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View className='mt-1 mb-3'>
            {!medicationPressed && (
              <TouchableOpacity className='flex flex-row items-center justify-center mx-auto border border-projectOrange p-4 border-dashed rounded-lg bg-projectOrange/10 space-x-1 w-full' onPress={() => setMedicationPressed(true)}>
                <Image source={orangeplus} className='bg-' style={{ width: 20, height: 20 }} />
                <Text className='font-o text-projectOrange'>Add Medication/Treatments</Text>
              </TouchableOpacity>
            )}

            {medicationPressed && (
              <View className='flex flex-row mx-1 space-x-2'>
                <TextInput
                  multiline
                  className='border rounded-lg  p-2 flex-1 font-o bg-white border-border'
                  placeholder="Add medication/treatment"
                  placeholderTextColor='#888'
                  value={medication}
                  onChangeText={setMedication}
                />
                <View className='space-x-1 flex flex-row items-center justify-center'>
                  <TouchableOpacity className='bg-projectOrange flex items-center justify-center rounded-lg p-1' onPress={addMedication}>
                    <Image source={plus} style={{ height: 24, width: 24 }} />
                  </TouchableOpacity>
                  <TouchableOpacity className='flex items-center justify-center rounded-lg p-1' style={{ backgroundColor: '#F6E1E1' }} onPress={clearMedication}>
                    <Image source={xtrans} style={{ height: 24, width: 24 }} />
                  </TouchableOpacity>

                </View>
              </View>
            )}


            {/* {medications.map((item => (
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


              <Button title="Delete" onPress={() => deleteMedication(item.id)} /> 
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
            */}

          </View>

          <Text className='font-osemibold text-lg'>Additional Notes:</Text>
          <TextInput
            multiline
            className={`text-left font-o border bg-white border-border rounded-lg p-3 min-h-[110px] my-1 items-center ${symptomsLogged.length === 0 ? 'mb-5' : ''}`}
            placeholder={`Add additional notes about ${title}`}
            placeholderTextColor='#888'
            value={notes}
            onChangeText={setNotes}
          />


          {symptomsLogged.length > 0 && (

            <>
              {log ?
                <TouchableOpacity className='flex flex-row items-center justify-center mx-auto p-4 rounded-lg bg-projectOrange space-x-1 w-full mt-5 mb-10' onPress={handleEdit}>
                  <Text className='font-osemibold text-white'>Submit Edit</Text>
                  <Image source={arrow} className='bg-' style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
                :
                <TouchableOpacity className='flex flex-row items-center justify-center mx-auto p-4 rounded-lg bg-projectOrange space-x-1 w-full mt-5 mb-10' onPress={() => router.push({ pathname: '/logpreview', params: { logData: JSON.stringify(getBodyData()) } })}>
                  <Text className='font-osemibold text-white'>Preview Log</Text>
                  <Image source={arrow} className='bg-' style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              }
            </>

          )}


          {/* Review Section */}
          {/* {symptomsLogged.length > 0 && (
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
          )} */}

          {/* {symptomsLogged.length !== 0 && (

            <View className='mb-8'>
              {log ?
                <Button title='Save Changes' onPress={handleEdit} />
                :
                <Button title='Submit' onPress={handleSubmit} />
              }
            </View>

          )} */}

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
                  <Text className='text-lg font-obold'>{selectedSymptom}</Text>
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

                <Text className='text-xl font-osemibold my-1'>Details</Text>
                <Text className='font-o'>{modalDetails[selectedSymptom as keyof typeof modalDetails].details}</Text>

                <Text className='text-xl font-osemibold my-1'>Tips for Relief</Text>
                {modalDetails[selectedSymptom as keyof typeof modalDetails].tips.map(tip => (
                  <Text key={uuidv4()} className='font-o'>&#8226; {tip}</Text>
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