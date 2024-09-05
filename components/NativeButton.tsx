import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { cn } from '@/lib/utils'

interface NativeButtonProps {
    onPress: () => any;
    title: string;
    color?: string;
    className?: string;
    disabled?: any;
}

const NativeButton = ({ onPress, title, className, disabled }: NativeButtonProps) => {
    return (
        <Pressable className={cn('m-1', className)} onPress={onPress} disabled={disabled}>
            <Text className='text-projectOrange text-lg font-o text-center' >{title}</Text>
        </Pressable >
    )
}

export default NativeButton