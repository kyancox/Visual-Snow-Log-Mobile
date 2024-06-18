import { View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#2C3E50',
          }
        }
        }
      >
        <Tabs.Screen
          name='community'
          options={{
            headerShown: false
          }}
        />
        <Tabs.Screen
          name='chatbot'
          options={{
            headerShown: false
          }}
        />
        <Tabs.Screen
          name='create'
          options={{
            headerShown: false
          }}
        />
        <Tabs.Screen
          name='log'
          options={{
            headerShown: false
          }}
        />
        <Tabs.Screen
          name='resources'
          options={{
            headerShown: false
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout