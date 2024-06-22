import { View, Text } from 'react-native'
import React, { useMemo, useState } from 'react'
import Slider from '@react-native-community/slider'

import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

const SymptomDetails = () => {
    const [intensity, setIntensity] = useState<number>();
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


    return (
        <View>
            <Text className='text-xl font-bold'>Symptom Details:</Text>

            <View className='flex flex-row justify-between items-center'>
                <Text className='text-xl font-semibold'>Intensity{intensity != 0 && ` (${intensity})`}:</Text>
                <Slider
                    style={{
                        width: '70%'
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

            <View>
                <Text className='text-xl font-semibold'>Triggers Checkbox:</Text>
                <View>
                    {/* checkbox element */}
                    {/* add additional trigger element  */}
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