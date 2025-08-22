import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import ArcSlider from './MoodSlider';

interface Step1Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean; // Added isActive prop
}

const Step1 = ({ onDataChange, data, onStepComplete, isActive }: Step1Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    if (isActive) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Fade in duration
        delay: 200, // Slight delay
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0); // Reset opacity when not active
    }
  }, [isActive, fadeAnim]);

  const moodSteps = [
    { emoji: '😭', label: 'Really Bad', color: "#f9a8d4" },
    { emoji: '😞', label: 'Bad', color: "#f9a8d4" },
    { emoji: '😐', label: 'Okay', color: "#f9a8d4" },
    { emoji: '😊', label: 'Good', color: "#f9a8d4" },
    { emoji: '😄', label: 'Really Good', color: "#f9a8d4" }
  ];

  const handleStepChange = (step) => {
    console.log('Current mood:', step?.label);
    onDataChange({...data, mood: step.label})
    onStepComplete(step)
  };

  return (
    <Animated.View 
      className='w-full relative h-full flex justify-center items-center'
      style={{ opacity: fadeAnim }} // Apply animated opacity
    >
      <Text className='text-pink-400 px-6  text-center text-4xl font-bold pb-4 absolute top-12'>How are you feeling today?</Text>
      <ArcSlider
        steps={moodSteps}
        onStepChange={handleStepChange}
        initialStep={2} // Start at "Okay"
        title="How are you feeling?"
        showLabels={true}
        showCurrentDisplay={true}
      />
    </Animated.View>
  );
};

export default Step1;