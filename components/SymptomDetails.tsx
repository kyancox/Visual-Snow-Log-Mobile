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

    const [triggerList, setTriggerList] = useState([
        { title: 'Stress', key: 'stress' },
        { title: 'Fatigue', key: 'fatigue' },
        { title: 'Lighting', key: 'lighting' },
        { title: 'Lack of Sleep', key: 'sleep' },
        { title: 'Weather', key: 'weather' },
        { title: 'Environment', key: 'environment' }
    ]);
    
    const [triggersState, setTriggersState] = useState<{ [key: string]: boolean }>({})

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
        if (!triggerList.some(item => item.key === key)) {
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
                    {triggerList.map((item) => (
                        <TouchableOpacity key={item.key} className='flex-row justify-start items-center' onPress={() => handleTriggerChange(item.key)}>
                            <CheckBox
                                value={triggersState[item.key] || false}
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
                    <Button title="Add Trigger" color={'#FFA500'} onPress={addTrigger} />

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