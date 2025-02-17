import { View, Text, } from 'react-native'
import { Image } from 'expo-image'
import { Asset } from 'expo-asset'
import React from 'react'

const Logo = () => {
    const logo = Asset.fromModule(require('../assets/images/icon.png')).uri

    return (
        <View className='flex flex-row items-center justify-start'>
            <Image
                source={{uri: logo}}
                className='rounded-full'
                style={{
                    width: 32,
                    height: 32
                }}
                
            />
            <Text className='ml-2 text-2xl font-obold text-proj'>Visual Snow Log</Text>
        </View>
    )
}

export default Logo