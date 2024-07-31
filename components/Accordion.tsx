import {
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    UIManager,
    Platform,
    LayoutAnimation,
    TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import x from '../assets/icons/x.svg'


const Accordion = ({
    title,
    children,
    onDelete,
}: {
    title: string;
    children?: React.ReactNode;
    onDelete?: () => void
}) => {
    const [opened, setOpened] = useState(true);

    if (
        Platform.OS === 'android' &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    function toggleAccordion() {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: 'easeIn', property: 'opacity' },
            update: { type: 'linear', springDamping: 0.3, duration: 150 },
        });
        setOpened(!opened);
    }

    return (
        <View className="flex-1 m-2 p-3.5 border bg-white rounded-lg"
            style={{
                borderColor: '#EBECEC'
            }}>
            <TouchableWithoutFeedback onPress={toggleAccordion}>
                <View className="flex-row justify-between items-center">
                    <View className='flex flex-row justify-center items-center space-x-1'>
                        <MaterialIcons name={opened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color={'grey'} />
                        <Text className="capitalize font-omedium text-base">{title}</Text>
                    </View>
                    <TouchableOpacity onPress={onDelete}>
                        <Image source={x} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

            
            {opened && (
                <View className="">
                    {/* Divider Line */}
                    <View style={{ height: 1, backgroundColor: '#EBECEC', }} className='my-3' />
                    {children}
                </View>
            )}
        </View>
    );
}

export default Accordion