import { View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'
import { MaterialIcons, Fontisto } from '@expo/vector-icons'

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA500",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: '#08080f',
            height: 94,
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
                style={{
                  borderRadius: 35,
                  backgroundColor: focused ? '#FFFFFF' : '#08080f',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                className='w-11 h-11'
              >
                <MaterialIcons name='reddit' color={color} size={30} />
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
                style={{
                  borderRadius: 35,
                  backgroundColor: focused ? '#FFFFFF' : '#08080f',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                className='w-11 h-11'
              >
                <MaterialIcons name='chat-bubble-outline' color={color} size={30} />
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
              <View
                className='h-20 rounded-full justify-center items-center border-4'
                style={{
                  backgroundColor: focused ? '#FFFFFF' : '#FFA500',
                  borderColor: '#08080f',
                }}
              >
                {/* <Fontisto/> */}
                <MaterialIcons name='add' color={color} size={70} />
              </View>
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
                style={{
                  borderRadius: 35,
                  backgroundColor: focused ? '#FFFFFF' : '#08080f',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                className='w-11 h-11'
              >
                <MaterialIcons name='library-books' color={color} size={30} />
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
                style={{
                  borderRadius: 35,
                  backgroundColor: focused ? '#FFFFFF' : '#08080f',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                className='w-11 h-11'
              >
                <MaterialIcons name='menu' color={color} size={30} />
              </View>
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout