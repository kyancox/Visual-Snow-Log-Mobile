import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const Resources = () => {

  interface settingsItemProps {
    icon: any,
    text: string,
    routename: string
  }

  const settingsItems: settingsItemProps[] = [
    { icon: 'person-outline', text: 'Edit Account', routename: '/editaccount' },
    { icon: 'help-outline', text: 'Help & Support', routename: '/help' },
    { icon: 'info-outline', text: 'Terms and Policies', routename: 'terms' },
    { icon: 'outlined-flag', text: 'Report a Problem', routename: '/report' },
    { icon: 'logout', text: 'Log Out', routename: '/logout' }

  ]

  const renderSettingsItem = ({ icon, text, routename }: settingsItemProps) => {
    return (
      <TouchableOpacity
        className='flex-row p-1 border rounded shadow'
        onPress={() => { router.push(routename) }}
      >
        <MaterialIcons className='' name={icon} size={24} color="black" />
        <Text className='ml-2 text-base'>{text}</Text>
      </TouchableOpacity>
    );
  }




  return (
    <SafeAreaView
      className='bg-main h-screen'
    >
      <ScrollView>

        {/* <FlatList
          data={settingsItems}
          renderItem={({ item }) => renderSettingsItem(item)}
        /> */}

        <View className='mx-1 px-1'>
          <Text className='text-xl'>Settings</Text>
          <View className='bg-gray-50'>
            {settingsItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>

            ))}
          </View>
        </View>

        <View className='mx-4'>
          <Text className='text-secondary text-xl font-bold'>
            What is Visual Snow Syndrome?
          </Text>
          <Text className='text-black text-base'>
            Visual Snow Syndrome (VSS) is a neurological condition that affects an individual's vision, causing them to see static, much like the static seen on a television screen. It can also include other visual disturbances such as afterimages, light sensitivity, and floaters.
          </Text>
          <Text className='text-secondary text-xl font-bold'>
            Helpful Organizations
          </Text>
          <Text>
            [The Visual Snow Foundation] <Link href='https://visualsnowsyndrome.com/'>https://visualsnowsyndrome.com/</Link>
          </Text>
          <Text>
            [Visual Snow Initiative] <Link href='https://www.visualsnowinitiative.org/'>https://www.visualsnowinitiative.org/</Link>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView >
  )
}

export default Resources