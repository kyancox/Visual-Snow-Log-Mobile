import { View, Text, TouchableOpacity, TextInput, Button, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Slider from '@react-native-community/slider'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import CheckBox from 'expo-checkbox';
import { v4 as uuidv4 } from 'uuid';

import useDebounce from '@/hooks/useDebounce';
import Selectable from './Selectable';
import plus from '@/assets/icons/plus.svg'
import { Image } from 'expo-image';

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
    const [triggerList, setTriggerList] = useState(() => {
        const defaultTriggers = [
            { title: 'Stress', key: 'stress' },
            { title: 'Fatigue', key: 'fatigue' },
            { title: 'Lighting', key: 'lighting' },
            { title: 'Lack of Sleep', key: 'sleep' },
            { title: 'Weather', key: 'weather' },
            { title: 'Environment', key: 'environment' }
        ];

        if (details.Triggers) {
            details.Triggers.forEach((trigger: string) => {
                const key = trigger.toLowerCase();
                if (!defaultTriggers.some(item => item.key === key)) {
                    defaultTriggers.push({ title: trigger, key });
                }
            });
        }

        return defaultTriggers;
    });

    const [triggersState, setTriggersState] = useState<{ [key: string]: boolean }>(() => {
        const initialState: { [key: string]: boolean } = {};
        if (details.Triggers) {
            details.Triggers.forEach((trigger: string) => {
                initialState[trigger.toLowerCase()] = true;
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
    const [customTriggerPressed, setCustomTriggerPressed] = useState(false)

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
            setCustomTriggerPressed(false)
        }
    }

    // Frequency 
    const [frequency, setFrequency] = useState(details.Frequency || '');

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

    // const [customFrequencyState, setCustomFrequencyState] = useState<{ [key: string]: boolean }>(() => {
    //     const initialState: { [key: string]: boolean } = {};
    //     freqIds.forEach(({ label }) => {
    //         initialState[label] = details.Frequency === label;
    //     });
    //     return initialState;
    // });

    // const handleFrequencyChange = (label: string) => {
    //     setFrequency(label);
    //     setCustomFrequencyState(prevState => {
    //         const newState = { ...prevState };
    //         Object.keys(newState).forEach(key => {
    //             newState[key] = key === label;
    //         });
    //         return newState;
    //     });
    // };


    // Time of Day
    const [time, setTime] = useState(details['Time of Day']|| '')
    console.log('Time: ' + time)

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
        setTime('')
        setNotes('')
    }

    return (
        <View key={title} className=''>
            {/* Intensity */}
            <View className='flex flex-row justify-between items-center'>
                <Text className=' font-omedium'>Intensity</Text>
                <Text className='font-omedium'>{intensity >= 0 && ` ${intensity}0%`}</Text>
            </View>
            <Slider
                style={{
                }}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={intensity}
                onValueChange={setIntensity}
                minimumTrackTintColor="#FFA500"
            />
            {/* <Text>Intensity Level: {intensity}</Text> */}

            {/* Duration */}
            <View>
                <Text className='font-omedium'>Duration</Text>
                <View className='my-2 flex flex-row justify-around items-center'>
                    <View className='flex-row items-center justify-center space-x-2'>
                        <TextInput
                            className='border border-border font-o rounded shadow text-center p-2'
                            placeholder="0"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={hours}
                            onChangeText={(text) => {
                                if (/^\d{0,2}$/.test(text) || text === '') {
                                    setHours(text);
                                }
                            }}
                        />
                        <Text className={`${hours !== '' ? 'text-black' : 'text-placeholder'} font-o`}>hours</Text>
                    </View>
                    <View className='flex-row items-center justify-center space-x-2'>
                        <TextInput
                            className='border border-border rounded shadow text-center p-2'
                            placeholder="0"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={minutes}
                            onChangeText={(text) => {
                                if (/^\d{0,2}$/.test(text) || text === '') {
                                    setMinutes(text);
                                }
                            }}
                        />
                        <Text className={`${minutes !== '' ? 'text-black' : 'text-placeholder'} font-o`}>minutes</Text>
                    </View>
                </View>
            </View>

            {/* Triggers */}
            <Text className='font-omedium'>Triggers</Text>
            <View className='flex-row justify-between items-start my-2'>
                <View className='flex-1'
                >

                    <View className='flex-wrap flex-row'>
                        {triggerList.map((item) => (
                            <Selectable key={item.key} title={item.title} onPress={() => handleTriggerChange(item.key)} custom={true} customState={triggersState[item.key] || false} />
                            // <TouchableOpacity key={item.key} className='flex-row justify-start items-center' onPress={() => handleTriggerChange(item.key)}>
                            //     <>
                            //         <CheckBox
                            //             value={triggersState[item.key] || false}
                            //             onValueChange={() => handleTriggerChange(item.key)}
                            //         />
                            //         <Text className='m-1'>{item.title}</Text>
                            //     </>
                            // </TouchableOpacity>
                        ))}
                        <Selectable title='Custom' onPress={() => { setCustomTriggerPressed(!customTriggerPressed) }} custom={true} customState={customTriggerPressed} />
                    </View>

                    {customTriggerPressed && (
                        <View className='flex flex-row mx-1 space-x-2'>
                            <TextInput
                                multiline
                                className='border rounded-lg shadow p-2 flex-1 font-o border-border'
                                placeholder="Add custom trigger"
                                placeholderTextColor='#888'
                                value={customTrigger}
                                onChangeText={setCustomTrigger}
                            />
                            {/* <Button title="Add Trigger" color={'#FFA500'} onPress={addTrigger} /> */}
                            <TouchableOpacity className='bg-projectOrange flex items-center justify-center rounded-lg p-1' onPress={addTrigger}>
                                <Image source={plus} style={{ height: 24, width: 24 }} />
                            </TouchableOpacity>

                        </View>
                    )}


                </View>
            </View>

            {/* Frequency */}
            <Text className='font-omedium'>Frequency</Text>
            <View className='flex-row justify-between items-start my-2'>
                <View className='flex-wrap flex-row'>
                    {freqIds.map(({ label }) => (
                        <Selectable
                            key={label}
                            title={label}
                            // onPress={() => handleFrequencyChange(label)} 
                            onPress={() => setFrequency(label)}
                            custom={true}
                            // customState={customFrequencyState[label]}
                            customState={frequency === label}
                        />
                    ))}
                </View>
                {/* <RadioGroup
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
                /> */}
            </View>

            {/* Time of Day */}
            <Text className='font-omedium'>Time of Day</Text>
            <View className='flex-row justify-between items-start my-2'>
                <View className='flex-wrap flex-row'>
                    {timeIds.map(({ label }) => (
                        <Selectable
                            key={label}
                            title={label}
                            // onPress={() => handleFrequencyChange(label)} 
                            onPress={() => setTime(label)}
                            custom={true}
                            // customState={customFrequencyState[label]}
                            customState={time === label}
                        />
                    ))}
                </View>
                {/* <RadioGroup
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
                /> */}
            </View>
            {/* <Text>Selected Time: {time}</Text> */}

            {/* Additional Notes */}
            <Text className='font-omedium'>Additional Notes</Text>
            <TextInput
                multiline
                className='text-left border border-border rounded-lg shadow p-2 min-w-[20px] min-h-[75px] items-center font-o'
                placeholder={`Add additional notes about your ${title.toLowerCase()}...`}
                placeholderTextColor={'#888'}
                value={notes}
                onChangeText={setNotes}
            />
            <TouchableOpacity
            className='flex flex-row justify-end mt-3'
                onPress={clearState}>
                <Text className='text-projectOrange font-olight'>Clear Details</Text>
            </TouchableOpacity>

        </View>
    )
}

export default SymptomDetails