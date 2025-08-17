import Button from 'components/common/Button';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from 'components/common/InputField';


const Step1 = () => {
  const router = useRouter();

  return (
    <View className='flex flex-col  h-full justify-around items-center'>
      <View className='w-full flex justify-center items-center'>
        <Text className='text-pink-400 text-4xl font-bold pb-4'>Pleased to meet you!</Text>
        <Text className='text-pink-300 font-semibold text-2xl'>
          what do your friends call you by ?
        </Text>
      </View>
      <View className='flex flex-col justify-center w-4/6 items-center space-y-4'>
          <InputField placeHolder='Your nickname...'/>
      </View>
    </View>
  );
};

export default Step1;