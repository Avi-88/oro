import Button from 'components/common/Button';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View className='flex flex-col  h-full justify-around items-center'>
      <View className='flex justify-center items-center space-y-2 '>
        <Text className='text-pink-400 text-4xl font-bold'>Hello, meet Enso</Text>
        <Text className='text-pink-300 font-semibold text-2xl'>
          your very own selfcare companion
        </Text>
      </View>
      <View>
        <Button textClassName='text-white font-semibold uppercase' className='bg-pink-400 rounded-full py-4' onPress={() => router.push('/signup')} title='Hi, Enso!'/>
        <Button textClassName='text-pink-300' className='bg-transparent rounded-full py-4' onPress={() => router.push('/login')} title="I have already met Enso"/>
      </View>
    </View>
  );
};

export default WelcomeScreen;
