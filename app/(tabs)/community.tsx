import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const community = () => {
  return (
    <SafeAreaView
    style={{
      backgroundColor: '#08080f'
    }}
    className='h-screen'
    >
      <StatusBar style="light" />
      {/* Issue with bottom 'Open Reddit' tab covered by tabbar, due to h-screen. Fix with margin bottom. */}
      <WebView
        className='mb-12'
        source={{ uri: 'https://www.reddit.com/r/visualsnow/' }}
        allowsBackForwardNavigationGestures
        />
    </SafeAreaView>
  )
}

export default community