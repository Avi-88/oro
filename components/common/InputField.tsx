import { View, Text, TextInput } from 'react-native'
import { cn } from 'utils/cn';
import { useState } from 'react';

interface InputFieldProps  {
    className?: string;
    placeHolder?: string;
    charLimit?: number;
    value: string;
    onChangeText: (...args: any[]) => void;
  }

const InputField = ({className, placeHolder, charLimit, value, onChangeText}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className='w-full relative bg-pink-100 px-4 py-4 rounded-xl flex-row justify-center items-center'>
      {!isFocused && !value && (
        <Text className='absolute text-pink-300 font-semibold' style={{ letterSpacing: 1.2 }}>
          {placeHolder}
        </Text>
      )}
      {charLimit &&
          <Text className='absolute bg-white rounded-md py-1 px-2 text-sm text-pink-300 font-semibold top-0 right-0'>
            {`${value.length}/${charLimit}`}
          </Text>
      }
      <TextInput
        className={cn(
            'relative text-pink-300 w-full font-semibold tracking-wide',
            className
            )}
            maxLength={charLimit}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign="center"
        />
    </View>
  )
}

export default InputField