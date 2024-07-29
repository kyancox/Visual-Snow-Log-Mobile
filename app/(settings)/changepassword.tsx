import { View, Text, KeyboardAvoidingView, SafeAreaView, Platform, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import Logo from '@/components/Logo'
import { MaterialIcons } from '@expo/vector-icons'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordFocused, setNewPasswordFocused] = useState(false)
    const [secondPassword, setSecondPassword] = useState('')
    const [secondPasswordFocused, setSecondPasswordFocused] = useState(false)
    const [loading, setLoading] = useState(false)


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className='bg-white h-full'>
             <View className='flex flex-row items-center justify-start p-3'>
                   <MaterialIcons
                       name='arrow-back-ios-new'
                       size={24}
                       onPress={() => router.back()}
                       color='#FFA500'
                   />
             </View>

                <View className='mx-auto w-10/12 space-y-5 my-auto'>
                    <Logo />
                    <View className='flex flex-col'>
                        <Text className='text-2xl mb-1 font-psemibold'>Current Password</Text>
                        <TextInput
                            className={`bg-gray-100 p-3 border rounded-lg ${passwordFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setCurrentPassword(text)}
                            value={currentPassword}
                            placeholder="Current Password"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                        />
                    </View>


                    <View>
                        <Text className='text-2xl mb-1 font-psemibold'>New Password</Text>
                        <TextInput
                            className={`bg-gray-100 p-3 border rounded-lg ${newPasswordFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                            secureTextEntry={true}
                            placeholder="New Password"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setNewPasswordFocused(true)}
                            onBlur={() => setNewPasswordFocused(false)}
                        />
                    </View>

                    <View>
                        <Text className='text-2xl mb-1 font-psemibold'>Re-enter Password</Text>
                        <TextInput
                            className={`bg-gray-100 p-3 border rounded-lg ${secondPasswordFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setSecondPassword(text)}
                            value={secondPassword}
                            secureTextEntry={true}
                            placeholder="New Password"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setSecondPasswordFocused(true)}
                            onBlur={() => setSecondPasswordFocused(false)}
                        />
                    </View>

                    {newPassword !== secondPassword &&
                        <Text className='text-red-500 text-center'>
                            Please make sure both passwords are the same.
                        </Text>
                    }


                    <TouchableOpacity className=' bg-projectOrange rounded-lg flex p-2 flex-row items-center justify-center'
                        disabled={loading}
                    >
                        <Text className='text-white font-bold text-center text-lg'>Reset Password</Text>
                    </TouchableOpacity>

                </View>

                <Pressable className='mt-auto mx-auto'
                    onPress={() => {
                        supabase.auth.signInAnonymously()
                        router.push('/create')
                    }}
                >
                </Pressable>

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default ChangePassword