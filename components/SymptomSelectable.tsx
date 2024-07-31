import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import info from '@/assets/icons/info.svg'

interface SymptomSelectableProps {
    title: string,
    onPress: () => any,
    onInfoPress: () => any,
}

const SymptomSelectable = ({ title, onPress, onInfoPress }: SymptomSelectableProps) => {


    return (
        <TouchableOpacity
            className={`m-1 py-1 px-3 border border-border bg-white rounded-full flex flex-row items-center justify-center space-x-1 `}
            onPress={onPress}
            style={{ alignSelf: 'flex-start' }}
        >
            <Text className={`font-olight text-sm `} >{title}</Text>
            <TouchableOpacity className='' onPress={onInfoPress}>
                <Image source={info} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default SymptomSelectable