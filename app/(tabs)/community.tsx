import { View, Text, SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview';
import React, { useEffect, useRef, useState } from 'react'
import NativeButton from '@/components/NativeButton';

const community = () => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Enable cookies for the WebView
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        document.cookie = "key=value; path=/; HttpOnly";
      `);
    }
  }, []);

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
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
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  return (
    <SafeAreaView
      className='h-full'
    >
      <View className='flex flex-row justify-between mx-2 my-0.5'>
        <NativeButton title="Back" onPress={goBack}  disabled={!canGoBack}/>
        <NativeButton title="Home" onPress={goHome} />
        <NativeButton title="Next" onPress={goForward} disabled={!canGoForward}/>
      </View>
      <WebView
        ref={webViewRef}
        className='flex-1'
        source={{ uri: 'https://www.reddit.com/r/visualsnow/' }}
        allowsBackForwardNavigationGestures
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  )
}

export default community