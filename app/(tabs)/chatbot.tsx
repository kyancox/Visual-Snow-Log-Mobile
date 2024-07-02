import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  LogBox,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
  const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };
  // https://www.youtube.com/watch?v=Lag9Pj_33hM
  const [chatStarted, setChatStarted] = useState(false);

  const gptAvatar = require('../../assets/images/gpt-trans.png');

  const systemMessage = {
    'role': 'system',
    'content': 'You are an expert in Visual Snow Syndrome (VSS). Your role is to provide advice, support, and information to individuals experiencing VSS. You should be empathetic, understanding, and knowledgeable about the condition. Offer practical advice, coping strategies, and emotional support. If users need to vent, listen and provide comfort. Always ensure your responses are supportive and helpful.'
  }

  const [messages, setMessages] = useState<IMessage[]>([])

  const test = {
    'role': 'assistant',
    'content': `Hello! I'm here to help you.`
  }


  useEffect(() => {
    setMessages([
      {
        _id: uuidv4(),
        text: `Hello! I'm here to help you.`,
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

    // console.log(messages)

    const apiMessages = messages.slice().reverse().map(message => {
      return { role: message.user.name === 'ChatGPT' ? 'assistant' : 'user', content: message.text }
    })

    // console.log(apiMessages)

    // console.log(message)

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
    ],null,2)}`)

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
      // console.log('OpenAI response:', response);

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
    }
  }

  const onSend = (message: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    )
    // console.log(`messages: ${JSON.stringify(messages)}`)
    const formattedApiMessage = {
      role: 'user',
      content: message[0].text
    }
    // console.log(`formattedApiMessage: ${JSON.stringify(formattedApiMessage)}`)
    // await setApiMessages(prevState => {
    //   const newState = [...prevState, formattedApiMessage];
    //   console.log(`newState: ${JSON.stringify(newState)}`); // Log the new state to verify
    //   return newState;
    // });
    // console.log(`apiMessages: ${JSON.stringify(apiMessages)}`)
    //
    fetchOpenAIResponse(formattedApiMessage);
  };

  return (
    <>
      {/* <SafeAreaView>
        {messages.map(message => (
          <View key={message._id}> 
          <Text>{message.text}</Text>
          </View>
        ))}
      </SafeAreaView> */}
     <SafeAreaView className="flex-1">
       <GiftedChat
         messages={messages}
         onSend={message => onSend(message)}
         user={{
           _id: 1,
         }}
         bottomOffset={100}
       />
     </SafeAreaView>
    </>
  );
};

export default Chatbot;
