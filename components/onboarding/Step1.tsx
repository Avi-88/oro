import Button from 'components/common/Button';
import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from 'components/common/InputField';

interface Step1Props {
  onDataChange: (data: { [key: string]: any }) => void;
  onStepComplete: (isComplete: boolean) => void;
}

const Step1 = ({ onDataChange, onStepComplete }: Step1Props) => {

  const [nickName, setNickName] = useState<string>("");
  const router = useRouter();

  const handleChange = (text: string) => {
    setNickName(text);
    onDataChange({ nickName: text });
    onStepComplete(text.length > 0);
  }

  return (
    <View className='flex flex-col  h-full justify-start items-center'>
      <View className='w-full flex flex-col  min-h-[50%] justify-center items-center'>
        <Text className='text-pink-400 text-4xl font-bold pb-4'>Pleased to meet you!</Text>
        <Text className='text-pink-300 font-semibold text-2xl'>
          what do your friends call you by ?
        </Text>
      </View>
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          className="flex felx-col justify-center itemwadbjhbds-center w-4/6"
          style={{ zIndex: 1 }}
        >
          <InputField value={nickName} onChangeText={handleChange} charLimit={20} placeHolder='Your nickname...'/>
        </KeyboardAvoidingView>
    </View>
  );
};

export default Step1;