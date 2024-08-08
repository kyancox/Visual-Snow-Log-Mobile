import { supabase } from '@/lib/supabase';
import { useRefresh } from '@/providers/RefreshContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

interface AccountSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ visible, onClose }) => {

    const { session, user } = useAuth()
    const { triggerRefresh } = useRefresh()

    const handleLogOut = () => {
        supabase.auth.signOut()
        triggerRefresh()
        router.back()
    }

    return (
        // <Modal
        //     animationType="slide"
        //     presentationStyle='formSheet'
        //     transparent={false}
        //     visible={visible}
        //     onRequestClose={onClose}
        // >
        <View className='h-full bg-background'>

            <View className=' bg-white w-full border-t border-b border-0.5 border-gray-300 my-5'>


                {/* 
                Supabase always sends an email confirmation to the NEW email when changing a users email.
                If you change a users email, and then change it again, the users email becomes the first new email.
                Becuase of this, comment out the change email feature to come back to later. 

                */}

                {/* <TouchableOpacity
                    className='flex-row justify-between border-b-0.5 border-gray-300 py-2.5 mx-3 '
                    onPress={() => router.push('/email')}
                >
                    <Text className='font-o text-base'>Email</Text>
                    <View className='flex flex-row items-center justify-center space-x-1'>
                        <Text className='text-sm font-o text-neutral-400'>{user?.email}</Text>
                        <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
                    </View>
                </TouchableOpacity> */}

                <TouchableOpacity
                    className='flex-row justify-between  border-gray-300 py-2.5 mx-3 '
                    onPress={() => router.push('/password')}
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
        // </Modal>
    );
};

export default AccountSettingsModal;