import { View, Text, TouchableOpacity, TextInput, Button, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Slider from '@react-native-community/slider'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import CheckBox from 'expo-checkbox';
import { v4 as uuidv4 } from 'uuid';

interface SymptomDetailsProps {
    title: string,
    details: any,
    onDetailsChange: (details: any) => void,
    hideDetails: () => void,
}

const SymptomDetails = ({ title, details, onDetailsChange, hideDetails }: SymptomDetailsProps) => {
    // console.log(`Details: ${details?.Intensity || 'DNE'}`)
    // console.log(`Response: ${details}`)


    // Intensity 
    const [intensity, setIntensity] = useState<number>(details.Intensity || -1);

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

    useEffect(() => {
        const triggers = Object.keys(triggersState).filter(key => triggersState[key]);

        const object: { [key: string]: any } = {};
        if (intensity > -1) object.Intensity = intensity;
        if (triggers.length > 0) object.Triggers = triggers;
        if (frequency) object.Frequency = frequency;
        if (time) object.Time = time;
        if (notes) object.Notes = notes;

        onDetailsChange(object);
    }, [intensity, triggersState, frequency, time, notes]);

    return (
        <View key={title} className='bg-gray-200 m-2'>
            <View className='flex flex-row justify-between items-center'>
                <Text className='text-xl font-bold flex-1'>{title} Details: </Text>
                <Button title='Hide' color={'#FFA500'} onPress={hideDetails} />
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
                                <CheckBox
                                    value={triggersState[item.key] || false}
                                />
                                <Text className='m-1'>{item.title}</Text>
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

        </View>
    )
}

export default SymptomDetails