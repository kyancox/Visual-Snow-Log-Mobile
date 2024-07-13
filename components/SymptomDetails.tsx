import { View, Text, TouchableOpacity, TextInput, Button, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Slider from '@react-native-community/slider'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import CheckBox from 'expo-checkbox';
import { v4 as uuidv4 } from 'uuid';

import useDebounce from '@/hooks/useDebounce';

interface SymptomDetailsProps {
    title: string,
    details: any,
    onDetailsChange: (details: any) => void,
}

const SymptomDetails = ({ title, details, onDetailsChange }: SymptomDetailsProps) => {
    // console.log(`Details: ${details?.Intensity || 'DNE'}`)
    // console.log(`Response: ${details}`)


    // Intensity 
    const [intensity, setIntensity] = useState<number>(details.Intensity || -1);

    // Duration
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')

    const [duration, setDuration] = useState<{ hours: string, minutes: string, seconds: string }>({ hours: '', minutes: '', seconds: '' })

    // Triggers
    const [triggerList, setTriggerList] = useState([
        { title: 'Stress', key: 'stress' },
        { title: 'Fatigue', key: 'fatigue' },
        { title: 'Lighting', key: 'lighting' },
        { title: 'Lack of Sleep', key: 'sleep' },
        { title: 'Weather', key: 'weather' },
        { title: 'Environment', key: 'environment' }
    ]);

    const [triggersState, setTriggersState] = useState<{ [key: string]: boolean }>(() => {
        const initialState: { [key: string]: boolean } = {};
        if (details.Triggers) {
            details.Triggers.forEach((trigger: string) => {
                initialState[trigger] = true;
            });
        }
        return initialState;
    });

    const handleTriggerChange = (trigger: string) => {
        setTriggersState(prevState => ({
            ...prevState,
            [trigger]: !prevState[trigger]
        }));
    };

    const [customTrigger, setCustomTrigger] = useState('')

    const addTrigger = () => {
        const key = customTrigger.toLowerCase();
        // Check if the trigger with the given key does not already exist in the triggerList
        if (key && !triggerList.some(item => item.key === key)) {
            const newTrigger = {
                title: customTrigger,
                key: key
            };
            setTriggerList([...triggerList, newTrigger]);
            setTriggersState(prevState => ({
                ...prevState,
                [key]: true
            }));
            setCustomTrigger('');
        }
    }

    // Frequency 
    const [frequency, setFrequency] = useState(details.Frequency || '');
    const [selectedFreqId, setSelectedFreqId] = useState<string | undefined>(() => {
        const freqIds = [{
            id: '1',
            label: 'Occasionally',
        },
        {
            id: '2',
            label: 'Frequently',
        },
        {
            id: '3',
            label: 'Constantly',
        }]
        const foundButton = freqIds.find(s => s.label === details.Frequency)
        return foundButton ? foundButton.id : undefined
    });
    const freqRadioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'Occasionally',
            value: 'Occasionally',
            borderColor: selectedFreqId === '1' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '2',
            label: 'Frequently',
            value: 'Frequently',
            borderColor: selectedFreqId === '2' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '3',
            label: 'Constantly',
            value: 'Constantly',
            borderColor: selectedFreqId === '3' ? '#FFA500' : '#000',
            color: '#FFA500'
        }
    ]), [selectedFreqId]);

    // Time of Day
    const [time, setTime] = useState(details.Time || '')
    const [selectedTimeId, setSelectedTimeId] = useState<string | undefined>(() => {
        const timeIds = [
            {
                id: '1',
                label: 'Morning',
            },
            {
                id: '2',
                label: 'Afternoon',
            },
            {
                id: '3',
                label: 'Evening',
            },
            {
                id: '4',
                label: 'Night',
            }
        ]
        const foundButton = timeIds.find(s => s.label === details.Time)
        return foundButton ? foundButton.id : undefined

    })
    const timeRadioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'Morning',
            value: 'Morning',
            borderColor: selectedTimeId === '1' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '2',
            label: 'Afternoon',
            value: 'Afternoon',
            borderColor: selectedTimeId === '2' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '3',
            label: 'Evening',
            value: 'Evening',
            borderColor: selectedTimeId === '3' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '4',
            label: 'Night',
            value: 'Night',
            borderColor: selectedTimeId === '4' ? '#FFA500' : '#000',
            color: '#FFA500'
        }
    ]), [selectedTimeId])

    // Additional Notes
    const [notes, setNotes] = useState(details.Notes || '')

    // Update details
    const debouncedIntensity = useDebounce(intensity, 300);
    const debouncedHours = useDebounce(hours, 300);
    const debouncedMinutes = useDebounce(minutes, 300)
    const debouncedTriggersState = useDebounce(triggersState, 300);
    const debouncedFrequency = useDebounce(frequency, 300);
    const debouncedTime = useDebounce(time, 300);
    const debouncedNotes = useDebounce(notes, 300);

    useEffect(() => {
        const triggers = Object.keys(debouncedTriggersState).filter(key => debouncedTriggersState[key]);

        const object: { [key: string]: any } = {};
        if (debouncedIntensity > -1) object.Intensity = debouncedIntensity;
        if (debouncedHours || debouncedMinutes) {
            const duration: { [key: string]: any } = {};
            if (debouncedHours) duration.hours = debouncedHours;
            if (debouncedMinutes) duration.minutes = debouncedMinutes;
            object.Duration = duration
        }
        if (triggers.length > 0) object.Triggers = triggers;
        if (debouncedFrequency) object.Frequency = debouncedFrequency;
        if (debouncedTime) object['Time of Day'] = debouncedTime;
        if (debouncedNotes) object.Notes = debouncedNotes;

        onDetailsChange(object);
    }, [debouncedIntensity, debouncedTriggersState, debouncedFrequency, debouncedTime, debouncedNotes, debouncedHours, debouncedMinutes]);

    const clearState = () => {
        setIntensity(-1)
        setTriggersState({})
        setFrequency('')
        setSelectedFreqId('')
        setTime('')
        setSelectedTimeId('')
        setNotes('')
    }

    return (
        <View key={title} className=''>
            <View className='flex flex-row justify-between items-center'>
                <Text className='text-xl font-bold flex-1'>{title} Details: </Text>
            </View >
            {/* Intensity */}
            <View className='flex flex-row justify-between items-center'>
                <Text className='text-xl font-semibold'>Intensity{intensity >= 0 && ` (${intensity})`}:</Text>
                <Slider
                    style={{
                        width: '60%'
                    }}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={intensity}
                    onValueChange={setIntensity}
                    minimumTrackTintColor="#FFA500"
                // maximumTrackTintColor="#d3d3d3"
                // thumbTintColor="#1EB1FC"
                />
            </View>
            {/* <Text>Intensity Level: {intensity}</Text> */}

            {/* Duration */}
            <View>
                <Text className='text-xl font-semibold'>Duration:</Text>
                <View className='my-2 flex flex-row justify-around items-center'>
                    <TextInput
                        className='border rounded shadow text-center p-2'
                        placeholder="0"
                        keyboardType="numeric"
                        value={hours}
                        onChangeText={(text) => {
                            if (/^\d{0,2}$/.test(text) || text === '') {
                                setHours(text);
                            }
                        }}
                    />
                    <Text>hours</Text>
                    <TextInput
                        className='border rounded shadow text-center p-2'
                        placeholder="0"
                        keyboardType="numeric"
                        value={minutes}
                        onChangeText={(text) => {
                            if (/^\d{0,2}$/.test(text) || text === '') {
                                setMinutes(text);
                            }
                        }}
                    />
                    <Text>minutes</Text>
                </View>
            </View>

            {/* Triggers */}
            <View className='flex-row justify-between items-start'>
                <Text className='text-xl font-semibold'>Triggers:</Text>
                <View className='flex-1'
                    style={{

                    }}
                >
                    <View className='mx-auto'>
                        {triggerList.map((item) => (
                            <TouchableOpacity key={item.key} className='flex-row justify-start items-center' onPress={() => handleTriggerChange(item.key)}>
                                <>
                                    <CheckBox
                                        value={triggersState[item.key] || false}
                                        onValueChange={() => handleTriggerChange(item.key)}
                                    />
                                    <Text className='m-1'>{item.title}</Text>
                                </>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        multiline
                        className='border rounded shadow p-2 mx-4 flex-1'
                        placeholder="Add custom trigger"
                        value={customTrigger}
                        onChangeText={setCustomTrigger}
                    />
                    <Button title="Add Trigger" color={'#FFA500'} onPress={addTrigger} />

                </View>
            </View>

            {/* Frequency */}
            <View className='flex flex-row justify-start items-start '>
                <Text className='text-xl font-semibold'>Frequency:</Text>
                <RadioGroup
                    radioButtons={freqRadioButtons}
                    onPress={(id: string) => {
                        setSelectedFreqId(id);
                        const selection: string | undefined = freqRadioButtons.find(rb => rb.id === id)?.value;
                        if (selection !== undefined) {
                            setFrequency(selection);
                        }
                    }}
                    selectedId={selectedFreqId}
                    containerStyle={{
                        alignItems: 'flex-start'
                    }}
                />
            </View>
            {/* <Text>Selected Frequency: {frequency}</Text> */}

            {/* Time of Day */}
            <View className='flex flex-row justify-between items-start '>
                <Text className='text-xl font-semibold'>Time of Day:</Text>
                <RadioGroup
                    radioButtons={timeRadioButtons}
                    onPress={(id: string) => {
                        setSelectedTimeId(id);
                        const selection: string | undefined = timeRadioButtons.find(rb => rb.id === id)?.value;
                        if (selection !== undefined) {
                            setTime(selection);
                        }
                    }}
                    selectedId={selectedTimeId}
                    containerStyle={{
                        alignItems: 'flex-start'
                    }}
                />
            </View>
            {/* <Text>Selected Time: {time}</Text> */}

            {/* Additional Notes */}
            <Text className='text-xl font-semibold'>Additional Notes:</Text>
            <TextInput
                multiline
                className='text-center border rounded shadow p-2 mx-4 min-w-[20px] items-center'
                placeholder={`Add additional notes about your ${title.toLowerCase()}`}
                value={notes}
                onChangeText={setNotes}
            />

            <Button title='Clear Details' color={'#FFA500'} onPress={clearState} />

        </View>
    )
}

export default SymptomDetails