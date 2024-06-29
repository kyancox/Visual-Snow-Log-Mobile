import {
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    UIManager,
    Platform,
    LayoutAnimation,
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

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
            update: { type: 'linear', springDamping: 0.3, duration: 250 },
        });
        setOpened(!opened);
    }

    return (
        <View className="flex-1 m-2.5 p-3.5 bg-white rounded-lg">
            <TouchableWithoutFeedback onPress={toggleAccordion}>
                <View className="flex-row justify-between items-center">
                    <Text className="capitalize">{title}</Text>
                    <View className='flex flex-row justify-center items-center space-x-3'>
                        <MaterialIcons name='delete' size={24} color='#FFA500'  onPress={onDelete} />
                        <AntDesign name={opened ? 'caretup' : 'caretdown'} size={16} />
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {opened && (
                <View className="mt-2">
                    {children}
                </View>
            )}
        </View>
    );
}

export default Accordion