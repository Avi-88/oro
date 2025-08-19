import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import InputField from 'components/common/InputField';

interface Step3Props {
  onDataChange: (data: { [key: string]: any }) => void;
  onStepComplete: (isComplete: boolean) => void;
}

const Step3 = ({ onDataChange, onStepComplete }: Step3Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onDataChange({ email: text, password });
    onStepComplete(text.length > 0 && password.length > 0);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    onDataChange({ email, password: text });
    onStepComplete(email.length > 0 && text.length > 0);
  };

  return (
    <View className='flex flex-col h-full justify-start items-center'>
      <View className='w-full flex flex-col min-h-[50%] justify-center items-center px-4'>
        <Text className='text-pink-400 text-4xl font-bold pb-4 text-center'>You're almost set!</Text>
        <Text className='text-pink-300 font-semibold text-2xl text-center'>
          Lets create your account so you can start your journey with Enso.
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
            value={email}
            onChangeText={handleEmailChange}
            placeHolder='Your email...'
          />
        </View>
        <View className='w-full'>
          <InputField
            value={password}
            onChangeText={handlePasswordChange}
            placeHolder='Your password...'
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Step3;