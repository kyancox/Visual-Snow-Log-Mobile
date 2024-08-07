import { supabase } from '@/lib/supabase';
import { useRefresh } from '@/providers/RefreshContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Button, Alert } from 'react-native';
import { router } from 'expo-router';

interface AccountSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ visible, onClose }) => {

    const { triggerRefresh } = useRefresh()

    const handleLogOut = () => {
        supabase.auth.signOut()
        triggerRefresh()
        onClose()
    }

    return (
        <Modal
            animationType="slide"
            presentationStyle='formSheet'
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='h-full bg-background'>

                <View className='flex-row justify-between items-center pt-2.5 pb-1 mx-3 px-1 mb-4 border-b-0.5 border-gray-500'>
                    <Text className='text-xl font-osemibold'>Account</Text>
                    <Button title="Done" onPress={onClose} color={'#FFA500'} />
                </View>


                <View className=' bg-white w-full border-t border-b border-0.5 border-gray-300 mb-4'>

                    <TouchableOpacity className='flex-row justify-between border-b-0.5 border-gray-300 py-2.5 mx-3 '>
                        <Text className='font-o text-base'>Email</Text>
                        <View className='flex flex-row items-center justify-center space-x-1'>
                            <Text className='text-sm font-o text-neutral-400'>kyan.cox@gmail.com</Text>
                            <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                     className='flex-row justify-between  border-gray-300 py-2.5 mx-3 '
                     onPress={() => router.push('/changepassword')}
                     >
                        <Text className='font-o text-base'>Password</Text>
                        <View className='flex flex-row items-center justify-center space-x-1'>
                            <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
                        </View>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity
                    className='py-2 bg-white w-full border-t border-b border-0.5 border-gray-300'
                    onPress={() => {
                        Alert.alert('Are you sure you want to log out?', '', [
                            {
                                text: 'Log Out',
                                onPress: handleLogOut,
                                style: 'default',
                            },
                            { text: 'Cancel', style: 'cancel' },
                        ]);
                    }}
                >
                    <Text className='text-red-500 font-o  text-base text-center' >Sign out</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default AccountSettingsModal;