import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  LogBox,
  Image,
  ImageBackground,
  Button,
  Pressable

} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat, IMessage, Send, SendProps, Bubble, BubbleProps } from 'react-native-gifted-chat'
import { v4 as uuidv4 } from 'uuid';
import * as Device from 'expo-device'


const Chatbot = () => {
  const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };
  // https://www.youtube.com/watch?v=Lag9Pj_33hM
  const [chatStarted, setChatStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Check if the device is a tablet
    const checkIfTablet = async () => {
      const deviceType = await Device.getDeviceTypeAsync();
      setIsTablet(deviceType === Device.DeviceType.TABLET);
    };

    checkIfTablet();
  }, []);


  const gptAvatar = require('../../assets/images/gpt-trans.png');

  const systemMessage = {
    'role': 'system',
    'content': `You are an expert in Visual Snow Syndrome (VSS). Your role is to provide advice, support, and information to individuals experiencing VSS. You should be empathetic, understanding, and knowledgeable about the condition. Offer practical advice, coping strategies, and emotional support. If users need to vent, listen and provide comfort. Always ensure your responses are supportive and helpful. Keep in mind, you are inside of an app designed to help those with VSS. Don't include markdown like ** because it will not be rendered in the app, you can use new line symbols and numbered lists though.`
  }

  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    setMessages([
      {
        _id: uuidv4(),
        // change in production
        text: `Hello! I'm here to help you. Ask me a question about VSS!`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatGPT',
          avatar: gptAvatar,
        },
      },
    ])
  }, [])

  const fetchOpenAIResponse = async (message: { role: string, content: string }) => {
    // https://github.com/expo/expo/issues/28933
    // EXPO_PUBLIC for development, come back and fix in production

    const apiMessages = messages.slice().reverse().map(message => {
      return { role: message.user.name === 'ChatGPT' ? 'assistant' : 'user', content: message.text }
    })

    const apiRequestBody = {
      'model': 'gpt-3.5-turbo',
      'messages': [
        systemMessage,
        ...apiMessages,
        message
      ]
    }

    console.log(`apiRequestMessages: ${JSON.stringify([
      systemMessage,
      ...apiMessages,
      message
    ], null, 2)}`)

    try {
      const chatCompletion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (!chatCompletion.ok) {
        console.error('Error fetching OpenAI response:', chatCompletion.statusText);
        return;
      }

      const response = await chatCompletion.json();

      if (!response.choices || response.choices.length === 0) {
        console.error('No choices in OpenAI response');
        return;
      }

      const message = response.choices[0].message;

      if (!message || !message.content) {
        console.error('Invalid message format in OpenAI response');
        return;
      }

      const formattedChatMessage = {
        _id: uuidv4(),
        text: message.content,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatGPT',
          avatar: gptAvatar,
        }
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [formattedChatMessage]),
      );
    } catch (error) {
      console.error('Error in fetchOpenAIResponse:', error);

      const formattedChatMessage = {
        _id: uuidv4(),
        text: 'There was an error fetching your response from ChatGPT. Please try again later.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatGPT',
          avatar: gptAvatar,
        }
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [formattedChatMessage]),
      );


    } finally {
      setIsTyping(false)
    }
  }

  const onSend = (message: IMessage[] = []) => {
    setIsTyping(true)
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    )

    const formattedApiMessage = {
      role: 'user',
      content: message[0].text
    }

    fetchOpenAIResponse(formattedApiMessage);
  };

  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send
        {...props}
        textStyle={{
          color: "#FFA500"
        }}
      />
    )
  }

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#FFFFFF'
          },
          right: {
            backgroundColor: "#FFA500"
          }
        }}
      />
    )
  }

  return (
    <>
      {!chatStarted && (<SafeAreaView
        className="flex-1 bg-background"
      >
        <View className="h-full px-1 flex flex-col items-center justify-center space-y-2">
          <Text className="text-4xl text-center font-oextrabold text-tabbar">VSS Chatbot</Text>
          <Text className="text-xl text-center font-osemibold text-tabbar ">A chatbot trained to help those with Visual Snow Syndrome, powered by ChatGPT.</Text>
          <Text className="text-tabbar font-o">Note: Chatbot does not save your conversations.</Text>
          <Pressable
            onPress={() => setChatStarted(true)}
            style={{
              backgroundColor: '#FFA500',
              padding: 10,
              borderRadius: 5,
              elevation: 3,
            }}
          >
            <Text className="text-white font-obold">Get started</Text>
          </Pressable>
        </View>

        {!isTablet && (
          <Image
            source={require('../../assets/images/image.png')}
            resizeMode="contain"
            style={{ height: 166 }}
            className="w-full mt-auto"
          />)}

      </SafeAreaView     >)}

      {chatStarted && (
        <>
          <SafeAreaView className="flex-1 bg-background"
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }}>
            <GiftedChat
              messages={messages}
              onSend={message => onSend(message)}
              user={{
                _id: 1,
              }}
              bottomOffset={100}
              isTyping={isTyping}
              renderSend={renderSend}
              renderBubble={renderBubble}
            />
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default Chatbot;
