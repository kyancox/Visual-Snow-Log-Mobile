import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

interface SelectableProps {
    title: string,
    onPress: () => any,
    custom?: boolean,
    customState? :boolean
}

const Selectable = ({title, onPress, custom, customState}: SelectableProps) => {
    const [selected, setSelected] = useState(false)

    const handlePress = () => {
        onPress()
        if (!custom) {
            setSelected(!selected);
        }
    }

    if (custom) {
        return (
            <TouchableOpacity 
              className={`m-1 py-1 px-3 border border-border rounded-full ${customState ? 'bg-black' : ''}`}
              onPress={handlePress}
              style={{ alignSelf: 'flex-start' }}
            >
              <Text className={`font-olight text-sm ${customState ? 'text-white' : ''}`}>{title}</Text>
            </TouchableOpacity>
          )
    }


  return (
    <TouchableOpacity 
      className={`m-1 py-1 px-3 border border-border rounded-full ${selected ? 'bg-black' : ''}`}
      onPress={handlePress}
      style={{ alignSelf: 'flex-start' }}
    >
      <Text className={`font-olight text-sm ${selected ? 'text-white' : ''}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Selectable