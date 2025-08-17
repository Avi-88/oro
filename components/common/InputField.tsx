import { View, Text, TextInput } from 'react-native'
import { cn } from 'utils/cn';
import { useState } from 'react';

interface InputFieldProps  {
    className?: string;
    placeHolder?: string;
  }

const InputField = ({className, placeHolder}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  return (
    <View className='w-full bg-pink-100 px-4 py-4 rounded-xl flex-row justify-center items-center'>
      {!isFocused && !value && (
        <Text className='absolute text-pink-300 font-semibold' style={{ letterSpacing: 1.2 }}>
          {placeHolder}
        </Text>
      )}
      <TextInput
        className={cn(
            'relative text-pink-300 font-semibold',
            className
            )}
            value={value}
            onChangeText={setValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign="center"
        />
    </View>
  )
}

export default InputField