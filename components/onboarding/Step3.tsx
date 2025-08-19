import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

interface Step3Props {
  onStepComplete: (isComplete: boolean) => void;
}

const Step3 = ({ onStepComplete }: Step3Props) => {
  // useEffect(() => {
  //   onStepComplete(true);
  // }, []);

  return (
    <View className='flex flex-col h-full justify-center items-center px-4'>
      <Text className='text-pink-400 text-4xl font-bold pb-4 text-center'>You're all set!</Text>
      <Text className='text-pink-300 font-semibold text-2xl text-center'>
        You can now start your journey with Oro.
      </Text>
    </View>
  );
};

export default Step3;