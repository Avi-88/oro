import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface Step2Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean; // Added isActive prop
}

const Step2 = ({ onDataChange, data, onStepComplete, isActive }: Step2Props) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
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

  const getDynamicQuestion = () => {
    const mood = data.mood;
    switch (mood) {
      case 'Really Bad':
      case 'Bad':
        return "Oh no, that's terrible. What's got you feeling that way?";
      case 'Okay':
        return "Glad to hear things are okay. What's contributing to that feeling?";
      case 'Good':
      case 'Really Good':
        return "That's great to hear! What's making you feel so good?";
      default:
        return "What's the reason for you feeling this way?";
    }
  };

  const reasons = ['Work', 'Relationship', 'Exercise', 'Weather', 'Family', 'Friends', 'Health', 'Travel', 'Hobbies', 'Other'];

  const handleReasonSelect = (reason: string) => {
    let newSelectedReasons;
    if (selectedReasons.includes(reason)) {
      newSelectedReasons = selectedReasons.filter((r) => r !== reason);
    } else {
      newSelectedReasons = [...selectedReasons, reason];
    }
    setSelectedReasons(newSelectedReasons);
    onDataChange({ ...data, reasons: newSelectedReasons });
    onStepComplete(newSelectedReasons.length > 0);
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center p-4'
      style={{ opacity: fadeAnim }} // Apply animated opacity
    >
      <Text className='text-pink-400 text-center text-3xl font-bold mb-8'>{getDynamicQuestion()}</Text>
      <View className='flex flex-row flex-wrap justify-center'>
        {reasons.map((reason) => (
          <TouchableOpacity
            key={reason}
            onPress={() => handleReasonSelect(reason)}
            className={`p-3 m-2 rounded-full ${selectedReasons.includes(reason) ? 'bg-pink-500' : 'bg-pink-300'}`}
          >
            <Text className={`text-white font-bold ${selectedReasons.includes(reason) ? 'text-lg' : 'text-base'}`}>{reason}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default Step2;