
import React from 'react';
import { View, Text } from 'react-native';
import MoodSelector from './MoodSelector';
import MoodSlider from './MoodSlider';

interface Step1Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
}

const Step1 = ({ onDataChange, data, onStepComplete }: Step1Props) => {

  const handleMoodChange = (mood: string) => {
    onDataChange({ ...data, mood });
    onStepComplete(true);
  }

  return (
    <View className='w-full h-full flex justify-center items-center'>
      <Text className='text-2xl font-bold mb-8'>How are you feeling today?</Text>
      <MoodSlider/>
    </View>
  );
};

export default Step1;
