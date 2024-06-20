import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const community = () => {
  return (
    <SafeAreaView
    className='bg-tabbar h-screen'
    >
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