import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { cn } from 'utils/cn';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';

interface InputFieldProps  {
    className?: string;
    placeHolder?: string;
    charLimit?: number;
    value: string;
    isSensitive?: boolean;
    onChangeText: (...args: any[]) => void;
    error?: string;
  }

const InputField = ({className, placeHolder, charLimit, isSensitive, value, onChangeText, error}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className='w-full'>
    <View className={
      cn('w-full relative bg-pink-100 px-4 py-6 rounded-xl flex-row justify-center items-center',
      (error && isFocused) ? 'border border-red-500' : '')
      }>
      {!isFocused && !value && (
        <Text className='absolute text-pink-300 font-semibold' style={{ letterSpacing: 1.2 }}>
          {placeHolder}
        </Text>
      )}
      {charLimit && !isSensitive &&
          <Text className='absolute bg-white rounded-md py-1 px-2 text-sm text-pink-300 font-semibold top-0 right-0'>
            {`${value.length}/${charLimit}`}
          </Text>
      }
      <TextInput
        className={cn(
            'relative text-pink-300 w-10/12 font-semibold tracking-wide',
            className
            )}
            maxLength={charLimit}
            value={value}
            secureTextEntry={isSensitive && !isVisible}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign="center"
        />
      {isSensitive &&
          <TouchableOpacity onPress={()=> setIsVisible(!isVisible)} className='absolute right-3'>
            {isVisible ? <Feather name="eye-off" size={20} color="#f9a8d4" />: <Feather name="eye" size={20} color="#f9a8d4" />}
          </TouchableOpacity>
      }
    </View>
    {(error && isFocused) && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}

export default InputField