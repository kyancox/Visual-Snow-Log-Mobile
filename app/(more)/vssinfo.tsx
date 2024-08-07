import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser'

const VisualSnowInfo = () => {
    const openUrl = async (url: string) => {
        let result = await WebBrowser.openBrowserAsync(url)
    }

    return (
        <SafeAreaView className='bg-background flex-1'>
            <View className='flex flex-row items-center justify-start p-2 space-x-3'>
                <MaterialIcons
                    name='arrow-back-ios-new'
                    size={24}
                    onPress={() => router.back()}
                    color='#FFA500'
                />
                <Text className='text-2xl font-obold '>What is Visual Snow Syndrome?</Text>
            </View>
            <ScrollView className='p-4'>

                <Text className='text-lg font-osemibold mb-2'>1. Introduction</Text>
                <Text className='text-base font-o mb-4'>
                    Visual Snow Syndrome (VSS) is a neurological condition that affects an individual's vision, causing them to see static, much like the static seen on a television screen. It can also include other visual disturbances such as afterimages, light sensitivity, and floaters.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>2. Symptoms</Text>
                <Text className='text-base font-o mb-4'>
                    The primary symptom of VSS is the perception of visual static. Other symptoms may include:
                    {'\n'}- Afterimages (Palinopsia)
                    {'\n'}- Light sensitivity (Photophobia)
                    {'\n'}- Migraines
                    {'\n'}- Headaches
                    {'\n'}- Floaters
                    {'\n'}- Ringing in ears (Tinnitus)
                    {'\n'}- Night blindness (Nyctalopia)
                </Text>

                <Text className='text-lg font-osemibold mb-2'>3. Causes</Text>
                <Text className='text-base font-o mb-4'>
                    The exact cause of Visual Snow Syndrome is not well understood. It is believed to be related to abnormal processing of visual information in the brain. Some researchers suggest it may be linked to other neurological conditions such as migraines.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>4. Diagnosis</Text>
                <Text className='text-base font-o mb-4'>
                    Diagnosing VSS can be challenging as it is a relatively new and not widely recognized condition. Diagnosis typically involves a thorough examination by a neurologist or ophthalmologist, including a detailed patient history and ruling out other potential causes of the symptoms.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>5. Treatment</Text>
                <Text className='text-base font-o mb-4'>
                    There is currently no cure for Visual Snow Syndrome. Treatment focuses on managing symptoms and may include:
                    {'\n'}- Medications to reduce migraines or other associated symptoms
                    {'\n'}- Vision therapy
                    {'\n'}- Lifestyle changes such as reducing screen time and managing stress
                </Text>

                <Text className='text-lg font-osemibold mb-2'>6. Coping Strategies</Text>
                <Text className='text-base font-o mb-4'>
                    Living with VSS can be challenging, but there are strategies that can help manage the symptoms:
                    {'\n'}- Using tinted glasses to reduce light sensitivity
                    {'\n'}- Practicing relaxation techniques
                    {'\n'}- Keeping a symptom diary to identify potential triggers
                </Text>

                <Text className='text-lg font-osemibold mb-2'>7. Research and Support</Text>
                <Text className='text-base font-o mb-4'>
                    Research on Visual Snow Syndrome is ongoing, and there are organizations dedicated to raising awareness and supporting those affected by the condition. Some helpful organizations include:
                    {'\n'}- <Text className='underline text-projectOrange' onPress={() => openUrl('https://visualsnowsyndrome.com/')}>The Visual Snow Foundation</Text>
                    {'\n'}- <Text className='underline text-projectOrange' onPress={() => openUrl('https://www.visualsnowinitiative.org/')}>Visual Snow Initiative</Text>
                </Text>

                <Text className='text-lg font-osemibold mb-2'>8. Conclusion</Text>
                <Text className='text-base font-o mb-4'>
                    Visual Snow Syndrome is a complex and often misunderstood condition. While there is no cure, understanding the symptoms and finding effective coping strategies can help those affected lead a better quality of life. Continued research and awareness are essential in improving the lives of individuals with VSS.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>9. Contact Us</Text>
                <Text className='text-base font-o mb-4'>
                    If you have any questions about Visual Snow Syndrome or Visual Snow Log, please contact us at visualsnowlog@gmail.com.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default VisualSnowInfo;