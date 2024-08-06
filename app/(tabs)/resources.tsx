import { View, Text, FlatList, TouchableOpacity, ScrollView, Button, Pressable, SafeAreaView, Alert, Linking } from 'react-native'
import React from 'react'
import { Link, Redirect, router } from 'expo-router'
import { FontAwesome6, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from 'react-native-reanimated'
import { useRefresh } from '@/providers/RefreshContext'
import { Image } from 'expo-image'
import * as WebBrowser from 'expo-web-browser';

import changeorglogo from '@/assets/images/changeorglogo.png'
import Video from '@/components/Video'


const Resources = () => {

  const { session, user } = useAuth()
  const { triggerRefresh } = useRefresh()

  interface settingsItemProps {
    icon: any,
    text: string,
    routename: string
  }

  const settingsItems: settingsItemProps[] = [
    { icon: 'person-outline', text: 'Edit Account', routename: '/(settings)/changepassword' },
    { icon: 'help-outline', text: 'Help & Support', routename: '/help' },
    { icon: 'info-outline', text: 'Terms and Policies', routename: 'terms' },
    { icon: 'outlined-flag', text: 'Report a Problem', routename: '/report' },
    { icon: 'logout', text: 'Log Out', routename: '/logout' }

  ]

  const renderSettingsItem = ({ icon, text, routename }: settingsItemProps) => {
    return (
      <TouchableOpacity
        className='flex-row p-1 border  shadow items-center justify-start space-x-2 bg-white border-border '
        onPress={() => { router.push(routename) }}
      >
        <MaterialIcons className='' name={icon} size={24} color="black" />
        <Text className=' text-base font-o'>{text}</Text>
      </TouchableOpacity>
    );
  }

  const handleLogOut = () => {
    supabase.auth.signOut()
    triggerRefresh()
  }

  const discordLink = 'https://discord.com/invite/q2T37Ujrft'
  const redditWiki = 'https://www.reddit.com/r/visualsnow/wiki/index/'
  const wikiPage = 'https://en.wikipedia.org/wiki/Visual_snow_syndrome'
  const petitionLink = 'https://www.change.org/p/raising-awareness-of-visual-snow-syndrome-and-research?utm_medium=custom_url&utm_source=share_petition&recruited_by_id=99cdd3a0-eb9d-11ee-a014-5d4fd1f994e0'

  const openUrl = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url)
    // if (await InAppBrowser.isAvailable()) {
    //   InAppBrowser.open(url, {
    //     // iOS Properties
    //     animated: true,
    //     modalEnabled: true,
    //     // Android Properties
    //     showTitle: true,
    //   })
    // } else {
    //   Linking.openURL(url)
    // }
  }


  return (
    <SafeAreaView
      className='h-full bg-background'
    >
      <ScrollView>



        <View className='flex flex-col items-center justify-center gap-y-1.5'>
          {!session ? (
            <Button title='Login' onPress={() => router.push('/(auth)/login')} />
          ) : (
            <>
              <Text className='text-center text-lg font-obold'>Logged in as:<Text className='font-o text-base'> {user?.email}</Text></Text>
            </>
          )}
          <Pressable className='mx-auto w-7/12 p-3 rounded-full space-x-1 flex flex-row items-center justify-center shadow'
            style={{
              backgroundColor: '#748cdb'
            }}
            onPress={() => openUrl(discordLink)}
          >
            <FontAwesome6 name='discord' size={24} color={'white'} />
            <Text className='text-white font-bold text-center text-base'>Visual Snow Discord</Text>
          </Pressable>
          <Pressable className='mx-auto w-7/12 p-3 rounded-full space-x-1 flex flex-row items-center justify-center shadow'
            style={{
              backgroundColor: '#FF5700'
            }}
            onPress={() => openUrl(redditWiki)}
          >
            <Ionicons name='logo-reddit' size={24} color={'white'} />
            <Text className='text-white font-bold text-center text-base'>Reddit Wiki</Text>
          </Pressable>
          <Pressable className='mx-auto w-7/12 p-3 rounded-full space-x-1 flex flex-row items-center justify-center shadow '
            style={{
              backgroundColor: '#FFF'
            }}
            onPress={() => openUrl(wikiPage)}
          >
            <FontAwesome6 name='wikipedia-w' size={24} color={'black'} />
            <Text className='text-black font-bold text-center text-base'>Wikipedia</Text>
          </Pressable>
          <Pressable className='mx-auto w-7/12 p-3 rounded-full space-x-1 flex flex-row items-center justify-center shadow '
            style={{
              backgroundColor: '#ec2b22'
            }}
            onPress={() => openUrl(petitionLink)}
          >
            <Image source={changeorglogo} style={{ width: 24, height: 24 }} />
            <Text className='text-white font-bold text-center text-base'>Change.org Petition</Text>
          </Pressable>
        </View>



        <View className='mx-4'>
          <Text className=' text-lg font-obold'>
            What is Visual Snow Syndrome?
          </Text>
          <Text className='text-black font-o text-base'>
            Visual Snow Syndrome (VSS) is a neurological condition that affects an individual's vision, causing them to see static, much like the static seen on a television screen. It can also include other visual disturbances such as afterimages, light sensitivity, and floaters.
          </Text>
          <Video />
          <Text className='text-secondary text-xl font-bold'>
            Helpful Organizations
          </Text>
          <Text>
            [The Visual Snow Foundation] <Link href='https://visualsnowsyndrome.com/'>https://visualsnowsyndrome.com/</Link>
          </Text>
          <Text>
            [Visual Snow Initiative] <Link href='https://www.visualsnowinitiative.org/'>https://www.visualsnowinitiative.org/</Link>
          </Text>
        </View>

        {/* <FlatList
              horizontal={true}
              data={defaultSymptoms}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSymptomPress(item)}>
                  <View className='p-4 bg-gray-200 m-2 rounded-md flex flex-row items-center justify-center space-x-2'>
                    <Text>{item.symptom}</Text>
                    <Pressable onPress={() => handleInfoPress(item)}>
                      <Feather name='info' size={20} color={'grey'} />
                    </Pressable>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            /> */}

        <View className='mx-1 px-1'>
          <Text className='text-xl font-obold'>Settings</Text>

          <View className='rounded-lg border border-border bg-white'>

            <TouchableOpacity
              className='flex-row p-1 mx-1 border-b shadow items-center justify-start space-x-2 border-border'
              onPress={() => { router.push('') }}
            >
              <MaterialIcons className='' name={'person-outline'} size={24} color="black" />
              <Text className=' text-base font-o'>{'Edit Account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-row p-1 mx-1 border-b shadow items-center justify-start space-x-2 border-border'
              onPress={() => { router.push('') }}
            >
              <MaterialIcons className='' name={'help-outline'} size={24} color="black" />
              <Text className=' text-base font-o'>{'Help & Support'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-row p-1 mx-1 border-b shadow items-center justify-start space-x-2 border-border'
              onPress={() => { router.push('/(settings)/terms') }}
            >
              <MaterialIcons className='' name={'info-outline'} size={24} color="black" />
              <Text className=' text-base font-o'>{'Terms and Policies'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-row p-1 mx-1 border-b shadow items-center justify-start space-x-2 border-border'
              onPress={() => { router.push('') }}
            >
              <MaterialIcons className='' name={'outlined-flag'} size={24} color="black" />
              <Text className=' text-base font-o'>{'Report a Problem'}</Text>
            </TouchableOpacity>
            {user && (
              <TouchableOpacity
                className='flex-row p-1 mx-1 border-b shadow items-center justify-start space-x-2 border-border'
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
                <MaterialIcons className='' name={'logout'} size={24} color="black" />
                <Text className=' text-base font-o'>{'Log Out'}</Text>
              </TouchableOpacity>
            )}
          </View >

        </View>

      </ScrollView>
    </SafeAreaView >
  )
}

export default Resources