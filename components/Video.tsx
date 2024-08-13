import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function App() {
  const video = React.useRef(null);
  return (

      <Video
        ref={video}
        className='w-full'
        style={styles.video}
        source={require('@/assets/videos/visualsnowrelief.mov')}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    height: 210
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});