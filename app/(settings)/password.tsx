import { View, Text, KeyboardAvoidingView, SafeAreaView, Platform, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import Logo from '@/components/Logo'
import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/providers/AuthProvider'

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordFocused, setNewPasswordFocused] = useState(false)
    const [secondPassword, setSecondPassword] = useState('')
    const [secondPasswordFocused, setSecondPasswordFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const resetPassword = async () => {

        if (newPassword !== secondPassword) {
            Alert.alert("Passwords don't match.")
        }

        if (newPassword === '' || secondPassword === '') {
            Alert.alert('Password is blank.')
        }

        const { data, error } = await supabase.auth.updateUser({ password: newPassword })

        if (error) {
            Alert.alert(error.message)
            return
        }

        router.back()
        Alert.alert('Password successfully updated.')
        
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className='bg-white h-full'>

                <View className='mx-auto w-10/12 space-y-5 my-auto'>
                    <Logo />

                    <View>
                        <Text className='text-2xl mb-1 font-psemibold'>New Password</Text>
                        <TextInput
                            className={`bg-gray-100 p-3 border rounded-lg ${newPasswordFocused ? 'border-projectOrange' : 'border-white'}`}
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                            secureTextEntry={!showPassword}
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
                            secureTextEntry={!showPassword}
                            placeholder="New Password"
                            placeholderTextColor="#888"
                            autoCapitalize={'none'}
                            onFocus={() => setSecondPasswordFocused(true)}
                            onBlur={() => setSecondPasswordFocused(false)}
                        />
                        <Pressable className='flex flex-row items-center justify-end mt-2' onPress={() => setShowPassword(!showPassword)}>
                            <Text className='text-projectOrange font-o'>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
                        </Pressable>
                    </View>

                    <TouchableOpacity
                        className={`${newPassword !== secondPassword || newPassword === '' || secondPassword === '' ? 'bg-gray-500' : 'bg-projectOrange'}  rounded-lg flex p-2 flex-row items-center justify-center`}
                        disabled={newPassword !== secondPassword || newPassword === '' || secondPassword === ''}
                        onPress={resetPassword}
                    >
                        <Text className='text-white font-bold text-center text-lg'>Reset Password</Text>
                    </TouchableOpacity>


                    {newPassword !== secondPassword &&
                        <Text className='text-red-500 text-center'>
                            Please make sure both passwords are the same.
                        </Text>
                    }


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