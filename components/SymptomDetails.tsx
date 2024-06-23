import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native'
import React, { useMemo, useState } from 'react'
import Slider from '@react-native-community/slider'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import CheckBox from 'expo-checkbox';
import { v4 as uuidv4 } from 'uuid';

const SymptomDetails = () => {
    const [intensity, setIntensity] = useState<number>(-1);
    const [frequency, setFrequency] = useState('');

    const [selectedId, setSelectedId] = useState<string | undefined>();
    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'Occasionally',
            value: 'Occasionally',
            borderColor: selectedId === '1' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '2',
            label: 'Frequently',
            value: 'Frequently',
            borderColor: selectedId === '2' ? '#FFA500' : '#000',
            color: '#FFA500'
        },
        {
            id: '3',
            label: 'Constantly',
            value: 'Constantly',
            borderColor: selectedId === '3' ? '#FFA500' : '#000',
            color: '#FFA500'
        }
    ]), [selectedId]);

    const [triggersState, setTriggersState] = useState<{ [key: string]: boolean }>({})
    const triggers = useMemo(() => [
        {
            title: 'Stress',
            state: triggersState.stress,
            onPress: () => handleTriggerChange('stress'),
            key: uuidv4()
        },
        {
            title: 'Fatigue',
            state: triggersState.fatigue,
            onPress: () => handleTriggerChange('fatigue'),
            key: uuidv4()
        },
        {
            title: 'Lighting',
            state: triggersState.lighting,
            onPress: () => handleTriggerChange('lighting'),
            key: uuidv4()
        },
        {
            title: 'Lack of Sleep',
            state: triggersState.sleep,
            onPress: () => handleTriggerChange('sleep'),
            key: uuidv4()
        },
        {
            title: 'Weather',
            state: triggersState.weather,
            onPress: () => handleTriggerChange('weather'),
            key: uuidv4()
        },
        {
            title: 'Environment',
            state: triggersState.environment,
            onPress: () => handleTriggerChange('environment'),
            key: uuidv4()
        },
    ], [triggersState]);

    const handleTriggerChange = (trigger: string) => {
        setTriggersState(prevState => ({
            ...prevState,
            [trigger]: !prevState[trigger]
        }));
    };


    // const triggers = useMemo(() => [
    //     { title: 'Stress', onPress: () => handleTriggerChange('stress') },
    //     { title: 'Fatigue', onPress: () => handleTriggerChange('fatigue') },
    //     { title: 'Lighting', onPress: () => handleTriggerChange('lighting') },
    //     { title: 'Lack of Sleep', onPress: () => handleTriggerChange('sleep') },
    //     { title: 'Weather', onPress: () => handleTriggerChange('weather') },
    //     { title: 'Environment', onPress: () => handleTriggerChange('environment') },
    // ].map(item => ({
    //     ...item,
    //     key: uuidv4(),
    //     state: triggersState[item.title.toLowerCase()] || false 
    // })), [triggersState]);


    const [customTrigger, setCustomTrigger] = useState('')

    // const handleTriggerChange = (trigger: string) => {
    //     const key = trigger.toLowerCase()
    //     setTriggersState(prevState => {
    //         if (key in prevState) {
    //             return {
    //                 ...prevState,
    //                 [key]: !prevState[key]
    //             }
    //         } else {
    //             return {
    //                 ...prevState,
    //                 [key]: true
    //             }
    //         }
 
    //     })
    // }

    // const handleTriggerChange = (trigger: string) => {
    //     const key = trigger.toLowerCase();
    //     setTriggersState(prevState => ({
    //         ...prevState,
    //         [key]: !(key in prevState) || !prevState[key]  // Toggle if exists, set true if new
    //     }));
    //     setCustomTrigger('');  // Clear the input after adding
    // }
    
    // // When adding a new trigger from TextInput
    // const addTrigger = () => {
    //     if (customTrigger && !(customTrigger.toLowerCase() in triggersState)) {
    //         handleTriggerChange(customTrigger);
    //     }
    // }

    return (
        <View>
            <Text className='text-xl font-bold'>Symptom Details:</Text>

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
            <Text>Intensity Level: {intensity}</Text>

            <View>
                <Text className='text-xl font-semibold'>Duration:</Text>
            </View>

            <View className='flex-row justify-between items-center'>
                <Text className='text-xl font-semibold'>Triggers:</Text>
                <View className=''>
                    {/* checkbox element */}
                    {triggers.map((item) => (
                        <TouchableOpacity key={item.key} className='flex-row justify-start items-center' onPress={item.onPress}>
                            <CheckBox
                                value={item.state}
                            />
                            <Text className='m-1'>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text> </Text>
                    {/* add additional trigger element  */}
                    <TextInput
                        className='border rounded shadow p-2 mx-4 flex-1'
                        placeholder="Add custom trigger"
                        value={customTrigger}
                        onChangeText={setCustomTrigger}
                    />
                    {/* <Button title="Add Symptom" color={'#FFA500'} onPress={handleTriggerChange} /> */}

                </View>
            </View>

            <View className='flex flex-row justify-between items-start '>
                <Text className='text-xl font-semibold'>Frequency:</Text>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={(id: string) => {
                        setSelectedId(id);
                        const selection: string | undefined = radioButtons.find(rb => rb.id === id)?.value;
                        if (selection !== undefined) {
                            setFrequency(selection);
                        }
                    }}
                    selectedId={selectedId}
                    containerStyle={{
                        alignItems: 'flex-start'
                    }}
                />
            </View>
            <Text>Selected Frequency: {frequency}</Text>


        </View>
    )
}

export default SymptomDetails