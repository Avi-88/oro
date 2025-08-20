import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import InputField from 'components/common/InputField';

interface VerifyCodeProps {
  onDataChange: (data: { [key: string]: any }) => void;
  onStepComplete: (isComplete: boolean) => void;
}

const VerifyCode = ({ onDataChange, onStepComplete }: VerifyCodeProps) => {
  const [code, setCode] = useState('');

  const handleChange = (text: string) => {
    setCode(text);
    onDataChange({ code: text });
    onStepComplete(text.length > 0);
  };

  return (
    <View className='flex flex-col h-full justify-start items-center'>
      <View className='w-full flex flex-col min-h-[50%] justify-center items-center px-6'>
        <Text className='text-pink-400 text-4xl font-bold pb-4 text-center'>Verify your email</Text>
        <Text className='text-pink-300 font-semibold text-2xl text-center'>
          We've sent a code to your email address. Please enter it below to verify your account.
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        className="flex flex-col justify-center items-center w-4/6"
        style={{ zIndex: 1 }}
      >
        <View className='w-full mb-4'>
          <InputField
            value={code}
            onChangeText={handleChange}
            placeHolder='Your code...'
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyCode;