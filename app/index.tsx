import { View, Text, Button, SafeAreaView, Pressable, Platform } from 'react-native'
import React from 'react'
import { useRouter, Redirect } from 'expo-router'
import Logo from '@/components/Logo'
import { Apple } from '@/components/Apple'
import { Feather, AntDesign } from '@expo/vector-icons'

import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'

const Onboarding = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Redirect href={'/create'} />
    }

    return (
        <SafeAreaView className='bg-white h-full'>
            {/* <Button title='To /pages' onPress={() => router.push('/pages')} /> */}
            <View className='w-5/6 mx-auto gap-y-3 mt-20'
            >
                <Logo />
                <Text className='text-5xl mb-4 font-o'>Start tracking your <Text className='text-projectOrange'>Visual Snow Syndrome</Text>.</Text>

                <Pressable className=' bg-black rounded-full mx-8 flex flex-row items-center justify-center'
                    onPress={async () => {
                        try {
                            const credential = await AppleAuthentication.signInAsync({
                                requestedScopes: [
                                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                ],
                            })
                            // Sign in via Supabase Auth.
                            if (credential.identityToken) {
                                const {
                                    error,
                                    data: { user },
                                } = await supabase.auth.signInWithIdToken({
                                    provider: 'apple',
                                    token: credential.identityToken,
                                })
                                console.log(JSON.stringify({ error, user }, null, 2))
                                if (!error) {
                                    // User is signed in.
                                }
                            } else {
                                throw new Error('No identityToken.')
                            }
                        } catch (e: any) {
                            if (e.code === 'ERR_REQUEST_CANCELED') {
                                // handle that the user canceled the sign-in flow
                            } else {
                                // handle other errors
                            }
                        }
                    }}
                >
                    <AntDesign name='apple1' size={24} color={'white'} />
                    <Text className='text-white font-osemibold p-3 text-center text-lg'>Continue with Apple</Text>
                </Pressable>
                <Pressable className=' bg-projectOrange rounded-full mx-8 flex flex-row items-center justify-center'
                    onPress={() => router.push('/signup')}
                >
                    <Feather name='mail' size={24} color={'white'} />
                    <Text className='text-white font-osemibold p-3 text-center text-lg'>Continue with Email</Text>
                </Pressable>
                <Text className='text-center font-osemibold'>or</Text>
                <Pressable className=' bg-projectOrange rounded-full mx-8 flex flex-row items-center justify-center'
                    onPress={() => {
                        supabase.auth.signInAnonymously()
                        router.push('/create')
                    }}
                >
                    <AntDesign name='eyeo' size={24} color={'white'} />
                    <Text className='text-white font-osemibold p-3 text-center text-lg'>Continue as Guest</Text>
                </Pressable>

            </View>

            <View className='mx-auto mt-auto flex flex-row '>
                <Text className='font-o'>Already have an account?</Text>
                <Pressable
                    onPress={() => router.push('/login')}
                >
                    <Text className=' text-projectOrange font-o'> Log in</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Onboarding