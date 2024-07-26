import { View, Text, Button, SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview';
import React, { useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar';

const community = () => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    // Enable cookies for the WebView
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        document.cookie = "key=value; path=/; HttpOnly";
      `);
    }
  }, []);

  const goBack = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const goHome = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.location.href = 'https://www.reddit.com/r/visualsnow/';
      `);
    }
  };

  const goForward = () => {
    if (webViewRef.current) {
      webViewRef.current.goForward();
    }
  };


  return (
    <SafeAreaView
      className='h-full'
    >
      <StatusBar style="light" />
      <View className='flex flex-row justify-between p-1'>
        <Button title="Back" onPress={goBack} color={'#FFA500'}/>
        <Button title="Home" onPress={goHome} color={'#FFA500'}/>
        <Button title="Next" onPress={goForward} color={'#FFA500'}/>
      </View>
      <WebView
        ref={webViewRef}
        className='flex-1'
        source={{ uri: 'https://www.reddit.com/r/visualsnow/' }}
        allowsBackForwardNavigationGestures
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  )
}

export default community