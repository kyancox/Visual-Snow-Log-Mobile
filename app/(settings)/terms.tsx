import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const TermsAndPolicies = () => {
    return (
        <SafeAreaView className='bg-background flex-1'>
            <View className='flex flex-row items-center justify-start p-2 space-x-2'>
                <MaterialIcons
                    name='arrow-back-ios-new'
                    size={24}
                    onPress={() => router.back()}
                    color='#FFA500'
                />
                <Text className='text-2xl font-obold '>Terms and Policies</Text>
            </View>
            <ScrollView className='p-4'>

                <Text className='text-lg font-osemibold mb-2'>1. Introduction</Text>
                <Text className='text-base font-o mb-4'>
                    Welcome to the VisualSnow app. By using our app, you agree to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern VisualSnow's relationship with you in relation to this app.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>2. Use of the App</Text>
                <Text className='text-base font-o mb-4'>
                    The content of the pages of this app is for your general information and use only. It is subject to change without notice. Unauthorized use of this app may give rise to a claim for damages and/or be a criminal offense.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>3. Privacy Policy</Text>
                <Text className='text-base font-o mb-4'>
                    We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this app, then you can be assured that it will only be used in accordance with this privacy statement.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>4. User Accounts</Text>
                <Text className='text-base font-o mb-4'>
                    To access certain features of the app, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>5. Security</Text>
                <Text className='text-base font-o mb-4'>
                    We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>6. Links to Other Websites</Text>
                <Text className='text-base font-o mb-4'>
                    Our app may contain links to other websites of interest. However, once you have used these links to leave our app, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>7. Limitation of Liability</Text>
                <Text className='text-base font-o mb-4'>
                    In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this app.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>8. Changes to This Agreement</Text>
                <Text className='text-base font-o mb-4'>
                    We may update our Terms and Policies from time to time. We will notify you of any changes by posting the new Terms and Policies on this page. You are advised to review this page periodically for any changes.
                </Text>

                <Text className='text-lg font-osemibold mb-2'>9. Contact Us</Text>
                <Text className='text-base font-o mb-4'>
                    If you have any questions about these Terms and Policies, please contact us at visualsnowlog@gmail.com.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsAndPolicies;