import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const resources = () => {
  return (
    <SafeAreaView
      className='h-screen'
      style={{
        backgroundColor: '#FFF2E6'
      }}
    >
      <View>
        <Text
          className='text-xl font-bold'
          style={{
            color: '#005f73'
          }}>What is Visual Snow Syndrome?</Text>
        <Text
        style={{
          color: ''
        }}
        >Visual Snow Syndrome (VSS) is a neurological condition that affects an individual's vision, causing them to see static, much like the static seen on a television screen. It can also include other visual disturbances such as afterimages, light sensitivity, and floaters.</Text>
      </View>
    </SafeAreaView>
  )
}

export default resources