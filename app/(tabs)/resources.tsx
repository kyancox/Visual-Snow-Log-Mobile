import { View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Button, Pressable, SafeAreaView, Alert, Linking, Modal } from 'react-native'
import React, { useState } from 'react'
import { Link, Redirect, router } from 'expo-router'
import { FontAwesome6, MaterialIcons, Ionicons, AntDesign, Feather } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from 'react-native-reanimated'
import { useRefresh } from '@/providers/RefreshContext'
import { Image } from 'expo-image'
import * as WebBrowser from 'expo-web-browser';
import WebView from 'react-native-webview'
import { v4 as uuidv4 } from 'uuid'

import changeorglogo from '@/assets/images/changeorglogo.png'
import Video from '@/components/Video'


const Resources = () => {

  const { session, user } = useAuth()
  const { triggerRefresh } = useRefresh()
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  const handleLogOut = () => {
    supabase.auth.signOut()
    triggerRefresh()
  }

  const discordLink = 'https://discord.com/invite/q2T37Ujrft'
  const redditWiki = 'https://www.reddit.com/r/visualsnow/wiki/index/'
  const wikiPage = 'https://en.wikipedia.org/wiki/Visual_snow_syndrome'
  const petitionLink = 'https://www.change.org/p/raising-awareness-of-visual-snow-syndrome-and-research?utm_medium=custom_url&utm_source=share_petition&recruited_by_id=99cdd3a0-eb9d-11ee-a014-5d4fd1f994e0'

  const openUrl = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url)
    // if (await InAppBrowser.isAvailable()) {
    //   InAppBrowser.open(url, {
    //     // iOS Properties
    //     animated: true,
    //     modalEnabled: true,
    //     // Android Properties
    //     showTitle: true,
    //   })
    // } else {
    //   Linking.openURL(url)
    // }
  }

  // Modal State & Objects

  const defaultSymptoms = [
    { id: '1', symptom: 'Visual static' },
    { id: '2', symptom: 'Afterimages (Palinopsia)' },
    { id: '3', symptom: 'Light sensitivity (Photophobia)' },
    { id: '4', symptom: 'Migraines' },
    { id: '5', symptom: 'Headaches' },
    { id: '6', symptom: 'Floaters' },
    { id: '7', symptom: 'Ringing in ears (Tinnitus)' },
    { id: '8', symptom: 'Night blindness (Nyctalopia)' },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const nameToImagePath: { [key: string]: any } = {
    'Visual static': require('../../assets/images/visualstatic.jpg'),
    'Afterimages (Palinopsia)': require('../../assets/images/afterimages.jpg'),
    'Light sensitivity (Photophobia)': require('../../assets/images/lightsensitivity.jpg'),
    'Migraines': require('../../assets/images/migraines.jpg'),
    'Headaches': require('../../assets/images/headaches.jpg'),
    'Floaters': require('../../assets/images/floaters.jpg'),
    'Ringing in ears (Tinnitus)': require('../../assets/images/ringinginears.jpg'),
    'Night blindness (Nyctalopia)': require('../../assets/images/nightblindness.jpg')
  };

  const handleInfoPress = (symptom: { id: string, symptom: string }) => {
    setSelectedSymptom(symptom.symptom);
    setModalVisible(true);
  };

  const modalDetails = {
    "Visual static": {
      details: "Visual static appears as tiny flickering dots or 'snow' across your entire visual field, similar to the static seen on an untuned television. Logging the frequency and intensity of your visual static can help track changes over time and identify potential triggers.",
      tips: ["Reduce screen time", "Use tinted glasses", "Practice relaxation"]
    },
    "Afterimages (Palinopsia)": {
      details: "Afterimages occur when you continue to see an image even after you have looked away. Keeping a log of these occurrences can assist in understanding their patterns and how they might relate to other symptoms.",
      tips: ["Avoid bright lights", "Use ambient lighting", "Eye exercises"]
    },
    "Light sensitivity (Photophobia)": {
      details: "Light sensitivity can make bright lights or certain lighting conditions uncomfortable or even painful. Recording your photophobia episodes can help determine which environments or times of day are most problematic for you.",
      tips: ["Wear sunglasses", "Adjust screen brightness", "Use hats/visors"]
    },
    "Migraines": {
      details: "Migraines are intense, throbbing headaches often accompanied by nausea, vomiting, and sensitivity to light and sound. Tracking your migraine episodes, including triggers and severity, can help you manage and potentially reduce their occurrence.",
      tips: ["Regular sleep", "Avoid triggers", "Use medication"]
    },
    "Headaches": {
      details: "Headaches can vary in type and intensity, often presenting as a dull ache or sharp pain in different areas of the head. Logging headache details such as duration, location, and potential triggers can provide valuable insights into your overall health.",
      tips: ["Good posture", "Physical activity", "Cold/warm compress"]
    },
    "Floaters": {
      details: "Floaters are small shapes that drift across your vision, often appearing as spots, threads, or cobwebs. Noting the frequency and changes in your floaters can help monitor their impact on your visual experience.",
      tips: ["Stay hydrated", "Eye exercises", "Consult specialist"]
    },
    "Ringing in ears (Tinnitus)": {
      details: "Tinnitus is the perception of ringing, buzzing, or other noises in your ears that are not caused by external sounds. Documenting your tinnitus episodes can assist in understanding their connection with other symptoms and identifying any patterns.",
      tips: ["White noise", "Avoid loud noises", "Stress management"]
    },
    "Night blindness (Nyctalopia)": {
      details: "Night blindness involves difficulty seeing in low light or darkness, making activities like driving at night challenging. Keeping track of your experiences with night blindness can help in identifying situations that exacerbate this symptom and aid in finding effective coping strategies.",
      tips: ["Vitamin A intake", "Use proper lighting", "Night vision aids"]
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <ScrollView className='flex-1'
        stickyHeaderIndices={[0]

        }>

        {!session ? (
          <Pressable className='sticky flex flex-row items-center justify-center mx-auto p-3 rounded-lg bg-projectOrange  w-11/12' onPress={() => router.push('/(auth)/login')}>
            <Text className='font-obold text-base text-white'>Log in to Visual Snow Log</Text>
          </Pressable>
        )
          :
          <></>
        }


        <View className='flex flex-col items-center justify-center my-2 space-y-1.5'>


          {/* was w-7/12 */}
          <Pressable className='mx-auto w-11/12 p-3 rounded-lg space-x-1 flex flex-row items-center justify-center'
            style={{ backgroundColor: '#748cdb' }}
            onPress={() => openUrl(discordLink)}
          >
            <FontAwesome6 name='discord' size={24} color={'white'} />
            <Text className='text-white font-obold text-center text-base'>Visual Snow Discord</Text>
          </Pressable>
          <Pressable className='mx-auto w-11/12 p-3 rounded-lg space-x-1 flex flex-row items-center justify-center'
            style={{ backgroundColor: '#FF5700' }}
            onPress={() => openUrl(redditWiki)}
          >
            <Ionicons name='logo-reddit' size={24} color={'white'} />
            <Text className='text-white font-obold text-center text-base'>Reddit Wiki</Text>
          </Pressable>
          <Pressable className='mx-auto w-11/12 p-3 rounded-lg space-x-1 flex flex-row items-center justify-center'
            style={{ backgroundColor: '#FFF' }}
            onPress={() => openUrl(wikiPage)}
          >
            <FontAwesome6 name='wikipedia-w' size={24} color={'black'} />
            <Text className='text-black font-obold text-center text-base'>Wikipedia</Text>
          </Pressable>
          <Pressable className='mx-auto w-11/12 p-3 rounded-lg space-x-1 flex flex-row items-center justify-center'
            style={{ backgroundColor: '#ec2b22' }}
            onPress={() => openUrl(petitionLink)}
          >
            <Image source={changeorglogo} style={{ width: 24, height: 24 }} />
            <Text className='text-white font-obold text-center text-base'>Change.org Petition</Text>
          </Pressable>

        </View>



        <View className='mx-4 my-2 space-y-2'>

          <TouchableOpacity className='flex flex-row items-center justify-between border-b border-t py-2.5 border-gray-300' onPress={() => router.push('/vssinfo')}>
            <Text className=' text-2xl font-obold'>
              What is Visual Snow Syndrome?
            </Text>
            <MaterialIcons name='arrow-forward-ios' size={24} color='#FFA500' />
          </TouchableOpacity>

          <View className=''>
            <Text className='text-center text-xl font-obold mb-1'>Visual Snow Relief Video</Text>
            <Video />
            <Text className='text-center font-omedium my-2 '>Stare at the video for as long as you need to experience Visual Snow relief.</Text>
          </View>

          <View className='border-b border-t border-gray-300 pt-2 pb-3'>
            <Text className='font-obold text-xl mb-1 text-center'>Symptom Info</Text>
            <FlatList
              horizontal={true}
              data={defaultSymptoms}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleInfoPress(item)}>
                  <View className='p-4 bg-slate-400 mx-1 rounded-lg flex flex-row items-center justify-center'>
                    <Text className='font-o text-white'>{item.symptom}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>

          {/* <View className=''>
            <Text className=' text-xl font-obold'>
              Helpful Organizations
            </Text>
            <Text className='font-omedium text-base'>
              - <Text onPress={() => openUrl('https://visualsnowsyndrome.com/')} className='underline font-o text-projectOrange'>The Visual Snow Foundation</Text>
            </Text>
            <Text className='font-omedium text-base'>
              - <Text onPress={() => openUrl('https://www.visualsnowinitiative.org/')} className='underline font-o text-projectOrange'>Visual Snow Initiative</Text>
            </Text>
          </View> */}

        </View>

        <Text className='text-xl font-obold text-center '>Settings</Text>
        <View className='mx-4 space-y-1 my-1'>
          {user && (
            <TouchableOpacity
              className='flex-row items-center space-x-1'
              onPress={() => router.push('/(settings)/account')}
            >
              <Text className='font-omedium text-base'>Edit Account</Text>
              <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
            </TouchableOpacity>
          )}
          <TouchableOpacity className='flex-row items-center space-x-1' onPress={() => router.push('/terms')}>
            <Text className='font-omedium text-base'>Terms and Policies</Text>
            <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
          </TouchableOpacity>
          <TouchableOpacity className='flex-row items-center space-x-1' onPress={() => router.push('/(settings)/terms')}>
            <Text className='font-omedium text-base'>Send Feedback</Text>
            <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
          </TouchableOpacity>
          {user && (
            <TouchableOpacity
              className='flex-row items-center space-x-1'
              onPress={() => {
                Alert.alert('Are you sure you want to log out?', '', [
                  {
                    text: 'Log Out',
                    onPress: handleLogOut,
                    style: 'default',
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Text className=' text-base font-omedium'>Log Out</Text>
              <MaterialIcons name='arrow-forward-ios' size={18} color='#FFA500' />
            </TouchableOpacity>
          )}

        </View>

        {session ? (
          <Text className='text-center text-lg font-obold mt-1 mb-4'>Logged in as:<Text className='font-o text-base'> {user?.email}</Text></Text>
        ) :
          <View className='mb-4' />
        }

      </ScrollView>

      {selectedSymptom && (
        <Modal
          animationType="fade"
          visible={modalVisible}
          transparent
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View className='my-auto justify-center items-center'>
            <View className='w-11/12 bg-white rounded-2xl p-4 shadow-lg'>

              <View className='flex flex-row items-center justify-between w-full mb-1 '>
                <Text className='text-lg font-obold'>{selectedSymptom}</Text>
                <AntDesign name='close' size={20} color={'grey'} onPress={() => setModalVisible(!modalVisible)} />
              </View>

              {nameToImagePath[selectedSymptom] ? (
                <Image
                  source={nameToImagePath[selectedSymptom] as any}
                  className='w-full'
                  style={{
                    height: 200,
                  }}
                  contentFit="contain"
                  transition={1000}
                />
              ) : (
                <Text>No image available</Text>
              )}

              <Text className='text-xl font-osemibold my-1'>Details</Text>
              <Text className='font-o'>{modalDetails[selectedSymptom as keyof typeof modalDetails].details}</Text>

              <Text className='text-xl font-osemibold my-1'>Tips for Relief</Text>
              {modalDetails[selectedSymptom as keyof typeof modalDetails].tips.map(tip => (
                <Text key={uuidv4()} className='font-o'>&#8226; {tip}</Text>
              ))}
              <Button
                title="Close"
                color={'#FFA500'}
                onPress={() => setModalVisible(!modalVisible)}
              />

            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView >
  )
}

export default Resources