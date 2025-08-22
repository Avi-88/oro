import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface Step3Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean; // Added isActive prop
}

const Step3 = ({ onDataChange, data, onStepComplete, isActive }: Step3Props) => {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
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

  const feelings = [
    'Happy', 'Sad', 'Anxious', 'Excited', 'Calm', 'Stressed', 
    'Grateful', 'Tired', 'Energetic', 'Confused', 'Angry', 'Hopeful',
    'Relaxed', 'Motivated', 'Overwhelmed', 'Content', 'Lonely', 'Inspired'
  ];

  const handleFeelingSelect = (feeling: string) => {
    let newSelectedFeelings;
    if (selectedFeelings.includes(feeling)) {
      newSelectedFeelings = selectedFeelings.filter((f) => f !== feeling);
    } else {
      newSelectedFeelings = [...selectedFeelings, feeling];
    }
    setSelectedFeelings(newSelectedFeelings);
    onDataChange({ ...data, feelings: newSelectedFeelings });
    onStepComplete(newSelectedFeelings.length > 0);
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center p-4'
      style={{ opacity: fadeAnim }} // Apply animated opacity
    >
      <Text className='text-pink-400 text-center text-3xl font-bold mb-8'>What other feelings are you experiencing?</Text>
      <View className='flex flex-row flex-wrap justify-center'>
        {feelings.map((feeling) => (
          <TouchableOpacity
            key={feeling}
            onPress={() => handleFeelingSelect(feeling)}
            className={`p-3 m-2 rounded-full ${selectedFeelings.includes(feeling) ? 'bg-pink-500' : 'bg-pink-300'}`}
          >
            <Text className={`text-white font-bold ${selectedFeelings.includes(feeling) ? 'text-lg' : 'text-base'}`}>{feeling}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default Step3;