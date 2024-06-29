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
import { AntDesign } from '@expo/vector-icons';

const Accordion = ({
    title,
    children,
}: {
    title: string;
    children?: React.ReactNode;
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
        <View className='flex-1' style={styles.container}>
            <TouchableWithoutFeedback onPress={toggleAccordion}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <AntDesign name={opened ? 'caretup' : 'caretdown'} size={16} />
                </View>
            </TouchableWithoutFeedback>

            {opened && (
                <View style={[styles.content]}>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    details: {
        opacity: 0.65,
    },
    title: {
        textTransform: 'capitalize',
    },
    content: {
        marginTop: 8,
    },
    container: {
        margin: 10,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Accordion