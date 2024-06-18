import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'

const log = () => {
  return (
    <SafeAreaView>
      <Text>log</Text>
    </SafeAreaView>
  )
}

export default log