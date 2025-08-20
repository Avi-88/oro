import Button from 'components/common/Button';
import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';


const WelcomeScreen = () => {
  const router = useRouter();
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(300, [
      
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleAnim, subtitleAnim, buttonsAnim]);

  return (
    <View className='flex flex-col  h-full justify-around items-center'>
      <Animated.View style={{ opacity: titleAnim }} className='flex justify-center items-center space-y-2 '>
        <Text className='text-pink-400 text-4xl font-bold'>Hello, meet Enso</Text>
        <Animated.View style={{ opacity: subtitleAnim }}>
          <Text className='text-pink-300 font-semibold text-2xl'>
            your very own selfcare companion
          </Text>
        </Animated.View>
      </Animated.View>
      <Animated.View style={{ opacity: buttonsAnim, width: '66.6667%' }}>
        <Button textClassName='text-white font-semibold uppercase' className='bg-pink-400 rounded-full py-6' onPress={() => router.push('/signup')} title='Hi, Enso!'/>
        <Button textClassName='text-pink-300' className='bg-transparent rounded-full py-6' onPress={() => router.push('/login')} title="I have already met Enso"/>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;
