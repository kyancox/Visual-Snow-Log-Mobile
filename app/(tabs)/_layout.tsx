import { View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'

import chaticon from '@/assets/icons/chaticon.svg'
import whitechaticon from '@/assets/icons/whitechaticon.svg'
import tabbarcreate from '@/assets/icons/tabbarcreate.svg'
import logsicon from '@/assets/icons/logsicon.svg'
import whitelogsicon from '@/assets/icons/whitelogsicon.svg'
import moreicon from '@/assets/icons/moreicon.svg'
import whitemoreicon from '@/assets/icons/whitemoreicon.svg'
import plus from '@/assets/icons/plus.svg'
import orangeplus from '@/assets/icons/orangeplus.svg'


const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: '#6C6D73',
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: '#FFFFFF',
            height: 100,
            paddingTop: 0,
            marginTop: 0,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25
          },
        }}
      >
        <Tabs.Screen
          name='community'
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`items-center justify-center ${focused ? 'bg-tbbg rounded-full p-1.5' : ''}`}
              >
                <Ionicons name='logo-reddit' color={color} size={24} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name='chatbot'
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`items-center justify-center ${focused ? 'bg-tbbg rounded-full p-1.5' : ''}`}
              >
                {/* <MaterialIcons name='chat-bubble-outline' color={'#6C6D73'} size={24} /> */}
                {focused ? <Image source={whitechaticon} style={{ width: 24, height: 24 }} /> :
                  <Image source={chaticon} style={{ width: 24, height: 24 }} />}
              </View>
            )
          }}
        />
        <Tabs.Screen
          name='create'
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <>
                {focused ?
                  <View className='p-2.5 items-center justify-center rounded-full border border-projectOrange bg-white'>
                    <Image source={orangeplus} style={{ width: 32, height: 32 }} />
                  </View>
                  :
                  <View className='p-2.5 items-center justify-center rounded-full bg-projectOrange'>
                    <Image source={plus} style={{ width: 32, height: 32 }} />
                  </View>
                }
              </>
            )

          }}
        />
        <Tabs.Screen
          name='logs'
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`items-center justify-center ${focused ? 'bg-tbbg rounded-full p-1.5' : ''}`}
              >
                {/* <MaterialIcons name='chat-bubble-outline' color={'#6C6D73'} size={24} /> */}
                {focused ?
                  <Image source={whitelogsicon} style={{ width: 24, height: 24 }} /> 
                  :
                  <Image source={logsicon} style={{ width: 24, height: 24 }} />
                }
              </View>
            )
          }}
        />
        <Tabs.Screen
          name='resources'
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`items-center justify-center ${focused ? 'bg-tbbg rounded-full p-1.5' : ''}`}
              >
                {focused ?
                  <Image source={whitemoreicon} style={{ width: 24, height: 24 }} /> :
                  <Image source={moreicon} style={{ width: 24, height: 24 }} />
                }
              </View>
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout